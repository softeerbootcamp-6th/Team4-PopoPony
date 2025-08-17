package com.todoc.server.domain.report.entity;

import com.todoc.server.common.entity.BaseEntity;
import com.todoc.server.domain.image.entity.ImageFile;
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

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "report_id")
    private Report report;

    @Column(name = "departure_fee")
    private Integer departureFee;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "departure_receipt_image_id")
    private ImageFile departureReceiptImage;

    @Column(name = "return_fee")
    private Integer returnFee;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "return_receipt_image_id")
    private ImageFile returnReceiptImage;

    @Builder
    public TaxiFee(Integer departureFee, ImageFile departureReceiptImage,
                   Integer returnFee, ImageFile returnReceiptImage) {
        this.departureFee = departureFee;
        this.departureReceiptImage = departureReceiptImage;
        this.returnFee = returnFee;
        this.returnReceiptImage = returnReceiptImage;
    }
}
