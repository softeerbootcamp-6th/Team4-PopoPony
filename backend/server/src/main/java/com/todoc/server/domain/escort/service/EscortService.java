package com.todoc.server.domain.escort.service;

import com.todoc.server.common.enumeration.EscortStatus;
import com.todoc.server.common.enumeration.RecruitStatus;
import com.todoc.server.common.enumeration.RouteLegType;
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
import com.todoc.server.domain.route.entity.Route;
import com.todoc.server.domain.route.entity.RouteLeg;
import com.todoc.server.domain.route.exception.RouteLegNotFoundException;
import com.todoc.server.domain.route.web.dto.response.RouteDetailResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;

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

        if (0 < currentIndex && currentIndex < statuses.length - 1) {
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

        List<EscortDetailFlatDto> escortDetailFlatDtoList = escortQueryRepository.findEscortDetailByRecruitId(recruitId);
        if (escortDetailFlatDtoList.isEmpty()) {
            throw new EscortNotFoundException();
        }

        EscortDetailFlatDto first = escortDetailFlatDtoList.getFirst();
        Escort escort = first.getEscort();
        Recruit recruit = first.getRecruit();
        Auth customer = first.getCustomer();
        Patient patient = first.getPatient();
        Route route = first.getRoute();
        RouteLeg meetingToHospital = null;
        RouteLeg hospitalToReturn = null;

        for (EscortDetailFlatDto escortDetailFlatDto : escortDetailFlatDtoList) {
            RouteLeg routeLeg = escortDetailFlatDto.getRouteLeg();
            if (routeLeg.getLegType().equals(RouteLegType.MEETING_TO_HOSPITAL)) {
                meetingToHospital = routeLeg;
            }
            else {
                hospitalToReturn = routeLeg;
            }
        }

        if (meetingToHospital == null ||  hospitalToReturn == null) {
            throw new RouteLegNotFoundException();
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
                .route(RouteDetailResponse.from(route, meetingToHospital, hospitalToReturn))
                .build();
    }
}