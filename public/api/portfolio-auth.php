<?php
declare(strict_types=1);

require __DIR__ . '/lib/portfolio-bootstrap.php';

// Bootstrap handles CORS + OPTIONS preflight before method checks.
['pdo' => $pdo] = portfolio_bootstrap();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    portfolio_json_error('Method not allowed.', 405);
}
$data = portfolio_read_json();
$action = portfolio_field($data, 'action');

if ($action === 'register') {
    $username = portfolio_field($data, 'username');
    $password = (string) ($data['password'] ?? '');
    $fullName = portfolio_field($data, 'full_name');
    $whatsapp = portfolio_field($data, 'whatsapp');
    $privacyAccepted = !empty($data['privacy_accepted']);

    if ($username === '' || strlen($username) < 3) {
        portfolio_json_error('Username must be at least 3 characters.');
    }
    if (!preg_match('/^[a-z0-9_-]+$/i', $username)) {
        portfolio_json_error('Username may only contain letters, numbers, _ and -.');
    }
    if (strlen($password) < 8) {
        portfolio_json_error('Password must be at least 8 characters.');
    }
    if ($fullName === '' || $whatsapp === '') {
        portfolio_json_error('Full name and WhatsApp are required.');
    }
    if (!$privacyAccepted) {
        portfolio_json_error('You must accept the privacy policy.');
    }

    $stmt = $pdo->prepare(
        'INSERT INTO portfolio_users (username, password_hash, full_name, whatsapp)
         VALUES (:username, :password_hash, :full_name, :whatsapp)'
    );
    try {
        $stmt->execute([
            ':username' => strtolower($username),
            ':password_hash' => password_hash($password, PASSWORD_DEFAULT),
            ':full_name' => $fullName,
            ':whatsapp' => $whatsapp,
        ]);
    } catch (PDOException $e) {
        if ((int) $e->getCode() === 23000) {
            portfolio_json_error('Username already taken.');
        }
        throw $e;
    }

    $userId = (int) $pdo->lastInsertId();
    $token = portfolio_create_token($pdo, $userId);

    portfolio_json_ok([
        'token' => $token,
        'user' => [
            'id' => $userId,
            'username' => strtolower($username),
            'full_name' => $fullName,
            'whatsapp' => $whatsapp,
        ],
    ], 201);
}

if ($action === 'login') {
    $username = strtolower(portfolio_field($data, 'username'));
    $password = (string) ($data['password'] ?? '');

    $stmt = $pdo->prepare('SELECT id, username, full_name, whatsapp, password_hash FROM portfolio_users WHERE username = :username LIMIT 1');
    $stmt->execute([':username' => $username]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        portfolio_json_error('Invalid username or password.', 401);
    }

    $token = portfolio_create_token($pdo, (int) $user['id']);

    portfolio_json_ok([
        'token' => $token,
        'user' => [
            'id' => (int) $user['id'],
            'username' => $user['username'],
            'full_name' => $user['full_name'],
            'whatsapp' => $user['whatsapp'],
        ],
    ]);
}

if ($action === 'me') {
    $user = portfolio_auth_user($pdo);
    portfolio_json_ok(['user' => $user]);
}

if ($action === 'password_ticket') {
    $username = strtolower(portfolio_field($data, 'username'));
    $whatsapp = portfolio_field($data, 'whatsapp');
    $note = portfolio_field($data, 'note');

    if ($username === '' || $whatsapp === '') {
        portfolio_json_error('Username and WhatsApp are required.');
    }

    $stmt = $pdo->prepare('SELECT id FROM portfolio_users WHERE username = :username LIMIT 1');
    $stmt->execute([':username' => $username]);
    $user = $stmt->fetch();

    $stmt = $pdo->prepare(
        'INSERT INTO portfolio_password_tickets (user_id, username, whatsapp, note)
         VALUES (:user_id, :username, :whatsapp, :note)'
    );
    $stmt->execute([
        ':user_id' => $user ? (int) $user['id'] : null,
        ':username' => $username,
        ':whatsapp' => $whatsapp,
        ':note' => $note !== '' ? $note : null,
    ]);

    portfolio_json_ok([
        'message' => 'Support ticket created. Our IT team will contact you via WhatsApp.',
        'ticket_id' => (int) $pdo->lastInsertId(),
    ], 201);
}

portfolio_json_error('Unknown action.');
