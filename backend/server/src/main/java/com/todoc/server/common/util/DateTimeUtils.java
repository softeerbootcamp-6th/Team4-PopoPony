package com.todoc.server.common.util;

import java.time.*;

public class DateTimeUtils {
    /**
     * 생년월일(LocalDate)로 현재 나이 계산
     */
    public static int calculateAge(LocalDate birthDate) {
        if (birthDate == null) throw new IllegalArgumentException("생년월일이 null입니다.");
        if (birthDate.isAfter(LocalDate.now())) throw new IllegalArgumentException("생년월일이 미래입니다.");
        return Period.between(birthDate, LocalDate.now()).getYears();
    }

    /**
     * 두 시간 사이의 차를 분 단위로 반환
     */
    public static int getMinuteDifference(LocalTime start, LocalTime end) {
        return (int) Duration.between(start, end).toMinutes();
    }
}
