<?php
declare(strict_types=1);
/**
 * Unit tests for the mail header sanitisers used by public/api/booking.php.
 * Run with:  npm run test:mail   (or: php scripts/test-mail-headers.php)
 */
require __DIR__ . '/../public/api/lib/mail-headers.php';

$fails = 0;
function check(string $desc, bool $pass, string $got = ''): void {
    global $fails;
    if ($pass) { echo "  PASS  $desc\n"; }
    else { $fails++; echo "  FAIL  $desc" . ($got !== '' ? "  got: " . var_export($got, true) : '') . "\n"; }
}

// --- hoahwa_mail_safe strips CR/LF/NUL ---
$evil = "Bob\r\nBcc: victim@evil.com";
$safe = hoahwa_mail_safe($evil);
check('CRLF removed from name', !str_contains($safe, "\r") && !str_contains($safe, "\n"), $safe);
check('no "Bcc:" on its own line', !preg_match('/^Bcc:/m', $safe), $safe);
check('NUL removed', !str_contains(hoahwa_mail_safe("a\0b"), "\0"));
check('bare LF removed', !str_contains(hoahwa_mail_safe("a\nb"), "\n"));

// --- hoahwa_mail_address ---
$addr = hoahwa_mail_address("Evil\r\nBcc: x@y.com", 'real@example.com');
check('address built for valid email', $addr !== null);
check('no newline in built header', $addr !== null && !preg_match('/[\r\n]/', $addr), (string)$addr);
check('injected Bcc not a header line', $addr !== null && !preg_match('/^Bcc:/m', $addr), (string)$addr);

$q = hoahwa_mail_address('He said "hi" \\ ok', 'a@b.com');
check('quotes/backslash stripped from display name', $q !== null && !str_contains(substr($q, 0, (int)strrpos($q, '<')), '"hi"'), (string)$q);

check('invalid email -> null', hoahwa_mail_address('X', 'not-an-email') === null);
check('CRLF-laden email -> null', hoahwa_mail_address('X', "a@b.com\r\nBcc: c@d.com") === null);
check('empty name -> bare address', hoahwa_mail_address('   ', 'a@b.com') === 'a@b.com', (string)hoahwa_mail_address('   ', 'a@b.com'));
check('normal case formats correctly', hoahwa_mail_address('Ada Lovelace', 'ada@example.com') === '"Ada Lovelace" <ada@example.com>');

// --- full header block must never gain a line ---
$replyTo = hoahwa_mail_address("Attacker\r\nBcc: leak@evil.com", 'atk@example.com');
$headers = implode("\r\n", array_filter([
    'From: Hoahwa Booking <' . hoahwa_mail_safe('no-reply@hoahwa.com') . '>',
    'Content-Type: text/plain; charset=utf-8',
    $replyTo !== null ? 'Reply-To: ' . $replyTo : null,
]));
$lines = explode("\r\n", $headers);
check('header block has exactly 3 lines', count($lines) === 3, implode(' | ', $lines));
check('no line starts with Bcc', !array_filter($lines, fn($l) => stripos($l, 'bcc') === 0));

echo $fails === 0 ? "\nALL PASS\n" : "\n$fails FAILURE(S)\n";
exit($fails === 0 ? 0 : 1);
