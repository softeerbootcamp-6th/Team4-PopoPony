package com.todoc.server.common.util;

import com.fasterxml.jackson.core.type.TypeReference;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class JsonUtilsTest {

    @Test
    @DisplayName("객체 -> JSON 문자열로 직렬화")
    void toJson_class() {
        TestDto testDto = new TestDto("홍길동", 30);
        String json = JsonUtils.toJson(testDto);

        assertThat(json).isEqualTo("{\"name\":\"홍길동\",\"age\":30}");
    }

    @Test
    @DisplayName("List -> JSON 문자열로 직렬화")
    void toJson_list() {
        List<String> values = List.of("친절함", "책임감");
        String json = JsonUtils.toJson(values);

        assertThat(json).isEqualTo("[\"친절함\",\"책임감\"]");
    }

    @Test
    @DisplayName("JSON 문자열 -> 객체로 역직렬화 (Class<T>)")
    void fromJson_class() {
        String json = "{\"name\":\"홍길동\",\"age\":30}";
        TestDto testDto = JsonUtils.fromJson(json, TestDto.class);

        assertThat(testDto).isNotNull();
        assertThat(testDto.getName()).isEqualTo("홍길동");
        assertThat(testDto.getAge()).isEqualTo(30);
    }

    @Test
    @DisplayName("JSON 배열 -> List로 역직렬화 (TypeReference<T>)")
    void fromJson_list() {
        String json = "[\"A\", \"B\", \"C\"]";
        List<String> list = JsonUtils.fromJson(json, new TypeReference<List<String>>() {});

        assertThat(list).containsExactly("A", "B", "C");
    }

    @Test
    @DisplayName("JSON 객체 -> Map으로 역직렬화 (TypeReference<T>)")
    void fromJson_map() {
        String json = "{\"key1\": \"value1\", \"key2\": \"value2\"}";
        Map<String, String> map = JsonUtils.fromJson(json, new TypeReference<Map<String, String>>() {});

        assertThat(map).hasSize(2);
        assertThat(map.get("key1")).isEqualTo("value1");
        assertThat(map.get("key2")).isEqualTo("value2");
    }

    // 테스트용 DTO
    static class TestDto {
        private String name;
        private int age;

        public TestDto() {}

        public TestDto(String name, int age) {
            this.name = name;
            this.age = age;
        }

        public String getName() {
            return name;
        }

        public int getAge() {
            return age;
        }
    }
}