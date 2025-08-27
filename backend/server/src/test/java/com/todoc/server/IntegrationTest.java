package com.todoc.server;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.junit.jupiter.api.TestInstance;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.transaction.annotation.Transactional;
import javax.sql.DataSource;
import java.sql.Connection;

@SpringBootTest
@ActiveProfiles("test")
//@ContextConfiguration(initializers = IntegrationTest.DatabaseInitializer.class)
@Transactional
public abstract class IntegrationTest {

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
//        registry.add("spring.datasource.url", mysql::getJdbcUrl);
//        registry.add("spring.datasource.username", mysql::getUsername);
//        registry.add("spring.datasource.password", mysql::getPassword);
//    }

//    public static class DatabaseInitializer
//            implements ApplicationContextInitializer<ConfigurableApplicationContext> {
//
//        private static final java.util.concurrent.atomic.AtomicBoolean RUN = new java.util.concurrent.atomic.AtomicBoolean(false);
//
//        @Override
//        public void initialize(ConfigurableApplicationContext context) {
//            context.addApplicationListener(event -> {
//                if (event instanceof org.springframework.context.event.ContextRefreshedEvent
//                        && RUN.compareAndSet(false, true)) {
//                    javax.sql.DataSource ds = context.getBean(javax.sql.DataSource.class);
//                    try (java.sql.Connection conn = ds.getConnection()) {
//                        // 스키마 먼저 필요하면 schema.sql도 실행
//                        // ScriptUtils.executeSqlScript(conn, new ClassPathResource("/sql/schema.sql"));
//                        org.springframework.jdbc.datasource.init.ScriptUtils.executeSqlScript(
//                                conn, new org.springframework.core.io.ClassPathResource("/sql/data.sql"));
//                    } catch (Exception e) {
//                        throw new IllegalStateException("Test data init failed", e);
//                    }
//                }
//            });
//        }
//    }
}