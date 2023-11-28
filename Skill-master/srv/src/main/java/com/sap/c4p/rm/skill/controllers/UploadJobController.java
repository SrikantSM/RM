package com.sap.c4p.rm.skill.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.sap.cds.Struct;
import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.skill.repositories.UploadJobRepository;

import fileuploadservice.UploadJob;

/**
 * This controller serves POST requests send to the REST endpoint
 * {@code /api/internal/test/uploadjob}. It should only be used while testing to
 * manipulate the {@code UploadJob} entity without executing the file upload.
 *
 * <i><br>
 * <br>
 * This endpoint will only available if profile {@code local-test} is active. It
 * will not be available in productive mode (profile {@code cloud}).</i>
 */
@RestController
@Profile("local")
public class UploadJobController {

  /** repository providing access to the {@link UploadJob} persistence */
  private final UploadJobRepository repo;

  @Autowired
  public UploadJobController(final UploadJobRepository repo) {
    this.repo = repo;
  }

  /**
   * Receive JSON representing the new content of the {@code UploadJob} entity. If
   * {@code UploadJob} is empty, a new record will be created. If
   * {@code UploadJob} is not empty, the record will be updated accordingly.
   *
   * @param map {@link Map<String, Object>} containing the values that should be
   *            persisted in {@link UploadJob}
   * @return {@link UploadJob} representing the content of the database entity
   *         after the operation
   */
  @PostMapping(path = "/api/internal/test/uploadjob")
  public Map<String, Object> postUploadJob(final @RequestBody Map<String, Object> map) {
    final UploadJob job = Struct.access(map).as(UploadJob.class);

    this.repo.setActiveEntity(job);

    return this.repo.findActiveEntity().orElseThrow(() -> new ServiceException("failed to insert/update UploadJob"));
  }
}
