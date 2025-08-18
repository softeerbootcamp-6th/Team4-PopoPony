package com.todoc.server.domain.escort.service;

import com.todoc.server.common.enumeration.EscortStatus;
import com.todoc.server.domain.auth.entity.Auth;
import com.todoc.server.domain.auth.exception.AuthNotFoundException;
import com.todoc.server.domain.customer.entity.Patient;
import com.todoc.server.domain.customer.exception.PatientNotFoundException;
import com.todoc.server.domain.escort.entity.Escort;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.escort.exception.RecruitNotFoundException;
import com.todoc.server.domain.escort.web.dto.response.EscortDetailResponse;
import com.todoc.server.domain.helper.entity.HelperProfile;
import com.todoc.server.domain.helper.service.HelperService;
import com.todoc.server.domain.image.entity.ImageFile;
import com.todoc.server.domain.route.entity.LocationInfo;
import com.todoc.server.domain.route.entity.Route;
import com.todoc.server.domain.route.entity.RouteLeg;
import com.todoc.server.domain.route.exception.RouteNotFoundException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EscortFacadeServiceTest {

    @Mock
    private EscortService escortService;

    @Mock
    private HelperService helperService;

    @InjectMocks
    private EscortFacadeService escortFacadeService;

    @Test
    @DisplayName("정상: recruitId로 상세 조회 성공")
    void getEscortDetail_success() {
        Long recruitId = 10L;

        Escort escort = mock(Escort.class);
        Recruit recruit = mock(Recruit.class);
        Auth customer = mock(Auth.class);
        Patient patient = mock(Patient.class);
        Route route = mock(Route.class);
        HelperProfile helper = mock(HelperProfile.class);

        when(escort.getRecruit()).thenReturn(recruit);
        when(escort.getId()).thenReturn(777L);

        var status = mock(EscortStatus.class);
        when(status.getLabel()).thenReturn("ONGOING");
        when(escort.getStatus()).thenReturn(status);

        // routeLeg
        RouteLeg routeLeg = mock(RouteLeg.class);
        when(routeLeg.getTotalTime()).thenReturn(10000);

        // route
        when(route.getMeetingLocationInfo()).thenReturn(new LocationInfo());
        when(route.getHospitalLocationInfo()).thenReturn(new LocationInfo());
        when(route.getReturnLocationInfo()).thenReturn(new LocationInfo());
        when(route.getMeetingToHospital()).thenReturn(routeLeg);
        when(route.getHospitalToReturn()).thenReturn(routeLeg);

        // recruit 필드들
        when(recruit.getCustomer()).thenReturn(customer);
        when(recruit.getPatient()).thenReturn(patient);
        when(recruit.getRoute()).thenReturn(route);
        when(recruit.getEscortDate()).thenReturn(LocalDate.of(2025, 8, 18));
        when(recruit.getEstimatedMeetingTime()).thenReturn(LocalTime.of(9, 0));
        when(recruit.getEstimatedReturnTime()).thenReturn(LocalTime.of(12, 30));
        when(recruit.getPurpose()).thenReturn("병원 진료 동행");
        when(recruit.getExtraRequest()).thenReturn("휠체어 준비");

        // customer
        when(customer.getContact()).thenReturn("010-1234-5678");

        // helper
        when(helper.getHelperProfileImage()).thenReturn(new ImageFile());
        when(helper.getAuth()).thenReturn(new Auth());

        // patient
        when(patient.getPatientProfileImage()).thenReturn(new ImageFile());

        when(escortService.getEscortWithDetailByRecruitId(recruitId)).thenReturn(escort);
        when(helperService.getHelperProfileListByRecruitId(recruitId)).thenReturn(List.of(helper));

        EscortDetailResponse res = escortFacadeService.getEscortDetailByRecruitId(recruitId);

        assertThat(res).isNotNull();
        assertThat(res.getEscortId()).isEqualTo(777L);
        assertThat(res.getEscortStatus()).isEqualTo("ONGOING");
        assertThat(res.getCustomerContact()).isEqualTo("010-1234-5678");
        assertThat(res.getEscortDate()).isEqualTo(LocalDate.of(2025, 8, 18));
        assertThat(res.getEstimatedMeetingTime()).isEqualTo(LocalTime.of(9, 0));
        assertThat(res.getEstimatedReturnTime()).isEqualTo(LocalTime.of(12, 30));
        assertThat(res.getPurpose()).isEqualTo("병원 진료 동행");
        assertThat(res.getExtraRequest()).isEqualTo("휠체어 준비");
        assertThat(res.getHelper()).isNotNull();
        assertThat(res.getPatient()).isNotNull();
        assertThat(res.getRoute()).isNotNull();

        verify(escortService).getEscortWithDetailByRecruitId(recruitId);
        verify(helperService).getHelperProfileListByRecruitId(recruitId);
    }

    @Test
    @DisplayName("예외: Recruit가 null이면 RecruitNotFoundException")
    void getEscortDetail_recruitNull() {
        Long recruitId = 10L;
        Escort escort = mock(Escort.class);
        when(escort.getRecruit()).thenReturn(null);
        when(escortService.getEscortWithDetailByRecruitId(recruitId)).thenReturn(escort);

        assertThatThrownBy(() -> escortFacadeService.getEscortDetailByRecruitId(recruitId))
                .isInstanceOf(RecruitNotFoundException.class);
    }

    @Test
    @DisplayName("예외: Customer(Auth)가 null이면 AuthNotFoundException")
    void getEscortDetail_customerNull() {
        Long recruitId = 10L;
        Escort escort = mock(Escort.class);
        Recruit recruit = mock(Recruit.class);

        when(escort.getRecruit()).thenReturn(recruit);
        when(recruit.getCustomer()).thenReturn(null);
        when(escortService.getEscortWithDetailByRecruitId(recruitId)).thenReturn(escort);

        assertThatThrownBy(() -> escortFacadeService.getEscortDetailByRecruitId(recruitId))
                .isInstanceOf(AuthNotFoundException.class);
    }

    @Test
    @DisplayName("예외: Patient가 null이면 PatientNotFoundException")
    void getEscortDetail_patientNull() {
        Long recruitId = 10L;
        Escort escort = mock(Escort.class);
        Recruit recruit = mock(Recruit.class);
        Auth customer = mock(Auth.class);

        when(escort.getRecruit()).thenReturn(recruit);
        when(recruit.getCustomer()).thenReturn(customer);
        when(recruit.getPatient()).thenReturn(null);
        when(escortService.getEscortWithDetailByRecruitId(recruitId)).thenReturn(escort);

        assertThatThrownBy(() -> escortFacadeService.getEscortDetailByRecruitId(recruitId))
                .isInstanceOf(PatientNotFoundException.class);
    }

    @Test
    @DisplayName("예외: Route가 null이면 RouteNotFoundException")
    void getEscortDetail_routeNull() {
        Long recruitId = 10L;
        Escort escort = mock(Escort.class);
        Recruit recruit = mock(Recruit.class);
        Auth customer = mock(Auth.class);
        Patient patient = mock(Patient.class);

        when(escort.getRecruit()).thenReturn(recruit);
        when(recruit.getCustomer()).thenReturn(customer);
        when(recruit.getPatient()).thenReturn(patient);
        when(recruit.getRoute()).thenReturn(null);
        when(escortService.getEscortWithDetailByRecruitId(recruitId)).thenReturn(escort);

        assertThatThrownBy(() -> escortFacadeService.getEscortDetailByRecruitId(recruitId))
                .isInstanceOf(RouteNotFoundException.class);
    }
}