package com.todoc.server.domain.review.service;

import com.todoc.server.IntegrationTest;
import com.todoc.server.domain.review.entity.Review;
import com.todoc.server.domain.review.exception.PositiveFeedbackInvalidException;
import com.todoc.server.domain.review.repository.PositiveFeedbackChoiceJpaRepository;
import com.todoc.server.domain.review.repository.ReviewJpaRepository;
import com.todoc.server.domain.review.web.dto.request.ReviewCreateRequest;
import com.todoc.server.domain.review.web.dto.response.ReviewDetailResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.assertj.core.api.Assertions.*;

@Sql("/sql/data.sql")
public class ReviewFacadeIntegrationTest extends IntegrationTest {

    @Autowired
    private ReviewFacadeService reviewFacadeService;

    @Autowired
    private ReviewJpaRepository reviewJpaRepository;

    @Autowired
    private PositiveFeedbackChoiceJpaRepository positiveFeedbackChoiceJpaRepository;

    private ReviewCreateRequest req(Long helperId, Long recruitId, String satisfactionLevel, List<String> pfs) {
        ReviewCreateRequest r = new ReviewCreateRequest();
        ReflectionTestUtils.setField(r, "helperId", helperId);
        ReflectionTestUtils.setField(r, "recruitId", recruitId);
        ReflectionTestUtils.setField(r, "positiveFeedbackList", pfs);
        ReflectionTestUtils.setField(r, "satisfactionLevel", satisfactionLevel);
        return r;
    }

    @Nested
    @DisplayName("createReview")
    class CreateReview {

        @Test
        void 리뷰_등록_성공() {
            // given
            Long authId = 1L;
            Long helperId = 2L;
            Long recruitId = 10L;
            String satisfactionLevel = "좋았어요";

            List<String> pick = List.of("친절해요", "리포트가 자세해요");
            ReviewCreateRequest request = req(helperId, recruitId, satisfactionLevel, pick);

            long beforeReviewCount = reviewJpaRepository.count();
            long beforeChoiceCount = positiveFeedbackChoiceJpaRepository.count();

            // when
            assertThatCode(() -> reviewFacadeService.createReview(authId, request))
                .doesNotThrowAnyException();

            // then - JPA 레포지토리로 상태 검증
            assertThat(reviewJpaRepository.count()).isEqualTo(beforeReviewCount + 1);

            Review saved = reviewJpaRepository.findAll(Sort.by(Sort.Direction.DESC, "id")).stream().findFirst().get();
            assertThat(saved).isNotNull();
            assertThat(saved.getCustomer()).isNotNull();
            assertThat(saved.getHelper()).isNotNull();
            assertThat(saved.getRecruit()).isNotNull();
            assertThat(saved.getCustomer().getId()).isEqualTo(authId);
            assertThat(saved.getHelper().getId()).isEqualTo(helperId);
            assertThat(saved.getRecruit().getId()).isEqualTo(recruitId);

            // 선택 피드백 2건 생성 확인
            assertThat(positiveFeedbackChoiceJpaRepository.count())
                .isEqualTo(beforeChoiceCount + 2);

            // 요약 조회도 한 번 더 검증 (실서비스 흐름)
            ReviewDetailResponse detail = reviewFacadeService.getReviewDetailByRecruitId(recruitId);
            assertThat(detail).isNotNull();
        }

        @Test
        void 유효하지_않은_긍정_피드백() {
            // given
            Long authId = 1L;
            Long helperId = 2L;
            Long recruitId = 10L;
            String satisfactionLevel = "좋았어요";

            ReviewCreateRequest request = req(helperId, recruitId, satisfactionLevel, List.of("INVALID_FEEDBACK"));

            // when & then
            assertThatThrownBy(() -> reviewFacadeService.createReview(authId, request))
                .isInstanceOf(PositiveFeedbackInvalidException.class);
        }
    }

    @Nested
    @DisplayName("recruitId로 동행 정보 조회하기")
    class GetReviewDetail {

        @Test
        void 모집글이_없으면_예외_발생() {
            // given
            Long notExistsRecruitId = 99999L;

            // when & then
            assertThatThrownBy(() -> reviewFacadeService.getReviewDetailByRecruitId(notExistsRecruitId))
                .isInstanceOf(com.todoc.server.domain.escort.exception.RecruitNotFoundException.class);
        }

        @Test
        void 정상_동작() {
            // given
            Long recruitId = 1L;

            // when
            ReviewDetailResponse response = reviewFacadeService.getReviewDetailByRecruitId(recruitId);

            // then
            assertThat(response.getReviewId()).isEqualTo(1L);
            assertThat(response.getSatisfactionLevel()).isEqualTo("좋았어요");
        }
    }
}
