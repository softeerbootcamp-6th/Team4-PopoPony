package com.todoc.server.domain.escort.service;

import com.querydsl.core.Tuple;
import com.todoc.server.common.enumeration.ApplicationStatus;
import com.todoc.server.common.enumeration.RecruitStatus;
import com.todoc.server.domain.auth.entity.Auth;
import com.todoc.server.domain.auth.service.AuthService;
import com.todoc.server.domain.escort.entity.Application;
import com.todoc.server.domain.escort.entity.Escort;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.escort.exception.ApplicationInvalidSelectException;
import com.todoc.server.domain.escort.exception.ApplicationNotFoundException;
import com.todoc.server.domain.escort.exception.RecruitInvalidException;
import com.todoc.server.domain.escort.web.dto.response.ApplicationListResponse;
import com.todoc.server.domain.escort.web.dto.response.ApplicationSimpleResponse;
import com.todoc.server.domain.helper.service.HelperService;
import com.todoc.server.domain.helper.web.dto.response.HelperSimpleResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
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

    private List<Tuple> mockTuples;
    private HelperSimpleResponse mockHelperResponse;

    @BeforeEach
    void setUp() {
        recruitId = 1L;
        applicationId = 100L;

        // mockTuples는 실제 Tuple 대신 mock 객체 사용
        Tuple mockTuple = mock(Tuple.class);
        mockTuples = List.of(mockTuple);

        mockHelperResponse = HelperSimpleResponse.builder()
                .name("헬퍼 이름")
                .age(30)
                .gender(null)
                .certificateList(List.of("자격증1"))
                .strengthList(List.of("강점"))
                .shortBio("소개글")
                .imageUrl("img.jpg")
                .contact("010-1234-5678")
                .helperProfileId(999L)
                .build();
    }

    @Test
    @DisplayName("튜플로 ApplicationListResponse 조립하기")
    void getApplicationListByRecruitId() {
        // given
        when(applicationService.getApplicationListByRecruitId(recruitId))
                .thenReturn(Map.of(applicationId, mockTuples));

        when(helperService.buildHelperSimpleByHelperProfileId(mockTuples))
                .thenReturn(mockHelperResponse);

        // when
        ApplicationListResponse response = applicationFacadeService.getApplicationListByRecruitId(recruitId);

        // then
        assertThat(response).isNotNull();
        assertThat(response.getApplicationList()).hasSize(1);

        ApplicationSimpleResponse item = response.getApplicationList().get(0);
        assertThat(item.getApplicationId()).isEqualTo(applicationId);
        assertThat(item.getHelper()).isEqualTo(mockHelperResponse);

        verify(applicationService).getApplicationListByRecruitId(recruitId);
        verify(helperService).buildHelperSimpleByHelperProfileId(mockTuples);
    }

    @Test
    void selectApplication_정상적으로_매칭된다() {
        // given
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

        // when
        applicationFacadeService.selectApplication(selectedApplicationId);

        // then
        assertThat(selected.getStatus()).isEqualTo(ApplicationStatus.MATCHED);
        assertThat(other.getStatus()).isEqualTo(ApplicationStatus.FAILED);
        assertThat(recruit.getStatus()).isEqualTo(RecruitStatus.COMPLETED);
        verify(escortService, times(1)).save(any(Escort.class));
    }

    @Test
    void selectApplication_대기중_아닌_상태가_있으면_예외() {
        // given
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

        // when & then
        assertThrows(ApplicationInvalidSelectException.class, () -> {
            applicationFacadeService.selectApplication(selectedApplicationId);
        });
    }

    @Test
    void selectApplication_지원이_없으면_예외() {
        // given
        Long selectedApplicationId = 1L;
        when(applicationService.getApplicationsInSameRecruit(selectedApplicationId)).thenReturn(List.of());

        // when & then
        assertThrows(ApplicationNotFoundException.class, () -> {
            applicationFacadeService.selectApplication(selectedApplicationId);
        });
    }

    @Test
    @DisplayName("지원 신청 - MATCHING이 아니면 RecruitInvalidException")
    void applyApplicationToRecruit_throw_ifNotMatching() {
        // given
        Long recruitId = 10L;
        Long helperUserId = 7L;

        Recruit recruit = Recruit.builder()
            .id(recruitId)
            .status(RecruitStatus.IN_PROGRESS) // MATCHING 아님
            .build();

        Auth auth = Auth.builder()
            .id(helperUserId)
            .build();

        given(recruitService.getRecruitById(recruitId)).willReturn(recruit);
        given(authService.getAuthById(helperUserId)).willReturn(auth);

        // when & then
        assertThrows(RecruitInvalidException.class, () -> {
            applicationFacadeService.applyApplicationToRecruit(recruitId, helperUserId);
        });
    }

    @Test
    @DisplayName("지원 취소 - deletedAt이 설정된다")
    void cancelApplicationToRecruit_success_setsDeletedAt() {
        // given
        Long applicationId = 99L;

        Application application = Application.builder()
            .id(applicationId)
            .build();

        given(applicationService.getApplicationById(applicationId)).willReturn(application);

        // when
        applicationFacadeService.cancelApplicationToRecruit(applicationId);

        // then
        assertThat(application.getDeletedAt()).isNotNull();
    }
}