package com.todoc.server.domain.route.web.dto.response;

import com.todoc.server.domain.route.Coordinate;
import com.todoc.server.domain.route.entity.Route;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Schema(description = "경로 요약 정보 DTO")
public class RouteSimpleResponse {

    @NotNull
    @Schema(description = "경로 ID")
    private Long routeId;

    @NotNull
    @Schema(description = "만남 장소 위치 정보")
    private LocationInfoSimpleResponse meetingLocationInfo;

    @NotNull
    @Schema(description = "병원 위치 정보")
    private LocationInfoSimpleResponse hospitalLocationInfo;

    @NotNull
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

    public static RouteSimpleResponse from(Route route) {
        return RouteSimpleResponse.builder()
                .routeId(route.getId())
                .meetingLocationInfo(LocationInfoSimpleResponse.from(route.getMeetingLocationInfo()))
                .hospitalLocationInfo(LocationInfoSimpleResponse.from(route.getHospitalLocationInfo()))
                .returnLocationInfo(LocationInfoSimpleResponse.from(route.getReturnLocationInfo()))
                .build();
    }
}
