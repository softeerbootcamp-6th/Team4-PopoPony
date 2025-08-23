package com.todoc.server.common.config;

import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.service.DefaultMessageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SMSClientConfig {

    @Value("${sms.app-key}")
    private String appKey;

    @Value("${sms.app-secret-key}")
    private String appSecretKey;

    @Bean
    public DefaultMessageService messageService() {
        return NurigoApp.INSTANCE.initialize(appKey, appSecretKey, "https://api.coolsms.co.kr");
    }
}
