package com.todoc.server.common.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestClient;

@Configuration
public class TMapClientConfig {

    private static final String BASE_URL = "https://apis.openapi.sk.com/tmap";

    @Value("${tmap.app-key}")
    private String appKey;

    @Bean
    RestClient tmapRestClient(
            RestClient.Builder builder
    ) {
        return builder
                .baseUrl(BASE_URL)
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader("appKey", appKey) // TMAP 인증 헤더
                .build();
    }
}
