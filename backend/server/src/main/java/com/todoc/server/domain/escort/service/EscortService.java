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

    /**
     * 다음 기준을 충족하는 Escort 대해 Status를 PREPARING("동행준비") -> MEETING("만남중")으로 업데이트
     * 스케쥴러가 동작하는 시각이 00시 ~ 21시 이전일 때와 21시 ~ 00시 사이에 따라 다르게 동작
     * 1. Escort.Recruit의 status가 COMPLETED("매칭완료")
     * 2. Escort의 status가 PREPARING("동행준비")
     * 3. Recruit의 escortDate가 현재 날짜와 같고,
     * 4. Recruit의 estimatedMeetingTime이 현재 시간보다 3시간 이내 (180분)인 경우
     */
    public void updateStatusForEscortBeforeMeeting() {

        OffsetDateTime now = OffsetDateTime.now(ZoneId.of("Asia/Seoul"));
        LocalDate todayUtc = now.toLocalDate();
        LocalTime from = now.toLocalTime();
        LocalTime to = from.plusHours(3);

        if (OffsetDateTime.now(ZoneOffset.UTC).getHour() < 21) {
            escortQueryRepository.updateStatusForEscortBeforeMeeting(todayUtc, from, to);
        } else {
            // 자정 넘김(예: 22:00~익일 01:00) 케이스는 두 구간으로 쪼개 호출
            escortQueryRepository.updateStatusForEscortBeforeMeeting(todayUtc, from, LocalTime.MAX);
            escortQueryRepository.updateStatusForEscortBeforeMeeting(todayUtc.plusDays(1), LocalTime.MIN, to);
        }
    }
}
