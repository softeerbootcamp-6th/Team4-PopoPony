package com.todoc.server.domain.review.service;

import com.querydsl.core.Tuple;
import com.todoc.server.common.enumeration.SatisfactionLevel;
import com.todoc.server.domain.review.repository.ReviewQueryRepository;
import com.todoc.server.domain.review.web.dto.response.ReviewStatResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ReviewServiceTest {

    @Mock
    private ReviewQueryRepository reviewQueryRepository;

    @InjectMocks
    private ReviewService reviewService;

    @Mock
    private Tuple tuple1;

    @Mock
    private Tuple tuple2;

    @Test
    @DisplayName("리뷰 통계를 userId 기준으로 반환")
    void getReviewStatByUserId_shouldReturnCorrectResponse() {
        // given
        Long userId = 42L;

        // tuple1: 만족도 GOOD, 개수 5
        when(tuple1.get(0, SatisfactionLevel.class)).thenReturn(SatisfactionLevel.GOOD);
        when(tuple1.get(1, Long.class)).thenReturn(5L);

        // tuple2: 만족도 AVERAGE, 개수 2
        when(tuple2.get(0, SatisfactionLevel.class)).thenReturn(SatisfactionLevel.AVERAGE);
        when(tuple2.get(1, Long.class)).thenReturn(2L);

        List<Tuple> mockTuples = List.of(tuple1, tuple2);
        when(reviewQueryRepository.getReviewStatByHelperUserId(userId)).thenReturn(mockTuples);

        // when
        ReviewStatResponse response = reviewService.getReviewStatByUserId(userId);

        // then
        assertThat(response).isNotNull();
        assertThat(response.getAverageRate()).isEqualTo(29);

        verify(reviewQueryRepository).getReviewStatByHelperUserId(userId);
    }
}