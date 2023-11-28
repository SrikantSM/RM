package com.sap.c4p.rm.consultantprofile.controller;

import java.io.IOException;

import jakarta.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;

import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.consultantprofile.gen.MessageKeys;
import com.sap.c4p.rm.consultantprofile.utils.LocalizedMessageSource;

/**
 * Contains handlers for exceptions occurring during the availability file
 * upload
 */
@Configuration
@ControllerAdvice(basePackages = "com.sap.c4p.rm.consultantprofile.controller")
public class GenericControllerAdvice {

    public static final String MAX_FILE_SIZE_ENV_PARAM = "spring.servlet.multipart.max-file-size";
    private static final Logger LOGGER = LoggerFactory.getLogger(GenericControllerAdvice.class);

    private Environment environment;
    private LocalizedMessageSource localizedMessageSource;

    private static final String LOGGER_MESSAGE = "@ExceptionHandler: ControllerAdvice {}";

    @Autowired
    public void setEnvironment(final Environment environment, final LocalizedMessageSource localizedMessageSource) {
        this.environment = environment;
        this.localizedMessageSource = localizedMessageSource;
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleException(final Exception exception, final HttpServletResponse response) {
        LOGGER.warn(LOGGER_MESSAGE, exception.getMessage(), exception.getCause());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                localizedMessageSource.getLocalizedMessageSource(MessageKeys.UNEXPECTED_ERROR_OCCURRED, exception));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Object> handleAccessDeniedException(final AccessDeniedException exception,
            final HttpServletResponse response) {
        LOGGER.warn(LOGGER_MESSAGE, exception.getMessage(), exception.getCause());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                localizedMessageSource.getLocalizedMessageSource(MessageKeys.FILE_UPLOAD_ACCESS_DENIED, exception));
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<Object> handleHttpMediaTypeNotSupportedException(
            final HttpMediaTypeNotSupportedException exception, final HttpServletResponse response) {
        return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body(localizedMessageSource
                .getLocalizedMessageSource(MessageKeys.UNSUPPORTED_MEDIA_TYPE, exception.getContentType(), exception));
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<Object> handleHttpRequestMethodNotSupportedException(
            final HttpRequestMethodNotSupportedException exception, final HttpServletResponse response) {
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED)
                .body(localizedMessageSource.getLocalizedMessageSource(MessageKeys.METHOD_NOT_ALLOWED, exception));
    }

    @ExceptionHandler(IOException.class)
    public ResponseEntity<Object> handleIOException(final IOException exception, final HttpServletResponse response) {
        LOGGER.warn(LOGGER_MESSAGE, exception.getMessage(), exception.getCause());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(localizedMessageSource.getLocalizedMessageSource(MessageKeys.IO_EXCEPTION_FILE_UPLOAD));
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Object> handleMaxFileUploadException(final MaxUploadSizeExceededException exception,
            final HttpServletResponse response) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(localizedMessageSource.getLocalizedMessageSource(MessageKeys.MAX_FILE_UPLOAD_SIZE_EXCEEDED,
                        this.environment.getProperty(GenericControllerAdvice.MAX_FILE_SIZE_ENV_PARAM, "99")));
    }

    @ExceptionHandler(MissingRequestHeaderException.class)
    public ResponseEntity<Object> handleMissingRequestHeaderException(final MissingRequestHeaderException exception,
            final HttpServletResponse response) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(localizedMessageSource
                .getLocalizedMessageSource(MessageKeys.MISSING_REQUEST_HEADER, exception.getHeaderName(), exception));
    }

    @ExceptionHandler(MissingServletRequestPartException.class)
    public ResponseEntity<String> handleMissingServletRequestPartException(
            final MissingServletRequestPartException exception, HttpServletResponse response) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(localizedMessageSource
                .getLocalizedMessageSource(MessageKeys.NO_FILE_SPECIFIED, exception.getCause(), exception));
    }

    @ExceptionHandler(ServiceException.class)
    public ResponseEntity<Object> handleServiceException(final ServiceException exception,
            HttpServletResponse response) {
        LOGGER.warn(LOGGER_MESSAGE, exception.getMessage(), exception.getCause());
        return ResponseEntity.status(exception.getErrorStatus().getHttpStatus())
                .body(exception.getLocalizedMessage(LocaleContextHolder.getLocale()));
    }

}
