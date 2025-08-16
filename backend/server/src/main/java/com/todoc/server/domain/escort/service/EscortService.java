package com.todoc.server.domain.escort.service;

import com.todoc.server.common.enumeration.EscortStatus;
import com.todoc.server.common.enumeration.RecruitStatus;
import com.todoc.server.domain.auth.entity.Auth;
import com.todoc.server.domain.auth.exception.AuthNotFoundException;
import com.todoc.server.domain.customer.entity.Patient;
import com.todoc.server.domain.customer.exception.PatientNotFoundException;
import com.todoc.server.domain.customer.web.dto.response.PatientSimpleResponse;
import com.todoc.server.domain.escort.entity.Escort;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.escort.exception.EscortInvalidProceedException;
import com.todoc.server.domain.escort.exception.EscortNotFoundException;
import com.todoc.server.domain.escort.exception.RecruitNotFoundException;
import com.todoc.server.domain.escort.repository.EscortJpaRepository;
import com.todoc.server.domain.escort.repository.EscortQueryRepository;
import com.todoc.server.domain.escort.web.dto.request.EscortMemoUpdateRequest;
import com.todoc.server.domain.escort.web.dto.response.EscortDetailResponse;
import com.todoc.server.domain.route.entity.Route;
import com.todoc.server.domain.route.exception.RouteNotFoundException;
import com.todoc.server.domain.route.web.dto.response.RouteDetailResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;

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
    public Escort getById(Long escortId) {
        return escortJpaRepository.findById(escortId)
                .orElseThrow(EscortNotFoundException::new);
    }

    @Transactional
    public void proceedEscort(Long escortId) {

        Escort escort = getById(escortId);
        EscortStatus currentStatus = escort.getStatus();

        EscortStatus[] statuses = EscortStatus.values();
        int currentIndex = currentStatus.ordinal();

        if (0 < currentIndex && currentIndex < statuses.length - 2) {
            EscortStatus nextStatus = statuses[currentIndex + 1];
            escort.setStatus(nextStatus);

            // 동행 만남 완료
            if (nextStatus == EscortStatus.HEADING_TO_HOSPITAL) {
                escort.setActualMeetingTime(LocalTime.now());
            }

            // 동행 복귀 완료
            if (nextStatus == EscortStatus.WRITING_REPORT) {
                escort.setActualReturnTime(LocalTime.now());
                Recruit recruit = escort.getRecruit();
                recruit.setStatus(RecruitStatus.DONE);
            }

            // TODO :: 진행 상태 변화 고객에게 알림

        } else {
            throw new EscortInvalidProceedException();
        }
    }

    @Transactional
    public void updateMemo(Long escortId, EscortMemoUpdateRequest request) {

        Escort escort = getById(escortId);
        escort.setMemo(request.getMemo());
    }

    @Transactional(readOnly = true)
    public EscortDetailResponse getEscortDetailByRecruitId(Long recruitId) {

        Escort escort = escortQueryRepository.findEscortDetailByRecruitId(recruitId);
        if (escort == null) {
            throw new EscortNotFoundException();
        }

        Recruit recruit = escort.getRecruit();
        if (recruit == null) {
            throw new RecruitNotFoundException();
        }

        Auth customer = recruit.getCustomer();
        if (customer == null) {
            throw new AuthNotFoundException();
        }

        Patient patient = recruit.getPatient();
        if (patient == null) {
            throw new PatientNotFoundException();
        }

        Route route = recruit.getRoute();
        if (route == null) {
            throw new RouteNotFoundException();
        }

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