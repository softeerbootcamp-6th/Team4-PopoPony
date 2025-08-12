package com.todoc.server.domain.image.web.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.util.List;

@Getter
@Schema(description = "여러 파일에 대해 S3 업로드용 Presigned URL 발급을 요청하는 DTO")
public class PresignBatchRequest {

    @NotBlank
    @Schema(description = "S3 Object Key의 접두 경로(prefix)")
    private String prefix;

    @NotNull
    @Schema(description = "Presigned URL을 발급할 파일들의 메타데이터 목록")
    private List<FileSpec> files;

    @Getter
    @Schema(description = "단일 파일에 대한 Presigned URL 발급에 필요한 메타데이터")
    public static class FileSpec {

        @NotBlank
        @Schema(description = "업로드 시 사용할 MIME 타입")
        private String contentType;

        @NotNull
        @Schema(description = "파일 크기(bytes)")
        private Long size;

        @NotBlank
        @Schema(description = "파일 바이트의 MD5 해시를 Base64로 인코딩한 값")
        private String checksum;
    }
}
