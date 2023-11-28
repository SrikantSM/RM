/**
 * 
 */
package com.sap.c4p.rm.assignment.auditlog;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.Spy;

import com.sap.xs.audit.api.TransactionalAuditLogMessage;

/**
 * @author I310562
 *
 */
public class AuditLogChangeListenerTest {

  @Mock
  AuditLogRequestScope mockAuditLogRequestScope;

  @Spy
  AuditLogChangeListener mockAuditLogChangeListener;

  @Mock
  TransactionalAuditLogMessage mockTransactionalAuditLogMessages;
  @Mock
  List<TransactionalAuditLogMessage> mockTransactionalAuditLogMessage;

  @BeforeEach
  public void setUp() {
    MockitoAnnotations.initMocks(this);
    mockAuditLogChangeListener.auditLogRequestScope = mockAuditLogRequestScope;
    mockTransactionalAuditLogMessages.setIdentityProvider("Assignment");
    mockTransactionalAuditLogMessages.setTenant("testtenant");
    mockTransactionalAuditLogMessages.setUser("mockUser");
    mockTransactionalAuditLogMessage.add(mockTransactionalAuditLogMessages);

  }

  @Test
  @DisplayName("Testing after close method with success")
  void testTransactionAfterCloseSuccess() {

    when(mockAuditLogRequestScope.getMessage()).thenReturn(mockTransactionalAuditLogMessage);
    assertThrows(NullPointerException.class, () -> {
      mockAuditLogChangeListener.afterClose(true);

    });

  }

  @Test
  @DisplayName("Testing after close method with completed false")
  void testTransactionAfterCloseFail() {

    when(mockAuditLogRequestScope.getMessage()).thenReturn(mockTransactionalAuditLogMessage);
    assertThrows(NullPointerException.class, () -> {
      mockAuditLogChangeListener.afterClose(false);

    });

  }

}
