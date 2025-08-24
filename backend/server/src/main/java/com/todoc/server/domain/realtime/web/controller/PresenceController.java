package com.todoc.server.domain.realtime.web.controller;

import com.todoc.server.common.enumeration.Role;
import com.todoc.server.domain.realtime.service.NchanPublisher;
import com.todoc.server.domain.realtime.service.WebSocketFacadeService;
import com.todoc.server.domain.realtime.web.dto.response.Envelope;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/realtime/presence")
public class PresenceController {

    private final WebSocketFacadeService webSocketFacadeService; // 상태/위치 조회
    private final NchanPublisher nchanPublisher;

    /**
     * Nchan 채널 구독 시 실행되는 메서드 -> 스냅샷 전송
     */
    @GetMapping("/sub")
    public ResponseEntity<Void> onSubscribe(@RequestHeader("X-Escort-Id") String escortIdHeader) {

        if (escortIdHeader == null || escortIdHeader.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        long escortId;
        try {
            escortId = Long.parseLong(escortIdHeader);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build();
        }

        try {
            Envelope status = webSocketFacadeService.getStatusSnapshot(escortId);
            Envelope helperLocation = webSocketFacadeService.getLocationSnapshot(escortId, Role.HELPER);
            Envelope patientLocation = webSocketFacadeService.getLocationSnapshot(escortId, Role.PATIENT);

            // 비동기 퍼블리시
            if (status != null) nchanPublisher.publishAsync(escortId, status);
            if (helperLocation != null) nchanPublisher.publishAsync(escortId, helperLocation);
            if (patientLocation != null) nchanPublisher.publishAsync(escortId, patientLocation);

        } catch (Exception e) {}

        return ResponseEntity.noContent().build();
    }
}

