package com.sap.c4p.rm.processor.workforce;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.sap.c4p.rm.config.LoggingMarker;
import com.sap.c4p.rm.exceptions.CapacityCleanupException;
import com.sap.c4p.rm.processor.workforce.dao.WorkforcePersonDAO;
import com.sap.c4p.rm.replicationdao.CapacityCleanupFailuresDAO;
import com.sap.c4p.rm.utils.Constants;
import com.sap.cds.services.mt.TenantProviderService;
import com.sap.cds.services.runtime.CdsRuntime;
import com.sap.resourcemanagement.consultantprofile.integration.CapacityCleanupFailures;
import com.sap.resourcemanagement.workforce.workassignment.WorkAssignments;

@Service
public class CapacityCleanupJob {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(CapacityCleanupJob.class);
    private static final Marker CAPACITY_CLEANUP_MARKER = LoggingMarker.CAPACITY_CLEANUP.getMarker();
	
	private CapacityCleanupFailuresDAO capacityCleanupFailureDAO;
	private WorkforcePersonDAO workforcePersonDAO;
	private WorkforceMDILogAPIProcessor workforceMDILogAPIProcessor;
	private CdsRuntime runtime;
	
	@Autowired
	public CapacityCleanupJob(CapacityCleanupFailuresDAO capacityCleanupFailureDAO,
			WorkforcePersonDAO workforcePersonDAO, WorkforceMDILogAPIProcessor workforceMDILogAPIProcessor,
			CdsRuntime runtime) {
		this.capacityCleanupFailureDAO = capacityCleanupFailureDAO;
		this.workforcePersonDAO = workforcePersonDAO;
		this.workforceMDILogAPIProcessor = workforceMDILogAPIProcessor;
		this.runtime = runtime;
	}
	
	@Scheduled(cron = Constants.CRON_JOB_PATTERN_FOR_CAPACITY_CLEANUP)
	public void retryCapacityCleanup() {
		try {
	        TenantProviderService tenantProvider = runtime.getServiceCatalog().getService(TenantProviderService.class,
	                TenantProviderService.DEFAULT_NAME);
	        List<String> tenants = tenantProvider.readTenants();
	        LOGGER.info(CAPACITY_CLEANUP_MARKER, "Starting capacity Cleanup job for {} tenants", tenants.size());
			tenants.forEach(tenant -> runtime.requestContext().privilegedUser()
	           .modifyUser(user -> user.setTenant(tenant)).run(tenantContext -> {
	               String tenantId = tenantContext.getUserInfo().getTenant();
	               LOGGER.info(CAPACITY_CLEANUP_MARKER, "Initiating the capacity cleanup job for tenant {}", tenantId);
	               runCapacityCleanupJob(tenantId);
	           }));
		} catch (Exception e) {
			LOGGER.error(CAPACITY_CLEANUP_MARKER, "Unknown error occured during availability cleanup job run. Exception: " + e);
		}
	}
	
	public void runCapacityCleanupJob(String currentTenant) {
		LOGGER.info("Starting capacityCleanupJob for tenant " + currentTenant);
		String instanceId = null;
		String versionId = null;
		List<CapacityCleanupFailures> capacityCleanupFailures = capacityCleanupFailureDAO.readAll(CAPACITY_CLEANUP_MARKER);
		for (CapacityCleanupFailures capacityCleanupFailure : capacityCleanupFailures) {
			try {
				instanceId = capacityCleanupFailure.getInstanceId();
				versionId = capacityCleanupFailure.getVersionId();
				List<WorkAssignments> workAssignments = workforcePersonDAO.readWorkAssignmentsOfWorkforcePerson(instanceId);
				this.workforceMDILogAPIProcessor.cleanUpCapacityData(workAssignments);
				capacityCleanupFailureDAO.update(CAPACITY_CLEANUP_MARKER, instanceId, versionId);
			} catch (CapacityCleanupException exception) {
				if (instanceId != null)
					LOGGER.error(CAPACITY_CLEANUP_MARKER, "The capacity cleanup job failed for instance id: "
							+ instanceId + " and version id: " + versionId + " for tenant: "
							+ currentTenant + " with exception: " + exception);
			} catch (Exception e) {
				LOGGER.error("Unknown error occured during capacity cleanup job run for tenant " + currentTenant + "with exception: " + e);
			}
		}
		LOGGER.info("capacityCleanupJob for tenant " + currentTenant + " is completed successfully!");
	}

}
