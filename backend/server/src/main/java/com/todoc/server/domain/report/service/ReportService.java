package com.todoc.server.domain.report.service;

import com.todoc.server.domain.report.repository.ReportQueryRepository;
import com.todoc.server.domain.report.web.dto.response.ReportDetailResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Transactional
public class ReportService {

    private final ReportQueryRepository reportQueryRepository;

    /**
     * recruitId로 신청한 동행에 대한 리포트 상세 정보를 조회하는 함수
     *
     * @param recruitId 동행 신청 ID
     * @return ReportDetailResponse 인스턴스
     */
    @Transactional(readOnly = true)
    public ReportDetailResponse getReportDetailByRecruitId(Long recruitId) {
        return reportQueryRepository.getReportDetailByRecruitId(recruitId);
    }
}
