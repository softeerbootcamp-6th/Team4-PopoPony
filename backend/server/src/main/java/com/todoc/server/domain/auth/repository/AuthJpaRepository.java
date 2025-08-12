package com.todoc.server.domain.auth.repository;

import com.todoc.server.domain.auth.entity.Auth;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthJpaRepository extends JpaRepository<Auth, Long> {
    Optional<Auth> findByLoginId(String loginId);
}
