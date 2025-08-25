package com.todoc.server.domain.escort.service.recruit;


import com.todoc.server.IntegrationTest;
import com.todoc.server.MockitoBeanIntegrationTest;
import com.todoc.server.common.dto.request.ImageCreateRequest;
import com.todoc.server.common.util.FeeUtils;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.escort.repository.RecruitJpaRepository;
import com.todoc.server.domain.escort.service.RecruitFacadeService;
import com.todoc.server.domain.escort.web.dto.request.RecruitCreateRequest;
import com.todoc.server.external.tmap.service.TMapRouteParser;
import com.todoc.server.external.tmap.service.TMapRouteService;
import com.todoc.server.external.tmap.service.TMapRouteService.TMapRawResult;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;

@Transactional
public class RecruitIntegrationTest extends MockitoBeanIntegrationTest {

    @Autowired
    private RecruitFacadeService recruitFacadeService;

    @Autowired
    private RecruitJpaRepository recruitJpaRepository;

    @PersistenceContext
    private EntityManager em;

    @Nested
    @DisplayName("동행 신청 생성")
    class CreateRecruit {

        @Test
        @DisplayName("정상 생성 시 Recruit/Patient/Route/RouteLeg 모두 저장되고 연관관계가 매핑된다")
        void 정상생성() {
            // given
            Long authId = 1L; // seed의 사용자

            RecruitCreateRequest request = recruitRequestFixture();

            // TMap 모의 응답(두 구간)
            given(tMapRouteService.getRoute(any()))
                .willReturn(new TMapRawResult("{}", "[]"))
                .willReturn(new TMapRawResult("{}", "[]"));

            // 병원 가는 구간 요약 + 복귀 구간 요약
            var legA = new TMapRouteParser.RouteLegSummary(5_000, 900, 3_000, 15_000);
            var legB = new TMapRouteParser.RouteLegSummary(7_000, 1_100, 4_000, 22_000);

            given(tMapRouteParser.parseSummaryFromRaw(anyString()))
                .willReturn(new TMapRouteParser.RouteParseResult(List.of(), legA))
                .willReturn(new TMapRouteParser.RouteParseResult(List.of(), legB));

            int before = recruitJpaRepository.findAll().size();

            // when
            recruitFacadeService.createRecruit(authId, request);
            em.flush();
            em.clear();

            // then
            // 1) 신규 행 생성 확인
            var all = recruitJpaRepository.findAll();
            assertThat(all).hasSize(before + 1);

            // 새로 생긴 recruit id 추출
            Long newId = ((Number) em.createNativeQuery("select max(id) from recruit").getSingleResult()).longValue();
            Recruit saved = recruitJpaRepository.findById(newId).orElseThrow();

            // 2) 연관관계 매핑 검증
            assertThat(saved.getCustomer().getId()).isEqualTo(authId);
            assertThat(saved.getPatient()).isNotNull();
            assertThat(saved.getRoute()).isNotNull();

            // 3) 환자 프로필 이미지가 저장되었는지 (ImageFileService.register 경유)
            assertThat(saved.getPatient().getPatientProfileImage()).isNotNull();
            assertThat(saved.getPatient().getName()).isEqualTo("김영희(신규)");

            // 4) 라우트/위치 정보가 매핑되었는지
            var route = saved.getRoute();
            assertThat(route.getMeetingLocationInfo()).isNotNull();
            assertThat(route.getHospitalLocationInfo()).isNotNull();
            assertThat(route.getReturnLocationInfo()).isNotNull();

            // 좌표값(등록 요청값)이 반영되었는지
            assertThat(route.getMeetingLocationInfo().getLongitude()).isEqualByComparingTo(new BigDecimal("127.2581225"));
            assertThat(route.getMeetingLocationInfo().getLatitude()).isEqualByComparingTo(new BigDecimal("36.4809912"));
            assertThat(route.getHospitalLocationInfo().getLongitude()).isEqualByComparingTo(new BigDecimal("126.9784043"));
            assertThat(route.getHospitalLocationInfo().getLatitude()).isEqualByComparingTo(new BigDecimal("37.5670240"));
            assertThat(route.getReturnLocationInfo().getLongitude()).isEqualByComparingTo(new BigDecimal("127.1234567"));
            assertThat(route.getReturnLocationInfo().getLatitude()).isEqualByComparingTo(new BigDecimal("36.9876543"));

            // 5) 두 개의 RouteLeg가 저장되고 매핑되었는지
            assertThat(route.getMeetingToHospital()).isNotNull();
            assertThat(route.getHospitalToReturn()).isNotNull();
            assertThat(route.getMeetingToHospital().getTaxiFare()).isEqualTo(15_000);
            assertThat(route.getHospitalToReturn().getTaxiFare()).isEqualTo(22_000);
            assertThat(route.getMeetingToHospital().getTotalFare()).isEqualTo(3_000);
            assertThat(route.getHospitalToReturn().getTotalFare()).isEqualTo(4_000);

            // 6) 예상 요금 계산 검증 (기본요금 + 두 구간 totalFare 합)
            int base = FeeUtils.calculateTotalFee(
                request.getEscortDetail().getEstimatedMeetingTime(),
                request.getEscortDetail().getEstimatedReturnTime()
            );
            int expected = base + 3_000 + 4_000;
            assertThat(saved.getEstimatedFee()).isEqualTo(expected);

            // 7) 기타 필드 확인(목적/요청사항/날짜/시간)
            assertThat(saved.getPurpose()).isEqualTo("정기검진");
            assertThat(saved.getExtraRequest()).isEqualTo("휠체어 도움 부탁드려요");
            assertThat(saved.getEscortDate()).isEqualTo(LocalDate.of(2025, 8, 15));
            assertThat(saved.getEstimatedMeetingTime()).isEqualTo(LocalTime.of(9, 0));
            assertThat(saved.getEstimatedReturnTime()).isEqualTo(LocalTime.of(11, 30));
        }

