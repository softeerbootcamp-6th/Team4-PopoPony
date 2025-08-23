package com.todoc.server.domain.realtime.web.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@Schema(description = "실시간 위치 응답 DTO")
public class LocationResponse {

    @Schema(description = "위도")
    private double latitude;

    @Schema(description = "경도")
    private double longitude;

    @Schema(description = "타임스탬프")
    private Instant timestamp;

    @Builder
    public LocationResponse(double latitude, double longitude, Instant timestamp) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.timestamp = timestamp;
    }

    public static LocationResponse from(LocationRedisDto dto) {
        return LocationResponse.builder()
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .timestamp(Instant.ofEpochMilli(dto.getTimestamp())) // millis → Instant
                .build();
    }
}
