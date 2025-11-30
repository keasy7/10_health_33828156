-- =========================================================
--   DATABASE SETUP SCRIPT FOR HEALTH & FITNESS TRACKER APP
-- =========================================================

-- Create database
CREATE DATABASE IF NOT EXISTS health;
USE health;

-- =======================
-- Users table
-- Stores account details
-- =======================
CREATE TABLE IF NOT EXISTS users (
    id            INT AUTO_INCREMENT,
    username      VARCHAR(50) UNIQUE, -- reminder to add uniqueness error handling
    password      VARCHAR(256),      -- reminder to write the function to hash the first inserted password
    email         VARCHAR(100),
    first_name    VARCHAR(50),
    last_name     VARCHAR(50),
    PRIMARY KEY(id)
);

-- =======================
-- Workouts table
-- Stores all logged exercise sessions
-- =======================
CREATE TABLE IF NOT EXISTS workouts (
    id         INT AUTO_INCREMENT,
    user_id    INT,
    type       VARCHAR(50),
    duration   INT,
    distance   DECIMAL(6,2),
    reps       INT,
    sets       INT,
    date_logged TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =============================================
-- Workout types table (OPTIONAL — custom types)
-- =============================================
CREATE TABLE IF NOT EXISTS workout_types (
    id          INT AUTO_INCREMENT,
    user_id     INT,
    name        VARCHAR(50),
    description VARCHAR(255),
    PRIMARY KEY(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =======================
-- Achievements table
-- Achievement definitions
-- =======================
CREATE TABLE IF NOT EXISTS achievements (
    id            INT AUTO_INCREMENT,
    user_id       INT NULL,            -- NULL for global achievements
    title         VARCHAR(100),
    description   VARCHAR(255),
    target_value  INT,
    metric_type   VARCHAR(50),     -- e.g. "reps", "km", "minutes"
    PRIMARY KEY(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =======================
-- User achievements table
-- Tracks progress + completion
-- =======================
CREATE TABLE IF NOT EXISTS user_achievements (
    id             INT AUTO_INCREMENT,
    user_id        INT,
    achievement_id INT,
    progress_value INT,
    completed_at   TIMESTAMP NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (achievement_id) REFERENCES achievements(id)
);

-- =======================
-- User preferences table
-- Controls metric visibility
-- =======================
CREATE TABLE IF NOT EXISTS user_preferences (
    id           INT AUTO_INCREMENT,
    user_id      INT,
    show_distance BOOLEAN DEFAULT TRUE,
    show_reps     BOOLEAN DEFAULT TRUE,
    show_sets     BOOLEAN DEFAULT TRUE,
    PRIMARY KEY(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =======================
-- Friends table
-- Tracks social connections ---- reminder to update this later with status (pending/accepted)
-- =======================
CREATE TABLE IF NOT EXISTS friends (
    id         INT AUTO_INCREMENT,
    user_id    INT,
    friend_id  INT,
    added_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (friend_id) REFERENCES users(id)
);

-- =========================================
-- Create database-access user for the app
-- =========================================
CREATE USER IF NOT EXISTS 'health_app'@'localhost' IDENTIFIED BY 'qwertyuiop';
GRANT ALL PRIVILEGES ON health.* TO 'health_app'@'localhost';