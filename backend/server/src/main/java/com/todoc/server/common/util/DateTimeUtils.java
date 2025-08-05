package com.todoc.server.common.util;

import java.time.LocalDate;
import java.time.Period;

public class DateTimeUtils {
    /**
     * 생년월일(LocalDate)로 현재 나이 계산
     */
    public static int calculateAge(LocalDate birthDate) {
        if (birthDate == null) throw new IllegalArgumentException("생년월일이 null입니다.");
        if (birthDate.isAfter(LocalDate.now())) throw new IllegalArgumentException("생년월일이 미래입니다.");
        return Period.between(birthDate, LocalDate.now()).getYears();
    }
}
