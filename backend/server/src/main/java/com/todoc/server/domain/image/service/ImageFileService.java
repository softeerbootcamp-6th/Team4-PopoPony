package com.todoc.server.domain.image.service;

import com.todoc.server.common.dto.request.ImageCreateRequest;
import com.todoc.server.domain.image.entity.ImageFile;
import com.todoc.server.domain.image.entity.ImageMeta;
import com.todoc.server.domain.image.exception.ImageFileNotFoundException;
import com.todoc.server.domain.image.repository.ImageFileJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Transactional
public class ImageFileService {

    private final ImageFileJpaRepository imageFileJpaRepository;

    public ImageFile register(ImageCreateRequest imageCreateRequest) {
        ImageFile imageFile = new ImageFile();
        imageFile.setImageMeta(ImageMeta.from(imageCreateRequest));

        return imageFileJpaRepository.save(imageFile);
    }

    public long getCount() {
        return imageFileJpaRepository.count();
    }

    public ImageFile getImageFileById(Long imageFileId) {
        return imageFileJpaRepository.findById(imageFileId)
                .orElseThrow(ImageFileNotFoundException::new);
    }
}
