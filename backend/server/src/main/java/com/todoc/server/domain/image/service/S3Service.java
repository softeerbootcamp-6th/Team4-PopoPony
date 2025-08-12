package com.todoc.server.domain.image.service;

import com.todoc.server.domain.image.entity.ImageFile;
import com.todoc.server.domain.image.entity.ImageMeta;
import com.todoc.server.domain.image.exception.ImageFileInvalidException;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;

import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

@Service
@RequiredArgsConstructor
public class S3Service {

    private final S3Client s3;
    private final S3Presigner presigner;
    private final ImageFileService imageFileService;

    @Value("${aws.s3.bucket}")
    private String bucket;

    @Value("${upload.presign.put-expire-seconds:600}")
    private long putExpireSeconds;

    @Value("${upload.presign.get-expire-seconds:600}")
    private long getExpireSeconds;

    /**
     * 업로드용 PUT presigned URL 생성
     */
    public PresignedPut createPresignedPut(String key, String contentType, String contentMd5Base64) {
        PutObjectRequest put = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .contentType(contentType)
                .contentMD5(contentMd5Base64) // 클라가 동일 헤더로 업로드해야 함
                .build();

        PutObjectPresignRequest presignReq = PutObjectPresignRequest.builder()
                .putObjectRequest(put)
                .signatureDuration(Duration.ofSeconds(putExpireSeconds))
                .build();

        PresignedPutObjectRequest presigned = presigner.presignPutObject(presignReq);

        // 클라이언트가 반드시 보낼 헤더만 안내 (나머지 Host 등은 브라우저가 채움)
        Map<String, String> requiredHeaders = Map.of(
                "Content-Type", contentType,
                "Content-MD5", contentMd5Base64
        );

        return PresignedPut.builder()
                .s3Key(key)
                .url(presigned.url().toString())
                .headers(requiredHeaders)
                .build();
    }

    /**
     * 브라우저 표시용 GET presigned URL 생성
     */
    public String createPresignedGetByKey(String key) {
        GetObjectRequest get = GetObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .build();

        GetObjectPresignRequest presignReq = GetObjectPresignRequest.builder()
                .getObjectRequest(get)
                .signatureDuration(Duration.ofSeconds(getExpireSeconds))
                .build();

        return presigner.presignGetObject(presignReq).url().toString();
    }

    /**
     * 브라우저 표시용 GET presigned URL 생성
     */
    public String createPresignedGetById(Long imageFileId) {

        ImageFile imageFile = imageFileService.getImageFileById(imageFileId);
        ImageMeta imageMeta = imageFile.getImageMeta();

        if (imageMeta == null || imageMeta.getS3Key() == null || imageMeta.getS3Key().isBlank()) {
            throw new ImageFileInvalidException();
        }

        return createPresignedGetByKey(imageMeta.getS3Key());
    }

    /**
     * 내부 DTO
     */
    @Getter
    @Builder
    public static class PresignedPut {
        private final String s3Key;
        private final String url;
        private final Map<String, String> headers;
    }
}
