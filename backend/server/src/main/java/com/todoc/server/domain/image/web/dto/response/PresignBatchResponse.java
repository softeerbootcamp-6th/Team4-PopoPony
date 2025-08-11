package com.todoc.server.domain.image.web.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

import java.util.List;

@Getter
@Schema(description = "여러 파일에 대해 발급된 S3 Presigned URL 결과 목록")
public class PresignBatchResponse {

    @Schema(description = "요청한 각 파일에 대한 presign 결과 리스트")
    private final List<PresignItemResponse> items;

    public PresignBatchResponse(List<PresignItemResponse> items) {
        this.items = items;
    }
}
