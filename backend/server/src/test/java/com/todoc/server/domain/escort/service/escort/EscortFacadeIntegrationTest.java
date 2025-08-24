package com.todoc.server.domain.escort.service.escort;

import com.todoc.server.IntegrationTest;
import com.todoc.server.domain.escort.exception.EscortNotFoundException;
import com.todoc.server.domain.escort.service.EscortFacadeService;
import com.todoc.server.domain.escort.web.dto.response.EscortDetailResponse;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.*;

@Sql("/sql/data.sql")
public class EscortFacadeIntegrationTest extends IntegrationTest {

    @Autowired
    private EscortFacadeService escortFacadeService;

    @Nested
    class GetEscortDetailByRecruitId {

        @Test
        void getEscortDetailByRecruitId_정상조회() {
            // given
            Long recruitId = 1L; // data.sql 에 존재하는 recruit

            // when
            EscortDetailResponse response = escortFacadeService.getEscortDetailByRecruitId(recruitId);

            // then
            assertThat(response).isNotNull();
            assertThat(response.getEscortId()).isNotNull();
            assertThat(response.getEscortStatus()).isEqualTo("동행완료"); // recruitId=1 의 escort.status
            assertThat(response.getCustomerContact()).isEqualTo("010-1234-5678"); // auth id=1
            assertThat(response.getEscortDate()).isEqualTo(java.time.LocalDate.of(2025, 8, 1));
            assertThat(response.getEstimatedMeetingTime()).isEqualTo(java.time.LocalTime.of(9, 0));
            assertThat(response.getEstimatedReturnTime()).isEqualTo(java.time.LocalTime.of(11, 0));
            assertThat(response.getPurpose()).isEqualTo("진료");
            assertThat(response.getExtraRequest()).isEqualTo("장시간 대기 시 물 챙겨주세요.");

            // 서브 객체들
            assertThat(response.getHelper()).isNotNull();
            assertThat(response.getPatient()).isNotNull();
            assertThat(response.getRoute()).isNotNull();
        }

        @Test
        void getEscortDetailByRecruitId_존재하지않음() {
            // given
            Long nonExistRecruitId = 99999L;

            // when // then
            assertThatThrownBy(() -> escortFacadeService.getEscortDetailByRecruitId(nonExistRecruitId))
                .isInstanceOf(EscortNotFoundException.class);
        }
    }
}
