package com.todoc.server.domain.review.service;

import com.todoc.server.domain.auth.entity.Auth;
import com.todoc.server.domain.auth.service.AuthService;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.escort.service.RecruitService;
import com.todoc.server.domain.review.entity.PositiveFeedback;
import com.todoc.server.domain.review.entity.Review;
import com.todoc.server.domain.review.exception.PositiveFeedbackInternalServerException;
import com.todoc.server.domain.review.exception.PositiveFeedbackInvalidException;
import com.todoc.server.domain.review.web.dto.request.ReviewCreateRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ReviewFacadeServiceTest {

    @Mock
    private ReviewService reviewService;
    @Mock
    private RecruitService recruitService;
    @Mock
    private AuthService authService;
    @Mock
    private PositiveFeedbackService positiveFeedbackService;
    @Mock
    private PositiveFeedbackChoiceService positiveFeedbackChoiceService;

    @InjectMocks
    private ReviewFacadeService reviewFacadeService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("리뷰 생성하기 정상 동작 - 리뷰 생성 및 긍정 피드백 생성")
    void createReview_success() {
        // given
        ReviewCreateRequest request = mock(ReviewCreateRequest.class);
        Auth customer = mock(Auth.class);
        Auth helper = mock(Auth.class);
        Recruit recruit = mock(Recruit.class);
        Review review = mock(Review.class);

        Long authId = 2L;

        when(request.getHelperId()).thenReturn(1L);
        when(request.getRecruitId()).thenReturn(2L);
        when(request.getPositiveFeedbackList()).thenReturn(Arrays.asList("친절해요", "책임감"));

        when(authService.getAuthById(1L)).thenReturn(helper);
        when(recruitService.getRecruitById(2L)).thenReturn(recruit);
        when(reviewService.register(request)).thenReturn(review);

        List<PositiveFeedback> allFeedback = Arrays.asList(
                mockPositiveFeedback("친절해요"),
                mockPositiveFeedback("책임감"),
                mockPositiveFeedback("소통이 잘돼요"),
                mockPositiveFeedback("능숙해요"),
                mockPositiveFeedback("리포트가 자세해요"),
                mockPositiveFeedback("부축을 잘해요"),
                mockPositiveFeedback("진료 지식이 많아요"),
                mockPositiveFeedback("휠체어도 문제 없어요")
        );
        when(positiveFeedbackService.getAll()).thenReturn(allFeedback);

        try (MockedStatic<PositiveFeedback> pfStatic = mockStatic(PositiveFeedback.class)) {
            pfStatic.when(() -> PositiveFeedback.isValid("친절해요")).thenReturn(true);
            pfStatic.when(() -> PositiveFeedback.isValid("책임감")).thenReturn(true);

            // when
            reviewFacadeService.createReview(authId, request);

            // then
            verify(reviewService).register(request);
            verify(review).setHelper(helper);
            verify(review).setRecruit(recruit);
            verify(positiveFeedbackChoiceService, times(2)).register(any(PositiveFeedback.class), eq(review));
        }
    }

    @Test
    @DisplayName("리뷰 생성 실패 - 긍정 피드백 개수가 8개가 아닐 때")
    void createReview_PositiveFeedbackIsNotEight() {
        // given
        Long authId = 1L;

        ReviewCreateRequest request = mock(ReviewCreateRequest.class);
        when(request.getPositiveFeedbackList()).thenReturn(List.of("친절해요"));
        when(request.getHelperId()).thenReturn(1L);
        when(request.getRecruitId()).thenReturn(2L);

        when(authService.getAuthById(1L)).thenReturn(mock(Auth.class));
        when(recruitService.getRecruitById(2L)).thenReturn(mock(Recruit.class));
        when(reviewService.register(request)).thenReturn(mock(Review.class));
        when(request.getPositiveFeedbackList()).thenReturn(Collections.singletonList("친절해요"));
        when(positiveFeedbackService.getAll()).thenReturn(Collections.singletonList(mockPositiveFeedback("친절해요")));

        // when & then
        assertThrows(PositiveFeedbackInternalServerException.class, () -> {
            reviewFacadeService.createReview(authId, request);
        });
    }

    @Test
    @DisplayName("리뷰 생성 실패 - 긍정 피드백이 잘못된 값일 때")
    void createReview_FeedbackIsInvalid() {
        // given
        Long authId = 1L;

        ReviewCreateRequest request = mock(ReviewCreateRequest.class);
        when(request.getPositiveFeedbackList()).thenReturn(Collections.singletonList("게임을 잘해요"));
        when(request.getHelperId()).thenReturn(1L);
        when(request.getRecruitId()).thenReturn(2L);

        when(authService.getAuthById(1L)).thenReturn(mock(Auth.class));
        when(recruitService.getRecruitById(2L)).thenReturn(mock(Recruit.class));
        when(reviewService.register(request)).thenReturn(mock(Review.class));

        List<PositiveFeedback> allFeedback = Arrays.asList(
                mockPositiveFeedback("친절해요"),
                mockPositiveFeedback("책임감"),
                mockPositiveFeedback("소통이 잘돼요"),
                mockPositiveFeedback("능숙해요"),
                mockPositiveFeedback("리포트가 자세해요"),
                mockPositiveFeedback("부축을 잘해요"),
                mockPositiveFeedback("진료 지식이 많아요"),
                mockPositiveFeedback("휠체어도 문제 없어요")
        );
        when(positiveFeedbackService.getAll()).thenReturn(allFeedback);

        try (MockedStatic<PositiveFeedback> pfStatic = mockStatic(PositiveFeedback.class)) {
            pfStatic.when(() -> PositiveFeedback.isValid("게임을 잘해요")).thenReturn(false);

            // when & then
            assertThrows(PositiveFeedbackInvalidException.class, () -> {
                reviewFacadeService.createReview(authId, request);
            });
        }
    }

    private PositiveFeedback mockPositiveFeedback(String description) {
        PositiveFeedback pf = new PositiveFeedback();
        pf.setDescription(description);
        return pf;
    }
}