package com.todoc.server.domain.escort.service;

import com.todoc.server.common.enumeration.ApplicationStatus;
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
import com.todoc.server.domain.escort.repository.dto.RecruitHistoryDetailFlatDto;
import com.todoc.server.domain.escort.web.dto.request.RecruitCreateRequest;
import com.todoc.server.domain.escort.web.dto.response.*;
import com.todoc.server.domain.route.exception.LocationNotFoundException;
import com.todoc.server.domain.route.web.dto.response.RouteDetailResponse;
import com.todoc.server.domain.route.entity.Route;
import com.todoc.server.domain.route.exception.RouteNotFoundException;
import com.todoc.server.domain.route.web.dto.response.RouteSimpleResponse;

import java.time.*;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class RecruitService {

    private final RecruitJpaRepository recruitJpaRepository;
    private final RecruitQueryRepository recruitQueryRepository;
    private final Clock clock;

    /**
     * 고객 입장에서 홈 화면에서 '동행 신청' 목록을 조회하는 함수
     * <ul>
     *   <li>1. 동행 신청 목록을 진행중인 목록과 완료된 목록으로 분리하여 제공</li>
     *   <li>2. 진행중인 목록: '동행중' 상태를 최상단에 표시, 동행일 오름차순 정렬</li>
     *   <li>3. 완료된 목록: 동행일 내림차순 정렬</li>
     * </ul>
     *
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
            if (RecruitStatus.from(recruit.getRecruitStatus()).get() == RecruitStatus.DONE) {
                completedList.add(recruit);
            } else {
                inProgressList.add(recruit);
            }
        }

        // 진행중인 목록의 경우, 진행중인 목록 먼저 필터링 하고, 이후에 동행일 기준 오름차순 정렬
        inProgressList.sort(Comparator
                .comparing((RecruitSimpleResponse r) -> RecruitStatus.from(r.getRecruitStatus()).get()
                        != RecruitStatus.IN_PROGRESS)
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
     * userId에 해당하는 고객의 이전 동행 신청 목록을 조회하는 함수
     *
     * @param userId
     * @return 이전 동행 신청 목록 응답 DTO(RecruitHistoryListResponse) size = 5
     */
    @Transactional(readOnly = true)
    public RecruitHistoryListResponse getRecruitHistoryListByUserId(Long userId) {
        List<RecruitHistorySimpleResponse> recruitList = recruitQueryRepository.findRecruitListSortedByUserId(
                userId, 5);

        return RecruitHistoryListResponse.builder()
                .beforeList(recruitList)
                .build();
    }

    /**
     * recruitId에 해당하는 동행 신청에 대한 상세 정보를 조회하는 함수 (Request 형식과 동일한 형식의 Response DTO)
     *
     * @param recruitId
     * @return 동행 신청 상세 정보 DTO(RecruitHistoryDetailResponse)
     */
    @Transactional(readOnly = true)
    public RecruitHistoryDetailResponse getRecruitHistoryDetailByRecruitId(Long recruitId) {
        RecruitHistoryDetailFlatDto recruitHistoryDetailFlatDto = recruitQueryRepository.getRecruitHistoryDetailByRecruitId(recruitId);

        if (recruitHistoryDetailFlatDto == null) {
            throw new RecruitNotFoundException();
        }

        // 환자 정보
        Patient patient = recruitHistoryDetailFlatDto.getPatient();
        RecruitHistoryDetailResponse.PatientDetailHistory patientDetail =
                RecruitHistoryDetailResponse.PatientDetailHistory.from(patient);

        // 위치 정보
        RecruitHistoryDetailResponse.LocationDetail meetingLocationDetail = RecruitHistoryDetailResponse.LocationDetail
                .from(recruitHistoryDetailFlatDto.getMeetingLocation());
        RecruitHistoryDetailResponse.LocationDetail destinationDetail = RecruitHistoryDetailResponse.LocationDetail
                .from(recruitHistoryDetailFlatDto.getDestination());
        RecruitHistoryDetailResponse.LocationDetail returnLocationDetail = RecruitHistoryDetailResponse.LocationDetail
                .from(recruitHistoryDetailFlatDto.getReturnLocation());

        return RecruitHistoryDetailResponse.builder()
                .patientDetail(patientDetail)
                .meetingLocationDetail(meetingLocationDetail)
                .destinationDetail(destinationDetail)
                .returnLocationDetail(returnLocationDetail)
                .build();
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

        RouteDetailResponse routeResponse = RouteDetailResponse.from(route);

        // 3. 이용 시간 계산
        LocalTime startTime = recruit.getEstimatedMeetingTime();
        LocalTime endTime = recruit.getEstimatedReturnTime();
        long totalMinutes = Duration.between(startTime, endTime).toMinutes();

        // 4. 기본 요금 계산
        int baseFee = FeeUtils.calculateTotalFee(recruit.getEstimatedMeetingTime(),
                recruit.getEstimatedReturnTime());

        // 5. 예상 택시 요금 계산
        int meetingToHospitalTaxiFee = route.getMeetingToHospital().getTaxiFare();
        int hospitalToReturnTaxiFee = route.getHospitalToReturn().getTaxiFare();
        int expectedTaxiFee = meetingToHospitalTaxiFee + hospitalToReturnTaxiFee;

        return RecruitPaymentResponse.builder()
                .recruitId(recruit.getId())
                .route(routeResponse)
                .totalMinutes(totalMinutes)
                .baseFee(baseFee)
                .expectedTaxiFee(expectedTaxiFee)
                .build();
    }

    /**
     * 도우미 입장에서 홈 화면에서 '동행 신청' 목록을 조회하는 함수
     * <ul>
     *   <li>1. 동행 신청 목록을 진행중인 목록과 완료된 목록으로 분리하여 제공</li>
     *   <li>2. 진행중인 목록: '동행중' 상태를 최상단에 표시, 동행일 오름차순 정렬</li>
     *   <li>3. 완료된 목록: 동행일 내림차순 정렬</li>
     * </ul>
     *
     * @param helperUserId (helperUserId)
     * @return 분리된 '동행 신청 목록'응답 DTO
     */
    @Transactional(readOnly = true)
    public RecruitListResponse getRecruitListAsHelperByUserId(Long helperUserId) {
        // 도우미가 지원한 동행 신청 목록중 Application Status가 PENDING, MATCHED인 동행 신청 목록을 조회함 (FAILED 제외)
        List<RecruitSimpleResponse> rawList =
                recruitQueryRepository.findListByHelperUserIdAndApplicationStatus(helperUserId,
                        List.of(ApplicationStatus.MATCHED, ApplicationStatus.PENDING));

        List<RecruitSimpleResponse> inProgressList = new ArrayList<>();
        List<RecruitSimpleResponse> completedList = new ArrayList<>();

        // 진행중인 목록과 완료된 목록 분리
        for (RecruitSimpleResponse recruit : rawList) {
            if (RecruitStatus.from(recruit.getRecruitStatus()).get() == RecruitStatus.DONE) {
                completedList.add(recruit);
            } else {
                inProgressList.add(recruit);
            }
        }

        // 진행중인 목록의 경우, 진행중인 목록 먼저 필터링 하고, 이후에 동행일 기준 오름차순 정렬
        inProgressList.sort(Comparator
            .comparing((RecruitSimpleResponse r) -> RecruitStatus.from(r.getRecruitStatus()).get() != RecruitStatus.IN_PROGRESS)
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

    /**
     * 지역/날짜에 따른 동행 신청 목록을 조회하는 함수
     * <ul>
     *   <li>1. 만남 장소 기준으로 필터링</li>
     *   <li>2. 동행일 오름차순 정렬 + 가까운 기준 정렬</li>
     * </ul>
     * @param area String
     * @param startDate LocalDate
     * @param endDate LocalDate
     * @return 검색되는 '동행 신청 목록'응답 DTO
     */
    public RecruitSearchListResponse getRecruitListBySearch(long authId, String area,
                                                            LocalDate startDate, LocalDate endDate) {
        List<Recruit> recruitList = recruitQueryRepository.findListByDateRangeAndStatus(authId, area, startDate, endDate, List.of(RecruitStatus.MATCHING), ZonedDateTime.now(clock).toLocalDate());

        // 동행일 기준으로 오름차순 + 만남 장소 기준으로 필터링
        recruitList = recruitList.stream()
                .sorted(Comparator
                        .comparing(Recruit::getEscortDate))
                // TODO 가까운 기준??
                .toList();

        // DTO 구성
        List<RecruitSimpleResponse> dtoList = new ArrayList<>();
        for (Recruit recruit : recruitList) {
            if (recruit.getRoute() == null) {
                throw new RouteNotFoundException();
            }

            if (recruit.getRoute().getMeetingLocationInfo() == null || recruit.getRoute().getHospitalLocationInfo() == null) {
                throw new LocationNotFoundException();
            }

            if (recruit.getPatient() == null) {
                throw new PatientNotFoundException();
            }

            RecruitSimpleResponse dto = RecruitSimpleResponse.builder()
                    .recruitId(recruit.getId())
                    .escortId(null)
                    .recruitStatus(recruit.getStatus().getLabel())
                    .numberOfApplication(0L)
                    .escortDate(recruit.getEscortDate())
                    .estimatedMeetingTime(recruit.getEstimatedMeetingTime())
                    .estimatedReturnTime(recruit.getEstimatedReturnTime())
                    .departureLocation(recruit.getRoute().getMeetingLocationInfo().getPlaceName())
                    .destination(recruit.getRoute().getHospitalLocationInfo().getPlaceName())
                    .estimatedPayment(recruit.getEstimatedFee())
                    .needsHelping(recruit.getPatient().getNeedsHelping())
                    .usesWheelchair(recruit.getPatient().getUsesWheelchair())
                    .hasCognitiveIssue(recruit.getPatient().getHasCognitiveIssue())
                    .hasCommunicationIssue(recruit.getPatient().getHasCommunicationIssue())
                    .build();

            dtoList.add(dto);
        }

        // 날짜별로 그룹핑
        Map<LocalDate, List<RecruitSimpleResponse>> dtoGroupByDate = dtoList.stream()
                .collect(Collectors.groupingBy(
                        RecruitSimpleResponse::getEscortDate,
                        LinkedHashMap::new,
                        Collectors.toList()
                ));

        return RecruitSearchListResponse.builder()
                .inProgressMap(dtoGroupByDate)
                .build();
    }

    public RecruitStatusResponse getRecruitStatusByRecruitId(Long recruitId) {

        Recruit recruit = getRecruitById(recruitId);

        return RecruitStatusResponse.builder()
                .recruitId(recruit.getId())
                .recruitStatus(recruit.getStatus().getLabel())
                .build();
    }

    public List<Recruit> getAllRecruits() {
        return recruitJpaRepository.findAll();
    }

    public boolean existsById(Long recruitId) {
        return recruitJpaRepository.existsById(recruitId);
    }

    public void updateStatusForRecruitBeforeMeeting(LocalDate today, LocalTime from, LocalTime to,
                                                    ZonedDateTime now) {
        recruitQueryRepository.updateStatusForRecruitBeforeMeeting(today, from, to, now);
    }
}
