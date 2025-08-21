package com.todoc.server.domain.escort.service;

import com.todoc.server.common.enumeration.ApplicationStatus;
import com.todoc.server.common.enumeration.Gender;
import com.todoc.server.common.enumeration.RecruitStatus;
import com.todoc.server.domain.auth.entity.Auth;
import com.todoc.server.domain.auth.service.AuthService;
import com.todoc.server.domain.escort.entity.Application;
import com.todoc.server.domain.escort.entity.Escort;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.escort.exception.ApplicationInvalidSelectException;
import com.todoc.server.domain.escort.exception.ApplicationNotFoundException;
import com.todoc.server.domain.escort.exception.RecruitInvalidException;
import com.todoc.server.domain.escort.exception.RecruitNotFoundException;
import com.todoc.server.domain.escort.repository.dto.ApplicationFlatDto;
import com.todoc.server.domain.escort.web.dto.response.ApplicationListResponse;
import com.todoc.server.domain.escort.web.dto.response.ApplicationSimpleResponse;
import com.todoc.server.domain.helper.service.HelperService;
import com.todoc.server.domain.helper.web.dto.response.HelperSimpleResponse;
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

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApplicationFacadeServiceTest {

    @Mock
    private ApplicationService applicationService;

    @Mock
    private RecruitService recruitService;

    @Mock
    private HelperService helperService;

    @Mock
    private EscortService escortService;

    @Mock
    private AuthService authService;

    @InjectMocks
    private ApplicationFacadeService applicationFacadeService;

    private Long recruitId;
    private Long applicationId;

    private List<ApplicationFlatDto> mockApplicationDtoList;
    private HelperSimpleResponse mockHelperResponse;

    @BeforeEach
    void setUp() {
        recruitId = 1L;
        applicationId = 100L;

        // DTO 생성
        ApplicationFlatDto mockDto = new ApplicationFlatDto(
                applicationId,     // applicationId
                999L,              // helperProfileId
                null,              // ImageFile (null 대체)
                123L,              // authId
                "헬퍼 이름",         // name
                LocalDate.of(1995, 1, 1), // birthDate
                Gender.MALE,       // gender
                "010-1234-5678",   // contact
                "강점",              // strength
                "소개글",            // shortBio
                "자격증1"            // certificateType
        );

        mockApplicationDtoList = List.of(mockDto);

        mockHelperResponse = HelperSimpleResponse.builder()
                .name("헬퍼 이름")
                .age(30)
                .gender("남자")
                .certificateList(List.of("자격증1"))
                .strengthList(List.of("강점"))
                .shortBio("소개글")
                .imageUrl("img.jpg")
                .contact("010-1234-5678")
                .helperProfileId(999L)
                .build();
    }

    @Nested
    @DisplayName("동행신청에 대한 동행지원 목록 응답하기")
    class GetApplicationListByRecruitId {

        @Test
        @DisplayName("getApplicationListByRecruitId_정상적으로_응답한다")
        void getApplicationListByRecruitId() {
            // given
            when(applicationService.getApplicationListByRecruitId(recruitId))
                    .thenReturn(Map.of(applicationId, mockApplicationDtoList));

            when(helperService.buildHelperSimpleByHelperProfileId(mockApplicationDtoList))
                    .thenReturn(mockHelperResponse);

            // when
            ApplicationListResponse response = applicationFacadeService.getApplicationListByRecruitId(recruitId);

            // then
            assertThat(response).isNotNull();
            assertThat(response.getApplicationList()).hasSize(1);

            ApplicationSimpleResponse item = response.getApplicationList().get(0);
            assertThat(item.getApplicationId()).isEqualTo(applicationId);
            assertThat(item.getHelper()).isEqualTo(mockHelperResponse);
        }

        @Test
        @DisplayName("getApplicationListByRecruitId_동행신청이_존재하지_않으면_예외")
        void throwRecruitNotFound_ifRecruitNotExist() {
            Long recruitId = 999L;
            when(applicationService.getApplicationListByRecruitId(recruitId)).thenReturn(Map.of());
            when(recruitService.existsById(recruitId)).thenReturn(false);

            assertThrows(RecruitNotFoundException.class,
                    () -> applicationFacadeService.getApplicationListByRecruitId(recruitId));
        }

        @Test
        @DisplayName("getApplicationListByRecruitId_동행신청은_있지만_동행지원이_없으면_빈리스트_반환")
        void returnEmpty_ifNoApplicationsButRecruitExist() {
            Long recruitId = 999L;
            when(applicationService.getApplicationListByRecruitId(recruitId)).thenReturn(Map.of());
            when(recruitService.existsById(recruitId)).thenReturn(true);

            ApplicationListResponse response = applicationFacadeService.getApplicationListByRecruitId(recruitId);

            assertThat(response).isNotNull();
            assertThat(response.getApplicationList()).isEmpty();
        }
    }

    @Nested
    @DisplayName("내가 작성한 동행신청에 대해 도우미 선택하기")
    class ProceedSelectApplication {

        @Test
        void selectApplication_정상적으로_매칭된다() {
            Long selectedApplicationId = 1L;
            Recruit recruit = Recruit.builder().id(10L).status(RecruitStatus.MATCHING).build();

            Application selected = Application.builder()
                    .id(1L)
                    .status(ApplicationStatus.PENDING)
                    .recruit(recruit)
                    .helper(new Auth())
                    .build();

            Application other = Application.builder()
                    .id(2L)
                    .status(ApplicationStatus.PENDING)
                    .recruit(recruit)
                    .helper(new Auth())
                    .build();

            List<Application> applications = List.of(selected, other);
            when(applicationService.getApplicationsInSameRecruit(selectedApplicationId)).thenReturn(applications);

            applicationFacadeService.selectApplication(selectedApplicationId);

            assertThat(selected.getStatus()).isEqualTo(ApplicationStatus.MATCHED);
            assertThat(other.getStatus()).isEqualTo(ApplicationStatus.FAILED);
            assertThat(recruit.getStatus()).isEqualTo(RecruitStatus.COMPLETED);
            verify(escortService, times(1)).save(any(Escort.class));
        }

        @Test
        void selectApplication_대기중_아닌_상태가_있으면_예외() {
            Long selectedApplicationId = 1L;
            Recruit recruit = Recruit.builder().id(10L).status(RecruitStatus.MATCHING).build();

            Application selected = Application.builder()
                    .id(1L)
                    .status(ApplicationStatus.MATCHED)  // 이미 매칭됨
                    .recruit(recruit)
                    .helper(new Auth())
                    .build();

            List<Application> applications = List.of(selected);
            when(applicationService.getApplicationsInSameRecruit(selectedApplicationId)).thenReturn(applications);

            assertThrows(ApplicationInvalidSelectException.class, () ->
                    applicationFacadeService.selectApplication(selectedApplicationId)
            );
        }

        @Test
        void selectApplication_지원이_없으면_예외() {
            Long selectedApplicationId = 1L;
            when(applicationService.getApplicationsInSameRecruit(selectedApplicationId)).thenReturn(List.of());

            assertThrows(ApplicationNotFoundException.class, () ->
                    applicationFacadeService.selectApplication(selectedApplicationId)
            );
        }

        @Test
        void selectApplication_신청이_없으면_예외() {
            Long selectedApplicationId = 1L;

            Application selected = Application.builder()
                    .id(selectedApplicationId)
                    .status(ApplicationStatus.PENDING)
                    .recruit(null) // recruit 없음
                    .helper(new Auth())
                    .build();

            List<Application> applications = List.of(selected);
            when(applicationService.getApplicationsInSameRecruit(selectedApplicationId)).thenReturn(applications);

            assertThrows(RecruitNotFoundException.class, () ->
                    applicationFacadeService.selectApplication(selectedApplicationId)
            );
        }
    }

    @Nested
    @DisplayName("동행신청에 대해 지원하기")
    class ProceedApply {

        @Test
        void applyApplicationToRecruit_정상적으로_처리() {
            Long recruitId = 10L;
            Long helperUserId = 7L;

            Recruit recruit = Recruit.builder()
                    .id(recruitId)
                    .status(RecruitStatus.MATCHING) // 정상 케이스
                    .build();

            Auth auth = Auth.builder().id(helperUserId).build();

            given(recruitService.getRecruitById(recruitId)).willReturn(recruit);
            given(authService.getAuthById(helperUserId)).willReturn(auth);

            applicationFacadeService.applyApplicationToRecruit(recruitId, helperUserId);

            verify(applicationService, times(1)).save(any(Application.class));
        }

        @Test
        void applyApplicationToRecruit_동행신청이_매칭상태가_아니면_예외() {
            Long recruitId = 10L;
            Long helperUserId = 7L;

            Recruit recruit = Recruit.builder()
                    .id(recruitId)
                    .status(RecruitStatus.IN_PROGRESS) // MATCHING 아님
                    .build();

            Auth auth = Auth.builder().id(helperUserId).build();

            given(recruitService.getRecruitById(recruitId)).willReturn(recruit);
            given(authService.getAuthById(helperUserId)).willReturn(auth);

            assertThrows(RecruitInvalidException.class, () ->
                    applicationFacadeService.applyApplicationToRecruit(recruitId, helperUserId)
            );
        }
    }

    @Nested
    @DisplayName("동행지원 취소하기")
    class ProceedCancelApplication {
        @Test
        void cancelApplicationToRecruit_정상적으로_처리된다() {
            Long applicationId = 99L;

            Application application = Application.builder()
                    .id(applicationId)
                    .build();

            given(applicationService.getApplicationById(applicationId)).willReturn(application);

            applicationFacadeService.cancelApplicationToRecruit(applicationId);

            assertThat(application.getDeletedAt()).isNotNull();
        }
    }
}