package com.todoc.server.domain.report.web.controller;

import com.todoc.server.common.response.Response;
import com.todoc.server.domain.auth.service.SessionAuth;
import com.todoc.server.domain.auth.web.LoginUser;
import com.todoc.server.domain.report.service.ReportFacadeService;
import com.todoc.server.domain.report.service.ReportService;
import com.todoc.server.domain.report.web.dto.request.ReportCreateRequest;
import com.todoc.server.domain.report.web.dto.response.ReportDetailResponse;
import com.todoc.server.domain.review.service.ReviewFacadeService;
import com.todoc.server.domain.review.web.dto.request.ReviewCreateRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Tag(name = "reports", description = "리포트 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;
    private final ReportFacadeService reportFacadeService;

    @Operation(
            summary = "동행 신청에 대한 리포트 상세 정보 조회",
            description = "특정 동행 신청에 대한 리포트의 상세 정보를 조회합니다.")
    @ApiResponse(
            responseCode = "200",
            description = "리포트 상세 정보 조회 성공")
    @GetMapping("recruits/{recruitId}")
    public Response<ReportDetailResponse> getReportAsRecruit(@PathVariable Long recruitId) {

        return Response.from(reportService.getReportDetailByRecruitId(recruitId));
    }

    @Operation(
            summary = "리포트 등록에 필요한 기본값 조회",
            description = "리포트를 등록에 필요한 기본값을 조회합니다.")
    @ApiResponse(
            responseCode = "200",
            description = "리포트 등록에 필요한 기본값 조회 성공")
    @GetMapping("recruits/{recruitId}/default")
    public Response<ReportDetailResponse> getReportDefaultValueOnRecruit(@PathVariable Long recruitId) {

        return Response.from(reportService.getReportDetailByRecruitId(recruitId));
    }

    @Operation(
            summary = "동행 신청에 대한 리포트 등록",
            description = "특정 동행 신청에 대한 리포트를 등록합니다.")
    @ApiResponse(
            responseCode = "200",
            description = "리포트 등록 성공")
    @PostMapping("recruits/{recruitId}")
    public Response<Void> createReportOnRecruit(@LoginUser SessionAuth auth, @RequestBody ReportCreateRequest request) {

        reportFacadeService.createReport(request, auth.id());

        return Response.from();
    }
}
