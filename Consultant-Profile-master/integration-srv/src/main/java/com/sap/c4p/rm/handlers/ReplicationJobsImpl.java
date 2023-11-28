package com.sap.c4p.rm.handlers;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

import com.sap.c4p.rm.calm.CalmConstants;
import com.sap.c4p.rm.calm.CalmService;
import com.sap.c4p.rm.calm.models.LogEntry;
import com.sap.c4p.rm.cloudfoundry.service.destination.service.DestinationService;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobScheduleRunPayload;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.service.JobSchedulerService;
import com.sap.c4p.rm.cloudfoundry.service.masterdataintegration.MDIEntities;
import com.sap.c4p.rm.cloudfoundry.service.masterdataintegration.MasterDataIntegrationService;
import com.sap.c4p.rm.config.LoggingMarker;
import com.sap.c4p.rm.exceptions.TransactionException;
import com.sap.c4p.rm.processor.costcenter.CostCenterMDILogAPIProcessor;
import com.sap.c4p.rm.processor.costcenter.dao.CostCenterDAO;
import com.sap.c4p.rm.processor.costcenter.dto.CostCenterLog;
import com.sap.c4p.rm.processor.workforce.WorkforceMDILogAPIProcessor;
import com.sap.c4p.rm.processor.workforce.dao.WorkforcePersonDAO;
import com.sap.c4p.rm.processor.workforce.dto.Log;
import com.sap.c4p.rm.processor.workforce.dto.WorkforceLog;
import com.sap.c4p.rm.replicationdao.BusinessPurposeCompletionDetailsDAO;
import com.sap.c4p.rm.replicationdao.MDIObjectReplicationStatusDAO;
import com.sap.c4p.rm.replicationdao.OneMDSReplicationDeltaTokenDAO;
import com.sap.resourcemanagement.consultantprofile.integration.MDIObjectReplicationStatus;
import com.sap.resourcemanagement.consultantprofile.integration.OneMDSDeltaTokenInfo;
import com.sap.resourcemanagement.organization.CostCenters;
import com.sap.resourcemanagement.workforce.workforceperson.BusinessPurposeCompletionDetails;
import com.sap.resourcemanagement.workforce.workforceperson.WorkforcePersons;

/**
 * An Implement of {@link ReplicationJobs} to initiate the internal jobs of
 * replication.
 */
@Component
public class ReplicationJobsImpl implements ReplicationJobs {
    private static final Logger LOGGER = LoggerFactory.getLogger(ReplicationJobsImpl.class);
    private static final Marker WORKFORCE_REPLICATION_MARKER = LoggingMarker.WORKFORCE_REPLICATION.getMarker();
    private static final Marker COST_CENTER_REPLICATION_MARKER = LoggingMarker.COST_CENTER_REPLICATION.getMarker();

    private static final String TOTAL_NUMBER_OF_EVENTS_RECEIVED = "ReceivedEvents";
    private static final String STATUS = "Status";
    private static final String TOTAL_NUMBER_OF_PASSED_EVENTS = "Success";
    private static final String TOTAL_NUMBER_OF_FAILED_EVENTS = "Fail";

    private final CostCenterDAO costCenterDAO;
    private final JobSchedulerService jobSchedulerService;
    private final MasterDataIntegrationService masterDataIntegrationService;
    private final MDIObjectReplicationStatusDAO mdiObjectReplicationStatusDAO;
    private final OneMDSReplicationDeltaTokenDAO oneMDSReplicationDeltaTokenDAO;
    private final WorkforcePersonDAO workforcePersonDAO;
    private final BusinessPurposeCompletionDetailsDAO businessPurposeCompletionDetailsDAO;

    @Autowired
    protected WorkforceMDILogAPIProcessor workforceMDILogAPIProcessor;
    @Autowired
    protected CostCenterMDILogAPIProcessor costCenterMDILogAPIProcessor;
    
	@Autowired
	private ApplicationContext context;

    @Autowired
    public ReplicationJobsImpl(final CostCenterDAO costCenterDAO,
                               final MasterDataIntegrationService masterDataIntegrationService,
                               final JobSchedulerService jobSchedulerService,
                               final MDIObjectReplicationStatusDAO mdiObjectReplicationStatusDAO,
                               final OneMDSReplicationDeltaTokenDAO oneMDSReplicationDeltaTokenDAO,
                               final WorkforcePersonDAO workforcePersonDAO,
                               final BusinessPurposeCompletionDetailsDAO businessPurposeCompletionDetailsDAO,
                               WorkforceMDILogAPIProcessor workforceMDILogAPIProcessor,
                               final DestinationService destinationService) {
        this.costCenterDAO = costCenterDAO;
        this.masterDataIntegrationService = masterDataIntegrationService;
        this.jobSchedulerService = jobSchedulerService;
        this.mdiObjectReplicationStatusDAO = mdiObjectReplicationStatusDAO;
        this.oneMDSReplicationDeltaTokenDAO = oneMDSReplicationDeltaTokenDAO;
        this.workforcePersonDAO = workforcePersonDAO;
        this.businessPurposeCompletionDetailsDAO = businessPurposeCompletionDetailsDAO;
        this.workforceMDILogAPIProcessor = workforceMDILogAPIProcessor;
    }

