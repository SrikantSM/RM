package com.sap.c4p.rm.skill.config;

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
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;

import com.sap.cds.services.authorization.EntityAccessEventContext;
import com.sap.cds.services.authorization.ServiceAccessEventContext;
import com.sap.cds.services.request.ParameterInfo;
import com.sap.cds.services.request.UserInfo;

import com.sap.c4p.rm.skill.services.CloudAuditLogService;

public class AuthorizationEventHandlerTest {

  @Mock
  CloudAuditLogService mockAuditLogUtil;

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
    MockitoAnnotations.initMocks(this);
    classUnderTest.setMessageSource(mockMessageSource);
  }

  @Test
  @DisplayName("check if the authorization security log is triggered for service access event")
  void triggerSecurityLogForServiceAcess() {
    when(mockServiceAccessEventContext.getResult()).thenReturn(true);
    when(mockServiceAccessEventContext.getUserInfo()).thenReturn(mockUserInfo);
    when(mockServiceAccessEventContext.getUserInfo().getName()).thenReturn("test@sap.com");
    when(mockServiceAccessEventContext.getUserInfo().getTenant()).thenReturn("testTenant");
    when(mockServiceAccessEventContext.getAccessEventName()).thenReturn("READ");
    when(mockServiceAccessEventContext.getAccessServiceName()).thenReturn("service");
    when(mockServiceAccessEventContext.getParameterInfo()).thenReturn(mockParameterInfo);
    when(mockParameterInfo.getCorrelationId()).thenReturn("123456");
    when(mockMessageSource.getMessage(any(), any(), any())).thenReturn("resource:{0},event:{1}");
    Mockito.doReturn("0.0.0.0").when(mockAuditLogUtil).getRemoteHost();
    classUnderTest.afterServiceAuthorization(mockServiceAccessEventContext);
    verify(this.mockAuditLogUtil, times(1)).logSecurityEvent(anyString());
  }

  @Test
  @DisplayName("check if the authorization security log is triggered for entity access event")
  void triggerSecurityLogForEntityAcess() {
    when(mockEntityAccessEventContext.getResult()).thenReturn(true);
    when(mockEntityAccessEventContext.getUserInfo()).thenReturn(mockUserInfo);
    when(mockEntityAccessEventContext.getUserInfo().getName()).thenReturn("test@sap.com");
    when(mockEntityAccessEventContext.getUserInfo().getTenant()).thenReturn("testTenant");
    when(mockEntityAccessEventContext.getAccessEventName()).thenReturn("READ");
    when(mockEntityAccessEventContext.getAccessEntityName()).thenReturn("entity");
    when(mockEntityAccessEventContext.getParameterInfo()).thenReturn(mockParameterInfo);
    when(mockParameterInfo.getCorrelationId()).thenReturn("123456");
    when(mockMessageSource.getMessage(any(), any(), any())).thenReturn("resource:{0},event:{1}");
    Mockito.doReturn("0.0.0.0").when(mockAuditLogUtil).getRemoteHost();
    classUnderTest.afterEntityAuthorization(mockEntityAccessEventContext);
    verify(this.mockAuditLogUtil, times(1)).logSecurityEvent(anyString());
  }

}
