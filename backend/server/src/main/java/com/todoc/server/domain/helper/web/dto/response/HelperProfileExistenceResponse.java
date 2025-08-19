package com.todoc.server.domain.helper.web.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

@Getter
@Schema(description = "도우미 프로필 존재 여부 응답 DTO")
public class HelperProfileExistenceResponse {

    @NotNull
    @Schema(description = "도우미 프로필 존재 여부", example = "true")
    private boolean hasProfile;

    @Schema(description = "도우미 프로필 ID")
    private Long helperProfileId;

    @Builder
    public HelperProfileExistenceResponse(boolean hasProfile, Long helperProfileId) {
        this.hasProfile = hasProfile;
        this.helperProfileId = helperProfileId;
    }
}
