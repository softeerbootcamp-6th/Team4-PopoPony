package com.todoc.server.domain.review.web.dto.request;

import com.todoc.server.common.enumeration.SatisfactionLevel;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class ReviewCreateRequest {

    @NotNull
    @Schema(description = "도우미 ID")
    private Long helperId;

    @NotNull
    @Schema(description = "만족도", allowableValues = {"GOOD", "AVERAGE", "BAD"})
    private SatisfactionLevel satisfactionLevel;

    @Schema(description = "만족도에 대한 코멘트 (괜찮아요/아쉬워요 인 경우에 해당")
    private String satisfactionComment;

    @Schema(description = "유저가 작성하는 '도우미의 좋은 점'", example = "['친절해요', '책임감']")
    private List<String> positiveFeedbackList;

    @Schema(description = "한줄 코멘트")
    private String shortComment;
}
