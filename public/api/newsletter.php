<?php
declare(strict_types=1);

/**
 * Newsletter subscription endpoint.
 *
 * Mirrors contact.php: same config file, same CORS allowlist, same JSON shape
 * ({ok: true} / {ok: false, error: string}). Re-subscribing an existing address
 * is treated as success rather than an error — the caller should not be able to
 * probe which addresses are already on the list.
 */

header('Content-Type: application/json; charset=utf-8');

$configPath = __DIR__ . '/config.php';
if (!is_readable($configPath)) {
    http_response_code(503);
    echo json_encode(['ok' => false, 'error' => 'Newsletter API is not configured.']);
    exit;
}

/** @var array{db_host:string,db_name:string,db_user:string,db_pass:string,allowed_origins?:string[]} $config */
$config = require $configPath;

$allowedOrigins = $config['allowed_origins'] ?? ['https://hoahwa.com'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed.']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw ?: '', true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid JSON body.']);
    exit;
}

$email = trim((string) ($data['email'] ?? ''));
$source = trim((string) ($data['source'] ?? 'footer'));

// Honeypot: real users never fill this hidden field; bots usually do.
if (trim((string) ($data['website'] ?? '')) !== '') {
    echo json_encode(['ok' => true]);
    exit;
}

if ($email === '') {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Email address is required.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 255) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Please enter a valid email address.']);
    exit;
}

try {
    $dsn = sprintf(
        'mysql:host=%s;dbname=%s;charset=utf8mb4',
        $config['db_host'],
        $config['db_name']
    );
    $pdo = new PDO($dsn, $config['db_user'], $config['db_pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS newsletter_subscribers (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            source VARCHAR(64) NOT NULL DEFAULT "footer",
            status VARCHAR(32) NOT NULL DEFAULT "subscribed",
            ip_address VARCHAR(45) NULL,
            user_agent VARCHAR(512) NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            unsubscribed_at TIMESTAMP NULL DEFAULT NULL,
            UNIQUE KEY uq_email (email),
            INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );

    // Re-subscribing an address that previously opted out reactivates it.
    $stmt = $pdo->prepare(
        'INSERT INTO newsletter_subscribers (email, source, ip_address, user_agent)
         VALUES (:email, :source, :ip_address, :user_agent)
         ON DUPLICATE KEY UPDATE
            status = "subscribed",
            unsubscribed_at = NULL'
    );

    $stmt->execute([
        ':email' => $email,
        ':source' => substr($source !== '' ? $source : 'footer', 0, 64),
        ':ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
        ':user_agent' => isset($_SERVER['HTTP_USER_AGENT'])
            ? substr((string) $_SERVER['HTTP_USER_AGENT'], 0, 512)
            : null,
    ]);

    echo json_encode(['ok' => true]);
} catch (Throwable $e) {
    error_log('[newsletter] ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Could not save your address. Please try again.']);
}
