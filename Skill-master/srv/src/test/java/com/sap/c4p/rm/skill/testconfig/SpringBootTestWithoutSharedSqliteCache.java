package com.sap.c4p.rm.skill.testconfig;

import static java.lang.annotation.ElementType.TYPE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import org.springframework.boot.test.context.SpringBootTest;

@Retention(RUNTIME)
@Target(TYPE)
@SpringBootTest(properties = "spring.datasource.url=jdbc:sqlite:file::memory:")
public @interface SpringBootTestWithoutSharedSqliteCache {

}
