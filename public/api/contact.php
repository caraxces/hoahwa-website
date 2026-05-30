<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$configPath = __DIR__ . '/config.php';
if (!is_readable($configPath)) {
    http_response_code(503);
    echo json_encode(['ok' => false, 'error' => 'Contact API is not configured.']);
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

function field(array $data, string $key): string
{
    $value = trim((string) ($data[$key] ?? ''));
    return $value;
}

$name = field($data, 'name');
$phone = field($data, 'phone');
$email = field($data, 'email');
$company = field($data, 'company');
$objectives = field($data, 'objectives');
$referralSource = field($data, 'referral_source');
$service = field($data, 'service');
$budget = field($data, 'budget');

$required = [
    'name' => $name,
    'phone' => $phone,
    'email' => $email,
    'company' => $company,
    'objectives' => $objectives,
    'referral_source' => $referralSource,
    'service' => $service,
];

foreach ($required as $label => $value) {
    if ($value === '') {
        http_response_code(422);
        echo json_encode(['ok' => false, 'error' => "Missing required field: {$label}."]);
        exit;
    }
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Invalid email address.']);
    exit;
}

if (strlen($name) > 255 || strlen($phone) > 64 || strlen($email) > 255 || strlen($company) > 255) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'One or more fields are too long.']);
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
        'CREATE TABLE IF NOT EXISTS contact_submissions (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            phone VARCHAR(64) NOT NULL,
            email VARCHAR(255) NOT NULL,
            company VARCHAR(255) NOT NULL,
            objectives TEXT NOT NULL,
            referral_source VARCHAR(255) NOT NULL,
            service VARCHAR(255) NOT NULL,
            budget VARCHAR(64) NULL,
            ip_address VARCHAR(45) NULL,
            user_agent VARCHAR(512) NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_created_at (created_at),
            INDEX idx_email (email)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );

    $stmt = $pdo->prepare(
        'INSERT INTO contact_submissions
            (name, phone, email, company, objectives, referral_source, service, budget, ip_address, user_agent)
         VALUES
            (:name, :phone, :email, :company, :objectives, :referral_source, :service, :budget, :ip_address, :user_agent)'
    );

    $stmt->execute([
        ':name' => $name,
        ':phone' => $phone,
        ':email' => $email,
        ':company' => $company,
        ':objectives' => $objectives,
        ':referral_source' => $referralSource,
        ':service' => $service,
        ':budget' => $budget !== '' ? $budget : null,
        ':ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
        ':user_agent' => isset($_SERVER['HTTP_USER_AGENT'])
            ? substr((string) $_SERVER['HTTP_USER_AGENT'], 0, 512)
            : null,
    ]);

    echo json_encode([
        'ok' => true,
        'id' => (int) $pdo->lastInsertId(),
    ]);
} catch (PDOException $e) {
    error_log('Contact form DB error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Could not save your submission. Please try again later.']);
}
