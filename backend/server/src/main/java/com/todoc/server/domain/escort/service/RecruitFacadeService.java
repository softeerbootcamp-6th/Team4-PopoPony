package com.todoc.server.domain.escort.service;

import com.todoc.server.common.enumeration.RouteLegType;
import com.todoc.server.common.util.FeeUtils;
import com.todoc.server.common.util.JsonUtils;
import com.todoc.server.domain.auth.entity.Auth;
import com.todoc.server.domain.auth.service.AuthService;
import com.todoc.server.domain.customer.entity.Patient;
import com.todoc.server.domain.customer.service.PatientService;
import com.todoc.server.domain.escort.entity.Recruit;
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
import com.todoc.server.external.tmap.web.dto.RouteExternalRequest;
import java.io.IOException;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class RecruitFacadeService {

    private final RecruitService recruitService;
    private final PatientService patientService;
    private final LocationInfoService locationInfoService;
    private final RouteService routeService;
    private final RouteLegService routeLegService;
    private final AuthService authService;
    private final ImageFileService imageFileService;

    // 외부 연동 & 파서 & 도메인 서비스
    private final TMapRouteService tMapRouteService;
    private final TMapRouteParser tmapRouteParser;


    public void createRecruit(Long authId, RecruitCreateRequest request) {

        Auth customer = authService.getAuthById(authId);

        // 환자 정보 저장 (생성 + 연관관계 설정)
        Patient patient = patientService.register(request.getPatientDetail());
        patient.setCustomer(customer);

        ImageFile profileImage = imageFileService.register(request.getPatientDetail().getProfileImageCreateRequest());
        patient.setPatientProfileImage(profileImage);

        // 위치 정보 저장 (생성 + 연관관계 설정)
        LocationInfo meetingLocation = locationInfoService.register(request.getMeetingLocationDetail());
        LocationInfo hospitalLocation = locationInfoService.register(request.getDestinationDetail());
        LocationInfo returnLocation = locationInfoService.register(request.getReturnLocationDetail());

        Route route = routeService.register(request);
        route.setMeetingLocationInfo(meetingLocation);
        route.setHospitalLocationInfo(hospitalLocation);
        route.setReturnLocationInfo(returnLocation);

        // 4) Tmap 두 구간 호출 (미팅→병원, 병원→복귀)
        RouteExternalRequest routeLegRequestForHospital = RouteExternalRequest.builder()
                .startX(meetingLocation.getLongitude().toPlainString())
                .startY(meetingLocation.getLatitude().toPlainString())
                .endX(hospitalLocation.getLongitude().toPlainString())
                .endY(hospitalLocation.getLatitude().toPlainString())
                .reqCoordType("WGS84GEO").resCoordType("WGS84GEO")
                .startName(meetingLocation.getFullRoadAddress())
                .endName(hospitalLocation.getFullRoadAddress())
                .build();

        RouteExternalRequest routeLegRequestForReturn = RouteExternalRequest.builder()
                .startX(hospitalLocation.getLongitude().toPlainString())
                .startY(hospitalLocation.getLatitude().toPlainString())
                .endX(returnLocation.getLongitude().toPlainString())
                .endY(returnLocation.getLatitude().toPlainString())
                .reqCoordType("WGS84GEO").resCoordType("WGS84GEO")
                .startName(hospitalLocation.getFullRoadAddress())
                .endName(returnLocation.getFullRoadAddress())
                .build();

        // 5) TMap API 호출
        TMapRawResult rawResultForHospital = tMapRouteService.getRoute(routeLegRequestForHospital);
        TMapRawResult rawResultForReturn = tMapRouteService.getRoute(routeLegRequestForReturn);

        // 6) Tmap 결과 파싱
        TMapRouteParser.RouteParseResult routeParseResultForHospital = tmapRouteParser.parseSummaryFromRaw(rawResultForHospital.tmapJson());
        TMapRouteParser.RouteLegSummary routeLegSummaryForHospital = routeParseResultForHospital.summary();
        TMapRouteParser.RouteParseResult routeParseResultForReturn = tmapRouteParser.parseSummaryFromRaw(rawResultForReturn.tmapJson());
        TMapRouteParser.RouteLegSummary routeLegSummaryForReturn = routeParseResultForReturn.summary();

        // 7) RouteLeg 생성, 연관관계 매핑
        RouteLeg leg1 = RouteLeg.builder()
                .route(route) // ★ 연관관계는 Facade에서
                .legType(RouteLegType.MEETING_TO_HOSPITAL)
                .totalDistance(routeLegSummaryForHospital.totalDistance())
                .totalTime(routeLegSummaryForHospital.totalTime())
                .totalFare(routeLegSummaryForHospital.totalFare())
                .taxiFare(routeLegSummaryForHospital.taxiFare())
                .usedFavoriteRouteVertices(rawResultForHospital.usedVertices())
                .coordinates(JsonUtils.toJson(routeParseResultForHospital.coordinates()))
                .build();
        routeLegService.save(leg1);

        RouteLeg leg2 = RouteLeg.builder()
                .route(route)
                .legType(RouteLegType.HOSPITAL_TO_RETURN)
                .totalDistance(routeLegSummaryForReturn.totalDistance())
                .totalTime(routeLegSummaryForReturn.totalTime())
                .totalFare(routeLegSummaryForReturn.totalFare())
                .taxiFare(routeLegSummaryForReturn.taxiFare())
                .usedFavoriteRouteVertices(rawResultForReturn.usedVertices())
                .coordinates(JsonUtils.toJson(routeParseResultForReturn.coordinates()))
                .build();
        routeLegService.save(leg2);

        // 동행 신청 생성 (생성 + 연관관계 설정)
        Recruit recruit = recruitService.register(request.getEscortDetail());
        recruit.setCustomer(customer);
        recruit.setPatient(patient);
        recruit.setRoute(route);

        // 금액 계산
        Integer estimatedFee = FeeUtils.calculateTotalFee(request.getEscortDetail().getEstimatedMeetingTime(), request.getEscortDetail().getEstimatedReturnTime());
        estimatedFee += routeLegSummaryForHospital.totalFare() + routeLegSummaryForReturn.totalFare();
        recruit.setEstimatedFee(estimatedFee);
    }
}
