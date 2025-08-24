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

	// test-container
	testImplementation("org.testcontainers:junit-jupiter:1.20.3") // 최신버전 확인
	testImplementation("org.testcontainers:mysql:1.20.3")
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

tasks.withType<Test>().configureEach {
	useJUnitPlatform()

	// 로그 파일 위치를 Logback에 전달
	systemProperty("LOG_DIR", "$buildDir/logs/test")
	// (선택) logback-test.xml을 확실히 사용하게
	systemProperty("logging.config", "classpath:logback-test.xml")
	// 한글 깨짐 방지
	jvmArgs("-Dfile.encoding=UTF-8")

	// 디렉터리 미리 만들어두기 (윈도우 포함 안전)
	doFirst {
		file("$buildDir/logs/test").mkdirs()
	}

	// 콘솔은 조용히 하고 싶다면 아래 그대로 두고,
	// 콘솔에도 보고 싶으면 showStandardStreams = true 로 바꿔.
	testLogging {
		events("failed")             // 실패만 이벤트 출력
		showStandardStreams = false  // 표준 출력은 숨김(파일로만)
	}
}
