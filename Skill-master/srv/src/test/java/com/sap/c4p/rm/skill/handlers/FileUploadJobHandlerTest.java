package com.sap.c4p.rm.skill.handlers;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.sap.cds.services.cds.CdsReadEventContext;

import com.sap.c4p.rm.skill.repositories.UploadJobRepository;

class FileUploadJobHandlerTest {

  private FileUploadJobHandler cut;
  private UploadJobRepository mockRepository;

  @BeforeEach
  void beforeEach() {
    this.mockRepository = mock(UploadJobRepository.class);

    this.cut = new FileUploadJobHandler(this.mockRepository);
  }

  @Test
  @DisplayName("verify that beforeRead() invokes all expected methods")
  void beforeRead() {
    CdsReadEventContext mockContext = mock(CdsReadEventContext.class);
    this.cut.beforeRead(mockContext);

    verify(mockContext).setCompleted();
  }
}
