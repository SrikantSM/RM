package com.sap.c4p.rm.skill.repositories;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.sap.cds.Result;
import com.sap.cds.ql.Delete;
import com.sap.cds.ql.Insert;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.Update;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.skill.utils.UploadJobStates;

import fileuploadservice.UploadJob;
import fileuploadservice.UploadJob_;

class UploadJobRepositoryTest {

  private PersistenceService persistenceService;
  private Result mockResult;
  private UploadJobRepository cut;
  private UploadJob testUploadJob;

  @BeforeEach
  void setup() {
    this.testUploadJob = UploadJob.create();
    this.persistenceService = mock(PersistenceService.class);
    this.mockResult = mock(Result.class);
    this.cut = new UploadJobRepository(this.persistenceService);
  }

  @Test
  @DisplayName("find the current upload job")
  void findActiveEntity() {
    final ArgumentCaptor<CqnSelect> argumentSelect = ArgumentCaptor.forClass(CqnSelect.class);
    final CqnSelect expectedSelect = Select.from(UploadJob_.class).columns(UploadJob_::_all,
        u -> u.uploadErrors().expand());

    when(this.mockResult.first(UploadJob.class)).thenReturn(Optional.of(this.testUploadJob));
    when(this.persistenceService.run(any(CqnSelect.class))).thenReturn(this.mockResult);

    Optional<UploadJob> result = this.cut.findActiveEntity();

    verify(this.persistenceService).run(argumentSelect.capture());
    List<CqnSelect> capturedSelect = argumentSelect.getAllValues();
    assertTrue(result.isPresent());
    assertEquals(this.testUploadJob, result.get());
    assertEquals(expectedSelect.toString(), capturedSelect.get(0).toString());
  }

  @Test
  @DisplayName("set the upload job")
  void setActiveEntity() {
    this.testUploadJob.setState(UploadJobStates.SUCCESS.getValue());
    final ArgumentCaptor<CqnDelete> argumentDelete = ArgumentCaptor.forClass(CqnDelete.class);
    final CqnDelete expectedDelete = Delete.from(UploadJob_.class);
    final ArgumentCaptor<CqnInsert> argumentInsert = ArgumentCaptor.forClass(CqnInsert.class);
    final CqnInsert expectedInsert = Insert.into(UploadJob_.CDS_NAME).entry(this.testUploadJob);
    when(this.mockResult.first(UploadJob.class)).thenReturn(Optional.of(this.testUploadJob));
    when(this.mockResult.single(UploadJob.class)).thenReturn(this.testUploadJob);
    when(this.persistenceService.run(any(CqnSelect.class))).thenReturn(this.mockResult);
    when(this.persistenceService.run(any(CqnInsert.class))).thenReturn(this.mockResult);

    UploadJob result = this.cut.setActiveEntity(this.testUploadJob);

    verify(this.persistenceService).run(argumentDelete.capture());
    verify(this.persistenceService).run(argumentInsert.capture());
    List<CqnDelete> capturedDelete = argumentDelete.getAllValues();
    List<CqnInsert> capturedInsert = argumentInsert.getAllValues();
    assertEquals(expectedDelete.toString(), capturedDelete.get(0).toString());
    assertEquals(expectedInsert.toString(), capturedInsert.get(0).toString());
    assertEquals(this.testUploadJob, result);
  }

  @Test
  @DisplayName("update the current upload job")
  void updateActiveEntity() {
    final ArgumentCaptor<CqnUpdate> argumentUpdate = ArgumentCaptor.forClass(CqnUpdate.class);
    final CqnUpdate expectedUpdate = Update.entity(UploadJob_.CDS_NAME).data(this.testUploadJob);

    this.cut.updateActiveEntity(this.testUploadJob);

    verify(this.persistenceService).run(argumentUpdate.capture());
    List<CqnUpdate> capturedUpdate = argumentUpdate.getAllValues();
    assertEquals(expectedUpdate.toString(), capturedUpdate.get(0).toString());
  }
}
