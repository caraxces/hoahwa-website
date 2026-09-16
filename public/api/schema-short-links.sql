-- Auto-migrated by public/api/lib/short-links-bootstrap.php
-- Database: u525593444_hoahwa
CREATE TABLE IF NOT EXISTS short_links (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(16) NOT NULL UNIQUE,
  target_url VARCHAR(2048) NOT NULL,
  season VARCHAR(16) NOT NULL DEFAULT 'spring',
  palette VARCHAR(16) NOT NULL DEFAULT 'gold',
  hits INT UNSIGNED NOT NULL DEFAULT 0,
  ip_address VARCHAR(45) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_code (code),
  INDEX idx_ip_created (ip_address, created_at),
  INDEX idx_target (target_url(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
