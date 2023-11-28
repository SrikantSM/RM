package com.sap.c4p.rm.skill.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.io.IOException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import com.sap.c4p.rm.skill.services.SkillFileDownloadService;
import com.sap.c4p.rm.skill.services.validators.LanguageCodeValidator;

class FileDownloadControllerTest {

  /** object under test */
  private FileDownloadController cut;

  /** mock handler */
  private SkillFileDownloadService downloadHandler;
  private LanguageCodeValidator languageCodeValidator;
  private StreamingResponseBody mockStreamingResponseBody;

  private static final String ENGLISH = "en";

  @BeforeEach
  void setUp() throws IOException {
    this.mockStreamingResponseBody = mock(StreamingResponseBody.class);
    this.downloadHandler = mock(SkillFileDownloadService.class);
    this.languageCodeValidator = mock(LanguageCodeValidator.class);
    when(this.downloadHandler.handleDownload(any(String.class)))
        .thenReturn(ResponseEntity.ok().body(this.mockStreamingResponseBody));
    this.cut = new FileDownloadController(this.downloadHandler, this.languageCodeValidator);
  }

  @Test
  void handleFileDownloadService() throws IOException {
    assertEquals(ResponseEntity.ok().body(this.mockStreamingResponseBody),
        this.cut.handleFileDownloadService(FileDownloadControllerTest.ENGLISH));
  }

}
