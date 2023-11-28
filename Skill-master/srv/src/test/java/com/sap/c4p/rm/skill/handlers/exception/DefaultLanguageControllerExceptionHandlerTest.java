package com.sap.c4p.rm.skill.handlers.exception;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Locale;

import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;

import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.skill.utils.HttpStatus;

class DefaultLanguageControllerExceptionHandlerTest {

  private DefaultLanguageControllerExceptionHandler cut = new DefaultLanguageControllerExceptionHandler();
  private Locale locale = Locale.getDefault();

  @Test
  void testHandleServiceException() {
    ResponseEntity<String> responseEntity = this.cut
        .handleServiceException(new ServiceException(HttpStatus.BAD_REQUEST, ""), this.locale);
    assertEquals(HttpStatus.BAD_REQUEST.getHttpStatus(), responseEntity.getStatusCodeValue());
  }

  @Test
  void testHandleAccessDenied() {
    ResponseEntity<String> responseEntity = this.cut.handleAccessDeniedException(new AccessDeniedException(""),
        this.locale);
    assertEquals(HttpStatus.FORBIDDEN.getHttpStatus(), responseEntity.getStatusCodeValue());
  }
}
