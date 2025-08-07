INSERT INTO auth (id, login_id, password, name, birth_date, gender, contact, created_at, updated_at)
VALUES
    (1, 'user01', 'password01', '김민수', '1995-03-15', 'MALE', '010-1234-5678', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, 'user02', 'password02', '이서연', '1998-07-22', 'FEMALE', '010-2345-6789', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (3, 'user03', 'password03', '박지훈', '1992-11-30', 'MALE', '010-3456-7890', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (4, 'user04', 'password04', '최유진', '2000-01-10', 'FEMALE', '010-4567-8901', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (5, 'user05', 'password05', '정우성', '1989-05-05', 'MALE', '010-5678-9012', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO patient (
    id, customer_id, latest_location_id, name, image_url, age, gender, contact,
    needs_helping, uses_wheelchair, has_cognitive_issue, cognitive_issue_detail,
    has_communication_issue, communication_issue_detail,
    created_at, updated_at
) VALUES
      (1, 1, NULL, '김영희', 'https://example.com/img1.jpg', 78, 'FEMALE', '010-1111-2222',
       true, true, true, '["판단에 도움이 필요해요", "기억하거나 이해하는 것이 어려워요"]' FORMAT JSON,
       true, '말이 느리고 단어를 잘 잊음',
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

      (2, 2, NULL, '박철수', 'https://example.com/img2.jpg', 82, 'MALE', '010-2222-3333',
       true, false, false, NULL,
       false, NULL,
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

      (3, 3, NULL, '최은주', 'https://example.com/img3.jpg', 76, 'FEMALE', '010-3333-4444',
       false, false, true, '["상황 파악에 도움이 필요해요"]' FORMAT JSON,
       true, '청각 장애로 의사소통 어려움',
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

      (4, 4, NULL, '정재훈', 'https://example.com/img4.jpg', 85, 'MALE', '010-4444-5555',
       true, true, true, '["기억하거나 이해하는 것이 어려워요", "상황 파악에 도움이 필요해요"]' FORMAT JSON,
       false, NULL,
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

      (5, 5, NULL, '이수진', 'https://example.com/img5.jpg', 79, 'FEMALE', '010-5555-6666',
       false, false, false, NULL,
       false, NULL,
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO helper_profile (
    id, auth_id, latest_location_id, image_url, strength, short_bio, area,
    created_at, updated_at
) VALUES
      (1, 1, NULL, 'https://example.com/helper1.jpg',
       '["유연한 일정 조율", "의사소통 능력 우수"]' FORMAT JSON,
       '마음을 편하게 해주는 동행을 추구합니다.',
       'SEOUL', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

      (2, 2, NULL, 'https://example.com/helper2.jpg',
       '["응급 상황 대처 경험", "노약자 돌봄 경험 풍부"]' FORMAT JSON,
       '의료 기관 봉사 경험이 있습니다.',
       'BUSAN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

      (3, 3, NULL, 'https://example.com/helper3.jpg',
       '["친절한 태도", "기본적인 수화 가능"]' FORMAT JSON,
       '언어 소통이 어려운 분들과도 편하게 대화합니다.',
       'DAEGU', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

      (4, 4, NULL, 'https://example.com/helper4.jpg',
       '["체력 좋음", "운전 가능"]' FORMAT JSON,
       '거동이 불편하신 분들을 도와드린 경험이 많습니다.',
       'INCHEON', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

      (5, 5, NULL, 'https://example.com/helper5.jpg',
       '["시간 약속 철저", "장거리 이동도 가능"]' FORMAT JSON,
       '도심 외곽 지역도 지원 가능합니다.',
       'GWANGJU', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


INSERT INTO certificate (id, helper_profile_id, type, image_url, created_at, updated_at)
VALUES
    (1, 1, '간호조무사 자격증', 'https://example.com/cert/helper1_nurse_assistant.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, 1, '응급처치 교육 수료증', 'https://example.com/cert/helper1_emergency.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (3, 2, '사회복지사 자격증', 'https://example.com/cert/helper2_social_worker.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (4, 3, '수화 통역사 자격증', 'https://example.com/cert/helper3_sign_language.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (5, 4, '요양보호사 자격증', 'https://example.com/cert/helper4_caregiver.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (6, 4, '운전면허증', 'https://example.com/cert/helper4_driver.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (7, 5, '시간관리 교육 수료증', 'https://example.com/cert/helper5_time_management.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


INSERT INTO location_info (
    id, place_name, upper_addr_name, middle_addr_name, lower_addr_name,
    first_no, second_no, road_name, first_building_no, second_building_no,
    detail_address, longitude, latitude, created_at, updated_at
) VALUES
      (1, '서울삼성병원', '서울특별시', '강남구', '일원동', '50', '0', '일원로', '81', '', '외래센터', 127.084, 37.489, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (2, '서울아산병원', '서울특별시', '송파구', '풍납동', '388', '0', '올림픽로43길', '88', '', '응급센터', 127.107, 37.527, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (3, '서울대병원', '서울특별시', '종로구', '연건동', '28', '0', '대학로', '101', '', '본관', 126.998, 37.580, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (4, '신촌세브란스병원', '서울특별시', '서대문구', '신촌동', '134', '0', '연세로', '50', '', '본관', 126.936, 37.563, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (5, '한양대병원', '서울특별시', '성동구', '행당동', '17', '0', '왕십리로', '222', '', '입원센터', 127.045, 37.557, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO route (
    id, meeting_location_info_id, hospital_location_info_id, return_location_info_id,
    created_at, updated_at
) VALUES
      (1, 1, 2, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (2, 2, 3, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (3, 3, 4, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (4, 4, 5, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (5, 5, 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


INSERT INTO recruit (
    id, customer_id, patient_id, route_id, escort_date,
    estimated_meeting_time, estimated_return_time,
    purpose, extra_request, estimated_fee, status,
    created_at, updated_at
) VALUES
      (1, 1, 1, 1, '2025-08-01', '09:00:00', '11:00:00',
       '진료', '장시간 대기 시 물 챙겨주세요.', 30000, 'DONE',
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

      (2, 2, 2, 2, '2025-08-02', '10:30:00', '13:00:00',
       '정기검진', '휠체어 밀어주실 수 있으면 좋겠습니다.', 25000, 'DONE',
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

      (3, 3, 3, 3, '2025-08-03', '08:00:00', '10:30:00',
       '재활', '병원 문 앞에서 바로 만나고 싶어요.', 28000, 'DONE',
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

      (4, 4, 4, 4, '2025-08-04', '13:00:00', '15:30:00',
       '물리치료', '말벗이 되어주시면 좋겠어요.', 22000, 'DONE',
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

      (5, 5, 5, 5, '2025-08-05', '14:00:00', '16:00:00',
       '진료', '되도록이면 여자 도우미였으면 해요.', 35000, 'DONE',
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

      (6, 1, 2, 1, '2025-08-06', '09:30:00', '12:00:00',
       '정기검진', '점심시간 전에는 끝나면 좋겠어요.', 27000, 'DONE',
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

      (7, 2, 3, 2, '2025-08-07', '10:00:00', '12:30:00',
       '건강검진', '대중교통 이동 가능 여부 알려주세요.', 26000, 'MATCHING',
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

      (8, 3, 4, 3, '2025-08-08', '08:30:00', '11:00:00',
       '물리치료', '약 복용 시간 고려해 주세요.', 24000, 'IN_PROGRESS',
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

      (9, 4, 5, 4, '2025-08-09', '14:00:00', '17:00:00',
       '재활', '병원에서 바로 귀가 가능한지 확인 부탁드립니다.', 31000, 'COMPLETED',
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

      (10, 5, 1, 5, '2025-08-10', '09:00:00', '11:30:00',
       '진료', '날씨에 따라 우산 챙겨주세요.', 33000, 'DONE',
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


INSERT INTO application (id, recruit_id, helper_id, status, created_at, updated_at)
VALUES
    (1, 1, 1, 'MATCHED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, 1, 2, 'FAILED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (3, 2, 3, 'MATCHED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (4, 3, 4, 'MATCHED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (5, 3, 2, 'FAILED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (6, 4, 2, 'MATCHED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (7, 5, 1, 'MATCHED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (8, 6, 5, 'MATCHED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (9, 10, 3, 'MATCHED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (10, 9, 4, 'MATCHED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (11, 9, 5, 'FAILED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (12, 7, 1, 'PENDING', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (13, 7, 2, 'PENDING', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (14, 7, 5, 'PENDING', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


INSERT INTO escort (
    id, recruit_id, customer_id, helper_id, memo, status,
    created_at, updated_at
) VALUES
      (1, 1, 1, 1, '정시에 도착했고 만족도가 높았습니다.', 'DONE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (2, 2, 2, 3, '친절하게 응대해주셨어요.', 'WRITING_REPORT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (3, 3, 3, 4, '도움이 정말 많이 되었습니다.', 'DONE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (4, 4, 4, 2, '추운 날씨에도 감사합니다.', 'WRITING_REPORT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (5, 5, 5, 1, '장시간 동행도 문제없었습니다.', 'DONE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (6, 6, 1, 5, '거동 불편한 환자도 안전하게 도와주심.', 'DONE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (7, 10, 5, 3, '귀가까지 함께해주셔서 감사했습니다.', 'WRITING_REPORT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

      (8, 9, 4, 4, '병원 방문 준비 중입니다.', 'PREPARING', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

      (9, 8, 3, 5, '진료실 입장 대기 중입니다.', 'IN_TREATMENT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

ALTER TABLE escort ALTER COLUMN id RESTART WITH 10;

INSERT INTO review (
    id, recruit_id, customer_id, helper_id,
    satisfaction_level, negative_feedback, short_comment,
    created_at, updated_at
) VALUES
      (1, 1, 1, 1, 'GOOD', NULL, '정말 친절하고 따뜻했어요.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

      (2, 2, 2, 3, 'GOOD', NULL, '전반적으로 만족스러웠습니다.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

      (3, 3, 3, 4, 'GOOD', NULL, '말벗도 되어주셔서 감사했어요.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

      (4, 4, 4, 2, 'AVERAGE', NULL, '무난했습니다.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

      (5, 5, 5, 1, 'GOOD', NULL, '시간 약속 잘 지켜주셨어요.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

      (6, 6, 1, 5, 'BAD', '소통이 조금 어려웠어요.', '개선되면 좋겠어요.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

      (7, 10, 5, 3, 'GOOD', NULL, '안심하고 맡길 수 있었어요.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


INSERT INTO positive_feedback (id, description, created_at, updated_at) VALUES
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
(15, 6, 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(16, 7, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(17, 7, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(18, 7, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(19, 7, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(20, 7, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(21, 7, 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


INSERT INTO report (
    id, recruit_id, customer_id, helper_id,
    actual_meeting_time, actual_return_time,
    has_next_appointment, next_appointment_time,
    description,
    created_at, updated_at
) VALUES
      (1, 1, 1, 1, '09:05:00', '11:10:00', false, NULL, '예정된 시간에 잘 만났고, 병원 진료도 원활히 진행되었습니다.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

      (2, 2, 2, 3, '10:40:00', '13:05:00', true, '2025-09-01 10:30:00', '다음 정기 검진 일정이 있어 재방문 예정입니다.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

      (3, 3, 3, 4, '08:05:00', '10:45:00', false, NULL, '재활 치료는 문제없이 마무리되었고, 환자 만족도 높았습니다.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

      (4, 4, 4, 2, '13:10:00', '15:35:00', false, NULL, '환자와 대화가 잘 되었고 요청 사항도 잘 반영되었습니다.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

      (5, 5, 5, 1, '14:05:00', '16:10:00', true, '2025-08-20 14:00:00', '다음 진료가 예약되어 있으며, 동일 도우미 요청 예정입니다.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

      (6, 6, 1, 5, '09:40:00', '12:15:00', false, NULL, '고령 환자였으나 무리 없이 동행 마무리.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

      (7, 10, 5, 3, '09:10:00', '11:35:00', true, '2025-08-30 10:00:00', '날씨가 좋지 않아 외부 이동에 유의 필요. 환자 상태 양호.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


INSERT INTO taxi_fee (
    id, report_id,
    departure_fee, departure_receipt_image_url,
    return_fee, return_receipt_image_url,
    created_at, updated_at
) VALUES
      (1, 1, 8500, 'https://example.com/receipt1_depart.jpg', 9200, 'https://example.com/receipt1_return.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

      (2, 2, 7800, 'https://example.com/receipt2_depart.jpg', 8100, 'https://example.com/receipt2_return.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

      (3, 3, 7900, 'https://example.com/receipt3_depart.jpg', 8800, 'https://example.com/receipt3_return.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

      (4, 4, 10000, 'https://example.com/receipt4_depart.jpg', 9700, 'https://example.com/receipt4_return.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

      (5, 5, 6700, 'https://example.com/receipt5_depart.jpg', 7300, 'https://example.com/receipt5_return.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

      (6, 6, 9100, 'https://example.com/receipt6_depart.jpg', 9400, 'https://example.com/receipt6_return.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

      (7, 7, 8900, 'https://example.com/receipt7_depart.jpg', 9100, 'https://example.com/receipt7_return.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


INSERT INTO image_attachment (
    id, report_id, image_url, created_at, updated_at
) VALUES
      (1, 1, 'https://example.com/report1_img1.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (2, 1, 'https://example.com/report1_img2.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

      (3, 2, 'https://example.com/report2_img1.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

      (4, 3, 'https://example.com/report3_img1.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (5, 3, 'https://example.com/report3_img2.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

      (6, 4, 'https://example.com/report4_img1.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

      (7, 5, 'https://example.com/report5_img1.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

      (8, 6, 'https://example.com/report6_img1.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      (9, 6, 'https://example.com/report6_img2.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

      (10, 7, 'https://example.com/report7_img1.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


