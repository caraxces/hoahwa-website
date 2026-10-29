<?php
/**
 * HoaHwa Links API.
 *   POST {url, title?, category?, alias?, season?, palette?} → create (or reuse today's) link
 *   GET  ?code=XXXX                       → one link with 14-day clicks, referrers, devices
 *   GET  ?market=1&category=&sort=hits|new&limit= → the tree market (public list)
 *   GET  ?categories=1                    → categories with link and click totals
 */
declare(strict_types=1);

require __DIR__ . '/lib/short-links-bootstrap.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$config = short_links_config();
if ($config === null) {
    short_links_json_error('API is not configured.', 503);
}
short_links_send_cors($config);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

try {
    $pdo = short_links_pdo($config);
    short_links_migrate($pdo);
} catch (Throwable $e) {
    short_links_json_error('The link database is unavailable.', 503);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['categories'])) {
        $stmt = $pdo->query('SELECT category, COUNT(*) AS links, COALESCE(SUM(hits), 0) AS hits FROM short_links GROUP BY category');
        $rows = [];
        foreach ($stmt->fetchAll() as $r) {
            $rows[(string) $r['category']] = ['category' => $r['category'], 'links' => (int) $r['links'], 'hits' => (int) $r['hits']];
        }
        $out = [];
        foreach (SHORT_LINKS_CATEGORIES as $c) {
            $out[] = $rows[$c] ?? ['category' => $c, 'links' => 0, 'hits' => 0];
        }
        short_links_json_ok(['categories' => $out]);
    }
    if (isset($_GET['market'])) {
        $category = short_links_sanitize_choice((string) ($_GET['category'] ?? ''), SHORT_LINKS_CATEGORIES, '');
        $sort = ($_GET['sort'] ?? 'hits') === 'new' ? 'created_at DESC' : 'hits DESC, created_at DESC';
        $limit = max(1, min(60, (int) ($_GET['limit'] ?? 24)));
        $sql = 'SELECT * FROM short_links' . ($category !== '' ? ' WHERE category = :category' : '') . ' ORDER BY ' . $sort . ' LIMIT ' . $limit;
        $stmt = $pdo->prepare($sql);
        $stmt->execute($category !== '' ? [':category' => $category] : []);
        $trees = array_map(fn ($row) => short_links_record($pdo, $config, $row), $stmt->fetchAll());
        $totals = $pdo->query('SELECT COUNT(*) AS links, COALESCE(SUM(hits), 0) AS hits FROM short_links')->fetch();
        short_links_json_ok(['trees' => $trees, 'category' => $category !== '' ? $category : null, 'totals' => ['links' => (int) $totals['links'], 'hits' => (int) $totals['hits']]]);
    }
    $code = preg_replace('/[^A-Za-z0-9]/', '', (string) ($_GET['code'] ?? '')) ?? '';
    if (strlen($code) < 4 || strlen($code) > 16) {
        short_links_json_error('Missing short code.', 400);
    }
    $stmt = $pdo->prepare('SELECT * FROM short_links WHERE code = :code LIMIT 1');
    $stmt->execute([':code' => $code]);
    $row = $stmt->fetch();
    if (!$row) {
        short_links_json_error('Short link not found.', 404);
    }
    short_links_json_ok(short_links_record($pdo, $config, $row, true));
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    short_links_json_error('Method not allowed.', 405);
}

// Accept both a JSON body and a normal form post: proxies and WAFs pass form data through untouched.
$data = $_POST;
if (!$data) {
    $raw = file_get_contents('php://input');
    $decoded = json_decode($raw ?: '', true);
    if (is_array($decoded)) {
        $data = $decoded;
    } elseif (is_string($raw) && $raw !== '') {
        parse_str($raw, $parsed);
        $data = is_array($parsed) ? $parsed : [];
    }
}
if (!is_array($data) || !isset($data['url'])) {
    short_links_json_error('Send a url field (form or JSON).');
}

$normalized = short_links_normalize_url((string) ($data['url'] ?? ''));
if ($normalized['ok'] !== true) {
    short_links_json_error((string) ($normalized['error'] ?? 'Enter a valid http(s) URL.'));
}
$targetUrl = (string) $normalized['url'];
$siteHost = short_links_referrer_host(short_links_site_url($config));
if (short_links_referrer_host($targetUrl) === $siteHost
    && preg_match('#^https?://[^/]+/([A-Za-z0-9]{4,16})/?$#', $targetUrl, $match)
    && !in_array(strtolower($match[1]), SHORT_LINKS_RESERVED, true)) {
    short_links_json_error('That is already a HoaHwa short link.');
}

$season = short_links_sanitize_choice((string) ($data['season'] ?? 'spring'), SHORT_LINKS_SEASONS, 'spring');
$palette = short_links_sanitize_choice((string) ($data['palette'] ?? 'gold'), SHORT_LINKS_PALETTES, 'gold');
$category = short_links_sanitize_choice((string) ($data['category'] ?? 'general'), SHORT_LINKS_CATEGORIES, 'general');
$title = short_links_sanitize_title((string) ($data['title'] ?? ''));
$alias = trim((string) ($data['alias'] ?? ''));
$ip = short_links_client_ip();

$rateStmt = $pdo->prepare('SELECT COUNT(*) AS n FROM short_links WHERE ip_address = :ip AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)');
$rateStmt->execute([':ip' => $ip]);
if ($ip !== '' && (int) ($rateStmt->fetch()['n'] ?? 0) >= 30) {
    short_links_json_error('Too many links from this network. Try again in an hour.', 429);
}

$existing = null;
if ($alias === '') {
    $existingStmt = $pdo->prepare('SELECT * FROM short_links WHERE target_url = :url AND ip_address = :ip AND created_at > DATE_SUB(NOW(), INTERVAL 1 DAY) ORDER BY id DESC LIMIT 1');
    $existingStmt->execute([':url' => $targetUrl, ':ip' => $ip]);
    $existing = $existingStmt->fetch() ?: null;
}

if ($existing) {
    $update = $pdo->prepare('UPDATE short_links SET season = :season, palette = :palette, category = :category, title = :title WHERE id = :id');
    $update->execute([':season' => $season, ':palette' => $palette, ':category' => $category, ':title' => $title, ':id' => (int) $existing['id']]);
    $code = (string) $existing['code'];
} else {
    if ($alias !== '') {
        $aliasError = short_links_validate_alias($pdo, $alias);
        if ($aliasError !== null) {
            short_links_json_error($aliasError, 409);
        }
        $code = $alias;
    } else {
        $code = short_links_generate_code($pdo);
    }
    $insert = $pdo->prepare('INSERT INTO short_links (code, target_url, title, category, season, palette, ip_address) VALUES (:code, :target_url, :title, :category, :season, :palette, :ip)');
    $insert->execute([':code' => $code, ':target_url' => $targetUrl, ':title' => $title, ':category' => $category, ':season' => $season, ':palette' => $palette, ':ip' => $ip !== '' ? $ip : null]);
}

$stmt = $pdo->prepare('SELECT * FROM short_links WHERE code = :code LIMIT 1');
$stmt->execute([':code' => $code]);
short_links_json_ok(short_links_record($pdo, $config, $stmt->fetch(), true), $existing ? 200 : 201);
