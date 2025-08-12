package com.todoc.server.domain.review.service;

import com.todoc.server.domain.escort.exception.RecruitNotFoundException;
import com.todoc.server.domain.review.entity.PositiveFeedbackChoice;
import com.todoc.server.domain.review.entity.Review;
import com.todoc.server.domain.review.exception.ReviewNotFoundException;
import com.todoc.server.domain.review.web.dto.request.ReviewCreateRequest;
import com.todoc.server.domain.review.web.dto.response.ReviewDetailResponse;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;

@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE) // 실제 DB 사용 시
@Transactional
@ActiveProfiles("test")
@Sql("/sql/data.sql")
public class ReviewIntegrationTest {

    @Autowired
    private ReviewFacadeService reviewFacadeService;

    @Autowired
    private ReviewService reportService;

    @Autowired
    private PositiveFeedbackChoiceService positiveFeedbackChoiceService;

    @PersistenceContext
    private EntityManager em;
    @Autowired
    private ReviewService reviewService;

    @Test
    @DisplayName("리뷰 상세 정보 조회 - 정상")
    void getReviewDetailByRecruitId() {
        // given
        Long recruitId = 1L;

        // when
        ReviewDetailResponse response = reviewFacadeService.getReviewDetailByRecruitId(recruitId);

        // then
        assertThat(response).isNotNull();
        assertThat(response.getShortComment()).isEqualTo("정말 친절하고 따뜻했어요.");
        assertThat(response.getSatisfactionLevel()).isEqualTo("좋았어요");
        assertThat(response.getPositiveFeedbackList()).isEqualTo(List.of("친절해요", "소통이 잘돼요", "능숙해요"));
    }

    @Test
    @DisplayName("리뷰 요약 정보 조회 - 존재하지 않는 동행 신청")
    void getReviewSimpleByRecruitId_존재하지않는지원신청() {
        // given
        Long recruitId = 999L;

        // when & then
        assertThatThrownBy(() -> reviewFacadeService.getReviewDetailByRecruitId(recruitId))
                .isInstanceOf(RecruitNotFoundException.class);
    }

    @Test
    @DisplayName("리뷰 요약 정보 조회 - 존재하지 않는 리뷰")
    void getReviewSimpleByRecruitId_존재하지않는리뷰() {
        // given
        Long recruitId = 7L;

        // when & then
        assertThatThrownBy(() -> reviewFacadeService.getReviewDetailByRecruitId(recruitId))
                .isInstanceOf(ReviewNotFoundException.class);
    }

    @Test
    @DisplayName("리뷰 작성 - 정상")
    void createReview_정상() {

        // given
        Long authId = 1L;
        int beforeCount = reviewService.getAllReviews().size();
        ReviewCreateRequest request = createSampleRequest();

        // when
        reviewFacadeService.createReview(authId, request);

        // then
        List<Review> all = reviewService.getAllReviews();
        int afterCount = all.size();
        assertThat(afterCount - beforeCount).isEqualTo(1);

        Review created = all.getLast();
        assertThat(created.getShortComment()).isEqualTo("너무 감사드립니다!");
        assertThat(created.getSatisfactionLevel().getLabel()).isEqualTo("좋았어요");

        List<PositiveFeedbackChoice> feedbackChoices = positiveFeedbackChoiceService.getAllPositiveFeedbackChoice();
        assertThat(feedbackChoices.size()).isEqualTo(23);
        assertThat(feedbackChoices.getLast().getReview()).isEqualTo(created);
    }

    public static ReviewCreateRequest createSampleRequest() {
        ReviewCreateRequest request = new ReviewCreateRequest(); // 기본 생성자 필요

        ReflectionTestUtils.setField(request, "helperId", 2L);
        ReflectionTestUtils.setField(request, "recruitId", 11L);
        ReflectionTestUtils.setField(request, "satisfactionLevel", "좋았어요");
        ReflectionTestUtils.setField(request, "shortComment", "너무 감사드립니다!");
        ReflectionTestUtils.setField(request, "positiveFeedbackList", List.of("친절해요", "능숙해요"));

        return request;
    }
}
