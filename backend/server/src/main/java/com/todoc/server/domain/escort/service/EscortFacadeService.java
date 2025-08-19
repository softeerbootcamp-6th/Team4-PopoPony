package com.todoc.server.domain.escort.service;

import com.todoc.server.domain.auth.entity.Auth;
import com.todoc.server.domain.auth.exception.AuthNotFoundException;
import com.todoc.server.domain.customer.entity.Patient;
import com.todoc.server.domain.customer.exception.PatientNotFoundException;
import com.todoc.server.domain.escort.entity.Escort;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.escort.exception.EscortNotFoundException;
import com.todoc.server.domain.escort.exception.RecruitNotFoundException;
import com.todoc.server.domain.escort.web.dto.response.EscortDetailResponse;
import com.todoc.server.domain.helper.entity.HelperProfile;
import com.todoc.server.domain.helper.service.HelperService;
import com.todoc.server.domain.route.entity.Route;
import com.todoc.server.domain.route.exception.RouteNotFoundException;
import com.todoc.server.domain.route.web.dto.response.RouteDetailResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class EscortFacadeService {

    private final EscortService escortService;
    private final HelperService helperService;

    @Transactional(readOnly = true)
    public EscortDetailResponse getEscortDetailByRecruitId(Long recruitId) {

        Escort escort = escortService.getEscortWithDetailByRecruitId(recruitId);

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

        HelperProfile helper = helperService.getHelperProfileListByRecruitId(recruitId).getFirst();

        return EscortDetailResponse.builder()
                .escortId(escort.getId())
                .escortStatus(escort.getStatus().getLabel())
                .customerContact(customer.getContact())
                .escortDate(recruit.getEscortDate())
                .estimatedMeetingTime(recruit.getEstimatedMeetingTime())
                .estimatedReturnTime(recruit.getEstimatedReturnTime())
                .purpose(recruit.getPurpose())
                .extraRequest(recruit.getExtraRequest())
                .helper(EscortDetailResponse.EscortHelperSimpleResponse.from(helper))
                .patient(EscortDetailResponse.EscortPatientSimpleResponse.from(patient))
                .route(RouteDetailResponse.from(route))
                .build();
    }
}
