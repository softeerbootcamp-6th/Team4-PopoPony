package com.todoc.server.domain.report.service;

import com.todoc.server.domain.report.entity.Report;
import com.todoc.server.domain.report.exception.ReportNotFoundException;
import com.todoc.server.domain.report.repository.ReportJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Transactional
public class ReportService {

    private final ReportJpaRepository reportJpaRepository;

    /**
     * recruitId로 신청한 동행에 대한 리포트를 조회하는 함수
     *
     * @param recruitId 동행 신청 ID
     * @return Report 인스턴스
     */
    @Transactional(readOnly = true)
    public Report getReportByRecruitId(Long recruitId) {
        return reportJpaRepository.findByRecruitId(recruitId)
                .orElseThrow(() -> new ReportNotFoundException() {});
    }
}
