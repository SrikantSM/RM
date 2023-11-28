package com.sap.c4p.rm.auditlog;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.sap.xs.audit.api.TransactionalAuditLogMessage;
import com.sap.xs.audit.api.exception.AuditLogNotAvailableException;
import com.sap.xs.audit.api.exception.AuditLogWriteException;

public class AuditLogChangeListenerTest {

    private AuditLogChangeListener classUnderTest;

    /** mocks */
    private AuditLogRequestScope mockAuditLogRequestScope;
    private TransactionalAuditLogMessage mockTransactionalAuditLogMessage;
    private List<TransactionalAuditLogMessage> transactionalAuditLogMessages = new ArrayList<>();

    @BeforeEach
    public void setUp() {
        this.mockAuditLogRequestScope = mock(AuditLogRequestScope.class);
        this.mockTransactionalAuditLogMessage = mock(TransactionalAuditLogMessage.class);
        transactionalAuditLogMessages.add(mockTransactionalAuditLogMessage);
        classUnderTest = new AuditLogChangeListener(this.mockAuditLogRequestScope);
    }

    @Test
    @DisplayName("Testing of data modification success for audit message")
    void testLogDataModificationAuditMessageSuccess() throws AuditLogNotAvailableException, AuditLogWriteException {
        when(mockAuditLogRequestScope.getMessages()).thenReturn(transactionalAuditLogMessages);
        classUnderTest.afterClose(true);
        verify(this.mockTransactionalAuditLogMessage, times(1)).logSuccess();
    }

    @Test
    @DisplayName("Testing of data modification failure for audit message")
    void testLogDataModificationAuditMessageFailure() throws AuditLogNotAvailableException, AuditLogWriteException {
        when(mockAuditLogRequestScope.getMessages()).thenReturn(transactionalAuditLogMessages);
        classUnderTest.afterClose(false);
        verify(this.mockTransactionalAuditLogMessage, times(1)).logFailure();
    }

}