        private RecruitCreateRequest recruitRequestFixture() {
            var req = new RecruitCreateRequest();

            // 환자 상세
            var patient = new RecruitCreateRequest.PatientDetail();
            ReflectionTestUtils.setField(patient, "name", "김영희(신규)");
            ReflectionTestUtils.setField(patient, "age", 80);
            ReflectionTestUtils.setField(patient, "gender", "여자");
            ReflectionTestUtils.setField(patient, "phoneNumber", "01099998888");
            ReflectionTestUtils.setField(patient, "needsHelping", true);
            ReflectionTestUtils.setField(patient, "usesWheelchair", true);
            ReflectionTestUtils.setField(patient, "hasCognitiveIssue", true);
            ReflectionTestUtils.setField(patient, "cognitiveIssueDetail", List.of("기억하거나 이해하는 것이 어려워요"));
            ReflectionTestUtils.setField(patient, "hasCommunicationIssue", false);
            ReflectionTestUtils.setField(patient, "communicationIssueDetail", "");
            ReflectionTestUtils.setField(patient, "profileImageCreateRequest",
                image("uploads/patient/new.png", "image/png", 123_456, "\"etag-new\""));

            // 동행 상세
            var escort = new RecruitCreateRequest.EscortDetail();
            ReflectionTestUtils.setField(escort, "escortDate", LocalDate.of(2025, 8, 15));
            ReflectionTestUtils.setField(escort, "estimatedMeetingTime", LocalTime.of(9, 0));
            ReflectionTestUtils.setField(escort, "estimatedReturnTime", LocalTime.of(11, 30));
            ReflectionTestUtils.setField(escort, "purpose", "정기검진");
            ReflectionTestUtils.setField(escort, "extraRequest", "휠체어 도움 부탁드려요");

            // 위치 상세 (만남/병원/복귀)
            var meeting = location("서울 강남구", "테헤란로", "427", null,
                "삼성역 4번 출구", "127.2581225", "36.4809912");
            var hospital = location("서울 중구", "세종대로", "110", null,
                "서울의료원", "126.9784043", "37.5670240");
            var backHome = location("서울 송파구", "백제고분로", "123", null,
                "석촌호수", "127.1234567", "36.9876543");

            ReflectionTestUtils.setField(req, "patientDetail", patient);
            ReflectionTestUtils.setField(req, "escortDetail", escort);
            ReflectionTestUtils.setField(req, "meetingLocationDetail", meeting);
            ReflectionTestUtils.setField(req, "destinationDetail", hospital);
            ReflectionTestUtils.setField(req, "returnLocationDetail", backHome);
            return req;
        }

        private RecruitCreateRequest.LocationDetail location(
            String middleAddr, String roadName, String firstBuildingNo, String secondBuildingNo,
            String placeName, String lon, String lat
        ) {
            var ld = new RecruitCreateRequest.LocationDetail();
            ReflectionTestUtils.setField(ld, "upperAddrName", "서울");
            ReflectionTestUtils.setField(ld, "middleAddrName", middleAddr);
            ReflectionTestUtils.setField(ld, "lowerAddrName", "상세동");
            ReflectionTestUtils.setField(ld, "roadName", roadName);
            ReflectionTestUtils.setField(ld, "firstBuildingNo", firstBuildingNo);
            ReflectionTestUtils.setField(ld, "secondBuildingNo", secondBuildingNo);
            ReflectionTestUtils.setField(ld, "placeName", placeName);
            ReflectionTestUtils.setField(ld, "longitude", new BigDecimal(lon));
            ReflectionTestUtils.setField(ld, "latitude", new BigDecimal(lat));
            return ld;
        }

        private ImageCreateRequest image(String key, String contentType, long size, String checksum) {
            var dto = new ImageCreateRequest();
            ReflectionTestUtils.setField(dto, "s3Key", key);
            ReflectionTestUtils.setField(dto, "contentType", contentType);
            ReflectionTestUtils.setField(dto, "size", size);
            ReflectionTestUtils.setField(dto, "checksum", checksum);
            return dto;
        }
    }
}
