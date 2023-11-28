package com.sap.c4p.rm.consultantprofile.auditlog;

import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.HashMap;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import com.sap.cds.feature.xsuaa.XsuaaUserInfo;
import com.sap.cds.services.EventContext;
import com.sap.cds.services.changeset.ChangeSetContext;
import com.sap.cds.services.request.UserInfo;
import com.sap.xs.audit.api.exception.AuditLogNotAvailableException;
import com.sap.xs.audit.api.exception.AuditLogWriteException;
import com.sap.xs.audit.api.v2.*;

import com.sap.c4p.rm.consultantprofile.InitMocks;
import com.sap.c4p.rm.consultantprofile.utils.CertificateUtils;

public class AuditLogUtilTest extends InitMocks {
    @Mock
    private AuditLogMessageFactory mockAuditLogMessageFactory;
    @Mock
    private SecurityEventAuditMessage mockSecurityEventAuditMessage;
    @Mock
    private DataModificationAuditMessage mockDataModificationAuditMessage;
    @Mock
    private EventContext mockEventContext;
    @Mock
    private AuditedDataSubject mockAuditedDataSubject;
    @Mock
    private UserInfo mockUserInfo;
    @Mock
    private AuditedObject mockAuditedObject;
    @Mock
    private AuditLogRequestScope mockAuditLogRequestScope;
    @Mock
    private AuditLogChangeListener mockAuditLogChangeListener;
    @Mock
    private ChangeSetContext mockChangeSetContext;
    @Mock
    private XsuaaUserInfo mockXsuaaUserInfo;
    @Mock
    private CertificateUtils mockCertificateUtils;

    @Spy
    @InjectMocks
    private AuditLogUtil classUnderTest;

    @BeforeEach
    void setUp() {
        Mockito.doReturn("https://someword.authentication.cert.sap.hana.ondemand.com").when(mockCertificateUtils)
                .getCertUrlByServiceName("auditlog");
        Mockito.doReturn("TENANT").when(mockXsuaaUserInfo).getSubDomain();
    }

    @Test
    @DisplayName("Testing of log security event method")
    void testLogSecurityEvent() throws AuditLogNotAvailableException, AuditLogWriteException {
        Mockito.doReturn(mockSecurityEventAuditMessage).when(mockAuditLogMessageFactory)
                .createSecurityEventAuditMessage();
        Mockito.doReturn("0.0.0.0").when(classUnderTest).getRemoteAddress();
        classUnderTest.logSecurityEvent("test-message");
        verify(this.mockSecurityEventAuditMessage, times(1)).log();
        verify(this.mockSecurityEventAuditMessage, times(1)).setUser("$USER");
        verify(this.mockSecurityEventAuditMessage, times(1)).setTenant("$SUBSCRIBER",
                "https://TENANT.authentication.cert.sap.hana.ondemand.com");
    }

    @Test
    @DisplayName("Testing of log security event method when remote address is null")
    void testLogSecurityEventWhenIpIsNull() throws AuditLogNotAvailableException, AuditLogWriteException {
        Mockito.doReturn(mockSecurityEventAuditMessage).when(mockAuditLogMessageFactory)
                .createSecurityEventAuditMessage();
        Mockito.doReturn(null).when(classUnderTest).getRemoteAddress();
        classUnderTest.logSecurityEvent("test-message");
        verify(this.mockSecurityEventAuditMessage, times(0)).setIp(null);
        verify(this.mockSecurityEventAuditMessage, times(1)).log();
        verify(this.mockSecurityEventAuditMessage, times(1)).setUser("$USER");
        verify(this.mockSecurityEventAuditMessage, times(1)).setTenant("$SUBSCRIBER",
                "https://TENANT.authentication.cert.sap.hana.ondemand.com");
    }

