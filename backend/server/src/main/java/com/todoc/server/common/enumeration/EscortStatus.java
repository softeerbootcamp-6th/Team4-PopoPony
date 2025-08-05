package com.todoc.server.common.enumeration;

import lombok.Getter;

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
}
