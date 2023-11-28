package com.sap.c4p.rm.skill.handlers.exception;

import java.sql.Timestamp;
import java.util.Date;
import java.util.Locale;

import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.skill.exceptions.UnexpectedErrorServiceException;
import com.sap.c4p.rm.skill.gen.MessageKeys;
import com.sap.c4p.rm.skill.utils.HttpStatus;

public abstract class ControllerExceptionHandler {

  @ExceptionHandler(Exception.class)
  public ResponseEntity<String> handleException(final Exception exception, final Locale locale) {
    return this.handleServiceException(new UnexpectedErrorServiceException(exception), locale);
  }

  @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
  public ResponseEntity<String> handleHttpRequestMethodNotSupportedException(
      final HttpRequestMethodNotSupportedException exception, final Locale locale) {
    return this.handleServiceException(new ServiceException(HttpStatus.METHOD_NOT_ALLOWED,
        MessageKeys.METHOD_NOT_ALLOWED, exception.getMethod(), exception), locale);
  }

  @ExceptionHandler(MissingRequestHeaderException.class)
  public ResponseEntity<String> handleMissingRequestHeaderException(final MissingRequestHeaderException exception,
      final Locale locale) {
    return this.handleServiceException(new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.MISSING_REQUEST_HEADER,
        exception.getHeaderName(), exception), locale);
  }

  ResponseEntity<String> createResponse(final String path, final ServiceException exception, final Locale locale) {
    JSONObject json = new JSONObject();
    json.put("timestamp", new Timestamp(new Date().getTime()));
    json.put("status", exception.getErrorStatus().getHttpStatus());
    json.put("error", exception.getErrorStatus().toString());
    json.put("message", exception.getLocalizedMessage(locale));
    json.put("path", path);
    return ResponseEntity.status(exception.getErrorStatus().getHttpStatus()).header("Content-Type", "application/json")
        .body(json.toString());
  }

  abstract ResponseEntity<String> handleServiceException(final ServiceException serviceException, final Locale locale);
}
