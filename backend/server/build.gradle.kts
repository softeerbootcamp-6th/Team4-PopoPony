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

val querydslVersion = "4.4.0"

configurations {
	compileOnly {
		extendsFrom(configurations.annotationProcessor.get())
	}
}

repositories {
	mavenCentral()
}

dependencies {
	// ✅ Spring Boot 기본
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")

	// ✅ Validation
	implementation("org.springframework.boot:spring-boot-starter-validation")

	// ✅ DB
	implementation("com.h2database:h2")
	runtimeOnly("org.postgresql:postgresql")

	// ✅ Lombok
	compileOnly("org.projectlombok:lombok")
	annotationProcessor("org.projectlombok:lombok")

	// ✅ QueryDSL (jakarta 버전)
	implementation("com.querydsl:querydsl-jpa:$querydslVersion")
	annotationProcessor("com.querydsl:querydsl-apt:$querydslVersion:jpa")

	// ✅ JUnit5
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")

	// ✅ Swagger
	implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.9")
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
