FROM openjdk:21
ARG JAR_FILE=server-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} /app.jar
ENTRYPOINT ["sh", "-c", "java -Dspring.profiles.active=prod -DDB_URL=$DB_URL -DDB_USERNAME=$DB_USERNAME -DDB_PASSWORD=$DB_PASSWORD -jar /app.jar"]
