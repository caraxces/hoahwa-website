<?php
declare(strict_types=1);

require __DIR__ . '/lib/short-links-bootstrap.php';

$config = short_links_config();
if ($config === null) {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(503);
    echo json_encode(['ok' => false, 'error' => 'API is not configured.']);
    exit;
}
short_links_send_cors($config);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

header('Content-Type: application/json; charset=utf-8');

$pdo = short_links_pdo($config);
short_links_migrate($pdo);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $code = preg_replace('/[^A-Za-z0-9]/', '', (string) ($_GET['code'] ?? '')) ?? '';
    if (strlen($code) < 4 || strlen($code) > 16) {
        short_links_json_error('Missing short code.', 400);
    }

    $stmt = $pdo->prepare(
        'SELECT code, season, palette FROM short_links WHERE code = :code LIMIT 1'
    );
    $stmt->execute([':code' => $code]);
    $row = $stmt->fetch();
    if (!$row) {
        short_links_json_error('Short link not found.', 404);
    }

    short_links_json_ok([
        'code' => $row['code'],
        'season' => $row['season'],
        'palette' => $row['palette'],
        'shortUrl' => short_links_public_url($config, (string) $row['code']),
    ]);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    short_links_json_error('Method not allowed.', 405);
}

$raw = file_get_contents('php://input');
$data = json_decode($raw ?: '', true);
if (!is_array($data)) {
    short_links_json_error('Invalid JSON body.');
}

$normalized = short_links_normalize_url(trim((string) ($data['url'] ?? '')));
if ($normalized['ok'] !== true) {
    short_links_json_error((string) ($normalized['error'] ?? 'Enter a valid http(s) URL.'));
}

$targetUrl = (string) ($normalized['url'] ?? '');
if ($targetUrl === '') {
    short_links_json_error('Enter a valid http(s) URL.');
}

$season = short_links_sanitize_season((string) ($data['season'] ?? 'spring'));
$palette = short_links_sanitize_palette((string) ($data['palette'] ?? 'gold'));
$ip = short_links_client_ip();

$rateStmt = $pdo->prepare(
    'SELECT COUNT(*) AS n FROM short_links
     WHERE ip_address = :ip AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)'
);
$rateStmt->execute([':ip' => $ip]);
$rate = $rateStmt->fetch();
if ($ip !== '' && (int) ($rate['n'] ?? 0) >= 20) {
    short_links_json_error('Too many short links from this network. Try again later.', 429);
}

$existingStmt = $pdo->prepare(
    'SELECT code FROM short_links
     WHERE target_url = :url AND ip_address = :ip AND created_at > DATE_SUB(NOW(), INTERVAL 1 DAY)
     ORDER BY id DESC LIMIT 1'
);
$existingStmt->execute([':url' => $targetUrl, ':ip' => $ip]);
$existing = $existingStmt->fetch();

$code = '';
if ($existing) {
    $code = (string) $existing['code'];
    $update = $pdo->prepare(
        'UPDATE short_links SET season = :season, palette = :palette WHERE code = :code'
    );
    $update->execute([
        ':season' => $season,
        ':palette' => $palette,
        ':code' => $code,
    ]);
} else {
    $code = short_links_generate_code($pdo);
    $insert = $pdo->prepare(
        'INSERT INTO short_links (code, target_url, season, palette, ip_address)
         VALUES (:code, :target_url, :season, :palette, :ip)'
    );
    $insert->execute([
        ':code' => $code,
        ':target_url' => $targetUrl,
        ':season' => $season,
        ':palette' => $palette,
        ':ip' => $ip !== '' ? $ip : null,
    ]);
}

short_links_json_ok([
    'code' => $code,
    'season' => $season,
    'palette' => $palette,
    'shortUrl' => short_links_public_url($config, $code),
], $existing ? 200 : 201);
