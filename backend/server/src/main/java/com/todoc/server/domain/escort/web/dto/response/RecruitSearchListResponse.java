package com.todoc.server.domain.escort.web.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import lombok.Builder;
import lombok.Getter;

@Getter
@Schema(description = "동행 목록 검색용 응답 DTO")
public class RecruitSearchListResponse {

    @NotNull
    @Schema(description = "날짜별 모집 중인 동행 목록")
    private final Map<LocalDate, List<RecruitSimpleResponse>> inProgressMap;

    @Builder
    public RecruitSearchListResponse(Map<LocalDate, List<RecruitSimpleResponse>> inProgressMap) {
        this.inProgressMap = inProgressMap;
    }
}