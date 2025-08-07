package com.todoc.server.domain.review.repository;

import com.querydsl.core.Tuple;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.todoc.server.common.enumeration.SatisfactionLevel;
import com.todoc.server.domain.review.web.dto.response.ReviewSimpleResponse;
import lombok.RequiredArgsConstructor;
import com.todoc.server.domain.review.web.dto.response.ReviewStatResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    /**
     * recruitId로 신청한 동행의 리뷰 요약 정보를 조회
     */
    public ReviewSimpleResponse getReviewSimpleByRecruitId(Long recruitId) {

        return queryFactory
                .select(Projections.constructor(
                        ReviewSimpleResponse.class,
                        review.id,
                        review.satisfactionLevel,
                        review.shortComment,
                        review.createdAt
                ))
                .from(review)
                .where(review.recruit.id.eq(recruitId))
                .fetchOne();
    }
}
