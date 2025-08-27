package com.todoc.server.domain.auth.service;

import com.todoc.server.IntegrationTest;
import com.todoc.server.domain.auth.entity.Auth;
import com.todoc.server.domain.auth.exception.AuthNotFoundException;
import com.todoc.server.domain.auth.repository.AuthJpaRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mindrot.jbcrypt.BCrypt.gensalt;
import static org.mindrot.jbcrypt.BCrypt.hashpw;

@Transactional
class AuthIntegrationTest extends IntegrationTest {

    @Autowired AuthService authService;
    @Autowired AuthJpaRepository authJpaRepository;

    private Long savedId;
    private final String username = "user1";
    private final String rawPassword = "pass1234!";

    @BeforeEach
    void setUp() {
        Auth auth = new Auth();
        auth.setLoginId(username);
        auth.setPassword(hashpw(rawPassword, gensalt())); // BCrypt 해시로 저장

        authJpaRepository.save(auth);
        savedId = auth.getId();
    }

    @Nested
    @DisplayName("사용자 인증")
    class ProceedAuthentication {

        @Test
        void authenticate_성공() {
            var session = authService.authenticate(username, rawPassword);
            assertThat(session).isNotNull();
            assertThat(session.id()).isEqualTo(savedId);
            assertThat(session.loginId()).isEqualTo(username);
        }

        @Test
        void authenticate_비밀번호_불일치() {
            assertThatThrownBy(() -> authService.authenticate(username, "wrong"))
                    .isInstanceOf(AuthNotFoundException.class);
        }

        @Test
        void authenticate_없는_사용자() {
            assertThatThrownBy(() -> authService.authenticate("none", rawPassword))
                    .isInstanceOf(AuthNotFoundException.class);
        }
    }

    @Nested
    @DisplayName("사용자 조회 - ID")
    class ProceedGetAuth {

        @Test
        void getAuthById_성공() {
            var found = authService.getAuthById(savedId);
            assertThat(found.getLoginId()).isEqualTo(username);
        }

        @Test
        void getAuthById_없음() {
            assertThatThrownBy(() -> authService.getAuthById(999_999L))
                    .isInstanceOf(AuthNotFoundException.class);
        }
    }
}
