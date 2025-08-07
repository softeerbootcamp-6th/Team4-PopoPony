package com.todoc.server.domain.escort.service;

import com.querydsl.core.Tuple;
import com.todoc.server.domain.escort.repository.ApplicationQueryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;

import static com.todoc.server.domain.escort.entity.QApplication.application;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApplicationServiceTest {

    @Mock
    private ApplicationQueryRepository applicationQueryRepository;

    @InjectMocks
    private ApplicationService applicationService;

    @Mock
    private Tuple tuple1;

    @Mock
    private Tuple tuple2;

    private final Long recruitId = 1L;

    @BeforeEach
    void setUp() {
        when(tuple1.get(application.id)).thenReturn(100L);
        when(tuple2.get(application.id)).thenReturn(100L);
    }

    @Test
    @DisplayName("recruitId로 조회 시 튜플을 applicationId 기준으로 그룹핑")
    void getApplicationListByRecruitId() {
        // given
        List<Tuple> mockTuples = List.of(tuple1, tuple2);
        when(applicationQueryRepository.findApplicationWithHelperByRecruitId(recruitId))
                .thenReturn(mockTuples);

        // when
        Map<Long, List<Tuple>> result = applicationService.getApplicationListByRecruitId(recruitId);

        // then
        assertThat(result).hasSize(1);
        assertThat(result.containsKey(100L)).isTrue();
        assertThat(result.get(100L)).containsExactlyInAnyOrder(tuple1, tuple2);

        verify(applicationQueryRepository).findApplicationWithHelperByRecruitId(recruitId);
    }
}