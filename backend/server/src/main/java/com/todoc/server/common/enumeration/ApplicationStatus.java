package com.todoc.server.common.enumeration;

import java.util.Arrays;
import java.util.Optional;

public enum ApplicationStatus {
    PENDING("대기중"),
    MATCHED("매칭성공"),
    FAILED("매칭실패");

    private final String label;

    ApplicationStatus(String label) {
        this.label = label;
    }

    /**
     * 문자열 값을 ApplicationStatus enum으로 변환합니다.
     *
     * @param value 변환할 문자열 값
     * @return 해당하는 ApplicationStatus enum이 존재하면 Optional로 반환, 없으면 Optional.empty()
     */
    public static Optional<ApplicationStatus> from(String value) {
        return Arrays.stream(values())
                .filter(v -> v.name().equalsIgnoreCase(value))
                .findFirst();
    }
}
