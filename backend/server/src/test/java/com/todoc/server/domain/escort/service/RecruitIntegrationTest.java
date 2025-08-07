package com.todoc.server.domain.escort.service;

import com.todoc.server.common.enumeration.RecruitStatus;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.escort.exception.RecruitInvalidCancelException;
import com.todoc.server.domain.escort.exception.RecruitNotFoundException;
import com.todoc.server.domain.escort.web.dto.request.RecruitCreateRequest;
import com.todoc.server.domain.escort.web.dto.response.RecruitDetailResponse;
import com.todoc.server.domain.escort.web.dto.response.RecruitListResponse;
import com.todoc.server.domain.escort.web.dto.response.RecruitPaymentResponse;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE) // 실제 DB 사용 시
@Transactional
@ActiveProfiles("test")
@Sql("/sql/data.sql")
public class RecruitIntegrationTest {

    @Autowired
    private RecruitService recruitService;

    @Autowired
    private RecruitFacadeService recruitFacadeService;

    @PersistenceContext
    private EntityManager em;

    @Test
    @DisplayName("동행 신청 단건 조회 - 정상")
    void getRecruitById_정상() {
        // given
        Long recruitId = 4L;

        // when
        Recruit response = recruitService.getRecruitById(recruitId);

        // then
        assertThat(response).isNotNull();
        assertThat(response.getPatient().getName()).isEqualTo("정재훈");
        assertThat(response.getRoute().getHospitalLocationInfo().getPlaceName()).isEqualTo("한양대병원");
    }

    @Test
    @DisplayName("동행 신청 단건 조회 - 존재하지 않는 신청")
    void getRecruitById_존재하지않는신청() {
        // given
        Long recruitId = 999L;

        // when & then
        assertThatThrownBy(() -> recruitService.getRecruitById(recruitId))
                .isInstanceOf(RecruitNotFoundException.class);
    }

    @Test
    @DisplayName("고객의 동행 목록 조회 - 정상")
    void getRecruitListAsCustomerByUserId_정상() {
        // given
        Long userId = 2L;

        // when
        RecruitListResponse response = recruitService.getRecruitListAsCustomerByUserId(userId);

        // then
        assertThat(response).isNotNull();
        assertThat(response.getInProgressList().size()).isEqualTo(1);
        assertThat(response.getCompletedList().size()).isEqualTo(1);
        assertThat(response.getCompletedList().getFirst().getDestination()).isEqualTo("서울대병원");
    }

    @Test
    @DisplayName("동행 신청의 상세 정보 조회 - 정상")
    void getRecruitDetailByRecruitId_정상() {
        // given
        Long recruitId = 1L;

        // when
        RecruitDetailResponse response = recruitService.getRecruitDetailByRecruitId(recruitId);

        // then
        assertThat(response).isNotNull();
        assertThat(response.getStatus()).isEqualTo(RecruitStatus.DONE);
        assertThat(response.getPatient().getName()).isEqualTo("김영희");
        assertThat(response.getPurpose()).isEqualTo("진료");
        assertThat(response.getRoute().getHospitalLocationInfo().getPlaceName()).isEqualTo("서울아산병원");
    }

    @Test
    @DisplayName("동행 신청 결제 정보 조회 - 정상")
    void getRecruitPaymentByRecruitId_정상() {
        // given
        Long recruitId = 1L;

        // when
        RecruitPaymentResponse response = recruitService.getRecruitPaymentByRecruitId(recruitId);

        // then
        assertThat(response).isNotNull();
        assertThat(response.getRecruitId()).isEqualTo(recruitId);
        assertThat(response.getRoute()).isNotNull();
        assertThat(response.getBaseFee()).isEqualTo(35000);
        assertThat(response.getExpectedTaxiFee()).isEqualTo(0); // taxi_fee(8500 + 9200)
    }

    @Test
    @DisplayName("동행 신청 생성 - 정상")
    void createRecruit_정상생성() {
        // given
        RecruitCreateRequest request = createSampleRequest();

        // when
        recruitFacadeService.createRecruit(request);

        // then
        List<Recruit> all = recruitService.getAllRecruits();
        assertThat(all.size()).isEqualTo(11);

        Recruit created = all.getLast();
        assertThat(created.getPatient()).isNotNull();
        assertThat(created.getPatient().getName()).isEqualTo("홍길동");
        assertThat(created.getRoute()).isNotNull();
        assertThat(created.getRoute().getMeetingLocationInfo().getPlaceName()).isEqualTo("강서병원");
    }

