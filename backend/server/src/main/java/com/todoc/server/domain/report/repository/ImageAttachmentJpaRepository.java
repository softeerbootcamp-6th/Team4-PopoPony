package com.todoc.server.domain.report.repository;

import com.todoc.server.domain.report.entity.ImageAttachment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImageAttachmentJpaRepository extends JpaRepository<ImageAttachment, Long> {
    List<ImageAttachment> findByReportId(Long reportId);
}
