package com.todoc.server.domain.helper.service;

import com.todoc.server.common.enumeration.Gender;
import com.todoc.server.domain.auth.entity.Auth;
import com.todoc.server.domain.escort.service.EscortService;
import com.todoc.server.domain.helper.entity.Helper;
import com.todoc.server.domain.helper.web.dto.response.HelperDetailResponse;
import com.todoc.server.domain.review.service.PositiveFeedbackChoiceService;
import com.todoc.server.domain.review.service.ReviewService;
import com.todoc.server.domain.review.web.dto.response.ReviewStatResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class HelperFacadeServiceTest {

    @InjectMocks
    private HelperFacadeService helperFacadeService;

    @Mock
    private HelperService helperService;
    @Mock
    private EscortService escortService;
    @Mock
    private ReviewService reviewService;
    @Mock
    private PositiveFeedbackChoiceService positiveFeedbackChoiceService;
    @Mock
    private CertificateService certificateService;

    @Test
    @DisplayName("도우미의 userId에 해당하는 데이터가 존재하는 경우")
    void getHelperDetailByUserId_success() {
        // given
        Long userId = 1L;
        Helper dummyHelper = new Helper();
        Auth dummyAuth = new Auth();
        dummyAuth.setId(1L);
        dummyAuth.setName("김민수");
        dummyAuth.setGender(Gender.MALE);
        dummyAuth.setContact("010-1234-5678");
        dummyAuth.setBirthDate(LocalDate.of(1995, 3, 15));
        dummyHelper.setAuth(dummyAuth);
        dummyHelper.setId(1L);
        dummyHelper.setImageUrl("https://img.jpg");
        dummyHelper.setShortBio("마음을 편하게 해주는 동행을 추구합니다.");

        when(helperService.getHelperByUserId(userId)).thenReturn(dummyHelper);
        when(escortService.getCountByHelperUserId(1L)).thenReturn(2L);
        when(reviewService.getReviewStatByUserId(1L)).thenReturn(new ReviewStatResponse(1L, 89, 11, 0));
        when(positiveFeedbackChoiceService.getPositiveFeedbackStatByHelperUserId(1L)).thenReturn(List.of());
        when(reviewService.getLatestReviewsByHelperUserId(1L)).thenReturn(List.of());
        when(certificateService.getHelperByUserId(1L)).thenReturn(List.of("간호조무사 자격증", "응급처치 교육 수료증"));

        // strengthList는 Json 문자열이므로 미리 설정
        dummyHelper.setStrength("[\"유연한 일정 조율\", \"의사소통 능력 우수\"]");

        // when
        HelperDetailResponse response = helperFacadeService.getHelperDetailByUserId(userId);

        // then
        assertEquals("김민수", response.getName());
        assertEquals(2L, response.getEscortCount());
        assertEquals(List.of("유연한 일정 조율", "의사소통 능력 우수"), response.getStrengthList());
        assertEquals(List.of("간호조무사 자격증", "응급처치 교육 수료증"), response.getCertificateList());
    }

    @Test
    @DisplayName("도우미의 userId에 해당하는 데이터가 존재하지 않는 경우 예외 발생")
    void getHelperDetailByUserId_notFound() {
        // given
        Long invalidUserId = 999L;
        when(helperService.getHelperByUserId(invalidUserId))
                .thenThrow(new IllegalArgumentException("해당 도우미를 찾을 수 없습니다."));

        // when & then
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> helperFacadeService.getHelperDetailByUserId(invalidUserId)
        );

        assertEquals("해당 도우미를 찾을 수 없습니다.", exception.getMessage());
    }
}