package com.todoc.server.domain.report.service;

import com.querydsl.core.Tuple;
import com.todoc.server.common.util.DateTimeUtils;
import com.todoc.server.common.util.FeeUtils;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.report.entity.Report;
import com.todoc.server.domain.report.entity.TaxiFee;
import com.todoc.server.domain.report.repository.ReportJpaRepository;
import com.todoc.server.domain.report.repository.ReportQueryRepository;
import com.todoc.server.domain.report.web.dto.response.ReportDetailResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.time.LocalTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReportServiceTest {

    @Mock
    private ReportQueryRepository reportQueryRepository;

    @Mock
    private ReportJpaRepository reportJpaRepository;

    @Mock
    private Tuple tuple;

    @InjectMocks
    private ReportService reportService;

    @Test
    @DisplayName("recruitId로 리포트 상세 정보를 올바르게 반환")
    void getReportDetailByRecruitId_shouldReturnCorrectResponse() {
        // given
        Long recruitId = 1L;

        LocalTime estStart = LocalTime.of(9, 0);
        LocalTime estEnd = LocalTime.of(11, 0);
        LocalTime actStart = LocalTime.of(9, 0);
        LocalTime actEnd = LocalTime.of(12, 0);

        Recruit recruit = new Recruit();
        recruit.setEstimatedMeetingTime(estStart);
        recruit.setEstimatedReturnTime(estEnd);

        Report report = new Report();
        report.setId(10L);
        report.setActualMeetingTime(actStart);
        report.setActualReturnTime(actEnd);
        report.setHasNextAppointment(true);
        report.setNextAppointmentTime(LocalDateTime.of(2025, 8, 2, 14, 0));
        report.setDescription("환자 상태 불안정");

        TaxiFee taxiFee = new TaxiFee();
        taxiFee.setDepartureFee(5000);
        taxiFee.setReturnFee(7000);

        when(tuple.get(com.todoc.server.domain.report.entity.QReport.report)).thenReturn(report);
        when(tuple.get(com.todoc.server.domain.report.entity.QTaxiFee.taxiFee)).thenReturn(taxiFee);
        when(tuple.get(com.todoc.server.domain.escort.entity.QRecruit.recruit)).thenReturn(recruit);
        when(reportQueryRepository.getReportDetailByRecruitId(recruitId)).thenReturn(tuple);

        // 정적 유틸 클래스 mocking
        try (
                MockedStatic<DateTimeUtils> dateTimeMock = mockStatic(DateTimeUtils.class);
                MockedStatic<FeeUtils> feeMock = mockStatic(FeeUtils.class)
        ) {
            dateTimeMock.when(() -> DateTimeUtils.getMinuteDifference(actStart, actEnd)).thenReturn(180);
            dateTimeMock.when(() -> DateTimeUtils.getMinuteDifference(estStart, estEnd)).thenReturn(120);

            feeMock.when(() -> FeeUtils.calculateTotalFee(estStart, estEnd)).thenReturn(20000);
            feeMock.when(() -> FeeUtils.calculateTotalFee(actStart, actEnd)).thenReturn(26000);

            // when
            ReportDetailResponse response = reportService.getReportDetailByRecruitId(recruitId);

            // then
            assertThat(response.getReportId()).isEqualTo(10L);
            assertThat(response.getActualMeetingTime()).isEqualTo(actStart);
            assertThat(response.getActualReturnTime()).isEqualTo(actEnd);
            assertThat(response.getExtraMinutes()).isEqualTo(60);
            assertThat(response.getBaseFee()).isEqualTo(20000);
            assertThat(response.getExtraTimeFee()).isEqualTo(6000);
            assertThat(response.getTaxiFee()).isEqualTo(12000);
            assertThat(response.getDescription()).isEqualTo("환자 상태 불안정");
            assertThat(response.getHasNextAppointment()).isTrue();
            assertThat(response.getNextAppointmentTime()).isEqualTo(LocalDateTime.of(2025, 8, 2, 14, 0));
        }
    }
}