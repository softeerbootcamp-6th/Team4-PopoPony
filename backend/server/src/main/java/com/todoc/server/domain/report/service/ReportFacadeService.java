package com.todoc.server.domain.report.service;

import com.todoc.server.common.util.DateTimeUtils;
import com.todoc.server.common.util.FeeUtils;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.escort.exception.RecruitNotFoundException;
import com.todoc.server.domain.report.entity.Report;
import com.todoc.server.domain.report.entity.TaxiFee;
import com.todoc.server.domain.report.web.dto.response.ReportDetailResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;


@Component
@RequiredArgsConstructor
@Transactional
public class ReportFacadeService {

    private final ReportService reportService;
    private final TaxiFeeService taxiFeeService;

    /**
     * recruitId로 신청한 동행에 대한 리포트를 조회하는 함수
     *
     * @param recruitId 동행 신청 ID
     * @return 리포트의 상세 정보 (ReportDetailResponse)
     */
    @Transactional(readOnly = true)
    public ReportDetailResponse getReportDetailByRecruitId(Long recruitId) {

        // 1. 리포트, 택시요금, 동행 신청 찾기
        Report report = reportService.getReportByRecruitId(recruitId);
        TaxiFee taxiFee = taxiFeeService.getReportByRecruitId(report.getId());
        Recruit recruit = report.getRecruit();
        if (recruit == null) {
            throw new RecruitNotFoundException();
        }

        // 2. 이용 시간 및 요금 계산
        int actualDuration = DateTimeUtils.getMinuteDifference(report.getActualMeetingTime(), report.getActualReturnTime());
        int estimatedDuration = DateTimeUtils.getMinuteDifference(recruit.getEstimatedMeetingTime(), recruit.getEstimatedReturnTime());
        int extraMinutes = actualDuration - estimatedDuration;

        int baseFee = FeeUtils.calculateTotalFee(recruit.getEstimatedMeetingTime(), recruit.getEstimatedReturnTime());
        int extraFee = FeeUtils.calculateTotalFee(report.getActualMeetingTime(), report.getActualReturnTime()) - baseFee;

        // 3. Response 생성
        return ReportDetailResponse.builder()
                .reportId(report.getId())
                .actualMeetingTime(report.getActualMeetingTime())
                .actualReturnTime(report.getActualReturnTime())
                .extraMinutes(Math.max(extraMinutes, 0))
                .hasNextAppointment(report.getHasNextAppointment())
                .nextAppointmentTime(report.getNextAppointmentTime())
                .description(report.getDescription())
                .baseFee(baseFee)
                .extraTimeFee(Math.max(extraFee, 0))
                .taxiFee(taxiFee.getDepartureFee() + taxiFee.getReturnFee())
                .build();
    }
}
