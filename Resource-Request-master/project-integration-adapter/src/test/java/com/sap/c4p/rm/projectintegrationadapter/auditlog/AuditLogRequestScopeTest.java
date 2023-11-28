/**
 * 
 */
package com.sap.c4p.rm.projectintegrationadapter.auditlog;

import static org.junit.jupiter.api.Assertions.assertTrue;

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
public class AuditLogRequestScopeTest {

  @Spy
  private AuditLogRequestScope classUnderTest;
  @Mock
  private TransactionalAuditLogMessage mockTransactionalAuditLogMessage;

  @BeforeEach
  public void setUp() {
    MockitoAnnotations.initMocks(this);
  }

  @Test
  @DisplayName("Testing of log security event method")
  void testaddMessage() {
    classUnderTest.addMessage(mockTransactionalAuditLogMessage);
    List<TransactionalAuditLogMessage> actualList = classUnderTest.getMessage();
    assertTrue((actualList).get(0).equals(mockTransactionalAuditLogMessage));
  }

}
