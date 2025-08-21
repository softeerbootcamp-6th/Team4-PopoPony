package com.todoc.server.domain.escort.service;

import com.todoc.server.domain.escort.repository.ApplicationQueryRepository;
import com.todoc.server.domain.escort.repository.dto.ApplicationFlatDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApplicationServiceTest {

    @Mock
    private ApplicationQueryRepository applicationQueryRepository;

    @InjectMocks
    private ApplicationService applicationService;

    private final Long recruitId = 1L;

    private ApplicationFlatDto dto1;
    private ApplicationFlatDto dto2;

    @BeforeEach
    void setUp() {
        // 같은 applicationId를 가진 DTO 2개 생성
        dto1 = new ApplicationFlatDto(
                100L, 200L, null, 300L, "홍길동",
                LocalDate.of(1990, 1, 1), null, "010-1234-5678",
                "안전한 부축", "친절한 도우미입니다.", "간병인"
        );

        dto2 = new ApplicationFlatDto(
                100L, 201L, null, 301L, "이몽룡",
                LocalDate.of(1992, 2, 2), null, "010-9999-8888",
                "인지장애 케어", "경험많음", "요양보호사"
        );
    }

    @Test
    @DisplayName("recruitId로 조회 시 ApplicationFlatDto를 applicationId 기준으로 그룹핑")
    void getApplicationListByRecruitId() {
        // given
        when(applicationQueryRepository.findApplicationWithHelperByRecruitId(recruitId))
                .thenReturn(List.of(dto1, dto2));

        // when
        Map<Long, List<ApplicationFlatDto>> result = applicationService.getApplicationListByRecruitId(recruitId);

        // then
        assertThat(result).hasSize(1); // 하나의 applicationId만 존재
        assertThat(result.containsKey(100L)).isTrue();
        assertThat(result.get(100L)).containsExactlyInAnyOrder(dto1, dto2);

        verify(applicationQueryRepository).findApplicationWithHelperByRecruitId(recruitId);
    }
}
