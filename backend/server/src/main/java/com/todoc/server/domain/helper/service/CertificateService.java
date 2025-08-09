package com.todoc.server.domain.helper.service;

import com.todoc.server.domain.helper.entity.Certificate;
import com.todoc.server.domain.helper.entity.HelperProfile;
import com.todoc.server.domain.helper.repository.CertificateJpaRepository;
import com.todoc.server.domain.helper.web.dto.request.HelperProfileCreateRequest;
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
     * helperId에 해당하는 도우미의 자격증 종류 목록 조회하는 함수
     *
     * @param helperId 도우미 ID
     * @return Helper 인스턴스
     */
    @Transactional(readOnly = true)
    public List<String> getHelperByUserId(Long helperId) {
        return certificateJpaRepository.findTypesByHelperId(helperId);
    }

    public void register(List<HelperProfileCreateRequest.CertificateInfo> certificateInfoList, HelperProfile helperProfile) {
        for (HelperProfileCreateRequest.CertificateInfo certificateInfo : certificateInfoList) {
            Certificate certificate = Certificate.builder()
                    .helperProfile(helperProfile)
                    .type(certificateInfo.getType())
                    .imageUrl(certificateInfo.getImageUrl())
                    .build();
            certificateJpaRepository.save(certificate);
        }
    }
}
