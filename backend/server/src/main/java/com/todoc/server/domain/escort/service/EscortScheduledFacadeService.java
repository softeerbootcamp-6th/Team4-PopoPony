package com.todoc.server.domain.escort.service;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZonedDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class EscortScheduledFacadeService {

    private static final Logger logger = LoggerFactory.getLogger(EscortScheduledFacadeService.class);

    private final Clock clock;
    private final EscortService escortService;
    private final RecruitService recruitService;

    /**
     * 다음 기준을 충족하는 Escort 대해 Status를 PREPARING("동행준비") -> MEETING("만남중")으로 업데이트
     * 스케쥴러가 동작하는 시각이 00시 ~ 21시 이전일 때와 21시 ~ 00시 사이에 따라 다르게 동작
     * 1. Escort.Recruit의 status가 COMPLETED("매칭완료")
     * 2. Escort의 status가 PREPARING("동행준비")
     * 3. Recruit의 escortDate가 현재 날짜와 같고,
     * 4. Recruit의 estimatedMeetingTime이 현재 시간보다 3시간 이내 (180분)인 경우
     */
    @Transactional
    @Scheduled(cron = "0 * * * * *", zone = "Asia/Seoul")
    public void updateStatusForEscortBeforeMeeting() {

        ZonedDateTime now = ZonedDateTime.now(clock);
        ZonedDateTime end = now.plusHours(3);

        LocalDate today = now.toLocalDate();
        LocalTime from = now.toLocalTime();

        logger.info("[EscortScheduledFacadeService] {}부터 3시간 이내의 Recruit/Escort에 대해 status 변경", from);

        if (now.getHour() < 21) {
            LocalTime to = end.toLocalTime();
            escortService.updateStatusForEscortBeforeMeeting(today, from, to, now);
            recruitService.updateStatusForRecruitBeforeMeeting(today, from, to, now);
        } else {
            // 자정 넘김(예: 22:00~익일 01:00) 케이스는 두 구간으로 쪼개 호출
            escortService.updateStatusForEscortBeforeMeeting(today, from, LocalTime.MAX, now);
            escortService.updateStatusForEscortBeforeMeeting(today.plusDays(1), LocalTime.MIN, end.toLocalTime(), now);
            recruitService.updateStatusForRecruitBeforeMeeting(today, from, LocalTime.MAX, now);
            recruitService.updateStatusForRecruitBeforeMeeting(today.plusDays(1), LocalTime.MIN, end.toLocalTime(), now);
        }
    }

}
