package com.todoc.server.domain.escort.web.controller;

import com.todoc.server.common.response.Response;
import com.todoc.server.domain.escort.service.EscortService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "escorts", description = "동행 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/escorts")
public class EscortController {

    private final EscortService escortService;

    @Operation(
            summary = "동행 다음 단계로 이동하기",
            description = "로그인한 도우미가 동행(일감)의 다음 단계로 이동합니다. recruitId를 통해 진행할 동행(일감)을 선택합니다.")
    @ApiResponse(
            responseCode = "200",
            description = "동행 진행 성공")
    @PatchMapping("/{recruitId}")
    public Response<Void> proceedEscort(@PathVariable Long recruitId) {

        // escortService.proceedEscort(recruitId);

        return Response.from();
    }
}
