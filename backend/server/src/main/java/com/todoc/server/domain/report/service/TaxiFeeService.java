package com.todoc.server.domain.report.service;

import com.todoc.server.domain.image.entity.ImageFile;
import com.todoc.server.domain.report.entity.TaxiFee;
import com.todoc.server.domain.report.entity.TaxiReceiptImage;
import com.todoc.server.domain.report.exception.TaxiFeeNotFoundException;
import com.todoc.server.domain.report.repository.TaxiFeeJpaRepository;
import com.todoc.server.domain.report.web.dto.request.ReportCreateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Transactional
public class TaxiFeeService {

    private final TaxiFeeJpaRepository taxiFeeJpaRepository;

    /**
     * reportId에 해당하는 리포트에 들어갈 택시 요금 정보를 조회하는 함수
     *
     * @param reportId 리포트 ID
     * @return TaxiFee 인스턴스
     */
    @Transactional(readOnly = true)
    public TaxiFee getTaxiFeeByRecruitId(Long reportId) {
        return taxiFeeJpaRepository.findByReportId(reportId)
                .orElseThrow(TaxiFeeNotFoundException::new);
    }

    public TaxiFee register(ReportCreateRequest.TaxiFeeCreateRequest requestDto) {

        TaxiFee taxiFee = TaxiFee.builder()
                .departureFee(requestDto.getDepartureFee())
                .returnFee(requestDto.getReturnFee())
                .build();

        return taxiFeeJpaRepository.save(taxiFee);
    }

    public long getCount() {
        return taxiFeeJpaRepository.count();
    }
}
