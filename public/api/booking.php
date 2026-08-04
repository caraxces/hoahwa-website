<?php
declare(strict_types=1);

/**
 * Meeting booking request endpoint.
 *
 * This is the fallback path for /book — the primary path is the Google Calendar
 * appointment schedule, which writes straight to the calendar. Requests that
 * arrive here are stored in `booking_requests` and emailed to the addresses in
 * `notify_emails` (config.php), defaulting to both the Gmail and domain inbox.
 *
 * Note on deliverability: mail() sends from the hosting account, so the From
 * address must stay on a domain whose SPF record authorises this server
 * (hoahwa.com). Sending "From: …@gmail.com" would fail Gmail's own SPF/DMARC
 * checks and land in spam. The requester's address goes in Reply-To instead.
 */

header('Content-Type: application/json; charset=utf-8');

require __DIR__ . '/lib/mail-headers.php';

$configPath = __DIR__ . '/config.php';
if (!is_readable($configPath)) {
    http_response_code(503);
    echo json_encode(['ok' => false, 'error' => 'Booking API is not configured.']);
    exit;
}

/** @var array{db_host:string,db_name:string,db_user:string,db_pass:string,allowed_origins?:string[],notify_emails?:string[],mail_from?:string} $config */
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

function bookingField(array $data, string $key): string
{
    return trim((string) ($data[$key] ?? ''));
}

// Honeypot: hidden from users, usually filled by bots. Look successful, store nothing.
if (bookingField($data, 'website') !== '') {
    echo json_encode(['ok' => true, 'id' => 0]);
    exit;
}

$name = bookingField($data, 'name');
$email = bookingField($data, 'email');
$company = bookingField($data, 'company');
$preferredDate = bookingField($data, 'preferred_date');
$preferredWindow = bookingField($data, 'preferred_window');
$timezone = bookingField($data, 'timezone');
$topic = bookingField($data, 'topic');
$notes = bookingField($data, 'notes');

foreach ([
    'name' => $name,
    'email' => $email,
    'preferred_date' => $preferredDate,
    'preferred_window' => $preferredWindow,
    'topic' => $topic,
] as $label => $value) {
    if ($value === '') {
        http_response_code(422);
        echo json_encode(['ok' => false, 'error' => "Missing required field: {$label}."]);
        exit;
    }
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Please enter a valid email address.']);
    exit;
}

// Reject anything that is not a real calendar date, and anything in the past.
$parsedDate = DateTime::createFromFormat('!Y-m-d', $preferredDate);
if (!$parsedDate || $parsedDate->format('Y-m-d') !== $preferredDate) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Preferred date must be a valid date.']);
    exit;
}

$today = new DateTime('today');
if ($parsedDate < $today) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Please choose a date that has not passed.']);
    exit;
}

if ($parsedDate > (new DateTime('today'))->modify('+1 year')) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Please choose a date within the next year.']);
    exit;
}

if (
    strlen($name) > 255 || strlen($email) > 255 || strlen($company) > 255
    || strlen($preferredWindow) > 64 || strlen($timezone) > 64
    || strlen($topic) > 128 || strlen($notes) > 4000
) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'One or more fields are too long.']);
    exit;
}

/* -------------------------------------------------------------------------- */
/*  Store                                                                     */
/* -------------------------------------------------------------------------- */

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
        'CREATE TABLE IF NOT EXISTS booking_requests (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            company VARCHAR(255) NULL,
            preferred_date DATE NOT NULL,
            preferred_window VARCHAR(64) NOT NULL,
            timezone VARCHAR(64) NULL,
            topic VARCHAR(128) NOT NULL,
            notes TEXT NULL,
            status VARCHAR(32) NOT NULL DEFAULT "new",
            ip_address VARCHAR(45) NULL,
            user_agent VARCHAR(512) NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_created_at (created_at),
            INDEX idx_preferred_date (preferred_date),
            INDEX idx_email (email)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );

    $stmt = $pdo->prepare(
        'INSERT INTO booking_requests
            (name, email, company, preferred_date, preferred_window, timezone, topic, notes, ip_address, user_agent)
         VALUES
            (:name, :email, :company, :preferred_date, :preferred_window, :timezone, :topic, :notes, :ip_address, :user_agent)'
    );

    $stmt->execute([
        ':name' => $name,
        ':email' => $email,
        ':company' => $company !== '' ? $company : null,
        ':preferred_date' => $preferredDate,
        ':preferred_window' => $preferredWindow,
        ':timezone' => $timezone !== '' ? $timezone : null,
        ':topic' => $topic,
        ':notes' => $notes !== '' ? $notes : null,
        ':ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
        ':user_agent' => isset($_SERVER['HTTP_USER_AGENT'])
            ? substr((string) $_SERVER['HTTP_USER_AGENT'], 0, 512)
            : null,
    ]);

    $id = (int) $pdo->lastInsertId();
} catch (Throwable $e) {
    error_log('[booking] db: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Could not save your request. Please try again.']);
    exit;
}

