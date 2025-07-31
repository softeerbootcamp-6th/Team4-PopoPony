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
    public void error() {
        throw new RuntimeException();
    }

    @GetMapping("/auth")
    public void errorAuth() {
        throw new AuthException(AuthErrorCode.AUTH_NOT_FOUND);
    }
}
