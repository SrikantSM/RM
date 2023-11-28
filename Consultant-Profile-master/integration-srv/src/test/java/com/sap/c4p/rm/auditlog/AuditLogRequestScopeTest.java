package com.sap.c4p.rm.auditlog;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Spy;

import com.sap.xs.audit.api.TransactionalAuditLogMessage;

import com.sap.c4p.rm.InitMocks;

public class AuditLogRequestScopeTest extends InitMocks {
    @Mock
    private TransactionalAuditLogMessage mockTransactionalAuditLogMessage;
    @Spy
    private AuditLogRequestScope classUnderTest;

    @Test
    @DisplayName("Testing of log security event method")
    void testAddMessage() {
        classUnderTest.addMessage(mockTransactionalAuditLogMessage);
        List<TransactionalAuditLogMessage> actualList = classUnderTest.getMessages();
        assertEquals(mockTransactionalAuditLogMessage, (actualList).get(0));
    }
}
