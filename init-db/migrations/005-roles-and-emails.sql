USE sgbc;

-- Extend admin_users with new roles and email address
ALTER TABLE admin_users
  MODIFY role ENUM('admin','chairman','main_committee','general_committee') DEFAULT 'general_committee';

ALTER TABLE admin_users
  ADD COLUMN committee_email VARCHAR(255) NULL UNIQUE AFTER email,
  ADD COLUMN phone VARCHAR(64) NULL,
  ADD COLUMN title VARCHAR(120) NULL,
  ADD COLUMN department VARCHAR(120) NULL;

-- Email threads
CREATE TABLE IF NOT EXISTS email_threads (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  submission_id BIGINT UNSIGNED NULL,
  subject VARCHAR(255) NOT NULL,
  created_by BIGINT UNSIGNED NOT NULL,   -- admin_users.id
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_submission (submission_id),
  INDEX idx_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS email_messages (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  thread_id BIGINT UNSIGNED NOT NULL,
  direction ENUM('outbound','inbound') NOT NULL,
  from_email VARCHAR(255) NOT NULL,
  to_email VARCHAR(255) NOT NULL,
  cc_email VARCHAR(255) NULL,
  subject VARCHAR(255),
  body MEDIUMTEXT,
  message_id VARCHAR(255) NULL UNIQUE,   -- RFC822 Message-ID for threading inbound
  in_reply_to VARCHAR(255) NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP NULL,
  INDEX idx_thread (thread_id),
  INDEX idx_from (from_email),
  INDEX idx_to (to_email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS email_recipients (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  message_id BIGINT UNSIGNED NOT NULL,
  recipient_type ENUM('to','cc','bcc') DEFAULT 'to',
  email VARCHAR(255) NOT NULL,
  admin_user_id BIGINT UNSIGNED NULL,
  INDEX idx_message (message_id),
  INDEX idx_recipient (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;