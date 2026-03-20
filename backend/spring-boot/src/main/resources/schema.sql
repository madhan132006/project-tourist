-- ================================================================
-- SMART TOURIST SAFETY SYSTEM — MySQL Database Schema v2.0
-- ================================================================
-- Run this script to create all required tables.
-- Database: tourist_safety_db

CREATE DATABASE IF NOT EXISTS tourist_safety_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE tourist_safety_db;

-- ─── TOURISTS TABLE ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tourists (
  id                    BIGINT       NOT NULL AUTO_INCREMENT,
  name                  VARCHAR(200) NOT NULL,
  country               VARCHAR(100) NOT NULL,
  passport_number       VARCHAR(50)  UNIQUE,
  phone                 VARCHAR(30),
  email                 VARCHAR(255) NOT NULL UNIQUE,
  password_hash         VARCHAR(255) NOT NULL,
  safety_score          INT          DEFAULT 80,
  status                ENUM('ACTIVE','INACTIVE','EMERGENCY','BLACKLISTED') DEFAULT 'ACTIVE',
  emergency_contact_name  VARCHAR(200),
  emergency_contact_phone VARCHAR(30),
  arrival_date          VARCHAR(20),
  departure_date        VARCHAR(20),
  hotel_name            VARCHAR(200),
  blockchain_id         VARCHAR(100),
  created_at            DATETIME     DEFAULT CURRENT_TIMESTAMP,
  last_login            DATETIME,
  PRIMARY KEY (id),
  INDEX idx_email (email),
  INDEX idx_passport (passport_number),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── INCIDENTS TABLE ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS incidents (
  id          BIGINT       NOT NULL AUTO_INCREMENT,
  tourist_id  BIGINT,
  location    VARCHAR(300) NOT NULL,
  type        VARCHAR(100) NOT NULL,
  description TEXT,
  risk_level  ENUM('LOW','MEDIUM','HIGH','CRITICAL') DEFAULT 'MEDIUM',
  status      ENUM('OPEN','UNDER_REVIEW','RESOLVED','CLOSED') DEFAULT 'OPEN',
  lat         DOUBLE,
  lng         DOUBLE,
  timestamp   DATETIME     DEFAULT CURRENT_TIMESTAMP,
  resolved_at DATETIME,
  PRIMARY KEY (id),
  INDEX idx_tourist (tourist_id),
  INDEX idx_risk_level (risk_level),
  INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── EMERGENCY ALERTS TABLE ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS emergency_alerts (
  id              BIGINT       NOT NULL AUTO_INCREMENT,
  tourist_id      BIGINT,
  location        VARCHAR(300) NOT NULL,
  lat             DOUBLE,
  lng             DOUBLE,
  emergency_type  VARCHAR(100) DEFAULT 'GENERAL',
  description     TEXT,
  status          ENUM('TRIGGERED','LOCATION_CAPTURED','AUTHORITIES_NOTIFIED','DISPATCHED','RESOLVED','CANCELLED') DEFAULT 'TRIGGERED',
  eta_minutes     INT          DEFAULT 4,
  created_at      DATETIME     DEFAULT CURRENT_TIMESTAMP,
  dispatched_at   DATETIME,
  resolved_at     DATETIME,
  PRIMARY KEY (id),
  INDEX idx_tourist (tourist_id),
  INDEX idx_status (status),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── BLOCKCHAIN RECORDS TABLE ───────────────────────────────────
CREATE TABLE IF NOT EXISTS blockchain_records (
  id            BIGINT       NOT NULL AUTO_INCREMENT,
  block_index   INT          NOT NULL UNIQUE,
  hash          VARCHAR(128) NOT NULL,
  previous_hash VARCHAR(128) NOT NULL,
  timestamp     DATETIME     DEFAULT CURRENT_TIMESTAMP,
  data          TEXT         NOT NULL,
  record_type   VARCHAR(50)  DEFAULT 'INCIDENT',
  tourist_id    BIGINT,
  location      VARCHAR(300),
  nonce         BIGINT       DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uk_block_index (block_index),
  INDEX idx_type (record_type),
  INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================================
-- SAMPLE DATA
-- ================================================================

-- Sample tourists
INSERT INTO tourists (name, country, passport_number, phone, email, password_hash, safety_score, blockchain_id, emergency_contact_name, emergency_contact_phone)
VALUES
  ('Alice Johnson',   'United States', 'US12345678', '+1-202-555-0173', 'alice@example.com', '$2a$10$hash1', 92, 'TSS-ALICE001DEMO', 'Bob Johnson',   '+1-202-555-0100'),
  ('Carlos Martinez', 'Spain',         'ES87654321', '+34-91-555-0022', 'carlos@example.com','$2a$10$hash2', 78, 'TSS-CARLOS02DEMO', 'Maria Martinez','+34-91-555-0033'),
  ('Yuki Tanaka',     'Japan',         'JP11223344', '+81-3-555-0055',  'yuki@example.com',  '$2a$10$hash3', 85, 'TSS-YUKI0003DEMO', 'Kenji Tanaka',  '+81-3-555-0066')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Sample incidents
INSERT INTO incidents (tourist_id, location, type, description, risk_level, lat, lng)
VALUES
  (1, 'Market Street, Zone B', 'Pickpocket',          'Tourist reported wallet stolen near the main market', 'HIGH',   12.9720, 77.5950),
  (2, 'Harbor Area',           'Lost Tourist',         'Tourist became disoriented near the harbor',          'MEDIUM', 12.9680, 77.5920),
  (1, 'Park Avenue',           'Medical Emergency',    'Tourist needed medical assistance, ambulance called',  'LOW',    12.9740, 77.5930),
  (3, 'Tourist District',      'Scam Attempt',         'Tourist approached by fake tour operator',             'HIGH',   12.9700, 77.5940),
  (2, 'City Center',           'Property Damage',      'Tourist vehicle window broken',                       'MEDIUM', 12.9716, 77.5946)
ON DUPLICATE KEY UPDATE location = VALUES(location);

-- Sample emergency alerts
INSERT INTO emergency_alerts (tourist_id, location, lat, lng, emergency_type, status)
VALUES
  (1, 'City Center, 12.9716, 77.5946', 12.9716, 77.5946, 'MEDICAL', 'RESOLVED'),
  (2, 'Market Street, Zone B',         12.9720, 77.5950, 'CRIME',   'RESOLVED')
ON DUPLICATE KEY UPDATE status = VALUES(status);

-- Genesis blockchain record
INSERT INTO blockchain_records (block_index, hash, previous_hash, data, record_type)
VALUES (
  0,
  '0000000000000000000000000000000000000000000000000000000000000001',
  '0000000000000000000000000000000000000000000000000000000000000000',
  '{"type":"GENESIS","description":"Smart Tourist Safety System blockchain initialized","version":"2.0"}',
  'GENESIS'
) ON DUPLICATE KEY UPDATE record_type = VALUES(record_type);

-- ================================================================
-- USEFUL VIEWS
-- ================================================================

CREATE OR REPLACE VIEW v_active_alerts AS
  SELECT ea.*, t.name as tourist_name, t.country
  FROM emergency_alerts ea
  LEFT JOIN tourists t ON ea.tourist_id = t.id
  WHERE ea.status NOT IN ('RESOLVED', 'CANCELLED')
  ORDER BY ea.created_at DESC;

CREATE OR REPLACE VIEW v_incident_summary AS
  SELECT
    i.*,
    t.name as tourist_name,
    t.country as tourist_country
  FROM incidents i
  LEFT JOIN tourists t ON i.tourist_id = t.id
  ORDER BY i.timestamp DESC;

CREATE OR REPLACE VIEW v_dashboard_stats AS
  SELECT
    (SELECT COUNT(*) FROM tourists)                          AS total_tourists,
    (SELECT COUNT(*) FROM incidents)                         AS total_incidents,
    (SELECT COUNT(*) FROM incidents WHERE status='OPEN')     AS open_incidents,
    (SELECT COUNT(*) FROM emergency_alerts)                  AS total_alerts,
    (SELECT COUNT(*) FROM emergency_alerts WHERE status='RESOLVED') AS resolved_alerts,
    (SELECT COUNT(*) FROM blockchain_records)                AS blockchain_records,
    (SELECT AVG(safety_score) FROM tourists)                 AS avg_safety_score;
