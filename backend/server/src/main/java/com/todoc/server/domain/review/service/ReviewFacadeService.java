package com.todoc.server.domain.review.service;

import com.todoc.server.domain.auth.entity.Auth;
import com.todoc.server.domain.auth.service.AuthService;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.escort.exception.RecruitNotFoundException;
import com.todoc.server.domain.escort.service.RecruitService;
import com.todoc.server.domain.review.entity.PositiveFeedback;
import com.todoc.server.domain.review.entity.Review;
import com.todoc.server.domain.review.exception.PositiveFeedbackInternalServerException;
import com.todoc.server.domain.review.exception.PositiveFeedbackInvalidException;
import com.todoc.server.domain.review.exception.ReviewNotFoundException;
import com.todoc.server.domain.review.web.dto.request.ReviewCreateRequest;
import com.todoc.server.domain.review.web.dto.response.ReviewSimpleResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@Transactional
@RequiredArgsConstructor
public class ReviewFacadeService {

    private final ReviewService reviewService;
    private final RecruitService recruitService;
    private final AuthService authService;
    private final PositiveFeedbackService positiveFeedbackService;
    private final PositiveFeedbackChoiceService positiveFeedbackChoiceService;

    public void createReview(ReviewCreateRequest request) {

        // TODO :: 세션 혹은 JWT로부터 고객 정보 가져오기
        Auth customer = null;

        Auth helper = authService.getAuthById(request.getHelperId());

        Recruit recruit = recruitService.getRecruitById(request.getRecruitId());

        // 1. 리뷰 생성
        Review review = reviewService.register(request);

        // 리뷰와 동행 신청 정보 연결
        review.setCustomer(customer);
        review.setHelper(helper);
        review.setRecruit(recruit);

        // 2. Request에서 PositiveFeedback 목록을 가져와서 중간 엔티티인 PositiveFeedbackChoice를 생성
        List<String> positiveFeedbackList = request.getPositiveFeedbackList();
        if (positiveFeedbackList != null && !positiveFeedbackList.isEmpty()) {
            // 모든 PositiveFeedback을 가져옴 (8개 밖에 되지 않으므로)
            List<PositiveFeedback> allPositiveFeedback = positiveFeedbackService.getAll();
            // 8개가 아니면 서버 오류
            if (allPositiveFeedback.size() != 8) {
                throw new PositiveFeedbackInternalServerException();
            }

            for (String feedbackDescription : positiveFeedbackList) {

                // 정상적인 PositiveFeedback인지 확인
                if (PositiveFeedback.isValid(feedbackDescription)) {

                    // 정상적이라면, 일치하는 PositiveFeedback을 찾음
                    PositiveFeedback positiveFeedback = allPositiveFeedback.stream()
                            .filter(pf -> pf.getDescription().equals(feedbackDescription))
                            .findFirst().get();
                    // PositiveFeedbackChoice 생성 및 저장
                    positiveFeedbackChoiceService.register(positiveFeedback, review);
                // 유효하지 않으면 PositiveFeedbackInvalidException 예외를 발생시킴
                } else {
                    throw new PositiveFeedbackInvalidException();
                }
            }
        }
    }

    /**
     * recruitId로 신청한 동행의 리뷰 요약 정보를 조회하는 함수
     *
     * @param recruitId 동행 신청 ID
     * @return ReviewSimpleResponse
     */
    @Transactional(readOnly = true)
    public ReviewSimpleResponse getReviewSimpleByRecruitId(Long recruitId) {

        if (!recruitService.existsById(recruitId)) {
            throw new RecruitNotFoundException();
        }
        return reviewService.getReviewSimpleByRecruitId(recruitId);
    }
}
