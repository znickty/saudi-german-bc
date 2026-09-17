USE sgbc;

CREATE TABLE IF NOT EXISTS investor_interests (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

  -- Company info
  company_name VARCHAR(255) NOT NULL,
  website VARCHAR(255),
  year_established YEAR,
  headquarters VARCHAR(255),
  contact_person VARCHAR(255) NOT NULL,
  position VARCHAR(255),
  business_email VARCHAR(255) NOT NULL,
  telephone VARCHAR(64),
  company_size ENUM('1-10','11-50','51-250','251-1000','1000+') DEFAULT NULL,
  primary_industry VARCHAR(255),
  main_products TEXT,
  current_markets TEXT,

  -- Saudi interest
  opportunity_description TEXT,
  reason_for_saudi TEXT,
  target_industries TEXT,
  preferred_geography VARCHAR(255),
  investment_range VARCHAR(120),
  implementation_timeframe VARCHAR(120),
  project_stage VARCHAR(120),

  -- Cooperation preferences (JSON array of selected strings)
  cooperation_types JSON,

  -- Partner requirements
  partner_type VARCHAR(255),
  partner_capabilities TEXT,
  required_resources TEXT,
  desired_contribution TEXT,
  german_contribution TEXT,
  exclusivity ENUM('yes','no','maybe') DEFAULT 'maybe',
  ready_for_intro TINYINT(1) DEFAULT 0,

  -- Workflow
  status ENUM('new','review','assessment','partner_search','introduced','active','closed') DEFAULT 'new',
  sector_tag VARCHAR(120),
  assigned_to VARCHAR(120),
  internal_notes TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_status (status),
  INDEX idx_sector (sector_tag),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS saudi_partnerships (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255) NOT NULL,
  business_email VARCHAR(255) NOT NULL,
  telephone VARCHAR(64),
  opportunity_description TEXT,
  required_capability TEXT,
  market_demand TEXT,
  contribution TEXT,
  desired_german_company TEXT,
  cooperation_type VARCHAR(120),
  status ENUM('new','review','matched','closed') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



-- =============================================================
-- ADMIN USERS
-- =============================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role ENUM('admin','reviewer') DEFAULT 'admin',
  is_active TINYINT(1) DEFAULT 1,
  last_login_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Default admin (email: admin@sgbc.local / password: ChangeMe!2024)
-- Hash generated with bcryptjs, cost 10
INSERT INTO admin_users (email, password_hash, full_name, role)
VALUES (
  'admin@sgbc.local',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'Council Admin',
  'admin'
)
ON DUPLICATE KEY UPDATE email = email;