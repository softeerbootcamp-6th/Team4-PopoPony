package com.todoc.server.domain.escort.web.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Schema(description = "동행 목록 조회 응답 DTO")
public class RecruitListResponse {

    @NotNull
    @Schema(description = "진행 중인 동행 목록")
    private List<RecruitSimpleResponse> inProgressList;

    @NotNull
    @Schema(description = "완료된 동행 목록")
    private List<RecruitSimpleResponse> completedList;

    @Builder
    public RecruitListResponse(List<RecruitSimpleResponse> inProgressList,
                               List<RecruitSimpleResponse> completedList) {
        this.inProgressList = inProgressList;
        this.completedList = completedList;
    }
}
