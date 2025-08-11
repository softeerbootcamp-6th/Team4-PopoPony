package com.todoc.server.domain.image.entity;

import com.todoc.server.common.dto.request.ImageCreateRequest;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ImageMeta {

    @Column(name = "s3_key", nullable = false)
    protected String s3Key;

    @Column(name = "content_type")
    protected String contentType;

    @Column(name = "size_bytes")
    protected Long size;

    @Column(name = "checksum")
    protected String checksum;

    public static ImageMeta from(ImageCreateRequest dto) {
        return new ImageMeta(dto.getS3Key(), dto.getContentType(), dto.getSize(), dto.getChecksum());
    }
}