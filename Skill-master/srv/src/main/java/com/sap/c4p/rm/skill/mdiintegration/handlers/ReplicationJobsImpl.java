package com.sap.c4p.rm.skill.mdiintegration.handlers;

import com.sap.c4p.rm.skill.config.LoggingMarker;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.model.JobScheduleRunPayload;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.service.JobSchedulerService;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.masterdataintegration.MDIEntities;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.masterdataintegration.MasterDataIntegrationService;
import com.sap.c4p.rm.skill.mdiintegration.exceptions.TransactionException;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.WorkforceCapabilityMDIEventsAPIProcessor;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dto.CapabilityValue;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dto.WorkforceCapabilityLog;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapabilitycatalog.WorkforceCapabilityCatalogMDIEventsAPIProcessor;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapabilitycatalog.dto.CatalogValue;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapabilitycatalog.dto.WorkForceCapabilityCatalogLog;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.WorkforceProficiencyScaleMDIEventsAPIProcessor;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dto.ProficiencyValue;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dto.WorkForceCapabilityProficiencyScaleLog;
import com.sap.c4p.rm.skill.mdiintegration.replicationdao.OneMDSReplicationDeltaTokenDAO;
import com.sap.resourcemanagement.skill.integration.OneMDSDeltaTokenInfo;
import org.apache.commons.lang3.StringUtils;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * An Implement of {@link ReplicationJobs} to initiate the internal jobs of
 * replication.
 */
@Component
public class ReplicationJobsImpl implements ReplicationJobs {

  private static final Logger LOGGER = LoggerFactory.getLogger(ReplicationJobsImpl.class);

  private static final Marker WORKFORCE_CAPABILITY_JOBS = LoggingMarker.WORKFORCE_CAPABILITY_JOBS.getMarker();
  private static final Marker WORKFORCE_CAPABILITY_CATALOG_REPLICATION = LoggingMarker.WORKFORCE_CAPABILITY_CATALOG_REPLICATION
      .getMarker();
  private static final Marker WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION = LoggingMarker.WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION
      .getMarker();

  private static final Marker WORKFORCE_CAPABILITY_REPLICATION = LoggingMarker.WORKFORCE_CAPABILITY_REPLICATION
      .getMarker();

  private static final String TOTAL_NUMBER_OF_EVENTS_RECEIVED = "ReceivedEvents";
  private static final String STATUS = "Status";
  private static final String TOTAL_NUMBER_OF_PASSED_EVENTS = "Success";
  private static final String TOTAL_NUMBER_OF_FAILED_EVENTS = "Fail";

  private static final String DELTA_TOKEN = "$deltatoken=";

  private final JobSchedulerService jobSchedulerService;
  private final MasterDataIntegrationService masterDataIntegrationService;
  private final WorkforceCapabilityCatalogMDIEventsAPIProcessor workforceCapabilityCatalogMDIEventsAPIProcessor;
  private final WorkforceProficiencyScaleMDIEventsAPIProcessor workforceProficiencyScaleMDIEventsAPIProcessor;
  private final WorkforceCapabilityMDIEventsAPIProcessor workforceCapabilityMDIEventsAPIProcessor;

  private final OneMDSReplicationDeltaTokenDAO oneMDSReplicationDeltaTokenDAO;


  @Autowired
  public ReplicationJobsImpl(final JobSchedulerService jobSchedulerService,
                             final MasterDataIntegrationService masterDataIntegrationService,
                             final WorkforceCapabilityCatalogMDIEventsAPIProcessor workforceCapabilityCatalogMDIEventsAPIProcessor,
                             final WorkforceProficiencyScaleMDIEventsAPIProcessor workforceProficiencyScaleMDIEventsAPIProcessor,
                             final WorkforceCapabilityMDIEventsAPIProcessor workforceCapabilityMDIEventsAPIProcessor,
                             final OneMDSReplicationDeltaTokenDAO oneMDSReplicationDeltaTokenDAO) {
    this.jobSchedulerService = jobSchedulerService;
    this.masterDataIntegrationService = masterDataIntegrationService;
    this.workforceCapabilityCatalogMDIEventsAPIProcessor = workforceCapabilityCatalogMDIEventsAPIProcessor;
    this.workforceProficiencyScaleMDIEventsAPIProcessor = workforceProficiencyScaleMDIEventsAPIProcessor;
    this.oneMDSReplicationDeltaTokenDAO = oneMDSReplicationDeltaTokenDAO;
    this.workforceCapabilityMDIEventsAPIProcessor = workforceCapabilityMDIEventsAPIProcessor;
  }

