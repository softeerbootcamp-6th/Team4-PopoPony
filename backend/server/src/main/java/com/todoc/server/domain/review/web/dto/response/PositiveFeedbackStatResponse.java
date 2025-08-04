package com.todoc.server.domain.review.web.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Schema(description = "도우미 후기 좋았던점 통계 DTO")
public class PositiveFeedbackStatResponse {

    @Schema(description = "좋았던점 키워드", example = "친절해요")
    private String description;

    @Schema(description = "해당 키워드의 개수", example = "12")
    private Long count;

    @Builder
    public PositiveFeedbackStatResponse(String description, Long count) {
        this.description = description;
        this.count = count;
    }
}
