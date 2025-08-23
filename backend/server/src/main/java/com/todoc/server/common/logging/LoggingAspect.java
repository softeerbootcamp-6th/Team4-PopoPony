package com.todoc.server.common.logging;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

@Slf4j
@Aspect
@Component
public class LoggingAspect {

    @Pointcut("within(@org.springframework.web.bind.annotation.RestController *)")
    public void controller() {}

    // Service 계층
    @Pointcut("within(com.todoc.server..service..*)")
    public void service() {}

    // Repository 계층
    @Pointcut("within(com.todoc.server..repository..*)")
    public void repository() {}

    // 공통 실행 로깅
    @Around("controller() || service() || repository()")
    public Object logExecution(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();

        // 메서드 시그니처
        String methodName = joinPoint.getSignature().toShortString();
        Object[] args = joinPoint.getArgs();

        // 파라미터 줄이기
        StringBuilder params = new StringBuilder();
        for (Object arg : args) {
            params.append(truncate(arg)).append(", ");
        }

        log.info("➡️ {} 호출  parameters= {}", methodName, params);

        try {
            Object result = joinPoint.proceed();

            long elapsedTime = System.currentTimeMillis() - start;
            log.info("⬅️ {} 처리 완료 / 실행시간 {} ms", methodName, elapsedTime);

            return result;
        } catch (Throwable t) {
            log.error("❌ {} threw exception: {}", methodName, t.getMessage(), t);
            throw t;
        }
    }

    private String truncate(Object arg) {
        String str = String.valueOf(arg);
        int maxLength = 200; // 최대 200자까지만
        return str.length() > maxLength ? str.substring(0, maxLength) + "...(truncated)" : str;
    }

}
