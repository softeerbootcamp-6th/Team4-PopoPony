package com.todoc.server.external.tmap.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.todoc.server.external.tmap.exception.TMapParsingException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TMapRouteParser {

    private final ObjectMapper objectMapper;

    public record RouteParseResult(
            List<List<Double>> coordinates,
            RouteLegSummary summary
    ) {}

    public record RouteLegSummary(Integer totalDistance, Integer totalTime, Integer totalFare, Integer taxiFare) {}

    /** 출발지(S) Feature에서 전체 요약값만 파싱 */
    public RouteParseResult parseSummaryFromRaw(String rawJson) {
        try {
            JsonNode root = objectMapper.readTree(rawJson);
            List<List<Double>> coordinates = new ArrayList<>();
            RouteLegSummary summary = null;
            for (JsonNode f : root.path("features")) {

                // 경로 저장
                if (f.path("geometry").path("type").asText("").equals("LineString")) {
                    // coordinates에 다음을 추가함.
                    JsonNode array = f.path("geometry").path("coordinates");
                    for (JsonNode inner : array) {
                        List<Double> innerList = new ArrayList<>();

                        for (JsonNode value : inner) {
                            innerList.addFirst(value.asDouble());
                        }
                        coordinates.add(innerList);
                    }
                }

                if (f.path("geometry").path("type").asText("").equals("Point")) {
                    if (!"S".equals(f.path("properties").path("pointType").asText(""))) continue;

                    JsonNode p = f.path("properties");
                    summary = new RouteLegSummary(
                            p.path("totalDistance").isNumber() ? p.get("totalDistance").asInt() : null,
                            p.path("totalTime").isNumber()     ? p.get("totalTime").asInt()     : null,
                            p.path("totalFare").isNumber()     ? p.get("totalFare").asInt()     : null,
                            p.path("taxiFare").isNumber()      ? p.get("taxiFare").asInt()      : null
                    );
                }
            }

            return new RouteParseResult(coordinates, summary);

        } catch (IOException e) {
            throw new TMapParsingException();
        }
    }

}
