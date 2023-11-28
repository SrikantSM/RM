package com.sap.c4p.rm.consultantprofile.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.io.IOException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.web.multipart.MultipartFile;

import com.sap.c4p.rm.consultantprofile.businessserviceorgservices.imports.ImportResult;
import com.sap.c4p.rm.consultantprofile.businessserviceorgservices.imports.ImportResultImpl;
import com.sap.c4p.rm.consultantprofile.handlers.ServiceOrgFileDownloadHandler;
import com.sap.c4p.rm.consultantprofile.handlers.ServiceOrgFileUploadHandler;

public class ServiceOrgControllerTest {

    /** object under test */
    private ServiceOrgController cut;

    /** mock handler */
    private ServiceOrgFileUploadHandler uploadHandler;
    private ServiceOrgFileDownloadHandler downloadHandler;

    private static final String CSV_CONTENT = "csvContent";

    @BeforeEach
    public void setUp() throws IOException {
        this.uploadHandler = mock(ServiceOrgFileUploadHandler.class);
        this.downloadHandler = mock(ServiceOrgFileDownloadHandler.class);
        when(this.uploadHandler.handleFileUpload(any(MultipartFile[].class))).thenReturn(new ImportResultImpl());
        when(this.downloadHandler.handleDownload()).thenReturn(CSV_CONTENT);
        this.cut = new ServiceOrgController(this.uploadHandler, this.downloadHandler);
    }

    @Test
    @DisplayName("check if handleFileUploadService() delegates properly to ServiceOrgFileUploadHandler")
    public void handleFileUploadService() throws IOException {
        final MultipartFile[] files = new MultipartFile[1];
        final MultipartFile mockFile = mock(MultipartFile.class);
        files[0] = mockFile;

        final ImportResult result = this.cut.handleFileUploadService(files);

        assertEquals(0, result.getCreatedItems());
    }

    @Test
    public void handleFileDownloadService() throws IOException {
        assertEquals(CSV_CONTENT, this.cut.handleFileDownloadService());
    }
}
