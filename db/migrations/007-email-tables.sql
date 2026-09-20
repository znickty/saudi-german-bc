USE sgbc;

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