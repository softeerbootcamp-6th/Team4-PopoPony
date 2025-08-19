package com.todoc.server.common.enumeration;

import java.util.Arrays;
import java.util.EnumSet;
import java.util.Optional;
import java.util.Set;

public enum Role {
    CUSTOMER("customer"),
    HELPER("helper"),
    PATIENT("patient"),;

    public static final Set<Role> TO_CUSTOMER_AND_PATIENT = EnumSet.of(Role.CUSTOMER, Role.PATIENT);
    public static final Set<Role> TO_CUSTOMER_AND_HELPER  = EnumSet.of(Role.CUSTOMER, Role.HELPER);
    public static final Set<Role> TO_ALL                  = EnumSet.allOf(Role.class);

    private final String label;

    Role(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

    /**
     * 문자열 값을 Role enum으로 변환합니다.
     *
     * @param value 변환할 문자열 값
     * @return 해당하는 Role enum이 존재하면 Optional로 반환, 없으면 Optional.empty()
     */
    public static Optional<Role> from(String value) {
        return Arrays.stream(values())
                .filter(v -> v.label.equalsIgnoreCase(value))
                .findFirst();
    }
}
