//package com.todoc.server;
//
//import org.springframework.boot.test.context.TestConfiguration;
//import org.springframework.test.context.DynamicPropertyRegistry;
//import org.springframework.test.context.DynamicPropertySource;
//import org.testcontainers.containers.GenericContainer;
//import org.testcontainers.containers.MySQLContainer;
//
//@TestConfiguration
//public class TestContainerConfig {
//    static final MySQLContainer<?> mysql =
//        new MySQLContainer<>("mysql:8.0")
//            .withUsername("testuser")
//            .withPassword("testpass");
//
//    static {
//        mysql.start();
//    }
//
//    @DynamicPropertySource
//    static void registerProps(DynamicPropertyRegistry registry) {
//
//        registry.add("spring.datasource.url", mysql::getJdbcUrl);
//        registry.add("spring.datasource.username", mysql::getUsername);
//        registry.add("spring.datasource.password", mysql::getPassword);
//    }
//}