  @Override
  public void submitForWorkforceCapabilityObjectsReplication(final String customerSubDomain,
      final JobSchedulerRunHeader jobSchedulerRunHeader) {
    if (this.jobSchedulerService.ifPreviousRunComplete(WORKFORCE_CAPABILITY_JOBS, customerSubDomain,
        jobSchedulerRunHeader)) {
      // Yet to introduce - previous run status for job scheduler
      this.submitForWorkforceCapabilityCatalogReplication(customerSubDomain, jobSchedulerRunHeader);
      this.submitForWorkforceCapabilityProfScaleReplication(customerSubDomain, jobSchedulerRunHeader);
      this.submitForWorkforceCapabilityReplication(customerSubDomain, jobSchedulerRunHeader);
      this.cleanSnapshotForWorkforceCapabilityObjects(customerSubDomain, jobSchedulerRunHeader);
    }
  }

  @Override
  public void submitForWorkforceCapabilityCatalogReplication(final String subDomain,
      final JobSchedulerRunHeader jobSchedulerRunHeader) {
    int totalRecordsToBeProcessed = 0;
    int totalRecordsProcessed = 0;

    try {
      String nextDeltaToken = this.oneMDSReplicationDeltaTokenDAO
          .getDeltaToken(MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION).map(OneMDSDeltaTokenInfo::getDeltaToken)
          .orElse(null);
      LOGGER.info("Delta token before WorkForce Capability Catalog Replication: {}", nextDeltaToken);

      /*
       * Taking the snapshot of workforce capability catalog to maintain the exclusion state
       * before the initial load starts.
       */
      if (nextDeltaToken == null) {
        LOGGER.info("Taking Workforce capability catalog Objects snapshot");
        this.workforceCapabilityCatalogMDIEventsAPIProcessor.takeExistingCatalogSnapShot();
        LOGGER.info("Workforce capability catalog Objects snapshot taken");
      }

      boolean isNullFromMDI = false;
      boolean loadMoreElements = true;
      while (loadMoreElements) {
        WorkForceCapabilityCatalogLog workForceCapabilityCatalogLog = this.masterDataIntegrationService
            .getMDILogRecords(WORKFORCE_CAPABILITY_CATALOG_REPLICATION, subDomain,
                MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION, nextDeltaToken,
                WorkForceCapabilityCatalogLog.class, jobSchedulerRunHeader);
        LOGGER.info("Workforce Capability catalog Log: {}", workForceCapabilityCatalogLog);
        if (workForceCapabilityCatalogLog != null) {
          nextDeltaToken = workForceCapabilityCatalogLog.getDeltaLink() == null
              ? workForceCapabilityCatalogLog.getNextLink()
              : workForceCapabilityCatalogLog.getDeltaLink();

          nextDeltaToken = StringUtils.substringAfter(nextDeltaToken, DELTA_TOKEN);
          LOGGER.info("New delta token after Workforce Capability Catalog Replication: {}", nextDeltaToken);
          List<CatalogValue> workforceCapabilityCatalogInstances = workForceCapabilityCatalogLog.getValue();
          LOGGER.info("Workforce Capability catalog count: {}", workforceCapabilityCatalogInstances.size());
          totalRecordsToBeProcessed += workforceCapabilityCatalogInstances.size();
          totalRecordsProcessed += this.workforceCapabilityCatalogMDIEventsAPIProcessor
              .processWorkforceCapabilityCatalogLog(workforceCapabilityCatalogInstances, subDomain,
                  jobSchedulerRunHeader);

          this.oneMDSReplicationDeltaTokenDAO.save(WORKFORCE_CAPABILITY_CATALOG_REPLICATION,
              MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION, nextDeltaToken);
          // Based on pagination , complete set of data is not loaded, hence presence of
          // next link indicates the next set of data
          loadMoreElements = workForceCapabilityCatalogLog.getNextLink() != null;
          LOGGER.info("End of while loop's if statement: loadMoreElements is {}", loadMoreElements);
        } else {
          loadMoreElements = false;
          isNullFromMDI = true;
        }
      }

      if (!isNullFromMDI) {
        updateJobScheduler(WORKFORCE_CAPABILITY_CATALOG_REPLICATION, subDomain, jobSchedulerRunHeader,
            totalRecordsToBeProcessed, totalRecordsProcessed);
      }
    } catch (TransactionException transactionException) {
      LOGGER.error(WORKFORCE_CAPABILITY_CATALOG_REPLICATION, transactionException.getMessage(), transactionException);
    }
  }

