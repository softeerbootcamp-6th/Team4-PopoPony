package com.todoc.server.domain.image.web.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.Instant;

@Getter
@AllArgsConstructor
public class ImageGetUrlResponse {
    private final String s3Key;
    private final String url;
    private final Instant expiresAt;
    private final String contentType;
    private final Long size;
}
