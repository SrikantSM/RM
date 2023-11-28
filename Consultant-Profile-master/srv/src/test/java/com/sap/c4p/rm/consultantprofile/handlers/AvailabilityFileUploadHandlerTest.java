package com.sap.c4p.rm.consultantprofile.handlers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.io.InputStream;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;

import com.sap.c4p.rm.consultantprofile.InitMocks;
import com.sap.c4p.rm.consultantprofile.availabilityservice.CsvInputValidator;
import com.sap.c4p.rm.consultantprofile.availabilityservice.imports.AvailabilityCsvImporter;
import com.sap.c4p.rm.consultantprofile.availabilityservice.imports.ImportResult;
import com.sap.c4p.rm.consultantprofile.availabilityservice.imports.ImportResultImpl;

public class AvailabilityFileUploadHandlerTest extends InitMocks {

    private static final ImportResult ANY_RESPONSE = new ImportResultImpl(0, 0, 0);
    public static final String S4COSTCENTER_ID = "1010";

    @Mock
    private CsvInputValidator validator;

    @Mock
    private AvailabilityCsvImporter mockService;

    @Mock
    private MultipartFile mockFile;

    @Autowired
    @InjectMocks
    private AvailabilityFileUploadHandler cut;

    /**
     * initialize object under test
     *
     * @throws IOException
     */
    @BeforeEach
    public void setUp() throws IOException {
        when(mockService.importStream(any(InputStream.class), eq(S4COSTCENTER_ID)))
                .thenReturn(AvailabilityFileUploadHandlerTest.ANY_RESPONSE);
    }

    @Test
    @DisplayName("check if handleFileUpload() delegates to service successfully in case provided array of MultipartFiles has correct size")
    public void handleFileUploadSuccess() throws IOException {
        final MultipartFile[] files = new MultipartFile[1];
        when(mockFile.getInputStream()).thenReturn(mock(InputStream.class));
        files[0] = mockFile;

        assertEquals(AvailabilityFileUploadHandlerTest.ANY_RESPONSE, this.cut.handleFileUpload(files, S4COSTCENTER_ID));
    }
}
