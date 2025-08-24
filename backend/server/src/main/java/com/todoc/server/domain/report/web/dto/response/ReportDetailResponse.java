package com.todoc.server.domain.report.web.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Getter
@Schema(description = "리포트 상세 정보 응답 DTO")
public class ReportDetailResponse {

    @NotNull
    @Schema(description = "리포트 ID")
    private Long reportId;

    @NotNull
    @Schema(description = "실제 만남 시각")
    private LocalTime actualMeetingTime;

    @NotNull
    @Schema(description = "실제 복귀 시각")
    private LocalTime actualReturnTime;

    @NotNull
    @Schema(description = "초과한 시간")
    private Integer extraMinutes;

    @NotNull
    @Schema(description = "다음 예약 존재 여부")
    private Boolean hasNextAppointment;

    @Schema(description = "다음 예약 시각")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime nextAppointmentTime;

    @Schema(description = "첨부 이미지 URL 목록")
    private List<String> imageAttachmentList;

    @Schema(description = "전달 내용")
    private String description;

    @NotNull
    @Schema(description = "기존 결제금액")
    private Integer baseFee;

    @NotNull
    @Schema(description = "택시 요금")
    private Integer taxiFee;

    @NotNull
    @Schema(description = "이용 시간 초과 요금")
    private Integer extraTimeFee;

    @Builder
    public ReportDetailResponse(Long reportId, LocalTime actualMeetingTime, LocalTime actualReturnTime,
                                Integer extraMinutes, Boolean hasNextAppointment, LocalDateTime nextAppointmentTime,
                                List<String> imageAttachmentList, String description, Integer baseFee, Integer taxiFee, Integer extraTimeFee) {
        this.reportId = reportId;
        this.actualMeetingTime = actualMeetingTime;
        this.actualReturnTime = actualReturnTime;
        this.extraMinutes = extraMinutes;
        this.hasNextAppointment = hasNextAppointment;
        this.nextAppointmentTime = nextAppointmentTime;
        this.imageAttachmentList = imageAttachmentList;
        this.description = description;
        this.baseFee = baseFee;
        this.taxiFee = taxiFee;
        this.extraTimeFee = extraTimeFee;
    }

    public ReportDetailResponse() {
        this.reportId = 0L;
        this.actualMeetingTime = LocalTime.now();
        this.actualReturnTime = LocalTime.now();
        this.extraMinutes = 0;
        this.hasNextAppointment = false;
        this.baseFee = 0;
        this.taxiFee = 0;
        this.extraTimeFee = 0;
        this.nextAppointmentTime = null;
        this.imageAttachmentList = null;
        this.description = null;
    }
}
