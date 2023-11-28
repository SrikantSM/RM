package com.sap.c4p.rm.skill.repositories;

import java.util.Optional;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.sap.cds.ql.Delete;
import com.sap.cds.ql.Insert;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.Update;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.services.persistence.PersistenceService;

import fileuploadservice.UploadJob;
import fileuploadservice.UploadJob_;

@Repository
public class UploadJobRepository {
  private final PersistenceService persistenceService;

  public UploadJobRepository(final PersistenceService persistenceService) {
    this.persistenceService = persistenceService;
  }

  public Optional<UploadJob> findActiveEntity() {
    final CqnSelect select = Select.from(UploadJob_.class).columns(UploadJob_::_all, u -> u.uploadErrors().expand());
    return this.persistenceService.run(select).first(UploadJob.class);
  }

  @Transactional
  public UploadJob setActiveEntity(UploadJob uploadJob) {
    final CqnDelete delete = Delete.from(UploadJob_.class);
    final CqnInsert insert = Insert.into(UploadJob_.class).entry(uploadJob);

    this.persistenceService.run(delete);
    return this.persistenceService.run(insert).single(UploadJob.class);
  }

  @Transactional(propagation = Propagation.REQUIRES_NEW)
  public void updateActiveEntity(UploadJob uploadJob) {
    final CqnUpdate update = Update.entity(UploadJob_.CDS_NAME).data(uploadJob);
    this.persistenceService.run(update);
  }
}
