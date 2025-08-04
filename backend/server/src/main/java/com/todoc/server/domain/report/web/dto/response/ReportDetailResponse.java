package com.todoc.server.domain.report.web.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Schema(description = "리포트 상세 정보 응답 DTO")
public class ReportDetailResponse {

    @Schema(description = "리포트 ID")
    private Long reportId;

    @Schema(description = "실제 만남 시각")
    private LocalTime actualMeetingTime;

    @Schema(description = "실제 복귀 시각")
    private LocalTime actualReturnTime;

    @Schema(description = "초과한 시간")
    private Integer extraMinutes;

    @Schema(description = "다음 예약 존재 여부")
    private Boolean hasNextAppointment;

    @Schema(description = "다음 예약 시각")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime nextAppointmentTime;

    @Schema(description = "전달 내용")
    private String description;

    @Schema(description = "기존 결제금액")
    private Integer baseFee;

    @Schema(description = "택시 요금")
    private Integer taxiFee;

    @Schema(description = "이용 시간 초과 요금")
    private Integer extraTimeFee;

    @Builder
    public ReportDetailResponse(Long reportId, LocalTime actualMeetingTime, LocalTime actualReturnTime,
                                Integer extraMinutes, Boolean hasNextAppointment, LocalDateTime nextAppointmentTime,
                                String description, Integer baseFee, Integer taxiFee, Integer extraTimeFee) {
        this.reportId = reportId;
        this.actualMeetingTime = actualMeetingTime;
        this.actualReturnTime = actualReturnTime;
        this.extraMinutes = extraMinutes;
        this.hasNextAppointment = hasNextAppointment;
        this.nextAppointmentTime = nextAppointmentTime;
        this.description = description;
        this.baseFee = baseFee;
        this.taxiFee = taxiFee;
        this.extraTimeFee = extraTimeFee;
    }
}
