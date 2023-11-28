package com.sap.c4p.rm.skill.services.skillimport;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.sap.c4p.rm.skill.utils.LocalTenantTaskExecutor;
import com.sap.c4p.rm.skill.utils.TenantTaskExecutor;

public class UploadHealthCheckTest {
  private TenantTaskExecutor tenantTaskExecutor;
  private UploadJobService mockUploadJobService;
  private UploadHealthCheck cut;

  @BeforeEach
  void beforeEach() {
    this.tenantTaskExecutor = new LocalTenantTaskExecutor();
    this.mockUploadJobService = mock(UploadJobService.class);
    this.cut = new UploadHealthCheck(this.mockUploadJobService, this.tenantTaskExecutor);
  }

  @Test
  public void checkUploadInterrupted() {
    when(this.mockUploadJobService.isStuck()).thenReturn(true);

    this.cut.checkUpload();

    verify(this.mockUploadJobService, times(1)).interrupt();
  }

  @Test
  public void checkUploadNotInterrupted() {
    when(this.mockUploadJobService.isStuck()).thenReturn(false);

    this.cut.checkUpload();

    verify(this.mockUploadJobService, never()).interrupt();
  }
}
