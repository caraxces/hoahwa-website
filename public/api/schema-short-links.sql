-- HoaHwa Links · reference schema (auto-migrated by public/api/lib/short-links-bootstrap.php).
-- Database: the site's config.php database (u525593444_hoahwa on Hostinger).
CREATE TABLE IF NOT EXISTS short_links (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(16) NOT NULL UNIQUE,            -- hoahwa.com/<code>; random 6 chars or a custom alias
  target_url VARCHAR(2048) NOT NULL,
  title VARCHAR(120) NULL,
  category VARCHAR(24) NOT NULL DEFAULT 'general',
  season VARCHAR(16) NOT NULL DEFAULT 'spring',
  palette VARCHAR(16) NOT NULL DEFAULT 'gold',
  hits INT UNSIGNED NOT NULL DEFAULT 0,        -- human clicks; drives the tree's growth stage
  last_hit_at TIMESTAMP NULL DEFAULT NULL,
  ip_address VARCHAR(45) NULL,                 -- creator, for rate limiting only
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_ip_created (ip_address, created_at),
  INDEX idx_target (target_url(191)),
  INDEX idx_category_hits (category, hits),
  INDEX idx_hits (hits)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS short_link_clicks (      -- privacy-friendly daily aggregates, no per-visitor rows
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  link_id INT UNSIGNED NOT NULL,
  day DATE NOT NULL,
  referrer_host VARCHAR(120) NOT NULL DEFAULT '',
  device VARCHAR(12) NOT NULL DEFAULT 'desktop', -- mobile | desktop | bot
  count INT UNSIGNED NOT NULL DEFAULT 0,
  UNIQUE KEY uq_click (link_id, day, referrer_host, device),
  INDEX idx_link_day (link_id, day),
  CONSTRAINT fk_click_link FOREIGN KEY (link_id) REFERENCES short_links(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
