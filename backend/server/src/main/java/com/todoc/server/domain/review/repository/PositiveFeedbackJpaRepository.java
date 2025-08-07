package com.todoc.server.domain.review.repository;

import com.todoc.server.domain.review.entity.PositiveFeedback;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PositiveFeedbackJpaRepository extends JpaRepository<PositiveFeedback, Long> {
}
