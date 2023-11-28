package com.sap.c4p.rm.processor.workforce;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.sap.c4p.rm.InitMocks;
import com.sap.c4p.rm.exceptions.CapacityCleanupException;
import com.sap.c4p.rm.processor.workforce.dao.WorkforcePersonDAO;
import com.sap.c4p.rm.replicationdao.CapacityCleanupFailuresDAO;
import com.sap.cds.services.ServiceCatalog;
import com.sap.cds.services.mt.TenantProviderService;
import com.sap.cds.services.runtime.CdsRuntime;
import com.sap.cds.services.runtime.RequestContextRunner;
import com.sap.resourcemanagement.consultantprofile.integration.CapacityCleanupFailures;
import com.sap.resourcemanagement.workforce.workassignment.WorkAssignments;

import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;

public class CapacityCleanupJobTest extends InitMocks{
	
	@Mock
	CdsRuntime runtime;
	
	@Mock
	ServiceCatalog serviceCatalog;
	
	@Mock
	TenantProviderService tenantProvider;
	
	@Mock
	RequestContextRunner requestContextRunner;
	
	@Mock
	CapacityCleanupFailuresDAO capacityCleanupFailureDAO;
	
	@Mock
	WorkforcePersonDAO workforcePersonDAO;
	
	@Mock
	WorkforceMDILogAPIProcessor workforceMDILogAPIProcessor;
	
	@Autowired
    @InjectMocks
    private CapacityCleanupJob classUnderTest;
	
	@Test
	@DisplayName("testing retry capacity cleanup")
	public void retryCapacityCleanupTest() {
		List<String> tenants = new ArrayList<>();
		tenants.add("test-tenant");
		when(runtime.getServiceCatalog()).thenReturn(serviceCatalog);
		when(serviceCatalog.getService(Mockito.any(), Mockito.anyString())).thenReturn(tenantProvider);
		when(tenantProvider.readTenants()).thenReturn(tenants);
		when(runtime.requestContext()).thenReturn(requestContextRunner);
		when(requestContextRunner.privilegedUser()).thenReturn(requestContextRunner);
		when(requestContextRunner.modifyUser(Mockito.any())).thenReturn(requestContextRunner);
		classUnderTest.retryCapacityCleanup();
	}
	
	@Test
	@DisplayName("testing cleanup job")
	public void runCapacityCleanupJobTest() {
		List<CapacityCleanupFailures> capacityCleanupFailures = new ArrayList<>();
		CapacityCleanupFailures capacityCleanupFailure = CapacityCleanupFailures.create();
		capacityCleanupFailure.setInstanceId("test-intanceId");
		capacityCleanupFailure.setVersionId("test-versionId");
		capacityCleanupFailures.add(capacityCleanupFailure);
		
		List<WorkAssignments> workAssignments = new ArrayList<>();
		
		when(capacityCleanupFailureDAO.readAll(Mockito.any())).thenReturn(capacityCleanupFailures);
		when(workforcePersonDAO.readWorkAssignmentsOfWorkforcePerson(Mockito.anyString())).thenReturn(workAssignments);
		doNothing().when(workforceMDILogAPIProcessor).cleanUpCapacityData(Mockito.any());
		doNothing().when(capacityCleanupFailureDAO).update(Mockito.any(), Mockito.anyString(), Mockito.anyString());
		classUnderTest.runCapacityCleanupJob("test-tenant");
	}
	
	@Test
	@DisplayName("testing cleanup job failed with capacity cleanup Exception")
	public void runCapacityCleanupJobRaisesCapacityCleanupExceptionTest() {
		Logger fooLogger = (Logger) LoggerFactory.getLogger(CapacityCleanupJob.class);
        ListAppender<ILoggingEvent> listAppender = new ListAppender<>();
        listAppender.start();
        fooLogger.addAppender(listAppender);
		
		List<CapacityCleanupFailures> capacityCleanupFailures = new ArrayList<>();
		CapacityCleanupFailures capacityCleanupFailure = CapacityCleanupFailures.create();
		capacityCleanupFailure.setInstanceId("test-intanceId");
		capacityCleanupFailure.setVersionId("test-versionId");
		capacityCleanupFailures.add(capacityCleanupFailure);
		
		List<WorkAssignments> workAssignments = new ArrayList<>();
		
		when(capacityCleanupFailureDAO.readAll(Mockito.any())).thenReturn(capacityCleanupFailures);
		when(workforcePersonDAO.readWorkAssignmentsOfWorkforcePerson(Mockito.anyString())).thenReturn(workAssignments);
		doThrow(new CapacityCleanupException()).when(workforceMDILogAPIProcessor).cleanUpCapacityData(Mockito.any());
		classUnderTest.runCapacityCleanupJob("test-tenant");
        
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals("Starting capacityCleanupJob for tenant test-tenant", logsList.get(0).getMessage());
        assertEquals("The capacity cleanup job failed for instance id: test-intanceId and version id: test-versionId for tenant: test-tenant with exception: com.sap.c4p.rm.exceptions.CapacityCleanupException", logsList.get(1).getMessage());
	}
	
	@Test
	@DisplayName("testing cleanup job failed with Exception")
	public void runCapacityCleanupJobRaisesExceptionTest() {
		Logger fooLogger = (Logger) LoggerFactory.getLogger(CapacityCleanupJob.class);
        ListAppender<ILoggingEvent> listAppender = new ListAppender<>();
        listAppender.start();
        fooLogger.addAppender(listAppender);
        
        List<CapacityCleanupFailures> capacityCleanupFailures = new ArrayList<>();
		CapacityCleanupFailures capacityCleanupFailure = CapacityCleanupFailures.create();
		capacityCleanupFailure.setInstanceId("test-intanceId");
		capacityCleanupFailure.setVersionId("test-versionId");
		capacityCleanupFailures.add(capacityCleanupFailure);
		
		when(capacityCleanupFailureDAO.readAll(Mockito.any())).thenReturn(capacityCleanupFailures);
        when(workforcePersonDAO.readWorkAssignmentsOfWorkforcePerson(Mockito.anyString())).thenThrow(new NullPointerException("Error occurred"));
		classUnderTest.runCapacityCleanupJob("test-tenant");
        
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals("Starting capacityCleanupJob for tenant test-tenant", logsList.get(0).getMessage());
        assertEquals("Unknown error occured during capacity cleanup job run for tenant test-tenantwith exception: java.lang.NullPointerException: Error occurred", logsList.get(1).getMessage());
	}

}
