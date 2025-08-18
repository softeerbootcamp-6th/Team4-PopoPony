package com.todoc.server.domain.helper.web.controller;

import com.todoc.server.common.response.Response;
import com.todoc.server.domain.auth.service.SessionAuth;
import com.todoc.server.domain.auth.web.LoginUser;
import com.todoc.server.domain.helper.service.HelperFacadeService;
import com.todoc.server.domain.helper.service.HelperService;
import com.todoc.server.domain.helper.web.dto.request.HelperProfileCreateRequest;
import com.todoc.server.domain.helper.web.dto.response.HelperDetailResponse;
import com.todoc.server.domain.helper.web.dto.response.HelperUpdateDefaultResponse;
import com.todoc.server.domain.helper.web.dto.response.HelperProfileExistenceResponse;
import com.todoc.server.domain.helper.web.dto.response.HelperSimpleResponse;
import com.todoc.server.domain.review.web.dto.response.PositiveFeedbackStatResponse;
import com.todoc.server.domain.review.web.dto.response.ReviewSimpleResponse;
import com.todoc.server.domain.review.web.dto.response.ReviewStatResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "helpers", description = "도우미 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/helpers")
public class HelperController {

    private final HelperFacadeService helperFacadeService;
    private final HelperService helperService;

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
            summary = "도우미 프로필 수정 기본값 조회",
            description = "helperProfileId에 해당하는 도우미 프로필에 대한 수정 기본값을 조회합니다.")
    @ApiResponse(
            responseCode = "200",
            description = "도우미 프로필 수정 기본값 조회 성공")
    @GetMapping("/{helperProfileId}/updates")
    public Response<HelperUpdateDefaultResponse> getHelperProfileUpdateDefault(@PathVariable Long helperProfileId) {

        return Response.from(helperService.getHelperUpdateDefaultByHelperProfileId(helperProfileId));
    }

    @Operation(
            summary = "도우미 프로필 수정 ",
            description = "helperProfileId에 해당하는 도우미 프로필을 수정합니다.")
    @ApiResponse(
            responseCode = "200",
            description = "도우미 프로필 수정 성공")
    @PutMapping("/{helperProfileId}/updates")
    public Response<Void> updateHelperProfile(@PathVariable Long helperProfileId, @RequestBody HelperProfileCreateRequest requestDto) {

         helperFacadeService.updateHelperProfile(helperProfileId, requestDto);

         return Response.from();
    }

    @Operation(
        summary = "도우미 프로필 존재 여부 확인",
        description = "도우미가 기존에 등록한 프로필이 있는지 확인합니다.")
    @ApiResponse(
        responseCode = "200",
        description = "도우미 프로필 존재 여부 조회 성공")
    @GetMapping("/existence")
    public Response<HelperProfileExistenceResponse> checkHelperProfileExistence(@LoginUser SessionAuth auth) {

        return Response.from(helperService.checkHelperProfileExistence(auth.id()));
    }
}
