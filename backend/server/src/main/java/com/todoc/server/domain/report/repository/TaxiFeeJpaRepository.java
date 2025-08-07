package com.todoc.server.domain.report.repository;

import com.todoc.server.domain.report.entity.TaxiFee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TaxiFeeJpaRepository extends JpaRepository<TaxiFee, Long> {
    Optional<TaxiFee> findByReportId(Long reportId);
}
