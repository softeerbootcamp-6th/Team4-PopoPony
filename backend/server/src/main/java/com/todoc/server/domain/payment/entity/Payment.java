package com.todoc.server.domain.payment.entity;

import com.todoc.server.common.entity.BaseEntity;
import com.todoc.server.domain.report.entity.Report;
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
    @JoinColumn(name = "report_id")
    private Report report;

    @Column(name = "base_fee")
    private Integer baseFee;

    @Column(name = "extra_time_fee")
    private Integer extraTimeFee;

    @Column(name = "taxi_fee")
    private Integer taxiFee;

    private String status;
}