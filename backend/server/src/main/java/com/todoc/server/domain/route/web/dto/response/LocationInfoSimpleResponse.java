package com.todoc.server.domain.route.web.dto.response;

import com.todoc.server.domain.route.entity.LocationInfo;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Schema(description = "장소 요약 정보 DTO")
public class    LocationInfoSimpleResponse {

    @NotNull
    @Schema(description = "장소 ID")
    private Long locationInfoId;

    @NotNull
    @Schema(description = "장소명(상호명 주소)")
    private String placeName;

    @NotNull
    @Schema(description = "도로명 주소")
    private String address;

    @NotNull
    @Schema(description = "상세 주소")
    private String detailAddress;

    @NotNull
    @Schema(description = "위도")
    private BigDecimal lat;

    @NotNull
    @Schema(description = "경도")
    private BigDecimal lon;

    @Builder
    public LocationInfoSimpleResponse(Long locationInfoId, String placeName, String address, String detailAddress, BigDecimal lat, BigDecimal lon) {
        this.locationInfoId = locationInfoId;
        this.placeName = placeName;
        this.address = address;
        this.detailAddress = detailAddress;
        this.lat = lat;
        this.lon = lon;
    }

    public static LocationInfoSimpleResponse from(LocationInfo locationInfo) {
        return LocationInfoSimpleResponse.builder()
                .locationInfoId(locationInfo.getId())
                .placeName(locationInfo.getPlaceName())
                .address(locationInfo.getFullRoadAddress())
                .detailAddress(locationInfo.getDetailAddress())
                .lat(locationInfo.getLatitude())
                .lon(locationInfo.getLongitude())
                .build();
    }
}
