package com.todoc.server.common.enumeration;

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
}