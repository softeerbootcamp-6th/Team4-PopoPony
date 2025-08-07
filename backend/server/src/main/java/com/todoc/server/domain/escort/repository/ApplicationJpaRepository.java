package com.todoc.server.domain.escort.repository;

import com.todoc.server.domain.escort.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationJpaRepository extends JpaRepository<Application, Long> {
    List<Application> findByRecruitId(Long recruitId);
}
