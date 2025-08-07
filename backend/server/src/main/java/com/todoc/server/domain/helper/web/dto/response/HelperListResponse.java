package com.todoc.server.domain.helper.web.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Schema(description = "도우미 목록 조회 응답 DTO")
public class HelperListResponse {

    @NotNull
    @Schema(description = "도우미 목록")
    private List<HelperSimpleResponse> helperList;

    @Builder
    public HelperListResponse(List<HelperSimpleResponse> helperList) {
        this.helperList = helperList;
    }
}
