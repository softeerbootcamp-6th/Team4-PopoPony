package com.todoc.server.domain.escort.service.recruit;

import com.todoc.server.domain.auth.entity.Auth;
import com.todoc.server.domain.auth.service.AuthService;
import com.todoc.server.domain.customer.entity.Patient;
import com.todoc.server.domain.customer.service.PatientService;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.escort.service.RecruitFacadeService;
import com.todoc.server.domain.escort.service.RecruitService;
import com.todoc.server.domain.escort.web.dto.request.RecruitCreateRequest;
import com.todoc.server.domain.image.entity.ImageFile;
import com.todoc.server.domain.image.service.ImageFileService;
import com.todoc.server.domain.route.entity.LocationInfo;
import com.todoc.server.domain.route.entity.Route;
import com.todoc.server.domain.route.entity.RouteLeg;
import com.todoc.server.domain.route.service.LocationInfoService;
import com.todoc.server.domain.route.service.RouteLegService;
import com.todoc.server.domain.route.service.RouteService;
import com.todoc.server.external.tmap.service.TMapRouteParser;
import com.todoc.server.external.tmap.service.TMapRouteService;
import com.todoc.server.external.tmap.service.TMapRouteService.TMapRawResult;
import java.time.LocalTime;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.math.BigDecimal;
import java.util.List;

