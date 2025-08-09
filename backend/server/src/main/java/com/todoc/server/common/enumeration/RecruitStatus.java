package com.todoc.server.common.enumeration;

import lombok.Getter;

import java.util.Arrays;
import java.util.Optional;

@Getter
public enum RecruitStatus {
    MATCHING("매칭중"),
    COMPLETED("매칭완료"),
    IN_PROGRESS("동행중"),
    DONE("완료된 동행");

    private final String label;

    RecruitStatus(String label) {
        this.label = label;
    }

    /**
     * 문자열 값을 RecruitStatus enum으로 변환합니다.
     *
     * @param value 변환할 문자열 값
     * @return 해당하는 RecruitStatus enum이 존재하면 Optional로 반환, 없으면 Optional.empty()
     */
    public static Optional<RecruitStatus> from(String value) {
        return Arrays.stream(values())
                .filter(v -> v.label.equalsIgnoreCase(value))
                .findFirst();
    }
}
