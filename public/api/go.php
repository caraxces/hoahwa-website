<?php
/**
 * HoaHwa Links redirector: hoahwa.com/<code> → target (302), counting the click.
 * Reached through the .htaccess rule for 4–16 character root paths that are not files or folders.
 */
declare(strict_types=1);

require __DIR__ . '/lib/short-links-bootstrap.php';

function short_links_page(int $status, string $title, string $message): void
{
    http_response_code($status);
    header('Content-Type: text/html; charset=utf-8');
    header('Cache-Control: no-store');
    $safeTitle = htmlspecialchars($title, ENT_QUOTES, 'UTF-8');
    $safeMessage = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
    echo '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>' . $safeTitle . ' · HoaHwa Links</title>'
        . '<body style="margin:0;min-height:100vh;display:grid;place-items:center;font-family:Georgia,serif;background:#151515;color:#fffdfa;padding:24px;text-align:center">'
        . '<div><p style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#cd9d65;margin:0 0 12px">HoaHwa Links</p>'
        . '<h1 style="font-weight:400;font-size:28px;margin:0 0 12px">' . $safeTitle . '</h1><p style="color:#bfb8ae;max-width:36ch;margin:0 auto 24px">' . $safeMessage . '</p>'
        . '<a href="/tree/" style="color:#cd9d65;text-decoration:none;border:1px solid #cd9d6566;border-radius:999px;padding:10px 18px">Plant your own link</a></div></body></html>';
    exit;
}

$code = preg_replace('/[^A-Za-z0-9]/', '', (string) ($_GET['code'] ?? '')) ?? '';
if (strlen($code) < 4 || strlen($code) > 16) {
    header('Location: /tree/', true, 302);
    exit;
}

$config = short_links_config();
if ($config === null) {
    short_links_page(503, 'This grove is resting', 'The link service is not configured yet. Try again shortly.');
}

try {
    $pdo = short_links_pdo($config);
    short_links_migrate($pdo);
    $stmt = $pdo->prepare('SELECT id, target_url FROM short_links WHERE code = :code LIMIT 1');
    $stmt->execute([':code' => $code]);
    $row = $stmt->fetch();
} catch (Throwable $e) {
    short_links_page(503, 'This grove is resting', 'The link database is unavailable. Try again shortly.');
}

if (!$row) {
    short_links_page(404, 'No tree grows here', 'This short link has no destination. Check the code or plant a new one.');
}

$target = (string) $row['target_url'];
if ($target === '' || strpbrk($target, "\r\n") !== false || !preg_match('#^https?://#i', $target)) {
    short_links_page(404, 'No tree grows here', 'This short link has no valid destination.');
}

try {
    $device = short_links_device((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''));
    $referrer = short_links_referrer_host((string) ($_SERVER['HTTP_REFERER'] ?? ''));
    $pdo->beginTransaction();
    if ($device !== 'bot') {
        $hit = $pdo->prepare('UPDATE short_links SET hits = hits + 1, last_hit_at = NOW() WHERE id = :id');
        $hit->execute([':id' => (int) $row['id']]);
    }
    $click = $pdo->prepare('INSERT INTO short_link_clicks (link_id, day, referrer_host, device, count) VALUES (:id, CURDATE(), :ref, :device, 1) ON DUPLICATE KEY UPDATE count = count + 1');
    $click->execute([':id' => (int) $row['id'], ':ref' => $referrer, ':device' => $device]);
    $pdo->commit();
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
}

header('Cache-Control: no-store');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Location: ' . $target, true, 302);
exit;