import static com.todoc.server.common.util.FeeUtils.calculateTotalFee;
import static org.mockito.Mockito.*;
import static org.assertj.core.api.Assertions.assertThat;


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

    @Nested
    @DisplayName("동행 신청 생성")
    class CreateRecruit {

        @Test
        @DisplayName("정상 흐름: 도메인 상태가 기대대로 설정된다 (verify 없이 단언만)")
        void 정상_생성_상태검증() {
            // given
            Long authId = 1L;

            // 실제 도메인 인스턴스 준비
            Auth auth = new Auth(); // 필요한 최소 상태면 충분 (식별자 비교가 필요하면 세터/리플렉션 활용)
            Patient patient = new Patient();
            ImageFile profileImage = new ImageFile();

            // 위치 정보(실좌표)
            LocationInfo meeting = new LocationInfo();
            meeting.setLongitude(new BigDecimal("127.2581225"));
            meeting.setLatitude (new BigDecimal("36.4809912"));

            LocationInfo hospital = new LocationInfo();
            hospital.setLongitude(new BigDecimal("126.9784043"));
            hospital.setLatitude (new BigDecimal("37.5670240"));

            LocationInfo backHome = new LocationInfo();
            backHome.setLongitude(new BigDecimal("127.1234567"));
            backHome.setLatitude (new BigDecimal("36.9876543"));

            Route route = new Route();
            Recruit recruit = new Recruit();

            // DTO는 목으로 최소 반환값만 스텁
            RecruitCreateRequest request = org.mockito.Mockito.mock(RecruitCreateRequest.class);
            RecruitCreateRequest.PatientDetail patientDetail = org.mockito.Mockito.mock(RecruitCreateRequest.PatientDetail.class);
            RecruitCreateRequest.EscortDetail escortDetail = org.mockito.Mockito.mock(RecruitCreateRequest.EscortDetail.class);
            RecruitCreateRequest.LocationDetail meetingDetail = org.mockito.Mockito.mock(RecruitCreateRequest.LocationDetail.class);
            RecruitCreateRequest.LocationDetail hospitalDetail = org.mockito.Mockito.mock(RecruitCreateRequest.LocationDetail.class);
            RecruitCreateRequest.LocationDetail returnDetail = org.mockito.Mockito.mock(RecruitCreateRequest.LocationDetail.class);

            when(request.getPatientDetail()).thenReturn(patientDetail);
            when(request.getEscortDetail()).thenReturn(escortDetail);
            when(request.getMeetingLocationDetail()).thenReturn(meetingDetail);
            when(request.getDestinationDetail()).thenReturn(hospitalDetail);
            when(request.getReturnLocationDetail()).thenReturn(returnDetail);

            when(escortDetail.getEstimatedMeetingTime()).thenReturn(LocalTime.of(9, 0));
            when(escortDetail.getEstimatedReturnTime()).thenReturn(LocalTime.of(11, 30));

            // 서비스 스텁: 실제 도메인 인스턴스 반환
            when(authService.getAuthById(authId)).thenReturn(auth);
            when(patientService.register(patientDetail)).thenReturn(patient);
            when(imageFileService.register(any())).thenReturn(profileImage);
            when(locationInfoService.register(meetingDetail)).thenReturn(meeting);
            when(locationInfoService.register(hospitalDetail)).thenReturn(hospital);
            when(locationInfoService.register(returnDetail)).thenReturn(backHome);
            when(routeService.register(request)).thenReturn(route);
            when(recruitService.register(escortDetail)).thenReturn(recruit);

            // 외부 연동 스텁(2구간): RAW → 파싱
            String rawJson1 = "{\"leg\":\"meeting->hospital\"}";
            String rawJson2 = "{\"leg\":\"hospital->return\"}";
            when(tMapRouteService.getRoute(any()))
                .thenReturn(new TMapRawResult(rawJson1, "V1"),
                    new TMapRawResult(rawJson2, "V2"));

            var summary1 = new TMapRouteParser.RouteLegSummary(1500, 300, 0, 5200);
            var summary2 = new TMapRouteParser.RouteLegSummary(1200, 240, 0, 4800);
            var parse1 = new TMapRouteParser.RouteParseResult(List.of(), summary1);
            var parse2 = new TMapRouteParser.RouteParseResult(List.of(), summary2);
            when(tmapRouteParser.parseSummaryFromRaw(anyString())).thenReturn(parse1, parse2);

            // when
            recruitFacadeService.createRecruit(authId, request);

            // then (상태 기반 단언)
            // 1) 환자 ↔ 고객, 이미지
            assertThat(patient.getCustomer()).isSameAs(auth);
            assertThat(patient.getPatientProfileImage()).isSameAs(profileImage);

            // 2) 경로 ↔ 위치 매핑
            assertThat(route.getMeetingLocationInfo()).isSameAs(meeting);
            assertThat(route.getHospitalLocationInfo()).isSameAs(hospital);
            assertThat(route.getReturnLocationInfo()).isSameAs(backHome);

            // 3) 경로 구간 두 개 생성되어 라우트에 연결됨
            RouteLeg legToHospital = route.getMeetingToHospital();
            RouteLeg legToReturn   = route.getHospitalToReturn();
            assertThat(legToHospital).isNotNull();
            assertThat(legToReturn).isNotNull();

            //    구간1 값 검증
            assertThat(legToHospital.getTotalDistance()).isEqualTo(summary1.totalDistance());
            assertThat(legToHospital.getTotalTime()).isEqualTo(summary1.totalTime());
            assertThat(legToHospital.getTotalFare()).isEqualTo(summary1.totalFare());
            assertThat(legToHospital.getTaxiFare()).isEqualTo(summary1.taxiFare());
            assertThat(legToHospital.getUsedFavoriteRouteVertices()).isEqualTo("V1");

            //    구간2 값 검증
            assertThat(legToReturn.getTotalDistance()).isEqualTo(summary2.totalDistance());
            assertThat(legToReturn.getTotalTime()).isEqualTo(summary2.totalTime());
            assertThat(legToReturn.getTotalFare()).isEqualTo(summary2.totalFare());
            assertThat(legToReturn.getTaxiFare()).isEqualTo(summary2.taxiFare());
            assertThat(legToReturn.getUsedFavoriteRouteVertices()).isEqualTo("V2");

            // 4) Recruit ↔ 연관관계 & 요금
            assertThat(recruit.getCustomer()).isSameAs(auth);
            assertThat(recruit.getPatient()).isSameAs(patient);
            assertThat(recruit.getRoute()).isSameAs(route);

            int expectedFee = calculateTotalFee(LocalTime.of(9, 0), LocalTime.of(11, 30))
                + summary1.totalFare() + summary2.totalFare();
            assertThat(recruit.getEstimatedFee()).isEqualTo(expectedFee);
        }
    }
}