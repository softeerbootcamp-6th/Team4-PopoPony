package com.todoc.server.domain.route.web.dto.response;

import com.todoc.server.domain.route.entity.LocationInfo;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

@Getter
@Schema(description = "장소 요약 정보 DTO")
public class LocationInfoSimpleResponse {

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

    @Builder
    public LocationInfoSimpleResponse(Long locationInfoId, String placeName, String address, String detailAddress) {
        this.locationInfoId = locationInfoId;
        this.placeName = placeName;
        this.address = address;
        this.detailAddress = detailAddress;
    }

    public static LocationInfoSimpleResponse from(LocationInfo locationInfo) {
        return LocationInfoSimpleResponse.builder()
                .locationInfoId(locationInfo.getId())
                .placeName(locationInfo.getPlaceName())
                .address(locationInfo.getFullRoadAddress())
                .detailAddress(locationInfo.getDetailAddress())
                .build();
    }
}
