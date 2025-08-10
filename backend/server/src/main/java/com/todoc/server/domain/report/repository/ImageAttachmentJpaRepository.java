package com.todoc.server.domain.report.repository;

import com.todoc.server.domain.report.entity.ImageAttachment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageAttachmentJpaRepository extends JpaRepository<ImageAttachment, Long> {
}
