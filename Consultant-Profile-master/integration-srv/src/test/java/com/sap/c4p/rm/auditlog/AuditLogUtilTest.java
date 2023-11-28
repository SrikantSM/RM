package com.sap.c4p.rm.auditlog;

import static com.sap.c4p.rm.TestConstants.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.HashMap;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import com.sap.cds.feature.xsuaa.XsuaaUserInfo;
import com.sap.cds.services.EventContext;
import com.sap.cds.services.changeset.ChangeSetContext;
import com.sap.xs.audit.api.exception.AuditLogNotAvailableException;
import com.sap.xs.audit.api.exception.AuditLogWriteException;
import com.sap.xs.audit.api.v2.AuditLogMessageFactory;
import com.sap.xs.audit.api.v2.AuditedDataSubject;
import com.sap.xs.audit.api.v2.AuditedObject;
import com.sap.xs.audit.api.v2.DataModificationAuditMessage;

import com.sap.c4p.rm.InitMocks;
import com.sap.c4p.rm.cloudfoundry.environment.AuditLogVCAP;

public class AuditLogUtilTest extends InitMocks {

    @Mock
    private AuditLogMessageFactory mockAuditLogMessageFactory;

    @Mock
    private XsuaaUserInfo mockXsuaaUserInfo;

    @Mock
    private DataModificationAuditMessage mockDataModificationAuditMessage;

    @Mock
    private AuditedObject mockAuditedObject;

    @Mock
    private AuditedDataSubject mockAuditedDataSubject;

    @Mock
    private AuditedDataSubject auditLogWriteException;

    @Mock
    private AuditLogVCAP mockAuditLogVCAP;
    
    @Mock
    private EventContext mockContext;
    
    @Mock
    private AuditLogRequestScope auditLogRequestScope;
    
    @Mock
    private AuditLogChangeListener auditLogChangeListener;
    
    @Mock
    private ChangeSetContext changeSetContext;

    @Spy
    @InjectMocks
    private AuditLogUtil classUnderTest;

    @BeforeEach
    void setUp() {
        Mockito.doReturn("https://someword.authentication.cert.sap.hana.ondemand.com").when(mockAuditLogVCAP)
                .getCerturl();
        Mockito.doReturn("TENANT").when(mockXsuaaUserInfo).getSubDomain();
    }

    @Test
    @DisplayName("Test prepare data modification audit message for create operation")
    void testprepareDataModificationAuditMessageForCreate()
            throws AuditLogNotAvailableException, AuditLogWriteException {
        HashMap<String, String> currentEntity = new HashMap<>();
        currentEntity.put("phones", "123456");
        currentEntity.put("emails", "test001@gmail.com");
        currentEntity.put("ProfileDetials",
                "{firstName: TestFirstName lastName: TestLastName formalName: TestFormalName validFrom: 2020-01-01 validTo: 9999-12-31}");
        HashMap<String, String> oldEntity = null;
        Mockito.doReturn(mockDataModificationAuditMessage).when(mockAuditLogMessageFactory)
                .createDataModificationAuditMessage();
        Mockito.doReturn(mockAuditedObject).when(mockAuditLogMessageFactory).createAuditedObject();
        Mockito.doReturn(changeSetContext).when(mockContext).getChangeSetContext();
        classUnderTest.setIsRequestFromCAP(true);

        assertEquals(mockDataModificationAuditMessage, classUnderTest.prepareDataModificationAuditMessage(
        		mockContext, DATA_SUBJECT_TYPE, SERVICE_IDENTIFIER, CREATE_OPERATION, currentEntity, oldEntity, mockAuditedDataSubject));
        verify(this.mockAuditedObject, times(1)).setType(eq(DATA_SUBJECT_TYPE));
        verify(this.mockAuditedObject, times(1)).addIdentifier(eq("service"), eq(SERVICE_IDENTIFIER));
        verify(this.mockDataModificationAuditMessage, times(1)).setObject(mockAuditedObject);
        verify(this.mockDataModificationAuditMessage, times(1)).setDataSubject(mockAuditedDataSubject);
        verify(this.mockDataModificationAuditMessage, times(1)).logPrepare();
        verify(this.mockDataModificationAuditMessage, times(1)).setUser("$USER");
        verify(this.mockDataModificationAuditMessage, times(1)).setTenant("$SUBSCRIBER",
                "https://TENANT.authentication.cert.sap.hana.ondemand.com");
    }

