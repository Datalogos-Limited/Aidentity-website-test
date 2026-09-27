-- Example MySQL schema for controlled white-paper access requests.
-- Store the minimum personal data needed and apply a documented retention period.
CREATE DATABASE IF NOT EXISTS datalogos_library
  CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE datalogos_library;

CREATE TABLE IF NOT EXISTS access_requests (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(180) NOT NULL,
  company VARCHAR(180) NOT NULL,
  email VARCHAR(254) NOT NULL,
  email_domain VARCHAR(190) NOT NULL,
  status ENUM('pending','approved','rejected','expired') NOT NULL DEFAULT 'pending',
  requested_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP NULL,
  expires_at TIMESTAMP NULL,
  INDEX idx_access_email (email),
  INDEX idx_access_status_time (status, requested_at)
) ENGINE=InnoDB;

-- Do not store an IP address unless a documented security need, privacy notice,
-- retention period and access control are in place. Never store plaintext passwords.
