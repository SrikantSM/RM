package com.sap.c4p.rm.projectintegrationadapter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.context.annotation.ComponentScan;

@ComponentScan({ "com.sap.cloud.sdk", "com.sap.c4p.rm.projectintegrationadapter" })
@ServletComponentScan({ "com.sap.cloud.sdk", "com.sap.c4p.rm.projectintegrationadapter" })
@SpringBootApplication
public class Application {

  public static void main(String[] args) {
    SpringApplication.run(Application.class, args);
  }

}
