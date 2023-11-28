package com.sap.c4p.rm.consultantprofile.auditlog;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;

import com.sap.cds.services.authorization.EntityAccessEventContext;
import com.sap.cds.services.authorization.ServiceAccessEventContext;
import com.sap.cds.services.request.ParameterInfo;
import com.sap.cds.services.request.UserInfo;

import com.sap.c4p.rm.consultantprofile.InitMocks;

public class AuthorizationEventHandlerTest extends InitMocks {

    @Mock
    AuditLogUtil mockAuditLogUtil;

    @Mock
    ServiceAccessEventContext mockServiceAccessEventContext;

    @Mock
    EntityAccessEventContext mockEntityAccessEventContext;

    @Mock
    UserInfo mockUserInfo;

    @Mock
    MessageSource mockMessageSource;

    @Mock
    ParameterInfo mockParameterInfo;

    @Autowired
    @InjectMocks
    AuthorizationEventHandler classUnderTest;

    @BeforeEach
    public void setUp() {
        classUnderTest.setMessageSource(mockMessageSource);
    }

    @Test
    @DisplayName("check if the authorization security log is triggered for service access event")
    void triggerSecurityLogForServiceAccess() {
        when(mockServiceAccessEventContext.getResult()).thenReturn(true);
        when(mockServiceAccessEventContext.getUserInfo()).thenReturn(mockUserInfo);
        when(mockServiceAccessEventContext.getUserInfo().getName()).thenReturn("test@sap.com");
        when(mockServiceAccessEventContext.getUserInfo().getTenant()).thenReturn("testTenant");
        when(mockServiceAccessEventContext.getAccessEventName()).thenReturn("READ");
        when(mockServiceAccessEventContext.getAccessServiceName()).thenReturn("service");
        when(mockServiceAccessEventContext.getAccessServiceName()).thenReturn("service");
        when(mockServiceAccessEventContext.getParameterInfo()).thenReturn(mockParameterInfo);
        when(mockParameterInfo.getCorrelationId()).thenReturn("123456");
        when(mockMessageSource.getMessage(any(), any(), any())).thenReturn("resource:{0},event:{1}");
        Mockito.doReturn("0.0.0.0").when(mockAuditLogUtil).getRemoteAddress();
        classUnderTest.afterServiceAuthorization(mockServiceAccessEventContext);
        verify(this.mockAuditLogUtil, times(1)).logSecurityEvent(anyString());
    }
}
