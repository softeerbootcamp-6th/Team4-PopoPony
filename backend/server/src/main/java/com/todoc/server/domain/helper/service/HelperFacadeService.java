package com.todoc.server.domain.helper.service;

import com.todoc.server.domain.escort.service.EscortService;
import com.todoc.server.domain.helper.web.dto.response.HelperDetailResponse;
import com.todoc.server.domain.helper.web.dto.response.HelperSimpleResponse;
import com.todoc.server.domain.review.service.PositiveFeedbackChoiceService;
import com.todoc.server.domain.review.service.ReviewService;
import com.todoc.server.domain.review.web.dto.response.PositiveFeedbackStatResponse;
import com.todoc.server.domain.review.web.dto.response.ReviewSimpleResponse;
import com.todoc.server.domain.review.web.dto.response.ReviewStatResponse;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Transactional
public class HelperFacadeService {

    private final HelperService helperService;
    private final EscortService escortService;
    private final ReviewService reviewService;
    private final PositiveFeedbackChoiceService positiveFeedbackChoiceService;

    /**
     * helperProfileId에 해당하는 도우미의 상세 정보를 조회하는 함수
     *
     * @param helperProfileId 도우미 프로필 ID
     * @return 도우미 상세 정보 (HelperDetailResponse)
     */
    @Transactional(readOnly = true)
    public HelperDetailResponse getHelperDetailByHelperProfileId(Long helperProfileId) {

        // 1. 도우미 조회
        HelperSimpleResponse helperSimple = helperService.getHelperSimpleByHelperProfileId(helperProfileId);
        Long authId = helperService.getAuthIdByHelperProfileId(helperProfileId);

        // 2. 동행 횟수 조회 (helper의 userId(authId)로 검색)
        Long escortCount = escortService.getCountByHelperUserId(authId);

        // 3. 리뷰 통계 조회 (helper의 userId(authId)로 검색)
        ReviewStatResponse reviewStat = reviewService.getReviewStatByUserId(authId);

        // 4. 후기 키워드 통계 / 최신 후기
        List<PositiveFeedbackStatResponse> positiveFeedbackStat = positiveFeedbackChoiceService.getPositiveFeedbackStatByHelperUserId(authId);
        List<ReviewSimpleResponse> latestReviews = reviewService.getLatestReviewsByHelperUserId(authId);

        // 5. 응답 객체 생성
        return HelperDetailResponse.builder()
                .helperSimple(helperSimple)
                .escortCount(escortCount)
                .reviewStat(reviewStat)
                .positiveFeedbackStatList(positiveFeedbackStat)
                .latestReviewList(latestReviews)
                .build();
    }
}
