package com.todoc.server.common.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@MappedSuperclass
public abstract class ImageObject extends BaseEntity {

    @Column(name = "s3_key", length = 1024, nullable = false)
    protected String s3Key;

    @Column(name = "content_type", length = 128)
    protected String contentType;

    @Column(name = "size_bytes")
    protected Long size;

    @Column(name = "checksum", length = 64)
    protected String checksum;
}