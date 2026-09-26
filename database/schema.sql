CREATE DATABASE IF NOT EXISTS lab_lims CHARACTER
SET
    utf8mb4 COLLATE utf8mb4_unicode_ci;

USE lab_lims;

CREATE TABLE
    branches (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(160) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    users (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        branch_id BIGINT,
        name VARCHAR(160) NOT NULL,
        email VARCHAR(190) UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(60) NOT NULL,
        status VARCHAR(30) DEFAULT 'ACTIVE',
        FOREIGN KEY (branch_id) REFERENCES branches (id)
    );

CREATE TABLE
    patients (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        branch_id BIGINT,
        patient_code VARCHAR(50),
        name VARCHAR(160) NOT NULL,
        mobile VARCHAR(30),
        gender VARCHAR(30),
        dob DATE,
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (branch_id) REFERENCES branches (id)
    );

CREATE TABLE
    doctors (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        branch_id BIGINT,
        name VARCHAR(160) NOT NULL,
        mobile VARCHAR(30),
        specialization VARCHAR(120),
        FOREIGN KEY (branch_id) REFERENCES branches (id)
    );

CREATE TABLE
    tests (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        test_code VARCHAR(50) UNIQUE,
        name VARCHAR(180) NOT NULL,
        category VARCHAR(120),
        department VARCHAR(120),
        sample_type VARCHAR(80),
        price DECIMAL(12, 2) DEFAULT 0,
        active BOOLEAN DEFAULT TRUE
    );

CREATE TABLE
    orders (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        branch_id BIGINT,
        order_no VARCHAR(50) UNIQUE,
        patient_id BIGINT,
        doctor_id BIGINT,
        service_type VARCHAR(40),
        status VARCHAR(50),
        total DECIMAL(12, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (branch_id) REFERENCES branches (id),
        FOREIGN KEY (patient_id) REFERENCES patients (id),
        FOREIGN KEY (doctor_id) REFERENCES doctors (id)
    );

CREATE TABLE
    audit_logs (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        user_id BIGINT,
        action VARCHAR(255),
        resource_type VARCHAR(80),
        resource_id VARCHAR(80),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

INSERT INTO
    branches (name)
VALUES
    ('Main Laboratory');