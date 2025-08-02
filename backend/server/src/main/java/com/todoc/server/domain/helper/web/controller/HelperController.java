package com.todoc.server.domain.helper.web.controller;

import com.todoc.server.common.enumeration.Gender;
import com.todoc.server.common.response.Response;
import com.todoc.server.domain.helper.web.dto.response.HelperListResponse;
import com.todoc.server.domain.helper.web.dto.response.HelperSimpleResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Tag(name = "helpers", description = "도우미 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("api/helpers")
public class HelperController {

    @Operation(
            summary = "신청에 지원한 도우미 목록 조회",
            description = "특정 신청에 지원한 도우미 목록을 조회합니다.")
    @ApiResponse(
            responseCode = "200",
            description = "도우미 목록 조회 성공",
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = Response.class)
            ))
    @GetMapping("/recruits/{recruitId}")
    public Response<HelperListResponse> getHelperListAsRecruit(@PathVariable Long recruitId) {
        // TODO :: 신청 ID를 받아, 해당 신청에 지원한 도우미들을 검색

        HelperSimpleResponse dto = HelperSimpleResponse.builder()
                .helperId(1L)
                .imageUrl("https://example.com/images/sample.jpg")
                .name("최솔희")
                .age(39)
                .gender(Gender.FEMALE)
                .certificateList(new ArrayList<>(List.of("간호사", "간호조무사", "요양보호사")))
                .strengthList(new ArrayList<>(List.of("안전한 부축", "휠체어 이동", "인지장애 케어")))
                .build();

        List<HelperSimpleResponse> list = new ArrayList<>();
        list.add(dto);
        list.add(dto);

        HelperListResponse mock = HelperListResponse.builder()
                .helperList(list).build();

        return Response.from(mock);
    }
}
