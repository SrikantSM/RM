package com.sap.c4p.rm.consultantprofile.config;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.http.HttpStatus;

public class BatchRequestFilterTest {

    @Mock
    HttpServletRequest httpServletRequest;

    @Mock
    HttpServletResponse httpServletResponse;

    @Mock
    FilterChain filterChain;

    BatchRequestFilter classUnderTest;

    @BeforeEach
    public void setUp() throws IOException {
        classUnderTest = new BatchRequestFilter();
        httpServletRequest = Mockito.mock(HttpServletRequest.class);
        httpServletResponse = Mockito.mock(HttpServletResponse.class);
        filterChain = Mockito.mock(FilterChain.class);

    }

    @Test
    public void doFilterInternalPostBatchRequestTest() throws ServletException, IOException {
        when(httpServletRequest.getRequestURI()).thenReturn("/odata/v4/ProjectExperienceService/$batch");
        when(httpServletRequest.getMethod()).thenReturn("POST");
        doNothing().when(filterChain).doFilter(httpServletRequest, httpServletResponse);
        classUnderTest.doFilterInternal(httpServletRequest, httpServletResponse, filterChain);
        verify(this.filterChain, times(1)).doFilter(httpServletRequest, httpServletResponse);

    }

    @Test
    public void doFilterInternalGetBatchRequestTest() throws ServletException, IOException {
        when(httpServletRequest.getRequestURI()).thenReturn("/odata/v4/ProjectExperienceService/$batch");
        when(httpServletRequest.getMethod()).thenReturn("GET");
        doNothing().when(filterChain).doFilter(httpServletRequest, httpServletResponse);
        classUnderTest.doFilterInternal(httpServletRequest, httpServletResponse, filterChain);
        verify(this.httpServletResponse, times(1)).sendError(405, HttpStatus.METHOD_NOT_ALLOWED.getReasonPhrase());

    }

    @Test
    public void doFilterInternalPatchBatchRequestTest() throws ServletException, IOException {
        when(httpServletRequest.getRequestURI()).thenReturn("/odata/v4/ProjectExperienceService/$batch");
        when(httpServletRequest.getMethod()).thenReturn("PATCH");
        doNothing().when(filterChain).doFilter(httpServletRequest, httpServletResponse);
        classUnderTest.doFilterInternal(httpServletRequest, httpServletResponse, filterChain);
        verify(this.httpServletResponse, times(1)).sendError(405, HttpStatus.METHOD_NOT_ALLOWED.getReasonPhrase());

    }

    @Test
    public void doFilterInternalGetMetadataRequestTest() throws ServletException, IOException {
        when(httpServletRequest.getRequestURI()).thenReturn("/odata/v4/ProjectExperienceService/$metadata");
        when(httpServletRequest.getMethod()).thenReturn("GET");
        doNothing().when(filterChain).doFilter(httpServletRequest, httpServletResponse);
        classUnderTest.doFilterInternal(httpServletRequest, httpServletResponse, filterChain);
        verify(this.filterChain, times(1)).doFilter(httpServletRequest, httpServletResponse);

    }

    @Test
    public void doFilterInternalPostMetadataRequestTest() throws ServletException, IOException {
        when(httpServletRequest.getRequestURI()).thenReturn("/odata/v4/ProjectExperienceService/$metadata");
        when(httpServletRequest.getMethod()).thenReturn("POST");
        doNothing().when(filterChain).doFilter(httpServletRequest, httpServletResponse);
        classUnderTest.doFilterInternal(httpServletRequest, httpServletResponse, filterChain);
        verify(this.httpServletResponse, times(1)).sendError(404, HttpStatus.NOT_FOUND.getReasonPhrase());

    }

    @Test
    public void doFilterInternalPostProfilesRequestTest() throws ServletException, IOException {
        when(httpServletRequest.getRequestURI()).thenReturn("/odata/v4/ProjectExperienceService/Profiles");
        when(httpServletRequest.getMethod()).thenReturn("POST");
        doNothing().when(filterChain).doFilter(httpServletRequest, httpServletResponse);
        classUnderTest.doFilterInternal(httpServletRequest, httpServletResponse, filterChain);
        verify(this.httpServletResponse, times(1)).sendError(404, HttpStatus.NOT_FOUND.getReasonPhrase());

    }

    @Test
    public void doFilterInternalGetProfilesRequestTest() throws ServletException, IOException {
        when(httpServletRequest.getRequestURI()).thenReturn("/odata/v4/ProjectExperienceService/Profiles");
        when(httpServletRequest.getMethod()).thenReturn("GET");
        doNothing().when(filterChain).doFilter(httpServletRequest, httpServletResponse);
        classUnderTest.doFilterInternal(httpServletRequest, httpServletResponse, filterChain);
        verify(this.httpServletResponse, times(1)).sendError(404, HttpStatus.NOT_FOUND.getReasonPhrase());

    }

    @Test
    public void doFilterInternalPatchProfilesRequestTest() throws ServletException, IOException {
        when(httpServletRequest.getRequestURI()).thenReturn("/odata/v4/ProjectExperienceService/Profiles");
        when(httpServletRequest.getMethod()).thenReturn("PATCH");
        doNothing().when(filterChain).doFilter(httpServletRequest, httpServletResponse);
        classUnderTest.doFilterInternal(httpServletRequest, httpServletResponse, filterChain);
        verify(this.httpServletResponse, times(1)).sendError(404, HttpStatus.NOT_FOUND.getReasonPhrase());

    }

    @Test
    public void doFilterInternalPutPrimaryWorkAssignmentRequestTest() throws ServletException, IOException {
        when(httpServletRequest.getRequestURI()).thenReturn("/odata/v4/ProjectExperienceService/PrimaryWorkAssignment");
        when(httpServletRequest.getMethod()).thenReturn("PATCH");
        doNothing().when(filterChain).doFilter(httpServletRequest, httpServletResponse);
        classUnderTest.doFilterInternal(httpServletRequest, httpServletResponse, filterChain);
        verify(this.httpServletResponse, times(1)).sendError(404, HttpStatus.NOT_FOUND.getReasonPhrase());

    }
}