    @Override
    public void submitForWorkforceReplication(final String subDomain,
            final JobSchedulerRunHeader jobSchedulerRunHeader) {
		CalmService calmService = (CalmService) context.getBean("calmService");
        if (this.jobSchedulerService.ifPreviousRunComplete(WORKFORCE_REPLICATION_MARKER, subDomain,
                jobSchedulerRunHeader)) {
            int totalRecordsToBeProcessed = 0;
            int totalRecordsProcessed = 0;
            try {
                String nextDeltaToken = this.oneMDSReplicationDeltaTokenDAO.getDeltaToken(MDIEntities.WORKFORCE_PERSON)
                        .map(OneMDSDeltaTokenInfo::getDeltaToken).orElse(null);
                LOGGER.info("Delta token before WF Replication: {}",nextDeltaToken);
                /**
                 * Taking the snapshot of workforce objects to maintain the exclusion state
                 * before the initial load starts.
                 */
                if (nextDeltaToken == null) {
                    LOGGER.info("Taking Workforce Objects snapshot");
                    this.takeWorkforceExclusionSnapShot();
                    LOGGER.info("Workforce Objects snapshot taken");
                }
                boolean isNullFromMDI = false;
                boolean loadMoreElements = true;
                while (loadMoreElements) {
					Date startOfReplication = Date.from(Instant.now());
                    WorkforceLog workForcePersonLog = this.masterDataIntegrationService.getMDILogRecords(
                            WORKFORCE_REPLICATION_MARKER, subDomain, MDIEntities.WORKFORCE_PERSON, nextDeltaToken,
                            WorkforceLog.class, jobSchedulerRunHeader);
                    if (workForcePersonLog != null) {
                        nextDeltaToken = workForcePersonLog.getNextDeltaToken();
                        LOGGER.info("New delta token after WF Replication: {}",nextDeltaToken);
                        List<Log> workforcePersonInstances = workForcePersonLog.getLog();
                        totalRecordsToBeProcessed += workforcePersonInstances.size();
						AtomicInteger successRecords = new AtomicInteger(0);
						List<LogEntry> logEntries = this.workforceMDILogAPIProcessor
								.processWorkforceLog(workforcePersonInstances, subDomain, jobSchedulerRunHeader,
										successRecords);
						totalRecordsProcessed += successRecords.get();
                        this.oneMDSReplicationDeltaTokenDAO.save(WORKFORCE_REPLICATION_MARKER,
                                MDIEntities.WORKFORCE_PERSON, nextDeltaToken);
                        loadMoreElements = workForcePersonLog.getHasMoreEvents();
						calmService.logReplicationEvent(startOfReplication, MDIEntities.WORKFORCE_PERSON.getShortName(),
								logEntries, totalRecordsToBeProcessed, totalRecordsProcessed);
                    } else {
                        loadMoreElements = false;
                        isNullFromMDI = true;
                    }
                }

                // Cleaning the Workforce object snapshots once the replication job is finished.
                LOGGER.info("Cleaning Workforce Objects snapshot");
                this.cleanWorkforceExclusionSnapShot();
                LOGGER.info("Workforce Objects snapshot cleaned");
                // If value is null from MDI, error log is already marked in scheduler. Hence, prevent over-writing scheduler again.
                if(!isNullFromMDI) {
                    updateJobScheduler(WORKFORCE_REPLICATION_MARKER, subDomain, jobSchedulerRunHeader,
                        totalRecordsToBeProcessed, totalRecordsProcessed);
                }
            } catch (TransactionException transactionException) {
				calmService.logReplicationFailure(Date.from(Instant.now()), MDIEntities.WORKFORCE_PERSON.getShortName(),
						CalmConstants.FAILURE);
                LOGGER.error(WORKFORCE_REPLICATION_MARKER, transactionException.getMessage(), transactionException);
             }
        }
    }

