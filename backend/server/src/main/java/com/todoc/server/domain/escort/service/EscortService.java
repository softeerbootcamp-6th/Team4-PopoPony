package com.todoc.server.domain.escort.service;

import com.todoc.server.common.enumeration.EscortStatus;
import com.todoc.server.common.enumeration.RecruitStatus;
import com.todoc.server.domain.auth.entity.Auth;
import com.todoc.server.domain.customer.entity.Patient;
import com.todoc.server.domain.customer.web.dto.response.PatientSimpleResponse;
import com.todoc.server.domain.escort.entity.Escort;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.escort.exception.EscortInvalidProceedException;
import com.todoc.server.domain.escort.exception.EscortNotFoundException;
import com.todoc.server.domain.escort.repository.EscortJpaRepository;
import com.todoc.server.domain.escort.repository.EscortQueryRepository;
import com.todoc.server.domain.escort.repository.dto.EscortDetailFlatDto;
import com.todoc.server.domain.escort.web.dto.request.EscortMemoUpdateRequest;
import com.todoc.server.domain.escort.web.dto.response.EscortDetailResponse;
import com.todoc.server.domain.helper.entity.HelperProfile;
import com.todoc.server.domain.route.entity.LocationInfo;
import com.todoc.server.domain.route.entity.Route;
import com.todoc.server.domain.route.web.dto.response.RouteDetailResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class EscortService {

    private final EscortJpaRepository escortJpaRepository;
    private final EscortQueryRepository escortQueryRepository;

    @Transactional(readOnly = true)
    public Long getCountByHelperUserId(Long helperId) {
        return escortJpaRepository.countByHelperId(helperId);
    }

    @Transactional
    public void save(Escort escort) {
        escortJpaRepository.save(escort);
    }

    public Escort getByRecruitId(Long recruitId) {
        return escortJpaRepository.findByRecruitId(recruitId)
                .orElseThrow(EscortNotFoundException::new);
    }

    @Transactional
    public void proceedEscort(Long recruitId) {

        Escort escort = getByRecruitId(recruitId);
        EscortStatus currentStatus = escort.getStatus();

        EscortStatus[] statuses = EscortStatus.values();
        int currentIndex = currentStatus.ordinal();

        if (1 < currentIndex && currentIndex < statuses.length - 1) {
            EscortStatus nextStatus = statuses[currentIndex + 1];
            escort.setStatus(nextStatus);

            if (nextStatus == EscortStatus.DONE) {
                Recruit recruit = escort.getRecruit();
                recruit.setStatus(RecruitStatus.DONE);
            }

            // TODO :: 진행 상태 변화 고객에게 알림

        } else {
            throw new EscortInvalidProceedException();
        }
    }

    @Transactional
    public void updateMeme(Long recruitId, EscortMemoUpdateRequest request) {

        Escort escort = getByRecruitId(recruitId);
        escort.setMemo(request.getMemo());
    }

    @Transactional(readOnly = true)
    public EscortDetailResponse getEscortDetailByRecruitId(Long recruitId) {

        EscortDetailFlatDto escortDetailFlatDto = escortQueryRepository.findEscortDetailByRecruitId(recruitId);
        if (escortDetailFlatDto == null) {
            throw new EscortNotFoundException();
        }

        Escort escort = escortDetailFlatDto.getEscort();
        Recruit recruit = escortDetailFlatDto.getRecruit();
        Auth customer = escortDetailFlatDto.getCustomer();
        Patient patient = escortDetailFlatDto.getPatient();
        Route route = escortDetailFlatDto.getRoute();

        return EscortDetailResponse.builder()
                .escortId(escort.getId())
                .escortStatus(escort.getStatus().getLabel())
                .customerContact(customer.getContact())
                .escortDate(recruit.getEscortDate())
                .estimatedMeetingTime(recruit.getEstimatedMeetingTime())
                .estimatedReturnTime(recruit.getEstimatedReturnTime())
                .purpose(recruit.getPurpose())
                .extraRequest(recruit.getExtraRequest())
                .patient(PatientSimpleResponse.from(patient))
                .route(RouteDetailResponse.from(route))
                .build();
    }
}
