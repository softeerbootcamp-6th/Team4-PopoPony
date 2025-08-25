SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1) 사용자
CREATE TABLE IF NOT EXISTS auth (
    id BIGINT NOT NULL AUTO_INCREMENT,
    login_id VARCHAR(255),
    password VARCHAR(255),
    name VARCHAR(255),
    birth_date DATE,
    gender VARCHAR(255),
    contact VARCHAR(255),
    created_at DATETIME(6),
    updated_at DATETIME(6),
    deleted_at DATETIME(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_auth_login_id (login_id)
    ) ENGINE=InnoDB;

-- 2) 이미지 파일
CREATE TABLE IF NOT EXISTS image_file (
    id BIGINT NOT NULL AUTO_INCREMENT,
    s3_key VARCHAR(500),
    content_type VARCHAR(255),
    size_bytes BIGINT,
    checksum VARCHAR(255),
    created_at DATETIME(6),
    updated_at DATETIME(6),
    deleted_at DATETIME(6),
    PRIMARY KEY (id)
    ) ENGINE=InnoDB;

-- 3) 위치 정보
CREATE TABLE IF NOT EXISTS location_info (
    id BIGINT NOT NULL AUTO_INCREMENT,
    place_name VARCHAR(255),
    upper_addr_name VARCHAR(255),
    middle_addr_name VARCHAR(255),
    lower_addr_name VARCHAR(255),
    first_no VARCHAR(255),
    second_no VARCHAR(255),
    road_name VARCHAR(255),
    first_building_no VARCHAR(255),
    second_building_no VARCHAR(255),
    detail_address VARCHAR(255),
    longitude DECIMAL(10,7),
    latitude DECIMAL(10,7),
    created_at DATETIME(6),
    updated_at DATETIME(6),
    deleted_at DATETIME(6),
    PRIMARY KEY (id)
    ) ENGINE=InnoDB;

-- 4) 경로 구간
CREATE TABLE IF NOT EXISTS route_leg (
    id BIGINT NOT NULL AUTO_INCREMENT,
    total_distance INT,
    total_time INT,
    total_fare INT,
    taxi_fare INT,
    used_favorite_route_vertices JSON,
    coordinates JSON,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    deleted_at DATETIME(6),
    PRIMARY KEY (id)
    ) ENGINE=InnoDB;

-- 5) 경로
CREATE TABLE IF NOT EXISTS route (
    id BIGINT NOT NULL AUTO_INCREMENT,
    meeting_location_info_id BIGINT,
    hospital_location_info_id BIGINT,
    return_location_info_id BIGINT,
    meeting_to_hospital_id BIGINT,
    hospital_to_return_id BIGINT,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    deleted_at DATETIME(6),
    PRIMARY KEY (id)
    ) ENGINE=InnoDB;

-- 6) 환자
CREATE TABLE IF NOT EXISTS patient (
    id BIGINT NOT NULL AUTO_INCREMENT,
    customer_id BIGINT,
    latest_location_id BIGINT,
    name VARCHAR(255),
    patient_profile_image_id BIGINT,
    age INT,
    gender VARCHAR(255),
    contact VARCHAR(255),
    needs_helping BOOLEAN,
    uses_wheelchair BOOLEAN,
    has_cognitive_issue BOOLEAN,
    cognitive_issue_detail JSON,
    has_communication_issue BOOLEAN,
    communication_issue_detail TEXT,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    deleted_at DATETIME(6),
    PRIMARY KEY (id)
    ) ENGINE=InnoDB;

-- 7) 도우미 프로필
CREATE TABLE IF NOT EXISTS helper_profile (
    id BIGINT NOT NULL AUTO_INCREMENT,
    auth_id BIGINT,
    latest_location_id BIGINT,
    helper_profile_image_id BIGINT,
    strength JSON,
    short_bio TEXT,
    area VARCHAR(255),
    created_at DATETIME(6),
    updated_at DATETIME(6),
    deleted_at DATETIME(6),
    PRIMARY KEY (id)
    ) ENGINE=InnoDB;

