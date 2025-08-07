package com.todoc.server.domain.helper.web.controller;

import com.todoc.server.common.enumeration.Gender;
import com.todoc.server.common.enumeration.SatisfactionLevel;
import com.todoc.server.common.response.Response;
import com.todoc.server.domain.helper.service.HelperFacadeService;
import com.todoc.server.domain.helper.web.dto.response.HelperDetailResponse;
import com.todoc.server.domain.helper.web.dto.response.HelperSimpleResponse;
import com.todoc.server.domain.review.web.dto.response.PositiveFeedbackStatResponse;
import com.todoc.server.domain.review.web.dto.response.ReviewSimpleResponse;
import com.todoc.server.domain.review.web.dto.response.ReviewStatResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Tag(name = "helpers", description = "도우미 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/helpers")
public class HelperController {

    private final HelperFacadeService helperFacadeService;

    @Operation(
            summary = "도우미 상세 조회",
            description = "helperProfileId에 해당하는 도우미의 상세 정보를 조회합니다.")
    @ApiResponse(
            responseCode = "200",
            description = "도우미 상세 정보 조회 성공")
    @GetMapping("/{helperProfileId}")
    public Response<HelperDetailResponse> getHelperDetail(@PathVariable Long helperProfileId) {
        // TODO :: 도우미의 helperProfileId를 받아, 해당 도우미의 상세 정보를 생성

//        return Response.from(helperFacadeService.getHelperDetailByHelperProfileId(helperProfileId));

        List<PositiveFeedbackStatResponse> positiveFeedbackList = new ArrayList<>();
        positiveFeedbackList.add(new PositiveFeedbackStatResponse("친절해요", 3L));
        positiveFeedbackList.add(new PositiveFeedbackStatResponse("책임감", 5L));
        positiveFeedbackList.add(new PositiveFeedbackStatResponse("소통이 잘돼요", 1L));

        ReviewSimpleResponse review = ReviewSimpleResponse.builder()
                .reviewId(1L)
                .satisfactionLevel("좋았어요")
                .createdAt(LocalDateTime.now().minusDays(30))
                .shortComment("너무 잘해주시고 부모님을 집에 무사히 모셔주셔서...")
                .build();

        List<ReviewSimpleResponse> reviewList = new ArrayList<>();
        reviewList.add(review);
        reviewList.add(review);
        reviewList.add(review);
        reviewList.add(review);
        reviewList.add(review);

        ReviewStatResponse reviewStat = ReviewStatResponse.builder()
                .reviewCount(13L)
                .goodRate(89)
                .averageRate(11)
                .badRate(0)
                .build();

        HelperSimpleResponse helperSimple = HelperSimpleResponse.builder()
                .helperProfileId(1L)
                .imageUrl("https://example.com/images/sample.jpg")
                .name("최솔희")
                .age(39)
                .gender("여자")
                .contact("010-1234-5678")
                .shortBio("부모님처럼 모시겠습니다.")
                .certificateList(new ArrayList<>(List.of("간호사", "간호조무사", "요양보호사")))
                .strengthList(new ArrayList<>(List.of("안전한 부축", "휠체어 이동", "인지장애 케어")))
                .build();

        HelperDetailResponse mock = HelperDetailResponse.builder()
                .helperSimple(helperSimple)
                .escortCount(20L)
                .reviewStat(reviewStat)
                .positiveFeedbackStatList(positiveFeedbackList)
                .latestReviewList(reviewList)
                .build();

        return Response.from(mock);
    }
}
