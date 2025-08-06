package com.todoc.server.domain.helper.repository;

import com.todoc.server.domain.helper.entity.HelperProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HelperJpaRepository extends JpaRepository<HelperProfile, Long> {
    Optional<HelperProfile> findByAuthId(Long authId);
}
