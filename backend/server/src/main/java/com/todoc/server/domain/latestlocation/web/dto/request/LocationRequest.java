package com.todoc.server.domain.latestlocation.web.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LocationRequest {

    private Long escortId;
    private Double lat;
    private Double lon;
}
