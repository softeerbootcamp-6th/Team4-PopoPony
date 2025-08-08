package com.todoc.server.domain.escort.service;

import com.todoc.server.common.enumeration.RecruitStatus;
import com.todoc.server.common.util.FeeUtils;
import com.todoc.server.domain.customer.entity.Patient;
import com.todoc.server.domain.customer.exception.PatientNotFoundException;
import com.todoc.server.domain.customer.web.dto.response.PatientSimpleResponse;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.escort.exception.RecruitInvalidCancelException;
import com.todoc.server.domain.escort.exception.RecruitNotFoundException;
import com.todoc.server.domain.escort.repository.RecruitJpaRepository;
import com.todoc.server.domain.escort.repository.RecruitQueryRepository;
import com.todoc.server.domain.escort.web.dto.request.RecruitCreateRequest;
import com.todoc.server.domain.escort.web.dto.response.RecruitDetailResponse;
import com.todoc.server.domain.escort.web.dto.response.RecruitListResponse;
import com.todoc.server.domain.escort.web.dto.response.RecruitPaymentResponse;
import com.todoc.server.domain.escort.web.dto.response.RecruitSimpleResponse;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import com.todoc.server.domain.route.entity.Route;
import com.todoc.server.domain.route.exception.RouteNotFoundException;
import com.todoc.server.domain.route.web.dto.response.RouteSimpleResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class RecruitService {

    private final RecruitJpaRepository recruitJpaRepository;
    private final RecruitQueryRepository recruitQueryRepository;

    /**
     * 고객 입장에서 홈 화면에서 '동행 신청' 목록을 조회하는 함수
     * <ul>
     *   <li>1. 동행 신청 목록을 진행중인 목록과 완료된 목록으로 분리하여 제공</li>
     *   <li>2. 진행중인 목록: '동행중' 상태를 최상단에 표시, 동행일 오름차순 정렬</li>
     *   <li>3. 완료된 목록: 동행일 내림차순 정렬</li>
     * </ul>
     * @param userId (authId)
     * @return 분리된 '동행 신청 목록'응답 DTO
     */
    @Transactional(readOnly = true)
    public RecruitListResponse getRecruitListAsCustomerByUserId(Long userId) {
        List<RecruitSimpleResponse> rawList = recruitQueryRepository.findListByUserId(userId);

        List<RecruitSimpleResponse> inProgressList = new ArrayList<>();
        List<RecruitSimpleResponse> completedList = new ArrayList<>();

        // 진행중인 목록과 완료된 목록 분리
        for (RecruitSimpleResponse recruit : rawList) {
            if (recruit.getStatus() == RecruitStatus.DONE) {
                completedList.add(recruit);
            } else {
                inProgressList.add(recruit);
            }
        }

        // 진행중인 목록의 경우, 진행중인 목록 먼저 필터링 하고, 이후에 동행일 기준 오름차순 정렬
        inProgressList.sort(Comparator
            .comparing((RecruitSimpleResponse r) -> r.getStatus() != RecruitStatus.IN_PROGRESS)
            .thenComparing(RecruitSimpleResponse::getEscortDate)
        );

        // 완료된 목록의 경우 동행일 기준 내림차순 정렬
        completedList.sort(Comparator
            .comparing(RecruitSimpleResponse::getEscortDate, Comparator.reverseOrder())
        );

        // DTO 구성
        RecruitListResponse result = RecruitListResponse.builder()
            .inProgressList(inProgressList)
            .completedList(completedList)
            .build();

        return result;
    }

    public Recruit register(RecruitCreateRequest.EscortDetail escortDetail) {

        Recruit recruit = Recruit.builder()
                .escortDate(escortDetail.getEscortDate())
                .estimatedMeetingTime(escortDetail.getEstimatedMeetingTime())
                .estimatedReturnTime(escortDetail.getEstimatedReturnTime())
                .purpose(escortDetail.getPurpose())
                .extraRequest(escortDetail.getExtraRequest())
                .status(RecruitStatus.MATCHING)
                .build();

        return recruitJpaRepository.save(recruit);
    }

    public Recruit getRecruitById(Long recruitId) {
        return recruitJpaRepository.findById(recruitId)
                .orElseThrow(RecruitNotFoundException::new);
    }

    public void cancelRecruit(Long recruitId) {
        Recruit recruit = recruitJpaRepository.findById(recruitId)
                .orElseThrow(RecruitNotFoundException::new);

        // 매칭 완료된 동행 신청에 대한 예외 처리
        if (recruit.getStatus() != RecruitStatus.MATCHING) {
            throw new RecruitInvalidCancelException();
        }

        // soft delete
        recruit.softDelete();
    }

    /**
     * recruitId에 해당하는 동행 신청에 대한 상세 정보를 조회하는 함수
     *
     * @param recruitId 동행 신청의 ID
     * @return 동행 신청 상세 정보 DTO(RecruitDetailResponse)
     */
    @Transactional(readOnly = true)
    public RecruitDetailResponse getRecruitDetailByRecruitId(Long recruitId) {

        // 1. 데이터 조회 (Recruit + Patient + Route)
        Recruit recruit = recruitQueryRepository.getRecruitWithPatientAndRouteByRecruitId(recruitId);
        if (recruit == null) {
            throw new RecruitNotFoundException();
        }

        // 2. Patient → PatientSimpleResponse
        Patient patient = recruit.getPatient();
        if (patient == null) {
            throw new PatientNotFoundException();
        }
        PatientSimpleResponse patientResponse = PatientSimpleResponse.from(patient);

        // 3. Route → RouteSimpleResponse
        Route route = recruit.getRoute();
        if (route == null) {
            throw new RouteNotFoundException();
        }
        RouteSimpleResponse routeResponse = RouteSimpleResponse.from(route);

        // 4. Recruit → RecruitDetailResponse
        return RecruitDetailResponse.builder()
                .recruitId(recruit.getId())
                .status(recruit.getStatus().getLabel())
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
     * recruitId에 해당하는 동행 신청에 대한 결제 정보를 조회하는 함수
     *
     * @param recruitId 동행 신청의 ID
     * @return 동행 신청 결제 정보 DTO(RecruitPaymentResponse)
     */
    @Transactional(readOnly = true)
    public RecruitPaymentResponse getRecruitPaymentByRecruitId(Long recruitId) {

        // 1. 데이터 조회 (Recruit + Route)
        Recruit recruit = recruitQueryRepository.getRecruitWithRouteByRecruitId(recruitId);
        if (recruit == null) {
            throw new RecruitNotFoundException();
        }

        // 2. Route → RouteSimpleResponse
        Route route = recruit.getRoute();
        if (route == null) {
            throw new RouteNotFoundException();
        }
        RouteSimpleResponse routeResponse = RouteSimpleResponse.from(route);

        // 2. 기본 요금 계산
        int baseFee = FeeUtils.calculateTotalFee(recruit.getEstimatedMeetingTime(), recruit.getEstimatedReturnTime());

        // 3. 예상 택시 요금 계산
        // TODO :: 택시 요금에 대한 처리
        int expectedTaxiFee = 0;

        return RecruitPaymentResponse.builder()
                .recruitId(recruit.getId())
                .route(routeResponse)
                .baseFee(baseFee)
                .expectedTaxiFee(expectedTaxiFee)
                .build();
    }

    public List<Recruit> getAllRecruits() {
        return recruitJpaRepository.findAll();
    }

    public boolean existsById(Long recruitId) {
        return recruitJpaRepository.existsById(recruitId);
    }
}
