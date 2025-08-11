package com.todoc.server.domain.s3.web.controller;

import com.todoc.server.domain.s3.service.S3UploadService;
import com.todoc.server.domain.s3.web.dto.request.PresignBatchRequest;
import com.todoc.server.domain.s3.web.dto.response.PresignBatchResponse;
import com.todoc.server.domain.s3.web.dto.response.PresignItemResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/uploads")
@RequiredArgsConstructor
public class S3UploadController {

    private final S3UploadService s3UploadService;

    @Operation(
            summary = "S3 업로드용 Presigned URL 발급",
            description = "prefix와 파일 메타데이터를 받아 각 파일에 대한 PUT/GET presigned URL을 생성합니다.")
    @ApiResponse(
            responseCode = "200",
            description = "Presigned URL 발급 성공")
    @PostMapping("/presign")
    public PresignBatchResponse presign(@Valid @RequestBody PresignBatchRequest req) {
        List<PresignItemResponse> items = req.getFiles().stream().map(f -> {
            String ext = guessExt(f.getContentType());
            String key = "%s/%s.%s".formatted(req.getPrefix(), UUID.randomUUID(), ext);
            var put = s3UploadService.createPresignedPut(key, f.getContentType(), f.getChecksum());
            String previewUrl = s3UploadService.createPresignedGet(key);
            return new PresignItemResponse(put.getS3Key(), put.getUrl(), put.getHeaders(), previewUrl);
        }).toList();

        return new PresignBatchResponse(items);
    }

    /**
     * 파일 확장자 추론
     */
    private String guessExt(String contentType) {
        if (contentType == null) return "bin";
        if (contentType.contains("png")) return "png";
        if (contentType.contains("jpeg") || contentType.contains("jpg")) return "jpg";
        if (contentType.contains("webp")) return "webp";
        return "bin";
    }
}
