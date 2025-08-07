package com.todoc.server.domain.review.repository;

import com.todoc.server.domain.review.entity.PositiveFeedbackChoice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PositiveFeedbackChoiceJpaRepository extends JpaRepository<PositiveFeedbackChoice, Long> {
}
