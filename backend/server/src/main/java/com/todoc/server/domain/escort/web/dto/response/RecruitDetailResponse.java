package com.todoc.server.domain.escort.web.dto.response;

import com.todoc.server.domain.customer.web.dto.response.PatientSimpleResponse;
import com.todoc.server.domain.route.web.dto.response.RouteSimpleResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Schema(description = "동행 신청 상세 정보 조회 응답 DTO")
public class RecruitDetailResponse {

    @NotNull
    @Schema(description = "동행 신청 ID")
    private Long recruitId;

    @NotNull
    @Schema(description = "동행 신청의 진행 상태", allowableValues = {"매칭중", "매칭완료", "동행중", "동행완료"})
    private String status;

    @NotNull
    @Schema(description = "동행 날짜", example = "2025-08-01")
    private LocalDate escortDate;

    @NotNull
    @Schema(description = "만나는 시각", example = "09:30:00")
    private LocalTime estimatedMeetingTime;

    @NotNull
    @Schema(description = "복귀 시각", example = "12:30:00")
    private LocalTime estimatedReturnTime;

    @NotNull
    @Schema(description = "경로 요약 정보")
    private RouteSimpleResponse route;

    @NotNull
    @Schema(description = "환자 요약 정보")
    private PatientSimpleResponse patient;

    @Schema(description = "동행 목적")
    private String purpose;

    @Schema(description = "요청 사항")
    private String extraRequest;

    @Builder
    public RecruitDetailResponse(Long recruitId, String status, LocalDate escortDate, LocalTime estimatedMeetingTime,
                                 LocalTime estimatedReturnTime, RouteSimpleResponse route, PatientSimpleResponse patient,
                                 String purpose, String extraRequest) {
        this.recruitId = recruitId;
        this.status = status;
        this.escortDate = escortDate;
        this.estimatedMeetingTime = estimatedMeetingTime;
        this.estimatedReturnTime = estimatedReturnTime;
        this.route = route;
        this.patient = patient;
        this.purpose = purpose;
        this.extraRequest = extraRequest;
    }
}
