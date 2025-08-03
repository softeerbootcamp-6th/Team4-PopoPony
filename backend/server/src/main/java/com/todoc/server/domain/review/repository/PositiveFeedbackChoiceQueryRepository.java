package com.todoc.server.domain.review.repository;

import com.querydsl.core.types.Projections;
import com.todoc.server.domain.review.entity.PositiveFeedbackChoice;
import com.todoc.server.domain.review.entity.QPositiveFeedback;
import com.todoc.server.domain.review.entity.QPositiveFeedbackChoice;
import com.todoc.server.domain.review.entity.QReview;
import com.todoc.server.domain.review.web.dto.response.PositiveFeedbackStatResponse;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class PositiveFeedbackChoiceQueryRepository extends QuerydslRepositorySupport {

    public PositiveFeedbackChoiceQueryRepository() {
        super(PositiveFeedbackChoice.class);
    }

    public List<PositiveFeedbackStatResponse> findPositiveFeedbackStatByHelperUserId(Long userId) {
        QPositiveFeedbackChoice choice = QPositiveFeedbackChoice.positiveFeedbackChoice;
        QReview review = QReview.review;
        QPositiveFeedback feedback = QPositiveFeedback.positiveFeedback;

        return getQuerydsl().createQuery()
                .select(Projections.constructor(
                        PositiveFeedbackStatResponse.class,
                        feedback.description,
                        feedback.count()
                ))
                .from(choice)
                .join(choice.review, review)
                .join(choice.positiveFeedback, feedback)
                .where(review.helper.id.eq(userId))
                .groupBy(feedback.description)
                .orderBy(feedback.count().desc())
                .fetch();
    }
}
