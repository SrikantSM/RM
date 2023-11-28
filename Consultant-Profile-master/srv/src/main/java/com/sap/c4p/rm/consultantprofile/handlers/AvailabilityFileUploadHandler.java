package com.sap.c4p.rm.consultantprofile.handlers;

import java.io.IOException;
import java.io.InputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.consultantprofile.availabilityservice.CsvInputValidator;
import com.sap.c4p.rm.consultantprofile.availabilityservice.imports.AvailabilityCsvImporter;
import com.sap.c4p.rm.consultantprofile.availabilityservice.imports.ImportResult;

@Component
public class AvailabilityFileUploadHandler {
    private final AvailabilityCsvImporter service;

    @Autowired
    public AvailabilityFileUploadHandler(final AvailabilityCsvImporter service, final CsvInputValidator validator) {
        this.service = service;
    }

    /**
     * Checks the size of the array of {@link MultipartFile}s to be uploaded. in
     * case the size is <i>acceptable</i> (= 1), the uploaded file is processed. in
     * all other cases, a {@link ServiceException} is thrown.
     *
     * @param files array of {@link MultipartFile}s to be uploaded
     * @return {@link ImportResult} object containing the import result
     * @throws IOException
     */
    public ImportResult handleFileUpload(final MultipartFile[] files, final String costCenter) throws IOException {
        try (InputStream stream = files[0].getInputStream()) {
            return this.service.importStream(stream, costCenter);
        }
    }

}
