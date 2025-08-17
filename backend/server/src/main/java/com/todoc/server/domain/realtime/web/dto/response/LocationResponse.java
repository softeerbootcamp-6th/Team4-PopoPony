package com.todoc.server.domain.realtime.web.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class LocationResponse {

    private Long escortId;

    private double latitude;

    private double longitude;

    private Instant timestamp;

    @Builder
    public LocationResponse(Long escortId, double latitude, double longitude, Instant timestamp) {
        this.escortId = escortId;
        this.latitude = latitude;
        this.longitude = longitude;
        this.timestamp = timestamp;
    }
}
