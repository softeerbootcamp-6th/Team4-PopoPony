# 1단계: 빌드
FROM --platform=$BUILDPLATFORM gradle:8.8-jdk21 AS builder
WORKDIR /app

# Gradle 캐시 유지 (wrapper, gradle.build.kts, settings.gradle.kts만 복사)
COPY build.gradle.kts settings.gradle.kts ./
COPY gradle ./gradle

# 나머지 소스 복사
COPY . .

# 빌드 실행
RUN gradle bootJar --no-daemon

# 2단계: 실행
FROM --platform=linux/arm64 openjdk:21-jdk
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
