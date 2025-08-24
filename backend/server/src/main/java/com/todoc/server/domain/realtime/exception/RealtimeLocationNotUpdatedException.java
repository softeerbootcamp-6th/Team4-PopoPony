package com.todoc.server.domain.realtime.exception;

public class RealtimeLocationNotUpdatedException extends RuntimeException {
    public RealtimeLocationNotUpdatedException(String message) {
        super("실시간 위치를 갱신하지 않았습니다 : " + message);
    }
}
