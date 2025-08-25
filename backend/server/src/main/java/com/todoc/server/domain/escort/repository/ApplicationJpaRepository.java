package com.todoc.server.domain.escort.repository;

import com.todoc.server.domain.escort.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicationJpaRepository extends JpaRepository<Application, Long> {
    List<Application> findByRecruitId(Long recruitId);
    Optional<Application> findWithRecruitById(Long id);
    long countByRecruitId(Long recruitId);
}
