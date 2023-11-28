package com.sap.c4p.rm.resourcerequest.auditlog;

import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;

public class HttpRequestHelper {
  private HttpRequestHelper() {
  }

  public static HttpServletRequest getHttpRequest() {
    final RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
    if (requestAttributes instanceof ServletRequestAttributes)
      return ((ServletRequestAttributes) requestAttributes).getRequest();
    return null;
  }
}
