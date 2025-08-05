package com.todoc.server.domain.report.service;

import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.report.entity.Report;
import com.todoc.server.domain.report.entity.TaxiFee;
import com.todoc.server.domain.report.web.dto.response.ReportDetailResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.time.LocalTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReportFacadeServiceTest {

    @InjectMocks
    private ReportFacadeService reportFacadeService;

    @Mock
    private ReportService reportService;

    @Mock
    private TaxiFeeService taxiFeeService;

    @Test
    @DisplayName("recruitId로 리포트 상세 정보 조회 성공")
    void getReportDetailByRecruitId_success() {
        // given
        Long recruitId = 1L;
        Long reportId = 10L;

        Recruit recruit = new Recruit();
        recruit.setId(recruitId);
        recruit.setEstimatedMeetingTime(LocalTime.of(10, 0));
        recruit.setEstimatedReturnTime(LocalTime.of(12, 0));

        Report report = new Report();
        report.setId(reportId);
        report.setActualMeetingTime(LocalTime.of(10, 0));
        report.setActualReturnTime(LocalTime.of(13, 0));
        report.setHasNextAppointment(true);
        report.setNextAppointmentTime(LocalDateTime.of(2025, 8, 5, 15, 0));
        report.setDescription("환자가 고령이라 천천히 이동함");
        report.setRecruit(recruit);

        TaxiFee taxiFee = new TaxiFee();
        taxiFee.setReport(report);
        taxiFee.setDepartureFee(5000);
        taxiFee.setReturnFee(6000);

        when(reportService.getReportByRecruitId(recruitId)).thenReturn(report);
        when(taxiFeeService.getReportByRecruitId(reportId)).thenReturn(taxiFee);

        // when
        ReportDetailResponse response = reportFacadeService.getReportDetailByRecruitId(recruitId);

        // then
        assertEquals(reportId, response.getReportId());
        assertEquals(60, response.getExtraMinutes());
        assertEquals(true, response.getHasNextAppointment());
        assertEquals(LocalDateTime.of(2025, 8, 5, 15, 0), response.getNextAppointmentTime());
        assertEquals("환자가 고령이라 천천히 이동함", response.getDescription());
        assertTrue(response.getBaseFee() > 0);
        assertTrue(response.getExtraTimeFee() > 0);
        assertEquals(11000, response.getTaxiFee());
    }
}