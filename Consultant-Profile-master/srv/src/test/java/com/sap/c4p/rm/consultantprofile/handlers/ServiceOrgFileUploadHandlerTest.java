package com.sap.c4p.rm.consultantprofile.handlers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.io.InputStream;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.web.multipart.MultipartFile;

import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.consultantprofile.businessserviceorgservices.imports.ImportResult;
import com.sap.c4p.rm.consultantprofile.businessserviceorgservices.imports.ImportResultImpl;
import com.sap.c4p.rm.consultantprofile.businessserviceorgservices.imports.serviceorg.ServiceOrgCsvImporter;

public class ServiceOrgFileUploadHandlerTest {
    private ServiceOrgFileUploadHandler cut;

    private static final ImportResult ANY_RESPONSE = new ImportResultImpl();

    /**
     * initialize object under test
     *
     * @throws IOException
     */
    @BeforeEach
    public void setUp() throws IOException {
        final ServiceOrgCsvImporter mockService = mock(ServiceOrgCsvImporter.class);

        this.cut = new ServiceOrgFileUploadHandler(mockService);

        when(mockService.importStream(any(InputStream.class))).thenReturn(ServiceOrgFileUploadHandlerTest.ANY_RESPONSE);
    }

    @Test
    @DisplayName("check if handleFileUpload() delegates to service successfully in case provided array of MultipartFiles has correct size")
    public void handleFileUploadSuccess() throws IOException {
        final MultipartFile[] files = new MultipartFile[1];
        final MultipartFile mockFile = mock(MultipartFile.class);
        when(mockFile.getInputStream()).thenReturn(mock(InputStream.class));
        files[0] = mockFile;

        assertEquals(ServiceOrgFileUploadHandlerTest.ANY_RESPONSE, this.cut.handleFileUpload(files));
    }

    @Test
    @DisplayName("check if handleFileUpload() throws ServiceException in case > 1 files are provided")
    public void handleFileUploadTooManyFiles() throws IOException {
        final MultipartFile[] files = new MultipartFile[2];
        final MultipartFile mockFile = mock(MultipartFile.class);
        files[0] = mockFile;
        files[1] = mockFile;

        assertThrows(ServiceException.class, () -> {
            this.cut.handleFileUpload(files);
        }, "handleFileUpload() did not throw ServiceException although too many files have been provided");
    }

    @Test
    @DisplayName("check if handleFileUpload() throws ServiceException in case an empty array of MultipartFiles is provided")
    public void handleFileUploadNoFiles() throws IOException {
        final MultipartFile[] emptyFiles = new MultipartFile[0];

        assertThrows(ServiceException.class, () -> {
            this.cut.handleFileUpload(emptyFiles);
        }, "handleFileUpload() did not throw ServiceException although no files have been provided");
    }
}
