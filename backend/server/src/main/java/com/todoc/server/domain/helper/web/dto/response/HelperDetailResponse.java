package com.todoc.server.domain.helper.web.dto.response;

import com.todoc.server.common.enumeration.Gender;
import com.todoc.server.domain.review.web.dto.response.PositiveFeedbackStatResponse;
import com.todoc.server.domain.review.web.dto.response.ReviewSimpleResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Schema(description = "도우미 상세 정보 응답 DTO")
public class HelperDetailResponse {

    @Schema(description = "도우미 ID")
    private Long helperId;

    @Schema(description = "프로필 이미지 URL")
    private String imageUrl;

    @Schema(description = "성명")
    private String name;

    @Schema(description = "성별", allowableValues = {"MALE", "FEMALE"})
    private Gender gender;

    @Schema(description = "나이")
    private Integer age;

    @Schema(description = "한 줄 소개")
    private String shortBio;

    @Schema(description = "연락처")
    private String contact;

    @Schema(description = "총 동행자 수")
    private Long escortCount;

    @Schema(description = "추천해요 비율")
    private Integer goodRate;

    @Schema(description = "괜찮아요 비율")
    private Integer averageRate;

    @Schema(description = "아쉬워요 비율")
    private Integer badRate;

    @Schema(description = "동행 후기 수")
    private Long reviewCount;

    @Schema(description = "자격증 목록")
    private List<String> certificateList;

    @Schema(description = "강점 목록")
    private List<String> strengthList;

    @Schema(description = "후기 키워드 통계 목록")
    private List<PositiveFeedbackStatResponse> positiveFeedbackStatList;

    @Schema(description = "최신 후기 리스트")
    private List<ReviewSimpleResponse> latestReviewList;

    @Builder
    public HelperDetailResponse(Long helperId, String imageUrl, String name, Gender gender, Integer age, String shortBio,
                                String contact, Long escortCount, Integer goodRate, Integer averageRate, Integer badRate,
                                Long reviewCount, List<String> certificateList, List<String> strengthList,
                                List<PositiveFeedbackStatResponse> positiveFeedbackStatList, List<ReviewSimpleResponse> latestReviewList) {
        this.helperId = helperId;
        this.imageUrl = imageUrl;
        this.name = name;
        this.gender = gender;
        this.age = age;
        this.shortBio = shortBio;
        this.contact = contact;
        this.escortCount = escortCount;
        this.goodRate = goodRate;
        this.averageRate = averageRate;
        this.badRate = badRate;
        this.reviewCount = reviewCount;
        this.certificateList = certificateList;
        this.strengthList = strengthList;
        this.positiveFeedbackStatList = positiveFeedbackStatList;
        this.latestReviewList = latestReviewList;
    }
}