  @Override
  public void submitForWorkforceCapabilityProfScaleReplication(final String subDomain,
      final JobSchedulerRunHeader jobSchedulerRunHeader) {
    int totalRecordsToBeProcessed = 0;
    int totalRecordsProcessed = 0;

    try {
      String nextDeltaToken = this.oneMDSReplicationDeltaTokenDAO
          .getDeltaToken(MDIEntities.WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION)
          .map(OneMDSDeltaTokenInfo::getDeltaToken).orElse(null);

      LOGGER.info("Delta token before WorkforceCapabilityProficiencyScale Replication: {}", nextDeltaToken);

      /*
       * Taking the snapshot of workforce capability proficiency set to maintain the exclusion state
       * before the initial load starts.
       */
      if (nextDeltaToken == null) {
        LOGGER.info("Taking Workforce capability proficiency set Objects snapshot");
        this.workforceProficiencyScaleMDIEventsAPIProcessor.takeExistingProficiencySetSnapShot();
        LOGGER.info("Workforce capability proficiency set Objects snapshot taken");
      }

      boolean isNullFromMDI = false;
      boolean loadMoreElements = true;
      while (loadMoreElements) {
        WorkForceCapabilityProficiencyScaleLog workForceCapabilityProficiencyScaleLog = this.masterDataIntegrationService
            .getMDILogRecords(WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION, subDomain,
                MDIEntities.WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION, nextDeltaToken,
                WorkForceCapabilityProficiencyScaleLog.class, jobSchedulerRunHeader);
        LOGGER.info("Workforce Capability Proficiency Log: {}", workForceCapabilityProficiencyScaleLog);
        if (workForceCapabilityProficiencyScaleLog != null) {
          nextDeltaToken = workForceCapabilityProficiencyScaleLog.getDeltaLink() == null
              ? workForceCapabilityProficiencyScaleLog.getNextLink()
              : workForceCapabilityProficiencyScaleLog.getDeltaLink();
          nextDeltaToken = StringUtils.substringAfter(nextDeltaToken, DELTA_TOKEN);
          LOGGER.info("New delta token after Workforce Capability Proficiency Replication: {}", nextDeltaToken);
          List<ProficiencyValue> workForceCapabilityProficiencyInstances = workForceCapabilityProficiencyScaleLog
              .getValue();
          LOGGER.info("Workforce Capability proficiency count: {}", workForceCapabilityProficiencyInstances.size());
          totalRecordsToBeProcessed += workForceCapabilityProficiencyInstances.size();
          totalRecordsProcessed += this.workforceProficiencyScaleMDIEventsAPIProcessor
              .processWorkforceCapabilityProfScaleLog(workForceCapabilityProficiencyInstances, subDomain,
                  jobSchedulerRunHeader);

          this.oneMDSReplicationDeltaTokenDAO.save(WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION,
              MDIEntities.WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION, nextDeltaToken);

          loadMoreElements = workForceCapabilityProficiencyScaleLog.getNextLink() != null;
        } else {
          loadMoreElements = false;
          isNullFromMDI = true;
        }
      }

      if (!isNullFromMDI) {
        updateJobScheduler(WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION, subDomain, jobSchedulerRunHeader,
            totalRecordsToBeProcessed, totalRecordsProcessed);
      }
    } catch (TransactionException transactionException) {
      LOGGER.error(WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION, transactionException.getMessage(),
          transactionException);
    }
  }

  private void updateJobScheduler(final Marker loggingMarker, final String subDomain,
      final JobSchedulerRunHeader jobSchedulerRunHeader, int totalRecordsToBeProcessed, int totalRecordsProcessed) {
    JSONObject totalNumberOfEventsReceived = new JSONObject();
    JSONObject eventsStatus = new JSONObject();
    eventsStatus.put(TOTAL_NUMBER_OF_PASSED_EVENTS, totalRecordsProcessed);
    eventsStatus.put(TOTAL_NUMBER_OF_FAILED_EVENTS, (totalRecordsToBeProcessed - totalRecordsProcessed));
    totalNumberOfEventsReceived.put(TOTAL_NUMBER_OF_EVENTS_RECEIVED, totalRecordsToBeProcessed);
    totalNumberOfEventsReceived.put(STATUS + " - " + loggingMarker, eventsStatus);

    JobScheduleRunPayload jobScheduleRunPayload;
    if (totalRecordsProcessed < totalRecordsToBeProcessed) {
      jobScheduleRunPayload = new JobScheduleRunPayload(false, totalNumberOfEventsReceived.toString());
    } else {
      jobScheduleRunPayload = new JobScheduleRunPayload(true, totalNumberOfEventsReceived.toString());
    }
    this.jobSchedulerService.updateJobRun(loggingMarker, subDomain, jobSchedulerRunHeader, jobScheduleRunPayload);
  }

