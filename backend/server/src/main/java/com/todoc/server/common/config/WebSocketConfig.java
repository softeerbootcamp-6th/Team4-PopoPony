package com.todoc.server.common.config;

import com.todoc.server.domain.realtime.web.controller.WebSocketRealtimeHandler;
import com.todoc.server.domain.realtime.web.controller.WebSocketAuthHandshakeInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final WebSocketRealtimeHandler handler;
    private final WebSocketAuthHandshakeInterceptor authInterceptor;

    public WebSocketConfig(WebSocketRealtimeHandler handler, WebSocketAuthHandshakeInterceptor authInterceptor) {
        this.handler = handler;
        this.authInterceptor = authInterceptor;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(handler, "/api/realtime/ws")
                .addInterceptors(authInterceptor)
                .setAllowedOrigins("*");
        // TODO : Origin 제한 필요
    }
}
