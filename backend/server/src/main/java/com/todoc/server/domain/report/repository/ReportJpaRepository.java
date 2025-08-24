package com.todoc.server.domain.report.repository;

import com.todoc.server.domain.report.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReportJpaRepository extends JpaRepository<Report, Long> {
    Optional<Report> findByRecruitId(Long recruitId);
    boolean existsByRecruitId(Long recruitId);
}
