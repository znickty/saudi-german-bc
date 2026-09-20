USE sgbc;

ALTER TABLE investor_interests
  ADD COLUMN investor_type ENUM('german','saudi','other') NOT NULL DEFAULT 'german' AFTER id,
  ADD COLUMN country_origin VARCHAR(120) NULL AFTER investor_type,
  ADD COLUMN assigned_committee_member_id BIGINT UNSIGNED NULL AFTER assigned_to,
  ADD COLUMN assigned_at TIMESTAMP NULL AFTER assigned_committee_member_id;

ALTER TABLE investor_interests
  ADD INDEX idx_investor_type (investor_type),
  ADD INDEX idx_assigned_member (assigned_committee_member_id);

ALTER TABLE investor_interests
  ADD CONSTRAINT fk_investor_assigned
    FOREIGN KEY (assigned_committee_member_id) REFERENCES admin_users(id)
    ON DELETE SET NULL;