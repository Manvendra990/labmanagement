-- CreateTable
CREATE TABLE `test_categories` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(160) NOT NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uq_test_categories_name`(`name`),
    INDEX `idx_test_categories_order`(`sort_order`),
    INDEX `idx_test_categories_active`(`active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lab_units` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(120) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uq_lab_units_name`(`name`),
    INDEX `idx_lab_units_active`(`active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lab_tests` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(30) NOT NULL,
    `name` VARCHAR(180) NOT NULL,
    `short_name` VARCHAR(100) NULL,
    `category_id` BIGINT NOT NULL,
    `price` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `unit_id` BIGINT NULL,
    `input_type` VARCHAR(30) NULL,
    `default_result` TEXT NULL,
    `optional` BOOLEAN NOT NULL DEFAULT false,
    `display_name` BOOLEAN NOT NULL DEFAULT true,
    `method` VARCHAR(180) NULL,
    `instrument` VARCHAR(180) NULL,
    `interpretation` TEXT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,

    INDEX `idx_lab_tests_category`(`category_id`),
    INDEX `idx_lab_tests_unit`(`unit_id`),
    INDEX `idx_lab_tests_active`(`active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lab_test_parameters` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `test_id` BIGINT NOT NULL,
    `display_order` INTEGER NOT NULL DEFAULT 0,
    `name` VARCHAR(180) NOT NULL,
    `unit_id` BIGINT NULL,
    `input_type` VARCHAR(30) NOT NULL DEFAULT 'single_line',
    `group_by_name` VARCHAR(180) NULL,
    `default_result` TEXT NULL,
    `optional` BOOLEAN NOT NULL DEFAULT false,
    `parent_parameter_id` BIGINT NULL,

    INDEX `idx_lab_test_parameters_order`(`test_id`, `display_order`),
    INDEX `idx_lab_test_parameters_unit`(`unit_id`),
    INDEX `idx_lab_test_parameters_parent`(`parent_parameter_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `lab_tests` ADD CONSTRAINT `lab_tests_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `test_categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lab_tests` ADD CONSTRAINT `lab_tests_unit_id_fkey` FOREIGN KEY (`unit_id`) REFERENCES `lab_units`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lab_test_parameters` ADD CONSTRAINT `lab_test_parameters_test_id_fkey` FOREIGN KEY (`test_id`) REFERENCES `lab_tests`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lab_test_parameters` ADD CONSTRAINT `lab_test_parameters_unit_id_fkey` FOREIGN KEY (`unit_id`) REFERENCES `lab_units`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
