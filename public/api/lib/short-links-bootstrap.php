<?php
/**
 * HoaHwa Links · shared helpers for the short-link API (short-links.php) and the
 * redirector (go.php). Reads the same config.php as the other PHP endpoints
 * (db_host / db_name / db_user / db_pass / allowed_origins / site_url).
 *
 * Tables (auto-migrated, idempotent):
 *   short_links        one row per link: code, target, category, title, tree look, hits
 *   short_link_clicks  per-day aggregates: link, day, referrer host, device, count
 */
declare(strict_types=1);

const SHORT_LINKS_CATEGORIES = ['general', 'brand', 'shop', 'event', 'music', 'food', 'travel', 'education', 'creator', 'personal'];
const SHORT_LINKS_SEASONS = ['spring', 'summer', 'autumn'];
const SHORT_LINKS_PALETTES = ['gold', 'lavender', 'coral', 'sky', 'snow'];
/** Route names that must never become a short code (site pages live at these paths). */
const SHORT_LINKS_RESERVED = ['about', 'apps', 'audits', 'book', 'blog', 'careers', 'case', 'cases', 'contact', 'demo', 'faq', 'figma', 'help', 'home', 'insights', 'legal', 'login', 'market', 'news', 'portfolio', 'privacy', 'process', 'shop', 'terms', 'tree', 'work', 'admin', 'api', 'assets', 'static', 'logo'];
/** Hits needed to reach each growth stage (index = stage). */
const SHORT_LINKS_STAGES = [
    ['id' => 'seed', 'label' => 'Seed', 'min' => 0],
    ['id' => 'sprout', 'label' => 'Sprout', 'min' => 5],
    ['id' => 'sapling', 'label' => 'Sapling', 'min' => 25],
    ['id' => 'young', 'label' => 'Young tree', 'min' => 100],
    ['id' => 'mature', 'label' => 'Mature tree', 'min' => 500],
    ['id' => 'ancient', 'label' => 'Ancient tree', 'min' => 2000],
];

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
    $loaded = require $configPath;
    $config = is_array($loaded) ? $loaded : null;
    return $config;
}

