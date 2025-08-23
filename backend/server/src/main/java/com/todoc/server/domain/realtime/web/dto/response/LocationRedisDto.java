package com.todoc.server.domain.realtime.web.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@Schema(description = "레디스 응답 DTO")
public class LocationRedisDto {

    @Schema(description = "위도")
    private double latitude;

    @Schema(description = "경도")
    private double longitude;

    @Schema(description = "타임스탬프 (epoch millis)")
    private long timestamp;

    @Schema(description = "정확도(m 단위)")
    private Double accuracy;

    @Schema(description = "순번(시퀀스)")
    private Integer sequence;

    @Schema(description = "EMA (지수 이동평균 속도)")
    private Double ema;

    @Schema(description = "이동 여부 (0=정지, 1=이동)")
    private Integer moving;

    @Builder
    public LocationRedisDto(double latitude, double longitude, long timestamp,
                            Double accuracy, Integer sequence, Double ema, Integer moving) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.timestamp = timestamp;
        this.accuracy = accuracy;
        this.sequence = sequence;
        this.ema = ema;
        this.moving = moving;
    }
}
