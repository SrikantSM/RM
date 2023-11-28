package com.sap.c4p.rm.consultantprofile.controller;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import com.sap.c4p.rm.consultantprofile.availabilityservice.CsvInputValidator;
import com.sap.c4p.rm.consultantprofile.availabilityservice.imports.ImportResult;
import com.sap.c4p.rm.consultantprofile.handlers.AvailabilityFileDownloadHandler;
import com.sap.c4p.rm.consultantprofile.handlers.AvailabilityFileUploadHandler;

/**
 * Controller to define Availability HTTP endpoints
 */
@Controller
@RequestMapping("/")
public class AvailabilityController {

    private final AvailabilityFileUploadHandler uploadhandler;
    private final AvailabilityFileDownloadHandler downloadhandler;
    private final CsvInputValidator validator;

    @Autowired
    public AvailabilityController(final AvailabilityFileUploadHandler uploadhandler,
            final AvailabilityFileDownloadHandler downloadhandler, final CsvInputValidator validator) {
        this.uploadhandler = uploadhandler;
        this.downloadhandler = downloadhandler;
        this.validator = validator;
    }

    /**
     * Defines an HTTP endpoint to upload {@link Availability} as a CSV file
     *
     * @param files
     * @return {@link ImportResult}
     * @throws IOException
     */
    @PostMapping(path = "/AvailabilityFileUploadService", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    @PreAuthorize("hasAuthority('Availability.Upload')")
    public ImportResult handleAvailabilityUploadService(final @RequestParam("file") MultipartFile[] files,
            @RequestParam("costcenter") String costCenter) throws IOException {

        validator.validateInputForFileUpload(files, costCenter);
        return this.uploadhandler.handleFileUpload(files, costCenter);
    }

    /**
     * Defines an HTTP endpoint to download {@link Availability} as a CSV file
     *
     * @param startDate
     * @param endDate
     * @param costCenter
     * @param workForcePersonId
     * @return StreamingResponseBody
     * @throws IOException
     */
    @GetMapping(path = "/AvailabilityFileDownloadService", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ResponseBody
    @PreAuthorize("hasAuthority('Availability.Download')")
    public ResponseEntity<StreamingResponseBody> handleAvailabilityDownloadService(
            @RequestParam("startdate") String startDate, @RequestParam("enddate") String endDate,
            @RequestParam("costcenter") String costCenter, @RequestParam("workforcepersonid") String workForcePersonId,
            @RequestParam(required = true, defaultValue = "0") int workinghours,
            @RequestParam(required = true, defaultValue = "0") int nonworkinghours) {

        validator.validateInputForFileDownload(startDate, endDate, costCenter, workForcePersonId);
        StreamingResponseBody responseBody = new StreamingResponseBody() {
            @Override
            public void writeTo(OutputStream out) throws IOException {
                out.write(downloadhandler.handleDownload(startDate, endDate, costCenter, workForcePersonId,
                        workinghours, nonworkinghours).getBytes(StandardCharsets.UTF_8));
                out.flush();
            }
        };
        return new ResponseEntity<>(responseBody, HttpStatus.OK);
    }
}
