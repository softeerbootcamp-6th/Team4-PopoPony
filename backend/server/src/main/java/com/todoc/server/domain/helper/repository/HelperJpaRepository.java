package com.todoc.server.domain.helper.repository;

import com.todoc.server.domain.helper.entity.HelperProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface HelperJpaRepository extends JpaRepository<HelperProfile, Long> {
    Optional<HelperProfile> findByAuthId(Long authId);

    @Query("SELECT hp.auth.id FROM HelperProfile hp WHERE hp.id = :helperProfileId")
    Optional<Long> findAuthIdByHelperProfileId(@Param("helperProfileId") Long helperProfileId);
}
