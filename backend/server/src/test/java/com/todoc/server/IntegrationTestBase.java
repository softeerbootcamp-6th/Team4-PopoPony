package com.todoc.server;

import com.todoc.server.domain.latestlocation.repository.LocationCacheRepository;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest
@ActiveProfiles("test")
public abstract class IntegrationTestBase {
    @MockitoBean
    LocationCacheRepository locationCacheRepository;
}