package com.todoc.server;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles("test")
@SpringBootTest
//@Import(TestContainerConfig.class
@Disabled
class ServerApplicationTests {

	@Test
	void contextLoads() {
	}

}
