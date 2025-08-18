package com.todoc.server.domain.helper.service;

import com.todoc.server.domain.helper.entity.Certificate;
import com.todoc.server.domain.helper.repository.CertificateJpaRepository;
import com.todoc.server.domain.helper.web.dto.request.CertificateCreateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CertificateService {

    private final CertificateJpaRepository certificateJpaRepository;

    /**
     * helperProfileId에 해당하는 도우미의 자격증 종류 목록 조회하는 함수
     *
     * @param helperProfileId 도우미 ID
     * @return 자격증 종류들이 담긴 문자열 리스트
     */
    @Transactional(readOnly = true)
    public List<String> getCertificateTypesByHelperProfileId(Long helperProfileId) {
        return certificateJpaRepository.findTypesByHelperProfileId(helperProfileId);
    }

    public Certificate register(CertificateCreateRequest certificateInfo) {
        Certificate certificate = Certificate.builder()
                .type(certificateInfo.getType())
                .build();
        return certificateJpaRepository.save(certificate);
    }

    public void deleteAllByHelperProfileId(Long helperProfileId) {

        List<Certificate> certificateList = certificateJpaRepository.findAllByHelperProfileId(helperProfileId);

        for (Certificate certificate : certificateList) {
            certificate.softDelete();
        }
    }
}