/* -------------------------------------------------------------------------- */
/*  Notify                                                                    */
/* -------------------------------------------------------------------------- */

$notify = $config['notify_emails'] ?? ['larisa.trucmt@gmail.com', 'hello@hoahwa.com'];
$mailFrom = $config['mail_from'] ?? 'no-reply@hoahwa.com';

$safeName = hoahwa_mail_safe($name);
$safeEmail = hoahwa_mail_safe($email);
$replyTo = hoahwa_mail_address($name, $email);

$subject = sprintf('[Hoahwa] Meeting request #%d — %s (%s)', $id, $safeName, $preferredDate);

$bodyLines = [
    'New meeting request from hoahwa.com/book',
    '',
    'Name:            ' . $name,
    'Email:           ' . $email,
    'Company:         ' . ($company !== '' ? $company : '—'),
    'Preferred date:  ' . $preferredDate,
    'Preferred time:  ' . $preferredWindow,
    'Timezone:        ' . ($timezone !== '' ? $timezone : '—'),
    'Topic:           ' . $topic,
    '',
    'Notes:',
    $notes !== '' ? $notes : '—',
    '',
    '---',
    'Request ID: ' . $id,
    'Submitted:  ' . gmdate('Y-m-d H:i:s') . ' UTC',
];
$body = implode("\r\n", $bodyLines);

$headerLines = [
    'From: Hoahwa Booking <' . hoahwa_mail_safe($mailFrom) . '>',
    'Content-Type: text/plain; charset=utf-8',
    'X-Mailer: hoahwa-booking',
];
if ($replyTo !== null) {
    $headerLines[] = 'Reply-To: ' . $replyTo;
}
$headers = implode("\r\n", $headerLines);

$notified = false;
foreach ($notify as $recipient) {
    $recipient = hoahwa_mail_safe((string) $recipient);
    if (!filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
        continue;
    }
    if (@mail($recipient, $subject, $body, $headers)) {
        $notified = true;
    } else {
        error_log('[booking] mail failed for ' . $recipient . ' (request ' . $id . ')');
    }
}

// Acknowledgement to the requester. Best-effort — never fail the request on it.
$ackSubject = 'We received your meeting request — Hoahwa';
$ackBody = implode("\r\n", [
    'Hi ' . $name . ',',
    '',
    'Thanks for asking to book a call. Here is what we have:',
    '',
    '  Preferred date:  ' . $preferredDate,
    '  Preferred time:  ' . $preferredWindow,
    '  Topic:           ' . $topic,
    '',
    'We will reply with a confirmed time within one working day. If anything above',
    'is wrong, just reply to this email and tell us.',
    '',
    '— Hoahwa',
    'https://hoahwa.com',
]);
$ackHeaders = implode("\r\n", [
    'From: Hoahwa <' . hoahwa_mail_safe($mailFrom) . '>',
    'Content-Type: text/plain; charset=utf-8',
    'X-Mailer: hoahwa-booking',
]);
@mail($safeEmail, $ackSubject, $ackBody, $ackHeaders);

// The row is saved either way, so a mail failure is logged but not surfaced —
// the request is not lost, and Truc can still see it in the database.
if (!$notified) {
    error_log('[booking] no notification delivered for request ' . $id);
}

echo json_encode(['ok' => true, 'id' => $id]);
