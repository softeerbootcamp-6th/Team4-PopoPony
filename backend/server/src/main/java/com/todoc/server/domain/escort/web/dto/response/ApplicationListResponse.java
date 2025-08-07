package com.todoc.server.domain.escort.web.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Schema(description = "지원 목록 조회 응답 DTO")
public class ApplicationListResponse {

    @NotNull
    @Schema(description = "지원 목록")
    private List<ApplicationSimpleResponse> applicationList;

    @Builder
    public ApplicationListResponse(List<ApplicationSimpleResponse> applicationList) {
        this.applicationList = applicationList;
    }
}
