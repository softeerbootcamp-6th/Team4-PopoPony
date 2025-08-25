package com.todoc.server;

import org.junit.jupiter.api.BeforeAll;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.junit.jupiter.api.TestInstance;
import org.springframework.context.ApplicationContext;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ScriptException;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

@SpringBootTest
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public abstract class IntegrationTest {

    @Autowired
    ApplicationContext ctx;

    @BeforeAll
    void setup(@Autowired DataSource dataSource) {
        System.out.println("### CTX id=" + ctx.getId() + ", hash=" + System.identityHashCode(ctx));
        try (Connection conn = dataSource.getConnection()) {
            // 1) 테이블 생성 (여러 번 돌아도 IF NOT EXISTS면 안전)
            ScriptUtils.executeSqlScript(conn, new ClassPathResource("/sql/schema.sql"));
            // 2) 깔끔히 비우기
            ScriptUtils.executeSqlScript(conn, new ClassPathResource("/sql/clean.sql"));
            // 3) 시드 데이터 주입
            ScriptUtils.executeSqlScript(conn, new ClassPathResource("/sql/data.sql"));
        } catch (SQLException e) {
            throw new RuntimeException("DB seed failed", e);
        }
    }

    private void runScript(Connection conn, String classpathSql) {
        var res = new ClassPathResource(classpathSql);
        try {
            System.out.println("▶️ executing " + classpathSql);
            ScriptUtils.executeSqlScript(conn, res);
            System.out.println("✅ done " + classpathSql);
        } catch (ScriptException e) {
            // Spring 6.x: 실패 구문 번호 게터가 없어 message + root cause로 출력
            System.err.println("❌ SQL script failed: " + classpathSql + " :: " + e.getMessage());
            Throwable root = e.getMostSpecificCause();
            if (root instanceof SQLException se) {
                System.err.printf("   ↳ SQLState=%s, code=%d, msg=%s%n",
                        se.getSQLState(), se.getErrorCode(), se.getMessage());
            }
            throw e;
        }
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