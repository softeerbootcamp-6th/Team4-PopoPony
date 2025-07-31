package com.todoc.server.domain.payment.entity;

import com.todoc.server.common.entity.BaseEntity;
import com.todoc.server.domain.escort.entity.Escort;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Payment extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "escort_id")
    private Escort escort;

    @Column(name = "base_fee")
    private Integer baseFee;

    @Column(name = "extra_fee")
    private Integer extraFee;

    private String status;
}