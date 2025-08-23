package com.todoc.server.common.config;

import io.micrometer.cloudwatch2.CloudWatchConfig;
import io.micrometer.cloudwatch2.CloudWatchMeterRegistry;
import io.micrometer.core.instrument.Clock;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import software.amazon.awssdk.services.cloudwatch.CloudWatchAsyncClient;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Configuration
@Profile("prod")
public class CloudWatchMetricsConfig {

    @Bean
    public CloudWatchAsyncClient cloudWatchAsyncClient() {
        return CloudWatchAsyncClient.builder()
                .region(software.amazon.awssdk.regions.Region.AP_NORTHEAST_2) // 서울 리전
                .build();
    }

    @Bean
    public CloudWatchConfig cloudWatchConfig() {
        Map<String, String> props = new HashMap<>();
        props.put("cloudwatch.namespace", "SpringApp-JVM"); // yml의 namespace
        props.put("cloudwatch.step", Duration.ofMinutes(1).toString()); // 1분마다 push

        return new CloudWatchConfig() {
            @Override
            public String get(String key) {
                return props.get(key);
            }
        };
    }

    @Bean
    public CloudWatchMeterRegistry cloudWatchMeterRegistry(
            CloudWatchConfig cloudWatchConfig,
            CloudWatchAsyncClient cloudWatchAsyncClient
    ) {
        return new CloudWatchMeterRegistry(cloudWatchConfig, Clock.SYSTEM, cloudWatchAsyncClient);
    }
}