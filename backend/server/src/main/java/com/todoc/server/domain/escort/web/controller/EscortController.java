package com.todoc.server.domain.escort.web.controller;

import com.todoc.server.common.response.EmptyBody;
import com.todoc.server.common.response.Response;
import com.todoc.server.domain.escort.service.EscortFacadeService;
import com.todoc.server.domain.escort.service.EscortService;
import com.todoc.server.domain.escort.web.dto.request.EscortMemoUpdateRequest;
import com.todoc.server.domain.escort.web.dto.response.EscortDetailResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "escorts", description = "동행 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/escorts")
public class EscortController {

    private final EscortFacadeService escortFacadeService;
    private final EscortService escortService;

    @Operation(
            summary = "동행 다음 단계로 이동하기",
            description = "로그인한 도우미가 동행(일감)의 다음 단계로 이동합니다. escortId를 통해 진행할 동행(일감)을 선택합니다.")
    @ApiResponse(
            responseCode = "200",
            description = "동행 진행 성공")
    @PatchMapping("/{escortId}/status")
    public Response<EmptyBody> proceedEscort(@PathVariable Long escortId) {

        escortService.proceedEscort(escortId);

        return Response.from();
    }

    @Operation(
            summary = "동행 메모 작성하기",
            description = "로그인한 도우미가 동행(일감) 중 메모를 작성합니다. escortId를 통해 메모를 작성할 동행(일감)을 선택합니다.")
    @ApiResponse(
            responseCode = "200",
            description = "동행 메모 작성 성공")
    @PatchMapping("/{escortId}/memo")
    public Response<EmptyBody> updateMemo(@PathVariable Long escortId, @RequestBody EscortMemoUpdateRequest request) {

        escortService.updateMemo(escortId, request);

        return Response.from();
    }

    @Operation(
            summary = "동행 상세 정보 조회하기",
            description = "동행 상세 정보를 조회합니다. recruitId를 통해 조회할 동행(일감)을 선택합니다.")
    @ApiResponse(
            responseCode = "200",
            description = "동행 상세 정보 조회 성공")
    @GetMapping("/recruits/{recruitId}")
    public Response<EscortDetailResponse> getEscortDetailByRecruitId(@PathVariable Long recruitId) {

        return Response.from(escortFacadeService.getEscortDetailByRecruitId(recruitId));
    }
}
