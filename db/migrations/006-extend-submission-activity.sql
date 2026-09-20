USE sgbc;

ALTER TABLE submission_activity
  ADD COLUMN IF NOT EXISTS submission_type ENUM('investor','saudi') NOT NULL DEFAULT 'investor'
    AFTER submission_id;