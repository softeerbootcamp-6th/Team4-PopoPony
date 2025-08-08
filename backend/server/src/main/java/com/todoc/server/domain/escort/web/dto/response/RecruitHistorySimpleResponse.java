package com.todoc.server.domain.escort.web.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Schema(description = "이전 동행 신청 정보 요약본 응답 DTO")
public class RecruitHistorySimpleResponse {

    @NotNull
    @Schema(description = "동행 신청 ID")
    private Long recruitId;

    @NotNull
    @Schema(description = "환자 이름", example = "홍길동")
    private String name;

    @NotNull
    @Schema(description = "목적지 병원")
    private String destination;

    @NotNull
    @Schema(description = "동행 날짜", example = "2025-08-01")
    private LocalDate escortDate;

    @Builder
    public RecruitHistorySimpleResponse(Long recruitId, String name, String destination, LocalDate escortDate) {
        this.recruitId = recruitId;
        this.name = name;
        this.destination = destination;
        this.escortDate = escortDate;
    }
}
