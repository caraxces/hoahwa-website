<?php
declare(strict_types=1);

/**
 * Mail header helpers.
 *
 * Any visitor-supplied value that reaches a mail header must have CR, LF and
 * NUL removed first. Without that, a name like "Bob\r\nBcc: victim@x.com"
 * injects a real Bcc header and turns the endpoint into an open relay.
 *
 * Kept in its own file so it can be unit-tested without a database or a
 * configured endpoint — see scripts/test-mail-headers.php.
 */

if (!function_exists('hoahwa_mail_safe')) {
    /** Strip anything that could terminate or inject a mail header. */
    function hoahwa_mail_safe(string $value): string
    {
        return trim(str_replace(["\r", "\n", "\0"], ' ', $value));
    }
}

if (!function_exists('hoahwa_mail_address')) {
    /**
     * Render a "Display Name <addr@example.com>" header value, or just the bare
     * address when the name is unusable. Returns null when the address itself
     * is not a valid email, so callers can skip the header entirely.
     */
    function hoahwa_mail_address(string $name, string $email): ?string
    {
        $safeEmail = hoahwa_mail_safe($email);
        if (!filter_var($safeEmail, FILTER_VALIDATE_EMAIL)) {
            return null;
        }

        // Quotes and backslashes would break out of the display-name phrase.
        $safeName = str_replace(['"', '\\'], '', hoahwa_mail_safe($name));
        if ($safeName === '') {
            return $safeEmail;
        }

        return sprintf('"%s" <%s>', $safeName, $safeEmail);
    }
}
