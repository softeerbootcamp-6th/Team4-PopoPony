package com.todoc.server.external.tmap.service;

import com.todoc.server.IntegrationMockConfig;
import com.todoc.server.external.tmap.web.dto.RouteExternalRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

/**
 * TMapRouteServiceTest는 TMap API를 통해 경로 조회 기능을 테스트하는 클래스입니다.
 * 주석을 풀 경우, 매 테스트 실행마다 TMap API를 호출합니다.
 */
@Import(IntegrationMockConfig.class)
@SpringBootTest
@Transactional
@ActiveProfiles("test")
class TMapRouteServiceTest {


//    @Autowired
//    private TMapRouteService tMapRouteService;
//
//    @Autowired
//    private RestClient restClient;
//
//    @Test
//    @DisplayName("TMap API 경로 조회 테스트")
//    void getRouteTest() {
//        RouteExternalRequest request = RouteExternalRequest.builder()
//                .startX("126.9783882")
//                .startY("37.5666103")
//                .endX("126.966666")
//                .endY("37.5666103")
//                .reqCoordType("WGS84GEO")
//                .resCoordType("WGS84GEO")
//                .startName("서울시청")
//                .endName("사직야구장")
//                .build();
//
//        System.out.println(tMapRouteService.getRoute(request));
//    }

}