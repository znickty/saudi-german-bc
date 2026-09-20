-- ============================================================
-- Saudi German Business Council — Base Schema
-- ============================================================
USE sgbc;

-- ------------------------------------------------------------
-- ADMIN / COMMITTEE USERS (all roles in one table)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,              -- login email
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role ENUM('admin','chairman','main_committee','general_committee')
       NOT NULL DEFAULT 'general_committee',
  committee_email VARCHAR(255) NULL UNIQUE,        -- public @sgbc.org mailbox
  title VARCHAR(120) NULL,
  department VARCHAR(120) NULL,
  phone VARCHAR(64) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  last_login_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_role (role),
  INDEX idx_committee_email (committee_email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- INVESTOR INTERESTS (from the public form)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS investor_interests (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

  -- Who is submitting
  investor_type ENUM('german','saudi','other') NOT NULL DEFAULT 'german',
  country_origin VARCHAR(120) NULL,

  -- Company
  company_name VARCHAR(255) NOT NULL,
  website VARCHAR(255) NULL,
  year_established YEAR NULL,
  headquarters VARCHAR(255) NULL,
  contact_person VARCHAR(255) NOT NULL,
  position VARCHAR(255) NULL,
  business_email VARCHAR(255) NOT NULL,
  telephone VARCHAR(64) NULL,
  company_size ENUM('1-10','11-50','51-250','251-1000','1000+') NULL,
  primary_industry VARCHAR(255) NULL,
  main_products TEXT NULL,
  current_markets TEXT NULL,

  -- Interest
  opportunity_description TEXT NULL,
  reason_for_saudi TEXT NULL,
  target_industries TEXT NULL,
  preferred_geography VARCHAR(255) NULL,
  investment_range VARCHAR(120) NULL,
  implementation_timeframe VARCHAR(120) NULL,
  project_stage VARCHAR(120) NULL,

  -- Cooperation preferences (JSON array)
  cooperation_types JSON NULL,

  -- Partner requirements
  partner_type VARCHAR(255) NULL,
  partner_capabilities TEXT NULL,
  required_resources TEXT NULL,
  desired_contribution TEXT NULL,
  german_contribution TEXT NULL,
  exclusivity ENUM('yes','no','maybe') DEFAULT 'maybe',
  ready_for_intro TINYINT(1) DEFAULT 0,

  -- Workflow
  status ENUM('new','review','assessment','partner_search','introduced','active','closed')
         NOT NULL DEFAULT 'new',
  sector_tag VARCHAR(120) NULL,
  assigned_to VARCHAR(255) NULL,                   -- legacy free-text
  assigned_committee_member_id BIGINT UNSIGNED NULL, -- FK to admin_users.id
  assigned_at TIMESTAMP NULL,
  internal_notes TEXT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_status (status),
  INDEX idx_sector (sector_tag),
  INDEX idx_investor_type (investor_type),
  INDEX idx_assigned_member (assigned_committee_member_id),
  INDEX idx_created (created_at),
  CONSTRAINT fk_investor_assigned
    FOREIGN KEY (assigned_committee_member_id) REFERENCES admin_users(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- SAUDI PARTNERSHIP SUBMISSIONS (from Saudi-side form)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS saudi_partnerships (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255) NOT NULL,
  business_email VARCHAR(255) NOT NULL,
  telephone VARCHAR(64) NULL,
  opportunity_description TEXT NULL,
  required_capability TEXT NULL,
  market_demand TEXT NULL,
  contribution TEXT NULL,
  desired_german_company TEXT NULL,
  cooperation_type VARCHAR(120) NULL,
  status ENUM('new','review','matched','closed') NOT NULL DEFAULT 'new',
  assigned_committee_member_id BIGINT UNSIGNED NULL,
  assigned_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_assigned_member (assigned_committee_member_id),
  CONSTRAINT fk_saudi_assigned
    FOREIGN KEY (assigned_committee_member_id) REFERENCES admin_users(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- ACTIVITY LOG
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS submission_activity (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  submission_id BIGINT UNSIGNED NOT NULL,
  submission_type ENUM('investor','saudi') NOT NULL DEFAULT 'investor',
  admin_id BIGINT UNSIGNED NULL,
  action VARCHAR(64) NOT NULL,
  note TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_submission (submission_id, submission_type),
  INDEX idx_admin (admin_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- EMAIL (threads, messages, recipients)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS email_threads (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  submission_id BIGINT UNSIGNED NULL,
  subject VARCHAR(255) NOT NULL,
  created_by BIGINT UNSIGNED NOT NULL,
  last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_submission (submission_id),
  INDEX idx_created_by (created_by),
  INDEX idx_last_message (last_message_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS email_messages (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  thread_id BIGINT UNSIGNED NOT NULL,
  direction ENUM('outbound','inbound') NOT NULL,
  from_email VARCHAR(255) NOT NULL,
  from_name VARCHAR(255) NULL,
  subject VARCHAR(255) NULL,
  body MEDIUMTEXT NOT NULL,
  body_html MEDIUMTEXT NULL,
  message_id VARCHAR(255) NULL UNIQUE,
  in_reply_to VARCHAR(255) NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP NULL,
  INDEX idx_thread (thread_id),
  INDEX idx_from (from_email),
  CONSTRAINT fk_message_thread
    FOREIGN KEY (thread_id) REFERENCES email_threads(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS email_recipients (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  message_id BIGINT UNSIGNED NOT NULL,
  recipient_type ENUM('to','cc','bcc') NOT NULL DEFAULT 'to',
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NULL,
  admin_user_id BIGINT UNSIGNED NULL,
  INDEX idx_message (message_id),
  INDEX idx_recipient (email),
  CONSTRAINT fk_recipient_message
    FOREIGN KEY (message_id) REFERENCES email_messages(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- MIGRATIONS TRACKER
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS _migrations (
  name VARCHAR(255) PRIMARY KEY,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- SEED: Default admin (password = ChangeMe!2024)
-- ------------------------------------------------------------
INSERT INTO admin_users (email, password_hash, full_name, role, committee_email, title)
VALUES (
  'admin@sgbc.local',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'Council Admin',
  'admin',
  'admin@sgbc.org',
  'System Administrator'
)
ON DUPLICATE KEY UPDATE email = email;