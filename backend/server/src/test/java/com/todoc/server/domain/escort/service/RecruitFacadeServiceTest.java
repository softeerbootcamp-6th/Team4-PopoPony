package com.todoc.server.domain.escort.service;

import com.todoc.server.common.enumeration.RecruitStatus;
import com.todoc.server.domain.auth.entity.Auth;
import com.todoc.server.domain.customer.entity.Patient;
import com.todoc.server.domain.customer.service.PatientService;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.escort.web.dto.request.RecruitCreateRequest;
import com.todoc.server.domain.escort.web.dto.response.RecruitDetailResponse;
import com.todoc.server.domain.route.entity.LocationInfo;
import com.todoc.server.domain.route.entity.Route;
import com.todoc.server.domain.route.service.LocationInfoService;
import com.todoc.server.domain.route.service.RouteService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.time.LocalDate;
import java.time.LocalTime;

import static org.junit.jupiter.api.Assertions.*;
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

        Patient patient = mock(Patient.class);
        LocationInfo meetingLocation = mock(LocationInfo.class);
        LocationInfo hospitalLocation = mock(LocationInfo.class);
        LocationInfo returnLocation = mock(LocationInfo.class);
        Route route = mock(Route.class);
        Recruit recruit = mock(Recruit.class);

        when(patientService.register(patientDetail)).thenReturn(patient);
        when(locationInfoService.register(meetingLocationDetail)).thenReturn(meetingLocation);
        when(locationInfoService.register(destinationDetail)).thenReturn(hospitalLocation);
        when(locationInfoService.register(returnLocationDetail)).thenReturn(returnLocation);
        when(routeService.register(request)).thenReturn(route);
        when(recruitService.register(escortDetail)).thenReturn(recruit);

        // when
        recruitFacadeService.createRecruit(request);

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
        verify(recruit).setEstimatedFee(null);

    }

    @Test
    @DisplayName("recruitId로 동행 신청 상세 정보 조회 성공")
    void getRecruitDetailByRecruitId_success() {
        // given
        Long recruitId = 1L;
        Recruit dummyRecruit = new Recruit();
        dummyRecruit.setId(recruitId);
        dummyRecruit.setEscortDate(LocalDate.of(2025, 8, 10));
        dummyRecruit.setEstimatedMeetingTime(LocalTime.of(9, 0));
        dummyRecruit.setEstimatedReturnTime(LocalTime.of(11, 0));
        dummyRecruit.setPurpose("정기 검진");
        dummyRecruit.setExtraRequest("간단한 설명 요청");

        Patient dummyPatient = new Patient();

        // LocationInfo 설정
        LocationInfo meetingLocation = new LocationInfo();
        meetingLocation.setId(1L);
        meetingLocation.setPlaceName("신촌역 3번 출구");
        meetingLocation.setUpperAddrName("서울특별시");
        meetingLocation.setMiddleAddrName("서대문구");
        meetingLocation.setRoadName("연세로");
        meetingLocation.setFirstBuildingNo("2");
        meetingLocation.setDetailAddress("출구 앞 파란 의자 근처");

        LocationInfo hospitalLocation = new LocationInfo();
        hospitalLocation.setId(2L);
        hospitalLocation.setPlaceName("서울성모병원");
        hospitalLocation.setUpperAddrName("서울특별시");
        hospitalLocation.setMiddleAddrName("서초구");
        hospitalLocation.setRoadName("반포대로");
        hospitalLocation.setFirstBuildingNo("222");
        hospitalLocation.setDetailAddress("본관 3층 내과 외래");

        LocationInfo returnLocation = new LocationInfo();
        returnLocation.setId(3L);
        returnLocation.setPlaceName("신촌역 3번 출구");
        returnLocation.setUpperAddrName("서울특별시");
        returnLocation.setMiddleAddrName("서대문구");
        returnLocation.setRoadName("연세로");
        returnLocation.setFirstBuildingNo("2");
        returnLocation.setDetailAddress("출구 앞 파란 의자 근처");

        // Route 설정
        Route dummyRoute = new Route();
        dummyRoute.setId(10L);
        dummyRoute.setMeetingLocationInfo(meetingLocation);
        dummyRoute.setHospitalLocationInfo(hospitalLocation);
        dummyRoute.setReturnLocationInfo(returnLocation);

        dummyRecruit.setPatient(dummyPatient);
        dummyRecruit.setRoute(dummyRoute);

        when(recruitService.findById(recruitId)).thenReturn(dummyRecruit);

        // when
        RecruitDetailResponse response = recruitFacadeService.getRecruitDetailByRecruitId(recruitId);

        // then
        assertNotNull(response);
        assertEquals(recruitId, response.getRecruitId());
        assertEquals("정기 검진", response.getPurpose());
        assertEquals("간단한 설명 요청", response.getExtraRequest());
        assertEquals("서울성모병원", response.getRoute().getHospitalLocationInfo().getPlaceName());
        assertEquals("서울특별시 서대문구 연세로 2", response.getRoute().getMeetingLocationInfo().getAddress());
    }

    @Test
    @DisplayName("recruitId로 취소 성공 - soft delete")
    void cancelRecruit_success_shouldSetDeletedAt() {
        // given
        Long recruitId = 1L;

        Recruit recruit = new Recruit();
        recruit.setId(recruitId);
        recruit.setStatus(RecruitStatus.MATCHING); // 취소 가능한 상태
        recruit.setDeletedAt(null); // soft delete 전 상태

        // mock: findById에서 recruit 반환
        when(recruitService.findById(recruitId)).thenReturn(recruit);

        // mock: cancelRecruit에서 soft delete 실행
        doAnswer(invocation -> {
            recruit.softDelete(); // 실제 메서드 로직에 따라 deletedAt 설정
            return null;
        }).when(recruitService).cancelRecruit(recruitId);

        // when
        recruitFacadeService.cancelRecruit(recruitId);

        // then
        assertNotNull(recruit.getDeletedAt(), "soft delete가 적용되어야 합니다.");
    }
}