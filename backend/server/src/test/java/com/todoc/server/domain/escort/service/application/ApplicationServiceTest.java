package com.todoc.server.domain.escort.service.application;

import com.todoc.server.domain.escort.entity.Application;
import com.todoc.server.domain.escort.exception.ApplicationNotFoundException;
import com.todoc.server.domain.escort.repository.ApplicationJpaRepository;
import com.todoc.server.domain.escort.repository.ApplicationQueryRepository;
import com.todoc.server.domain.escort.repository.dto.ApplicationFlatDto;
import com.todoc.server.domain.escort.service.ApplicationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

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

    @Nested
    @DisplayName("getApplicationListByRecruitId")
    class GetApplicationListByRecruitId {

        @Test
        void getApplicationListByRecruitId_정상() {
            // given
            when(applicationQueryRepository.findApplicationWithHelperByRecruitId(recruitId))
                .thenReturn(List.of(dto1, dto2));

            // when
            Map<Long, List<ApplicationFlatDto>> result =
                applicationService.getApplicationListByRecruitId(recruitId);

            // then
            assertThat(result).hasSize(1);
            assertThat(result).containsKey(100L);
            assertThat(result.get(100L)).containsExactlyInAnyOrder(dto1, dto2);
        }

        @Test
        void getApplicationListByRecruitId_비어있으면_빈맵반환() {
            // given
            when(applicationQueryRepository.findApplicationWithHelperByRecruitId(recruitId))
                .thenReturn(List.of());

            // when
            Map<Long, List<ApplicationFlatDto>> result =
                applicationService.getApplicationListByRecruitId(recruitId);

            // then
            assertThat(result).isEmpty();
        }
    }

    @Nested
    @DisplayName("getApplicationsInSameRecruit")
    class GetApplicationsInSameRecruit {

        @Test
        void getApplicationsInSameRecruit_정상조회() {
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
    }

    @Nested
    @DisplayName("getMatchedApplicationByRecruitId")
    class GetMatchedApplicationByRecruitId {

        @Test
        void getMatchedApplicationByRecruitId_매칭상태있으면_반환한다() {
            // given
            Application matched = mock(Application.class);
            when(applicationQueryRepository.findMatchedApplicationByRecruitId(recruitId))
                .thenReturn(Optional.of(matched));

            // when
            Application result = applicationService.getMatchedApplicationByRecruitId(recruitId);

            // then
            assertThat(result).isSameAs(matched);
        }

        @Test
        void getMatchedApplicationByRecruitId_매칭상태없으면_예외() {
            // given
            when(applicationQueryRepository.findMatchedApplicationByRecruitId(recruitId))
                .thenReturn(Optional.empty());

            // when // then
            assertThatThrownBy(() ->
                applicationService.getMatchedApplicationByRecruitId(recruitId)
            ).isInstanceOf(ApplicationNotFoundException.class);
        }
    }

    @Nested
    @DisplayName("getApplicationById")
    class GetApplicationById {

        @Test
        void getApplicationById_존재하면_엔티티반환() {
            // given
            Long applicationId = 100L;
            Application entity = mock(Application.class);
            when(applicationJpaRepository.findById(applicationId))
                .thenReturn(Optional.of(entity));

            // when
            Application result = applicationService.getApplicationById(applicationId);

            // then
            assertThat(result).isSameAs(entity);
        }

        @Test
        void getApplicationById_없으면_예외() {
            // given
            Long applicationId = 100L;
            when(applicationJpaRepository.findById(applicationId))
                .thenReturn(Optional.empty());

            // when // then
            assertThatThrownBy(() ->
                applicationService.getApplicationById(applicationId)
            ).isInstanceOf(ApplicationNotFoundException.class);
        }
    }
}
