package com.todoc.server.domain.image.repository;

import com.todoc.server.domain.image.entity.ImageFile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageFileJpaRepository extends JpaRepository<ImageFile, Long> {
}
