package com.todoc.server.common.exception;

import com.todoc.server.domain.auth.exception.AuthErrorCode;
import com.todoc.server.domain.auth.exception.AuthException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class ExceptionTestController {

    @GetMapping("")
    public void throwRuntimeException() {
        throw new RuntimeException();
    }

    @GetMapping("/auth")
    public void throwAuthNotFound() {
        throw new AuthException(AuthErrorCode.NOT_FOUND);
    }
}
