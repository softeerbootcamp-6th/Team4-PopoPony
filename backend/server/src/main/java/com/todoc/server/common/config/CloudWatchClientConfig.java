package com.todoc.server.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.cloudwatch.CloudWatchAsyncClient;

@Configuration
public class CloudWatchClientConfig {
    @Bean
    CloudWatchAsyncClient cloudWatchAsyncClient() {
        return CloudWatchAsyncClient.builder()
                .region(Region.AP_NORTHEAST_2)
                .build(); // 자격증명은 EC2 인스턴스 프로파일(IMDS) 자동 사용
    }
}
