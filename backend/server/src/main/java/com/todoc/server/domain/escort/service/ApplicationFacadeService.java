package com.todoc.server.domain.escort.service;

import com.todoc.server.domain.escort.web.dto.response.ApplicationListResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Transactional
public class ApplicationFacadeService {

    private final ApplicationService applicationService;

    /**
     * recruitId에 해당하는 동행 신청에 대한 지원 목록을 조회하는 함수
     *
     * @param recruitId 동행 신청의 ID
     * @return 지원 목록 응답 DTO(ApplicationListResponse)
     */
    @Transactional(readOnly = true)
    public ApplicationListResponse getApplicationListByRecruitId(Long recruitId) {
        return applicationService.getApplicationListByRecruitId(recruitId);
    }
}