-- 8) 자격증
CREATE TABLE IF NOT EXISTS certificate (
    id BIGINT NOT NULL AUTO_INCREMENT,
    helper_profile_id BIGINT,
    type VARCHAR(255),
    certificate_image_id BIGINT,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    deleted_at DATETIME(6),
    PRIMARY KEY (id)
    ) ENGINE=InnoDB;

-- 9) 모집/의뢰
CREATE TABLE IF NOT EXISTS recruit (
    id BIGINT NOT NULL AUTO_INCREMENT,
    customer_id BIGINT,
    patient_id BIGINT,
    route_id BIGINT,
    escort_date DATE,
    estimated_meeting_time TIME,
    estimated_return_time TIME,
    purpose VARCHAR(255),
    extra_request TEXT,
    estimated_fee INT,
    status VARCHAR(255),
    created_at DATETIME(6),
    updated_at DATETIME(6),
    deleted_at DATETIME(6),
    PRIMARY KEY (id)
    ) ENGINE=InnoDB;

-- 10) 지원(매칭 시도)
CREATE TABLE IF NOT EXISTS application (
    id BIGINT NOT NULL AUTO_INCREMENT,
    recruit_id BIGINT,
    helper_id BIGINT,
    status VARCHAR(255),
    created_at DATETIME(6),
    updated_at DATETIME(6),
    deleted_at DATETIME(6),
    PRIMARY KEY (id)
    ) ENGINE=InnoDB;

-- 11) 동행
CREATE TABLE IF NOT EXISTS escort (
    id BIGINT NOT NULL AUTO_INCREMENT,
    recruit_id BIGINT,
    customer_id BIGINT,
    helper_id BIGINT,
    memo TEXT,
    status VARCHAR(255),
    actual_meeting_time TIME,
    actual_return_time TIME,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    deleted_at DATETIME(6),
    PRIMARY KEY (id)
    ) ENGINE=InnoDB;

-- 12) 리뷰
CREATE TABLE IF NOT EXISTS review (
    id BIGINT NOT NULL AUTO_INCREMENT,
    recruit_id BIGINT,
    customer_id BIGINT,
    helper_id BIGINT,
    satisfaction_level VARCHAR(255),
    negative_feedback TEXT,
    short_comment TEXT,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    deleted_at DATETIME(6),
    PRIMARY KEY (id)
    ) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS positive_feedback (
    id BIGINT NOT NULL AUTO_INCREMENT,
    description VARCHAR(255),
    created_at DATETIME(6),
    updated_at DATETIME(6),
    deleted_at DATETIME(6),
    PRIMARY KEY (id)
    ) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS positive_feedback_choice (
    id BIGINT NOT NULL AUTO_INCREMENT,
    review_id BIGINT,
    positive_feedback_id BIGINT,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    deleted_at DATETIME(6),
    PRIMARY KEY (id)
    ) ENGINE=InnoDB;

-- 13) 리포트/비용/첨부
CREATE TABLE IF NOT EXISTS report (
    id BIGINT NOT NULL AUTO_INCREMENT,
    recruit_id BIGINT,
    customer_id BIGINT,
    helper_id BIGINT,
    has_next_appointment BOOLEAN,
    next_appointment_time DATETIME(6),
    description TEXT,
    actual_meeting_time TIME,
    actual_return_time TIME,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    deleted_at DATETIME(6),
    PRIMARY KEY (id)
    ) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS taxi_fee (
    id BIGINT NOT NULL AUTO_INCREMENT,
    report_id BIGINT,
    departure_fee INT,
    departure_receipt_image_id BIGINT,
    return_fee INT,
    return_receipt_image_id BIGINT,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    deleted_at DATETIME(6),
    PRIMARY KEY (id)
    ) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS image_attachment (
    id BIGINT NOT NULL AUTO_INCREMENT,
    report_id BIGINT,
    image_id BIGINT,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    deleted_at DATETIME(6),
    PRIMARY KEY (id)
    ) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;