    @Override
    public void submitForCostCenterReplication(final String subDomain,
            final JobSchedulerRunHeader jobSchedulerRunHeader) {
		CalmService calmService = (CalmService) context.getBean("calmService");
        if (this.jobSchedulerService.ifPreviousRunComplete(COST_CENTER_REPLICATION_MARKER, subDomain,
                jobSchedulerRunHeader)) {
            int totalRecordsToBeProcessed = 0;
            int totalRecordsProcessed = 0;
            try {
                String nextDeltaToken = this.oneMDSReplicationDeltaTokenDAO.getDeltaToken(MDIEntities.COST_CENTER)
                        .map(OneMDSDeltaTokenInfo::getDeltaToken).orElse(null);
                LOGGER.info("Delta token before CC Replication: {}",nextDeltaToken);
                /**
                 * Taking the snapshot of cost-center objects to maintain the exclusion state
                 * before the initial load starts.
                 */
                if (nextDeltaToken == null) {
                    LOGGER.info("Taking CostCenter Objects snapshot");
                    this.takeCostCenterExclusionSnapShot();
                    LOGGER.info("CostCenter Objects snapshot taken");
                }
                boolean isNullFromMDI = false;
                boolean loadMoreElements = true;
                while (loadMoreElements) {
					Date startOfReplication = Date.from(Instant.now());
                    CostCenterLog costCenterLog = this.masterDataIntegrationService.getMDILogRecords(
                            COST_CENTER_REPLICATION_MARKER, subDomain, MDIEntities.COST_CENTER, nextDeltaToken,
                            CostCenterLog.class, jobSchedulerRunHeader);
                    LOGGER.info("Cost Center Log: {}",costCenterLog);
                    if (costCenterLog != null) {
                        nextDeltaToken = costCenterLog.getNextDeltaToken();
                        LOGGER.info("New delta token after CC Replication: {}",nextDeltaToken);
                        List<com.sap.c4p.rm.processor.costcenter.dto.Log> costCenterInstances = costCenterLog.getLog();
                        totalRecordsToBeProcessed += costCenterInstances.size();
						AtomicInteger successRecords = new AtomicInteger(0);
						List<LogEntry> logEntries = this.costCenterMDILogAPIProcessor
								.processCostCenterLog(costCenterInstances, subDomain, jobSchedulerRunHeader,
										successRecords);
						totalRecordsProcessed += successRecords.get();
                        this.oneMDSReplicationDeltaTokenDAO.save(COST_CENTER_REPLICATION_MARKER,
                                MDIEntities.COST_CENTER, nextDeltaToken);
                        loadMoreElements = costCenterLog.getHasMoreEvents();
						calmService.logReplicationEvent(startOfReplication, MDIEntities.COST_CENTER.getShortName(),
								logEntries, totalRecordsToBeProcessed, totalRecordsProcessed);
                    } else {
                        loadMoreElements = false;
                        isNullFromMDI = true;
                    }
                }

                // Cleaning the cost-center object snapshots once the replication job is
                // finished.
                LOGGER.info("Cleaning CostCenter Objects snapshot");
                this.cleanCostCenterExclusionSnapShot();
                LOGGER.info("CostCenter Objects snapshot cleaned");
                if(!isNullFromMDI) {
                    updateJobScheduler(COST_CENTER_REPLICATION_MARKER, subDomain, jobSchedulerRunHeader,
                        totalRecordsToBeProcessed, totalRecordsProcessed);
                }
            } catch (TransactionException transactionException) {
				calmService.logReplicationFailure(Date.from(Instant.now()), MDIEntities.COST_CENTER.getShortName(),
						CalmConstants.FAILURE);
                LOGGER.error(COST_CENTER_REPLICATION_MARKER, transactionException.getMessage(), transactionException);
            }
        }
    }

    private void updateJobScheduler(final Marker loggingMarker, final String subDomain,
            final JobSchedulerRunHeader jobSchedulerRunHeader, int totalRecordsToBeProcessed,
            int totalRecordsProcessed) {
        JSONObject totalNumberOfEventsReceived = new JSONObject();
        JSONObject eventsStatus = new JSONObject();
        eventsStatus.put(TOTAL_NUMBER_OF_PASSED_EVENTS, totalRecordsProcessed);
        eventsStatus.put(TOTAL_NUMBER_OF_FAILED_EVENTS, (totalRecordsToBeProcessed - totalRecordsProcessed));
        totalNumberOfEventsReceived.put(TOTAL_NUMBER_OF_EVENTS_RECEIVED, totalRecordsToBeProcessed);
        totalNumberOfEventsReceived.put(STATUS, eventsStatus);

        JobScheduleRunPayload jobScheduleRunPayload;
        if (totalRecordsProcessed < totalRecordsToBeProcessed) {
            jobScheduleRunPayload = new JobScheduleRunPayload(false, totalNumberOfEventsReceived.toString());
        } else {
            jobScheduleRunPayload = new JobScheduleRunPayload(true, totalNumberOfEventsReceived.toString());
        }
        this.jobSchedulerService.updateJobRun(loggingMarker, subDomain, jobSchedulerRunHeader, jobScheduleRunPayload);
    }