    @Test
    @DisplayName("동행 신청 취소 - 정상")
    void cancelRecruit_정상케이스() {
        // given
        Long recruitId = 7L;

        // when
        recruitService.cancelRecruit(recruitId);
        em.flush();
        em.clear();

        // then
        assertThatThrownBy(() -> recruitService.getRecruitById(recruitId))
                .isInstanceOf(RecruitNotFoundException.class);
    }

    @Test
    @DisplayName("동행 신청 취소 - 매칭 중이 아닌 신청을 취소하려는 경우")
    void cancelRecruit_매칭중이아닌경우() {
        // given
        Long recruitId = 3L;

        // when & then
        assertThrows(RecruitInvalidCancelException.class, () -> {
            recruitService.cancelRecruit(recruitId);
        });
    }

    private RecruitCreateRequest createSampleRequest() {
        RecruitCreateRequest request = new RecruitCreateRequest();

        // Patient
        RecruitCreateRequest.PatientDetail patient = new RecruitCreateRequest.PatientDetail();
        ReflectionTestUtils.setField(patient, "imageUrl", "https://example.com/patient.png");
        ReflectionTestUtils.setField(patient, "name", "홍길동");
        ReflectionTestUtils.setField(patient, "age", 81);
        ReflectionTestUtils.setField(patient, "gender", "남자");
        ReflectionTestUtils.setField(patient, "phoneNumber", "010-1234-5678");
        ReflectionTestUtils.setField(patient, "needsHelping", true);
        ReflectionTestUtils.setField(patient, "usesWheelchair", true);
        ReflectionTestUtils.setField(patient, "hasCognitiveIssue", true);
        ReflectionTestUtils.setField(patient, "cognitiveIssueDetail", "판단에 도움이 필요해요");
        ReflectionTestUtils.setField(patient, "hasCommunicationIssue", true);
        ReflectionTestUtils.setField(patient, "communicationIssueDetail", "이가 많이 없으셔서.. 천천히 이야기 들어주세요");

        // Escort
        RecruitCreateRequest.EscortDetail escort = new RecruitCreateRequest.EscortDetail();
        ReflectionTestUtils.setField(escort, "escortDate", LocalDate.now());
        ReflectionTestUtils.setField(escort, "estimatedMeetingTime", LocalTime.of(9, 30));
        ReflectionTestUtils.setField(escort, "estimatedReturnTime", LocalTime.of(12, 30));
        ReflectionTestUtils.setField(escort, "purpose", "정기 진료");
        ReflectionTestUtils.setField(escort, "extraRequest", "약 수령도 부탁드립니다.");

        // Location 공통
        RecruitCreateRequest.LocationDetail location = new RecruitCreateRequest.LocationDetail();
        ReflectionTestUtils.setField(location, "placeName", "강서병원");
        ReflectionTestUtils.setField(location, "upperAddrName", "서울");
        ReflectionTestUtils.setField(location, "middleAddrName", "강서구");
        ReflectionTestUtils.setField(location, "lowerAddrName", "화곡동");
        ReflectionTestUtils.setField(location, "firstAddrNo", "100");
        ReflectionTestUtils.setField(location, "secondAddrNo", "10");
        ReflectionTestUtils.setField(location, "roadName", "화곡로");
        ReflectionTestUtils.setField(location, "firstBuildingNo", "101");
        ReflectionTestUtils.setField(location, "secondBuildingNo", "1");
        ReflectionTestUtils.setField(location, "detailAddress", "101동 201호");
        ReflectionTestUtils.setField(location, "longitude", new BigDecimal("126.85"));
        ReflectionTestUtils.setField(location, "latitude", new BigDecimal("37.55"));

        ReflectionTestUtils.setField(request, "patientDetail", patient);
        ReflectionTestUtils.setField(request, "escortDetail", escort);
        ReflectionTestUtils.setField(request, "meetingLocationDetail", location);
        ReflectionTestUtils.setField(request, "destinationDetail", location);
        ReflectionTestUtils.setField(request, "returnLocationDetail", location);

        return request;
    }
}
