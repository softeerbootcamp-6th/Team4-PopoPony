package com.todoc.server.domain.escort.web.controller;

import com.todoc.server.common.response.Response;
import com.todoc.server.domain.auth.service.SessionAuth;
import com.todoc.server.domain.auth.web.LoginUser;
import com.todoc.server.domain.escort.service.ApplicationFacadeService;
import com.todoc.server.domain.escort.web.dto.response.ApplicationListResponse;
import com.todoc.server.domain.escort.web.dto.response.ApplicationSimpleResponse;
import com.todoc.server.domain.helper.web.dto.response.HelperSimpleResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Tag(name = "applications", description = "지원 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationFacadeService applicationFacadeService;

    @Operation(
            summary = "신청에 대한 지원 목록 조회",
            description = "특정 신청에 대한 지원 목록을 조회합니다.")
    @ApiResponse(
            responseCode = "200",
            description = "지원 목록 조회 성공")
    @GetMapping("/recruits/{recruitId}")
    public Response<ApplicationListResponse> getApplicationListAsRecruit(@PathVariable Long recruitId) {

        return Response.from(applicationFacadeService.getApplicationListByRecruitId(recruitId));
    }

    @Operation(
            summary = "지원 선택",
            description = "특정 신청에 대한 지원들 중 하나를 선택합니다.")
    @ApiResponse(
            responseCode = "200",
            description = "지원 선택 성공")
    @PostMapping("/{applicationId}/select")
    public Response<ApplicationListResponse> selectApplication(@PathVariable Long applicationId) {

        applicationFacadeService.selectApplication(applicationId);

        return Response.from();
    }

    @Operation(
        summary = "동행(일감) 지원하기",
        description = "로그인한 도우미가 동행에 지원합니다. recruitId를 통해 지원할 동행(일감)을 선택합니다.")
    @ApiResponse(
        responseCode = "200",
        description = "동행 지원 성공")
    @PostMapping("/recruits/{recruitId}")
    public Response<Void> applyApplicationToRecruit(@LoginUser SessionAuth auth, @PathVariable Long recruitId) {

        applicationFacadeService.applyApplicationToRecruit(recruitId, auth.id());

        return Response.from();
    }

    @Operation(
        summary = "동행(일감) 취소하기",
        description = "로그인한 도우미가 동행(일감)을 취소합니다. recruitId를 통해 취소할 동행(일감)을 선택합니다.")
    @ApiResponse(
        responseCode = "200",
        description = "동행 지원 취소 성공")
    @PatchMapping("/{applicationId}")
    public Response<Void> cancelApplicationToRecruit(@PathVariable Long applicationId) {

         applicationFacadeService.cancelApplicationToRecruit(applicationId);

        return Response.from();
    }
}
