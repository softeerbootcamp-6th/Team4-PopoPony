package com.todoc.server.domain.escort.service;

import com.querydsl.core.Tuple;
import com.todoc.server.common.enumeration.EscortStatus;
import com.todoc.server.common.enumeration.RecruitStatus;
import com.todoc.server.domain.escort.entity.Application;
import com.todoc.server.domain.escort.entity.Escort;
import com.todoc.server.domain.escort.entity.Recruit;
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
        Application application = applicationService.getApplicationById(applicationId);

        // 2. 신청 찾기
        Recruit recruit = application.getRecruit();
        if (recruit == null) {
            throw new RecruitNotFoundException();
        }

        // 3. 동행 신청을 매칭 완료 상태로 변경
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
