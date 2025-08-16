package com.todoc.server.domain.escort.web.dto.response;

import com.todoc.server.domain.customer.web.dto.response.PatientSimpleResponse;
import com.todoc.server.domain.route.web.dto.response.RouteDetailResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@Schema(description = "동행 상세 정보 조회 응답 DTO")
public class EscortDetailResponse {

    @NotNull
    @Schema(description = "동행 ID")
    private Long escortId;

    @NotNull
    @Schema(description = "경로 정보 ([위도, 경도] 배열)", example = "[[12,23],[13,45],[12,66]]")
    private String coordinates;

    @NotNull
    @Schema(description = "동행 날짜", example = "2025-08-01")
    private LocalDate escortDate;

    @NotNull
    @Schema(description = "동행 상태", example = "병원행")
    private String escortStatus;

    @NotNull
    @Schema(description = "만나는 시각", example = "09:30:00")
    private LocalTime estimatedMeetingTime;

    @NotNull
    @Schema(description = "복귀 시각", example = "12:30:00")
    private LocalTime estimatedReturnTime;

    @NotNull
    @Schema(description = "경로 세부 정보")
    private RouteDetailResponse route;

    @NotNull
    @Schema(description = "고객 연락처")
    private String customerContact;

    @NotNull
    @Schema(description = "환자 요약 정보")
    private PatientSimpleResponse patient;

    @Schema(description = "동행 목적")
    private String purpose;

    @Schema(description = "요청 사항")
    private String extraRequest;

    @Builder
    public EscortDetailResponse(Long escortId, String coordinates, LocalDate escortDate, String escortStatus, LocalTime estimatedMeetingTime, LocalTime estimatedReturnTime,
                                RouteDetailResponse route, String customerContact, PatientSimpleResponse patient, String purpose,
                                String extraRequest) {
        this.escortId = escortId;
        this.coordinates = coordinates;
        this.escortDate = escortDate;
        this.escortStatus = escortStatus;
        this.estimatedMeetingTime = estimatedMeetingTime;
        this.estimatedReturnTime = estimatedReturnTime;
        this.route = route;
        this.customerContact = customerContact;
        this.patient = patient;
        this.purpose = purpose;
        this.extraRequest = extraRequest;
    }
}
