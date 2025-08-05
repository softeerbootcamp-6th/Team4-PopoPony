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

    @Column(name = "upper_addr_name")
    private String upperAddrName;

    @Column(name = "middle_addr_name")
    private String middleAddrName;

    @Column(name = "lower_addr_name")
    private String lowerAddrName;

    @Column(name = "first_no")
    private String firstAddrNo;

    @Column(name = "second_no")
    private String secondAddrNo;

    @Column(name = "road_name")
    private String roadName;

    @Column(name = "first_building_no")
    private String firstBuildingNo;

    @Column(name = "second_building_no")
    private String secondBuildingNo;

    @Column(name = "detail_address")
    private String detailAddress;

    @Column(precision = 10, scale = 7)
    private BigDecimal longitude;

    @Column(precision = 10, scale = 7)
    private BigDecimal latitude;

    @Builder
    public LocationInfo(String placeName, String upperAddrName, String middleAddrName, String lowerAddrName,
                        String firstAddrNo, String secondAddrNo, String roadName, String firstBuildingNo,
                        String secondBuildingNo, String detailAddress, BigDecimal longitude, BigDecimal latitude) {
        this.placeName = placeName;
        this.upperAddrName = upperAddrName;
        this.middleAddrName = middleAddrName;
        this.lowerAddrName = lowerAddrName;
        this.firstAddrNo = firstAddrNo;
        this.secondAddrNo = secondAddrNo;
        this.roadName = roadName;
        this.firstBuildingNo = firstBuildingNo;
        this.secondBuildingNo = secondBuildingNo;
        this.detailAddress = detailAddress;
        this.longitude = longitude;
        this.latitude = latitude;
    }

    /**
     * 도로명 주소에 대한 전체 주소를 반환합니다.
     * @return 전체 도로명 주소
     */
    public String getFullRoadAddress() {

        StringBuilder sb = new StringBuilder().append(upperAddrName);

        if (middleAddrName != null && !middleAddrName.isBlank()) {
            sb.append(middleAddrName).append(" ");
        }

        if (roadName != null && !roadName.isBlank()) {
            sb.append(roadName).append(" ");
        }

        if (firstBuildingNo != null && !firstBuildingNo.isBlank()) {
            sb.append(firstBuildingNo);
        }

        if (secondBuildingNo != null && !secondBuildingNo.isBlank()) {
            sb.append("-").append(secondBuildingNo);
        }

        return sb.toString().trim();
    }

    /**
     * 지번 주소에 대한 전체 주소를 반환합니다.
     * @return 전체 지번 주소
     */
    public String getFullLotAddress() {

        StringBuilder sb = new StringBuilder().append(upperAddrName);

        if (middleAddrName != null && !middleAddrName.isBlank()) {
            sb.append(middleAddrName).append(" ");
        }

        if (lowerAddrName != null && !lowerAddrName.isBlank()) {
            sb.append(lowerAddrName).append(" ");
        }

        if (firstAddrNo != null && !firstAddrNo.isBlank()) {
            sb.append(firstAddrNo);
        }

        if (secondAddrNo != null && !secondAddrNo.isBlank() && !"0".equals(secondAddrNo)) {
            sb.append("-").append(secondAddrNo);
        }

        return sb.toString().trim();
    }
}