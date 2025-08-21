package com.todoc.server.domain.realtime.web.controller;

import org.springframework.context.ApplicationContext;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/realtime/_diag")
class WsDiagController {

    private final ApplicationContext ctx;

    WsDiagController(ApplicationContext ctx) { this.ctx = ctx; }

    @GetMapping("/beans")
    Map<String, Object> beans() {
        return Map.of(
                "WebSocketConfigurer", ctx.getBeanNamesForType(org.springframework.web.socket.config.annotation.WebSocketConfigurer.class),
                "wsHandlerBeanExists", ctx.containsBean("webSocketRealtimeHandler"),
                "wsInterceptorBeanExists", ctx.containsBean("webSocketAuthHandshakeInterceptor")
        );
    }
}