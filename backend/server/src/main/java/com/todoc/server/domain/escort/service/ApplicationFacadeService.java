package com.todoc.server.domain.escort.service;

import com.querydsl.core.Tuple;
import com.todoc.server.common.enumeration.ApplicationStatus;
import com.todoc.server.common.enumeration.EscortStatus;
import com.todoc.server.common.enumeration.RecruitStatus;
import com.todoc.server.domain.escort.entity.Application;
import com.todoc.server.domain.escort.entity.Escort;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.escort.exception.ApplicationInvalidSelectException;
import com.todoc.server.domain.escort.exception.ApplicationNotFoundException;
import com.todoc.server.domain.escort.exception.RecruitNotFoundException;
import com.todoc.server.domain.escort.web.dto.response.ApplicationListResponse;
import com.todoc.server.domain.escort.web.dto.response.ApplicationSimpleResponse;
import com.todoc.server.domain.helper.service.HelperService;
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

    @Transactional(readOnly = true)
    public ApplicationListResponse getApplicationListByRecruitId(Long recruitId) {

        Map<Long, List<Tuple>> groupedByApplication = applicationService.getApplicationListByRecruitId(recruitId);

        List<ApplicationSimpleResponse> list = groupedByApplication.entrySet().stream()
                .map(entry -> {
                    Long applicationId = entry.getKey();
                    List<Tuple> groupedTuples = entry.getValue();

                    return ApplicationSimpleResponse.builder()
                            .applicationId(applicationId)
                            .helper(helperService.buildHelperSimpleByHelperId(groupedTuples))
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
            }
        }
    }

    @Transactional
    public void matchApplicationWithRecruit(Application application) {

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
}
