package com.sap.c4p.rm.consultantprofile.handlers;

import java.io.IOException;
import java.io.InputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.consultantprofile.businessserviceorgservices.imports.ImportResult;
import com.sap.c4p.rm.consultantprofile.businessserviceorgservices.imports.serviceorg.ServiceOrgCsvImporter;
import com.sap.c4p.rm.consultantprofile.gen.MessageKeys;
import com.sap.c4p.rm.consultantprofile.utils.HttpStatus;

/**
 * This class handles upload CSV functinality from Service Org App
 */
@Component
public class ServiceOrgFileUploadHandler {
    private final ServiceOrgCsvImporter service;

    @Autowired
    public ServiceOrgFileUploadHandler(final ServiceOrgCsvImporter service) {
        this.service = service;
    }

    /**
     * Checks the size of the array of {@link MultipartFile}s to be uploaded. in
     * case the size is <i>acceptable</i> (= 1), the uploaded file is processed. in
     * all other cases, a {@link ServiceException} is thrown.
     *
     * @param files    array of {@link MultipartFile}s to be uploaded
     * @param language Language code in which the content is maintained in
     * @return {@link ImportResult} object containing the import result
     * @throws IOException
     */
    public ImportResult handleFileUpload(final MultipartFile[] files) throws IOException {
        if (files.length > 1) {
            throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.MULTIPLE_FILES_ARE_NOT_SUPPORTED);
        } else if (files.length == 0) {
            throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.NO_FILE_SPECIFIED);
        } else {
            try (InputStream stream = files[0].getInputStream()) {
                return this.service.importStream(stream);
            }
        }
    }
}
