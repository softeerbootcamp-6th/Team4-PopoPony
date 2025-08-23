package com.todoc.server.domain.realtime.web.controller;

import com.todoc.server.common.enumeration.Role;
import com.todoc.server.domain.realtime.service.NchanPublisher;
import com.todoc.server.domain.realtime.service.WebSocketFacadeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/realtime/presence")
public class PresenceController {

    private final WebSocketFacadeService webSocketFacadeService; // 상태/위치 조회
    private final NchanPublisher nchanPublisher;   // HTTP POST 퍼블리시(앞서 만든 것: WebClient/HttpClient/RestTemplate 아무거나)

    @PostMapping("/sub")
    public ResponseEntity<Void> onSubscribe(@RequestHeader("X-Escort-Id") long escortId) {
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

