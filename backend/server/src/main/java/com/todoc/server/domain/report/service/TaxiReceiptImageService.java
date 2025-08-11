package com.todoc.server.domain.report.service;

import com.todoc.server.common.dto.request.ImageCreateRequest;
import com.todoc.server.common.entity.ImageMeta;
import com.todoc.server.domain.report.entity.TaxiReceiptImage;
import com.todoc.server.domain.report.repository.TaxiReceiptImageJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Transactional
public class TaxiReceiptImageService {

    private final TaxiReceiptImageJpaRepository taxiReceiptImageJpaRepository;

    public TaxiReceiptImage register(ImageCreateRequest imageCreateRequest) {
        TaxiReceiptImage taxiReceiptImage = new TaxiReceiptImage();
        taxiReceiptImage.setImageMeta(ImageMeta.from(imageCreateRequest));

        return taxiReceiptImageJpaRepository.save(taxiReceiptImage);
    }

    public long getCount() {
        return taxiReceiptImageJpaRepository.count();
    }
}
