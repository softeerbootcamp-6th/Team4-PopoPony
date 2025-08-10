package com.todoc.server.common.entity;

import com.todoc.server.common.dto.request.ImageCreateRequest;
import jakarta.persistence.*;
import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ImageMeta extends BaseEntity {

    @Column(name = "s3_key", length = 1024, nullable = false)
    protected String s3Key;

    @Column(name = "content_type", length = 128)
    protected String contentType;

    @Column(name = "size_bytes")
    protected Long size;

    @Column(name = "checksum", length = 64)
    protected String checksum;

    public static ImageMeta from(ImageCreateRequest dto) {
        return new ImageMeta(dto.getS3Key(), dto.getContentType(), dto.getSize(), dto.getChecksum());
    }
}