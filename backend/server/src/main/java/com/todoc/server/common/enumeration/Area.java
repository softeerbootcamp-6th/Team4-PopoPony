package com.todoc.server.common.enumeration;

import java.util.Arrays;
import java.util.Optional;

public enum Area {
    SEOUL("서울"),
    BUSAN("부산"),
    DAEGU("대구"),
    INCHEON("인천"),
    GWANGJU("광주"),
    DAEJEON("대전"),
    ULSAN("울산"),
    SEJONG("세종시"),
    GYEONGGI("경기"),
    GANGWON("강원"),
    CHUNGBUK("충북"),
    CHUNGNAM("충남"),
    JEONBUK("전북"),
    JEONNAM("전남"),
    GYEONGBUK("경북"),
    GYEONGNAM("경남"),
    JEJU("제주");

    private final String label;

    Area(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

    /**
     * 문자열 값을 Area enum으로 변환합니다.
     *
     * @param value 변환할 문자열 값
     * @return 해당하는 Area enum이 존재하면 Optional로 반환, 없으면 Optional.empty()
     */
    public static Optional<Area> from(String value) {
        return Arrays.stream(values())
                .filter(v -> v.name().equalsIgnoreCase(value))
                .findFirst();
    }
}
