package com.todoc.server.domain.report.service;

import com.todoc.server.domain.escort.exception.RecruitNotFoundException;
import com.todoc.server.domain.report.web.dto.response.ReportDetailResponse;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;

@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE) // 실제 DB 사용 시
@Transactional
@ActiveProfiles("test")
@Sql("/sql/data.sql")
public class ReportIntegrationTest {

    @Autowired
    private ReportService reportService;

    @PersistenceContext
    private EntityManager em;

    @Test
    @DisplayName("리포트 상세 정보 조회 - 정상")
    void getReportDetailByRecruitId_정상() {
        // given
        Long recruitId = 1L;

        // when
        ReportDetailResponse response = reportService.getReportDetailByRecruitId(recruitId);

        // then
        assertThat(response).isNotNull();
        assertThat(response.getDescription()).isEqualTo("예정된 시간에 잘 만났고, 병원 진료도 원활히 진행되었습니다.");
        assertThat(response.getBaseFee()).isEqualTo(35000);
        assertThat(response.getExtraMinutes()).isEqualTo(5);
        assertThat(response.getExtraTimeFee()).isEqualTo(1500);
        assertThat(response.getActualMeetingTime()).isEqualTo(LocalTime.of(9, 5));
    }

    @Test
    @DisplayName("리포트 상세 정보 조회 - 존재하지 않는 리포트")
    void getReportDetailByRecruitId_존재하지않는리포트() {
        // given
        Long recruitId = 999L;

        // when & then
        assertThatThrownBy(() -> reportService.getReportDetailByRecruitId(recruitId))
                .isInstanceOf(RecruitNotFoundException.class);
    }
}
