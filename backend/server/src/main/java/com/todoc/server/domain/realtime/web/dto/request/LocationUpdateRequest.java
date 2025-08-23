package com.todoc.server.domain.realtime.web.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.Instant;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LocationUpdateRequest {

    /** 위도 [-90, 90] */
    @NotNull
    @Min(-90) @Max(90)
    private Double latitude;

    /** 경도 [-180, 180] */
    @NotNull
    @Min(-180) @Max(180)
    private Double longitude;

    /** 좌표가 찍힌 시각 (UTC) -> 없으면 서버에서 수신시각으로 보정 */
    private Instant timestamp;

    /** 위치 정확도 (meters) (브라우저/OS가 주는 값) */
    private Double accuracyMeters;

    /** 시퀀스 번호(0부터 1씩 증가) */
    private Long seq;
}
