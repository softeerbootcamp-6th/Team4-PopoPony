package com.todoc.server.domain.realtime.repository.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LocationUpdateResult {
    private boolean updated;
    private String reason;

    @Builder
    public LocationUpdateResult(boolean updated, String reason) {
        this.updated = updated;
        this.reason = reason;
    }
}
