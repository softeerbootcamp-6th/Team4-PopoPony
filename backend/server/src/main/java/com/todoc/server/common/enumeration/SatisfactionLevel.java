package com.todoc.server.common.enumeration;

import java.util.Arrays;
import java.util.Optional;

public enum SatisfactionLevel {
    GOOD("좋았어요"),
    AVERAGE("괜찮아요"),
    BAD("아쉬워요");

    private final String label;

    SatisfactionLevel(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

    /**
     * 문자열 값을 SatisfactionLevel enum으로 변환합니다.
     *
     * @param value 변환할 문자열 값
     * @return 해당하는 SatisfactionLevel enum이 존재하면 Optional로 반환, 없으면 Optional.empty()
     */
    public static Optional<SatisfactionLevel> from(String value) {
        return Arrays.stream(values())
                .filter(v -> v.label.equalsIgnoreCase(value))
                .findFirst();
    }
}