package com.todoc.server.external.tmap.service;

import com.todoc.server.external.tmap.web.dto.RouteExternalRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
@RequiredArgsConstructor
public class TMapRouteService {

    // TMapClientConfig에서 설정한 RestClient를 주입받아 사용
    private final RestClient tmapRestClient;

    public String getRoute(RouteExternalRequest request) {
        return tmapRestClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/routes")                  // baseUrl에 이미 /tmap 포함됨
                        .queryParam("version", "1")       // {version}
                        // callback이 필요없으면 아래 줄 삭제
                        .build())
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)   // 요청 JSON (startX, startY, endX, endY 등 필수)
                .retrieve()
                .body(String.class); // 반드시 body/read로 실제 호출 수행
    }
}