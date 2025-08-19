package com.todoc.server.domain.report.web.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Schema(description = "리포트 작성 기본값 응답 DTO")
public class ReportDefaultValueResponse {

    @NotNull
    @Schema(description = "실제 만난 시각", example = "09:30:00")
    private LocalDateTime actualMeetingTime;

    @NotNull
    @Schema(description = "실제 복귀 시각", example = "12:30:00")
    private LocalDateTime actualReturnTime;

    @NotNull
    @Schema(description = "동행 중 메모", example = "증상 전보다 많이 호전됨")
    private String memo;

    @Builder
    public ReportDefaultValueResponse(LocalDateTime actualMeetingTime, LocalDateTime actualReturnTime, String memo) {
        this.actualMeetingTime = actualMeetingTime;
        this.actualReturnTime = actualReturnTime;
        this.memo = memo;
    }
}
