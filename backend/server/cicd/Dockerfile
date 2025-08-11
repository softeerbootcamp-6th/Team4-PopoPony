# 1단계: JAR 빌드
FROM --platform=linux/arm64 gradle:8.8-jdk21 AS builder
WORKDIR /app
COPY . .
RUN gradle bootJar -x test --no-daemon

# 2단계: 실행
FROM --platform=linux/arm64 openjdk:21
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
