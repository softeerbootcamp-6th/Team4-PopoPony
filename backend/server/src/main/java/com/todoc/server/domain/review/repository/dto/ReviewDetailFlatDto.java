package com.todoc.server.domain.review.repository.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ReviewDetailFlatDto {
    private Long reviewId;
    private String satisfactionLevel;
    private LocalDateTime createdAt;
    private String shortComment;
    private String positiveFeedbackDesc;
}
