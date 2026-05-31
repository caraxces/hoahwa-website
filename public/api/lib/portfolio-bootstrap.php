<?php
declare(strict_types=1);

function portfolio_bootstrap(): array
{
    static $booted = false;
    static $config;

    if ($booted) {
        return ['config' => $config, 'pdo' => portfolio_pdo($config)];
    }

    $configPath = __DIR__ . '/../config.php';
    if (!is_readable($configPath)) {
        http_response_code(503);
        echo json_encode(['ok' => false, 'error' => 'API is not configured.']);
        exit;
    }

    /** @var array{db_host:string,db_name:string,db_user:string,db_pass:string,allowed_origins?:string[]} $config */
    $config = require $configPath;
    $booted = true;

    portfolio_send_cors($config);

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }

    header('Content-Type: application/json; charset=utf-8');

    $pdo = portfolio_pdo($config);
    portfolio_migrate($pdo);
    portfolio_ensure_demo_user($pdo);

    return ['config' => $config, 'pdo' => $pdo];
}

function portfolio_pdo(array $config): PDO
{
    $dsn = sprintf(
        'mysql:host=%s;dbname=%s;charset=utf8mb4',
        $config['db_host'],
        $config['db_name']
    );
    return new PDO($dsn, $config['db_user'], $config['db_pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
}

function portfolio_send_cors(array $config): void
{
    $allowedOrigins = $config['allowed_origins'] ?? ['https://hoahwa.com'];
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin !== '' && in_array($origin, $allowedOrigins, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
    }
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
}

function portfolio_migrate(PDO $pdo): void
{
    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS portfolio_users (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(64) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            full_name VARCHAR(255) NOT NULL,
            whatsapp VARCHAR(32) NOT NULL,
            privacy_accepted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_username (username)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );

    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS portfolio_sessions (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            user_id INT UNSIGNED NOT NULL,
            token_hash CHAR(64) NOT NULL UNIQUE,
            expires_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_user_id (user_id),
            INDEX idx_expires_at (expires_at),
            CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES portfolio_users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );

    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS portfolio_password_tickets (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            user_id INT UNSIGNED NULL,
            username VARCHAR(64) NOT NULL,
            whatsapp VARCHAR(32) NOT NULL,
            note TEXT NULL,
            status ENUM("open","closed") NOT NULL DEFAULT "open",
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_status (status),
            INDEX idx_username (username)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );

    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS portfolio_pages (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            user_id INT UNSIGNED NOT NULL,
            slug VARCHAR(64) NOT NULL UNIQUE,
            title VARCHAR(255) NOT NULL,
            config_json LONGTEXT NOT NULL,
            status ENUM("draft","published") NOT NULL DEFAULT "draft",
            expires_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            published_at TIMESTAMP NULL,
            INDEX idx_user_id (user_id),
            INDEX idx_expires_at (expires_at),
            INDEX idx_status (status),
            CONSTRAINT fk_pages_user FOREIGN KEY (user_id) REFERENCES portfolio_users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );
}

function portfolio_read_json(): array
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw ?: '', true);
    return is_array($data) ? $data : [];
}

function portfolio_field(array $data, string $key): string
{
    return trim((string) ($data[$key] ?? ''));
}

function portfolio_json_ok(array $payload, int $code = 200): void
{
    http_response_code($code);
    echo json_encode(array_merge(['ok' => true], $payload));
    exit;
}

function portfolio_json_error(string $message, int $code = 400): void
{
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $message]);
    exit;
}

function portfolio_create_token(PDO $pdo, int $userId): string
{
    $token = bin2hex(random_bytes(32));
    $hash = hash('sha256', $token);
    $stmt = $pdo->prepare(
        'INSERT INTO portfolio_sessions (user_id, token_hash, expires_at)
         VALUES (:user_id, :token_hash, DATE_ADD(NOW(), INTERVAL 30 DAY))'
    );
    $stmt->execute([':user_id' => $userId, ':token_hash' => $hash]);
    return $token;
}

function portfolio_auth_user(PDO $pdo): array
{
    $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!preg_match('/^Bearer\s+(.+)$/i', $auth, $m)) {
        portfolio_json_error('Unauthorized.', 401);
    }
    $hash = hash('sha256', trim($m[1]));
    $stmt = $pdo->prepare(
        'SELECT u.id, u.username, u.full_name, u.whatsapp
         FROM portfolio_sessions s
         JOIN portfolio_users u ON u.id = s.user_id
         WHERE s.token_hash = :hash AND s.expires_at > NOW()
         LIMIT 1'
    );
    $stmt->execute([':hash' => $hash]);
    $user = $stmt->fetch();
    if (!$user) {
        portfolio_json_error('Session expired. Please sign in again.', 401);
    }
    return $user;
}

function portfolio_slugify(string $value): string
{
    $value = strtolower(trim($value));
    $value = preg_replace('/[^a-z0-9-]+/', '-', $value) ?? '';
    $value = trim($value, '-');
    return substr($value, 0, 64);
}

function portfolio_ensure_demo_user(PDO $pdo): void
{
    $username = 'demo';
    $stmt = $pdo->prepare('SELECT id FROM portfolio_users WHERE username = :username LIMIT 1');
    $stmt->execute([':username' => $username]);
    if ($stmt->fetch()) {
        return;
    }

    $stmt = $pdo->prepare(
        'INSERT INTO portfolio_users (username, password_hash, full_name, whatsapp)
         VALUES (:username, :password_hash, :full_name, :whatsapp)'
    );
    $stmt->execute([
        ':username' => $username,
        ':password_hash' => password_hash('Doona!01', PASSWORD_DEFAULT),
        ':full_name' => 'Hoahwa Demo',
        ':whatsapp' => '+84924769556',
    ]);
}
