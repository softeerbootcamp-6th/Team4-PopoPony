package com.todoc.server.common.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
@Schema(description = "이미지 등록 요청 DTO")
public class ImageCreateRequest {

    @NotNull
    @Schema(description = "S3 오브젝트 키(버킷 내부 경로). presigned 업로드 시 사용했던 key 그대로 전달")
    private String s3Key;

    @NotNull
    @Schema(description = "원본 Content-Type (이미지 MIME 타입)")
    private String contentType;

    @NotNull
    @Schema(description = "파일 크기(byte)")
    private Long size;

    @NotNull
    @Schema(description = "무결성 해시(일반적으로 S3 ETag)")
    private String checksum;
}
