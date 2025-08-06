package com.todoc.server.common.enumeration;

public enum ApplicationStatus {
    PENDING("대기중"),
    MATCHED("매칭성공"),
    FAILED("매칭실패");

    private final String label;

    ApplicationStatus(String label) {
        this.label = label;
    }
}
