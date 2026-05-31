<?php
declare(strict_types=1);

require __DIR__ . '/lib/portfolio-bootstrap.php';

['pdo' => $pdo] = portfolio_bootstrap();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $slug = portfolio_slugify($_GET['slug'] ?? '');
    if ($slug === '') {
        portfolio_json_error('Missing slug.');
    }

    $stmt = $pdo->prepare(
        'SELECT slug, title, config_json, status, expires_at, published_at
         FROM portfolio_pages
         WHERE slug = :slug AND status = "published" AND expires_at > NOW()
         LIMIT 1'
    );
    $stmt->execute([':slug' => $slug]);
    $row = $stmt->fetch();

    if (!$row) {
        portfolio_json_error('Page not found or expired.', 404);
    }

    portfolio_json_ok([
        'page' => [
            'slug' => $row['slug'],
            'title' => $row['title'],
            'config' => json_decode($row['config_json'], true),
            'expires_at' => $row['expires_at'],
            'published_at' => $row['published_at'],
        ],
    ]);
}

if ($method === 'POST') {
    $user = portfolio_auth_user($pdo);
    $data = portfolio_read_json();
    $action = portfolio_field($data, 'action');

    if ($action === 'list') {
        $stmt = $pdo->prepare(
            'SELECT id, slug, title, status, expires_at, created_at, updated_at, published_at
             FROM portfolio_pages
             WHERE user_id = :user_id
             ORDER BY updated_at DESC'
        );
        $stmt->execute([':user_id' => (int) $user['id']]);
        portfolio_json_ok(['pages' => $stmt->fetchAll()]);
    }

    if ($action === 'save') {
        $slug = portfolio_slugify(portfolio_field($data, 'slug'));
        $title = portfolio_field($data, 'title');
        $config = $data['config'] ?? null;
        $publish = !empty($data['publish']);

        if ($slug === '' || strlen($slug) < 3) {
            portfolio_json_error('Slug must be at least 3 characters (a-z, 0-9, hyphen).');
        }
        if ($slug === 'demo') {
            portfolio_json_error('Slug "demo" is reserved.');
        }
        if ($title === '') {
            portfolio_json_error('Title is required.');
        }
        if (!is_array($config)) {
            portfolio_json_error('Invalid page config.');
        }

        $configJson = json_encode($config, JSON_UNESCAPED_UNICODE);
        if ($configJson === false) {
            portfolio_json_error('Could not encode config.');
        }

        $stmt = $pdo->prepare('SELECT id, user_id FROM portfolio_pages WHERE slug = :slug LIMIT 1');
        $stmt->execute([':slug' => $slug]);
        $existing = $stmt->fetch();

        $status = $publish ? 'published' : 'draft';

        if ($existing) {
            if ((int) $existing['user_id'] !== (int) $user['id']) {
                portfolio_json_error('This slug is already taken.', 409);
            }
            $stmt = $pdo->prepare(
                'UPDATE portfolio_pages
                 SET title = :title, config_json = :config_json, status = :status,
                     expires_at = DATE_ADD(NOW(), INTERVAL 100 DAY),
                     published_at = CASE WHEN :publish = 1 THEN COALESCE(published_at, NOW()) ELSE published_at END
                 WHERE id = :id'
            );
            $stmt->execute([
                ':title' => $title,
                ':config_json' => $configJson,
                ':status' => $status,
                ':publish' => $publish ? 1 : 0,
                ':id' => (int) $existing['id'],
            ]);
            $pageId = (int) $existing['id'];
        } else {
            $stmt = $pdo->prepare(
                'INSERT INTO portfolio_pages (user_id, slug, title, config_json, status, expires_at, published_at)
                 VALUES (:user_id, :slug, :title, :config_json, :status, DATE_ADD(NOW(), INTERVAL 100 DAY), :published_at)'
            );
            $stmt->execute([
                ':user_id' => (int) $user['id'],
                ':slug' => $slug,
                ':title' => $title,
                ':config_json' => $configJson,
                ':status' => $status,
                ':published_at' => $publish ? date('Y-m-d H:i:s') : null,
            ]);
            $pageId = (int) $pdo->lastInsertId();
        }

        portfolio_json_ok([
            'page' => [
                'id' => $pageId,
                'slug' => $slug,
                'title' => $title,
                'status' => $status,
                'preview_url' => '/portfolio/preview/?slug=' . rawurlencode($slug),
                'public_url' => $publish ? '/portfolio/preview/?slug=' . rawurlencode($slug) : null,
            ],
            'retention_days' => 100,
        ]);
    }

    portfolio_json_error('Unknown action.');
}

portfolio_json_error('Method not allowed.', 405);
