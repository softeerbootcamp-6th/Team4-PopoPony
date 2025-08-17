package com.todoc.server;

import com.todoc.server.domain.latestlocation.repository.LocationCacheRepository;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
public abstract class IntegrationTestBase {
    @MockBean
    LocationCacheRepository locationCacheRepository;
}