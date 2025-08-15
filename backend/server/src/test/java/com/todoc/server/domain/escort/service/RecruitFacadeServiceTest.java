package com.todoc.server.domain.escort.service;

import com.todoc.server.IntegrationMockConfig;
import com.todoc.server.common.util.FeeUtils;
import com.todoc.server.domain.auth.entity.Auth;
import com.todoc.server.domain.auth.service.AuthService;
import com.todoc.server.domain.customer.entity.Patient;
import com.todoc.server.domain.customer.service.PatientService;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.escort.web.dto.request.RecruitCreateRequest;
import com.todoc.server.domain.image.service.ImageFileService;
import com.todoc.server.domain.route.entity.LocationInfo;
import com.todoc.server.domain.route.entity.Route;
import com.todoc.server.domain.route.service.LocationInfoService;
import com.todoc.server.domain.route.service.RouteLegService;
import com.todoc.server.domain.route.service.RouteService;
import com.todoc.server.external.tmap.service.TMapRouteParser;
import com.todoc.server.external.tmap.service.TMapRouteService;
import java.io.IOException;
import java.time.LocalTime;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.context.annotation.Import;

import java.math.BigDecimal;

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
    @Mock
    private AuthService authService;
    @Mock
    private ImageFileService imageFileService;
    @Mock
    private TMapRouteService tMapRouteService;
    @Mock
    private TMapRouteParser tmapRouteParser;
    @Mock
    private RouteLegService routeLegService;

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
        Long authId = 1L;
        Auth auth = mock(Auth.class);

        String usedVertices = "...";
        String tmapJson = "...";

        RecruitCreateRequest request = mock(RecruitCreateRequest.class);
        RecruitCreateRequest.PatientDetail patientDetail = mock(RecruitCreateRequest.PatientDetail.class);
        RecruitCreateRequest.EscortDetail escortDetail = mock(RecruitCreateRequest.EscortDetail.class);
        RecruitCreateRequest.LocationDetail meetingLocationDetail = mock(RecruitCreateRequest.LocationDetail.class);
        RecruitCreateRequest.LocationDetail destinationDetail = mock(RecruitCreateRequest.LocationDetail.class);
        RecruitCreateRequest.LocationDetail returnLocationDetail = mock(RecruitCreateRequest.LocationDetail.class);

        when(request.getPatientDetail()).thenReturn(patientDetail);
        when(request.getEscortDetail()).thenReturn(escortDetail);
        when(request.getMeetingLocationDetail()).thenReturn(meetingLocationDetail);
        when(request.getDestinationDetail()).thenReturn(destinationDetail);
        when(request.getReturnLocationDetail()).thenReturn(returnLocationDetail);

        when(tMapRouteService.getRoute(any()))
            .thenReturn(new TMapRouteService.TMapRawResult(tmapJson, usedVertices));
        when(tmapRouteParser.parseSummaryFromRaw(anyString()))
            .thenReturn(new TMapRouteParser.RouteLegSummary(1561, 343, 0, 5200));
        when(escortDetail.getEstimatedMeetingTime()).thenReturn(LocalTime.of(9, 0));
        when(escortDetail.getEstimatedReturnTime()).thenReturn(LocalTime.of(11, 30));

        Patient patient = mock(Patient.class);
        // 실제 좌표값을 가진 LocationInfo 생성
        LocationInfo meetingLocation = new LocationInfo();
        meetingLocation.setLongitude(new BigDecimal("127.2581225"));
        meetingLocation.setLatitude(new BigDecimal("36.4809912"));

        LocationInfo hospitalLocation = new LocationInfo();
        hospitalLocation.setLongitude(new BigDecimal("126.9784043"));
        hospitalLocation.setLatitude(new BigDecimal("37.5670240"));

        LocationInfo returnLocation = new LocationInfo();
        returnLocation.setLongitude(new BigDecimal("127.1234567"));
        returnLocation.setLatitude(new BigDecimal("36.9876543"));

        Route route = mock(Route.class);
        Recruit recruit = mock(Recruit.class);

        when(patientService.register(patientDetail)).thenReturn(patient);
        when(locationInfoService.register(meetingLocationDetail)).thenReturn(meetingLocation);
        when(locationInfoService.register(destinationDetail)).thenReturn(hospitalLocation);
        when(locationInfoService.register(returnLocationDetail)).thenReturn(returnLocation);
        when(routeService.register(request)).thenReturn(route);
        when(recruitService.register(escortDetail)).thenReturn(recruit);
        when(authService.getAuthById(authId)).thenReturn(auth);

        // when
        recruitFacadeService.createRecruit(authId, request);

        // then
        verify(patientService).register(patientDetail);
        verify(patient).setCustomer(any(Auth.class));

        verify(locationInfoService).register(meetingLocationDetail);
        verify(locationInfoService).register(destinationDetail);
        verify(locationInfoService).register(returnLocationDetail);

        verify(routeService).register(request);
        verify(route).setMeetingLocationInfo(meetingLocation);
        verify(route).setHospitalLocationInfo(hospitalLocation);
        verify(route).setReturnLocationInfo(returnLocation);

        verify(recruitService).register(escortDetail);
        verify(recruit).setCustomer(any(Auth.class));
        verify(recruit).setPatient(patient);
        verify(recruit).setRoute(route);
        verify(recruit).setEstimatedFee(any());

        verify(imageFileService).register(any());
    }
}