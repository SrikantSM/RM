package com.sap.c4p.rm.skill.utils;

import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.mock;

class HttpRequestHelperTest {

  @Test
  @DisplayName("assert that the static method HttpRequestHelper.getHttpRequest() returns the correct http servlet request")
  void getHttpRequestWithServletRequestAttributes() {
    HttpServletRequest expectedServletRequest = mock(HttpServletRequest.class);
    ServletRequestAttributes requestAttributes = new ServletRequestAttributes(expectedServletRequest);
    try (MockedStatic<RequestContextHolder> requestContextHolder = Mockito.mockStatic(RequestContextHolder.class)) {
      requestContextHolder.when(() -> RequestContextHolder.getRequestAttributes()).thenReturn(requestAttributes);
      HttpServletRequest actualServletRequest = HttpRequestHelper.getHttpRequest();
      assertEquals(expectedServletRequest, actualServletRequest);
    }

  }

  @Test
  @DisplayName("check if the static method HttpRequestHelper.getHttpRequest() returns null if the passed request attributes are not servlet request attributes")
  void getHttpRequestWithoutServletRequestAttributes() {
    HttpServletRequest actualServletRequest = HttpRequestHelper.getHttpRequest();
    assertNull(actualServletRequest);
  }
}
