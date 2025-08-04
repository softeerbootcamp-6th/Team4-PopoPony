package com.todoc.server.domain.helper.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.todoc.server.common.util.DateTimeUtils;
import com.todoc.server.common.util.JsonUtils;
import com.todoc.server.domain.auth.entity.Auth;
import com.todoc.server.domain.auth.exception.AuthNotFoundException;
import com.todoc.server.domain.escort.service.EscortService;
import com.todoc.server.domain.helper.entity.Helper;
import com.todoc.server.domain.helper.web.dto.response.HelperDetailResponse;
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
    private final CertificateService certificateService;

    /**
     * userId(authId)에 해당하는 도우미의 상세 정보를 조회하는 함수
     *
     * @param userId (authId)
     * @return 도우미 상세 정보 (HelperDetailResponse)
     */
    @Transactional(readOnly = true)
    public HelperDetailResponse getHelperDetailByUserId(Long userId) {

        // 1. 도우미 조회
        Helper helper = helperService.getHelperByUserId(userId);
        Auth auth = helper.getAuth();
        if (auth == null) {
            throw new AuthNotFoundException();
        }

        // 2. 나이 계산
        int age = 0;
        if (auth.getBirthDate() != null) {
            age = DateTimeUtils.calculateAge(auth.getBirthDate());
        }

        // 3. 동행 횟수 조회 (helper의 userId(authId)로 검색)
        Long escortCount = escortService.getCountByHelperUserId(auth.getId());

        // 4. 리뷰 통계 조회 (helper의 userId(authId)로 검색)
        ReviewStatResponse reviewStat = reviewService.getReviewStatByUserId(auth.getId());

        // 5. 후기 키워드 통계 / 최신 후기
        List<PositiveFeedbackStatResponse> positiveFeedbackStat = positiveFeedbackChoiceService.getPositiveFeedbackStatByHelperUserId(auth.getId());
        List<ReviewSimpleResponse> latestReviews = reviewService.getLatestReviewsByHelperUserId(auth.getId());

        // 6. JSON 문자열 → List<String> 변환 (강점, 자격증)
        List<String> strengthList = JsonUtils.fromJson(helper.getStrength(), new TypeReference<>() {});
        List<String> certificateList = certificateService.getHelperByUserId(helper.getId());

        // 7. 응답 객체 생성
        return HelperDetailResponse.builder()
                .helperId(helper.getId())
                .imageUrl(helper.getImageUrl())
                .name(auth.getName())
                .gender(auth.getGender())
                .age(age)
                .shortBio(helper.getShortBio())
                .contact(auth.getContact())
                .escortCount(escortCount)
                .reviewStat(reviewStat)
                .certificateList(certificateList)
                .strengthList(strengthList)
                .positiveFeedbackStatList(positiveFeedbackStat)
                .latestReviewList(latestReviews)
                .build();
    }
}
