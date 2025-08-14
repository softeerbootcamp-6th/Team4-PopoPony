package com.todoc.server.external.tmap.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TMapRouteParser {

    private final ObjectMapper objectMapper;

    public record RouteLegSummary(Integer totalDistance, Integer totalTime, Integer totalFare, Integer taxiFare) {}

    /** 출발지(S) Feature에서 전체 요약값만 파싱 */
    public RouteLegSummary parseSummaryFromRaw(String rawJson) throws IOException {
        JsonNode root = objectMapper.readTree(rawJson);
        for (JsonNode f : root.path("features")) {
            if (!"Point".equals(f.path("geometry").path("type").asText(""))) continue;
            if (!"S".equals(f.path("properties").path("pointType").asText(""))) continue;
            JsonNode p = f.path("properties");
            return new RouteLegSummary(
                p.path("totalDistance").isNumber() ? p.get("totalDistance").asInt() : null,
                p.path("totalTime").isNumber()     ? p.get("totalTime").asInt()     : null,
                p.path("totalFare").isNumber()     ? p.get("totalFare").asInt()     : null,
                p.path("taxiFare").isNumber()      ? p.get("taxiFare").asInt()      : null
            );
        }
        return new RouteLegSummary(null, null, null, null);
    }

}
