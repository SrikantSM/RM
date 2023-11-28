package com.sap.c4p.rm.skill.handlers;

import java.util.Collections;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.sap.cds.services.cds.CdsReadEventContext;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.ServiceName;

import com.sap.c4p.rm.skill.repositories.UploadJobRepository;
import com.sap.c4p.rm.skill.utils.UploadJobStates;

import fileuploadservice.FileUploadService_;
import fileuploadservice.UploadJob;
import fileuploadservice.UploadJob_;

@Component
@ServiceName(FileUploadService_.CDS_NAME)
public class FileUploadJobHandler implements EventHandler {

  private final UploadJobRepository repository;

  public FileUploadJobHandler(UploadJobRepository repository) {
    this.repository = repository;
  }

  /**
   * Compute the current Upload Job status, as the UI can't deal with an empty job
   * status
   */
  @Before(event = { CqnService.EVENT_READ }, entity = UploadJob_.CDS_NAME)
  public void beforeRead(final CdsReadEventContext context) {
    if (!this.repository.findActiveEntity().isPresent()) {
      UploadJob uploadJob = UploadJob.create();
      uploadJob.setId(UUID.randomUUID().toString());
      uploadJob.setState(UploadJobStates.INITIAL.getValue());
      context.setResult(Collections.singleton(uploadJob));
      context.setCompleted();
    }
  }
}
