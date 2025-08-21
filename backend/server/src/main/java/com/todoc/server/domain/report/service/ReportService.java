package com.todoc.server.domain.report.service;

import com.todoc.server.common.util.DateTimeUtils;
import com.todoc.server.common.util.FeeUtils;
import com.todoc.server.common.util.ImageUrlUtils;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.report.entity.Report;
import com.todoc.server.domain.report.entity.TaxiFee;
import com.todoc.server.domain.report.exception.ReportNotFoundException;
import com.todoc.server.domain.report.repository.ReportJpaRepository;
import com.todoc.server.domain.report.repository.ReportQueryRepository;
import com.todoc.server.domain.report.repository.dto.ReportDetailFlatDto;
import com.todoc.server.domain.report.web.dto.request.ReportCreateRequest;
import com.todoc.server.domain.report.web.dto.response.ReportDetailResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Transactional
public class ReportService {

    private final ReportQueryRepository reportQueryRepository;
    private final ReportJpaRepository reportJpaRepository;

    /**
     * recruitId로 신청한 동행에 대한 리포트 상세 정보를 조회하는 함수
     *
     * @param recruitId 동행 신청의 ID
     * @return 리포트 상세 정보 (HelperDetailResponse)
     */
    @Transactional(readOnly = true)
    public ReportDetailResponse getReportDetailByRecruitId(Long recruitId) {

        // 1. 데이터 조회 (Report + TaxiFee + Recruit)
        ReportDetailFlatDto reportDetailFlatDto = reportQueryRepository.getReportDetailByRecruitId(recruitId);


        Report r = reportDetailFlatDto.getReport();
        TaxiFee tf = reportDetailFlatDto.getTaxiFee();
        Recruit rc = reportDetailFlatDto.getRecruit();
        List<Long> imageIdList = reportDetailFlatDto.getImageIdList();

        // 2. 시간 및 요금 계산
        int actualDuration = DateTimeUtils.getMinuteDifference(r.getActualMeetingTime(), r.getActualReturnTime());
        int estimatedDuration = DateTimeUtils.getMinuteDifference(rc.getEstimatedMeetingTime(), rc.getEstimatedReturnTime());
        int extraMinutes = actualDuration - estimatedDuration;

        int baseFee = FeeUtils.calculateTotalFee(rc.getEstimatedMeetingTime(), rc.getEstimatedReturnTime());
        int extraFee = FeeUtils.calculateTotalFee(r.getActualMeetingTime(), r.getActualReturnTime()) - baseFee;

        // 3. 이미지 URL 리스트 생성
        List<String> imageAttachmentList = new ArrayList<>();
        for (Long imageId : imageIdList) {
            imageAttachmentList.add(ImageUrlUtils.getImageUrl(imageId));
        }

        // 3. 응답 생성
        return ReportDetailResponse.builder()
                .reportId(r.getId())
                .actualMeetingTime(r.getActualMeetingTime())
                .actualReturnTime(r.getActualReturnTime())
                .extraMinutes(Math.max(extraMinutes, 0))
                .hasNextAppointment(r.getHasNextAppointment())
                .nextAppointmentTime(r.getNextAppointmentTime())
                .imageAttachmentList(imageAttachmentList)
                .description(r.getDescription())
                .baseFee(baseFee)
                .extraTimeFee(Math.max(extraFee, 0))
                .taxiFee((tf != null ? tf.getDepartureFee() : 0) + (tf != null ? tf.getReturnFee() : 0))
                .build();
    }

    public Report register(ReportCreateRequest requestDto) {

        Report report = Report.builder()
                .actualMeetingTime(requestDto.getActualMeetingTime())
                .actualReturnTime(requestDto.getActualReturnTime())
                .hasNextAppointment(requestDto.getHasNextAppointment())
                .nextAppointmentTime(requestDto.getNextAppointmentTime())
                .description(requestDto.getDescription())
                .build();

        return reportJpaRepository.save(report);
    }

    public boolean isReportExist(long recruitId) {
        return reportJpaRepository.existsById(recruitId);
    }

    public long getCount() {
        return reportJpaRepository.count();
    }

    public List<Report> getAllReports() {
        return reportJpaRepository.findAll();
    }
}
