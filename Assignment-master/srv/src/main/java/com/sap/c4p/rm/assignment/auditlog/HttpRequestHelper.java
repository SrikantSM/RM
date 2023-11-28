/**
 * 
 */
package com.sap.c4p.rm.assignment.auditlog;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * @author I310562
 *
 */
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
