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
    'site_url' => 'https://hoahwa.com',
    'allowed_origins' => [
        'https://hoahwa.com',
        'https://www.hoahwa.com',
        'http://localhost:3000',
    ],
];
