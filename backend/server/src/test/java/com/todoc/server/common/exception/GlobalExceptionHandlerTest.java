package com.todoc.server.common.exception;

import com.todoc.server.common.exception.global.CommonResponseCode;
import com.todoc.server.common.exception.global.GlobalExceptionHandler;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@WebMvcTest(controllers = ExceptionTestController.class)
@Import(GlobalExceptionHandler.class)
class GlobalExceptionHandlerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("AuthException - Not Found을 Catch 하는지 확인")
    void handleAuthException() throws Exception {
        mockMvc.perform(get("/test/auth"))
                .andExpect(jsonPath("$.code").value(11001))
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value(CommonResponseCode.NOT_FOUND.toString()))
                .andExpect(jsonPath("$.data").value("유저가 존재하지 않습니다."));
    }

    @Test
    @DisplayName("일반 RuntimeException을 Catch 하는지 확인")
    void handleUnexpectedRuntimeException() throws Exception {
        mockMvc.perform(get("/test"))
                .andExpect(jsonPath("$.code").value(10009))
                .andExpect(jsonPath("$.status").value(500))
                .andExpect(jsonPath("$.message").value(CommonResponseCode.INTERNAL_SERVER_ERROR.toString()))
                .andExpect(jsonPath("$.data").value("Internal Server Error."));
    }
}