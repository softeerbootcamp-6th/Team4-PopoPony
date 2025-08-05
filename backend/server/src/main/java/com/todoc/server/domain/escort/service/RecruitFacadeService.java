package com.todoc.server.domain.escort.service;

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
        return recruitService.getRecruitDetailByRecruitId(recruitId);
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
