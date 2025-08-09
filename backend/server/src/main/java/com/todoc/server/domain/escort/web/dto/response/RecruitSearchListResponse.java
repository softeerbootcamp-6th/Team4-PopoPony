package com.todoc.server.domain.escort.web.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Schema(description = "동행 목록 검색용 응답 DTO")
public class RecruitSearchListResponse {

    @NotNull
    @Schema(description = "모집 중인 동행 목록")
    private List<RecruitSimpleResponse> inProgressList;

    @Builder
    public RecruitSearchListResponse(List<RecruitSimpleResponse> inProgressList) {
        this.inProgressList = inProgressList;
    }
}
