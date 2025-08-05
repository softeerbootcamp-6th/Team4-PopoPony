package com.todoc.server.domain.helper.web.dto.response;

import com.todoc.server.common.enumeration.Gender;
import com.todoc.server.domain.review.web.dto.response.PositiveFeedbackStatResponse;
import com.todoc.server.domain.review.web.dto.response.ReviewSimpleResponse;
import com.todoc.server.domain.review.web.dto.response.ReviewStatResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Schema(description = "도우미 상세 정보 응답 DTO")
public class HelperDetailResponse {

    @NotNull
    @Schema(description = "도우미 ID")
    private Long helperId;

    @NotNull
    @Schema(description = "프로필 이미지 URL")
    private String imageUrl;

    @NotNull
    @Schema(description = "성명")
    private String name;

    @NotNull
    @Schema(description = "성별", allowableValues = {"MALE", "FEMALE"})
    private Gender gender;

    @NotNull
    @Schema(description = "나이")
    private Integer age;

    @Schema(description = "한 줄 소개")
    private String shortBio;

    @NotNull
    @Schema(description = "연락처")
    private String contact;

    @NotNull
    @Schema(description = "총 동행자 수")
    private Long escortCount;

    @NotNull
    @Schema(description = "도우미 리뷰 통계")
    private ReviewStatResponse reviewStat;

    @NotNull
    @Schema(description = "자격증 목록")
    private List<String> certificateList;

    @NotNull
    @Schema(description = "강점 목록")
    private List<String> strengthList;

    @NotNull
    @Schema(description = "후기 키워드 통계 목록")
    private List<PositiveFeedbackStatResponse> positiveFeedbackStatList;

    @NotNull
    @Schema(description = "최신 후기 리스트")
    private List<ReviewSimpleResponse> latestReviewList;

    @Builder
    public HelperDetailResponse(Long helperId, String imageUrl, String name, Gender gender, Integer age, String shortBio,
                                String contact, Long escortCount, ReviewStatResponse reviewStat, List<String> certificateList,
                                List<String> strengthList, List<PositiveFeedbackStatResponse> positiveFeedbackStatList,
                                List<ReviewSimpleResponse> latestReviewList) {
        this.helperId = helperId;
        this.imageUrl = imageUrl;
        this.name = name;
        this.gender = gender;
        this.age = age;
        this.shortBio = shortBio;
        this.contact = contact;
        this.escortCount = escortCount;
        this.reviewStat = reviewStat;
        this.certificateList = certificateList;
        this.strengthList = strengthList;
        this.positiveFeedbackStatList = positiveFeedbackStatList;
        this.latestReviewList = latestReviewList;
    }
}
