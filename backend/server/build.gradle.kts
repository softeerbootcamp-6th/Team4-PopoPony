plugins {
	java
	id("org.springframework.boot") version "3.5.4"
	id("io.spring.dependency-management") version "1.1.7"
}

group = "com.todoc"
version = "0.0.1-SNAPSHOT"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(21)
	}
}

val querydslVersion = "5.0.0"

configurations {
	compileOnly {
		extendsFrom(configurations.annotationProcessor.get())
	}
}

repositories {
	mavenCentral()
}

dependencies {
	// Spring Boot 기본
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")

	// Validation
	implementation("org.springframework.boot:spring-boot-starter-validation")

	// DB
	implementation("mysql:mysql-connector-java:8.0.33")
	testImplementation("com.h2database:h2")

	// Lombok
	compileOnly("org.projectlombok:lombok")
	annotationProcessor("org.projectlombok:lombok")

	// QueryDSL (jakarta 버전)
	implementation("com.querydsl:querydsl-jpa:${dependencyManagement.importedProperties["querydsl.version"]}:jakarta")
	annotationProcessor("com.querydsl:querydsl-apt:${dependencyManagement.importedProperties["querydsl.version"]}:jakarta")
	annotationProcessor("jakarta.persistence:jakarta.persistence-api")
	annotationProcessor("jakarta.annotation:jakarta.annotation-api")

	// JUnit5
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")

	// Swagger
	implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.9")
	implementation("org.apache.commons:commons-lang3:3.14.0")

	// for health-check + 애플리케이션의 운영 및 모니터링 기능
	implementation("org.springframework.boot:spring-boot-starter-actuator")
	implementation("io.micrometer:micrometer-core")
	implementation("io.micrometer:micrometer-registry-cloudwatch2")

	// S3
	implementation(platform("software.amazon.awssdk:bom:2.31.78"))
	implementation("software.amazon.awssdk:s3")
	implementation("software.amazon.awssdk:sts")

	// 로그인 비밀번호 처리
	implementation("org.mindrot:jbcrypt:0.4")

	// redis
	implementation("org.springframework.boot:spring-boot-starter-data-redis")

	// logging
	implementation ("org.springframework.boot:spring-boot-starter-aop")

	// CloudWatch
	implementation(platform("software.amazon.awssdk:bom:2.31.78"))
	implementation("software.amazon.awssdk:cloudwatch")

	// WebSocket
	implementation ("org.springframework.boot:spring-boot-starter-websocket")

	// SMS
	implementation("net.nurigo:sdk:4.3.2")
}

val querydslDir = layout.buildDirectory.dir("generated/querydsl")

sourceSets["main"].java.srcDir(querydslDir)

tasks.withType<JavaCompile>().configureEach {
	options.compilerArgs.addAll(
		listOf(
			"-Aquerydsl.generatedSourcesDir=${querydslDir.get().asFile.absolutePath}"
		)
	)
}

tasks.withType<Test> {
	useJUnitPlatform()
}
