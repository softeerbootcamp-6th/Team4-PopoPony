package com.todoc.server.domain.helper.service;

import com.todoc.server.domain.helper.entity.Helper;
import com.todoc.server.domain.helper.exception.HelperNotFoundException;
import com.todoc.server.domain.helper.repository.HelperJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class HelperService {

    private final HelperJpaRepository helperJpaRepository;

    /**
     * userId(authId)에 해당하는 도우미를 조회하는 함수
     *
     * @param userId (authId)
     * @return Helper 인스턴스
     */
    @Transactional(readOnly = true)
    public Helper getHelperByUserId(Long userId) {
        return helperJpaRepository.findByAuthId(userId)
                .orElseThrow(HelperNotFoundException::new);
    }
}
