package com.sap.c4p.rm.skill.handlers.exception;

import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;

import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.skill.config.LoggingMarker;
import com.sap.c4p.rm.skill.controllers.FileUploadController;
import com.sap.c4p.rm.skill.gen.MessageKeys;
import com.sap.c4p.rm.skill.utils.HttpStatus;

/**
 * Contains handlers for exceptions occurring during the skill file download
 */
@Configuration
@ControllerAdvice(assignableTypes = FileUploadController.class)
class FileUploadControllerExceptionHandler extends ControllerExceptionHandler {

  public static final String MAX_FILE_SIZE_ENV_PARAM = "spring.servlet.multipart.max-file-size";

  private static final Logger LOGGER = LoggerFactory.getLogger(FileUploadControllerExceptionHandler.class);
  private static final Marker MARKER = LoggingMarker.FILE_UPLOAD.getMarker();

  private final Environment environment;

  @Autowired
  public FileUploadControllerExceptionHandler(final Environment environment) {
    this.environment = environment;
  }

  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<String> handleAccessDeniedException(final AccessDeniedException exception,
      final Locale locale) {
    return this.handleServiceException(
        new ServiceException(HttpStatus.FORBIDDEN, MessageKeys.FILE_UPLOAD_ACCESS_DENIED, exception), locale);
  }

  @ExceptionHandler(MaxUploadSizeExceededException.class)
  public ResponseEntity<String> handleMaxFileUploadException(final MaxUploadSizeExceededException exception,
      final Locale locale) {
    return this.handleServiceException(new ServiceException(HttpStatus.BAD_REQUEST,
        MessageKeys.MAX_FILE_UPLOAD_SIZE_EXCEEDED,
        this.environment.getProperty(FileUploadControllerExceptionHandler.MAX_FILE_SIZE_ENV_PARAM, "99"), exception),
        locale);
  }

  @ExceptionHandler(MultipartException.class)
  public ResponseEntity<String> handleMultipartException(final MultipartException exception, final Locale locale) {
    return this.handleServiceException(
        new ServiceException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, MessageKeys.FILE_UPLOAD_MULTIPART_REQUIRED, exception),
        locale);
  }

  @ExceptionHandler(MissingServletRequestPartException.class)
  public ResponseEntity<String> handleMissingServletRequestPartException(
      final MissingServletRequestPartException exception, final Locale locale) {
    return this.handleServiceException(
        new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.NO_FILE_SPECIFIED, exception), locale);
  }

  @Override
  @ExceptionHandler(ServiceException.class)
  public ResponseEntity<String> handleServiceException(final ServiceException exception, final Locale locale) {
    FileUploadControllerExceptionHandler.LOGGER.info(MARKER, exception.getMessage(), exception.getCause());
    return this.createResponse("/api/internal/upload/skills/csv", exception, locale);
  }
}
