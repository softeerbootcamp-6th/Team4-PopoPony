package com.todoc.server.domain.review.repository;

import com.querydsl.core.types.Projections;
import com.todoc.server.domain.review.entity.PositiveFeedbackChoice;
import com.todoc.server.domain.review.web.dto.response.PositiveFeedbackStatResponse;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.todoc.server.domain.review.entity.QPositiveFeedback.positiveFeedback;
import static com.todoc.server.domain.review.entity.QReview.review;
import static com.todoc.server.domain.review.entity.QPositiveFeedbackChoice.positiveFeedbackChoice;

@Repository
public class PositiveFeedbackChoiceQueryRepository extends QuerydslRepositorySupport {

    public PositiveFeedbackChoiceQueryRepository() {
        super(PositiveFeedbackChoice.class);
    }

    public List<PositiveFeedbackStatResponse> findPositiveFeedbackStatByHelperUserId(Long userId) {

        return getQuerydsl().createQuery()
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
