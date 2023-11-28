package com.sap.c4p.rm.consultantprofile.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.sap.c4p.rm.consultantprofile.businessserviceorgservices.imports.ImportResult;
import com.sap.c4p.rm.consultantprofile.handlers.ServiceOrgFileDownloadHandler;
import com.sap.c4p.rm.consultantprofile.handlers.ServiceOrgFileUploadHandler;

@Controller
@RequestMapping("/")
public class ServiceOrgController {

    private final ServiceOrgFileUploadHandler uploadhandler;
    private final ServiceOrgFileDownloadHandler downloadhandler;

    @Autowired
    public ServiceOrgController(final ServiceOrgFileUploadHandler uploadhandler,
            final ServiceOrgFileDownloadHandler downloadhandler) {
        this.uploadhandler = uploadhandler;
        this.downloadhandler = downloadhandler;
    }

    /**
     * Defines an HTTP endpoint to upload {@link Service Org} as a CSV file
     *
     * @param files
     * @return {@link ImportResult}
     * @throws IOException
     */
    @PostMapping(path = "/ServiceOrgUploadService", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @PreAuthorize("hasAuthority('BusinessServiceOrg.Upload')")
    public ImportResult handleFileUploadService(final @RequestParam("file") MultipartFile[] files) throws IOException {
        return this.uploadhandler.handleFileUpload(files);
    }

    /**
     * Defines an HTTP endpoint to download {@link Service Org} as a CSV file
     *
     * @return {@link ImportResult}
     * @throws IOException
     */
    @GetMapping(path = "/ServiceOrgDownloadService", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ResponseBody
    @PreAuthorize("hasAuthority('BusinessServiceOrg.Download')")
    public String handleFileDownloadService() throws IOException {
        return this.downloadhandler.handleDownload();
    }

}
