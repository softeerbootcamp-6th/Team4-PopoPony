package com.todoc.server.domain.escort.service;

import com.todoc.server.domain.escort.repository.EscortQueryRepository;
import lombok.RequiredArgsConstructor;
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
    public void updateStatusForEscortBeforeMeeting() {

        ZonedDateTime now = ZonedDateTime.now(clock);
        ZonedDateTime end = now.plusHours(3);

        LocalDate today = now.toLocalDate();
        LocalTime from = now.toLocalTime();

        if (now.getHour() < 21) {
            LocalTime to = end.toLocalTime();
            escortService.updateStatusForEscortBeforeMeeting(today, from, to, now);
        } else {
            // 자정 넘김(예: 22:00~익일 01:00) 케이스는 두 구간으로 쪼개 호출
            escortQueryRepository.updateStatusForEscortBeforeMeeting(today, from, LocalTime.MAX, now);
            escortQueryRepository.updateStatusForEscortBeforeMeeting(today.plusDays(1), LocalTime.MIN, end.toLocalTime(), now);
        }
    }

}
