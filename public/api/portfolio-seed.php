<?php
declare(strict_types=1);

require __DIR__ . '/lib/portfolio-bootstrap.php';

['pdo' => $pdo] = portfolio_bootstrap();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    portfolio_json_error('Method not allowed.', 405);
}
$data = portfolio_read_json();

if (($data['action'] ?? '') !== 'seed_demo') {
    portfolio_json_error('Unknown action.');
}

$username = 'demo';
$password = 'Doona!01';
$fullName = 'Hoahwa Demo';
$whatsapp = '+84924769556';

$stmt = $pdo->prepare('SELECT id FROM portfolio_users WHERE username = :username LIMIT 1');
$stmt->execute([':username' => $username]);
$existing = $stmt->fetch();

if ($existing) {
    $stmt = $pdo->prepare(
        'UPDATE portfolio_users
         SET password_hash = :password_hash, full_name = :full_name, whatsapp = :whatsapp
         WHERE username = :username'
    );
    $stmt->execute([
        ':password_hash' => password_hash($password, PASSWORD_DEFAULT),
        ':full_name' => $fullName,
        ':whatsapp' => $whatsapp,
        ':username' => $username,
    ]);
    $userId = (int) $existing['id'];
    $created = false;
} else {
    $stmt = $pdo->prepare(
        'INSERT INTO portfolio_users (username, password_hash, full_name, whatsapp)
         VALUES (:username, :password_hash, :full_name, :whatsapp)'
    );
    $stmt->execute([
        ':username' => $username,
        ':password_hash' => password_hash($password, PASSWORD_DEFAULT),
        ':full_name' => $fullName,
        ':whatsapp' => $whatsapp,
    ]);
    $userId = (int) $pdo->lastInsertId();
    $created = true;
}

portfolio_json_ok([
    'message' => $created ? 'Demo user created.' : 'Demo user updated.',
    'credentials' => [
        'username' => $username,
        'password' => $password,
    ],
    'user_id' => $userId,
    'login_url' => '/portfolio/builder/',
], $created ? 201 : 200);
