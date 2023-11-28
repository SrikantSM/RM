package com.sap.c4p.rm.config;

import java.io.IOException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.web.filter.OncePerRequestFilter;

public class BatchRequestFilter extends OncePerRequestFilter {

    private static final String AVAILABILITY_BATCH_URI = "/odata/v4/WorkforceAvailabilityService/$batch";
    private static final String AVAILABILITY_METADATA_URI = "/odata/v4/WorkforceAvailabilityService/$metadata";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        if (request.getRequestURI().equals(AVAILABILITY_BATCH_URI)) {
            if (!request.getMethod().equals("POST")) {
                response.sendError(405, HttpStatus.METHOD_NOT_ALLOWED.getReasonPhrase());
                return;
            }
            filterChain.doFilter(request, response);
        } else if ((request.getMethod().equals("GET") && request.getRequestURI().equals(AVAILABILITY_METADATA_URI))) {
            filterChain.doFilter(request, response);
        } else {
            response.sendError(404, HttpStatus.NOT_FOUND.getReasonPhrase());
        }
    }

}
