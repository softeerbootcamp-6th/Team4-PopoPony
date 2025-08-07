package com.todoc.server.common.enumeration;

import lombok.Getter;

import java.util.Arrays;
import java.util.Optional;

@Getter
public enum EscortStatus {
    PREPARING("동행 준비"),
    MEETING("만남 중"),
    HEADING_TO_HOSPITAL("병원행"),
    IN_TREATMENT("진료 중"),
    RETURNING("복귀 중"),
    WRITING_REPORT("리포트 작성 중"),
    DONE("동행 완료");

    private final String label;

    EscortStatus(String label) {
        this.label = label;
    }

    /**
     * 문자열 값을 EscortStatus enum으로 변환합니다.
     *
     * @param value 변환할 문자열 값
     * @return 해당하는 EscortStatus enum이 존재하면 Optional로 반환, 없으면 Optional.empty()
     */
    public static Optional<EscortStatus> from(String value) {
        return Arrays.stream(values())
                .filter(v -> v.name().equalsIgnoreCase(value))
                .findFirst();
    }
}
