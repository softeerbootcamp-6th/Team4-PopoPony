package com.todoc.server.domain.review.repository;

import com.querydsl.core.Tuple;
import com.querydsl.core.types.Projections;
import com.todoc.server.common.enumeration.SatisfactionLevel;
import com.todoc.server.domain.review.entity.Review;
import com.todoc.server.domain.review.web.dto.response.ReviewSimpleResponse;
import com.todoc.server.domain.review.web.dto.response.ReviewStatResponse;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.todoc.server.domain.review.entity.QReview.review;

@Repository
public class ReviewQueryRepository extends QuerydslRepositorySupport {

    public ReviewQueryRepository() {
        super(Review.class);
    }

    /**
     * userId에 해당하는 도우미의 리뷰 총 개수와 만족도 비율을 조회
     */
    public ReviewStatResponse getReviewStatByHelperUserId(Long userId) {

        List<Tuple> results = getQuerydsl().createQuery()
                .select(review.satisfactionLevel, review.count())
                .from(review)
                .where(review.helper.id.eq(userId))
                .groupBy(review.satisfactionLevel)
                .fetch();

        Map<SatisfactionLevel, Long> statMap = new HashMap<>();
        long total = 0L;

        for (Tuple tuple : results) {
            SatisfactionLevel satisfactionLevel = tuple.get(0, SatisfactionLevel.class); // Enum일 경우 `.name()`
            Long count = tuple.get(1, Long.class);
            statMap.put(satisfactionLevel, count);
            total += count;
        }

        return ReviewStatResponse.from(statMap, total);
    }

    /**
     * userId에 해당하는 도우미의 최근 5개의 리뷰 목록 조회
     */
    public List<ReviewSimpleResponse> getLatestReviewsByHelperUserId(Long userId) {

        return getQuerydsl().createQuery()
                .select(Projections.constructor(
                        ReviewSimpleResponse.class,
                        review.id,
                        review.satisfactionLevel,
                        review.shortComment,
                        review.createdAt
                ))
                .from(review)
                .where(review.helper.id.eq(userId))
                .orderBy(review.createdAt.desc())
                .limit(5)
                .fetch();
    }
}