  @Override
  public void submitForWorkforceCapabilityReplication(final String subDomain,
      final JobSchedulerRunHeader jobSchedulerRunHeader) {
    int totalRecordsToBeProcessed = 0;
    int totalRecordsProcessed = 0;

    try {
      String nextDeltaToken = this.oneMDSReplicationDeltaTokenDAO
          .getDeltaToken(MDIEntities.WORKFORCE_CAPABILITY_REPLICATION).map(OneMDSDeltaTokenInfo::getDeltaToken)
          .orElse(null);

      LOGGER.info("Delta token before Workforce Capability Replication: {}", nextDeltaToken);

      /*
       * Taking the snapshot of workforce capability  to maintain the exclusion state
       * before the initial load starts.
       */
      if (nextDeltaToken == null) {
        LOGGER.info("Taking Workforce capability Objects snapshot");
        this.workforceCapabilityMDIEventsAPIProcessor.takeExistingSkillSnapShot();
        LOGGER.info("Workforce capability objects snapshot taken");
      }

      boolean isNullFromMDI = false;
      boolean loadMoreElements = true;
      while (loadMoreElements) {
        WorkforceCapabilityLog workForceCapabilityLog = this.masterDataIntegrationService.getMDILogRecords(
            WORKFORCE_CAPABILITY_REPLICATION, subDomain, MDIEntities.WORKFORCE_CAPABILITY_REPLICATION, nextDeltaToken,
            WorkforceCapabilityLog.class, jobSchedulerRunHeader);
        LOGGER.info("Workforce Capability Log: {}", workForceCapabilityLog);
        if (workForceCapabilityLog != null) {
          nextDeltaToken = workForceCapabilityLog.getDeltaLink() == null ? workForceCapabilityLog.getNextLink()
              : workForceCapabilityLog.getDeltaLink();
          nextDeltaToken = StringUtils.substringAfter(nextDeltaToken, DELTA_TOKEN);
          LOGGER.info("New delta token after workforce Capability Replication: {}", nextDeltaToken);
          List<CapabilityValue> workForceCapabilityInstances = workForceCapabilityLog.getValue();
          LOGGER.info("Workforce capability count: {}", workForceCapabilityInstances.size());
          totalRecordsToBeProcessed += workForceCapabilityInstances.size();
          totalRecordsProcessed += this.workforceCapabilityMDIEventsAPIProcessor
              .processWorkforceCapabilityLog(workForceCapabilityInstances, subDomain, jobSchedulerRunHeader);

          this.oneMDSReplicationDeltaTokenDAO.save(WORKFORCE_CAPABILITY_REPLICATION,
              MDIEntities.WORKFORCE_CAPABILITY_REPLICATION, nextDeltaToken);

          loadMoreElements = workForceCapabilityLog.getNextLink() != null;
        } else {
          loadMoreElements = false;
          isNullFromMDI = true;
        }
      }

      // If value is null from MDI, error log is already marked in scheduler. Hence,
      // prevent over-writing scheduler again.
      if (!isNullFromMDI) {
        updateJobScheduler(WORKFORCE_CAPABILITY_REPLICATION, subDomain, jobSchedulerRunHeader,
            totalRecordsToBeProcessed, totalRecordsProcessed);
      }
    } catch (TransactionException transactionException) {
      LOGGER.error(WORKFORCE_CAPABILITY_REPLICATION, transactionException.getMessage(), transactionException);
    }
  }
  @Override
  public void cleanSnapshotForWorkforceCapabilityObjects(final String subDomain,
                                                         final JobSchedulerRunHeader jobSchedulerRunHeader) {
    //Clean snapshot taken for all the workforce capability objects at the end of replication
    //This method also revisits each entry in this table for every replication run scheduled

    // Cleaning the Workforce capability catalog snapshots once the replication job is finished.
    LOGGER.info("Cleaning Workforce capability catalog Objects snapshot");
    this.workforceCapabilityCatalogMDIEventsAPIProcessor.cleanCatalogSnapshot(subDomain, jobSchedulerRunHeader);
    LOGGER.info("Workforce capability catalog snapshot cleaned");

    // Cleaning the Workforce capability proficiency set snapshots once the replication job is finished.
    LOGGER.info("Cleaning Workforce capability proficiency set Objects snapshot");
    this.workforceProficiencyScaleMDIEventsAPIProcessor.cleanProficiencySetSnapshot(subDomain, jobSchedulerRunHeader);
    LOGGER.info("Workforce capability proficiency set snapshot cleaned");

    // Cleaning the Workforce capability snapshots once the replication job is finished.
    LOGGER.info("Cleaning Workforce capability Objects snapshot");
    this.workforceCapabilityMDIEventsAPIProcessor.cleanSkillSnapShot(subDomain, jobSchedulerRunHeader);
    LOGGER.info("Workforce capability snapshot cleaned");

  }
}
