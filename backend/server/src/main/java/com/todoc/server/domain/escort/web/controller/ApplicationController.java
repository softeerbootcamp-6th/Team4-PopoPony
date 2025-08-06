package com.todoc.server.domain.escort.web.controller;

import com.todoc.server.common.enumeration.Gender;
import com.todoc.server.common.response.Response;
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
        // TODO :: 신청 ID를 받아, 해당 신청에 대한 지원들을 검색

//        return Response.from(applicationFacadeService.getApplicationListByRecruitId(recruitId));

        HelperSimpleResponse helper = HelperSimpleResponse.builder()
                .authId(1L)
                .helperProfileId(1L)
                .imageUrl("https://example.com/images/sample.jpg")
                .name("최솔희")
                .age(39)
                .gender(Gender.FEMALE)
                .shortBio("부모님처럼 모시겠습니다.")
                .contact("010-1234-5678")
                .certificateList(new ArrayList<>(List.of("간호사", "간호조무사", "요양보호사")))
                .strengthList(new ArrayList<>(List.of("안전한 부축", "휠체어 이동", "인지장애 케어")))
                .build();

        ApplicationSimpleResponse application = ApplicationSimpleResponse.builder()
                .applicationId(1L)
                .helper(helper)
                .build();

        List<ApplicationSimpleResponse> list = new ArrayList<>();
        list.add(application);
        list.add(application);

        ApplicationListResponse mock = ApplicationListResponse.builder()
                .applicationList(list).build();

        return Response.from(mock);
    }

    @Operation(
            summary = "지원 선택",
            description = "특정 신청에 대한 지원들 중 하나를 선택합니다.")
    @ApiResponse(
            responseCode = "200",
            description = "지원 선택 성공")
    @PostMapping("/{applicationId}/select")
    public Response<ApplicationListResponse> selectApplication(@PathVariable Long applicationId) {
        // TODO :: 지원 ID를 받아, 지원과 신청의 상태를 바꾸고 동행 생성

        // applicationFacadeService.selectApplication(applicationId);

        return Response.from();
    }
}
