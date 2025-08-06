package com.todoc.server.domain.review.entity;

import com.todoc.server.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Getter
@Setter
@NoArgsConstructor
@SQLRestriction("deleted_at is NULL")
public class PositiveFeedbackChoice extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id")
    private Review review;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "positive_feedback_id")
    private PositiveFeedback positiveFeedback;

    @Builder
    public PositiveFeedbackChoice(Review review, PositiveFeedback positiveFeedback) {
        this.review = review;
        this.positiveFeedback = positiveFeedback;
    }
}