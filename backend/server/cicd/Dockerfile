FROM eclipse-temurin:21-jdk-alpine AS builder
ARG JAR_FILE=server-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar

FROM eclipse-temurin:21-jre-alpine
COPY --from=builder app.jar /app.jar

# exec form 대신 shell form 사용
ENTRYPOINT java \
    -Dspring.profiles.active=prod \
    -DDB_URL=$DB_URL \
    -DDB_USERNAME=$DB_USERNAME \
    -DDB_PASSWORD=$DB_PASSWORD \
    -jar /app.jar
