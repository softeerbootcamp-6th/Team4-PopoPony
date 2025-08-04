package com.todoc.server.domain.route.entity;

import com.todoc.server.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class LocationInfo extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "place_name")
    private String placeName;

    private String address;

    @Column(name = "detail_address")
    private String detailAddress;

    @Column(precision = 10, scale = 7)
    private BigDecimal longitude;

    @Column(precision = 10, scale = 7)
    private BigDecimal latitude;

    @Builder
    public LocationInfo(String placeName, String address, String detailAddress, BigDecimal longitude, BigDecimal latitude) {
        this.placeName = placeName;
        this.address = address;
        this.detailAddress = detailAddress;
        this.longitude = longitude;
        this.latitude = latitude;
    }
}