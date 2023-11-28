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
import com.sap.c4p.rm.skill.controllers.FileDownloadController;
import com.sap.c4p.rm.skill.gen.MessageKeys;
import com.sap.c4p.rm.skill.utils.HttpStatus;

/**
 * Contains handlers for exceptions occurring during the skill file download
 */
@Configuration
@ControllerAdvice(assignableTypes = FileDownloadController.class)
class FileDownloadControllerExceptionHandler extends ControllerExceptionHandler {

  private static final Logger LOGGER = LoggerFactory.getLogger(FileDownloadControllerExceptionHandler.class);
  private static final Marker MARKER = LoggingMarker.FILE_DOWNLOAD.getMarker();

  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<String> handleAccessDeniedException(final AccessDeniedException exception,
      final Locale locale) {
    return this.handleServiceException(
        new ServiceException(HttpStatus.FORBIDDEN, MessageKeys.FILE_DOWNLOAD_ACCESS_DENIED, exception), locale);
  }

  @Override
  @ExceptionHandler(ServiceException.class)
  public ResponseEntity<String> handleServiceException(final ServiceException exception, final Locale locale) {
    FileDownloadControllerExceptionHandler.LOGGER.info(MARKER, exception.getMessage(), exception.getCause());
    return this.createResponse("/api/internal/download/skills/csv", exception, locale);
  }
}
