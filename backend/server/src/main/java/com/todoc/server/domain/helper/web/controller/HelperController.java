package com.todoc.server.domain.helper.web.controller;

import com.todoc.server.common.response.Response;
import com.todoc.server.domain.auth.service.SessionAuth;
import com.todoc.server.domain.auth.web.LoginUser;
import com.todoc.server.domain.helper.service.HelperFacadeService;
import com.todoc.server.domain.helper.web.dto.request.HelperProfileCreateRequest;
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

        return Response.from(helperFacadeService.getHelperDetailByHelperProfileId(helperProfileId));
    }

    @Operation(
            summary = "도우미 프로필 등록",
            description = "도우미의 프로필을 등록합니다.")
    @ApiResponse(
            responseCode = "200",
            description = "도우미 프로필 등록 성공")
    @PostMapping("")
    public Response<Void> createHelperProfile(@LoginUser SessionAuth auth, @RequestBody HelperProfileCreateRequest requestDto) {

        helperFacadeService.createHelperProfile(auth.id(), requestDto);

        return Response.from();
    }

    @Operation(
            summary = "도우미 프로필 등록",
            description = "도우미의 프로필을 등록합니다.")
    @ApiResponse(
            responseCode = "200",
            description = "도우미 프로필 등록 성공")
    @PostMapping("")
    public Response<Void> createHelperProfile(@RequestBody HelperProfileCreateRequest requestDto) {
        // TODO :: jwt 혹은 sessionId로부터 유저 정보를 조회해야 함

        return Response.from();
    }
}
