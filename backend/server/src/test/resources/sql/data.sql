INSERT INTO auth (id, login_id, password, name, birth_date, gender, contact, created_at, updated_at, deleted_at)
VALUES
    (1, 'user01', '$2a$12$Aq86sdOQfrFnzqPEW/eCteGwyxUL9Cl/Qya7w0.O7eYl9v0MnNvX2', '김민수', '1995-03-15', 'MALE', '010-1234-5678', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
    (2, 'user02', '$2a$12$Aq86sdOQfrFnzqPEW/eCteGwyxUL9Cl/Qya7w0.O7eYl9v0MnNvX2', '이서연', '1998-07-22', 'FEMALE', '010-2345-6789', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
    (3, 'user03', '$2a$12$Aq86sdOQfrFnzqPEW/eCteGwyxUL9Cl/Qya7w0.O7eYl9v0MnNvX2', '박지훈', '1992-11-30', 'MALE', '010-3456-7890', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
    (4, 'user04', '$2a$12$Aq86sdOQfrFnzqPEW/eCteGwyxUL9Cl/Qya7w0.O7eYl9v0MnNvX2', '최유진', '2000-01-10', 'FEMALE', '010-4567-8901', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
    (5, 'user05', '$2a$12$Aq86sdOQfrFnzqPEW/eCteGwyxUL9Cl/Qya7w0.O7eYl9v0MnNvX2', '정우성', '1989-05-05', 'MALE', '010-5678-9012', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
    (6, 'user06', '$2a$12$Aq86sdOQfrFnzqPEW/eCteGwyxUL9Cl/Qya7w0.O7eYl9v0MnNvX2', '한지민', '1993-09-08', 'FEMALE', '010-6789-0123', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null);


INSERT INTO image_file (id, s3_key, content_type, size_bytes, checksum, created_at, updated_at, deleted_at)
VALUES (1, 'uploads/patient/33ea86d5-2cf7-463c-ab87-3e01c5cc45bd.png', 'image/png', 0, 'e1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
       (2, 'uploads/patient/2317063e-39c2-4cef-9950-32b5b7db6368.png', 'image/png', 0, 'e2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
       (3, 'uploads/patient/bd47cd02-52e2-4e6f-bd4c-b854f184d5b1.png', 'image/png', 0, 'e3', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
       (4, 'uploads/patient/780dc135-b884-4524-a002-f31fd180882d.png', 'image/png', 0, 'e4', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
       (5, 'uploads/patient/8dd57eba-8c9a-48b9-8757-98de2ffd5c3c.png', 'image/png', 0, 'e5', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
       (6, 'uploads/certificate/570435b2-1579-4a72-b1fb-ff70523e40f8.png', 'image/png', 0, 'e1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
       (7, 'uploads/certificate/570435b2-1579-4a72-b1fb-ff70523e40f8.png', 'image/png', 0, 'e2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
       (8, 'uploads/certificate/570435b2-1579-4a72-b1fb-ff70523e40f8.png', 'image/png', 0, 'e3', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
       (9, 'uploads/certificate/570435b2-1579-4a72-b1fb-ff70523e40f8.png', 'image/png', 0, 'e4', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
       (10, 'uploads/certificate/570435b2-1579-4a72-b1fb-ff70523e40f8.png', 'image/png', 0, 'e5', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
       (11, 'uploads/certificate/570435b2-1579-4a72-b1fb-ff70523e40f8.png', 'image/png', 0, 'e6', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
       (12, 'uploads/certificate/570435b2-1579-4a72-b1fb-ff70523e40f8.png', 'image/png', 0, 'e7', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
       (101, 'uploads/taxi/0c75237c-2d6d-4f02-aa15-70426c6fd449.png', 'image/png', 102400, '"etag-dep-1"', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
       (102, 'uploads/taxi/0c75237c-2d6d-4f02-aa15-70426c6fd449.png', 'image/png', 204800, '"etag-ret-1"', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
       (103, 'uploads/taxi/0c75237c-2d6d-4f02-aa15-70426c6fd449.png', 'image/png', 102400, '"etag-dep-2"', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
       (104, 'uploads/taxi/0c75237c-2d6d-4f02-aa15-70426c6fd449.png', 'image/png', 204800, '"etag-ret-2"', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
       (105, 'uploads/taxi/0c75237c-2d6d-4f02-aa15-70426c6fd449.png', 'image/png', 102400, '"etag-dep-3"', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
       (106, 'uploads/taxi/0c75237c-2d6d-4f02-aa15-70426c6fd449.png', 'image/png', 204800, '"etag-ret-3"', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
       (107, 'uploads/taxi/0c75237c-2d6d-4f02-aa15-70426c6fd449.png', 'image/png', 102400, '"etag-dep-4"', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
       (108, 'uploads/taxi/0c75237c-2d6d-4f02-aa15-70426c6fd449.png', 'image/png', 204800, '"etag-ret-4"', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
       (111, 'uploads/taxi/0c75237c-2d6d-4f02-aa15-70426c6fd449.png', 'image/png', 102400, '"etag-dep-6"', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
       (112, 'uploads/taxi/0c75237c-2d6d-4f02-aa15-70426c6fd449.png', 'image/png', 204800, '"etag-ret-6"', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
       (109, 'uploads/taxi/0c75237c-2d6d-4f02-aa15-70426c6fd449.png', 'image/png', 102400, '"etag-dep-5"', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
       (113, 'uploads/taxi/0c75237c-2d6d-4f02-aa15-70426c6fd449.png', 'image/png', 102400, '"etag-dep-7"', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
       (110, 'uploads/taxi/0c75237c-2d6d-4f02-aa15-70426c6fd449.png', 'image/png', 204800, '"etag-ret-5"', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
       (114, 'uploads/taxi/0c75237c-2d6d-4f02-aa15-70426c6fd449.png', 'image/png', 204800, '"etag-ret-7"', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
       (201, 'uploads/report/59c6af32-38d8-4200-b72a-f59394751e1b.png', 'image/png', 123456, '"etag-p1"',  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
       (202, 'uploads/report/aa7f95a4-8844-446a-a029-7bf41e0e373a.png', 'image/png', 234567, '"etag-p2"',  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
       (203, 'uploads/report/59c6af32-38d8-4200-b72a-f59394751e1b.png', 'image/png', 111111, '"etag-21"',  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
       (204, 'uploads/report/aa7f95a4-8844-446a-a029-7bf41e0e373a.png', 'image/png', 222222, '"etag-31"',  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
       (205, 'uploads/report/59c6af32-38d8-4200-b72a-f59394751e1b.png', 'image/png', 333333, '"etag-32"',  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
       (206, 'uploads/report/aa7f95a4-8844-446a-a029-7bf41e0e373a.png', 'image/png', 444444, '"etag-41"',  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
       (207, 'uploads/report/59c6af32-38d8-4200-b72a-f59394751e1b.png', 'image/png', 555555, '"etag-51"',  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
       (208, 'uploads/report/aa7f95a4-8844-446a-a029-7bf41e0e373a.png', 'image/png', 666666, '"etag-61"',  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
       (209, 'uploads/report/59c6af32-38d8-4200-b72a-f59394751e1b.png', 'image/png', 777777, '"etag-62"',  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
       (210, 'uploads/report/aa7f95a4-8844-446a-a029-7bf41e0e373a.png', 'image/png', 888888, '"etag-71"',  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
       (211, 'uploads/helper/75057164-309e-40e6-a1d8-d66f69c0e5e5.png', 'image/png', 0, 'e1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
       (212, 'uploads/helper/1e874e01-b5d3-423e-acfc-ea45953ff64d.png', 'image/png', 0, 'e2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
       (213, 'uploads/helper/506e5072-468a-481b-86a4-6ed142293e7c.png', 'image/png', 0, 'e3', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
       (214, 'uploads/helper/b80cf275-8074-4662-980d-65547da18312.png', 'image/png', 0, 'e4', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
       (215, 'uploads/helper/1a672ac8-a37a-446d-9f9a-055241c4f0c6.png', 'image/png', 0, 'e5', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null);


INSERT INTO patient (
    id, customer_id, latest_location_id, name, patient_profile_image_id, age, gender, contact,
    needs_helping, uses_wheelchair, has_cognitive_issue, cognitive_issue_detail,
    has_communication_issue, communication_issue_detail,
    created_at, updated_at, deleted_at
) VALUES
      (1, 1, NULL, '김영희', 1, 78, 'FEMALE', '010-1111-2222',
       TRUE, TRUE, TRUE, '["판단에 도움이 필요해요", "기억하거나 이해하는 것이 어려워요"]',
       TRUE, '말이 느리고 단어를 잘 잊음',
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),

      (2, 2, NULL, '박철수', 2, 82, 'MALE', '010-2222-3333',
       TRUE, FALSE, FALSE, '[]',
       FALSE, '',
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),

      (3, 3, NULL, '최은주', 3, 76, 'FEMALE', '010-3333-4444',
       FALSE, FALSE, TRUE, '["상황 파악에 도움이 필요해요"]',
       TRUE, '청각 장애로 의사소통 어려움',
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),

      (4, 4, NULL, '정재훈', 4, 85, 'MALE', '010-4444-5555',
       TRUE, TRUE, TRUE, '["기억하거나 이해하는 것이 어려워요", "상황 파악에 도움이 필요해요"]',
       FALSE, '',
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),

      (5, 5, NULL, '이수진', 5, 79, 'FEMALE', '010-5555-6666',
       FALSE, FALSE, FALSE, '[]',
       FALSE, '',
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null);


INSERT INTO helper_profile (
    id, auth_id, latest_location_id, helper_profile_image_id, strength, short_bio, area,
    created_at, updated_at, deleted_at
) VALUES
      (1, 1, NULL, 211,
       '["안전한 부축", "휠체어 이동", "인지장애 케어"]',
       '마음을 편하게 해주는 동행을 추구합니다.',
       'SEOUL', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),

      (2, 2, NULL, 212,
       '["안전한 부축"]',
       '의료 기관 봉사 경험이 있습니다.',
       'BUSAN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),

      (3, 3, NULL, 213,
       '["휠체어 이동", "인지장애 케어"]',
       '언어 소통이 어려운 분들과도 편하게 대화합니다.',
       'DAEGU', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),

      (4, 4, NULL, 214,
       '["휠체어 이동", "인지장애 케어"]',
       '거동이 불편하신 분들을 도와드린 경험이 많습니다.',
       'INCHEON', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),

      (5, 5, NULL, 215,
       '["안전한 부축"]',
       '도심 외곽 지역도 지원 가능합니다.',
       'GWANGJU', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null);


INSERT INTO certificate (id, helper_profile_id, type, certificate_image_id, created_at, updated_at, deleted_at)
VALUES
    (1, 1, '간호조무사', 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
    (2, 1, '요양보호사', 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
    (3, 2, '간병사', 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
    (4, 3, '간호조무사', 9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
    (5, 4, '간호조무사', 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
    (6, 4, '병원동행매니저', 11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
    (7, 5, '간호사', 12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null);


INSERT INTO location_info (
    id, place_name, upper_addr_name, middle_addr_name, lower_addr_name,
    first_no, second_no, road_name, first_building_no, second_building_no,
    detail_address, longitude, latitude, created_at, updated_at, deleted_at
) VALUES
      (1, '서울삼성병원', '서울', '강남구', '일원동', '50', '0', '일원로', '81', '', '외래센터', 127.084, 37.489, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
      (2, '서울아산병원', '서울', '송파구', '풍납동', '388', '0', '올림픽로43길', '88', '', '응급센터', 127.107, 37.527, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
      (3, '서울대병원', '서울', '종로구', '연건동', '28', '0', '대학로', '101', '', '본관', 126.998, 37.580, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
      (4, '신촌세브란스병원', '서울', '서대문구', '신촌동', '134', '0', '연세로', '50', '', '본관', 126.936, 37.563, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
      (5, '한양대병원', '서울', '성동구', '행당동', '17', '0', '왕십리로', '222', '', '입원센터', 127.045, 37.557, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null);


INSERT INTO route_leg (
    id, total_distance, total_time, total_fare, taxi_fare, used_favorite_route_vertices, coordinates,
    created_at, updated_at, deleted_at
) VALUES
      (1, 5200, 15, 3000, 15000, NULL,
       '[{"lat":127.2588619022937,"lon":36.48064064343057},{"lat":127.25865360061093,"lon":36.48016291675268},{"lat":127.25863971379688,"lon":36.48013236445513},{"lat":127.25861471754662,"lon":36.48007681482768},{"lat":127.25859527605218,"lon":36.48003237513556},{"lat":127.2585841665406,"lon":36.48001015526491},{"lat":127.25843418873735,"lon":36.4796879673371},{"lat":127.2582036672008,"lon":36.47919635296915},{"lat":127.25811201463472,"lon":36.4789797095252}]',
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),

      (2, 11200, 30, 5000, 22000, NULL,
       '[{"lat":127.0001,"lon":36.1001},{"lat":127.0002,"lon":36.1002}]',
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),

      (3, 8900, 25, 4500, 20000, NULL,
       '[{"lat":127.0101,"lon":36.1101},{"lat":127.0102,"lon":36.1102}]',
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),

      (4, 5300, 15, 3200, 15000, NULL,
       '[{"lat":127.0201,"lon":36.1201},{"lat":127.0202,"lon":36.1202}]',
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),

      (5, 4700, 14, 3000, 14000, NULL,
       '[{"lat":127.0301,"lon":36.1301},{"lat":127.0302,"lon":36.1302}]',
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),

      (6, 9100, 27, 4800, 21000, NULL,
       '[{"lat":127.0401,"lon":36.1401},{"lat":127.0402,"lon":36.1402}]',
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),

      (7, 9600, 28, 5000, 22000, NULL,
       '[{"lat":127.0501,"lon":36.1501},{"lat":127.0502,"lon":36.1502}]',
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),

      (8, 4200, 12, 2800, 13000, NULL,
       '[{"lat":127.0601,"lon":36.1601},{"lat":127.0602,"lon":36.1602}]',
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),

      (9, 3700, 10, 2500, 12000, NULL,
       '[{"lat":127.0701,"lon":36.1701},{"lat":127.0702,"lon":36.1702}]',
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),

      (10, 6100, 17, 3500, 15000, NULL,
       '[{"lat":127.0801,"lon":36.1801},{"lat":127.0802,"lon":36.1802}]',
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL);



INSERT INTO route (
    id, meeting_location_info_id, hospital_location_info_id, return_location_info_id, meeting_to_hospital_id, hospital_to_return_id, created_at, updated_at, deleted_at
) VALUES
      (1, 1, 2, 3, 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
      (2, 2, 3, 4, 3, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
      (3, 3, 4, 5, 5, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
      (4, 4, 5, 1, 7, 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
      (5, 5, 1, 2, 9, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null);


INSERT INTO recruit (
    id, customer_id, patient_id, route_id, escort_date,
    estimated_meeting_time, estimated_return_time,
    purpose, extra_request, estimated_fee, status,
    created_at, updated_at, deleted_at
) VALUES
      (1, 1, 1, 1, '2025-08-01', '09:00:00', '11:00:00',
       '진료', '장시간 대기 시 물 챙겨주세요.', 30000, 'DONE',
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),

      (2, 2, 2, 2, '2025-08-02', '10:30:00', '13:00:00',
       '정기검진', '휠체어 밀어주실 수 있으면 좋겠습니다.', 25000, 'DONE',
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),

      (3, 3, 3, 3, '2025-08-03', '08:00:00', '10:30:00',
       '재활', '병원 문 앞에서 바로 만나고 싶어요.', 28000, 'DONE',
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),

      (4, 4, 4, 4, '2025-08-04', '13:00:00', '15:30:00',
       '물리치료', '말벗이 되어주시면 좋겠어요.', 22000, 'DONE',
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),

      (5, 5, 5, 5, '2025-08-05', '14:00:00', '16:00:00',
       '진료', '되도록이면 여자 도우미였으면 해요.', 35000, 'DONE',
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),

      (6, 1, 2, 1, '2025-08-06', '09:30:00', '12:00:00',
       '정기검진', '점심시간 전에는 끝나면 좋겠어요.', 27000, 'DONE',
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),

      (7, 2, 3, 2, '2025-08-07', '10:00:00', '12:30:00',
       '건강검진', '대중교통 이동 가능 여부 알려주세요.', 26000, 'MATCHING',
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),

      (8, 2, 4, 3, '2025-08-08', '08:30:00', '11:00:00',
       '물리치료', '약 복용 시간 고려해 주세요.', 24000, 'IN_PROGRESS',
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),

      (9, 4, 5, 4, '2025-08-09', '14:00:00', '17:00:00',
       '재활', '병원에서 바로 귀가 가능한지 확인 부탁드립니다.', 31000, 'COMPLETED',
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),

      (10, 5, 1, 5, '2025-08-10', '09:00:00', '11:30:00',
       '진료', '날씨에 따라 우산 챙겨주세요.', 33000, 'DONE',
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),

      (11, 2, 1, 2, '2025-08-11', '10:00:00', '12:30:00',
       '정기검진', '처방전 잘 챙겨주세요.', 29000, 'DONE',
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),

      (12, 2, 1, 2, '2025-08-23', '15:00:00', '18:30:00',
       '정기검진', '처방전 잘 챙겨주세요.', 29000, 'COMPLETED',
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),

      (13, 3, 2, 3, '2025-08-23', '15:30:00', '18:30:00',
       '정기검진', '처방전 잘 챙겨주세요.', 29000, 'COMPLETED',
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),

      (14, 3, 1, 1, '2025-08-12', '09:00:00', '11:30:00',
       '정기검진', '빠른 이동 부탁드립니다.', 30000, 'IN_PROGRESS',
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),

      (15, 3, 2, 2, '2025-08-13', '10:00:00', '12:30:00',
       '물리치료', '도착 시 연락 부탁드립니다.', 28000, 'IN_PROGRESS',
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null);


INSERT INTO application (id, recruit_id, helper_id, status, created_at, updated_at, deleted_at)
VALUES
    (1, 1, 1, 'MATCHED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
    (2, 1, 2, 'FAILED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
    (3, 2, 3, 'MATCHED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
    (4, 3, 4, 'MATCHED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
    (5, 3, 2, 'FAILED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
    (6, 4, 2, 'MATCHED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
    (7, 5, 1, 'MATCHED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
    (8, 6, 5, 'MATCHED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
    (9, 10, 3, 'MATCHED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
    (10, 9, 4, 'MATCHED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
    (11, 9, 5, 'FAILED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
    (12, 7, 1, 'PENDING', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
    (13, 7, 2, 'PENDING', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
    (14, 7, 5, 'PENDING', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null);


INSERT INTO escort (
    id, recruit_id, customer_id, helper_id, memo, status, actual_meeting_time, actual_return_time,
    created_at, updated_at, deleted_at
) VALUES
      (1, 1, 1, 1, '다음 진료 예약 잡았습니다.', 'DONE', null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
      (2, 2, 2, 3, '상태 많이 호전되셨어요.', 'DONE', null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
      (3, 3, 3, 4, '추가 검진 필요하다고 합니다.', 'DONE', null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
      (4, 4, 4, 2, '교통체증으로 복귀가 조금 늦었습니다.', 'DONE', null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
      (5, 5, 5, 1, '약 식후 30분에 드시면 됩니다.', 'DONE', null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
      (6, 6, 1, 5, '약 다른 걸로 바꿔야 한다고 하네요.', 'DONE', null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
      (7, 10, 5, 3, '주사 한 방 맞았습니다.', 'PREPARING', null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
      (8, 9, 4, 4, NULL, 'WRITING_REPORT', null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
      (9, 8, 3, 5, '혈압 전보다 낮아지셨습니다.', 'RETURNING', null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
      (10, 11, 2, 3, NULL, 'DONE', null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
      (11, 12, 2, 2, NULL, 'PREPARING', null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
      (12, 13, 3, 2, NULL, 'MEETING', null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
      (13, 14, 1, 2, NULL, 'HEADING_TO_HOSPITAL', null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
      (14, 15, 2, 3, NULL, 'IN_TREATMENT', null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null);



INSERT INTO review (
    id, recruit_id, customer_id, helper_id,
    satisfaction_level, negative_feedback, short_comment,
    created_at, updated_at, deleted_at
) VALUES
      (1, 1, 1, 1, 'GOOD', NULL, '정말 친절하고 따뜻했어요.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),

      (2, 2, 2, 3, 'GOOD', NULL, '전반적으로 만족스러웠습니다.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),

      (3, 3, 3, 4, 'GOOD', NULL, '말벗도 되어주셔서 감사했어요.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),

      (4, 4, 4, 2, 'AVERAGE', NULL, '무난했습니다.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),

      (5, 5, 5, 1, 'GOOD', NULL, '시간 약속 잘 지켜주셨어요.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),

      (6, 6, 1, 5, 'BAD', '소통이 조금 어려웠어요.', '개선되면 좋겠어요.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null);

INSERT INTO positive_feedback (id, description, created_at, updated_at)
VALUES
    (1, '친절해요', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, '책임감', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (3, '소통이 잘돼요', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (4, '능숙해요', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (5, '리포트가 자세해요', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (6, '부축을 잘해요', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (7, '진료 지식이 많아요', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (8, '휠체어도 문제 없어요', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


INSERT INTO positive_feedback_choice (id, review_id, positive_feedback_id, created_at, updated_at)
VALUES
    (1, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, 1, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (3, 1, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (4, 2, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (5, 2, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (6, 3, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (7, 3, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (8, 3, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (9, 4, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (10, 4, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (11, 5, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (12, 5, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (13, 5, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (14, 6, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (15, 6, 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


INSERT INTO report (
    id, recruit_id, customer_id, helper_id,
    has_next_appointment, next_appointment_time,
    description, actual_meeting_time, actual_return_time,
    created_at, updated_at, deleted_at
) VALUES
      (1, 1, 1, 1,  FALSE, NULL, '예정된 시간에 잘 만났고, 병원 진료도 원활히 진행되었습니다.', '09:05:00',  '11:10:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),

      (2, 2, 2, 3,  TRUE, '2025-09-01 10:30:00', '다음 정기 검진 일정이 있어 재방문 예정입니다.', '11:40:00',  '16:40:00',CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),

      (3, 3, 3, 4,  FALSE, NULL, '재활 치료는 문제없이 마무리되었고, 환자 만족도 높았습니다.', '09:40:00',  '11:40:00',CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),

      (4, 4, 4, 2,  FALSE, NULL, '환자와 대화가 잘 되었고 요청 사항도 잘 반영되었습니다.', '11:00:00',  '17:40:00',CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),

      (5, 5, 5, 1, TRUE, '2025-08-20 14:00:00', '다음 진료가 예약되어 있으며, 동일 도우미 요청 예정입니다.', '09:40:00',  '11:40:00',CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),

      (6, 6, 1, 5, FALSE, NULL, '고령 환자였으나 무리 없이 동행 마무리.', '09:40:00',  '11:40:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),

      (7, 10, 5, 3, TRUE, '2025-08-30 10:00:00', '날씨가 좋지 않아 외부 이동에 유의 필요. 환자 상태 양호.', '11:00:00',  '15:00:00',CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null);


INSERT INTO taxi_fee (
    id, report_id,
    departure_fee, departure_receipt_image_id,
    return_fee,    return_receipt_image_id,
    created_at, updated_at, deleted_at
) VALUES
      (1, 1, 8500, 101, 9200, 102, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
      (2, 2, 7800, 103, 8100, 104, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
      (3, 3, 7900, 105, 8800, 106, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
      (4, 4, 10000, 107, 9700, 108, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
      (5, 5, 6700, 109, 7300, 110, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
      (6, 6, 9100, 111, 9400, 112, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null),
      (7, 7, 8900, 113, 9100, 114, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null);


INSERT INTO image_attachment (id, report_id, image_id, created_at, updated_at)
VALUES
    (1,  1, 201, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2,  1, 202, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (3,  2, 203, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (4,  3, 204, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (5,  3, 205, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (6,  4, 206, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (7,  5, 207, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (8,  6, 208, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (9,  6, 209, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (10, 7, 210, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
