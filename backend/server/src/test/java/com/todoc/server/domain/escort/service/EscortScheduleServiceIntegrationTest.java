package com.todoc.server.domain.escort.service;

import com.todoc.server.IntegrationTest;
import com.todoc.server.MockitoBeanIntegrationTest;
import com.todoc.server.common.enumeration.EscortStatus;
import com.todoc.server.common.enumeration.RecruitStatus;
import com.todoc.server.domain.escort.entity.Escort;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.escort.repository.EscortJpaRepository;
import com.todoc.server.domain.escort.repository.RecruitJpaRepository;
import com.todoc.server.external.sms.service.SMSService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.parallel.Execution;
import org.junit.jupiter.api.parallel.ExecutionMode;
import org.junit.jupiter.api.parallel.Isolated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@Isolated
@Transactional
class EscortScheduleServiceIntegrationTest extends MockitoBeanIntegrationTest {

    @Autowired
    private EscortScheduledFacadeService scheduledService;

    @Autowired
    private EscortJpaRepository escortRepository;

    @Autowired
    private RecruitJpaRepository recruitRepository;

    @PersistenceContext
    private EntityManager em;

    private Clock fixedClock;

    @BeforeEach
    void setup() {
        // mock SMS 전송은 아무 일도 안 하도록
        doNothing().when(smsService).sendSms(anyString(), anyString(), anyString());
    }

    @Test
    @DisplayName("현재 시각이 2025-08-23 18:00이면 escortId=16 이 3시간 이내 조건으로 상태 변경된다")
    void updateStatus_within3hours() {
        fixedClock = Clock.fixed(
                ZonedDateTime.of(2025, 8, 23, 18, 0, 0, 0, ZoneId.of("Asia/Seoul")).toInstant(),
                ZoneId.of("Asia/Seoul")
        );
        ReflectionTestUtils.setField(scheduledService, "clock", fixedClock);

        // when
        scheduledService.updateStatusForEscortBeforeMeeting();

        em.flush(); em.clear();

        // then
        Escort escort = escortRepository.findById(16L).orElseThrow();
        Recruit recruit = recruitRepository.findById(16L).orElseThrow();

        assertThat(escort.getStatus()).isEqualTo(EscortStatus.MEETING);
        assertThat(recruit.getStatus()).isEqualTo(RecruitStatus.IN_PROGRESS);

        // SMS 호출 검증 (어쩔수 없이 추가)
        verify(smsService, times(1)).sendSms(anyString(), anyString(), contains("todoc.kr/dashboard/map/"));
    }
}