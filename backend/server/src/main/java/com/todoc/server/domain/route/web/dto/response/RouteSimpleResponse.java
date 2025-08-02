package com.todoc.server.domain.route.web.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Schema(description = "경로 요약 정보 DTO")
public class RouteSimpleResponse {

    @Schema(description = "경로 ID")
    private Long routeId;

    @Schema(description = "만남 장소 위치 정보")
    private LocationInfoSimpleResponse meetingLocationInfo;

    @Schema(description = "병원 위치 정보")
    private LocationInfoSimpleResponse hospitalLocationInfo;

    @Schema(description = "복귀 장소 위치 정보")
    private LocationInfoSimpleResponse returnLocationInfo;

    @Builder
    public RouteSimpleResponse(Long routeId, LocationInfoSimpleResponse meetingLocationInfo,
                               LocationInfoSimpleResponse hospitalLocationInfo, LocationInfoSimpleResponse returnLocationInfo) {
        this.routeId = routeId;
        this.meetingLocationInfo = meetingLocationInfo;
        this.hospitalLocationInfo = hospitalLocationInfo;
        this.returnLocationInfo = returnLocationInfo;
    }
}
