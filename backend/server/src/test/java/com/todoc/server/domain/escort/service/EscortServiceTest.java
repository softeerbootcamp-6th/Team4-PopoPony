package com.todoc.server.domain.escort.service;

import com.todoc.server.common.enumeration.EscortStatus;
import com.todoc.server.common.enumeration.Gender;
import com.todoc.server.common.enumeration.RecruitStatus;
import com.todoc.server.common.enumeration.RouteLegType;
import com.todoc.server.domain.auth.entity.Auth;
import com.todoc.server.domain.customer.entity.Patient;
import com.todoc.server.domain.escort.entity.Escort;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.escort.exception.EscortInvalidProceedException;
import com.todoc.server.domain.escort.exception.EscortNotFoundException;
import com.todoc.server.domain.escort.repository.EscortJpaRepository;
import com.todoc.server.domain.escort.repository.EscortQueryRepository;
import com.todoc.server.domain.escort.web.dto.request.EscortMemoUpdateRequest;
import com.todoc.server.domain.escort.web.dto.response.EscortDetailResponse;
import com.todoc.server.domain.image.entity.ImageFile;
import com.todoc.server.domain.route.entity.LocationInfo;
import com.todoc.server.domain.route.entity.Route;
import com.todoc.server.domain.route.entity.RouteLeg;
import com.todoc.server.domain.route.exception.RouteLegNotFoundException;
import com.todoc.server.domain.realtime.service.SseEmitterManager;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EscortServiceTest {

    @Mock private EscortJpaRepository escortJpaRepository;
    @Mock private EscortQueryRepository escortQueryRepository;
    @Mock private SseEmitterManager emitterManager;

    @InjectMocks private EscortService escortService;

    private Escort makeEscort(Long id, EscortStatus status, Recruit recruit) {
        Escort e = new Escort();
        e.setId(id);
        e.setStatus(status);
        e.setRecruit(recruit);
        return e;
    }

    private Recruit makeRecruit(Long id) {
        Recruit r = new Recruit();
        r.setId(id);
        r.setStatus(RecruitStatus.IN_PROGRESS);
        r.setEscortDate(LocalDate.now());
        r.setEstimatedMeetingTime(LocalTime.of(10, 0));
        r.setEstimatedReturnTime(LocalTime.of(12, 0));
        r.setPurpose("검진");
        r.setExtraRequest("천천히 보행");
        return r;
    }

    private Route makeRoute(Long id, LocationInfo meetingLocation, LocationInfo hospitalLocation, LocationInfo returnLocation,
                            RouteLeg meetingToHospital, RouteLeg hospitalToReturn) {
        Route route = new Route();
        route.setId(id);
        route.setMeetingLocationInfo(meetingLocation);
        route.setHospitalLocationInfo(hospitalLocation);
        route.setReturnLocationInfo(returnLocation);
        route.setMeetingToHospital(meetingToHospital);
        route.setHospitalToReturn(hospitalToReturn);
        return route;
    }

    private LocationInfo makeLocationInfo(long id, String name) {
        LocationInfo li = new LocationInfo();
        li.setId(id);
        li.setPlaceName(name);
        return li;
    }

    private RouteLeg makeRouteLeg(Route route, RouteLegType type) {
        return RouteLeg.builder()
                .id((long) (Math.random() * 10000))
                .totalDistance(5000)
                .totalTime(15)
                .totalFare(3000)
                .taxiFare(12000)
                .usedFavoriteRouteVertices(null)
                .build();
    }

    @Nested
    @DisplayName("proceedEscort")
    class ProceedEscort {

        @Test
        @DisplayName("현재 상태가 RETURNING이면 WRITING_REPORT로 진행되고 복귀시간/Recruit.DONE 세팅")
        void proceed_from_returning_to_writingReport_setsReturnTime_and_recruitDone() {
            Recruit recruit = makeRecruit(8L);
            Escort escort = makeEscort(2L, EscortStatus.RETURNING, recruit);

            when(escortJpaRepository.findById(2L)).thenReturn(Optional.of(escort));

            escortService.proceedEscort(2L);

            assertThat(escort.getStatus()).isEqualTo(EscortStatus.WRITING_REPORT);
            assertThat(escort.getActualReturnTime()).isNotNull();
            assertThat(recruit.getStatus()).isEqualTo(RecruitStatus.DONE);
        }

        @Test
        @DisplayName("존재하지 않는 Escort ID이면 EscortNotFoundException")
        void proceed_notFound() {
            when(escortJpaRepository.findById(99L)).thenReturn(Optional.empty());
            assertThatThrownBy(() -> escortService.proceedEscort(99L))
                    .isInstanceOf(EscortNotFoundException.class);
        }

        @Test
        @DisplayName("허용 구간 외 상태에서는 EscortInvalidProceedException")
        void proceed_invalid_range() {
            Recruit recruit = makeRecruit(9L);
            Escort escort = makeEscort(3L, EscortStatus.PREPARING, recruit);
            when(escortJpaRepository.findById(3L)).thenReturn(Optional.of(escort));
            assertThatThrownBy(() -> escortService.proceedEscort(3L))
                    .isInstanceOf(EscortInvalidProceedException.class);
        }
    }

    @Nested
    @DisplayName("updateMemo")
    class UpdateMemo {

        @Test
        @DisplayName("메모 정상 업데이트")
        void updateMemo_ok() {
            Recruit recruit = makeRecruit(1L);
            Escort escort = makeEscort(10L, EscortStatus.IN_TREATMENT, recruit);
            when(escortJpaRepository.findById(10L)).thenReturn(Optional.of(escort));

            EscortMemoUpdateRequest req = new EscortMemoUpdateRequest();
            req.setMemo("환자 간단 간식 요청");

            escortService.updateMemo(10L, req);

            assertThat(escort.getMemo()).isEqualTo("환자 간단 간식 요청");
        }

        @Test
        @DisplayName("없는 Escort ID면 EscortNotFoundException")
        void updateMemo_notFound() {
            when(escortJpaRepository.findById(404L)).thenReturn(Optional.empty());
            EscortMemoUpdateRequest req = new EscortMemoUpdateRequest();
            req.setMemo("메모");
            assertThatThrownBy(() -> escortService.updateMemo(404L, req))
                    .isInstanceOf(EscortNotFoundException.class);
        }
    }

    @Nested
    @DisplayName("getEscortDetailByRecruitId")
    class GetEscortDetail {

        @Test
        @DisplayName("정상: 두 종류의 RouteLeg가 모두 있을 때 상세 응답 생성")
        void getEscortDetailByRecruitId_ok() {
            // given
            Recruit recruit = makeRecruit(100L);

            Auth customer = new Auth(); customer.setContact("010-1234-5678");
            recruit.setCustomer(customer);

            Patient patient = Patient.builder()
                    .name("김철수")
                    .age(75)
                    .patientProfileImage(new ImageFile())
                    .gender(Gender.MALE)
                    .contact("010-1111-2222")
                    .needsHelping(true)
                    .usesWheelchair(true)
                    .hasCognitiveIssue(false)
                    .cognitiveIssueDetail(null)
                    .hasCommunicationIssue(true)
                    .communicationIssueDetail("청각장애")
                    .build();
            recruit.setPatient(patient);

            LocationInfo m = makeLocationInfo(1L, "만남장소");
            LocationInfo h = makeLocationInfo(2L, "병원");
            LocationInfo r = makeLocationInfo(3L, "복귀장소");
            RouteLeg meetingToHospital = RouteLeg.builder()
                    .totalTime(130)
                    .taxiFare(14000)
                    .build();
            RouteLeg hospitalToReturn = RouteLeg.builder()
                    .totalTime(150)
                    .taxiFare(19000)
                    .build();
            Route route = makeRoute(300L, m, h, r, meetingToHospital, hospitalToReturn);
            recruit.setRoute(route);

            Escort escort = makeEscort(200L, EscortStatus.IN_TREATMENT, recruit);
            escort.setRecruit(recruit);

            when(escortQueryRepository.findEscortDetailByRecruitId(100L))
                    .thenReturn(escort);

            EscortDetailResponse resp = escortService.getEscortDetailByRecruitId(100L);

            // then
            assertThat(resp.getEscortId()).isEqualTo(escort.getId());
            assertThat(resp.getCustomerContact()).isEqualTo("010-1234-5678");
            assertThat(resp.getEscortDate()).isEqualTo(recruit.getEscortDate());
            assertThat(resp.getPurpose()).isEqualTo("검진");
        }

        @Test
        @DisplayName("데이터가 없으면 EscortNotFoundException")
        void getEscortDetail_empty_throws() {
            when(escortQueryRepository.findEscortDetailByRecruitId(1001L))
                    .thenReturn(null);

            assertThatThrownBy(() -> escortService.getEscortDetailByRecruitId(1001L))
                    .isInstanceOf(EscortNotFoundException.class);
        }

        @Test
        @DisplayName("레그가 하나라도 없으면 RouteLegNotFoundException")
        void getEscortDetail_missing_leg_throws() {
            // given
            Recruit recruit = makeRecruit(100L);

            Auth customer = new Auth(); customer.setContact("010-1234-5678");
            recruit.setCustomer(customer);

            Patient patient = Patient.builder()
                    .name("김철수")
                    .age(75)
                    .patientProfileImage(new ImageFile())
                    .gender(Gender.MALE)
                    .contact("010-1111-2222")
                    .needsHelping(true)
                    .usesWheelchair(true)
                    .hasCognitiveIssue(false)
                    .cognitiveIssueDetail(null)
                    .hasCommunicationIssue(true)
                    .communicationIssueDetail("청각장애")
                    .build();
            recruit.setPatient(patient);

            LocationInfo m = makeLocationInfo(1L, "만남장소");
            LocationInfo h = makeLocationInfo(2L, "병원");
            LocationInfo r = makeLocationInfo(3L, "복귀장소");
            RouteLeg meetingToHospital = new RouteLeg();
            meetingToHospital.setTotalTime(170);
            RouteLeg hospitalToReturn = null;
            Route route = makeRoute(300L, m, h, r, meetingToHospital, hospitalToReturn);
            recruit.setRoute(route);

            Escort escort = makeEscort(200L, EscortStatus.IN_TREATMENT, recruit);
            escort.setRecruit(recruit);

            when(escortQueryRepository.findEscortDetailByRecruitId(100L))
                    .thenReturn(escort);

            assertThatThrownBy(() -> escortService.getEscortDetailByRecruitId(100L))
                    .isInstanceOf(RouteLegNotFoundException.class);
        }
    }
}
