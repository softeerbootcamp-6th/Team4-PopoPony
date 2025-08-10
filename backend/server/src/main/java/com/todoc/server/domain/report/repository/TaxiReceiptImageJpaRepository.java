package com.todoc.server.domain.report.repository;

import com.todoc.server.domain.report.entity.ImageAttachment;
import com.todoc.server.domain.report.entity.TaxiReceiptImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaxiReceiptImageJpaRepository extends JpaRepository<TaxiReceiptImage, Long> {
}
