package com.todoc.server.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.ThreadPoolExecutor;

@Configuration
@EnableAsync
public class AsyncConfig {

    /** WebSocket/Nchan 알림용 실행기 */
    @Bean("wsExecutor")
    public ThreadPoolTaskExecutor wsExecutor() {
        ThreadPoolTaskExecutor ex = new ThreadPoolTaskExecutor();
        ex.setCorePoolSize(4);
        ex.setMaxPoolSize(16);
        ex.setQueueCapacity(1000);
        ex.setThreadNamePrefix("ws-");
        ex.setRejectedExecutionHandler(new ThreadPoolExecutor.DiscardPolicy()); // 큐 꽉 차면 드롭
        ex.initialize();
        return ex;
    }
}
