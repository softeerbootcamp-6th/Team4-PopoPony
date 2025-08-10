package com.todoc.server.domain.report.entity;

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
public class TaxiFee extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "report_id")
    private Report report;

    @Column(name = "departure_fee")
    private Integer departureFee;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "departure_receipt_image")
    private TaxiReceiptImage departureReceiptImage;

    @Column(name = "return_fee")
    private Integer returnFee;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "return_receipt_image")
    private TaxiReceiptImage returnReceiptImage;

    @Builder
    public TaxiFee(Integer departureFee, TaxiReceiptImage departureReceiptImage,
                   Integer returnFee, TaxiReceiptImage returnReceiptImage) {
        this.departureFee = departureFee;
        this.departureReceiptImage = departureReceiptImage;
        this.returnFee = returnFee;
        this.returnReceiptImage = returnReceiptImage;
    }
}
