package com.todoc.server.domain.realtime.web.controller;

import com.todoc.server.common.enumeration.Role;
import com.todoc.server.common.util.JsonUtils;
import com.todoc.server.domain.realtime.exception.WebSocketInvalidEnvelopeException;
import com.todoc.server.domain.realtime.service.WebSocketFacadeService;
import com.todoc.server.domain.realtime.web.dto.request.LocationUpdateRequest;
import com.todoc.server.domain.realtime.web.dto.response.Envelope;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
@RequiredArgsConstructor
public class WebSocketRealtimeHandler extends TextWebSocketHandler {

    private final WebSocketFacadeService webSocketFacadeService;

    /**
     * 연결 직후 실행되는 메서드
     */
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        Role role = (Role) session.getAttributes().get("role");
        Long escortId = (Long) session.getAttributes().get("escortId");
        try {
            webSocketFacadeService.onConnect(escortId, role, session);
        } catch (RuntimeException ex) {
            session.close(CloseStatus.POLICY_VIOLATION.withReason(ex.getMessage()));
        }
    }

    /**
     * 수신한 메세지를 처리
     */
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String text = message.getPayload();

        Envelope envelope = JsonUtils.fromJson(text, new com.fasterxml.jackson.core.type.TypeReference<>() {});
        if (envelope == null || envelope.getType() == null) {
            webSocketFacadeService.sendError(session, new WebSocketInvalidEnvelopeException());
            return;
        }
        String type = envelope.getType();

        String payloadJson = JsonUtils.toJson(envelope.getPayload());
        if (payloadJson == null) {
            webSocketFacadeService.sendError(session, new WebSocketInvalidEnvelopeException());
            return;
        }

        if (type.equals("location")) {
            try {
                LocationUpdateRequest locationUpdateRequest = JsonUtils.fromJson(payloadJson, LocationUpdateRequest.class);
                if (locationUpdateRequest == null) {
                    webSocketFacadeService.sendError(session, new WebSocketInvalidEnvelopeException());
                    return;
                }
                webSocketFacadeService.handleLocationUpdate(session, locationUpdateRequest);

            } catch (RuntimeException ex) {
                session.close(CloseStatus.POLICY_VIOLATION.withReason(ex.getMessage()));
            }
        }
        else {
            webSocketFacadeService.sendError(session, new WebSocketInvalidEnvelopeException());
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {}
}
