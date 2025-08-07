package com.todoc.server.domain.review.repository;

import com.todoc.server.domain.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewJpaRepository extends JpaRepository<Review, Long> {
}
