package com.todoc.server.domain.escort.service;

import com.todoc.server.domain.escort.entity.Application;
import com.todoc.server.domain.escort.exception.ApplicationNotFoundException;
import com.todoc.server.domain.escort.repository.ApplicationJpaRepository;
import com.todoc.server.domain.escort.repository.ApplicationQueryRepository;
import com.todoc.server.domain.escort.repository.dto.ApplicationFlatDto;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApplicationServiceTest {

    @Mock
    private ApplicationQueryRepository applicationQueryRepository;
    @Mock
    private ApplicationJpaRepository applicationJpaRepository;

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
                "[\"안전한 부축\"]", "친절한 도우미입니다.", "간병인"
        );

        dto2 = new ApplicationFlatDto(
                100L, 200L, null, 300L, "홍길동",
                LocalDate.of(1990, 1, 1), null, "010-1234-5678",
                "[\"안전한 부축\"]", "친절한 도우미입니다.", "요양보호사"
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
    }

    @Test
    @DisplayName("recruitId로 조회 시 결과가 비어 있으면 빈 Map을 반환")
    void getApplicationListByRecruitId_empty_returnsEmptyMap() {
        // given
        when(applicationQueryRepository.findApplicationWithHelperByRecruitId(recruitId))
                .thenReturn(List.of());

        // when
        Map<Long, List<ApplicationFlatDto>> result = applicationService.getApplicationListByRecruitId(recruitId);

        // then
        assertThat(result).isEmpty();
        verify(applicationQueryRepository, times(1))
                .findApplicationWithHelperByRecruitId(recruitId);
    }

    @Test
    @DisplayName("같은 recruitId에 해당하는 동행 지원 목록 조회")
    void getApplicationsInSameRecruit_returnsList() {
        // given
        Long applicationId = 100L;
        Application app1 = mock(Application.class);
        Application app2 = mock(Application.class);
        when(applicationQueryRepository.findAllApplicationsOfRecruitByApplicationId(applicationId))
                .thenReturn(List.of(app1, app2));

        // when
        List<Application> list = applicationService.getApplicationsInSameRecruit(applicationId);

        // then
        assertThat(list).containsExactly(app1, app2);
    }

    @Nested
    @DisplayName("기존에 매칭 상태였던 동행 지원 조회 - recruitId")
    class MatchedApplication {
        @Test
        void getMatchedApplicationByRecruitId_매칭상태였던_지원이_있으면_반환한다() {
            // given
            Application matched = mock(Application.class);
            when(applicationQueryRepository.findMatchedApplicationByRecruitId(recruitId))
                    .thenReturn(Optional.of(matched));

            // when
            Application result = applicationService.getMatchedApplicationByRecruitId(recruitId);

            // then
            assertThat(result).isSameAs(matched);
            assertThatCode(() -> applicationService.getMatchedApplicationByRecruitId(recruitId)).doesNotThrowAnyException();
        }

        @Test
        @DisplayName("getMatchedApplicationByRecruitId: 매칭된 신청서가 없으면 예외 발생")
        void getMatchedApplicationByRecruitId_매칭상태였던_지원이_없다면_예외_발생() {
            // given
            when(applicationQueryRepository.findMatchedApplicationByRecruitId(recruitId))
                    .thenReturn(Optional.empty());

            // when & then
            Assertions.assertThrows(ApplicationNotFoundException.class, () -> applicationService.getMatchedApplicationByRecruitId(recruitId));
        }
    }

    @Nested
    @DisplayName("신청서 단건 조회 - applicationId")
    class GetApplicationById {

        @Test
        void getApplicationById_존재하면_엔티티를_반환한다() {
            // given
            Long applicationId = 100L;
            Application entity = mock(Application.class);
            when(applicationJpaRepository.findById(applicationId))
                    .thenReturn(Optional.of(entity));

            // when
            Application result = applicationService.getApplicationById(applicationId);

            // then
            assertThat(result).isSameAs(entity);
            assertThatCode(() -> applicationService.getApplicationById(applicationId)).doesNotThrowAnyException();

        }

        @Test
        void getApplicationById_없다면_예외_발생() {
            // given
            Long applicationId = 100L;
            when(applicationJpaRepository.findById(applicationId))
                    .thenReturn(Optional.empty());

            // when & then
            Assertions.assertThrows(ApplicationNotFoundException.class, () -> applicationService.getApplicationById(applicationId));
        }
    }


}
