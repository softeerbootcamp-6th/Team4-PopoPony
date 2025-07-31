package com.todoc.server.common.exception;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;


@WebMvcTest(controllers = ExceptionTestController.class)
@Import(GlobalExceptionHandler.class)
class GlobalExceptionHandlerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void handleException() throws Exception {

        // 에러 코드가 테스트 코드까지 전파되는지 or GlobalExceptionHanlder에 의해 처리되는지 확인합니다.
        assertDoesNotThrow(() ->
                mockMvc.perform(get("/test/auth"))
        );
}

    @Test
    void handleAuthException() throws Exception {
        assertDoesNotThrow(() ->
                mockMvc.perform(get("/test"))
        );
    }
}