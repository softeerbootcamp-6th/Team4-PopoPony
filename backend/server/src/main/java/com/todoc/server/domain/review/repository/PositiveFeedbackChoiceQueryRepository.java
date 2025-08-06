package com.todoc.server.domain.review.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.todoc.server.domain.review.web.dto.response.PositiveFeedbackStatResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.todoc.server.domain.review.entity.QPositiveFeedback.positiveFeedback;
import static com.todoc.server.domain.review.entity.QReview.review;
import static com.todoc.server.domain.review.entity.QPositiveFeedbackChoice.positiveFeedbackChoice;

@Repository
@RequiredArgsConstructor
public class PositiveFeedbackChoiceQueryRepository {

    private final JPAQueryFactory queryFactory;

    public List<PositiveFeedbackStatResponse> findPositiveFeedbackStatByHelperUserId(Long userId) {

        return queryFactory
                .select(Projections.constructor(
                        PositiveFeedbackStatResponse.class,
                        positiveFeedback.description,
                        positiveFeedback.count()
                ))
                .from(positiveFeedbackChoice)
                .join(positiveFeedbackChoice.review, review)
                .join(positiveFeedbackChoice.positiveFeedback, positiveFeedback)
                .where(review.helper.id.eq(userId))
                .groupBy(positiveFeedback.description)
                .orderBy(positiveFeedback.count().desc())
                .fetch();


    }
}
