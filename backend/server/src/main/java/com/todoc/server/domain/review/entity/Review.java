package com.todoc.server.domain.review.entity;

import com.todoc.server.common.enumeration.SatisfactionLevel;
import com.todoc.server.common.entity.BaseEntity;
import com.todoc.server.domain.auth.entity.Auth;
import com.todoc.server.domain.escort.entity.Recruit;
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
public class Review extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruit_id")
    private Recruit recruit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Auth customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "helper_id")
    private Auth helper;

    @Enumerated(EnumType.STRING)
    @Column(name = "satisfaction_level")
    private SatisfactionLevel satisfactionLevel;

    @Column(name = "negative_feedback")
    private String negativeFeedback;

    @Column(name = "short_comment")
    private String shortComment;

    @Builder
    public Review(Recruit recruit, Auth customer, Auth helper, SatisfactionLevel satisfactionLevel, String negativeFeedback, String shortComment) {
        this.recruit = recruit;
        this.customer = customer;
        this.helper = helper;
        this.satisfactionLevel = satisfactionLevel;
        this.negativeFeedback = negativeFeedback;
        this.shortComment = shortComment;
    }
}