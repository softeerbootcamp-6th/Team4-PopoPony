package com.todoc.server.domain.escort.service;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RecruitScheduler {

    private final EscortService escortService;

    @Scheduled(cron = "0 * * * * *", zone = "Asia/Seoul") // 매 분 0초
    public void updateStatusBeforeMeeting() {
        escortService.updateStatusForEscortBeforeMeeting();
    }
}
