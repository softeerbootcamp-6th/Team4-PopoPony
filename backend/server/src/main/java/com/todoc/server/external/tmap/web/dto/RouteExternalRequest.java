package com.todoc.server.external.tmap.web.dto;

// TMap API를 호출하기 위한 요청 DTO 클래스

import lombok.Builder;
import lombok.Getter;

@Getter
public class RouteExternalRequest {

    private String startX;

    private String startY;

    private String endX;

    private String endY;

    private String reqCoordType;

    private String resCoordType;

    private String startName;

    private String endName;

    @Builder
    public RouteExternalRequest(String startX, String startY, String endX, String endY, String reqCoordType, String resCoordType, String startName, String endName) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.reqCoordType = reqCoordType;
        this.resCoordType = resCoordType;
        this.startName = startName;
        this.endName = endName;
    }
}
