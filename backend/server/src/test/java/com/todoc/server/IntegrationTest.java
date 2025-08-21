package com.todoc.server;

import org.springframework.boot.test.context.SpringBootTest;
import org.junit.jupiter.api.TestInstance;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public abstract class IntegrationTest {

    @DynamicPropertySource
    static void overrideProps(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", TestContainerConfig.MYSQL_CONTAINER::getJdbcUrl);
        registry.add("spring.datasource.username", TestContainerConfig.MYSQL_CONTAINER::getUsername);
        registry.add("spring.datasource.password", TestContainerConfig.MYSQL_CONTAINER::getPassword);
    }
}