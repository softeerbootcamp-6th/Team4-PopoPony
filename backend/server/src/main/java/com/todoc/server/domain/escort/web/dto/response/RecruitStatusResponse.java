package com.todoc.server.domain.escort.web.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

@Getter
@Schema(description = "동행 신청 상태 응답 DTO")
public class RecruitStatusResponse {

    @NotNull
    @Schema(description = "동행 신청 ID")
    private Long recruitId;

    // 매칭중, 매칭완료, 동행중
    @NotNull
    @Schema(description = "동행 신청의 진행 상태", allowableValues = {"매칭중", "매칭완료", "동행중", "동행완료"})
    private String recruitStatus;

    @Builder
    public RecruitStatusResponse(Long recruitId, String recruitStatus) {
        this.recruitId = recruitId;
        this.recruitStatus = recruitStatus;
    }
}
