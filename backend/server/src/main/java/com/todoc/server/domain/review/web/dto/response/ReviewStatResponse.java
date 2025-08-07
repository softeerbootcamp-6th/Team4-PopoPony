package com.todoc.server.domain.review.web.dto.response;

import com.todoc.server.common.enumeration.SatisfactionLevel;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

import java.util.Map;

@Getter
@Schema(description = "도우미 리뷰 통계 정보 DTO")
public class ReviewStatResponse {

    @NotNull
    @Schema(description = "총 리뷰 개수")
    private final Long reviewCount;

    @NotNull
    @Schema(description = "좋았어요 비율")
    private final int goodRate;

    @NotNull
    @Schema(description = "괜찮아요 비율")
    private final int averageRate;

    @NotNull
    @Schema(description = "아쉬워요 비율")
    private final int badRate;

    @Builder
    public ReviewStatResponse(Long reviewCount, int goodRate, int averageRate, int badRate) {
        this.reviewCount = reviewCount;
        this.goodRate = goodRate;
        this.averageRate = averageRate;
        this.badRate = badRate;
    }

    public static ReviewStatResponse from(Map<SatisfactionLevel, Long> countMap, Long total) {
        return new ReviewStatResponse(
                total,
                getRate(countMap.getOrDefault(SatisfactionLevel.GOOD, 0L), total),
                getRate(countMap.getOrDefault(SatisfactionLevel.AVERAGE, 0L), total),
                getRate(countMap.getOrDefault(SatisfactionLevel.BAD, 0L), total)
        );
    }

    private static int getRate(Long count, Long total) {
        if (total == 0) return 0;
        return (int) Math.round((count * 100.0) / (double) total);
    }
}
