package com.todoc.server.domain.escort.service;

import com.todoc.server.common.enumeration.EscortStatus;
import com.todoc.server.common.enumeration.RecruitStatus;
import com.todoc.server.common.enumeration.Role;
import com.todoc.server.domain.escort.entity.Escort;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.escort.exception.EscortInvalidProceedException;
import com.todoc.server.domain.escort.exception.EscortNotFoundException;
import com.todoc.server.domain.escort.repository.EscortJpaRepository;
import com.todoc.server.domain.escort.repository.EscortQueryRepository;
import com.todoc.server.domain.escort.web.dto.request.EscortMemoUpdateRequest;
import com.todoc.server.domain.escort.web.dto.response.EscortStatusResponse;
import com.todoc.server.domain.realtime.service.WebSocketSessionRegistry;
import com.todoc.server.domain.realtime.service.SseEmitterManager;
import com.todoc.server.domain.realtime.web.dto.response.Envelope;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;

@Service
@RequiredArgsConstructor
@Transactional
public class EscortService {

    // TODO :: 웹소켓 연결 후 SSE는 제거
    private final EscortJpaRepository escortJpaRepository;
    private final EscortQueryRepository escortQueryRepository;
    private final SseEmitterManager emitterManager;
    private final WebSocketSessionRegistry sessionRegistry;

    @Transactional(readOnly = true)
    public Long getCountByHelperUserId(Long helperId) {
        return escortJpaRepository.countByHelperId(helperId);
    }

    @Transactional
    public void save(Escort escort) {
        escortJpaRepository.save(escort);
    }

    @Transactional
    public Escort getByRecruitId(Long recruitId) {
        return escortJpaRepository.findByRecruitId(recruitId)
                .orElseThrow(EscortNotFoundException::new);
    }

    @Transactional
    public Escort getEscortWithDetailByRecruitId(Long recruitId) {
        Escort escort = escortQueryRepository.findEscortDetailByRecruitId(recruitId);
        if (escort == null) {
            throw new EscortNotFoundException();
        }
        return escort;
    }

    @Transactional
    public Escort getById(Long escortId) {
        return escortJpaRepository.findById(escortId)
                .orElseThrow(EscortNotFoundException::new);
    }

    // TODO : 테스트 끝나고 제거
    @Transactional
    public void proceedEscortForTest(Long escortId) {

        Escort escort = getById(escortId);
        EscortStatus currentStatus = escort.getStatus();

        EscortStatus[] statuses = EscortStatus.values();
        int currentIndex = currentStatus.ordinal();

        if (true) {
            int nextIndex = (currentIndex + 1) % statuses.length;

            EscortStatus nextStatus = statuses[nextIndex];
            escort.setStatus(nextStatus);
            LocalDateTime now = LocalDateTime.now();

            // 동행 만남 완료
            if (nextStatus == EscortStatus.HEADING_TO_HOSPITAL) {
                escort.setActualMeetingTime(now);

                // TODO :: 웹소켓 연결 후 SSE는 제거
                emitterManager.close(escortId, Role.PATIENT);
                sessionRegistry.remove(escortId, Role.PATIENT);
            }

            // 동행 복귀 완료
            if (nextStatus == EscortStatus.WRITING_REPORT) {
                escort.setActualReturnTime(now);
                Recruit recruit = escort.getRecruit();
                recruit.setStatus(RecruitStatus.DONE);
            }

            // TODO :: 진행 상태 변화 고객에게 알림 (Web Push, SMS, E-mail 등)
            // TODO :: 웹소켓 연결 후 SSE는 제거
            emitterManager.send(escortId, Role.CUSTOMER, "status", new EscortStatusResponse(escortId, nextStatus.getLabel(), now));
            sessionRegistry.sendToRole(escortId, Role.CUSTOMER, new Envelope("status", new EscortStatusResponse(escortId, nextStatus.getLabel(), now)));

        } else {
            throw new EscortInvalidProceedException();
        }
    }

    @Transactional
    public void proceedEscort(Long escortId) {

        Escort escort = getById(escortId);
        EscortStatus currentStatus = escort.getStatus();

        EscortStatus[] statuses = EscortStatus.values();
        int currentIndex = currentStatus.ordinal();

        if (0 < currentIndex && currentIndex < statuses.length - 1) {
            int nextIndex = (currentIndex + 1) % statuses.length;

            EscortStatus nextStatus = statuses[nextIndex];
            escort.setStatus(nextStatus);
            LocalDateTime now = LocalDateTime.now();

            // 동행 만남 완료
            if (nextStatus == EscortStatus.HEADING_TO_HOSPITAL) {
                escort.setActualMeetingTime(now);

                emitterManager.close(escortId, Role.PATIENT);
            }

            // 동행 복귀 완료
            if (nextStatus == EscortStatus.WRITING_REPORT) {
                escort.setActualReturnTime(now);
                Recruit recruit = escort.getRecruit();
                recruit.setStatus(RecruitStatus.DONE);
            }

            // TODO :: 진행 상태 변화 고객에게 알림 (Web Push, SMS, E-mail 등)
            emitterManager.send(escortId, Role.CUSTOMER, "status", new EscortStatusResponse(escortId, nextStatus.getLabel(), now));

        } else {
            throw new EscortInvalidProceedException();
        }
    }

    @Transactional
    public void updateMemo(Long escortId, EscortMemoUpdateRequest request) {

        Escort escort = getById(escortId);
        escort.setMemo(request.getMemo());
    }

    @Transactional
    public void updateStatusForEscortBeforeMeeting(LocalDate today,
                                                   LocalTime from, LocalTime to, ZonedDateTime now) {
        escortQueryRepository.updateStatusForEscortBeforeMeeting(today, from, to, now);
    }
}