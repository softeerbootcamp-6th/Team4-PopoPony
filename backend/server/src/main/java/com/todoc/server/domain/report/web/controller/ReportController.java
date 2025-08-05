package com.todoc.server.domain.report.web.controller;

import com.todoc.server.common.response.Response;
import com.todoc.server.domain.report.web.dto.response.ReportDetailResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Tag(name = "reports", description = "리포트 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reports")
public class ReportController {

    @Operation(
            summary = "동행 신청에 대한 리포트 상세 정보 조회",
            description = "특정 동행 신청에 대한 리포트의 상세 정보를 조회합니다.")
    @ApiResponse(
            responseCode = "200",
            description = "리포트 상세 정보 조회 성공")
    @GetMapping("recruits/{recruitId}")
    public Response<ReportDetailResponse> getReportAsRecruit(@PathVariable Long recruitId) {
        // TODO :: 신청 ID를 받아, 해당 신청에 대한 리포트를 검색
        // '리포트 작성 중' 상태에 대한 처리 필요
        // 결제 정보까지 포함하여 전달 필요

        ReportDetailResponse mock = ReportDetailResponse.builder()
                .reportId(1L)
                .actualMeetingTime(LocalTime.NOON)
                .actualReturnTime(LocalTime.MIDNIGHT)
                .extraMinutes(30)
                .hasNextAppointment(true)
                .nextAppointmentTime(LocalDateTime.now().plusDays(30))
                .description("오늘 치료 잘 받으셨고, 약은 가방 안에 넣어드렸습니다.")
                .baseFee(30000)
                .taxiFee(50000)
                .extraTimeFee(20000)
                .build();

        return Response.from(mock);
    }
}
