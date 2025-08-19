package com.todoc.server.domain.route;

import jakarta.validation.constraints.NotNull;

@NotNull
public record Coordinate(
        @NotNull double lat,
        @NotNull double lon
) {
}
