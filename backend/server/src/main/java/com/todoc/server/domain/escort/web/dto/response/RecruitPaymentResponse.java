package com.todoc.server.domain.escort.web.dto.response;

import com.todoc.server.domain.route.web.dto.response.RouteSimpleResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

@Getter
@Schema(description = "동행 신청 결제 정보 조회 응답 DTO")
public class RecruitPaymentResponse {

    @NotNull
    @Schema(description = "동행 신청 ID")
    private Long recruitId;

    @NotNull
    @Schema(description = "경로 요약 정보")
    private RouteSimpleResponse route;

    @NotNull
    @Schema(description = "기본 결제 금액")
    private Integer baseFee;

    @NotNull
    @Schema(description = "예상 택시 요금")
    private Integer expectedTaxiFee;

    @Builder
    public RecruitPaymentResponse(Long recruitId, RouteSimpleResponse route, Integer baseFee, Integer expectedTaxiFee) {
        this.recruitId = recruitId;
        this.route = route;
        this.baseFee = baseFee;
        this.expectedTaxiFee = expectedTaxiFee;
    }
}
