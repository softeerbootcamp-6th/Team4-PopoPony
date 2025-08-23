package com.todoc.server.domain.escort.service;

import com.querydsl.core.Tuple;
import com.todoc.server.common.enumeration.ApplicationStatus;
import com.todoc.server.common.enumeration.EscortStatus;
import com.todoc.server.common.enumeration.RecruitStatus;
import com.todoc.server.domain.auth.entity.Auth;
import com.todoc.server.domain.auth.service.AuthService;
import com.todoc.server.domain.escort.entity.Application;
import com.todoc.server.domain.escort.entity.Escort;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.escort.exception.ApplicationInvalidSelectException;
import com.todoc.server.domain.escort.exception.ApplicationNotFoundException;
import com.todoc.server.domain.escort.exception.RecruitInvalidException;
import com.todoc.server.domain.escort.exception.RecruitNotFoundException;
import com.todoc.server.domain.escort.repository.dto.ApplicationFlatDto;
import com.todoc.server.domain.escort.web.dto.response.ApplicationListResponse;
import com.todoc.server.domain.escort.web.dto.response.ApplicationSimpleResponse;
import com.todoc.server.domain.helper.repository.dto.HelperSimpleFlatDto;
import com.todoc.server.domain.helper.service.HelperService;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class ApplicationFacadeService {

    private final ApplicationService applicationService;
    private final HelperService helperService;
    private final EscortService escortService;
    private final RecruitService recruitService;
    private final AuthService authService;

    @Transactional(readOnly = true)
    public ApplicationListResponse getApplicationListByRecruitId(Long recruitId) {

        Map<Long, List<ApplicationFlatDto>> groupedByRecruit = applicationService.getApplicationListByRecruitId(recruitId);

        if (groupedByRecruit.isEmpty()) {
            if (!recruitService.existsById(recruitId)) {
                throw new RecruitNotFoundException();
            }
        }

        List<ApplicationSimpleResponse> list = groupedByRecruit.entrySet().stream()
                .map(entry -> {
                    Long applicationId = entry.getKey();
                    List<ApplicationFlatDto> groupedTuples = entry.getValue();

                    // 변환: ApplicationFlatDto → HelperSimpleFlatDto
                    List<HelperSimpleFlatDto> helperTuples = groupedTuples.stream()
                        .map(a -> new HelperSimpleFlatDto(
                            a.getHelperProfileId(),
                            a.getHelperProfileImage(),
                            a.getStrength(),
                            a.getShortBio(),
                            a.getAuthId(),
                            a.getName(),
                            a.getBirthDate(),
                            a.getGender(),
                            a.getContact(),
                            a.getCertificateType()
                        ))
                        .toList();

                    return ApplicationSimpleResponse.builder()
                            .applicationId(applicationId)
                            .helper(helperService.buildHelperSimpleByHelperProfileId(helperTuples))
                            .build();
                })
                .toList();

        return ApplicationListResponse.builder()
                .applicationList(list)
                .build();
    }

    @Transactional
    public void selectApplication(Long applicationId) {

        // 1. 지원 찾기
        List<Application> applicationList = applicationService.getApplicationsInSameRecruit(applicationId);
        if (applicationList.isEmpty()) {
            throw new ApplicationNotFoundException();
        }

        // 2. 모든 지원 상태 변경
        for (Application application : applicationList) {

            // '대기중' 상태가 아닌 지원이 있는 경우
            if (!application.getStatus().equals(ApplicationStatus.PENDING)) {
                throw new ApplicationInvalidSelectException();
            }

            if (application.getId().equals(applicationId)) {
                // 고객이 선택한 지원 -> 매칭 성공
                matchApplicationWithRecruit(application);
            }
            else {
                // 나머지 지원들 -> 매칭 실패
                application.setStatus(ApplicationStatus.FAILED);
                application.softDelete();
            }
        }
    }

    private void matchApplicationWithRecruit(Application application) {

        // 고객이 선택한 지원 -> 매칭 성공
        application.setStatus(ApplicationStatus.MATCHED);

        // 동행 신청을 매칭 완료 상태로 변경
        Recruit recruit = application.getRecruit();
        if (recruit == null) {
            throw new RecruitNotFoundException();
        }
        recruit.setStatus(RecruitStatus.COMPLETED);

        // 4. Escort 생성
        Escort escort = Escort.builder()
                .recruit(recruit)
                .customer(recruit.getCustomer())
                .helper(application.getHelper())
                .status(EscortStatus.PREPARING)
                .build();
        escortService.save(escort);
    }

    /**
     * helperUserId를 바탕으로 recruitId에 해당하는 동행에 지원 신청하기
     * @param recruitId 동행(일감) ID
     * @param helperUserId 도우미의 userId
     */
    @Transactional
    public void applyApplicationToRecruit(Long recruitId, Long helperUserId) {

        Auth helper = authService.getAuthById(helperUserId);

        Recruit recruit = recruitService.getRecruitById(recruitId);

        // 매칭중인 '동행 신청'에만 지원할 수 있음
        if (recruit.getStatus() != RecruitStatus.MATCHING) {
            throw new RecruitInvalidException();
        }

        Application application = Application.builder()
                .recruit(recruit)
                .helper(helper)
                .status(ApplicationStatus.PENDING)
                .build();

        applicationService.save(application);
    }

    /**
     * helperUserId를 바탕으로 지원 취소하기
     * @param applicationId 동행 지원 ID
     */
    @Transactional
    public void cancelApplicationToRecruit(Long applicationId) {

        Application application = applicationService.getApplicationById(applicationId);

        application.setDeletedAt(LocalDateTime.now());
    }
}
