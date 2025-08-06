package com.todoc.server.domain.helper.web.dto.response;

import com.todoc.server.domain.review.web.dto.response.PositiveFeedbackStatResponse;
import com.todoc.server.domain.review.web.dto.response.ReviewSimpleResponse;
import com.todoc.server.domain.review.web.dto.response.ReviewStatResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Schema(description = "도우미 상세 정보 응답 DTO")
public class HelperDetailResponse {

    @Schema(description = "도우미 요약 정보")
    private HelperSimpleResponse helperSimple;

    @Schema(description = "총 동행자 수")
    private Long escortCount;

    @Schema(description = "도우미 리뷰 통계")
    private ReviewStatResponse reviewStat;

    @Schema(description = "후기 키워드 통계 목록")
    private List<PositiveFeedbackStatResponse> positiveFeedbackStatList;

    @Schema(description = "최신 후기 리스트")
    private List<ReviewSimpleResponse> latestReviewList;

    @Builder
    public HelperDetailResponse(HelperSimpleResponse helperSimple, Long escortCount, ReviewStatResponse reviewStat,
                                List<PositiveFeedbackStatResponse> positiveFeedbackStatList, List<ReviewSimpleResponse> latestReviewList) {
        this.helperSimple = helperSimple;
        this.escortCount = escortCount;
        this.reviewStat = reviewStat;
        this.positiveFeedbackStatList = positiveFeedbackStatList;
        this.latestReviewList = latestReviewList;
    }
}
