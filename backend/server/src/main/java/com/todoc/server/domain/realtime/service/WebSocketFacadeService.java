package com.todoc.server.domain.realtime.service;

import com.todoc.server.common.enumeration.EscortStatus;
import com.todoc.server.common.enumeration.Role;
import com.todoc.server.common.enumeration.WebSocketMsgType;
import com.todoc.server.common.util.JsonUtils;
import com.todoc.server.domain.escort.service.EscortService;
import com.todoc.server.domain.escort.web.dto.response.EscortStatusResponse;
import com.todoc.server.domain.realtime.exception.RealtimeAlreadyMetPatientException;
import com.todoc.server.domain.realtime.exception.RealtimeCustomerLocationException;
import com.todoc.server.domain.realtime.repository.dto.LocationUpdateResult;
import com.todoc.server.domain.realtime.web.dto.request.LocationUpdateRequest;
import com.todoc.server.domain.realtime.web.dto.response.Envelope;
import com.todoc.server.domain.realtime.web.dto.response.ErrorResponse;
import com.todoc.server.domain.realtime.web.dto.response.LocationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Objects;

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
        sendStatusSnapshot(session, escortId);

        // 마지막 위치 스냅샷
        if (role != Role.PATIENT && escortStatus == EscortStatus.MEETING) {
            sendLocationSnapshot(session, escortId, Role.PATIENT);
        }
        if (role != Role.HELPER) {
            sendLocationSnapshot(session, escortId, Role.HELPER);
        }
    }

    /** 위치 업데이트에 대한 처리 */
    public void handleLocationUpdate(WebSocketSession session, LocationUpdateRequest request) {

        Role role = (Role) session.getAttributes().get("role");

        if (role == Role.CUSTOMER) {
            sendError(session, new RealtimeCustomerLocationException());
            return;
        }

        // 기본값 보정
        Instant timestamp  = (request.getTimestamp() != null) ? request.getTimestamp() : Instant.now();
        long seq = (request.getSeq() != null) ? request.getSeq() : timestamp.toEpochMilli();

        request.setTimestamp(timestamp);
        request.setSeq(seq);

        // 저장 + TTL + PUBLISH
        LocationUpdateResult result = locationService.registerByWebSocket(session, request);

        System.out.println(result.getReason());
    }

    /** 마지막 위치 스냅샷 전송 */
    private void sendLocationSnapshot(WebSocketSession session, Long escortId, Role targetRole) {
        sendEnvelope(session, getLocationSnapshot(escortId, targetRole));
    }

    /** 마지막 위치 스냅샷 전송 */
    private void sendStatusSnapshot(WebSocketSession session, Long escortId) {
        sendEnvelope(session, getStatusSnapshot(escortId));
    }

    /** 전송 헬퍼: 항상 {type, payload} 포맷으로 보냄 */
    public void sendEnvelope(WebSocketSession session, Envelope envelope) {
        if (session == null || !session.isOpen()) return;
        String json = JsonUtils.toJson(envelope);
        if (json == null) return;
        try {
            session.sendMessage(new TextMessage(json));
        } catch (Exception ignore) {}
    }

    /** 에러 응답 전송 헬퍼 */
    public void sendError(WebSocketSession session, Exception e) {
        ErrorResponse errorResponse = new ErrorResponse(e.getClass().getSimpleName(), e.getMessage());
        sendEnvelope(session, new Envelope(WebSocketMsgType.ERROR.getLabel(), errorResponse));
    }

    public Envelope getLocationSnapshot(long escortId, Role targetRole) {

        LocationResponse latestLocation = locationService.getLatestLocation(escortId, targetRole);
        return new Envelope(targetRole.getLabel() + "-location",
                Objects.requireNonNullElse(latestLocation, "NO_LOCATION"));
    }

    public Envelope getStatusSnapshot(long escortId) {

        EscortStatus escortStatus = escortService.getById(escortId).getStatus();
        return new Envelope(WebSocketMsgType.STATUS.getLabel(),
                new EscortStatusResponse(escortStatus.getLabel(), LocalDateTime.now()));
    }
}