package com.todoc.server.domain.escort.service;

import com.todoc.server.domain.escort.entity.Escort;
import com.todoc.server.domain.escort.exception.EscortNotFoundException;
import com.todoc.server.domain.escort.repository.EscortJpaRepository;
import com.todoc.server.domain.escort.repository.EscortQueryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;

@Service
@RequiredArgsConstructor
@Transactional
public class EscortService {

    private final EscortJpaRepository escortJpaRepository;
    private final EscortQueryRepository escortQueryRepository;

    @Transactional(readOnly = true)
    public Long getCountByHelperUserId(Long helperId) {
        return escortJpaRepository.countByHelperId(helperId);
    }

    @Transactional
    public void save(Escort escort) {
        escortJpaRepository.save(escort);
    }

    public Escort getByRecruitId(Long recruitId) {
        return escortJpaRepository.findByRecruitId(recruitId)
                .orElseThrow(EscortNotFoundException::new);
    }

    public void proceedEscort(Long recruitId) {

        Escort escort = getByRecruitId(recruitId);



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
