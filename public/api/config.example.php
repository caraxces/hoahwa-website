<?php
/**
 * Copy to config.php and fill in credentials (config.php is gitignored).
 * Or run: node scripts/generate-contact-api-config.mjs
 */
return [
    'db_host' => 'localhost',
    'db_name' => 'u525593444_hoahwa',
    'db_user' => 'u525593444_hoa',
    'db_pass' => 'YOUR_PASSWORD_HERE',
    'allowed_origins' => [
        'https://hoahwa.com',
        'https://www.hoahwa.com',
        'http://localhost:3000',
    ],
    // Booking request notifications (public/api/booking.php).
    'notify_emails' => [
        'larisa.trucmt@gmail.com',
        'hello@hoahwa.com',
    ],
    // Envelope sender. Keep on a domain whose SPF record authorises this host,
    // or Gmail will junk the notifications.
    'mail_from' => 'no-reply@hoahwa.com',
];
