package com.todoc.server.domain.review.service;

import com.querydsl.core.Tuple;
import com.todoc.server.common.enumeration.SatisfactionLevel;
import com.todoc.server.domain.review.repository.ReviewQueryRepository;
import com.todoc.server.domain.review.web.dto.response.ReviewSimpleResponse;
import com.todoc.server.domain.review.web.dto.response.ReviewStatResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewService {

    private final ReviewQueryRepository reviewQueryRepository;

    /**
     * userId(authId)에 해당하는 도우미의 리뷰 관련 통계를 조회하는 함수
     *
     * @param userId (authId)
     * @return ReviewStatResponse 인스턴스
     */
    @Transactional(readOnly = true)
    public ReviewStatResponse getReviewStatByUserId(Long userId) {

        List<Tuple> tuples = reviewQueryRepository.getReviewStatByHelperUserId(userId);

        Map<SatisfactionLevel, Long> statMap = new HashMap<>();
        long total = 0L;

        for (Tuple tuple : tuples) {
            SatisfactionLevel satisfactionLevel = tuple.get(0, SatisfactionLevel.class); // Enum일 경우 `.name()`
            Long count = tuple.get(1, Long.class);
            statMap.put(satisfactionLevel, count);
            total += count;
        }

        return ReviewStatResponse.from(statMap, total);
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

    /**
     * recruitId로 신청한 동행의 리뷰 요약 정보를 조회하는 함수
     *
     * @param recruitId 동행 신청 ID
     * @return ReviewSimpleResponse
     */
    @Transactional(readOnly = true)
    public ReviewSimpleResponse getReviewSimpleByRecruitId(Long recruitId) {
        return reviewQueryRepository.getReviewSimpleByRecruitId(recruitId);
    }
}
