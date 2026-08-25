<?php
declare(strict_types=1);

function short_links_config(): ?array
{
    static $config = false;
    if ($config !== false) {
        return $config;
    }

    $configPath = __DIR__ . '/../config.php';
    if (!is_readable($configPath)) {
        $config = null;
        return null;
    }

    /** @var array{db_host:string,db_name:string,db_user:string,db_pass:string,allowed_origins?:string[],site_url?:string} $loaded */
    $loaded = require $configPath;
    $config = $loaded;
    return $config;
}

function short_links_pdo(array $config): PDO
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

function short_links_migrate(PDO $pdo): void
{
    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS short_links (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            code VARCHAR(16) NOT NULL UNIQUE,
            target_url VARCHAR(2048) NOT NULL,
            season VARCHAR(16) NOT NULL DEFAULT "spring",
            palette VARCHAR(16) NOT NULL DEFAULT "gold",
            hits INT UNSIGNED NOT NULL DEFAULT 0,
            ip_address VARCHAR(45) NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_code (code),
            INDEX idx_ip_created (ip_address, created_at),
            INDEX idx_target (target_url(191))
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );
}

function short_links_site_url(array $config): string
{
    $url = trim((string) ($config['site_url'] ?? 'https://hoahwa.com'));
    return rtrim($url !== '' ? $url : 'https://hoahwa.com', '/');
}

function short_links_public_url(array $config, string $code): string
{
    return short_links_site_url($config) . '/r/' . $code;
}

function short_links_client_ip(): string
{
    $candidates = [];
    $forwarded = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
    if (is_string($forwarded) && $forwarded !== '') {
        $candidates[] = trim(explode(',', $forwarded)[0]);
    }
    $candidates[] = (string) ($_SERVER['REMOTE_ADDR'] ?? '');

    foreach ($candidates as $ip) {
        if (filter_var($ip, FILTER_VALIDATE_IP)) {
            return $ip;
        }
    }
    return '';
}

function short_links_send_cors(array $config): void
{
    $allowedOrigins = $config['allowed_origins'] ?? ['https://hoahwa.com'];
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin !== '' && in_array($origin, $allowedOrigins, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
    }
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}

/**
 * @return array{ok:true,url:string}|array{ok:false,error:string}
 */
function short_links_normalize_url(string $raw): array
{
    $url = trim($raw);
    if ($url === '') {
        return ['ok' => false, 'error' => 'URL is required.'];
    }
    if (strlen($url) > 2048) {
        return ['ok' => false, 'error' => 'URL is too long.'];
    }
    if (!preg_match('#^[a-z][a-z0-9+.-]*://#i', $url)) {
        $url = 'https://' . $url;
    }

    $parts = parse_url($url);
    if ($parts === false || empty($parts['scheme']) || empty($parts['host'])) {
        return ['ok' => false, 'error' => 'Enter a valid http(s) URL.'];
    }

    $scheme = strtolower((string) $parts['scheme']);
    if ($scheme !== 'http' && $scheme !== 'https') {
        return ['ok' => false, 'error' => 'Only http and https URLs are allowed.'];
    }

    $host = strtolower((string) $parts['host']);
    if ($host === 'localhost' || $host === '::1' || substr($host, -10) === '.localhost') {
        return ['ok' => false, 'error' => 'Private or local destinations are not allowed.'];
    }

    $ip = filter_var($host, FILTER_VALIDATE_IP);
    if ($ip !== false) {
        $flags = FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE;
        if (!filter_var($ip, FILTER_VALIDATE_IP, $flags)) {
            return ['ok' => false, 'error' => 'Private or local destinations are not allowed.'];
        }
    }

    $rebuilt = $scheme . '://' . $host;
    if (isset($parts['port'])) {
        $rebuilt .= ':' . $parts['port'];
    }
    $rebuilt .= $parts['path'] ?? '';
    if (isset($parts['query'])) {
        $rebuilt .= '?' . $parts['query'];
    }
    if (isset($parts['fragment'])) {
        $rebuilt .= '#' . $parts['fragment'];
    }

    if (strpbrk($rebuilt, "\r\n") !== false) {
        return ['ok' => false, 'error' => 'Enter a valid http(s) URL.'];
    }

    return ['ok' => true, 'url' => $rebuilt];
}

function short_links_sanitize_season(string $value): string
{
    $value = strtolower(trim($value));
    return in_array($value, ['spring', 'summer', 'autumn'], true) ? $value : 'spring';
}

function short_links_sanitize_palette(string $value): string
{
    $value = strtolower(trim($value));
    return in_array($value, ['gold', 'lavender', 'coral', 'sky', 'snow'], true) ? $value : 'gold';
}

function short_links_generate_code(PDO $pdo): string
{
    $alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    $alphaLen = strlen($alphabet);

    for ($attempt = 0; $attempt < 12; $attempt++) {
        $code = '';
        for ($i = 0; $i < 6; $i++) {
            $code .= $alphabet[random_int(0, $alphaLen - 1)];
        }
        $stmt = $pdo->prepare('SELECT id FROM short_links WHERE code = :code LIMIT 1');
        $stmt->execute([':code' => $code]);
        if (!$stmt->fetch()) {
            return $code;
        }
    }

    throw new RuntimeException('Could not allocate a short code.');
}

function short_links_json_ok(array $payload, int $code = 200): void
{
    http_response_code($code);
    echo json_encode(array_merge(['ok' => true], $payload), JSON_UNESCAPED_SLASHES);
    exit;
}

function short_links_json_error(string $message, int $code = 400): void
{
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $message]);
    exit;
}
