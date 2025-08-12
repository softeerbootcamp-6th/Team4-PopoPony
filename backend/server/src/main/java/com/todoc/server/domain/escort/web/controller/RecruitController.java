package com.todoc.server.domain.escort.web.controller;

import com.todoc.server.common.response.Response;
import com.todoc.server.domain.auth.service.SessionAuth;
import com.todoc.server.domain.auth.web.LoginUser;
import com.todoc.server.domain.escort.service.RecruitFacadeService;
import com.todoc.server.domain.escort.service.RecruitService;
import com.todoc.server.domain.escort.web.dto.request.RecruitCreateRequest;
import com.todoc.server.domain.escort.web.dto.response.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Tag(name = "recruits", description = "동행 신청 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/recruits")
public class RecruitController {

    private final RecruitFacadeService recruitFacadeService;
    private final RecruitService recruitService;

    @Operation(
            summary = "고객의 동행 목록 조회",
            description = "로그인한 고객이 신청한 동행 목록(진행중/완료)을 조회합니다.")
    @ApiResponse(
            responseCode = "200",
            description = "동행 목록 조회 성공" )
    @GetMapping("/customer")
    public Response<RecruitListResponse> getRecruitListAsCustomer(@LoginUser SessionAuth auth) {

        RecruitListResponse dto = recruitService.getRecruitListAsCustomerByUserId(auth.id());

        return Response.from(dto);
    }

    @Operation(
            summary = "이전 환자(동행) 정보 목록 불러오기",
            description = "로그인한 고객이 이전에 동행했던 환자(동행) 정보 목록을 조회합니다.")
    @ApiResponse(
            responseCode = "200",
            description = "이전 환자(동행) 정보 목록 조회 성공")
    @GetMapping("/patients")
    public Response<RecruitHistoryListResponse> getRecruitHistoryList(@LoginUser SessionAuth auth) {

        RecruitHistoryListResponse dto = recruitService.getRecruitHistoryListByUserId(auth.id());

        return Response.from(dto);
    }

    @Operation(
            summary = "이전 환자(동행) 기록 불러오기",
            description = "로그인한 고객이 이전에 동행했던 환자(동행)에 대한 기록을 불러옵니다.")
    @ApiResponse(
            responseCode = "200",
            description = "이전 환자(동행)에 대한 기록 조회 성공 ")
    @GetMapping("/{recruitId}/history")
    public Response<RecruitHistoryDetailResponse> getRecruitHistory(@PathVariable Long recruitId) {

        RecruitHistoryDetailResponse dto = recruitService.getRecruitHistoryDetailByRecruitId(recruitId);

        return Response.from(dto);
    }

    @Operation(
            summary = "특정 동행 신청의 상세 정보 조회",
            description = "recruitId에 해당하는 동행 신청의 상세 정보를 조회합니다.")
    @ApiResponse(
            responseCode = "200",
            description = "동행 신청 상세 정보 조회 성공")
    @GetMapping("/{recruitId}")
    public Response<RecruitDetailResponse> getRecruitDetail(@PathVariable Long recruitId) {

        return Response.from(recruitService.getRecruitDetailByRecruitId(recruitId));
    }

    @Operation(
            summary = "특정 동행 신청의 결제 정보 조회",
            description = "recruitId에 해당하는 동행 신청의 결제 정보를 조회합니다.")
    @ApiResponse(
            responseCode = "200",
            description = "동행 신청 결제 정보 조회 성공")
    @GetMapping("/{recruitId}/payments")
    public Response<RecruitPaymentResponse> getRecruitPayment(@PathVariable Long recruitId) {

        return Response.from(recruitService.getRecruitPaymentByRecruitId(recruitId));
    }

    @Operation(
            summary = "고객의 동행 신청",
            description = "로그인한 고객이 동행을 신청합니다.")
    @ApiResponse(
            responseCode = "200",
            description = "동행 신청 성공")
    @PostMapping("")
    public Response<Void> createRecruit(@LoginUser SessionAuth auth, @RequestBody RecruitCreateRequest requestDto) throws IOException {

        recruitFacadeService.createRecruit(auth.id(), requestDto);

        return Response.from();
    }

    @Operation(
            summary = "동행 신청 취소",
            description = "recruitId에 해당하는 동행 신청을 취소합니다.")
    @ApiResponse(
            responseCode = "200",
            description = "동행 신청 취소 성공")
    @PatchMapping("/{recruitId}/cancel")
    public Response<Void> cancelRecruit(@PathVariable Long recruitId) {

        recruitService.cancelRecruit(recruitId);

        return Response.from();
    }

    @Operation(
        summary = "도우미의 동행 목록 조회",
        description = "로그인한 도우미가 신청한 동행 목록(진행중/완료)을 조회합니다.")
    @ApiResponse(
        responseCode = "200",
        description = "동행 목록 조회 성공" )
    @GetMapping("/helper")
    public Response<RecruitListResponse> getRecruitListAsHelper(@LoginUser SessionAuth auth) {

        RecruitListResponse dto = recruitService.getRecruitListAsHelperByUserId(
            auth.id());

        return Response.from(dto);
    }

    @Operation(
        summary = "동행 지원 목록 검색",
        description = "지역 및 날짜에 해당하는 동행 지원 목록을 검색합니다. datetime의 입력 형식 값은 (yyyy-mm-dd)입니다.")
    @ApiResponse(
        responseCode = "200",
        description = "동행 지원 목록 조회 성공")
    @GetMapping("")
    public Response<RecruitSearchListResponse> getRecruitListBySearch(
        @RequestParam(required = false, name = "area") String area,
        @RequestParam(required = false, name = "startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam(required = false, name = "endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate){

        RecruitSearchListResponse dto = recruitService.getRecruitListBySearch(area, startDate, endDate);

        return Response.from(dto);
    }
}
