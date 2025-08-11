package com.todoc.server.domain.report.web.dto.request;

import com.todoc.server.common.dto.request.ImageCreateRequest;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Getter
@Schema(description = "동행 리포트 생성 요청 DTO")
public class ReportCreateRequest {

    @NotNull
    @Schema(description = "실제 만남 시각", example = "09:40:00")
    private LocalTime actualMeetingTime;

    @NotNull
    @Schema(description = "실제 복귀 시각", example = "13:25:00")
    private LocalTime actualReturnTime;

    @NotNull
    @Schema(description = "다음 진료/예약 여부", example = "true")
    private Boolean hasNextAppointment;

    @Schema(description = "다음 예약 일시 (hasNextAppointment=true인 경우 필수)", example = "2025-08-18T10:30:00")
    private LocalDateTime nextAppointmentTime; // hasNextAppointment = true 인 경우 필수

    @Schema(description = "리포트 상세 설명/메모", example = "진료 보조 및 귀가 동행 완료. 다음 주 재진 예정.")
    private String description;

    @Schema(description = "첨부 이미지 목록(최대 2장)")
    private List<ImageCreateRequest> imageCreateRequestList;

    @Schema(description = "택시 요금 정보")
    private TaxiFeeCreateRequest taxiFeeCreateRequest;

    @Getter
    @Schema(description = "리포트에 포함되는 택시 요금 정보")
    public static class TaxiFeeCreateRequest {

        @NotNull
        @Schema(description = "출발 요금(원)", example = "13200")
        private Integer departureFee;

        @NotNull
        @Schema(description = "출발 영수증 이미지")
        private ImageCreateRequest departureReceipt;

        @NotNull
        @Schema(description = "복귀 요금(원)", example = "13200")
        private Integer returnFee;

        @NotNull
        @Schema(description = "복귀 영수증 이미지")
        private ImageCreateRequest returnReceipt;
    }
}