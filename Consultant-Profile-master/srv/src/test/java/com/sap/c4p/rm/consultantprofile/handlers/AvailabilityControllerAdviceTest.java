package com.sap.c4p.rm.consultantprofile.handlers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import jakarta.servlet.http.HttpServletResponse;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.core.MethodParameter;
import org.springframework.core.env.Environment;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.consultantprofile.controller.AvailabilityController;
import com.sap.c4p.rm.consultantprofile.controller.GenericControllerAdvice;
import com.sap.c4p.rm.consultantprofile.gen.MessageKeys;
import com.sap.c4p.rm.consultantprofile.utils.HttpStatus;
import com.sap.c4p.rm.consultantprofile.utils.LocalizedMessageSource;

public class AvailabilityControllerAdviceTest {

    /** object under test */
    private GenericControllerAdvice cut;

    private Environment env;

    /** spy servlet response */
    private HttpServletResponse spyResponse;

    private ResponseEntity<?> responseEntity;

    @Mock
    private LocalizedMessageSource localizedMessageSource;

    /**
     * initialize object under test and spy response
     */
    @BeforeEach
    public void setUp() {
        this.cut = new GenericControllerAdvice();

        this.env = mock(Environment.class);
        this.localizedMessageSource = Mockito.mock(LocalizedMessageSource.class);

        this.cut.setEnvironment(this.env, this.localizedMessageSource);
        this.spyResponse = spy(HttpServletResponse.class);
    }

    @Test
    @DisplayName("verify that handleServiceException() forwards the message stored in ServiceException to response properly")
    public void handleServiceException() throws IOException {
        final ServiceException e = new ServiceException(HttpStatus.FORBIDDEN, "unit-test-service-exception");

        this.cut.handleServiceException(e, this.spyResponse);

        assertEquals(HttpStatus.FORBIDDEN, e.getErrorStatus());
        assertTrue(e.getLocalizedMessage().contains("unit-test-service-exception"));
    }

    @Test
    @DisplayName("verify that handleAccessDeniedException() forwards the message stored in ServiceException to response properly")
    public void handleAccessDeniedException() throws IOException {
        final ServiceException e = new ServiceException(HttpStatus.FORBIDDEN, MessageKeys.FILE_UPLOAD_ACCESS_DENIED);

        responseEntity = this.cut.handleAccessDeniedException(new AccessDeniedException(""), this.spyResponse);
        assertTrue(responseEntity.getStatusCode().is4xxClientError());
        assertEquals(responseEntity.getStatusCode().value(), e.getErrorStatus().getHttpStatus());
    }

    @Test
    @DisplayName("verify that handleMaxFileUploadException() forwards the expected ServiceException to the response in case of a MaxUploadSizeExceededException")
    public void handleMaxFileUploadException() throws IOException {
        final MaxUploadSizeExceededException e = new MaxUploadSizeExceededException(23L);

        when(this.env.getProperty(eq(GenericControllerAdvice.MAX_FILE_SIZE_ENV_PARAM), any(String.class)))
                .thenReturn("10");

        final ServiceException expectedException = new ServiceException(HttpStatus.BAD_REQUEST,
                MessageKeys.MAX_FILE_UPLOAD_SIZE_EXCEEDED, "10");

        responseEntity = this.cut.handleMaxFileUploadException(e, this.spyResponse);
        assertTrue(responseEntity.getStatusCode().is4xxClientError());
        assertEquals(responseEntity.getStatusCode().value(), expectedException.getErrorStatus().getHttpStatus());

    }

    @Test
    @DisplayName("verify that handleMissingRequestHeaderException() fowards the expected ServiceException to the response in case of a MissingRequestHeaderException")
    public void handleMissingRequestHeaderException() throws IOException, NoSuchMethodException, SecurityException {
        final MissingRequestHeaderException e = new MissingRequestHeaderException("header",
                new MethodParameter(AvailabilityController.class.getMethods()[0], 0));

        final ServiceException expectedException = new ServiceException(HttpStatus.BAD_REQUEST,
                MessageKeys.MISSING_REQUEST_HEADER, e.getHeaderName(), e);

        responseEntity = this.cut.handleMissingRequestHeaderException(e, this.spyResponse);
        assertEquals(responseEntity.getStatusCode().value(), expectedException.getErrorStatus().getHttpStatus());
        assertTrue(responseEntity.getStatusCode().is4xxClientError());
    }

    @Test
    @DisplayName("verify that handleException() forwards the expected ServiceException to the reponse in case of any other Exception")
    public void handleException() throws IOException {
        final Exception e = new Exception("any-unit-test-exception");

        final ServiceException expectedException = new ServiceException(HttpStatus.INTERNAL_SERVER_ERROR,
                MessageKeys.UNEXPECTED_ERROR_OCCURRED, e, e.getMessage());

        responseEntity = this.cut.handleException(e, this.spyResponse);
        assertEquals(responseEntity.getStatusCode().value(), expectedException.getErrorStatus().getHttpStatus());
        assertTrue(responseEntity.getStatusCode().is5xxServerError());
    }

    @Test
    @DisplayName("verify that handleHttpMediaTypeNotSupportedException() forwards the expected ServiceException in case a HttpMediaTypeNotSupportedException occurs")
    public void handleHttpMediaTypeNotSupportedException() throws IOException {
        final List<MediaType> supportedMediaTypes = new ArrayList<>();
        supportedMediaTypes.add(MediaType.APPLICATION_PDF);

        final HttpMediaTypeNotSupportedException e = new HttpMediaTypeNotSupportedException(MediaType.APPLICATION_JSON,
                supportedMediaTypes);

        final ServiceException expectedException = new ServiceException(HttpStatus.UNSUPPORTED_MEDIA_TYPE,
                MessageKeys.UNSUPPORTED_MEDIA_TYPE, e.getContentType(), e);

        responseEntity = this.cut.handleHttpMediaTypeNotSupportedException(e, this.spyResponse);
        assertEquals(responseEntity.getStatusCode().value(), expectedException.getErrorStatus().getHttpStatus());
        assertTrue(responseEntity.getStatusCode().is4xxClientError());
    }
}
