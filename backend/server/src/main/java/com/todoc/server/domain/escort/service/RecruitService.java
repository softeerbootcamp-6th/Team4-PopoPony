package com.todoc.server.domain.escort.service;

import com.todoc.server.common.enumeration.RecruitStatus;
import com.todoc.server.domain.customer.entity.Patient;
import com.todoc.server.domain.customer.exception.PatientNotFoundException;
import com.todoc.server.domain.customer.web.dto.response.PatientSimpleResponse;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.escort.exception.RecruitNotFoundException;
import com.todoc.server.domain.escort.repository.RecruitJpaRepository;
import com.todoc.server.domain.escort.repository.RecruitQueryRepository;
import com.todoc.server.domain.escort.web.dto.request.RecruitCreateRequest;
import com.todoc.server.domain.escort.web.dto.response.RecruitDetailResponse;
import com.todoc.server.domain.escort.web.dto.response.RecruitListResponse;
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
}
