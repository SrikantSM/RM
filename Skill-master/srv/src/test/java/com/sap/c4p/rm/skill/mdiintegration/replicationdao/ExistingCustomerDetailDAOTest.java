package com.sap.c4p.rm.skill.mdiintegration.replicationdao;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;

import com.sap.cds.Result;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.skill.mdiintegration.InitMocks;

import com.sap.resourcemanagement.consultantprofile.integration.ExistingCustomerInfo;

public class ExistingCustomerDetailDAOTest extends InitMocks {

  @Mock
  PersistenceService persistenceService;

  @Mock
  Result result;

  @Mock
  Marker marker;

  @Autowired
  @InjectMocks
  ExistingCustomerDetailDAOImpl classUnderTest;

  @Test
  @DisplayName("test existingCustomerDetail when it returns true")
  public void testGetExistingCustomerDetailWhenTrue() {
    ExistingCustomerInfo customerInfo = ExistingCustomerInfo.create();
    customerInfo.setIsExistingCustomer(true);
    when(this.persistenceService.run(any(CqnSelect.class))).thenReturn(result);
    when(this.result.single(ExistingCustomerInfo.class)).thenReturn(customerInfo);
    when(this.result.rowCount()).thenReturn(Long.valueOf(1));
    assertTrue(this.classUnderTest.getExistingCustomerDetail());
    verify(persistenceService, times(1)).run(any(CqnSelect.class));
  }

  @Test
  @DisplayName("test existingCustomerDetail when it returns false")
  public void testGetExistingCustomerDetailWhenFalse() {
    ExistingCustomerInfo customerInfo = ExistingCustomerInfo.create();
    customerInfo.setIsExistingCustomer(false);
    when(this.persistenceService.run(any(CqnSelect.class))).thenReturn(result);
    when(this.result.single(ExistingCustomerInfo.class)).thenReturn(customerInfo);
    when(this.result.rowCount()).thenReturn(Long.valueOf(1));
    assertFalse(this.classUnderTest.getExistingCustomerDetail());
    verify(persistenceService, times(1)).run(any(CqnSelect.class));
  }

}
