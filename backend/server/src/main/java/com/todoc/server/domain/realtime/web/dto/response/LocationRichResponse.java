package com.todoc.server.domain.realtime.web.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class LocationRichResponse {

    private long escortId;
    private double latitude;
    private double longitude;
    private Instant timestamp;
    private Long seq;
    private Double speedEma;   // m/s
    private Integer moving;

    @Builder
    public LocationRichResponse(long escortId, double latitude, double longitude, Instant timestamp, Long seq, Double speedEma, Integer moving) {
        this.escortId = escortId;
        this.latitude = latitude;
        this.longitude = longitude;
        this.timestamp = timestamp;
        this.seq = seq;
        this.speedEma = speedEma;
        this.moving = moving;
    }
}
