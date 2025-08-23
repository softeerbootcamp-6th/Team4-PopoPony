package com.todoc.server.common.enumeration;

import lombok.Getter;

import java.util.Arrays;
import java.util.Optional;

@Getter
public enum WebSocketMsgType {
    CONNECTED("connected"),
    LOCATION_UPDATE("location-update"),
    HELPER_LOCATION("helper-location"),
    PATIENT_LOCATION("patient-location"),
    STATUS("status"),
    ERROR("error");

    private final String label;

    WebSocketMsgType(String label) {
        this.label = label;
    }

    /**
     * 문자열 값을 WebSocketMsgType enum으로 변환합니다.
     *
     * @param value 변환할 문자열 값
     * @return 해당하는 WebSocketMsgType enum이 존재하면 Optional로 반환, 없으면 Optional.empty()
     */
    public static Optional<WebSocketMsgType> from(String value) {
        return Arrays.stream(values())
                .filter(v -> v.label.equalsIgnoreCase(value))
                .findFirst();
    }
}
