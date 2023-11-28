package com.sap.c4p.rm.skill.handlers.exception;

import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.skill.config.LoggingMarker;
import com.sap.c4p.rm.skill.controllers.DefaultLanguageController;
import com.sap.c4p.rm.skill.utils.HttpStatus;

@Configuration
@ControllerAdvice(assignableTypes = DefaultLanguageController.class)
public class DefaultLanguageControllerExceptionHandler extends ControllerExceptionHandler {

  private static final Logger LOGGER = LoggerFactory.getLogger(DefaultLanguageControllerExceptionHandler.class);
  private static final Marker MARKER = LoggingMarker.DEFAULT_LANGUAGE_HANDLER.getMarker();

  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<String> handleAccessDeniedException(final AccessDeniedException exception,
      final Locale locale) {
    return this.handleServiceException(new ServiceException(HttpStatus.FORBIDDEN, "Access denied", exception), locale);
  }

  @Override
  @ExceptionHandler(ServiceException.class)
  public ResponseEntity<String> handleServiceException(ServiceException exception, Locale locale) {
    LOGGER.info(MARKER, exception.getMessage(), exception.getCause());
    return this.createResponse("/api/internal/default-language", exception, locale);
  }

}
