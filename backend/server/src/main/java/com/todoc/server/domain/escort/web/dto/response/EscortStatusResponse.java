package com.todoc.server.domain.escort.web.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Schema(description = "동행 상태 변화 응답 DTO")
public class EscortStatusResponse {

    @NotNull
    @Schema(description = "동행 ID")
    private Long escortId;

    @NotNull
    @Schema(description = "동행 상태", example = "병원행")
    private String escortStatus;

    @NotNull
    @Schema(description = "동행 상태", example = "병원행")
    private LocalDateTime timestamp;

    public EscortStatusResponse(Long escortId, String escortStatus, LocalDateTime timestamp) {
        this.escortId = escortId;
        this.escortStatus = escortStatus;
        this.timestamp = timestamp;
    }
}
