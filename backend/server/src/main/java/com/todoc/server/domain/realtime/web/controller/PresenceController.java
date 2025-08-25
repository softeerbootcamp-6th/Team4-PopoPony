package com.todoc.server.domain.realtime.web.controller;

import com.todoc.server.common.enumeration.Role;
import com.todoc.server.domain.realtime.service.NchanPublisher;
import com.todoc.server.domain.realtime.service.WebSocketFacadeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/realtime/presence")
public class PresenceController {

    private final WebSocketFacadeService webSocketFacadeService; // 상태/위치 조회
    private final NchanPublisher nchanPublisher;   // HTTP POST 퍼블리시(앞서 만든 것: WebClient/HttpClient/RestTemplate 아무거나)

    /**
     * Nchan 채널 구독 시 실행되는 메서드 -> 스냅샷 전송
     */
    @GetMapping("/sub")
    public ResponseEntity<Void> onSubscribe(@RequestHeader("X-Escort-Id") String escortIdHeader) {

        if (escortIdHeader == null || escortIdHeader.isBlank()) {
            return ResponseEntity.status(401).build();
        }

        long escortId;
        try {
            escortId = Long.parseLong(escortIdHeader);
        } catch (NumberFormatException e) {
            return ResponseEntity.status(401).build();
        }

        try {
            // 1. 동행 상태 스냅샷
            nchanPublisher.publish(escortId, webSocketFacadeService.getStatusSnapshot(escortId));

            // 2. 도우미 마지막 위치 스냅샷
            nchanPublisher.publish(escortId, webSocketFacadeService.getLocationSnapshot(escortId, Role.HELPER));

            // 3. 환자 마지막 위치 스냅샷
            nchanPublisher.publish(escortId, webSocketFacadeService.getLocationSnapshot(escortId, Role.PATIENT));

        } catch (Exception e) {
            // TODO : 인증 절차 추가
        }
        return ResponseEntity.ok().build();
    }
}

