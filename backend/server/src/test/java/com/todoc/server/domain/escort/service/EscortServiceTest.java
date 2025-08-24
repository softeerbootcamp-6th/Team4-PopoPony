package com.todoc.server.domain.escort.service;

import com.todoc.server.common.enumeration.EscortStatus;
import com.todoc.server.common.enumeration.RecruitStatus;
import com.todoc.server.domain.escort.entity.Escort;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.escort.exception.EscortInvalidProceedException;
import com.todoc.server.domain.escort.exception.EscortNotFoundException;
import com.todoc.server.domain.escort.repository.EscortJpaRepository;
import com.todoc.server.domain.escort.web.dto.request.EscortMemoUpdateRequest;
import com.todoc.server.domain.realtime.service.NchanPublisher;
import com.todoc.server.domain.realtime.service.WebSocketSessionRegistry;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EscortServiceTest {

    @Mock private EscortJpaRepository escortJpaRepository;
    @Mock private WebSocketSessionRegistry webSocketSessionRegistry;
    @Mock private NchanPublisher nchanPublisher;

    @InjectMocks private EscortService escortService;

    private Escort makeEscort(Long id, EscortStatus status, Recruit recruit) {
        Escort e = new Escort();
        e.setId(id);
        e.setStatus(status);
        e.setRecruit(recruit);
        return e;
    }

    private Recruit makeRecruit(Long id) {
        Recruit r = new Recruit();
        r.setId(id);
        r.setStatus(RecruitStatus.IN_PROGRESS);
        r.setEscortDate(LocalDate.now());
        r.setEstimatedMeetingTime(LocalTime.of(10, 0));
        r.setEstimatedReturnTime(LocalTime.of(12, 0));
        r.setPurpose("검진");
        r.setExtraRequest("천천히 보행");
        return r;
    }

    @Nested
    @DisplayName("proceedEscort")
    class ProceedEscort {

        @Test
        @DisplayName("현재 상태가 RETURNING이면 WRITING_REPORT로 진행되고 복귀시간/Recruit.DONE 세팅")
        void proceed_from_returning_to_writingReport_setsReturnTime_and_recruitDone() {
            Recruit recruit = makeRecruit(8L);
            Escort escort = makeEscort(2L, EscortStatus.RETURNING, recruit);

            when(escortJpaRepository.findById(2L)).thenReturn(Optional.of(escort));

            escortService.proceedEscort(2L);

            assertThat(escort.getStatus()).isEqualTo(EscortStatus.WRITING_REPORT);
            assertThat(escort.getActualReturnTime()).isNotNull();
            assertThat(recruit.getStatus()).isEqualTo(RecruitStatus.DONE);
        }

        @Test
        @DisplayName("존재하지 않는 Escort ID이면 EscortNotFoundException")
        void proceed_notFound() {
            when(escortJpaRepository.findById(99L)).thenReturn(Optional.empty());
            assertThatThrownBy(() -> escortService.proceedEscort(99L))
                    .isInstanceOf(EscortNotFoundException.class);
        }

        @Test
        @DisplayName("허용 구간 외 상태에서는 EscortInvalidProceedException")
        void proceed_invalid_range() {
            Recruit recruit = makeRecruit(9L);
            Escort escort = makeEscort(3L, EscortStatus.PREPARING, recruit);
            when(escortJpaRepository.findById(3L)).thenReturn(Optional.of(escort));
            assertThatThrownBy(() -> escortService.proceedEscort(3L))
                    .isInstanceOf(EscortInvalidProceedException.class);
        }
    }

    @Nested
    @DisplayName("updateMemo")
    class UpdateMemo {

        @Test
        @DisplayName("메모 정상 업데이트")
        void updateMemo_ok() {
            Recruit recruit = makeRecruit(1L);
            Escort escort = makeEscort(10L, EscortStatus.IN_TREATMENT, recruit);
            when(escortJpaRepository.findById(10L)).thenReturn(Optional.of(escort));

            EscortMemoUpdateRequest req = new EscortMemoUpdateRequest();
            req.setMemo("환자 간단 간식 요청");

            escortService.updateMemo(10L, req);

            assertThat(escort.getMemo()).isEqualTo("환자 간단 간식 요청");
        }

        @Test
        @DisplayName("없는 Escort ID면 EscortNotFoundException")
        void updateMemo_notFound() {
            when(escortJpaRepository.findById(404L)).thenReturn(Optional.empty());
            EscortMemoUpdateRequest req = new EscortMemoUpdateRequest();
            req.setMemo("메모");
            assertThatThrownBy(() -> escortService.updateMemo(404L, req))
                    .isInstanceOf(EscortNotFoundException.class);
        }
    }
}
