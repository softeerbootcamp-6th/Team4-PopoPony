package com.todoc.server.domain.escort.service;

import com.todoc.server.domain.auth.entity.Auth;
import com.todoc.server.domain.customer.entity.Patient;
import com.todoc.server.domain.customer.service.PatientService;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.escort.web.dto.request.RecruitCreateRequest;
import com.todoc.server.domain.route.entity.LocationInfo;
import com.todoc.server.domain.route.entity.Route;
import com.todoc.server.domain.route.service.LocationInfoService;
import com.todoc.server.domain.route.service.RouteService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import static org.mockito.Mockito.*;

class RecruitFacadeServiceTest {

    @Mock
    private RecruitService recruitService;
    @Mock
    private PatientService patientService;
    @Mock
    private LocationInfoService locationInfoService;
    @Mock
    private RouteService routeService;

    @InjectMocks
    private RecruitFacadeService recruitFacadeService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("동행 신청 생성 시 의존성 호출 및 연관관계 설정 확인")
    void createRecruit() {
        // given
        RecruitCreateRequest request = mock(RecruitCreateRequest.class);
        Patient patient = mock(Patient.class);
        LocationInfo meetingLocation = mock(LocationInfo.class);
        LocationInfo hospitalLocation = mock(LocationInfo.class);
        LocationInfo returnLocation = mock(LocationInfo.class);
        Route route = mock(Route.class);
        Recruit recruit = mock(Recruit.class);

        when(patientService.register(request)).thenReturn(patient);
        when(locationInfoService.register(request)).thenReturn(meetingLocation, hospitalLocation, returnLocation);
        when(routeService.register(request)).thenReturn(route);
        when(recruitService.register(request)).thenReturn(recruit);

        // when
        recruitFacadeService.createRecruit(request);

        // then
        verify(patientService).register(request);
        verify(patient).setCustomer(any(Auth.class));

        verify(locationInfoService, times(3)).register(request);

        verify(routeService).register(request);
        verify(route).setMeetingLocationInfo(meetingLocation);
        verify(route).setHospitalLocationInfo(hospitalLocation);
        verify(route).setReturnLocationInfo(returnLocation);

        verify(recruitService).register(request);
        verify(recruit).setCustomer(any(Auth.class));
        verify(recruit).setPatient(patient);
        verify(recruit).setRoute(route);
        verify(recruit).setEstimatedFee(null);
    }
}