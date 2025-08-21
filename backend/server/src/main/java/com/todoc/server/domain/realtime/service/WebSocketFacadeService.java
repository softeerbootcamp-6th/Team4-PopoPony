package com.todoc.server.domain.realtime.service;

import com.todoc.server.common.enumeration.EscortStatus;
import com.todoc.server.common.enumeration.Role;
import com.todoc.server.common.util.JsonUtils;
import com.todoc.server.domain.escort.service.EscortService;
import com.todoc.server.domain.escort.web.dto.response.EscortStatusResponse;
import com.todoc.server.domain.realtime.exception.RealtimeAlreadyMetPatientException;
import com.todoc.server.domain.realtime.exception.RealtimeCustomerLocationException;
import com.todoc.server.domain.realtime.web.dto.request.LocationRequest;
import com.todoc.server.domain.realtime.web.dto.response.Envelope;
import com.todoc.server.domain.realtime.web.dto.response.ErrorResponse;
import com.todoc.server.domain.realtime.web.dto.response.LocationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class WebSocketFacadeService {

    private final WebSocketSessionRegistry sessionRegistry;
    private final EscortService escortService;
    private final LocationService locationService;

    /** 연결 직후 검증·등록·스냅샷 전송 */
    public void onConnect(Long escortId, Role role, WebSocketSession session) throws Exception {

        EscortStatus escortStatus = escortService.getById(escortId).getStatus();

        if (role == Role.PATIENT && escortStatus != EscortStatus.MEETING) {
            throw new RealtimeAlreadyMetPatientException();
        }
        sessionRegistry.register(escortId, role, session);

        // 동행 상태 알림
        sendEnvelope(session, "status", new EscortStatusResponse(escortId, escortStatus.getLabel(), LocalDateTime.now()));

        // 마지막 위치 스냅샷
        if (role != Role.PATIENT && escortStatus == EscortStatus.MEETING) {
            sendSnapshot(session, escortId, Role.PATIENT);
        }
        if (role != Role.HELPER) {
            sendSnapshot(session, escortId, Role.HELPER);
        }
    }

    /** 위치 업데이트에 대한 처리 */
    public void handleLocationUpdate(WebSocketSession session, LocationRequest request) {

        Role role = (Role) session.getAttributes().get("role");
        Long escortId = (Long) session.getAttributes().get("escortId");

        if (role == Role.CUSTOMER) {
            sendError(session, new RealtimeCustomerLocationException());
            return;
        }

        Instant timestamp = Instant.now();
        LocationResponse location = LocationResponse.builder()
                .escortId(escortId)
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .timestamp(timestamp)
                .build();

        // 팬아웃
        Set<Role> recipients = (role == Role.HELPER)
                ? Role.TO_CUSTOMER_AND_PATIENT
                : Role.TO_CUSTOMER_AND_HELPER;

        Envelope envelope = new Envelope(role.getLabel() + "-location", location);
        sessionRegistry.broadcastToRoles(escortId, recipients, envelope);

        // 캐싱
        locationService.register(escortId, role, request, timestamp);
    }

    /** 마지막 위치 스냅샷 전송 */
    private void sendSnapshot(WebSocketSession session, Long escortId, Role targetRole) throws Exception {
        LocationResponse latest = locationService.getLatestLocation(escortId, targetRole);
        sendEnvelope(session, targetRole.getLabel() + "-location", latest);
    }

    /** 전송 헬퍼: 항상 {type, payload} 포맷으로 보냄 */
    public void sendEnvelope(WebSocketSession session, String type, Object payload) {
        if (session == null || !session.isOpen()) return;
        String json = JsonUtils.toJson(new Envelope(type, payload));
        if (json == null) return;
        try {
            session.sendMessage(new TextMessage(json));
        } catch (Exception ignore) {}
    }

    /** 에러 응답 전송 헬퍼 */
    public void sendError(WebSocketSession session, Exception e) {
        sendEnvelope(session, "error", new ErrorResponse(e.getClass().getSimpleName(), e.getMessage()));
    }
}