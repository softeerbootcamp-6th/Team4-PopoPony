package com.todoc.server;

import org.junit.jupiter.api.BeforeAll;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.junit.jupiter.api.TestInstance;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public abstract class IntegrationTest {

    @Autowired
    ApplicationContext ctx;

    @BeforeAll
    void printCtxId() {
        System.out.println("### CTX id=" + ctx.getId() + ", hash=" + System.identityHashCode(ctx));
    }

    @DynamicPropertySource
    static void overrideProps(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", TestContainerConfig.MYSQL_CONTAINER::getJdbcUrl);
        registry.add("spring.datasource.username", TestContainerConfig.MYSQL_CONTAINER::getUsername);
        registry.add("spring.datasource.password", TestContainerConfig.MYSQL_CONTAINER::getPassword);

        registry.add("spring.data.redis.host", TestContainerConfig.redis::getHost);
        registry.add("spring.data.redis.port", () -> TestContainerConfig.redis.getMappedPort(6379).toString());
    }
}