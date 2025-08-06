package com.todoc.server.domain.review.web.controller;

import com.todoc.server.common.enumeration.SatisfactionLevel;
import com.todoc.server.common.response.Response;
import com.todoc.server.domain.review.service.ReviewService;
import com.todoc.server.domain.review.web.dto.response.ReviewSimpleResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Tag(name = "reviews", description = "도우미 리뷰 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    @Operation(
            summary = "동행 신청을 담당한 도우미의 리뷰 조회",
            description = "특정 동행 신청을 담당한 도우미의 리뷰를 조회합니다.")
    @ApiResponse(
            responseCode = "200",
            description = "도우미 리뷰 조회 성공")
    @GetMapping("/recruits/{recruitId}")
    public Response<ReviewSimpleResponse> getReviewAsRecruit(@PathVariable Long recruitId) {
        // TODO :: 신청 ID를 받아, 해당 신청을 담당한 도우미의 리뷰를 검색

//        return Response.from(reviewService.getReviewSimpleByRecruitId(recruitId));

        ReviewSimpleResponse mock = ReviewSimpleResponse.builder()
                .satisfactionLevel(SatisfactionLevel.GOOD)
                .createdAt(LocalDateTime.now().minusDays(30))
                .shortComment("약간 아쉽지만 좋았어요! 또 이용하고 싶습니다!")
                .build();

        return Response.from(mock);
    }
}
