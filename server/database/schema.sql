-- Drop database if exists and create new one
DROP DATABASE IF EXISTS craftmeup;
CREATE DATABASE craftmeup;
USE craftmeup;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    course VARCHAR(255),
    year VARCHAR(50),
    role VARCHAR(50) NOT NULL,
    student_id_file VARCHAR(255),
    study_load_file VARCHAR(255),
    profile_image VARCHAR(255),
    verified TINYINT(1) DEFAULT 0,
    verification_status VARCHAR(50) DEFAULT 'pending',
    reset_token VARCHAR(255),
    reset_token_expires DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Wallet table
CREATE TABLE wallet (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    balance DECIMAL(10,2) DEFAULT 50.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    availability VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);


-- Transactions table
CREATE TABLE transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    service_id INT,
    type VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    reference_number VARCHAR(100),
    payment_proof VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (service_id) REFERENCES services(id)
);

-- Feedback table
CREATE TABLE feedback (
    id INT PRIMARY KEY AUTO_INCREMENT,
    service_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Reports table
CREATE TABLE reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    reported_user_id INT NOT NULL,
    reporter_id INT NOT NULL,
    reason VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (reported_user_id) REFERENCES users(id),
    FOREIGN KEY (reporter_id) REFERENCES users(id)
);

-- Messages table
CREATE TABLE messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    content TEXT NOT NULL,
    read_status BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id)
);

-- Announcements table
CREATE TABLE announcements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    target_audience VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    expires_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Saved Services table
CREATE TABLE saved_services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    service_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (service_id) REFERENCES services(id)
);

-- Wallet Requests table (for top-ups and cash-outs)
CREATE TABLE wallet_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type ENUM('top-up', 'cash-out') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'completed') DEFAULT 'pending',
    reference_number VARCHAR(100) NOT NULL,
    proof_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes for better performance
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_verification ON users(verification_status);
CREATE INDEX idx_service_status ON services(status);
CREATE INDEX idx_transaction_status ON transactions(status);
CREATE INDEX idx_report_status ON reports(status);
CREATE INDEX idx_wallet_user ON wallet(user_id);
CREATE INDEX idx_wallet_requests_status ON wallet_requests(status);
CREATE INDEX idx_wallet_requests_user ON wallet_requests(user_id);

ALTER TABLE announcements 
ADD COLUMN expiration_date DATETIME NULL AFTER content,
MODIFY COLUMN content TEXT NOT NULL,
MODIFY COLUMN title VARCHAR(255) NOT NULL,
MODIFY COLUMN target_audience VARCHAR(50) NOT NULL DEFAULT 'All Users';
