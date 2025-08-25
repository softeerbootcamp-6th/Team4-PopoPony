-- schema.sql (MySQL 8)
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1) 사용자
CREATE TABLE IF NOT EXISTS `auth` (
                                      `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                      `login_id`   VARCHAR(100),
    `password`   VARCHAR(255),
    `name`       VARCHAR(100),
    `birth_date` DATE,
    `gender`     ENUM('MALE','FEMALE'),
    `contact`    VARCHAR(50),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_auth_login_id` (`login_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 2) 이미지 파일
CREATE TABLE IF NOT EXISTS `image_file` (
                                            `id`           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                            `s3_key`       VARCHAR(500),
    `content_type` VARCHAR(100),
    `size_bytes`   BIGINT UNSIGNED,
    `checksum`     VARCHAR(255),
    `created_at`   DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at`   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at`   DATETIME,
    PRIMARY KEY (`id`),
    KEY `idx_image_file_s3_key` (`s3_key`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 3) 위치 정보
CREATE TABLE IF NOT EXISTS `location_info` (
                                               `id`                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                               `place_name`         VARCHAR(200),
    `upper_addr_name`    VARCHAR(100),
    `middle_addr_name`   VARCHAR(100),
    `lower_addr_name`    VARCHAR(100),
    `first_no`           VARCHAR(20),
    `second_no`          VARCHAR(20),
    `road_name`          VARCHAR(200),
    `first_building_no`  VARCHAR(20),
    `second_building_no` VARCHAR(20),
    `detail_address`     VARCHAR(255),
    `longitude`          DECIMAL(10,6),
    `latitude`           DECIMAL(10,6),
    `created_at`         DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at`         DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at`         DATETIME,
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 4) 경로 구간
CREATE TABLE IF NOT EXISTS `route_leg` (
                                           `id`             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                           `total_distance` INT,
                                           `total_time`     INT,
                                           `total_fare`     INT,
                                           `taxi_fare`      INT,
                                           `used_favorite_route_vertices` JSON,
                                           `coordinates`    JSON,
                                           `created_at`     DATETIME DEFAULT CURRENT_TIMESTAMP,
                                           `updated_at`     DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                           `deleted_at`     DATETIME,
                                           PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 5) 경로
CREATE TABLE IF NOT EXISTS `route` (
                                       `id`                        BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                       `meeting_location_info_id`  BIGINT UNSIGNED,
                                       `hospital_location_info_id` BIGINT UNSIGNED,
                                       `return_location_info_id`   BIGINT UNSIGNED,
                                       `meeting_to_hospital_id`    BIGINT UNSIGNED,
                                       `hospital_to_return_id`     BIGINT UNSIGNED,
                                       `created_at`                DATETIME DEFAULT CURRENT_TIMESTAMP,
                                       `updated_at`                DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                       `deleted_at`                DATETIME,
                                       PRIMARY KEY (`id`),
    KEY `idx_route_meeting_loc`  (`meeting_location_info_id`),
    KEY `idx_route_hospital_loc` (`hospital_location_info_id`),
    KEY `idx_route_return_loc`   (`return_location_info_id`),
    KEY `idx_route_m2h`          (`meeting_to_hospital_id`),
    KEY `idx_route_h2r`          (`hospital_to_return_id`),
    CONSTRAINT `fk_route_meeting_loc`  FOREIGN KEY (`meeting_location_info_id`)  REFERENCES `location_info` (`id`),
    CONSTRAINT `fk_route_hospital_loc` FOREIGN KEY (`hospital_location_info_id`) REFERENCES `location_info` (`id`),
    CONSTRAINT `fk_route_return_loc`   FOREIGN KEY (`return_location_info_id`)   REFERENCES `location_info` (`id`),
    CONSTRAINT `fk_route_m2h`          FOREIGN KEY (`meeting_to_hospital_id`)    REFERENCES `route_leg` (`id`),
    CONSTRAINT `fk_route_h2r`          FOREIGN KEY (`hospital_to_return_id`)     REFERENCES `route_leg` (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 6) 환자
CREATE TABLE IF NOT EXISTS `patient` (
                                         `id`                       BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                         `customer_id`              BIGINT UNSIGNED,
                                         `latest_location_id`       BIGINT UNSIGNED,
                                         `name`                     VARCHAR(100),
    `patient_profile_image_id` BIGINT UNSIGNED,
    `age`                      INT,
    `gender`                   ENUM('MALE','FEMALE'),
    `contact`                  VARCHAR(50),
    `needs_helping`            BOOLEAN,
    `uses_wheelchair`          BOOLEAN,
    `has_cognitive_issue`      BOOLEAN,
    `cognitive_issue_detail`   JSON,
    `has_communication_issue`  BOOLEAN,
    `communication_issue_detail` TEXT,
    `created_at`               DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at`               DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at`               DATETIME,
    PRIMARY KEY (`id`),
    KEY `idx_patient_customer`    (`customer_id`),
    KEY `idx_patient_latest_loc`  (`latest_location_id`),
    KEY `idx_patient_profile_img` (`patient_profile_image_id`),
    CONSTRAINT `fk_patient_customer`    FOREIGN KEY (`customer_id`)              REFERENCES `auth` (`id`),
    CONSTRAINT `fk_patient_latest_loc`  FOREIGN KEY (`latest_location_id`)       REFERENCES `location_info` (`id`),
    CONSTRAINT `fk_patient_profile_img` FOREIGN KEY (`patient_profile_image_id`) REFERENCES `image_file` (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 7) 도우미 프로필
CREATE TABLE IF NOT EXISTS `helper_profile` (
                                                `id`                      BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                                `auth_id`                 BIGINT UNSIGNED,
                                                `latest_location_id`      BIGINT UNSIGNED,
                                                `helper_profile_image_id` BIGINT UNSIGNED,
                                                `strength`                JSON,
                                                `short_bio`               TEXT,
                                                `area`                    ENUM('SEOUL','BUSAN','DAEGU','INCHEON','GWANGJU'),
    `created_at`              DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at`              DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at`              DATETIME,
    PRIMARY KEY (`id`),
    KEY `idx_helper_auth`        (`auth_id`),
    KEY `idx_helper_latest_loc`  (`latest_location_id`),
    KEY `idx_helper_profile_img` (`helper_profile_image_id`),
    CONSTRAINT `fk_helper_auth`        FOREIGN KEY (`auth_id`)                 REFERENCES `auth` (`id`),
    CONSTRAINT `fk_helper_latest_loc`  FOREIGN KEY (`latest_location_id`)      REFERENCES `location_info` (`id`),
    CONSTRAINT `fk_helper_profile_img` FOREIGN KEY (`helper_profile_image_id`) REFERENCES `image_file` (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 8) 자격증
CREATE TABLE IF NOT EXISTS `certificate` (
                                             `id`                   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                             `helper_profile_id`    BIGINT UNSIGNED,
                                             `type`                 VARCHAR(100),
    `certificate_image_id` BIGINT UNSIGNED,
    `created_at`           DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at`           DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at`           DATETIME,
    PRIMARY KEY (`id`),
    KEY `idx_cert_profile` (`helper_profile_id`),
    KEY `idx_cert_image`   (`certificate_image_id`),
    CONSTRAINT `fk_cert_profile` FOREIGN KEY (`helper_profile_id`)    REFERENCES `helper_profile` (`id`),
    CONSTRAINT `fk_cert_image`   FOREIGN KEY (`certificate_image_id`) REFERENCES `image_file` (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 9) 모집/의뢰
CREATE TABLE IF NOT EXISTS `recruit` (
                                         `id`                      BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                         `customer_id`             BIGINT UNSIGNED,
                                         `patient_id`              BIGINT UNSIGNED,
                                         `route_id`                BIGINT UNSIGNED,
                                         `escort_date`             DATE,
                                         `estimated_meeting_time`  TIME,
                                         `estimated_return_time`   TIME,
                                         `purpose`                 VARCHAR(200),
    `extra_request`           TEXT,
    `estimated_fee`           INT,
    `status`                  ENUM('DONE','MATCHING','IN_PROGRESS','COMPLETED'),
    `created_at`              DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at`              DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at`              DATETIME,
    PRIMARY KEY (`id`),
    KEY `idx_recruit_customer` (`customer_id`),
    KEY `idx_recruit_patient`  (`patient_id`),
    KEY `idx_recruit_route`    (`route_id`),
    CONSTRAINT `fk_recruit_customer` FOREIGN KEY (`customer_id`) REFERENCES `auth` (`id`),
    CONSTRAINT `fk_recruit_patient`  FOREIGN KEY (`patient_id`)  REFERENCES `patient` (`id`),
    CONSTRAINT `fk_recruit_route`    FOREIGN KEY (`route_id`)    REFERENCES `route` (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 10) 지원(매칭 시도)
CREATE TABLE IF NOT EXISTS `application` (
                                             `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                             `recruit_id` BIGINT UNSIGNED,
                                             `helper_id`  BIGINT UNSIGNED,  -- auth.id
                                             `status`     ENUM('MATCHED','FAILED','PENDING'),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME,
    PRIMARY KEY (`id`),
    KEY `idx_app_recruit` (`recruit_id`),
    KEY `idx_app_helper`  (`helper_id`),
    CONSTRAINT `fk_app_recruit` FOREIGN KEY (`recruit_id`) REFERENCES `recruit` (`id`),
    CONSTRAINT `fk_app_helper`  FOREIGN KEY (`helper_id`)  REFERENCES `auth` (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 11) 동행
CREATE TABLE IF NOT EXISTS `escort` (
                                        `id`                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                        `recruit_id`          BIGINT UNSIGNED,
                                        `customer_id`         BIGINT UNSIGNED,
                                        `helper_id`           BIGINT UNSIGNED,
                                        `memo`                TEXT,
                                        `status`              ENUM('DONE','PREPARING','WRITING_REPORT','RETURNING','MEETING','HEADING_TO_HOSPITAL','IN_TREATMENT'),
    `actual_meeting_time` TIME,
    `actual_return_time`  TIME,
    `created_at`          DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at`          DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at`          DATETIME,
    PRIMARY KEY (`id`),
    KEY `idx_escort_recruit`  (`recruit_id`),
    KEY `idx_escort_customer` (`customer_id`),
    KEY `idx_escort_helper`   (`helper_id`),
    CONSTRAINT `fk_escort_recruit`  FOREIGN KEY (`recruit_id`)  REFERENCES `recruit` (`id`),
    CONSTRAINT `fk_escort_customer` FOREIGN KEY (`customer_id`) REFERENCES `auth` (`id`),
    CONSTRAINT `fk_escort_helper`   FOREIGN KEY (`helper_id`)   REFERENCES `auth` (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 12) 리뷰
CREATE TABLE IF NOT EXISTS `review` (
                                        `id`                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                        `recruit_id`         BIGINT UNSIGNED,
                                        `customer_id`        BIGINT UNSIGNED,
                                        `helper_id`          BIGINT UNSIGNED,
                                        `satisfaction_level` ENUM('GOOD','AVERAGE','BAD'),
    `negative_feedback`  TEXT,
    `short_comment`      TEXT,
    `created_at`         DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at`         DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at`         DATETIME,
    PRIMARY KEY (`id`),
    KEY `idx_review_recruit`  (`recruit_id`),
    KEY `idx_review_customer` (`customer_id`),
    KEY `idx_review_helper`   (`helper_id`),
    CONSTRAINT `fk_review_recruit`  FOREIGN KEY (`recruit_id`)  REFERENCES `recruit` (`id`),
    CONSTRAINT `fk_review_customer` FOREIGN KEY (`customer_id`) REFERENCES `auth` (`id`),
    CONSTRAINT `fk_review_helper`   FOREIGN KEY (`helper_id`)   REFERENCES `auth` (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `positive_feedback` (
                                                   `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                                   `description` VARCHAR(100),
    `created_at`  DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at`  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at`  DATETIME,
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `positive_feedback_choice` (
                                                          `id`                   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                                          `review_id`            BIGINT UNSIGNED,
                                                          `positive_feedback_id` BIGINT UNSIGNED,
                                                          `created_at`           DATETIME DEFAULT CURRENT_TIMESTAMP,
                                                          `updated_at`           DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                                          `deleted_at`           DATETIME,
                                                          PRIMARY KEY (`id`),
    KEY `idx_pfc_review`   (`review_id`),
    KEY `idx_pfc_feedback` (`positive_feedback_id`),
    CONSTRAINT `fk_pfc_review`   FOREIGN KEY (`review_id`)            REFERENCES `review` (`id`),
    CONSTRAINT `fk_pfc_feedback` FOREIGN KEY (`positive_feedback_id`) REFERENCES `positive_feedback` (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 13) 리포트/비용/첨부
CREATE TABLE IF NOT EXISTS `report` (
                                        `id`                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                        `recruit_id`            BIGINT UNSIGNED,
                                        `customer_id`           BIGINT UNSIGNED,
                                        `helper_id`             BIGINT UNSIGNED,
                                        `has_next_appointment`  BOOLEAN,
                                        `next_appointment_time` DATETIME,
                                        `description`           TEXT,
                                        `actual_meeting_time`   TIME,
                                        `actual_return_time`    TIME,
                                        `created_at`            DATETIME DEFAULT CURRENT_TIMESTAMP,
                                        `updated_at`            DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                        `deleted_at`            DATETIME,
                                        PRIMARY KEY (`id`),
    KEY `idx_report_recruit`  (`recruit_id`),
    KEY `idx_report_customer` (`customer_id`),
    KEY `idx_report_helper`   (`helper_id`),
    CONSTRAINT `fk_report_recruit`  FOREIGN KEY (`recruit_id`)  REFERENCES `recruit` (`id`),
    CONSTRAINT `fk_report_customer` FOREIGN KEY (`customer_id`) REFERENCES `auth` (`id`),
    CONSTRAINT `fk_report_helper`   FOREIGN KEY (`helper_id`)   REFERENCES `auth` (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `taxi_fee` (
                                          `id`                         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                          `report_id`                  BIGINT UNSIGNED,
                                          `departure_fee`              INT,
                                          `departure_receipt_image_id` BIGINT UNSIGNED,
                                          `return_fee`                 INT,
                                          `return_receipt_image_id`    BIGINT UNSIGNED,
                                          `created_at`                 DATETIME DEFAULT CURRENT_TIMESTAMP,
                                          `updated_at`                 DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                          `deleted_at`                 DATETIME,
                                          PRIMARY KEY (`id`),
    KEY `idx_taxi_report`  (`report_id`),
    KEY `idx_taxi_dep_img` (`departure_receipt_image_id`),
    KEY `idx_taxi_ret_img` (`return_receipt_image_id`),
    CONSTRAINT `fk_taxi_report`  FOREIGN KEY (`report_id`)                   REFERENCES `report` (`id`),
    CONSTRAINT `fk_taxi_dep_img` FOREIGN KEY (`departure_receipt_image_id`)  REFERENCES `image_file` (`id`),
    CONSTRAINT `fk_taxi_ret_img` FOREIGN KEY (`return_receipt_image_id`)     REFERENCES `image_file` (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `image_attachment` (
                                                  `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                                  `report_id`  BIGINT UNSIGNED,
                                                  `image_id`   BIGINT UNSIGNED,
                                                  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
                                                  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                                  `deleted_at` DATETIME,
                                                  PRIMARY KEY (`id`),
    KEY `idx_imgatt_report` (`report_id`),
    KEY `idx_imgatt_image`  (`image_id`),
    CONSTRAINT `fk_imgatt_report` FOREIGN KEY (`report_id`) REFERENCES `report` (`id`),
    CONSTRAINT `fk_imgatt_image`  FOREIGN KEY (`image_id`)  REFERENCES `image_file` (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET FOREIGN_KEY_CHECKS = 1;
