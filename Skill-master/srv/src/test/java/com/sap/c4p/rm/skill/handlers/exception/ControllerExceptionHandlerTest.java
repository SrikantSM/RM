package com.sap.c4p.rm.skill.handlers.exception;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.IOException;
import java.util.Locale;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.core.MethodParameter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MissingRequestHeaderException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.skill.controllers.FileUploadController;
import com.sap.c4p.rm.skill.exceptions.UnexpectedErrorServiceException;
import com.sap.c4p.rm.skill.gen.MessageKeys;
import com.sap.c4p.rm.skill.testconfig.SpringBootTestWithoutSharedSqliteCache;
import com.sap.c4p.rm.skill.utils.HttpStatus;
import com.sap.c4p.rm.skill.utils.SkillTestHelper;

@SpringBootTestWithoutSharedSqliteCache
class ControllerExceptionHandlerTest {

  /** object under test */
  private ControllerExceptionHandler cut;

  private Locale locale;

  /**
   * initialize object under test and spy response
   */
  @BeforeEach
  void setUp() {
    this.locale = Locale.getDefault();
    this.cut = new ControllerExceptionHandler() {
      @Override
      ResponseEntity<String> handleServiceException(ServiceException serviceException, Locale locale) {
        return this.createResponse("", serviceException, locale);
      }
    };
  }

  @Test
  @DisplayName("verify that createResponse() works as expected")
  void createResponse() throws IOException {
    final ServiceException serviceException = new ServiceException(HttpStatus.METHOD_NOT_ALLOWED,
        MessageKeys.METHOD_NOT_ALLOWED);
    final ResponseEntity<String> responseEntity = this.cut.createResponse(SkillTestHelper.SERVICE_PATH,
        serviceException, this.locale);

    assertEquals(HttpStatus.METHOD_NOT_ALLOWED.getHttpStatus(), responseEntity.getStatusCodeValue());
    this.assertMessageIncluded(serviceException, responseEntity);
  }

  @Test
  @DisplayName("verify that handleHttpRequestMethodNotSupportedException() forwards the expected ServiceException to the response in case of a HttpRequestMethodNotSupportedException")
  void handleHttpRequestMethodNotSupportedException() throws IOException, NoSuchMethodException, SecurityException {
    final HttpRequestMethodNotSupportedException e = new HttpRequestMethodNotSupportedException("{0}");
    final ServiceException serviceException = new ServiceException(MessageKeys.METHOD_NOT_ALLOWED);
    final ResponseEntity<String> responseEntity = this.cut.handleHttpRequestMethodNotSupportedException(e, this.locale);
    assertEquals(HttpStatus.METHOD_NOT_ALLOWED.getHttpStatus(), responseEntity.getStatusCodeValue());
    this.assertMessageIncluded(serviceException, responseEntity);
  }

  @Test
  @DisplayName("verify that handleMissingRequestHeaderException() forwards the expected ServiceException to the response in case of a MissingRequestHeaderException")
  void handleMissingRequestHeaderException() throws IOException, NoSuchMethodException, SecurityException {
    final MissingRequestHeaderException e = new MissingRequestHeaderException("header",
        new MethodParameter(FileUploadController.class.getMethods()[0], 0));
    final ServiceException serviceException = new ServiceException(MessageKeys.MISSING_REQUEST_HEADER, "header");
    final ResponseEntity<String> responseEntity = this.cut.handleMissingRequestHeaderException(e, this.locale);
    assertEquals(HttpStatus.BAD_REQUEST.getHttpStatus(), responseEntity.getStatusCodeValue());
    this.assertMessageIncluded(serviceException, responseEntity);
  }

  @Test
  @DisplayName("verify that handleException() forwards the expected ServiceException to the response in case of any other Exception")
  void handleException() throws IOException {
    final Exception e = new Exception();
    final ServiceException serviceException = new UnexpectedErrorServiceException();
    final ResponseEntity<String> responseEntity = this.cut.handleException(e, this.locale);

    assertEquals(HttpStatus.INTERNAL_SERVER_ERROR.getHttpStatus(), responseEntity.getStatusCodeValue());
    this.assertMessageIncluded(serviceException, responseEntity);
  }

  private void assertMessageIncluded(ServiceException serviceException, ResponseEntity<String> responseEntity)
      throws JsonProcessingException {
    String message = new ObjectMapper().readValue(responseEntity.getBody(), ObjectNode.class).get("message")
        .textValue();
    assertEquals(serviceException.getLocalizedMessage(this.locale), message);
  }
}
