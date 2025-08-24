package com.todoc.server.domain.realtime.repository.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LocationUpdateResult {

    /** Lua code==1 */
    private boolean updated;

    /** "first"|"move"|"resync"|"refresh"|"stored" or 오류 사유("stale"|"bad-acc"|...) */
    private String reason;

    /** PUBLISH 했는지 여부 (first/move/resync/refresh면 true, stored/에러면 false) */
    private boolean published;

    @Builder
    public LocationUpdateResult(boolean updated, String reason, boolean published) {
        this.updated = updated;
        this.reason = reason;
        this.published = published;
    }
}
