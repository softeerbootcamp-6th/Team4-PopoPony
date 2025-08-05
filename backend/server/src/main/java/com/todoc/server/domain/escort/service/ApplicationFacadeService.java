package com.todoc.server.domain.escort.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.todoc.server.common.util.DateTimeUtils;
import com.todoc.server.common.util.JsonUtils;
import com.todoc.server.domain.auth.entity.Auth;
import com.todoc.server.domain.auth.exception.AuthNotFoundException;
import com.todoc.server.domain.escort.entity.Application;
import com.todoc.server.domain.escort.web.dto.response.ApplicationListResponse;
import com.todoc.server.domain.escort.web.dto.response.ApplicationSimpleResponse;
import com.todoc.server.domain.helper.entity.Helper;
import com.todoc.server.domain.helper.service.CertificateService;
import com.todoc.server.domain.helper.service.HelperService;
import com.todoc.server.domain.helper.web.dto.response.HelperSimpleResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@RequiredArgsConstructor
@Transactional
public class ApplicationFacadeService {

    private final ApplicationService applicationService;
    private final HelperService helperService;
    private final CertificateService certificateService;

    /**
     * recruitId에 해당하는 동행 신청에 대한 지원 목록을 조회하는 함수
     *
     * @param recruitId 동행 신청의 ID
     * @return 지원 목록 응답 DTO(ApplicationListResponse)
     */
    @Transactional(readOnly = true)
    public ApplicationListResponse getApplicationListByRecruitId(Long recruitId) {

        // 1. 지원(Application) 리스트 조회
        List<Application> rawApplicationList = applicationService.getApplicationListByRecruitId(recruitId);

        // 2. 지원 요약 정보(ApplicationSimpleResponse)로 변환
        List<ApplicationSimpleResponse> applicationSimpleResponseList = rawApplicationList.stream()
                .map(application -> {
                    // 2.1. 도우미 정보 조회
                    Auth helperAuth = application.getHelper();
                    if (helperAuth == null) {
                        throw new AuthNotFoundException();
                    }
                    Helper helper = helperService.getHelperByUserId(helperAuth.getId());

                    List<String> strengthList = null;
                    if (helper.getStrength() != null) {
                        strengthList = JsonUtils.fromJson(helper.getStrength(), new TypeReference<>() {});
                    }

                    // 2.2. 도우미 요약 정보(HelperSimpleResponse) 생성
                    HelperSimpleResponse helperSimple = HelperSimpleResponse.builder()
                            .helperId(helper.getId())
                            .imageUrl(helper.getImageUrl())
                            .name(helperAuth.getName())
                            .age(DateTimeUtils.calculateAge(helperAuth.getBirthDate()))
                            .gender(helperAuth.getGender())
                            .certificateList(certificateService.getHelperByUserId(helper.getId()))
                            .strengthList(strengthList)
                            .build();
                    // 2.3. 지원 요약 정보(ApplicationSimpleResponse) 생성
                    return ApplicationSimpleResponse.builder()
                            .applicationId(application.getId())
                            .helper(helperSimple)
                            .build();
                })
                .toList();

        // 3. 지원 목록 정보(ApplicationListResponse) 반환
        return ApplicationListResponse.builder()
                .applicationList(applicationSimpleResponseList)
                .build();
    }
}
