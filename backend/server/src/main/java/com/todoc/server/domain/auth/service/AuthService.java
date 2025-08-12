package com.todoc.server.domain.auth.service;

import com.todoc.server.domain.auth.entity.Auth;
import com.todoc.server.domain.auth.exception.AuthNotFoundException;
import com.todoc.server.domain.auth.repository.AuthJpaRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static org.mindrot.jbcrypt.BCrypt.checkpw;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final AuthJpaRepository authJpaRepository;

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    /**
     * 주어진 ID에 해당하는 Auth 엔티티를 조회합니다.
     *
     * @param authId 조회할 Auth 엔티티의 ID
     * @return 해당 ID에 해당하는 Auth 엔티티
     */
    public Auth getAuthById(Long authId) {
        return authJpaRepository.findById(authId)
                .orElseThrow(AuthNotFoundException::new);
    }

    public SessionAuth authenticate(String username, String password) {
        Auth auth = authJpaRepository.findByLoginId(username)
            .orElseThrow(AuthNotFoundException::new);

        if (!checkpw(password, auth.getPassword())) {
            throw new AuthNotFoundException();
        }

        logger.info("[AuthService] - 로그인 성공 : {}", auth.getLoginId());
        return new SessionAuth(auth.getId(), auth.getLoginId());
    }



}
