package com.todoc.server.domain.report.entity;

import com.todoc.server.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class TaxiFee extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "report_id")
    private Report report;

    @Column(name = "departure_fee")
    private Integer departureFee;

    @Column(name = "departure_receipt_image_url")
    private String departureReceiptImageUrl;

    @Column(name = "return_fee")
    private Integer returnFee;

    @Column(name = "return_receipt_image_url")
    private String returnReceiptImageUrl;
}
