package com.todoc.server.integration;

import com.todoc.server.domain.escort.service.RecruitService;
import com.todoc.server.domain.escort.web.dto.response.RecruitPaymentResponse;
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
public class IntegrationTest {

    @Autowired
    private RecruitService recruitService;

    @Test
    void getRecruitPaymentByRecruitId_정상조회() {
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
