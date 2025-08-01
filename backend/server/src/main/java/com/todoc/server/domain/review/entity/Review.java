package com.todoc.server.domain.review.entity;

import com.todoc.server.common.enumeration.SatisfactionLevel;
import com.todoc.server.common.entity.BaseEntity;
import com.todoc.server.domain.auth.entity.Auth;
import com.todoc.server.domain.escort.entity.Escort;
import com.todoc.server.domain.helper.entity.Helper;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Review extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "escort_id")
    private Escort escort;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Auth customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "helper_id")
    private Auth helper;

    @Enumerated(EnumType.STRING)
    @Column(name = "satisfaction_level")
    private SatisfactionLevel satisfactionLevel;

    @Column(columnDefinition = "json",
            name = "positive_feedback")
    private String positiveFeedback;

    @Column(name = "negative_feedback")
    private String negativeFeedback;

    @Column(name = "short_comment")
    private String shortComment;
}