    private void takeWorkforceExclusionSnapShot() {
        List<MDIObjectReplicationStatus> mdiObjectReplicationStatusList = new ArrayList<>();
        this.workforcePersonDAO.readAll().forEach(workforcePerson -> {
            MDIObjectReplicationStatus mdiObjectReplicationStatus = MDIObjectReplicationStatus.create();
            mdiObjectReplicationStatus.setId(workforcePerson.getId());
            mdiObjectReplicationStatus.setEntityName(MDIEntities.WORKFORCE_PERSON.getName());
            mdiObjectReplicationStatus.setExcludeStatus(workforcePerson.getIsBusinessPurposeCompleted());
            mdiObjectReplicationStatusList.add(mdiObjectReplicationStatus);
        });
        this.mdiObjectReplicationStatusDAO.delete(MDIEntities.WORKFORCE_PERSON);
        this.mdiObjectReplicationStatusDAO.fillEntity(mdiObjectReplicationStatusList);
    }

    private void cleanWorkforceExclusionSnapShot() {
        List<MDIObjectReplicationStatus> mdiObjectReplicationStatusList = this.mdiObjectReplicationStatusDAO
                .readAll(MDIEntities.WORKFORCE_PERSON);
        if (!mdiObjectReplicationStatusList.isEmpty()) {
            List<WorkforcePersons> workforcePersons = new ArrayList<>();
            List<String> candidatesForExclusion = new ArrayList<>();
            mdiObjectReplicationStatusList.forEach(t -> candidatesForExclusion.add(t.getId()));
            List<BusinessPurposeCompletionDetails> alreadyExcludedDetails = this.businessPurposeCompletionDetailsDAO
                    .readAllWithID(candidatesForExclusion);
            List<String> alreadyExcludedIds = new ArrayList<>();
            alreadyExcludedDetails.forEach(t -> alreadyExcludedIds.add(t.getId()));
            candidatesForExclusion.forEach(candidate -> {
                WorkforcePersons person = WorkforcePersons.create();
                person.setId(candidate);
                person.setIsBusinessPurposeCompleted(Boolean.TRUE);
                if (!alreadyExcludedIds.contains(candidate)) {
                    BusinessPurposeCompletionDetails detail = BusinessPurposeCompletionDetails.create();
                    detail.setId(candidate);
                    detail.setBusinessPurposeCompletionDate(LocalDate.now(Clock.systemUTC()));
                    person.setBusinessPurposeCompletionDetail(detail);
                }
                workforcePersons.add(person);
            });
            this.workforcePersonDAO.markBusinessPurposeComplete(workforcePersons);
        }
    }

    private void takeCostCenterExclusionSnapShot() {
        List<MDIObjectReplicationStatus> mdiObjectReplicationStatusList = new ArrayList<>();
        this.costCenterDAO.readAll().forEach(costCenter -> {
            MDIObjectReplicationStatus mdiObjectReplicationStatus = MDIObjectReplicationStatus.create();
            mdiObjectReplicationStatus.setId(costCenter.getId());
            mdiObjectReplicationStatus.setEntityName(MDIEntities.COST_CENTER.getName());
            mdiObjectReplicationStatus.setExcludeStatus(costCenter.getIsExcluded());
            mdiObjectReplicationStatusList.add(mdiObjectReplicationStatus);
        });
        this.mdiObjectReplicationStatusDAO.delete(MDIEntities.COST_CENTER);
        this.mdiObjectReplicationStatusDAO.fillEntity(mdiObjectReplicationStatusList);
    }

    private void cleanCostCenterExclusionSnapShot() {
        List<MDIObjectReplicationStatus> mdiObjectReplicationStatusList = this.mdiObjectReplicationStatusDAO
                .readAll(MDIEntities.COST_CENTER);

        if (!mdiObjectReplicationStatusList.isEmpty()) {
            List<CostCenters> costCenterList = new ArrayList<>();
            this.mdiObjectReplicationStatusDAO.readAll(MDIEntities.COST_CENTER).forEach(mdiObjectReplicationStatus -> {
                CostCenters costCenter = CostCenters.create();
                costCenter.setId(mdiObjectReplicationStatus.getId());
                costCenter.setIsExcluded(Boolean.TRUE);
                costCenterList.add(costCenter);
            });
            this.costCenterDAO.markBusinessPurposeComplete(costCenterList);
        }
    }

}
