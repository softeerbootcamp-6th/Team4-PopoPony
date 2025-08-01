package com.todoc.server.domain.review.entity;

import com.todoc.server.common.entity.BaseEntity;
import com.todoc.server.domain.helper.entity.Helper;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class PositiveFeedbackChoice extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "helper_id")
    private Helper helper;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "positive_feedback_id")
    private PositiveFeedback positiveFeedback;
}