package com.todoc.server.domain.escort.service;

import com.todoc.server.common.enumeration.EscortStatus;
import com.todoc.server.common.enumeration.RecruitStatus;
import com.todoc.server.domain.escort.entity.Escort;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.external.sms.service.SMSService;
import java.util.List;
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
    private final SMSService smsService;

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
        LocalTime from = now.toLocalTime().minusMinutes(1);

        logger.info("[EscortScheduledFacadeService] {}부터 3시간 이내의 Recruit/Escort에 대해 status 변경", from);

        if (now.getHour() < 21) {
            LocalTime to = end.toLocalTime();
            processRecruits(today, from, to, now);
        } else {
            // 자정 넘김(예: 22:00~익일 01:00) 케이스
            processRecruits(today, from, LocalTime.MAX, now);
            processRecruits(today.plusDays(1), LocalTime.MIN, end.toLocalTime(), now);
        }
    }

    private void processRecruits(LocalDate date, LocalTime from, LocalTime to, ZonedDateTime now) {
        List<Escort> escorts = escortService.getEscortForPreparingAndBetween(date, from, to);

        for (Escort escort : escorts) {
            // SMS 발송
            smsService.sendSms(escort.getRecruit().getPatient().getContact(), "01026458362", buildEscortStartMessage(escort.getRecruit().getId()));

            // 현재는 dirtychecking으로 처리
            escort.setStatus(EscortStatus.MEETING);
            escort.getRecruit().setStatus(RecruitStatus.IN_PROGRESS);
        }


//        escortService.updateStatusForEscortBeforeMeeting(date, from, to, now);
//        recruitService.updateStatusForRecruitBeforeMeeting(date, from, to, now);
    }

    private String buildEscortStartMessage(Long recruitId) {
        String encoded = encodeEscortId(recruitId); // escortId → 암호화된 값
        return """
        [토닥]
        곧 도우미와의 병원 동행이 시작됩니다!
        다음 링크에 접속해주세요!

        https://www.todoc.kr/dashboard/map/%s
        """.formatted(encoded);
    }

    private String encodeEscortId(Long recruitId) {
        long encoded = recruitId * 73 + 13579;   // 예시 수식
        return Long.toHexString(encoded);       // 사람이 보기 어렵게 16진수 변환
    }
}
