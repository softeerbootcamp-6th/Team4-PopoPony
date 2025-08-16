package com.todoc.server.domain.escort.service;

import com.todoc.server.common.enumeration.EscortStatus;
import com.todoc.server.common.enumeration.RecruitStatus;
import com.todoc.server.domain.escort.entity.Escort;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.escort.exception.EscortInvalidProceedException;
import com.todoc.server.domain.escort.exception.EscortNotFoundException;
import com.todoc.server.domain.escort.web.dto.response.EscortDetailResponse;
import com.todoc.server.domain.escort.web.dto.request.EscortMemoUpdateRequest;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE) // 실제 DB/H2 설정 유지
@Transactional
@ActiveProfiles("test")
@Sql("/sql/data.sql")
class EscortIntegrationTest {

    @Autowired private EscortService escortService;
    @Autowired private RecruitService recruitService;

    @PersistenceContext private EntityManager em;

    private static final Long RECRUIT_ID_WITH_DETAIL = 5L;       // route/route_leg 두 레그가 모두 있는 recruit
    private static final Long NON_EXIST_RECRUIT_ID   = 99999L;

    private static final Long ESCORT_ID_MEETING    = 10L;      // 상태가 MEETING 인 escort (HEADING_TO_HOSPITAL 로 진행)
    private static final Long ESCORT_ID_RETURNING    = 9L;      // 상태가 RETURNING 인 escort (WRITING_REPORT 로 진행)
    private static final Long ESCORT_ID_PREPARING      = 8L;      // 상태가 MEETING 인 escort (진행 불가 예외)
    private static final Long ANY_ESCORT_ID_FOR_MEMO = 5L;      // 메모 갱신 검증용(아무거나 존재하는 ID)

    @Nested
    @DisplayName("동행 진행")
    class ProceedEscort {

        @Test
        @DisplayName("MEETING → HEADING_TO_HOSPITAL (복귀시간 세팅)")
        void proceedEscort_MEETING_to_HEADING_TO_HOSPITAL() {
            // given
            Escort escort = escortService.getById(ESCORT_ID_MEETING);
            assertThat(escort.getStatus()).isEqualTo(EscortStatus.MEETING);
            assertThat(escort.getActualMeetingTime()).isNull();

            // when
            escortService.proceedEscort(ESCORT_ID_MEETING);
            em.flush(); em.clear();

            // then
            Escort updated = escortService.getById(ESCORT_ID_MEETING);
            assertThat(updated.getStatus()).isEqualTo(EscortStatus.HEADING_TO_HOSPITAL);
            assertThat(updated.getActualMeetingTime()).isNotNull();
        }

        @Test
        @DisplayName("RETURNING → WRITING_REPORT (복귀시간 세팅 + Recruit.DONE)")
        void proceedEscort_RETURNING_to_WRITING_REPORT() {
            // given
            Escort escort = escortService.getById(ESCORT_ID_RETURNING);
            assertThat(escort.getStatus()).isEqualTo(EscortStatus.RETURNING);
            assertThat(escort.getActualReturnTime()).isNull();

            // when
            escortService.proceedEscort(ESCORT_ID_RETURNING);
            em.flush(); em.clear();

            // then
            Escort updated = escortService.getById(ESCORT_ID_RETURNING);
            assertThat(updated.getStatus()).isEqualTo(EscortStatus.WRITING_REPORT);
            assertThat(updated.getActualReturnTime()).isNotNull();

            Recruit recruit = updated.getRecruit();
            Recruit refreshedRecruit = recruitService.getRecruitById(recruit.getId());
            assertThat(refreshedRecruit.getStatus()).isEqualTo(RecruitStatus.DONE);
        }

        @Test
        @DisplayName("허용 범위 외 상태면 예외 (PREPARING)")
        void proceedEscort_허용범위외() {
            Escort escort = escortService.getById(ESCORT_ID_PREPARING);
            assertThat(escort.getStatus()).isEqualTo(EscortStatus.PREPARING);

            assertThatThrownBy(() -> escortService.proceedEscort(ESCORT_ID_PREPARING))
                    .isInstanceOf(EscortInvalidProceedException.class);
        }

        @Test
        @DisplayName("없는 ID")
        void proceedEscort_존재하지않음() {
            assertThatThrownBy(() -> escortService.proceedEscort(987654321L))
                    .isInstanceOf(EscortNotFoundException.class);
        }
    }

    @Nested
    @DisplayName("동행 상세 조회")
    class GetEscortDetail {

        @Test
        @DisplayName("정상 (두 레그 모두 존재)")
        void getEscortDetailByRecruitId_정상() {
            // when
            EscortDetailResponse response = escortService.getEscortDetailByRecruitId(RECRUIT_ID_WITH_DETAIL);

            // then
            assertThat(response).isNotNull();
            assertThat(response.getEscortId()).isNotNull();
            assertThat(response.getRoute()).isNotNull();
            assertThat(response.getPatient()).isNotNull();
            // 필요한 경우 추가 검증
            assertThat(response.getEscortStatus()).isNotBlank();
            assertThat(response.getCustomerContact()).isNotBlank();
        }

        @Test
        @DisplayName("존재하지 않는 신청")
        void getEscortDetailByRecruitId_존재하지않음() {
            assertThatThrownBy(() ->
                    escortService.getEscortDetailByRecruitId(NON_EXIST_RECRUIT_ID))
                    .isInstanceOf(com.todoc.server.domain.escort.exception.EscortNotFoundException.class);
        }
    }

    @Nested
    @DisplayName("메모 수정")
    class UpdateMemo {

        @Test
        @DisplayName("정상")
        void updateMemo_정상() {
            // given
            EscortMemoUpdateRequest req = new EscortMemoUpdateRequest();
            req.setMemo("환자분 병원 도착 전 간단 간식 요청");

            // when
            escortService.updateMemo(ANY_ESCORT_ID_FOR_MEMO, req);
            em.flush(); em.clear();

            // then
            Escort updated = escortService.getById(ANY_ESCORT_ID_FOR_MEMO);
            assertThat(updated.getMemo()).isEqualTo("환자분 병원 도착 전 간단 간식 요청");
        }
    }
}