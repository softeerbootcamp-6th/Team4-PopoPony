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

    @NotNull
    @Schema(description = "병원까지의 경로 정보 ([위도, 경도] 배열)", example = "[[12,23],[13,45],[12,66]]")
    private List<Coordinate> meetingToHospital;

    @NotNull
    @Schema(description = "복귀장소까지의 경로 정보 ([위도, 경도] 배열)", example = "[[12,23],[13,45],[12,66]]")
    private List<Coordinate> hospitalToReturn;

    @Builder
    public RouteSimpleResponse(Long routeId, LocationInfoSimpleResponse meetingLocationInfo,
                               LocationInfoSimpleResponse hospitalLocationInfo, LocationInfoSimpleResponse returnLocationInfo, List<Coordinate> meetingToHospital, List<Coordinate> hospitalToReturn) {
        this.routeId = routeId;
        this.meetingLocationInfo = meetingLocationInfo;
        this.hospitalLocationInfo = hospitalLocationInfo;
        this.returnLocationInfo = returnLocationInfo;
        this.meetingToHospital = meetingToHospital;
        this.hospitalToReturn = hospitalToReturn;
    }

    public static RouteSimpleResponse from(Route route) {
        return RouteSimpleResponse.builder()
                .routeId(route.getId())
                .meetingLocationInfo(LocationInfoSimpleResponse.from(route.getMeetingLocationInfo()))
                .hospitalLocationInfo(LocationInfoSimpleResponse.from(route.getHospitalLocationInfo()))
                .returnLocationInfo(LocationInfoSimpleResponse.from(route.getReturnLocationInfo()))
                .meetingToHospital(route.getMeetingToHospital().getCoordinates())
                .hospitalToReturn(route.getHospitalToReturn().getCoordinates())
                .build();
    }
}
