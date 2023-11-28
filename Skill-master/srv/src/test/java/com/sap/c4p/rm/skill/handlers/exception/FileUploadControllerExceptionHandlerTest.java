package com.sap.c4p.rm.skill.handlers.exception;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.Locale;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.skill.gen.MessageKeys;
import com.sap.c4p.rm.skill.testconfig.SpringBootTestWithoutSharedSqliteCache;
import com.sap.c4p.rm.skill.utils.HttpStatus;

@SpringBootTestWithoutSharedSqliteCache
class FileUploadControllerExceptionHandlerTest {

  /** object under test */
  private FileUploadControllerExceptionHandler cut;

  private Environment mockEnvironment;

  private Locale locale;

  /**
   * initialize object under test and spy response
   */
  @BeforeEach
  void setUp() {
    this.mockEnvironment = mock(Environment.class);
    this.locale = Locale.getDefault();

    this.cut = new FileUploadControllerExceptionHandler(this.mockEnvironment);
  }

  @Test
  @DisplayName("verify that handleAccessDeniedException() forwards the message stored in ServiceException to response properly")
  void handleAccessDeniedException() throws IOException {
    final AccessDeniedException e = new AccessDeniedException(MessageKeys.FILE_UPLOAD_ACCESS_DENIED);
    final ServiceException serviceException = new ServiceException(MessageKeys.FILE_UPLOAD_ACCESS_DENIED);
    final ResponseEntity<String> responseEntity = this.cut.handleAccessDeniedException(e, this.locale);
    assertEquals(HttpStatus.FORBIDDEN.getHttpStatus(), responseEntity.getStatusCodeValue());
    this.assertMessageIncluded(serviceException, responseEntity);
  }

  @Test
  @DisplayName("verify that handleMaxFileUploadException() forwards the expected ServiceException to the response in case of a MaxUploadSizeExceededException")
  void handleMaxFileUploadException() throws IOException {
    final MaxUploadSizeExceededException e = new MaxUploadSizeExceededException(23L);
    final ServiceException serviceException = new ServiceException(MessageKeys.MAX_FILE_UPLOAD_SIZE_EXCEEDED, 10L);
    when(this.mockEnvironment.getProperty(eq(FileUploadControllerExceptionHandler.MAX_FILE_SIZE_ENV_PARAM),
        any(String.class))).thenReturn("10");

    final ResponseEntity<String> responseEntity = this.cut.handleMaxFileUploadException(e, this.locale);
    assertEquals(HttpStatus.BAD_REQUEST.getHttpStatus(), responseEntity.getStatusCodeValue());
    this.assertMessageIncluded(serviceException, responseEntity);
    assertEquals(23L, e.getMaxUploadSize());
  }

  @Test
  @DisplayName("verify that handleMultipartException() forwards the expected ServiceException in case a MultipartException occurs")
  void handleMultipartException() throws IOException {
    final MultipartException e = new MultipartException("");
    final ServiceException serviceException = new ServiceException(MessageKeys.FILE_UPLOAD_MULTIPART_REQUIRED);
    final ResponseEntity<String> responseEntity = this.cut.handleMultipartException(e, this.locale);

    assertEquals(HttpStatus.UNSUPPORTED_MEDIA_TYPE.getHttpStatus(), responseEntity.getStatusCodeValue());
    this.assertMessageIncluded(serviceException, responseEntity);
  }

  @Test
  @DisplayName("verify that handleMissingServletRequestPartException() forwards the expected ServiceException in case a MultipartException occurs")
  void handleMissingServletRequestPartException() throws IOException {
    final MissingServletRequestPartException e = new MissingServletRequestPartException("");
    final ServiceException serviceException = new ServiceException(HttpStatus.BAD_REQUEST,
        MessageKeys.NO_FILE_SPECIFIED);
    final ResponseEntity<String> responseEntity = this.cut.handleMissingServletRequestPartException(e, this.locale);

    assertEquals(HttpStatus.BAD_REQUEST.getHttpStatus(), responseEntity.getStatusCodeValue());
    this.assertMessageIncluded(serviceException, responseEntity);
  }

  @Test
  @DisplayName("verify that handleServiceException() forwards the message stored in ServiceException to response properly")
  void handleServiceException() throws IOException {
    final ServiceException e = new ServiceException(HttpStatus.FORBIDDEN, "unit-test-service-exception");

    final ResponseEntity<String> responseEntity = this.cut.handleServiceException(e, this.locale);
    assertEquals(HttpStatus.FORBIDDEN.getHttpStatus(), responseEntity.getStatusCodeValue());
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
