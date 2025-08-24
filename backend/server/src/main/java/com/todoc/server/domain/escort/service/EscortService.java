package com.todoc.server.domain.escort.service;

import com.todoc.server.common.enumeration.EscortStatus;
import com.todoc.server.common.enumeration.RecruitStatus;
import com.todoc.server.common.enumeration.Role;
import com.todoc.server.common.util.TransactionUtils;
import com.todoc.server.domain.escort.entity.Escort;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.escort.exception.EscortInvalidProceedException;
import com.todoc.server.domain.escort.exception.EscortNotFoundException;
import com.todoc.server.domain.escort.repository.EscortJpaRepository;
import com.todoc.server.domain.escort.repository.EscortQueryRepository;
import com.todoc.server.domain.escort.web.dto.request.EscortMemoUpdateRequest;
import com.todoc.server.domain.escort.web.dto.response.EscortStatusResponse;
import com.todoc.server.domain.realtime.service.NchanPublisher;
import com.todoc.server.domain.realtime.service.WebSocketSessionRegistry;
import com.todoc.server.domain.realtime.web.dto.response.Envelope;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.time.*;

@Service
@RequiredArgsConstructor
@Transactional
public class EscortService {

    // TODO :: 웹소켓 연결 후 SSE는 제거
    private final EscortJpaRepository escortJpaRepository;
    private final EscortQueryRepository escortQueryRepository;
//    private final SseEmitterManager emitterManager;
    private final WebSocketSessionRegistry sessionRegistry;
    private final NchanPublisher nchanPublisher;

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

    @Transactional
    public void proceedEscort(Long escortId) {

        Escort escort = getById(escortId);
        EscortStatus from = escort.getStatus();
        EscortStatus to = nextOf(from);

        Instant now = Instant.now();
        ZoneId ZONE = ZoneId.of("Asia/Seoul");
        LocalDateTime kstNow = LocalDateTime.ofInstant(now, ZONE);

        if (to == EscortStatus.HEADING_TO_HOSPITAL) {
            escort.setActualMeetingTime(kstNow);
        }
        if (to == EscortStatus.WRITING_REPORT) {
            escort.setActualReturnTime(kstNow);
            Recruit recruit = escort.getRecruit();
            recruit.setStatus(RecruitStatus.DONE);
        }
        escort.setStatus(to);

        // 커밋 후 비동기 알림/세션 조작
        TransactionUtils.runAfterCommitOrNow(() -> {
            Envelope env = new Envelope("status", new EscortStatusResponse(to.getLabel(), kstNow));
            sessionRegistry.sendToRoleAsync(escortId, Role.CUSTOMER, env);
            nchanPublisher.publishAsync(escortId, env);

            if (to == EscortStatus.HEADING_TO_HOSPITAL) {
                sessionRegistry.removeAsync(escortId, Role.PATIENT);
            }
        });
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


    @Transactional
    public List<Escort> getEscortForPreparingAndBetween(LocalDate date, LocalTime from, LocalTime to) {
        List<Escort> recruitList = escortQueryRepository.getEscortForPreparingAndBetween(date, from, to);

        return recruitList;
    }

    private static EscortStatus nextOf(EscortStatus s) {
        return switch (s) {
            case PREPARING -> throw new EscortInvalidProceedException();
            case MEETING -> EscortStatus.HEADING_TO_HOSPITAL;
            case HEADING_TO_HOSPITAL -> EscortStatus.IN_TREATMENT;
            case IN_TREATMENT -> EscortStatus.RETURNING;
            case RETURNING -> EscortStatus.WRITING_REPORT;
            case WRITING_REPORT -> throw new EscortInvalidProceedException();
            case DONE -> throw new EscortInvalidProceedException();
        };
    }
}