package com.todoc.server.external.tmap.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.todoc.server.external.tmap.web.dto.RouteExternalRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
@RequiredArgsConstructor
public class TMapRouteService {
    public record TMapRawResult(String tmapJson, String usedVertices) {}

    // TMapClientConfig에서 설정한 RestClient를 주입받아 사용
    private final RestClient tmapRestClient;
    private final ObjectMapper objectMapper;

    /**
     * TMAP API를 호출하고, TMapRawResult에 응답 값을 저장
     * @param request
     * @return TMapRawResult에
     */
    public TMapRawResult getRoute(RouteExternalRequest request) {

        // TMap에 경로 요청을 보내고 응답 받음
        String rawString = tmapRestClient.post()
            .uri(uriBuilder -> uriBuilder
                .path("/routes")                  // baseUrl에 이미 /tmap 포함됨
                .queryParam("version", "1")       // {version}
                .build())
            .contentType(MediaType.APPLICATION_JSON)
            .body(request)   // 요청 JSON (startX, startY, endX, endY 등 필수)
            .retrieve()
            .body(String.class);// 반드시 body/read로 실제 호출 수행


        // TMap 응답에서 usedFavoriteRouteVertices 추출
        String used = null;
        try {
            JsonNode root = objectMapper.readTree(rawString);
            JsonNode n = root.path("usedFavoriteRouteVertices");
            if (!n.isMissingNode() && !n.isNull()) used = n.asText();
        } catch (Exception ignore) {}

        return new TMapRawResult(rawString, used);
    }
}