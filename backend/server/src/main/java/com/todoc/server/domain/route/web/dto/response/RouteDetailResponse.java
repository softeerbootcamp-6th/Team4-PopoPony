package com.todoc.server.domain.route.web.dto.response;

import com.todoc.server.domain.route.entity.Route;
import com.todoc.server.domain.route.entity.RouteLeg;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

@Getter
@Schema(description = "경로 상세 정보 DTO")
public class RouteDetailResponse {
    @NotNull
    @Schema(description = "경로 요약 정보")
    private RouteSimpleResponse routeSimple;

    @NotNull
    @Schema(description = "만남장소-병원 예상 이동 시간(분)")
    private int meetingToHospitalEstimatedTime;

    @NotNull
    @Schema(description = "만남장소-병원 예상 택시 요금(원)")
    private int meetingToHospitalEstimatedTaxiFee;

    @NotNull
    @Schema(description = "병원-복귀장소 예상 이동 시간(분)")
    private int hospitalToReturnEstimatedTime;

    @NotNull
    @Schema(description = "병원-복귀장소 예상 택시 요금(원)")
    private int hospitalToReturnEstimatedTaxiFee;

    @Builder
    public RouteDetailResponse(RouteSimpleResponse routeSimple,
                               int meetingToHospitalEstimatedTime, int meetingToHospitalEstimatedTaxiFee,
                               int hospitalToReturnEstimatedTime, int hospitalToReturnEstimatedTaxiFee) {
        this.routeSimple = routeSimple;
        this.meetingToHospitalEstimatedTime = meetingToHospitalEstimatedTime;
        this.meetingToHospitalEstimatedTaxiFee = meetingToHospitalEstimatedTaxiFee;
        this.hospitalToReturnEstimatedTime = hospitalToReturnEstimatedTime;
        this.hospitalToReturnEstimatedTaxiFee = hospitalToReturnEstimatedTaxiFee;
    }

    public static RouteDetailResponse from(Route route, RouteLeg meetingToHospital, RouteLeg hospitalToReturn) {
        return RouteDetailResponse.builder()
                .routeSimple(RouteSimpleResponse.from(route))
                .meetingToHospitalEstimatedTime(meetingToHospital.getTotalTime())
                .meetingToHospitalEstimatedTaxiFee(meetingToHospital.getTaxiFare())
                .hospitalToReturnEstimatedTime(hospitalToReturn.getTotalTime())
                .hospitalToReturnEstimatedTaxiFee(hospitalToReturn.getTaxiFare())
                .build();
    }

    public static RouteDetailResponse from(Route route) {

        RouteLeg meetingToHospital = route.getMeetingToHospital();
        RouteLeg hospitalToReturn = route.getHospitalToReturn();

        return RouteDetailResponse.builder()
                .routeSimple(RouteSimpleResponse.from(route))
                .meetingToHospitalEstimatedTime(meetingToHospital.getTotalTime())
                .meetingToHospitalEstimatedTaxiFee(meetingToHospital.getTaxiFare())
                .hospitalToReturnEstimatedTime(hospitalToReturn.getTotalTime())
                .hospitalToReturnEstimatedTaxiFee(hospitalToReturn.getTaxiFare())
                .build();
    }
}
