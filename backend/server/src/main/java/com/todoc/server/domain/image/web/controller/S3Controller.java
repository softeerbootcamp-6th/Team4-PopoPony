package com.todoc.server.domain.image.web.controller;

import com.todoc.server.common.response.Response;
import com.todoc.server.domain.image.service.S3Service;
import com.todoc.server.domain.image.web.dto.request.PresignBatchRequest;
import com.todoc.server.domain.image.web.dto.response.PresignBatchResponse;
import com.todoc.server.domain.image.web.dto.response.PresignItemResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class S3Controller {

    private final S3Service s3Service;

    @Operation(
            summary = "S3 업로드용 Presigned URL 발급",
            description = "prefix와 파일 메타데이터를 받아 각 파일에 대한 PUT/GET presigned URL을 생성합니다.")
    @ApiResponse(
            responseCode = "200",
            description = "Presigned URL 발급 성공")
    @PostMapping("/presigned")
    public Response<PresignBatchResponse> presign(@Valid @RequestBody PresignBatchRequest req) {
        List<PresignItemResponse> items = req.getFiles().stream().map(f -> {
            String ext = guessExt(f.getContentType());
            String key = "%s/%s.%s".formatted(req.getPrefix(), UUID.randomUUID(), ext);
            var put = s3Service.createPresignedPut(key, f.getContentType(), f.getChecksum());
            String previewUrl = s3Service.createPresignedGetByKey(key);
            return new PresignItemResponse(put.getS3Key(), put.getUrl(), put.getHeaders(), previewUrl);
        }).toList();

        return Response.from(new PresignBatchResponse(items));
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

    @GetMapping("/{imageFileId}/presigned")
    public ResponseEntity<Void> getPresignedUrl(@PathVariable Long imageFileId) {

        return ResponseEntity.status(302)
                .location(URI.create(s3Service.createPresignedGetById(imageFileId)))
                .cacheControl(CacheControl.noStore().cachePrivate())
                .header("Pragma", "no-cache")
                .build();
    }
}
