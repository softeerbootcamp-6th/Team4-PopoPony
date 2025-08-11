package com.todoc.server.domain.s3.web.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

import java.util.Map;

@Getter
@Schema(description = "단일 파일에 대한 S3 Presigned URL과 업로드 시 필요한 헤더 정보")
public class PresignItemResponse {

    @Schema(description = "S3 Object Key(저장 경로). 업로드 후 DB 저장/참조에 사용")
    private final String s3Key;

    @Schema(description = "S3로 직접 PUT 업로드할 Presigned URL")
    private final String uploadUrl;

    @Schema(description = "PUT 요청 시 반드시 포함해야 하는 헤더 맵(Content-Type, Content-MD5 등)")
    private final Map<String, String> requiredHeaders;

    @Schema(description = "description = \"미리보기/다운로드용 GET Presigned URL\"")
    private final String previewUrl;

    public PresignItemResponse(String s3Key, String uploadUrl, Map<String, String> requiredHeaders, String previewUrl) {
        this.s3Key = s3Key;
        this.uploadUrl = uploadUrl;
        this.requiredHeaders = requiredHeaders;
        this.previewUrl = previewUrl;
    }
}
