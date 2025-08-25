package com.todoc.server;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.junit.jupiter.api.TestInstance;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.testcontainers.containers.MySQLContainer;

@SpringBootTest
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@Sql("/sql/data.sql")
public abstract class IntegrationTest {

    static final MySQLContainer<?> mysql =
        new MySQLContainer<>("mysql:8.0")
            .withUsername("testuser")
            .withPassword("testpass");

    static {
        mysql.start();
    }

    @DynamicPropertySource
    static void registerProps(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", mysql::getJdbcUrl);
        registry.add("spring.datasource.username", mysql::getUsername);
        registry.add("spring.datasource.password", mysql::getPassword);
    }

    @Autowired
    ApplicationContext ctx;

//    @BeforeEach
//    void setup(@Autowired DataSource dataSource) {
//        System.out.println("### CTX id=" + ctx.getId() + ", hash=" + System.identityHashCode(ctx));
//        try (Connection conn = dataSource.getConnection()) {
//            // 1) 테이블 생성 (여러 번 돌아도 IF NOT EXISTS면 안전)
//            ScriptUtils.executeSqlScript(conn, new ClassPathResource("/sql/schema.sql"));
//            // 2) 깔끔히 비우기
//            ScriptUtils.executeSqlScript(conn, new ClassPathResource("/sql/clean.sql"));
//            // 3) 시드 데이터 주입
//            ScriptUtils.executeSqlScript(conn, new ClassPathResource("/sql/data.sql"));
//        } catch (SQLException e) {
//            throw new RuntimeException("DB seed failed", e);
//        }
//    }

}