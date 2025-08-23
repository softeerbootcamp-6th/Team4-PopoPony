package com.todoc.server;

import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.MySQLContainer;

public class TestContainerConfig {
    public static final GenericContainer<?> redis =
            new GenericContainer<>("redis:7.2-alpine")
                    .withExposedPorts(6379);
    // 싱글톤처럼 재사용
    public static final MySQLContainer<?> MYSQL_CONTAINER =
            new MySQLContainer<>("mysql:8.0") // 운영 DB 버전 맞추기
                    .withDatabaseName("testdb")
                    .withUsername("testuser")
                    .withPassword("testpass");


    static {
        redis.start();
        System.setProperty("spring.data.redis.host", redis.getHost());
        System.setProperty("spring.data.redis.port", redis.getMappedPort(6379).toString());
        MYSQL_CONTAINER.start();
    }
}