package com.todoc.server.common.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class JsonUtil {

    private static final Logger log = LoggerFactory.getLogger(JsonUtil.class);
    private static final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Java 객체 → JSON 문자열
     *
     * @param object 직렬화할 Java 객체
     * @return JSON 문자열, 실패 시 null 반환
     */
    public static String toJson(Object object) {
        try {
            return objectMapper.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            log.error("JSON 직렬화 실패: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * JSON 문자열 → Java 객체
     *
     * @param json  역직렬화할 JSON 문자열
     * @param clazz 역직렬화할 클래스 타입
     * @param <T>   반환될 객체의 타입
     * @return 역직렬화된 Java 객체, 실패 시 null 반환
     */
    public static <T> T fromJson(String json, Class<T> clazz) {
        try {
            return objectMapper.readValue(json, clazz);
        } catch (JsonProcessingException e) {
            log.error("JSON 역직렬화 실패: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * JSON 문자열 → 복잡한 제네릭 타입 (ex. List<String>, Map<String, Object> 등)
     * @param json    역직렬화할 JSON 문자열
     * @param typeRef 역직렬화할 제네릭 타입 참조 (예: {@code new TypeReference<List<String>>() {}})
     * @param <T>     반환될 객체의 타입
     * @return 역직렬화된 Java 객체, 실패 시 null 반환
     */
    public static <T> T fromJson(String json, TypeReference<T> typeRef) {
        try {
            return objectMapper.readValue(json, typeRef);
        } catch (JsonProcessingException e) {
            log.error("JSON 역직렬화 실패: {}", e.getMessage(), e);
            return null;
        }
    }
}
