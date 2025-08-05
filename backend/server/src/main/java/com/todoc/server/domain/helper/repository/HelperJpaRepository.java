package com.todoc.server.domain.helper.repository;

import com.todoc.server.domain.helper.entity.Helper;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HelperJpaRepository extends JpaRepository<Helper, Long> {
    Optional<Helper> findByAuthId(Long authId);
}
