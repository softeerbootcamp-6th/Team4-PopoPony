package com.todoc.server.domain.route.web.dto.response;

import com.todoc.server.domain.route.entity.Route;
import com.todoc.server.domain.route.entity.RouteLeg;
import com.todoc.server.domain.route.exception.RouteLegNotFoundException;
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
    @Schema(description = "만남장소-병원 예상 이동 시간(초)")
    private int meetingToHospitalEstimatedTime;

    @NotNull
    @Schema(description = "만남장소-병원 예상 택시 요금(원)")
    private int meetingToHospitalEstimatedTaxiFee;

    @NotNull
    @Schema(description = "병원-복귀장소 예상 이동 시간(초)")
    private int hospitalToReturnEstimatedTime;

    @NotNull
    @Schema(description = "병원-복귀장소 예상 택시 요금(원)")
    private int hospitalToReturnEstimatedTaxiFee;

    @NotNull
    @Schema(description = "병원까지의 경로 정보 ([위도, 경도] 배열)", example = "[[12,23],[13,45],[12,66]]")
    private String meetingToHospital;

    @NotNull
    @Schema(description = "복귀장소까지의 경로 정보 ([위도, 경도] 배열)", example = "[[12,23],[13,45],[12,66]]")
    private String hospitalToReturn;

    @Builder
    public RouteDetailResponse(RouteSimpleResponse routeSimple,
                               int meetingToHospitalEstimatedTime, int meetingToHospitalEstimatedTaxiFee,
                               int hospitalToReturnEstimatedTime, int hospitalToReturnEstimatedTaxiFee, String meetingToHospital, String hospitalToReturn) {
        this.routeSimple = routeSimple;
        this.meetingToHospitalEstimatedTime = meetingToHospitalEstimatedTime;
        this.meetingToHospitalEstimatedTaxiFee = meetingToHospitalEstimatedTaxiFee;
        this.hospitalToReturnEstimatedTime = hospitalToReturnEstimatedTime;
        this.hospitalToReturnEstimatedTaxiFee = hospitalToReturnEstimatedTaxiFee;
        this.meetingToHospital = meetingToHospital;
        this.hospitalToReturn = hospitalToReturn;
    }

    public static RouteDetailResponse from(Route route, RouteLeg meetingToHospital, RouteLeg hospitalToReturn) {
        return RouteDetailResponse.builder()
                .routeSimple(RouteSimpleResponse.from(route))
                .meetingToHospitalEstimatedTime(meetingToHospital.getTotalTime())
                .meetingToHospitalEstimatedTaxiFee(meetingToHospital.getTaxiFare())
                .hospitalToReturnEstimatedTime(hospitalToReturn.getTotalTime())
                .hospitalToReturnEstimatedTaxiFee(hospitalToReturn.getTaxiFare())
                .meetingToHospital(route.getMeetingToHospital().getCoordinates())
                .hospitalToReturn(route.getHospitalToReturn().getCoordinates())
                .build();
    }

    public static RouteDetailResponse from(Route route) {

        RouteLeg meetingToHospital = route.getMeetingToHospital();
        RouteLeg hospitalToReturn = route.getHospitalToReturn();

        if (meetingToHospital == null || hospitalToReturn == null) {
            throw new RouteLegNotFoundException();
        }

        return RouteDetailResponse.builder()
                .routeSimple(RouteSimpleResponse.from(route))
                .meetingToHospitalEstimatedTime(meetingToHospital.getTotalTime())
                .meetingToHospitalEstimatedTaxiFee(meetingToHospital.getTaxiFare())
                .hospitalToReturnEstimatedTime(hospitalToReturn.getTotalTime())
                .hospitalToReturnEstimatedTaxiFee(hospitalToReturn.getTaxiFare())
                .meetingToHospital(route.getMeetingToHospital().getCoordinates())
                .hospitalToReturn(route.getHospitalToReturn().getCoordinates())
                .build();
    }
}
