package com.sap.c4p.rm.skill.services.skillimport;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.sap.c4p.rm.skill.config.LoggingMarker;
import com.sap.c4p.rm.skill.utils.TenantTaskExecutor;

@Component
public class UploadHealthCheck {
  private static final Logger LOGGER = LoggerFactory.getLogger(UploadHealthCheck.class);
  private static final Marker MARKER = LoggingMarker.FILE_UPLOAD.getMarker();

  private static final long HEALTH_CHECK_TIME_PERIOD_IN_SECONDS = 3600;
  private UploadJobService uploadJobService;
  private TenantTaskExecutor tenantTaskExecutor;

  @Autowired
  public UploadHealthCheck(UploadJobService uploadJobService, TenantTaskExecutor tenantTaskExecutor) {
    this.uploadJobService = uploadJobService;
    this.tenantTaskExecutor = tenantTaskExecutor;
  }

  @Scheduled(fixedRate = 1000 * HEALTH_CHECK_TIME_PERIOD_IN_SECONDS)
  public void checkUpload() {
    LOGGER.info(MARKER, "Check if upload job is interrupted");
    this.tenantTaskExecutor.execute(tenantId -> {
      if (this.uploadJobService.isStuck()) {
        LOGGER.warn(MARKER, "Upload Job interrupted for tenant with id {} ", tenantId);
        this.uploadJobService.interrupt();
      }
    });
  }
}
