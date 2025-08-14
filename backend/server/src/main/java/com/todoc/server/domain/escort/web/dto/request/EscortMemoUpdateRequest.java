package com.todoc.server.domain.escort.web.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Schema(description = "동행 메모 작성 요청 DTO")
public class EscortMemoUpdateRequest {

    @Schema(description = "도우미가 동행 중 작성한 메모")
    private String memo;
}
