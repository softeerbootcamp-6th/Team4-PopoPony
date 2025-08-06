package com.todoc.server.domain.helper.service;

import com.todoc.server.domain.helper.repository.HelperQueryRepository;
import com.todoc.server.domain.helper.web.dto.response.HelperSimpleResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class HelperService {

    private final HelperQueryRepository helperQueryRepository;

    /**
     * helperProfileId에 해당하는 도우미 요약 정보를 조회하는 함수
     *
     * @param helperProfileId 도우미 프로필 ID
     * @return HelperSimpleResponse 인스턴스
     */
    @Transactional(readOnly = true)
    public HelperSimpleResponse getHelperSimpleByHelperProfileId(Long helperProfileId) {
        return helperQueryRepository.getHelperSimpleByHelperProfileId(helperProfileId);
    }
}
