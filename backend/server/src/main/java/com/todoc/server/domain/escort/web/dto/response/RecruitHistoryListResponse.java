package com.todoc.server.domain.escort.web.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Schema(description = "이전 동행 목록 조회 응답 DTO")
public class RecruitHistoryListResponse {

    @NotNull
    @Schema(description = "이전 동행 목록")
    private List<RecruitHistorySimpleResponse> beforeList;

    @Builder
    public RecruitHistoryListResponse(List<RecruitHistorySimpleResponse> beforeList) {
        this.beforeList = beforeList;
    }
}
