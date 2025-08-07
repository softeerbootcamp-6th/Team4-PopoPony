package com.todoc.server.domain.helper.service;

import com.todoc.server.domain.escort.service.EscortService;
import com.todoc.server.domain.helper.web.dto.response.HelperDetailResponse;
import com.todoc.server.domain.helper.web.dto.response.HelperSimpleResponse;
import com.todoc.server.domain.review.service.PositiveFeedbackChoiceService;
import com.todoc.server.domain.review.service.ReviewService;
import com.todoc.server.domain.review.web.dto.response.PositiveFeedbackStatResponse;
import com.todoc.server.domain.review.web.dto.response.ReviewSimpleResponse;
import com.todoc.server.domain.review.web.dto.response.ReviewStatResponse;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.mockito.Mockito.*;
import static org.assertj.core.api.Assertions.*;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;

@ExtendWith(MockitoExtension.class)
class HelperFacadeServiceTest {

    @Mock
    private HelperService helperService;

    @Mock
    private EscortService escortService;

    @Mock
    private ReviewService reviewService;

    @Mock
    private PositiveFeedbackChoiceService positiveFeedbackChoiceService;

    @InjectMocks
    private HelperFacadeService helperFacadeService;

    @Test
    void getHelperDetailByHelperProfileId_정상작동_검증() {
        // given
        Long helperProfileId = 1L;
        Long authId = 10L;

        when(helperService.getHelperSimpleByHelperProfileId(helperProfileId))
                .thenReturn(HelperSimpleResponse.builder()
                        .helperProfileId(helperProfileId)
                        .name("홍길동")
                        .age(30)
                        .gender("남자")
                        .build());

        when(helperService.getAuthIdByHelperProfileId(helperProfileId))
                .thenReturn(authId);

        when(escortService.getCountByHelperUserId(authId))
                .thenReturn(5L);

        when(reviewService.getReviewStatByUserId(authId))
                .thenReturn(ReviewStatResponse.builder()
                        .reviewCount(7L)
                        .goodRate(71)
                        .averageRate(29)
                        .badRate(0)
                        .build());

        when(positiveFeedbackChoiceService.getPositiveFeedbackStatByHelperUserId(authId))
                .thenReturn(List.of(
                        PositiveFeedbackStatResponse.builder()
                                .description("친절해요")
                                .count(3L)
                                .build()
                ));

        when(reviewService.getLatestReviewsByHelperUserId(authId))
                .thenReturn(List.of(
                        ReviewSimpleResponse.builder()
                                .satisfactionLevel("좋았어요")
                                .shortComment("정말 좋았습니다!!!")
                                .createdAt(LocalDateTime.now().minusDays(1))
                                .build()
                ));

        // when
        HelperDetailResponse response = helperFacadeService.getHelperDetailByHelperProfileId(helperProfileId);

        // then
        assertThat(response).isNotNull();
        assertThat(response.getHelperSimple().getHelperProfileId()).isEqualTo(helperProfileId);
        assertThat(response.getEscortCount()).isEqualTo(5L);
        assertThat(response.getReviewStat().getAverageRate()).isEqualTo(29);
        assertThat(response.getPositiveFeedbackStatList()).hasSize(1);
        assertThat(response.getLatestReviewList()).hasSize(1);
    }
}