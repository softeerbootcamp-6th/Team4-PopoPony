# 1단계: 경량 JDK 빌드 환경 (필요 시 빌드 포함)
FROM eclipse-temurin:21-jdk-alpine AS builder
ARG JAR_FILE=server-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar

# 2단계: 경량 JRE 런타임 환경
FROM eclipse-temurin:21-jre-alpine

COPY --from=builder app.jar /app.jar

ENTRYPOINT ["java", \
    "-Dspring.profiles.active=prod", \
    "-DDB_URL=$DB_URL", \
    "-DDB_USERNAME=$DB_USERNAME", \
    "-DDB_PASSWORD=$DB_PASSWORD", \
    "-jar", "/app.jar"]