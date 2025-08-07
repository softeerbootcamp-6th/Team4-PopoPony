package com.todoc.server.domain.escort.web.dto.response;

import com.todoc.server.domain.helper.web.dto.response.HelperSimpleResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

@Getter
@Schema(description = "지원 정보 요약본 응답 DTO")
public class ApplicationSimpleResponse {

    @NotNull
    @Schema(description = "지원 ID")
    private Long applicationId;

    @NotNull
    @Schema(description = "도우미 요약 정보")
    private HelperSimpleResponse helper;

    @Builder
    public ApplicationSimpleResponse(Long applicationId, HelperSimpleResponse helper) {
        this.applicationId = applicationId;
        this.helper = helper;
    }
}
