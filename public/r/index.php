<?php
declare(strict_types=1);

require dirname(__DIR__) . '/api/lib/short-links-bootstrap.php';

$code = preg_replace('/[^A-Za-z0-9]/', '', (string) ($_GET['code'] ?? '')) ?? '';

$config = short_links_config();
if ($config === null) {
    http_response_code(503);
    header('Content-Type: text/html; charset=utf-8');
    echo '<!doctype html><meta charset="utf-8"><title>Link unavailable</title>'
        . '<body style="font-family:Georgia,serif;background:#151515;color:#fffdfa;padding:48px">'
        . '<p>This grove is resting. Try again shortly.</p>'
        . '<p><a href="/tree/" style="color:#cd9d65">Plant a new link</a></p>';
    exit;
}

try {
    $pdo = short_links_pdo($config);
    short_links_migrate($pdo);
} catch (Throwable $e) {
    http_response_code(503);
    header('Content-Type: text/html; charset=utf-8');
    echo '<!doctype html><meta charset="utf-8"><title>Link unavailable</title>'
        . '<body style="font-family:Georgia,serif;background:#151515;color:#fffdfa;padding:48px">'
        . '<p>This grove is resting. Try again shortly.</p>'
        . '<p><a href="/tree/" style="color:#cd9d65">Plant a new link</a></p>';
    exit;
}

if (strlen($code) < 4 || strlen($code) > 16) {
    header('Location: /tree/', true, 302);
    exit;
}

$stmt = $pdo->prepare('SELECT target_url FROM short_links WHERE code = :code LIMIT 1');
$stmt->execute([':code' => $code]);
$row = $stmt->fetch();

if (!$row) {
    http_response_code(404);
    header('Content-Type: text/html; charset=utf-8');
    echo '<!doctype html><meta charset="utf-8"><title>Link not found</title>'
        . '<body style="font-family:Georgia,serif;background:#151515;color:#fffdfa;padding:48px">'
        . '<p>This short grove has no destination.</p>'
        . '<p><a href="/tree/" style="color:#cd9d65">Grow a new Tree QR</a></p>';
    exit;
}

$target = (string) $row['target_url'];
if ($target === '' || strpbrk($target, "\r\n") !== false) {
    http_response_code(404);
    exit;
}

$hit = $pdo->prepare('UPDATE short_links SET hits = hits + 1 WHERE code = :code');
$hit->execute([':code' => $code]);

header('Cache-Control: no-store');
header('Location: ' . $target, true, 302);
exit;