    @Test
    @DisplayName("Test prepare data modification audit message for update operation")
    void testprepareDataModificationAuditMessageForUpdate()
            throws AuditLogNotAvailableException, AuditLogWriteException {
        HashMap<String, String> currentEntity = new HashMap<>();
        currentEntity.put("phones", "123456");
        currentEntity.put("emails", "test001@gmail.com");
        currentEntity.put("ProfileDetials",
                "{firstName: TestFirstName lastName: TestLastName formalName: TestFormalName validFrom: 2020-01-01 validTo: 9999-12-31}");
        Mockito.doReturn(mockDataModificationAuditMessage).when(mockAuditLogMessageFactory)
                .createDataModificationAuditMessage();
        Mockito.doReturn(mockAuditedObject).when(mockAuditLogMessageFactory).createAuditedObject();
        when(mockXsuaaUserInfo.getAdditionalAttribute("cid")).thenReturn("clientId");
        when(mockXsuaaUserInfo.getTenant()).thenReturn("81a2def2-1u04-1e4d-w708-1704745g0269");
        doThrow(AuditLogWriteException.class).when(mockDataModificationAuditMessage).logPrepare();
        Mockito.doReturn(changeSetContext).when(mockContext).getChangeSetContext();
        classUnderTest.setIsRequestFromCAP(true);
        assertEquals(mockDataModificationAuditMessage, classUnderTest.prepareDataModificationAuditMessage(
        		mockContext, DATA_SUBJECT_TYPE, SERVICE_IDENTIFIER, UPDATE_OPERATION, currentEntity, currentEntity, mockAuditedDataSubject));
        verify(this.mockAuditedObject, times(1)).setType(eq(DATA_SUBJECT_TYPE));
        verify(this.mockAuditedObject, times(1)).addIdentifier(eq("service"), eq(SERVICE_IDENTIFIER));
        verify(this.mockDataModificationAuditMessage, times(1)).setObject(mockAuditedObject);
        verify(this.mockDataModificationAuditMessage, times(1)).setDataSubject(mockAuditedDataSubject);
        verify(this.mockDataModificationAuditMessage, times(1)).logPrepare();
        verify(this.mockDataModificationAuditMessage, times(1)).setUser("$USER");
        verify(this.mockDataModificationAuditMessage, times(1)).setTenant("$SUBSCRIBER",
                "https://TENANT.authentication.cert.sap.hana.ondemand.com");
    }

    @Test
    @DisplayName("Test prepare data modification audit message for include operation")
    void testprepareDataModificationAuditMessageForInclude()
            throws AuditLogNotAvailableException, AuditLogWriteException {
        HashMap<String, String> currentEntity = new HashMap<>();
        currentEntity.put("phones", "123456");
        currentEntity.put("emails", "test001@gmail.com");
        currentEntity.put("ProfileDetials",
                "{firstName: TestFirstName lastName: TestLastName formalName: TestFormalName validFrom: 2020-01-01 validTo: 9999-12-31}");
        Mockito.doReturn(mockDataModificationAuditMessage).when(mockAuditLogMessageFactory)
                .createDataModificationAuditMessage();
        Mockito.doReturn(mockAuditedObject).when(mockAuditLogMessageFactory).createAuditedObject();
        when(mockXsuaaUserInfo.getAdditionalAttribute("cid")).thenReturn("clientId");
        when(mockXsuaaUserInfo.getTenant()).thenReturn("81a2def2-1u04-1e4d-w708-1704745g0269");
        doThrow(AuditLogNotAvailableException.class).when(mockDataModificationAuditMessage).logPrepare();
        Mockito.doReturn(changeSetContext).when(mockContext).getChangeSetContext();
        classUnderTest.setIsRequestFromCAP(true);
        assertEquals(mockDataModificationAuditMessage, classUnderTest.prepareDataModificationAuditMessage(
        		mockContext, DATA_SUBJECT_TYPE, SERVICE_IDENTIFIER, INCLUDE_OPERATION, currentEntity, currentEntity, mockAuditedDataSubject));
        verify(this.mockAuditedObject, times(1)).setType(eq(DATA_SUBJECT_TYPE));
        verify(this.mockAuditedObject, times(1)).addIdentifier(eq("service"), eq(SERVICE_IDENTIFIER));
        verify(this.mockDataModificationAuditMessage, times(1)).setObject(mockAuditedObject);
        verify(this.mockDataModificationAuditMessage, times(1)).setDataSubject(mockAuditedDataSubject);
        verify(this.mockDataModificationAuditMessage, times(1)).logPrepare();
        verify(this.mockDataModificationAuditMessage, times(1)).setUser("$USER");
        verify(this.mockDataModificationAuditMessage, times(1)).setTenant("$SUBSCRIBER",
                "https://TENANT.authentication.cert.sap.hana.ondemand.com");
    }

    @Test
    @DisplayName("test setDataModificationAuditMessageToFailure")
    public void setDataModificationAuditMessageToFailure()
            throws AuditLogNotAvailableException, AuditLogWriteException {
        this.classUnderTest.setDataModificationAuditMessageToFailure(mockDataModificationAuditMessage);
        verify(this.mockDataModificationAuditMessage, times(1)).logFailure();
    }

    @Test
    @DisplayName("test setDataModificationAuditMessageToFailure in case of an exception")
    public void setDataModificationAuditMessageToFailureForException()
            throws AuditLogNotAvailableException, AuditLogWriteException {
        this.classUnderTest.setDataModificationAuditMessageToFailure(mockDataModificationAuditMessage);
        doThrow(AuditLogNotAvailableException.class).when(mockDataModificationAuditMessage).logFailure();
        verify(this.mockDataModificationAuditMessage, times(1)).logFailure();

    }

}
