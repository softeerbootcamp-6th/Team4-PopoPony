package com.todoc.server.domain.escort.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.todoc.server.common.util.DateTimeUtils;
import com.todoc.server.common.util.JsonUtils;
import com.todoc.server.domain.auth.entity.Auth;
import com.todoc.server.domain.auth.exception.AuthNotFoundException;
import com.todoc.server.domain.customer.entity.Patient;
import com.todoc.server.domain.customer.service.PatientService;
import com.todoc.server.domain.customer.web.dto.response.PatientSimpleResponse;
import com.todoc.server.domain.escort.entity.Application;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.escort.web.dto.request.RecruitCreateRequest;
import com.todoc.server.domain.escort.web.dto.response.ApplicationListResponse;
import com.todoc.server.domain.escort.web.dto.response.ApplicationSimpleResponse;
import com.todoc.server.domain.escort.web.dto.response.RecruitDetailResponse;
import com.todoc.server.domain.helper.entity.Helper;
import com.todoc.server.domain.helper.web.dto.response.HelperSimpleResponse;
import com.todoc.server.domain.route.entity.LocationInfo;
import com.todoc.server.domain.route.entity.Route;
import com.todoc.server.domain.route.service.LocationInfoService;
import com.todoc.server.domain.route.service.RouteService;
import com.todoc.server.domain.route.web.dto.response.RouteSimpleResponse;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class RecruitFacadeService {

    private final RecruitService recruitService;
    private final PatientService patientService;
    private final LocationInfoService locationInfoService;
    private final RouteService routeService;

    public void createRecruit(RecruitCreateRequest request) {
        // TODO :: 세션 혹은 JWT로부터 고객 정보 가져오기
        Auth customer = Auth.builder()
                .id(1L)
                .build();

        // 환자 정보 저장 (생성 + 연관관계 설정)
        Patient patient = patientService.register(request.getPatientDetail());
        patient.setCustomer(customer);

        // 위치 정보 저장 (생성 + 연관관계 설정)
        LocationInfo meetingLocation = locationInfoService.register(request.getMeetingLocationDetail());
        LocationInfo hospitalLocation = locationInfoService.register(request.getDestinationDetail());
        LocationInfo returnLocation = locationInfoService.register(request.getReturnLocationDetail());

        // TODO 경로 정보 저장 (생성 + 연관관계 설정) 수정해야함
        Route route = routeService.register(request);
        route.setMeetingLocationInfo(meetingLocation);
        route.setHospitalLocationInfo(hospitalLocation);
        route.setReturnLocationInfo(returnLocation);

        // 동행 신청 생성 (생성 + 연관관계 설정)
        Recruit recruit = recruitService.register(request.getEscortDetail());
        recruit.setCustomer(customer);
        recruit.setPatient(patient);
        recruit.setRoute(route);
        // TODO :: 경로 API 로부터 금액 가져와야 함
        recruit.setEstimatedFee(null);
    }

    /**
     * recruitId에 해당하는 동행 신청에 대한 상세 정보를 조회하는 함수
     *
     * @param recruitId 동행 신청의 ID
     * @return 동행 신청 상세 정보 DTO(RecruitDetailResponse)
     */
    @Transactional(readOnly = true)
    public RecruitDetailResponse getRecruitDetailByRecruitId(Long recruitId) {

        // 1. 동행 신청 조회
        Recruit recruit = recruitService.findById(recruitId);

        // 2. Patient → PatientSimpleResponse
        Patient patient = recruit.getPatient();
        PatientSimpleResponse patientResponse = PatientSimpleResponse.from(patient);

        // 3. Route → RouteSimpleResponse
        Route route = recruit.getRoute();
        RouteSimpleResponse routeResponse = RouteSimpleResponse.from(route);

        // 4. Recruit → RecruitDetailResponse
        return RecruitDetailResponse.builder()
                .recruitId(recruit.getId())
                .status(recruit.getStatus())
                .escortDate(recruit.getEscortDate())
                .estimatedMeetingTime(recruit.getEstimatedMeetingTime())
                .estimatedReturnTime(recruit.getEstimatedReturnTime())
                .route(routeResponse)
                .patient(patientResponse)
                .purpose(recruit.getPurpose())
                .extraRequest(recruit.getExtraRequest())
                .build();
    }

    /**
     * recruitId에 해당하는 동행 신청을 취소하는 함수
     *
     * @param recruitId 동행 신청의 ID
     */
    @Transactional(readOnly = true)
    public void cancelRecruit(Long recruitId) {
        recruitService.cancelRecruit(recruitId);
    }
}
