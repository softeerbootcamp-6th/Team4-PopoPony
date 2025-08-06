package com.todoc.server.domain.escort.entity;

import com.todoc.server.common.entity.BaseEntity;
import com.todoc.server.common.enumeration.EscortStatus;
import com.todoc.server.domain.auth.entity.Auth;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Getter
@Setter
@SQLRestriction("deleted_at is NULL")
public class Escort extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruit_id")
    private Recruit recruit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Auth customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "helper_id")
    private Auth helper;

    private String memo;

    @Enumerated(EnumType.STRING)
    private EscortStatus status;

    @Builder
    public Escort(Long id, Recruit recruit, Auth customer, Auth helper, String memo, EscortStatus status) {
        this.id = id;
        this.recruit = recruit;
        this.customer = customer;
        this.helper = helper;
        this.memo = memo;
        this.status = status;
    }
}