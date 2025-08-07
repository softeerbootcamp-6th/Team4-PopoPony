package com.todoc.server.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 모든 URL 패턴에 대해
                .allowedOrigins("http://localhost:3000") // React 개발 서버 Origin
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH") // 허용 메서드
                .allowedHeaders("*") // 모든 헤더 허용
                .allowCredentials(true); // 인증 정보(쿠키 등) 포함 허용
    }
}