    @Test
    @DisplayName("Testing of log security event method in case of exception")
    void testLogSecurityEventForException() throws AuditLogNotAvailableException, AuditLogWriteException {
        Mockito.doReturn(mockSecurityEventAuditMessage).when(mockAuditLogMessageFactory)
                .createSecurityEventAuditMessage();
        Mockito.doReturn("0.0.0.0").when(classUnderTest).getRemoteAddress();
        doThrow(AuditLogWriteException.class).when(mockSecurityEventAuditMessage).log();
        classUnderTest.logSecurityEvent("test-message");
        verify(this.mockSecurityEventAuditMessage, times(1)).log();
        verify(this.mockSecurityEventAuditMessage, times(1)).setUser("$USER");
        verify(this.mockSecurityEventAuditMessage, times(1)).setTenant("$SUBSCRIBER",
                "https://TENANT.authentication.cert.sap.hana.ondemand.com");
    }

    @Test
    @DisplayName("Testing of log data modification audit message for create")
    void testLogDataModificationAuditMessageForCreate() throws AuditLogNotAvailableException, AuditLogWriteException {
        HashMap<String, String> currentEntity = new HashMap<>();
        currentEntity.put("ID", "123");
        HashMap<String, String> oldEntity = null;
        Mockito.doReturn(mockDataModificationAuditMessage).when(mockAuditLogMessageFactory)
                .createDataModificationAuditMessage();
        Mockito.doReturn(mockAuditedObject).when(mockAuditLogMessageFactory).createAuditedObject();
        when(mockEventContext.getChangeSetContext()).thenReturn(mockChangeSetContext);
        classUnderTest.logDataModificationAuditMessage(mockEventContext, "test", "test", currentEntity, oldEntity,
                mockAuditedDataSubject, "create");
        verify(this.mockDataModificationAuditMessage, times(1)).logPrepare();
        verify(this.mockDataModificationAuditMessage, times(1)).setUser("$USER");
        verify(this.mockDataModificationAuditMessage, times(1)).setTenant("$SUBSCRIBER",
                "https://TENANT.authentication.cert.sap.hana.ondemand.com");
    }

    @Test
    @DisplayName("Testing of log data modification audit message for update")
    void testLogDataModificationAuditMessageForUpdate() throws AuditLogNotAvailableException, AuditLogWriteException {
        HashMap<String, String> currentEntity = new HashMap<>();
        currentEntity.put("ID", "321");
        HashMap<String, String> oldEntity = new HashMap<>();
        oldEntity.put("ID", "123");
        Mockito.doReturn(mockDataModificationAuditMessage).when(mockAuditLogMessageFactory)
                .createDataModificationAuditMessage();
        Mockito.doReturn(mockAuditedObject).when(mockAuditLogMessageFactory).createAuditedObject();
        when(mockEventContext.getChangeSetContext()).thenReturn(mockChangeSetContext);
        classUnderTest.logDataModificationAuditMessage(mockEventContext, "test", "test", currentEntity, oldEntity,
                mockAuditedDataSubject, "update");
        verify(this.mockDataModificationAuditMessage, times(1)).addAttribute("ID", "123", "321");
        verify(this.mockDataModificationAuditMessage, times(1)).logPrepare();
        verify(this.mockDataModificationAuditMessage, times(1)).setUser("$USER");
        verify(this.mockDataModificationAuditMessage, times(1)).setTenant("$SUBSCRIBER",
                "https://TENANT.authentication.cert.sap.hana.ondemand.com");
    }

    @Test
    @DisplayName("Testing of log data modification audit message for update, adding fields")
    void testLogDataModificationAuditMessageForUpdateAdd()
            throws AuditLogNotAvailableException, AuditLogWriteException {
        HashMap<String, String> currentEntity = new HashMap<>();
        currentEntity.put("ID", "123");
        HashMap<String, String> oldEntity = new HashMap<>();
        Mockito.doReturn(mockDataModificationAuditMessage).when(mockAuditLogMessageFactory)
                .createDataModificationAuditMessage();
        Mockito.doReturn(mockAuditedObject).when(mockAuditLogMessageFactory).createAuditedObject();
        when(mockEventContext.getChangeSetContext()).thenReturn(mockChangeSetContext);
        classUnderTest.logDataModificationAuditMessage(mockEventContext, "test", "test", currentEntity, oldEntity,
                mockAuditedDataSubject, "update");
        verify(this.mockDataModificationAuditMessage, times(1)).addAttribute("ID", null, "123");
        verify(this.mockDataModificationAuditMessage, times(1)).logPrepare();
        verify(this.mockDataModificationAuditMessage, times(1)).setUser("$USER");
        verify(this.mockDataModificationAuditMessage, times(1)).setTenant("$SUBSCRIBER",
                "https://TENANT.authentication.cert.sap.hana.ondemand.com");
    }

