package com.todoc.server.domain.realtime.web.controller;

import com.todoc.server.common.response.EmptyBody;
import com.todoc.server.common.response.Response;
import com.todoc.server.domain.realtime.service.RealtimeFacadeService;
import com.todoc.server.domain.realtime.web.dto.request.LocationRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Tag(name = "realtime", description = "실시간 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/realtime")
public class RealtimeController {

    private final RealtimeFacadeService realtimeFacadeService;

    // 고객이 동행에 대한 SSE 구독
    @Operation(
            summary = "동행에 대한 SSE 구독",
            description = "고객이 특정 동행에 대한 SSE를 조회합니다.")
    @ApiResponse(
            responseCode = "200",
            description = "동행에 대한 SSE 구독")
    @GetMapping(value = "/escorts/{escortId}/customers/sse", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(@PathVariable Long escortId) {

        return realtimeFacadeService.registerEmitter(escortId);
    }

    @Operation(
            summary = "마지막 위치 업데이트",
            description = "도우미가 자신의 마지막 위치를 갱신합니다.")
    @ApiResponse(
            responseCode = "200",
            description = "마지막 위치 업데이트 성공")
    @PostMapping("/escorts/{escortId}/helpers/locations")
    public Response<EmptyBody> updateLocation(@PathVariable(name = "escortId") Long escortId, @RequestBody LocationRequest request) {

        realtimeFacadeService.updateLocation(escortId, request);
        return Response.from();
    }
}
