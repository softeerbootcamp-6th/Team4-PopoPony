package com.todoc.server.domain.realtime.web.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LocationRequest {

    private Double latitude;
    private Double longitude;
}
