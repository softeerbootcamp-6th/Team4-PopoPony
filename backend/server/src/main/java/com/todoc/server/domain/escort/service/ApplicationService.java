package com.todoc.server.domain.escort.service;

import com.todoc.server.domain.escort.repository.ApplicationQueryRepository;
import com.todoc.server.domain.escort.web.dto.response.ApplicationListResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ApplicationService {

    private final ApplicationQueryRepository applicationQueryRepository;

    @Transactional(readOnly = true)
    public ApplicationListResponse getApplicationListByRecruitId(Long recruitId) {
        return applicationQueryRepository.findApplicationListByRecruitId(recruitId);
    }
}
