package com.todoc.server.common.enumeration;

import java.util.Arrays;
import java.util.Optional;

public enum Gender {
    MALE("남자"),
    FEMALE("여자");

    private final String label;

    Gender(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

    /**
     * 문자열 값을 Gender enum으로 변환합니다.
     *
     * @param value 변환할 문자열 값
     * @return 해당하는 Gender enum이 존재하면 Optional로 반환, 없으면 Optional.empty()
     */
    public static Optional<Gender> from(String value) {
        return Arrays.stream(values())
                .filter(v -> v.name().equalsIgnoreCase(value))
                .findFirst();
    }
}