function short_links_pdo(array $config): PDO
{
    $dsn = sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', $config['db_host'], $config['db_name']);
    return new PDO($dsn, $config['db_user'], $config['db_pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
}

function short_links_column_exists(PDO $pdo, string $table, string $column): bool
{
    $stmt = $pdo->prepare('SELECT COUNT(*) AS n FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = :t AND COLUMN_NAME = :c');
    $stmt->execute([':t' => $table, ':c' => $column]);
    return (int) ($stmt->fetch()['n'] ?? 0) > 0;
}

function short_links_migrate(PDO $pdo): void
{
    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS short_links (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            code VARCHAR(16) NOT NULL UNIQUE,
            target_url VARCHAR(2048) NOT NULL,
            title VARCHAR(120) NULL,
            category VARCHAR(24) NOT NULL DEFAULT "general",
            season VARCHAR(16) NOT NULL DEFAULT "spring",
            palette VARCHAR(16) NOT NULL DEFAULT "gold",
            hits INT UNSIGNED NOT NULL DEFAULT 0,
            last_hit_at TIMESTAMP NULL DEFAULT NULL,
            ip_address VARCHAR(45) NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_ip_created (ip_address, created_at),
            INDEX idx_target (target_url(191)),
            INDEX idx_category_hits (category, hits),
            INDEX idx_hits (hits)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );
    // Columns added after the first release (the original table had none of these).
    foreach ([
        'title' => 'ALTER TABLE short_links ADD COLUMN title VARCHAR(120) NULL AFTER target_url',
        'category' => 'ALTER TABLE short_links ADD COLUMN category VARCHAR(24) NOT NULL DEFAULT "general" AFTER title, ADD INDEX idx_category_hits (category, hits)',
        'last_hit_at' => 'ALTER TABLE short_links ADD COLUMN last_hit_at TIMESTAMP NULL DEFAULT NULL AFTER hits',
    ] as $column => $sql) {
        if (!short_links_column_exists($pdo, 'short_links', $column)) {
            $pdo->exec($sql);
        }
    }
    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS short_link_clicks (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            link_id INT UNSIGNED NOT NULL,
            day DATE NOT NULL,
            referrer_host VARCHAR(120) NOT NULL DEFAULT "",
            device VARCHAR(12) NOT NULL DEFAULT "desktop",
            count INT UNSIGNED NOT NULL DEFAULT 0,
            UNIQUE KEY uq_click (link_id, day, referrer_host, device),
            INDEX idx_link_day (link_id, day),
            CONSTRAINT fk_click_link FOREIGN KEY (link_id) REFERENCES short_links(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );
}

function short_links_site_url(array $config): string
{
    $url = trim((string) ($config['site_url'] ?? 'https://hoahwa.com'));
    return rtrim($url !== '' ? $url : 'https://hoahwa.com', '/');
}

/** Public short URL: https://hoahwa.com/<code> (root level, like bit.ly/<code>). */
function short_links_public_url(array $config, string $code): string
{
    return short_links_site_url($config) . '/' . $code;
}

function short_links_client_ip(): string
{
    $candidates = [];
    $peer = (string) ($_SERVER['REMOTE_ADDR'] ?? '');
    // X-Forwarded-For is client-controlled: only trust it when the direct
    // peer is a local reverse proxy (private or loopback address).
    $peerIsLocalProxy = filter_var($peer, FILTER_VALIDATE_IP)
        && !filter_var($peer, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE);
    $forwarded = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
    if ($peerIsLocalProxy && is_string($forwarded) && $forwarded !== '') {
        $candidates[] = trim(explode(',', $forwarded)[0]);
    }
    $candidates[] = $peer;
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

/** @return array{ok:true,url:string}|array{ok:false,error:string} */
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
    if ($host === 'localhost' || $host === '::1' || substr($host, -10) === '.localhost' || strpos($host, '.') === false) {
        return ['ok' => false, 'error' => 'Private or local destinations are not allowed.'];
    }
    $ip = filter_var($host, FILTER_VALIDATE_IP);
    if ($ip !== false && !filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
        return ['ok' => false, 'error' => 'Private or local destinations are not allowed.'];
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

function short_links_sanitize_choice(string $value, array $allowed, string $fallback): string
{
    $value = strtolower(trim($value));
    return in_array($value, $allowed, true) ? $value : $fallback;
}

function short_links_sanitize_title(string $value): ?string
{
    $value = trim(preg_replace('/[\x00-\x1f\x7f]+/u', ' ', $value) ?? '');
    $value = preg_replace('/\s+/u', ' ', $value) ?? '';
    if ($value === '') {
        return null;
    }
    return mb_substr($value, 0, 120);
}

/** Custom back-half: 4–16 letters/digits, not reserved, not taken. Returns an error message or null. */
function short_links_validate_alias(PDO $pdo, string $alias): ?string
{
    if (!preg_match('/^[A-Za-z0-9]{4,16}$/', $alias)) {
        return 'Custom links use 4 to 16 letters or digits.';
    }
    if (in_array(strtolower($alias), SHORT_LINKS_RESERVED, true)) {
        return 'That word is reserved for a HoaHwa page.';
    }
    $stmt = $pdo->prepare('SELECT id FROM short_links WHERE code = :code LIMIT 1');
    $stmt->execute([':code' => $alias]);
    if ($stmt->fetch()) {
        return 'That custom link is already taken.';
    }
    return null;
}

/** Random 6-character code without vowels or look-alikes, so it never spells a page slug. */
function short_links_generate_code(PDO $pdo): string
{
    $alphabet = '23456789BCDFGHJKLMNPQRSTVWXZbcdfghjkmnpqrstvwxz';
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

function short_links_stage(int $hits): array
{
    $stage = SHORT_LINKS_STAGES[0];
    $index = 0;
    foreach (SHORT_LINKS_STAGES as $i => $candidate) {
        if ($hits >= $candidate['min']) {
            $stage = $candidate;
            $index = $i;
        }
    }
    $next = SHORT_LINKS_STAGES[$index + 1] ?? null;
    return ['id' => $stage['id'], 'label' => $stage['label'], 'index' => $index, 'min' => $stage['min'], 'next' => $next ? $next['min'] : null, 'nextLabel' => $next ? $next['label'] : null];
}

function short_links_device(string $userAgent): string
{
    $ua = strtolower($userAgent);
    if ($ua === '' || preg_match('/bot|crawl|spider|slurp|facebookexternalhit|preview|curl|wget|python|httpclient|headless/', $ua)) {
        return 'bot';
    }
    if (preg_match('/mobile|android|iphone|ipad|ipod|windows phone/', $ua)) {
        return 'mobile';
    }
    return 'desktop';
}

function short_links_referrer_host(string $referrer): string
{
    $host = strtolower((string) (parse_url($referrer, PHP_URL_HOST) ?? ''));
    $host = preg_replace('/^www\./', '', $host) ?? '';
    return mb_substr($host, 0, 120);
}

/** Public record for one link (no target URL beyond its host, no IP). */
function short_links_record(PDO $pdo, array $config, array $row, bool $withStats = false): array
{
    $hits = (int) $row['hits'];
    $record = [
        'code' => $row['code'],
        'shortUrl' => short_links_public_url($config, (string) $row['code']),
        'targetHost' => short_links_referrer_host((string) $row['target_url']),
        'title' => $row['title'] !== null && $row['title'] !== '' ? $row['title'] : null,
        'category' => $row['category'],
        'season' => $row['season'],
        'palette' => $row['palette'],
        'hits' => $hits,
        'stage' => short_links_stage($hits),
        'createdAt' => gmdate('c', strtotime((string) $row['created_at'])),
        'lastHitAt' => $row['last_hit_at'] ? gmdate('c', strtotime((string) $row['last_hit_at'])) : null,
    ];
    if ($withStats) {
        $days = [];
        for ($i = 13; $i >= 0; $i--) {
            $days[gmdate('Y-m-d', time() - $i * 86400)] = 0;
        }
        $stmt = $pdo->prepare('SELECT day, SUM(count) AS n FROM short_link_clicks WHERE link_id = :id AND day >= :from GROUP BY day');
        $stmt->execute([':id' => (int) $row['id'], ':from' => array_key_first($days)]);
        foreach ($stmt->fetchAll() as $r) {
            $key = (string) $r['day'];
            if (array_key_exists($key, $days)) {
                $days[$key] = (int) $r['n'];
            }
        }
        $record['daily'] = array_map(fn ($day, $n) => ['day' => $day, 'count' => $n], array_keys($days), $days);
        $stmt = $pdo->prepare('SELECT referrer_host, SUM(count) AS n FROM short_link_clicks WHERE link_id = :id GROUP BY referrer_host ORDER BY n DESC LIMIT 6');
        $stmt->execute([':id' => (int) $row['id']]);
        $record['referrers'] = array_map(fn ($r) => ['host' => $r['referrer_host'] !== '' ? $r['referrer_host'] : 'direct', 'count' => (int) $r['n']], $stmt->fetchAll());
        $stmt = $pdo->prepare('SELECT device, SUM(count) AS n FROM short_link_clicks WHERE link_id = :id GROUP BY device');
        $stmt->execute([':id' => (int) $row['id']]);
        $devices = ['mobile' => 0, 'desktop' => 0, 'bot' => 0];
        foreach ($stmt->fetchAll() as $r) {
            $devices[(string) $r['device']] = (int) $r['n'];
        }
        $record['devices'] = $devices;
    }
    return $record;
}

function short_links_json_ok(array $payload, int $code = 200): void
{
    http_response_code($code);
    echo json_encode(array_merge(['ok' => true], $payload), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function short_links_json_error(string $message, int $code = 400): void
{
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}
