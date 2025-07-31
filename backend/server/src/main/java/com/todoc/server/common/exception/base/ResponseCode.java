package com.todoc.server.common.exception.base;

public interface ResponseCode {
    int getCode();
    int getStatus();
    String getMessage();
}
