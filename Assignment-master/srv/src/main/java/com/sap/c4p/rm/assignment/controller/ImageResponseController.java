package com.sap.c4p.rm.assignment.controller;

import java.io.IOException;
import java.io.InputStream;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

import jakarta.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.sap.cds.ql.Select;
import com.sap.cds.services.persistence.PersistenceService;
import com.sap.cds.services.runtime.CdsRuntime;

import com.sap.resourcemanagement.employee.ProfilePhoto;
import com.sap.resourcemanagement.employee.ProfilePhoto_;

@RestController
public class ImageResponseController {

  private static final Logger LOGGER = LoggerFactory.getLogger(ImageResponseController.class);

  @Autowired
  private PersistenceService persistenceService;

  @Autowired
  private CdsRuntime cdsRuntime;

  public ImageResponseController(PersistenceService persistenceService, CdsRuntime cdsRuntime) {

    this.persistenceService = persistenceService;
    this.cdsRuntime = cdsRuntime;
  }

  @GetMapping(value = "/odata/v4/profilePhoto/profileThumbnail({uuid})")
  public void execute(@PathVariable("uuid") String uuid, HttpServletResponse response) throws IOException {
    cdsRuntime.changeSetContext().run(ctx -> {

      response.setHeader(HttpHeaders.CACHE_CONTROL, "public; max-age=86400");
      response.setHeader(HttpHeaders.CONTENT_TYPE, "image/png");

      Optional<ProfilePhoto> profileThumbnailRead = persistenceService.run(Select.from(ProfilePhoto_.CDS_NAME)
          .columns(b -> b.get(ProfilePhoto.MODIFIED_AT), b -> b.get(ProfilePhoto.PROFILE_THUMBNAIL))
          .where(b -> b.get(ProfilePhoto.EMPLOYEE_ID).eq(uuid))).first(ProfilePhoto.class);

      if (profileThumbnailRead.isPresent()) {
        InputStream inputStream = profileThumbnailRead.get().getProfileThumbnail();
        Instant modifiedAtValue = profileThumbnailRead.get().getModifiedAt();

        if (modifiedAtValue != null) {

          LOGGER.warn("Profile picture is not modified since last upload but contains a valid timestamp");

          String formattedModifiedAtValue = DateTimeFormatter.RFC_1123_DATE_TIME.withZone(ZoneOffset.UTC)
              .format(modifiedAtValue);
          response.setHeader(HttpHeaders.LAST_MODIFIED, formattedModifiedAtValue);
        } else {
          Instant instant = Instant.now();
          LOGGER.info("ModifiedAt value is not present in the DB, maybe because of mass data upload");
          String formattedInstantValue = DateTimeFormatter.RFC_1123_DATE_TIME.withZone(ZoneOffset.UTC).format(instant);
          response.setHeader(HttpHeaders.LAST_MODIFIED, formattedInstantValue);
        }

        if (inputStream != null) {
          try {
            IOUtils.copy(inputStream, response.getOutputStream());
            response.flushBuffer();
          } catch (IOException e) {
            LOGGER.warn("image copy failed with exception: {}", e);
          }
        }
      }

    });
  }
}