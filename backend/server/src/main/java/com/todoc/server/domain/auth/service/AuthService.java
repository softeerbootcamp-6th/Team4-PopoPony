package com.todoc.server.domain.auth.service;

import com.todoc.server.domain.auth.entity.Auth;
import com.todoc.server.domain.auth.exception.AuthNotFoundException;
import com.todoc.server.domain.auth.repository.AuthJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final AuthJpaRepository authJpaRepository;

    /**
     * 주어진 ID에 해당하는 Auth 엔티티를 조회합니다.
     *
     * @param authId 조회할 Auth 엔티티의 ID
     * @return 해당 ID에 해당하는 Auth 엔티티
     */
    public Auth getAuthById(Long authId) {
        return authJpaRepository.findById(authId)
                .orElseThrow(() -> new AuthNotFoundException() {});
    }



}
