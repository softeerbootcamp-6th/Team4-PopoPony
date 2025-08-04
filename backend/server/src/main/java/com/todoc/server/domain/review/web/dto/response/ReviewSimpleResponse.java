package com.todoc.server.domain.review.web.dto.response;

import com.todoc.server.common.enumeration.SatisfactionLevel;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Schema(description = "도우미 후기 요약 정보 DTO")
public class ReviewSimpleResponse {

    @Schema(description = "만족도", allowableValues = {"GOOD", "AVERAGE", "BAD"})
    private SatisfactionLevel satisfactionLevel;

    @Schema(description = "작성일")
    private LocalDate createdAt;

    @Column(name = "한 줄 코멘트")
    private String shortComment;

    @Builder
    public ReviewSimpleResponse(SatisfactionLevel satisfactionLevel, LocalDate createdAt, String shortComment) {
        this.satisfactionLevel = satisfactionLevel;
        this.createdAt = createdAt;
        this.shortComment = shortComment;
    }
}
