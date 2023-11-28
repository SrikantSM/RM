package com.sap.c4p.rm.skill.handlers;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Collections;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.sap.cds.services.cds.CdsReadEventContext;
import com.sap.cds.services.request.UserInfo;

import fileuploadservice.WhoAmI;

class WhoAmIHandlerTest {

  private WhoAmIHandler cut;

  private final String testUserName = "Test User";

  @BeforeEach
  void beforeEach() {
    this.cut = new WhoAmIHandler();
  }

  @Test
  @DisplayName("verify that onRequest() invokes all expected methods")
  void onRequest() {
    WhoAmI mockUser = WhoAmI.create();
    UserInfo mockUserInfo = mock(UserInfo.class);
    mockUser.setUserName(this.testUserName);
    CdsReadEventContext mockContext = mock(CdsReadEventContext.class);

    when(mockUserInfo.getName()).thenReturn(this.testUserName);
    when(mockContext.getUserInfo()).thenReturn(mockUserInfo);

    this.cut.onRequest(mockContext);

    verify(mockContext).setResult(Collections.singletonList(mockUser));
    verify(mockContext).setCompleted();
  }
}
