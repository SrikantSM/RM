package com.sap.c4p.rm.consultantprofile.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.io.IOException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.consultantprofile.availabilityservice.CsvInputValidator;
import com.sap.c4p.rm.consultantprofile.availabilityservice.imports.ImportResult;
import com.sap.c4p.rm.consultantprofile.availabilityservice.imports.ImportResultImpl;
import com.sap.c4p.rm.consultantprofile.handlers.AvailabilityFileDownloadHandler;
import com.sap.c4p.rm.consultantprofile.handlers.AvailabilityFileUploadHandler;

public class AvailabilityControllerTest {

    /** object under test */
    private AvailabilityController cut;

    /** mock handler */
    private AvailabilityFileUploadHandler uploadHandler;
    private AvailabilityFileDownloadHandler downloadHandler;

    private static final String startdate = "2020-01-01";
    private static final String endate = "2020-03-01";
    private static final String costcenter = "1010";
    private static final String workforcepersonid = "HR01";
    private static final int workinghours = 8;
    private static final int nonworkinghours = 0;

    @Mock
    private CsvInputValidator validator;

    @BeforeEach
    public void setUp() throws IOException {
        this.uploadHandler = mock(AvailabilityFileUploadHandler.class);
        this.downloadHandler = mock(AvailabilityFileDownloadHandler.class);
        this.validator = Mockito.mock(CsvInputValidator.class);

        when(this.uploadHandler.handleFileUpload(any(MultipartFile[].class), eq(costcenter)))
                .thenReturn(new ImportResultImpl(0, 0, 0));

        final MultipartFile[] files = new MultipartFile[2];
        final MultipartFile mockFile = mock(MultipartFile.class);
        files[0] = mockFile;
        files[1] = mockFile;
        doThrow(ServiceException.class).when(this.validator).validateInputForFileUpload(files, costcenter);
        this.cut = new AvailabilityController(this.uploadHandler, this.downloadHandler, this.validator);
    }

    @Test
    @DisplayName("check if handleFileUploadService() delegates properly to AvailabilityFileUploadHandler")
    public void handleFileUploadService() throws IOException {
        final MultipartFile[] files = new MultipartFile[1];
        final MultipartFile mockFile = mock(MultipartFile.class);
        files[0] = mockFile;

        ImportResult result = this.cut.handleAvailabilityUploadService(files, costcenter);
        assertEquals(0, result.getErrors());
        assertEquals(0, result.getCreatedItems());
        assertEquals(0, result.getResourceIDErrors());
    }

    @Test
    @DisplayName("check if handleFileUploadService() throws ServiceException in case > 1 files are provided")
    public void handleFileUploadTooManyFiles() {
        final MultipartFile[] files = new MultipartFile[2];
        final MultipartFile mockFile = mock(MultipartFile.class);
        files[0] = mockFile;
        files[1] = mockFile;
        doThrow(ServiceException.class).when(this.validator).validateInputForFileUpload(files, costcenter);
        assertThrows(ServiceException.class, () -> {
            this.cut.handleAvailabilityUploadService(files, costcenter);
        }, "handleFileUploadService() did not throw ServiceException although too many files have been provided");

    }

    @Test
    @DisplayName("check if handleFileUploadService() throws ServiceException in case an empty array of MultipartFiles is provided")
    public void handleFileUploadNoFiles() throws IOException {
        final MultipartFile[] emptyFiles = new MultipartFile[0];
        doThrow(ServiceException.class).when(this.validator).validateInputForFileUpload(emptyFiles, costcenter);
        assertThrows(ServiceException.class, () -> {
            this.cut.handleAvailabilityUploadService(emptyFiles, costcenter);
        }, "handleFileUploadService() did not throw ServiceException although no files have been provided");
    }

    @Test
    @DisplayName("check if handleFileUploadService() throws ServiceException in case an empty cost center is provided")
    public void handleFileUploadNoCostcenter() throws IOException {
        final MultipartFile[] file = new MultipartFile[2];
        final MultipartFile mockFile = mock(MultipartFile.class);
        file[0] = mockFile;
        String costCenter = null;
        doThrow(ServiceException.class).when(this.validator).validateInputForFileUpload(file, costCenter);
        assertThrows(ServiceException.class, () -> {
            this.cut.handleAvailabilityUploadService(file, costCenter);
        }, "handleFileUploadService() did not throw ServiceException although no cost center have been provided");
    }

    @Test
    @DisplayName("check if handleFileUploadService() throws ServiceException in case an empty String cost center is provided")
    public void handleFileUploadEmptyStringCostcenter() throws IOException {
        final MultipartFile[] file = new MultipartFile[2];
        final MultipartFile mockFile = mock(MultipartFile.class);
        file[0] = mockFile;
        String costCenter = "";
        doThrow(ServiceException.class).when(this.validator).validateInputForFileUpload(file, costCenter);
        assertThrows(ServiceException.class, () -> {
            this.cut.handleAvailabilityUploadService(file, costCenter);
        }, "handleFileUploadService() did not throw ServiceException although no cost center have been provided");
    }

    @Test
    @DisplayName("check if handleFileDownloadService() delegates properly to AvailabilityFileDownloadHandler")
    public void handleFileDownloadService() throws IOException {

        ResponseEntity<StreamingResponseBody> responseEntity = this.cut.handleAvailabilityDownloadService(startdate,
                endate, costcenter, workforcepersonid, workinghours, nonworkinghours);

        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
    }
}
