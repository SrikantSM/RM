package com.sap.c4p.rm.consultantprofile.auditlog;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

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
