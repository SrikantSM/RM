package com.sap.c4p.rm.skill.handlers.exception;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.IOException;
import java.util.Locale;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.skill.gen.MessageKeys;
import com.sap.c4p.rm.skill.testconfig.SpringBootTestWithoutSharedSqliteCache;
import com.sap.c4p.rm.skill.utils.HttpStatus;

@SpringBootTestWithoutSharedSqliteCache
class FileDownloadControllerExceptionHandlerTest {

  /** object under test */
  private FileDownloadControllerExceptionHandler cut;

  private Locale locale;

  /**
   * initialize object under test and spy response
   */
  @BeforeEach
  void setUp() {
    this.locale = Locale.getDefault();
    this.cut = new FileDownloadControllerExceptionHandler();
  }

  @Test
  @DisplayName("verify that handleAccessDeniedException() forwards the message stored in ServiceException to response properly")
  void handleAccessDeniedException() throws IOException {
    final AccessDeniedException e = new AccessDeniedException(MessageKeys.FILE_DOWNLOAD_ACCESS_DENIED);
    final ServiceException serviceException = new ServiceException(MessageKeys.FILE_DOWNLOAD_ACCESS_DENIED);
    final ResponseEntity<String> responseEntity = this.cut.handleAccessDeniedException(e, this.locale);
    assertEquals(HttpStatus.FORBIDDEN.getHttpStatus(), responseEntity.getStatusCodeValue());
    this.assertMessageIncluded(serviceException, responseEntity);
  }

  @Test
  @DisplayName("verify that handleServiceException() forwards the message stored in ServiceException to response properly")
  void handleServiceException() throws IOException {
    final ServiceException e = new ServiceException(HttpStatus.FORBIDDEN, "unit-test-service-exception");

    final ResponseEntity<String> responseEntity = this.cut.handleServiceException(e, this.locale);
    assertEquals(responseEntity.getStatusCodeValue(), HttpStatus.FORBIDDEN.getHttpStatus());
    assertEquals("application/json", responseEntity.getHeaders().getContentType().toString());
    this.assertMessageIncluded(e, responseEntity);
  }

  private void assertMessageIncluded(ServiceException serviceException, ResponseEntity<String> responseEntity)
      throws JsonProcessingException {
    String message = new ObjectMapper().readValue(responseEntity.getBody(), ObjectNode.class).get("message")
        .textValue();
    assertEquals(serviceException.getLocalizedMessage(this.locale), message);
  }
}
