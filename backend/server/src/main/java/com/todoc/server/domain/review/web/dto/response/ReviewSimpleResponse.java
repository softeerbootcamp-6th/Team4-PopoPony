package com.todoc.server.domain.review.web.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.todoc.server.common.enumeration.SatisfactionLevel;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Schema(description = "도우미 후기 요약 정보 DTO")
public class ReviewSimpleResponse {

    @NotNull
    @Schema(description = "리뷰 ID")
    private Long reviewId;

    @NotNull
    @Schema(description = "만족도", allowableValues = {"좋았어요", "괜찮아요", "아쉬워요"})
    private String satisfactionLevel;

    @NotNull
    @Schema(description = "작성일")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;


    @Schema(description = "한 줄 코멘트")
    private String shortComment;

    @Builder
    public ReviewSimpleResponse(Long reviewId, String satisfactionLevel, String shortComment, LocalDateTime createdAt) {
        this.reviewId = reviewId;
        this.satisfactionLevel = satisfactionLevel;
        this.shortComment = shortComment;
        this.createdAt = createdAt;
    }
}
