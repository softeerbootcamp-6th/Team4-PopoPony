package com.todoc.server.domain.review.repository;

import com.querydsl.core.Tuple;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.todoc.server.domain.review.repository.dto.ReviewDetailFlatDto;
import com.todoc.server.domain.review.web.dto.response.ReviewSimpleResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.todoc.server.domain.review.entity.QPositiveFeedback.positiveFeedback;
import static com.todoc.server.domain.review.entity.QPositiveFeedbackChoice.positiveFeedbackChoice;
import static com.todoc.server.domain.review.entity.QReview.review;

@Repository
@RequiredArgsConstructor
public class ReviewQueryRepository {

    private final JPAQueryFactory queryFactory;

    /**
     * userId에 해당하는 도우미의 리뷰 총 개수와 만족도 비율을 조회
     */
    public List<Tuple> getReviewStatByHelperUserId(Long userId) {

        return queryFactory
                .select(review.satisfactionLevel, review.count())
                .from(review)
                .where(review.helper.id.eq(userId))
                .groupBy(review.satisfactionLevel)
                .fetch();
    }

    /**
     * userId에 해당하는 도우미의 최근 5개의 리뷰 목록 조회
     */
    public List<ReviewSimpleResponse> getLatestReviewsByHelperUserId(Long userId) {

        return queryFactory
                .select(Projections.constructor(
                        ReviewSimpleResponse.class,
                        review.id,
                        review.satisfactionLevel.stringValue(),
                        review.createdAt,
                        review.shortComment
                ))
                .from(review)
                .where(review.helper.id.eq(userId))
                .orderBy(review.createdAt.desc())
                .limit(5)
                .fetch();
    }

    /**
     * recruitId로 신청한 동행의 리뷰 요약 정보를 조회
     */
    public List<ReviewDetailFlatDto> getReviewDetailByRecruitId(Long recruitId) {

        return queryFactory
                .select(Projections.constructor(
                        ReviewDetailFlatDto.class,
                        review.id,
                        review.satisfactionLevel.stringValue(),
                        review.createdAt,
                        review.shortComment,
                        positiveFeedback.description
                ))
                .from(review)
                .leftJoin(positiveFeedbackChoice).on(positiveFeedbackChoice.review.eq(review))
                .leftJoin(positiveFeedbackChoice.positiveFeedback, positiveFeedback)
                .where(review.recruit.id.eq(recruitId))
                .orderBy(review.createdAt.desc())
                .fetch();
    }
}
