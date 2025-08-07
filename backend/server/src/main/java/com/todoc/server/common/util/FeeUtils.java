package com.todoc.server.common.util;

import java.time.Duration;
import java.time.LocalTime;

public class FeeUtils {

    private static final int BASE_FEE = 35000;
    private static final int BASE_TIME_MINUTES = 120;
    private static final int EXTRA_UNIT_MINUTES = 15;
    private static final int EXTRA_UNIT_FEE = 1500;

    /**
     * 전체 요금 계산 (택시비 제외)
     *
     * @param startTime 실제 시작 시각
     * @param endTime   실제 종료 시각
     * @return 총 요금 (원)
     */
    public static int calculateTotalFee(LocalTime startTime, LocalTime endTime) {
        long totalMinutes = Duration.between(startTime, endTime).toMinutes();

        if (totalMinutes <= BASE_TIME_MINUTES) {
            return BASE_FEE;
        }

        long extraMinutes = totalMinutes - BASE_TIME_MINUTES;
        long extraUnits = (long) Math.ceil((double) extraMinutes / EXTRA_UNIT_MINUTES);
        int extraFee = (int) (extraUnits * EXTRA_UNIT_FEE);

        return BASE_FEE + extraFee;
    }
}
