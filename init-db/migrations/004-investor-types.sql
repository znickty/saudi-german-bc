USE sgbc;

-- Add investor_type and country_origin to investor_interests
ALTER TABLE investor_interests
  ADD COLUMN investor_type ENUM('german','saudi','other') DEFAULT 'german' AFTER id,
  ADD COLUMN country_origin VARCHAR(120) NULL AFTER investor_type;

-- Add assignment fields
ALTER TABLE investor_interests
  ADD COLUMN assigned_committee_member_id BIGINT UNSIGNED NULL AFTER assigned_to,
  ADD COLUMN assigned_at TIMESTAMP NULL AFTER assigned_committee_member_id;

CREATE INDEX idx_investor_type ON investor_interests (investor_type);
CREATE INDEX idx_assigned_member ON investor_interests (assigned_committee_member_id);