    @Test
    @DisplayName("Testing of log data modification audit message for update, removing fields")
    void testLogDataModificationAuditMessageForUpdateRemove()
            throws AuditLogNotAvailableException, AuditLogWriteException {
        HashMap<String, String> currentEntity = new HashMap<>();
        HashMap<String, String> oldEntity = new HashMap<>();
        oldEntity.put("ID", "123");
        Mockito.doReturn(mockDataModificationAuditMessage).when(mockAuditLogMessageFactory)
                .createDataModificationAuditMessage();
        Mockito.doReturn(mockAuditedObject).when(mockAuditLogMessageFactory).createAuditedObject();
        when(mockEventContext.getChangeSetContext()).thenReturn(mockChangeSetContext);
        classUnderTest.logDataModificationAuditMessage(mockEventContext, "test", "test", currentEntity, oldEntity,
                mockAuditedDataSubject, "update");
        verify(this.mockDataModificationAuditMessage, times(1)).addAttribute("ID", "123", null);
        verify(this.mockDataModificationAuditMessage, times(1)).logPrepare();
        verify(this.mockDataModificationAuditMessage, times(1)).setUser("$USER");
        verify(this.mockDataModificationAuditMessage, times(1)).setTenant("$SUBSCRIBER",
                "https://TENANT.authentication.cert.sap.hana.ondemand.com");
    }

    @Test
    @DisplayName("Testing of log data modification audit message for delete")
    void testLogDataModificationAuditMessageForDelete() throws AuditLogNotAvailableException, AuditLogWriteException {
        HashMap<String, String> currentEntity = new HashMap<>();
        currentEntity.put("ID", "123");
        HashMap<String, String> oldEntity = null;
        Mockito.doReturn(mockDataModificationAuditMessage).when(mockAuditLogMessageFactory)
                .createDataModificationAuditMessage();
        Mockito.doReturn(mockAuditedObject).when(mockAuditLogMessageFactory).createAuditedObject();
        when(mockEventContext.getChangeSetContext()).thenReturn(mockChangeSetContext);
        classUnderTest.logDataModificationAuditMessage(mockEventContext, "test", "test", currentEntity, oldEntity,
                mockAuditedDataSubject, "delete");
        verify(this.mockDataModificationAuditMessage, times(1)).logPrepare();
        verify(this.mockDataModificationAuditMessage, times(1)).setUser("$USER");
        verify(this.mockDataModificationAuditMessage, times(1)).setTenant("$SUBSCRIBER",
                "https://TENANT.authentication.cert.sap.hana.ondemand.com");
    }

    @Test
    @DisplayName("Testing of log data modification audit message in case of exception")
    void testLogDataModificationAuditMessageForException()
            throws AuditLogNotAvailableException, AuditLogWriteException {
        HashMap<String, String> currentEntity = new HashMap<>();
        currentEntity.put("ID", "123");
        HashMap<String, String> oldEntity = null;
        Mockito.doReturn(mockDataModificationAuditMessage).when(mockAuditLogMessageFactory)
                .createDataModificationAuditMessage();
        Mockito.doReturn(mockAuditedObject).when(mockAuditLogMessageFactory).createAuditedObject();
        when(mockEventContext.getChangeSetContext()).thenReturn(mockChangeSetContext);
        doThrow(AuditLogNotAvailableException.class).when(mockDataModificationAuditMessage).logPrepare();
        classUnderTest.logDataModificationAuditMessage(mockEventContext, "test", "test", currentEntity, oldEntity,
                mockAuditedDataSubject, "delete");
        verify(this.mockDataModificationAuditMessage, times(1)).logPrepare();
        verify(this.mockDataModificationAuditMessage, times(1)).setUser("$USER");
        verify(this.mockDataModificationAuditMessage, times(1)).setTenant("$SUBSCRIBER",
                "https://TENANT.authentication.cert.sap.hana.ondemand.com");
    }

}
