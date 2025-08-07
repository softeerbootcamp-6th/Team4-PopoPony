package com.todoc.server.domain.escort.service;

import com.todoc.server.common.enumeration.RecruitStatus;
import com.todoc.server.domain.escort.web.dto.response.RecruitDetailResponse;
import com.todoc.server.domain.escort.web.dto.response.RecruitListResponse;
import com.todoc.server.domain.escort.web.dto.response.RecruitPaymentResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

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
}
