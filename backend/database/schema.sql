-- Test Categories
CREATE TABLE
    IF NOT EXISTS test_categories (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(160) NOT NULL,
        sort_order INT NOT NULL DEFAULT 0,
        active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uq_test_categories_name (name),
        KEY idx_test_categories_order (sort_order),
        KEY idx_test_categories_active (active)
    );

INSERT IGNORE INTO test_categories (name, sort_order)
VALUES
    ('Haematology', 1),
    ('Biochemistry', 2),
    ('Serology & Immunology', 3),
    ('Clinical Pathology', 4),
    ('Cytology', 5),
    ('Microbiology', 6),
    ('Endocrinology', 7),
    ('Histopathology', 8),
    ('Others', 9),
    ('Miscellaneous', 10);