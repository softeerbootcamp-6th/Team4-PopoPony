package com.todoc.server.domain.report.service;

import com.todoc.server.common.dto.request.ImageCreateRequest;
import com.todoc.server.common.entity.ImageMeta;
import com.todoc.server.domain.report.entity.ImageAttachment;
import com.todoc.server.domain.report.repository.ImageAttachmentJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Transactional
public class ImageAttachmentService {

    private ImageAttachmentJpaRepository imageAttachmentJpaRepository;

    public ImageAttachment register(ImageCreateRequest imageCreateRequest) {

        ImageAttachment imageAttachment = new ImageAttachment();
        imageAttachment.setImageMeta(ImageMeta.from(imageCreateRequest));
        return imageAttachmentJpaRepository.save(imageAttachment);
    }
}
