package com.todoc.server.domain.review.service;

import com.todoc.server.common.enumeration.SatisfactionLevel;
import com.todoc.server.domain.review.entity.Review;
import com.todoc.server.domain.review.exception.SatisfactionInvalidException;
import com.todoc.server.domain.review.repository.ReviewJpaRepository;
import com.todoc.server.domain.review.repository.ReviewQueryRepository;
import com.todoc.server.domain.review.web.dto.request.ReviewCreateRequest;
import com.todoc.server.domain.review.web.dto.response.ReviewSimpleResponse;
import com.todoc.server.domain.review.web.dto.response.ReviewStatResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewService {

    private final ReviewQueryRepository reviewQueryRepository;
    private final ReviewJpaRepository reviewJpaRepository;

    /**
     * userId(authId)에 해당하는 도우미의 리뷰 관련 통계를 조회하는 함수
     *
     * @param userId (authId)
     * @return ReviewStatResponse 인스턴스
     */
    @Transactional(readOnly = true)
    public ReviewStatResponse getReviewStatByUserId(Long userId) {
        return reviewQueryRepository.getReviewStatByHelperUserId(userId);
    }

    /**
     * userId(authId)에 해당하는 도우미의 최근 5개의 리뷰 목록를 조회하는 함수
     *
     * @param userId (authId)
     * @return List<ReviewSimpleResponse>
     */
    @Transactional(readOnly = true)
    public List<ReviewSimpleResponse> getLatestReviewsByHelperUserId(Long userId) {
        return reviewQueryRepository.getLatestReviewsByHelperUserId(userId);
    }

    public Review register(ReviewCreateRequest request) {

        // 요청에서 만족도 레벨을 가져와서 유효성 검사
        // 유효하지 않은 경우 SatisfactionInvalidException 예외를 발생시킴
        SatisfactionLevel satisfactionLevel = SatisfactionLevel.from(request.getSatisfactionLevel())
                .orElseThrow(() -> new SatisfactionInvalidException() {});

        Review review = Review.builder()
                .satisfactionLevel(satisfactionLevel)
                .negativeFeedback(request.getSatisfactionComment())
                .build();

        return reviewJpaRepository.save(review);
    }
}
