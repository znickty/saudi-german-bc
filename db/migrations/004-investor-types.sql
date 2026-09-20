USE sgbc;

-- NEW: role enum + committee fields
ALTER TABLE admin_users
  MODIFY role ENUM('admin','chairman','main_committee','general_committee')
    NOT NULL DEFAULT 'general_committee';

ALTER TABLE admin_users
  ADD COLUMN committee_email VARCHAR(255) NULL UNIQUE,
  ADD COLUMN title VARCHAR(120) NULL,
  ADD COLUMN department VARCHAR(120) NULL,
  ADD COLUMN phone VARCHAR(64) NULL,
  ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Make full_name NOT NULL only if empty values don't exist
UPDATE admin_users SET full_name = email WHERE full_name IS NULL OR full_name = '';