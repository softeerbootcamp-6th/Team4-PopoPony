package com.todoc.server.domain.helper.service;

import com.todoc.server.common.enumeration.SatisfactionLevel;
import com.todoc.server.domain.escort.service.EscortService;
import com.todoc.server.domain.helper.web.dto.response.HelperDetailResponse;
import com.todoc.server.domain.helper.web.dto.response.HelperSimpleResponse;
import com.todoc.server.domain.review.service.PositiveFeedbackChoiceService;
import com.todoc.server.domain.review.service.ReviewService;
import com.todoc.server.domain.review.web.dto.response.PositiveFeedbackStatResponse;
import com.todoc.server.domain.review.web.dto.response.ReviewSimpleResponse;
import com.todoc.server.domain.review.web.dto.response.ReviewStatResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;

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

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getHelperDetailByUserId_정상조회() {
        // given
        Long userId = 1L;

        HelperSimpleResponse helperSimple = HelperSimpleResponse.builder()
                .authId(userId)
                .helperProfileId(10L)
                .name("홍길동")
                .age(30)
                .gender(null)
                .shortBio("따뜻한 도우미")
                .contact("010-0000-0000")
                .strengthList(List.of("친절함"))
                .certificateList(List.of("자격증1"))
                .imageUrl("https://example.com/profile.jpg")
                .build();

        ReviewStatResponse reviewStat = new ReviewStatResponse(13L, 89, 11, 0);
        List<PositiveFeedbackStatResponse> feedbackStats = List.of(
                new PositiveFeedbackStatResponse("친절함", 3L),
                new PositiveFeedbackStatResponse("시간엄수", 2L)
        );
        List<ReviewSimpleResponse> latestReviews = List.of(
                new ReviewSimpleResponse(1L, "좋았어요", "좋았습니다!!!", LocalDateTime.now().minusDays(30)),
                new ReviewSimpleResponse(2L, "괜찮아요", "무난하네요....", LocalDateTime.now().minusDays(15))
        );

        given(helperService.getHelperSimpleByHelperProfileId(userId)).willReturn(helperSimple);
        given(escortService.getCountByHelperUserId(userId)).willReturn(3L);
        given(reviewService.getReviewStatByUserId(userId)).willReturn(reviewStat);
        given(positiveFeedbackChoiceService.getPositiveFeedbackStatByHelperUserId(userId)).willReturn(feedbackStats);
        given(reviewService.getLatestReviewsByHelperUserId(userId)).willReturn(latestReviews);

        // when
        HelperDetailResponse result = helperFacadeService.getHelperDetailByUserId(userId);

        // then
        assertThat(result.getHelperSimple()).isEqualTo(helperSimple);
        assertThat(result.getEscortCount()).isEqualTo(3L);
        assertThat(result.getReviewStat()).isEqualTo(reviewStat);
        assertThat(result.getPositiveFeedbackStatList()).hasSize(2);
        assertThat(result.getLatestReviewList()).hasSize(2);
    }
}