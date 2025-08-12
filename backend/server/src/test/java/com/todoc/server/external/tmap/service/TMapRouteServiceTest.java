package com.todoc.server.external.tmap.service;

import com.todoc.server.external.tmap.web.dto.RouteExternalRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
class TMapRouteServiceTest {

    @Autowired
    private TMapRouteService tMapRouteService;

    @Autowired
    private RestClient restClient;

    @Test
    @DisplayName("TMap API 경로 조회 테스트")
    void getRouteTest() {
        RouteExternalRequest request = RouteExternalRequest.builder()
                .startX("126.9783882") // 서울시청 경도
                .startY("37.5666103")  // 서울시청 위도
                .endX("129.042628")    // 예: 사직야구장 경도
                .endY("35.194568")     // 예: 사직야구장 위도
                .reqCoordType("WGS84GEO")
                .resCoordType("WGS84GEO")
                .startName("서울시청")
                .endName("사직야구장")
                .build();

        System.out.println(tMapRouteService.getRoute(request));
    }

}