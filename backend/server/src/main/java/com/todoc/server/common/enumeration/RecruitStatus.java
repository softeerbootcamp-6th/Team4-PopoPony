package com.todoc.server.common.enumeration;

import lombok.Getter;

@Getter
public enum RecruitStatus {
    MATCHING("매칭중"),
    COMPLETED("매칭완료"),
    IN_PROGRESS("동행중"),
    DONE("완료된 동행"),
    CANCELLED("취소됨");

    private final String label;

    RecruitStatus(String label) {
        this.label = label;
    }
}
