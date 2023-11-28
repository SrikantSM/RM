package com.sap.c4p.rm.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;

import com.sap.cds.services.runtime.CdsRuntime;
import com.sap.cds.services.runtime.RequestContextRunner;
import com.sap.hcp.cf.logging.common.LogContext;

import com.sap.c4p.rm.InitMocks;

public class JobSchedulerControllerTest extends InitMocks {

    @Mock
    CdsRuntime cdsRuntime;

    @Mock
    RequestContextRunner requestContextRunner;

    @Autowired
    @InjectMocks
    private JobSchedulerController classUnderTest;

    @Test
    @DisplayName("Test createTenantJobs.")
    public void testCreateTenantJobs() {
        when(this.cdsRuntime.requestContext()).thenReturn(requestContextRunner);
        when(this.requestContextRunner.providedUser()).thenReturn(requestContextRunner);
        ResponseEntity<String> responseEntity = this.classUnderTest.createTenantJobs("jobId", "scheduleId", "runId",
                "host", "runAt");
        assertEquals(HttpStatus.ACCEPTED, responseEntity.getStatusCode());
        assertEquals("The House Keeper job has been submitted: CP_HouseKeeper_ID-" + LogContext.getCorrelationId(),
                responseEntity.getBody());
    }

}
