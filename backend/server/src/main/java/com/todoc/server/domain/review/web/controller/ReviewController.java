package com.todoc.server.domain.review.web.controller;

import com.todoc.server.common.response.Response;
import com.todoc.server.domain.auth.service.SessionAuth;
import com.todoc.server.domain.auth.web.LoginUser;
import com.todoc.server.domain.review.service.ReviewFacadeService;
import com.todoc.server.domain.review.service.ReviewService;
import com.todoc.server.domain.review.web.dto.request.ReviewCreateRequest;
import com.todoc.server.domain.review.web.dto.response.ReviewSimpleResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@Tag(name = "reviews", description = "도우미 리뷰 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;
    private final ReviewFacadeService reviewFacadeService;

    @Operation(
            summary = "동행 신청을 담당한 도우미의 리뷰 조회",
            description = "특정 동행 신청을 담당한 도우미의 리뷰를 조회합니다.")
    @ApiResponse(
            responseCode = "200",
            description = "도우미 리뷰 조회 성공")
    @GetMapping("/recruits/{recruitId}")
    public Response<ReviewSimpleResponse> getReviewAsRecruit(@PathVariable Long recruitId) {

        return Response.from(reviewService.getReviewSimpleByRecruitId(recruitId));
    }

    @Operation(
        summary = "동행에 대한 리뷰 등록",
        description = "고객이 도우미의 동행에 대한 리뷰를 작성합니다.")
    @ApiResponse(
        responseCode = "200",
        description = "도우미 리뷰 등록 성공")
    @PostMapping("/recruits/{recruitId}")
    public Response<Void> createReview(@LoginUser SessionAuth auth, @PathVariable Long recruitId, ReviewCreateRequest request) {

        reviewFacadeService.createReview(auth.id(), request);

        return Response.from();
    }
}
