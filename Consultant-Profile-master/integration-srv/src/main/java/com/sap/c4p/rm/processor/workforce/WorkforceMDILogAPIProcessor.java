package com.sap.c4p.rm.processor.workforce;

import static com.sap.c4p.rm.utils.Constants.CREATE_OPERATION;
import static com.sap.c4p.rm.utils.Constants.DATA_SUBJECT_TYPE;
import static com.sap.c4p.rm.utils.Constants.INSTANCE;
import static com.sap.c4p.rm.utils.Constants.INSTANCE_ID;
import static com.sap.c4p.rm.utils.Constants.MDI_LOG_PROCESSOR_INIT_MESSAGE;
import static com.sap.c4p.rm.utils.Constants.SERVICE_IDENTIFIER;
import static com.sap.c4p.rm.utils.Constants.UPDATE_OPERATION;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionFailedException;
import org.springframework.core.convert.ConversionService;
import org.springframework.stereotype.Component;

import com.sap.c4p.rm.auditlog.AuditLogUtil;
import com.sap.c4p.rm.calm.CalmConstants;
import com.sap.c4p.rm.calm.CalmUtil;
import com.sap.c4p.rm.calm.models.LogEntry;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;
import com.sap.c4p.rm.config.LoggingMarker;
import com.sap.c4p.rm.exceptions.CapacityCleanupException;
import com.sap.c4p.rm.exceptions.MandatoryFieldException;
import com.sap.c4p.rm.exceptions.ReplicationException;
import com.sap.c4p.rm.processor.workforce.dao.AvailabilityReplicationSummaryDAO;
import com.sap.c4p.rm.processor.workforce.dao.CapacityDAO;
import com.sap.c4p.rm.processor.workforce.dao.WorkAssignmentDAO;
import com.sap.c4p.rm.processor.workforce.dao.WorkforcePersonDAO;
import com.sap.c4p.rm.processor.workforce.dao.WorkforceReplicationDAO;
import com.sap.c4p.rm.processor.workforce.dto.Content___;
import com.sap.c4p.rm.processor.workforce.dto.Detail;
import com.sap.c4p.rm.processor.workforce.dto.Email;
import com.sap.c4p.rm.processor.workforce.dto.Instance;
import com.sap.c4p.rm.processor.workforce.dto.JobDetail;
import com.sap.c4p.rm.processor.workforce.dto.Log;
import com.sap.c4p.rm.processor.workforce.dto.Phone;
import com.sap.c4p.rm.processor.workforce.dto.ProfileDetail;
import com.sap.c4p.rm.processor.workforce.dto.UserAccount;
import com.sap.c4p.rm.processor.workforce.dto.WorkAssignment;
import com.sap.c4p.rm.replicationdao.CapacityCleanupFailuresDAO;
import com.sap.c4p.rm.replicationdao.ReplicationFailureDAO;
import com.sap.c4p.rm.utils.CommonUtility;
import com.sap.c4p.rm.utils.Constants;
import com.sap.c4p.rm.utils.DateTimeUtils;
import com.sap.c4p.rm.utils.IsNullCheckUtils;
import com.sap.cds.ql.CQL;
import com.sap.cds.ql.cqn.CqnComparisonPredicate.Operator;
import com.sap.cds.ql.cqn.CqnElementRef;
import com.sap.cds.ql.cqn.CqnPredicate;
import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityReplicationSummary;
import com.sap.resourcemanagement.consultantprofile.integration.ReplicationFailures;
import com.sap.resourcemanagement.employee.Attachment;
import com.sap.resourcemanagement.employee.Headers;
import com.sap.resourcemanagement.employee.ProfilePhoto;
import com.sap.resourcemanagement.resource.Capacity;
import com.sap.resourcemanagement.workforce.workassignment.JobDetails;
import com.sap.resourcemanagement.workforce.workassignment.WorkAssignmentDetails;
import com.sap.resourcemanagement.workforce.workassignment.WorkAssignments;
import com.sap.resourcemanagement.workforce.workforceperson.BusinessPurposeCompletionDetails;
import com.sap.resourcemanagement.workforce.workforceperson.Emails;
import com.sap.resourcemanagement.workforce.workforceperson.Phones;
import com.sap.resourcemanagement.workforce.workforceperson.ProfileDetails;
import com.sap.resourcemanagement.workforce.workforceperson.SourceUserAccounts;
import com.sap.resourcemanagement.workforce.workforceperson.WorkforcePersons;
import com.sap.xs.audit.api.v2.AuditLogMessageFactory;
import com.sap.xs.audit.api.v2.AuditedDataSubject;
import com.sap.xs.audit.api.v2.DataModificationAuditMessage;

/**
 * Class to process the response received from OneMDS/MDI
 */
@Component
public class WorkforceMDILogAPIProcessor {

    private static final Logger LOGGER = LoggerFactory.getLogger(WorkforceMDILogAPIProcessor.class);
    private static final Marker WORKFORCE_REPLICATION_MARKER = LoggingMarker.WORKFORCE_REPLICATION.getMarker();
    private static final String SYSTEM_USER = "System User";

    protected static final String EXTERNAL_ID = "externalId";
    protected static final String DEFAULT_EMAIL_ADDRESS = "email address";
    protected static final String EMAIL_ARRAY = "email array";
    protected static final String BUSINESS_USAGE_CODE = "B";

    private final AvailabilityReplicationSummaryDAO availabilityReplicationSummaryDAO;
    private final CommonUtility commonUtility;
    private final ConversionService conversionService;
    private final ReplicationFailureDAO replicationFailureDAO;
    private final WorkforcePersonDAO workforcePersonDAO;
    private final WorkAssignmentDAO workAssignmentDAO;
    private final WorkforceReplicationDAO workforceReplicationDAO;
    private final CapacityDAO capacityDAO;
    private final CapacityCleanupFailuresDAO capacityCleanupFailuresDAO;
    @Autowired
    protected AuditLogUtil auditLogUtil;

    @Autowired
    protected AuditLogMessageFactory auditLogFactory;
    
    @Autowired
    public WorkforceMDILogAPIProcessor(final AvailabilityReplicationSummaryDAO availabilityReplicationSummaryDAO,
            final CommonUtility commonUtility, final ConversionService conversionService,
            final ReplicationFailureDAO replicationFailureDAO, final WorkforcePersonDAO workforcePersonDAO,
            final WorkAssignmentDAO workAssignmentDAO, final WorkforceReplicationDAO workforceReplicationDAO,
            final CapacityDAO capacityDAO, final CapacityCleanupFailuresDAO capacityCleanupFailuresDAO) {
        this.availabilityReplicationSummaryDAO = availabilityReplicationSummaryDAO;
        this.commonUtility = commonUtility;
        this.conversionService = conversionService;
        this.replicationFailureDAO = replicationFailureDAO;
        this.workforcePersonDAO = workforcePersonDAO;
        this.workAssignmentDAO = workAssignmentDAO;
        this.workforceReplicationDAO = workforceReplicationDAO;
        this.capacityDAO = capacityDAO;
        this.capacityCleanupFailuresDAO = capacityCleanupFailuresDAO;
    }

    /**
     * Method to initiate the processing of {@link Log} received for workforce
     * replication
     *
     * @param subDomain:           Tenant's subDomain
     * @param workForcePersonLogs: {@link List}List of {@link Log} that needs to be
     *                             processed
     * @return number of successful replication
     */
	public List<LogEntry> processWorkforceLog(final List<Log> workForcePersonLogs, final String subDomain,
			final JobSchedulerRunHeader jobSchedulerRunHeader, AtomicInteger successRecords) {
		List<LogEntry> logEntries = new ArrayList<>();
		workForcePersonLogs.forEach(workForcePersonLog -> logEntries
				.add(processMDILog(workForcePersonLog, successRecords, subDomain, jobSchedulerRunHeader)));
		return logEntries;
    }

    /**
     * Method to process a {@link Log}'s {@link Instance}, decide how the processed
     * log will be saved
     *
     * @param subDomain:          Tenant's subDomain
     * @param workforcePersonLog: {@link Log} that needs to be processed
     * @param successRecords:     {@link AtomicInteger} to maintain the number of
     *                            the accepted records for replication.
     */
	private LogEntry processMDILog(final Log workforcePersonLog, final AtomicInteger successRecords,
			final String subDomain,
            final JobSchedulerRunHeader jobSchedulerRunHeader) {
        String logEvent = workforcePersonLog.getEvent();
        String versionId = workforcePersonLog.getVersionId();
        List<AvailabilityReplicationSummary> availabilityReplicationSummaryList = new ArrayList<>();
        Instance instance;
        DataModificationAuditMessage dataModificationAuditMessage = null;
        try {
            WorkforcePersons workforcePerson;
            switch (logEvent) {
            case "created":
            case "updated":
            case "included":
                if ((instance = workforcePersonLog.getInstance()) != null) {
                    String instanceId = instance.getId();
                    ReplicationFailures replicationFailures = ReplicationFailures.create();
                    replicationFailures.setInstanceId(instanceId);
                    replicationFailures.setReplicationFailureStatusCode(Constants.REPLICATION_FAILURE_STATUS_CLOSED);
                    LOGGER.info(WORKFORCE_REPLICATION_MARKER, MDI_LOG_PROCESSOR_INIT_MESSAGE, logEvent, versionId,
                            instanceId);
                    workforcePerson = this.startProcess(instanceId, instance, availabilityReplicationSummaryList);
                    WorkforcePersons existingWorkForcePerson = workforcePersonDAO.read(workforcePerson.getId());
                    ProfilePhoto profilePhoto = null;
                    Attachment attachment = null;
                    if (existingWorkForcePerson != null) {
                        boolean hasEmailsChanged = hasEmailsChanged(workforcePerson, existingWorkForcePerson);
                        boolean hasPhonesChanged = hasPhonesChanged(workforcePerson, existingWorkForcePerson);
                        boolean hasProfilesChanged = hasProfilesChanged(workforcePerson, existingWorkForcePerson);
                        if (hasEmailsChanged || hasPhonesChanged || hasProfilesChanged) {
                            dataModificationAuditMessage = prepareDataModificationAuditMessageForUpdate(workforcePerson,
                                    existingWorkForcePerson, hasEmailsChanged, hasPhonesChanged, hasProfilesChanged);
                        }
                    } else {
                        dataModificationAuditMessage = prepareDataModificationAuditMessageForCreate(workforcePerson);
                        profilePhoto = ProfilePhoto.create();
                        profilePhoto.setId(UUID.randomUUID().toString());
                        profilePhoto.setEmployeeId(instanceId);
                        attachment = Attachment.create();
                        attachment.setId(UUID.randomUUID().toString());
                        attachment.setEmployeeId(instanceId);
                    }

                    Headers employeeHeader = Headers.create();
                    employeeHeader.setId(instanceId);
                    employeeHeader.setModifiedAt(Instant.now());
                    employeeHeader.setModifiedBy(SYSTEM_USER);
                    this.workforceReplicationDAO.save(employeeHeader, workforcePerson,
                            availabilityReplicationSummaryList, profilePhoto, attachment, replicationFailures);
                    this.cleanUpCapacityData(workforcePerson.getWorkAssignments());
                }
                break;
            case "deleted":
            case "excluded":
                String excludedInstanceId;
                if ((excludedInstanceId = workforcePersonLog.getInstanceId()) != null
                        && this.workforcePersonDAO.isExists(excludedInstanceId)) {
                    LOGGER.info(WORKFORCE_REPLICATION_MARKER, MDI_LOG_PROCESSOR_INIT_MESSAGE, logEvent, versionId,
                            excludedInstanceId);
                    WorkforcePersons workforcePersons = WorkforcePersons.create();
                    workforcePersons.setId(excludedInstanceId);
                    workforcePersons.setIsBusinessPurposeCompleted(Boolean.TRUE);
                    BusinessPurposeCompletionDetails businessPurposeCompletionDetails = BusinessPurposeCompletionDetails
                            .create();
                    businessPurposeCompletionDetails.setId(excludedInstanceId);
                    businessPurposeCompletionDetails.setBusinessPurposeCompletionDate(LocalDate.now(Clock.systemUTC()));
                    workforcePersons.setBusinessPurposeCompletionDetail(businessPurposeCompletionDetails);
                    this.workforcePersonDAO.update(workforcePersons);
                }
                break;
            default:
                LOGGER.info(WORKFORCE_REPLICATION_MARKER, "Skipping {} event", logEvent);
            }
            successRecords.getAndIncrement();
			LOGGER.debug(WORKFORCE_REPLICATION_MARKER, "Initiating addition of successful log entry");
            if (dataModificationAuditMessage != null)
                dataModificationAuditMessage.logSuccess();
			return CalmUtil.prepareWorkforcePersonLogEntry(workforcePersonLog, "", "");
        } catch (CapacityCleanupException capacityCleanupException) {
        	this.capacityCleanupFailuresDAO.prepareAndSaveAvailabilityCleanupFailure(WORKFORCE_REPLICATION_MARKER,
        			capacityCleanupException, workforcePersonLog);
            return CalmUtil.prepareWorkforcePersonLogEntry(workforcePersonLog, "RM_CP_000",
					CalmConstants.MDI_OBJECT_PROCESSING_ERROR);
        } catch (ReplicationException replicationException) {
        	String errorCode = replicationException.getReplicationErrorCode().toString();
            String errorMessage = this.replicationFailureDAO.saveWorkforceReplicationFailure(WORKFORCE_REPLICATION_MARKER,
                    replicationException, workforcePersonLog, subDomain, jobSchedulerRunHeader);
			LOGGER.info(WORKFORCE_REPLICATION_MARKER, "Adding erroneous log entry");
            if (dataModificationAuditMessage != null)
                auditLogUtil.setDataModificationAuditMessageToFailure(dataModificationAuditMessage);
			return CalmUtil.prepareWorkforcePersonLogEntry(workforcePersonLog, errorCode, errorMessage);
        } catch (Exception exception) {
            LOGGER.info(WORKFORCE_REPLICATION_MARKER, exception.getLocalizedMessage(), exception);
			LOGGER.warn(WORKFORCE_REPLICATION_MARKER, "Adding erroneous log entry");
            if (dataModificationAuditMessage != null)
                auditLogUtil.setDataModificationAuditMessageToFailure(dataModificationAuditMessage);
			return CalmUtil.prepareWorkforcePersonLogEntry(workforcePersonLog, "RM_CP_000",
					CalmConstants.MDI_OBJECT_PROCESSING_ERROR);
        }
    }

    /**
     * Method to process the {@link Instance}
     *
     * @param instance:                           {@link Instance} that will be
     *                                            processed
     * @param availabilityReplicationSummaryList: {@link AvailabilityReplicationSummary}list
     *                                            that needs to build during
     *                                            {@link WorkAssignments} processing
     * @return An object/document of {@link Headers}.
     */
    private WorkforcePersons startProcess(final String workforcePersonId, final Instance instance,
            List<AvailabilityReplicationSummary> availabilityReplicationSummaryList) {
        if (IsNullCheckUtils.isNullOrEmpty(workforcePersonId))
            throw new MandatoryFieldException(INSTANCE_ID, INSTANCE);
        else {
            WorkforcePersons workforcePerson = WorkforcePersons.create();
            String workforcePersonExternalId;
            if ((workforcePersonExternalId = instance.getExternalId()) == null)
                throw new MandatoryFieldException(EXTERNAL_ID, INSTANCE);
            else {
                workforcePerson.setExternalID(workforcePersonExternalId);
                workforcePerson.setEmails(this.prepareEmailObject(instance.getEmails(), workforcePersonId));
                workforcePerson.setPhones(this.preparePhoneObject(instance.getPhones(), workforcePersonId));
                workforcePerson
                        .setUserAccount(this.prepareSourceUserAccounts(instance.getUserAccount(), workforcePersonId));
                List<ProfileDetails> profileDetails = this.prepareProfileDetailsObject(instance.getProfileDetail(),
                        workforcePersonId);
                workforcePerson.setProfileDetails(profileDetails);
                workforcePerson.setWorkAssignments(this.prepareWorkAssignmentObject(instance.getWorkAssignments(),
                        workforcePersonId, workforcePersonExternalId, availabilityReplicationSummaryList));
                workforcePerson.setId(workforcePersonId);
                workforcePerson.setIsBusinessPurposeCompleted(Boolean.FALSE);
                workforcePerson.setBusinessPurposeCompletionDetail(null);
                return workforcePerson;
            }
        }
    }

    /**
     * Method to process the {@link Email} records of one {@link Instance} and
     * ensures that it contains at least one default business email address.
     *
     * @param oneMDSEmails:      {@link List} of {@link Email} object received from
     *                           oneMDS
     * @param workforcePersonId: instance id
     * @return a {@link List} of {@link Emails}.
     */
    private List<Emails> prepareEmailObject(final List<Email> oneMDSEmails, final String workforcePersonId) {
        if (IsNullCheckUtils.isNullOrEmpty(oneMDSEmails))
            throw new MandatoryFieldException("email", INSTANCE);

        List<Emails> emails = new ArrayList<>();
        for (Email oneMDSEmail : oneMDSEmails) {
            Emails email;
            // converts oneMDS Email to RM Email object
            try {
                if ((email = this.conversionService.convert(oneMDSEmail, Emails.class)) != null) {
                    email.setParent(workforcePersonId);
                    emails.add(email);
                }
            } catch (ConversionFailedException conversionFailedException) {
                LOGGER.warn(WORKFORCE_REPLICATION_MARKER, "email data conversion Failed", conversionFailedException);
            }
        }

        Boolean hasDefaultBusinessEmail = Boolean.FALSE;
        // Checks if at least one business email is default.
        for (Emails email : emails) {
            if (Boolean.FALSE.equals(hasDefaultBusinessEmail)) {
                String emailUsageCode;
                if ((emailUsageCode = email.getUsageCode()) != null && BUSINESS_USAGE_CODE.equals(emailUsageCode))
                    hasDefaultBusinessEmail = email.getIsDefault();
            }
        }

        if (Boolean.TRUE.equals(hasDefaultBusinessEmail))
            return emails;
        else
            throw new MandatoryFieldException(DEFAULT_EMAIL_ADDRESS, EMAIL_ARRAY);
    }

    /**
     * Method to process the {@link Phone} records of one {@link Instance}
     *
     * @param oneMDSPhones:{@link List} of {@link Phone} object received from oneMDS
     * @param workforcePersonId:  instance id
     * @return a {@link List} of {@link Phones}.
     */
    private List<Phones> preparePhoneObject(final List<Phone> oneMDSPhones, final String workforcePersonId) {
        if (IsNullCheckUtils.isNullOrEmpty(oneMDSPhones))
            return Collections.emptyList();

        List<Phones> phones = new ArrayList<>();
        try {
            for (Phone oneMDSPhone : oneMDSPhones) {
                Phones phone;
                if ((phone = this.conversionService.convert(oneMDSPhone, Phones.class)) != null) {
                    phone.setParent(workforcePersonId);
                    phones.add(phone);
                }
            }
        } catch (ConversionFailedException conversionFailedException) {
            LOGGER.warn(WORKFORCE_REPLICATION_MARKER, "phone data conversion Failed", conversionFailedException);
        }
        return phones;
    }

    /**
     * Method to process the {@link UserAccount} records of one {@link Instance}
     *
     * @param oneMDSUserAccount: {@link UserAccount} object received from oneMDS
     * @param workforcePersonId: instance id
     * @return an Object of {@link SourceUserAccounts}.
     */
    private SourceUserAccounts prepareSourceUserAccounts(final UserAccount oneMDSUserAccount,
            final String workforcePersonId) {
        if (IsNullCheckUtils.isNullOrEmpty(oneMDSUserAccount))
            return null;

        SourceUserAccounts sourceUserAccounts;
        try {
            if ((sourceUserAccounts = conversionService.convert(oneMDSUserAccount, SourceUserAccounts.class)) != null)
                sourceUserAccounts.setId(workforcePersonId);
            return sourceUserAccounts;
        } catch (ConversionFailedException conversionFailedException) {
            LOGGER.warn(WORKFORCE_REPLICATION_MARKER, "sourceUserAccounts data conversion Failed",
                    conversionFailedException);
            return null;
        }
    }

    /**
     * Method to process the {@link ProfileDetail} records of one {@link Instance}
     *
     * @param oneMDSProfileDetails: {@link List} of {@link ProfileDetail} object
     *                              received from oneMDS
     * @param workforcePersonId:    instance id
     * @return a {@link List} of {@link ProfileDetails}.
     */
    private List<ProfileDetails> prepareProfileDetailsObject(final List<ProfileDetail> oneMDSProfileDetails,
            final String workforcePersonId) {
        if (IsNullCheckUtils.isNullOrEmpty((oneMDSProfileDetails)))
            return Collections.emptyList();

        List<ProfileDetails> profileDetails = new ArrayList<>();
        try {
            for (ProfileDetail oneMDSProfileDetail : oneMDSProfileDetails) {
                ProfileDetails profileDetail;
                if ((profileDetail = conversionService.convert(oneMDSProfileDetail, ProfileDetails.class)) != null) {
                    profileDetail.setParent(workforcePersonId);
                    profileDetails.add(profileDetail);
                }
            }
        } catch (ConversionFailedException conversionFailedException) {
            LOGGER.warn(WORKFORCE_REPLICATION_MARKER, "profileDetail data conversion Failed",
                    conversionFailedException);
        }
        return profileDetails;
    }

    /**
     * Method to process the {@link WorkAssignment} records of one {@link Instance}
     *
     * @param oneMDSWorkAssignments:              {@link List} of
     *                                            {@link WorkAssignment} object
     *                                            received from oneMDS
     * @param workforcePersonId:                  instance id
     * @param workforcePersonExternalId:          workforce externalID
     * @param availabilityReplicationSummaryList: Empty {@link List} of
     *                                            {@link AvailabilityReplicationSummary}
     *                                            that needs to filled.
     * @return {@link List} of {@link WorkAssignments}.
     */
    private List<WorkAssignments> prepareWorkAssignmentObject(final List<WorkAssignment> oneMDSWorkAssignments,
            final String workforcePersonId, final String workforcePersonExternalId,
            List<AvailabilityReplicationSummary> availabilityReplicationSummaryList) {
        if (IsNullCheckUtils.isNullOrEmpty(oneMDSWorkAssignments))
            throw new MandatoryFieldException("workAssignment", INSTANCE);

        List<WorkAssignments> workAssignments = new ArrayList<>();
        try {
            for (final WorkAssignment oneMDSWorkAssignment : oneMDSWorkAssignments) {
                WorkAssignments workAssignment;
                if ((workAssignment = this.conversionService.convert(oneMDSWorkAssignment,
                        WorkAssignments.class)) != null) {
                    String mdiWorkAssignmentId = workAssignment.getWorkAssignmentID();
                    String workAssignmentId;
                    // this will mean if the workAssignment data is already persisted before
                    Optional<WorkAssignments> workAssignmentsOptional = this.workAssignmentDAO
                            .getWorkAssignmentKeyId(mdiWorkAssignmentId);
                    if (workAssignmentsOptional.isPresent())
                        workAssignmentId = workAssignmentsOptional.get().getId();
                    else
                        workAssignmentId = UUID.randomUUID().toString();
                    workAssignment.setId(workAssignmentId);
                    workAssignment.setParent(workforcePersonId);
                    workAssignment.setDetails(
                            this.prepareWorkAssignmentDetailObject(oneMDSWorkAssignment.getDetail(), workAssignmentId));
                    List<JobDetails> jobDetailsList = this.prepareJobDetailsObject(oneMDSWorkAssignment.getJobDetails(),
                            workAssignmentId);
                    workAssignment.setJobDetails(jobDetailsList);
                    availabilityReplicationSummaryList.add(this.prepareAvailabilityReplicationSummary(workAssignment,
                            workforcePersonExternalId));
                    workAssignments.add(workAssignment);
                }
            }
        } catch (ConversionFailedException conversionFailedException) {
            LOGGER.warn(WORKFORCE_REPLICATION_MARKER, "workAssignment data conversion Failed");
            throw new ReplicationException((ReplicationException) conversionFailedException.getCause());
        }
        return workAssignments;
    }

    /**
     * Method to process the {@link Detail} records of one {@link Instance}
     *
     * @param oneMDSWorkAssignmentDetails: {@link List} of {@link Detail} object
     *                                     received from oneMDS
     * @param workAssignmentId:            instance id
     * @return {@link List} of {@link WorkAssignmentDetails}
     */
    private List<WorkAssignmentDetails> prepareWorkAssignmentDetailObject(
            final List<Detail> oneMDSWorkAssignmentDetails, final String workAssignmentId) {
        if (IsNullCheckUtils.isNullOrEmpty(oneMDSWorkAssignmentDetails))
            return Collections.emptyList();

        List<WorkAssignmentDetails> workAssignmentDetails = new ArrayList<>();
        try {
            for (Detail oneMDSWorkAssignmentDetail : oneMDSWorkAssignmentDetails) {
                WorkAssignmentDetails workAssignmentDetail;
                if ((workAssignmentDetail = conversionService.convert(oneMDSWorkAssignmentDetail,
                        WorkAssignmentDetails.class)) != null) {
                    workAssignmentDetail.setParent(workAssignmentId);
                    workAssignmentDetails.add(workAssignmentDetail);
                }
            }
        } catch (ConversionFailedException conversionFailedException) {
            LOGGER.warn(WORKFORCE_REPLICATION_MARKER, "workAssignment Detail data conversion Failed",
                    conversionFailedException);
        }
        return workAssignmentDetails;
    }

    /**
     * Method to process the {@link JobDetail} records of one {@link Instance}
     *
     * @param oneMDSJobDetails: {@link List} of {@link JobDetail} object received
     *                          from oneMDS
     * @param workAssignmentId: instance id
     * @return {@link List} of {@link JobDetails}
     */
    private List<JobDetails> prepareJobDetailsObject(List<JobDetail> oneMDSJobDetails, final String workAssignmentId) {
        if (IsNullCheckUtils.isNullOrEmpty(oneMDSJobDetails))
            return Collections.emptyList();

        List<JobDetails> jobDetails = new ArrayList<>();
        try {
            for (JobDetail oneMDSJobDetail : oneMDSJobDetails) {
                String validFrom = oneMDSJobDetail.getValidFrom();
                String validTo = oneMDSJobDetail.getValidTo();
                if (IsNullCheckUtils.isNullOrEmpty(validTo) && !IsNullCheckUtils.isNullOrEmpty(validFrom)) {
                    validTo = "9999-12-31";
                }
                LocalDate localValidFrom = this.commonUtility.toLocalDate(validFrom);
                LocalDate localValidTo = this.commonUtility.toLocalDate(validTo);
                List<Content___> jobDetailContents;
                if ((jobDetailContents = oneMDSJobDetail.getContent()) != null) {
                    for (Content___ jobDetailContent : jobDetailContents) {
                        JobDetails jobDetail;
                        if ((jobDetail = this.conversionService.convert(jobDetailContent, JobDetails.class)) != null) {
                            jobDetail.setParent(workAssignmentId);
                            jobDetail.setValidFrom(localValidFrom);
                            jobDetail.setValidTo(localValidTo);
                            jobDetails.add(jobDetail);
                        }
                    }
                }
            }
        } catch (ConversionFailedException conversionFailedException) {
            LOGGER.warn(WORKFORCE_REPLICATION_MARKER, "job detail content data conversion Failed",
                    conversionFailedException);
        }
        return jobDetails;
    }

    /**
     * Method to prepare the {@link AvailabilityReplicationSummary} records based on
     * the {@link WorkAssignments#WORK_ASSIGNMENT_ID}
     *
     * @param workAssignment:            Object of already prepared
     *                                   {@link WorkAssignments}
     * @param workforcePersonExternalId: {@link WorkforcePersons#EXTERNAL_ID}
     * @param jobDetailsList:            {@link List} of {@link JobDetails} to find
     *                                   the right costCenter for
     *                                   {@link AvailabilityReplicationSummary}
     * @return {@link List} of {@link AvailabilityReplicationSummary}
     */
    private AvailabilityReplicationSummary prepareAvailabilityReplicationSummary(WorkAssignments workAssignment,
            String workforcePersonExternalId) {
        AvailabilityReplicationSummary availabilityReplicationSummary;
        String id = workAssignment.getId();
        String workAssignmentId = workAssignment.getWorkAssignmentID();
        Optional<AvailabilityReplicationSummary> optioanlAvailabilityReplicationSummary = this.availabilityReplicationSummaryDAO
                .getAvailabilityReplicationSummary(id);
        if (optioanlAvailabilityReplicationSummary.isPresent()) {
            availabilityReplicationSummary = optioanlAvailabilityReplicationSummary.get();
        } else {
            availabilityReplicationSummary = AvailabilityReplicationSummary.create();
            availabilityReplicationSummary.setResourceId(id);
        }
        availabilityReplicationSummary.setWorkAssignmentId(workAssignmentId);
        availabilityReplicationSummary.setWorkForcePersonExternalId(workforcePersonExternalId);
        availabilityReplicationSummary.setWorkAssignmentExternalId(workAssignment.getExternalID());
        availabilityReplicationSummary.setWorkAssignmentStartDate(workAssignment.getStartDate().toString());
        availabilityReplicationSummary.setWorkAssignmentEndDate(workAssignment.getEndDate().toString());
        return availabilityReplicationSummary;
    }

    /**
     * Method to prepare data modification audit message before creation of
     * workforce person
     *
     * @param workforcePerson: {@link WorkforcePersons} which needs to be created
     */
    private DataModificationAuditMessage prepareDataModificationAuditMessageForCreate(
            WorkforcePersons workforcePerson) {
        LOGGER.info(WORKFORCE_REPLICATION_MARKER, "Preparing data modification message for the create event and id={}",
                workforcePerson.getId());
        AuditedDataSubject dataSubject = auditLogFactory.createAuditedDataSubject();
        dataSubject.addIdentifier("ID", workforcePerson.getExternalID());
        dataSubject.setType(DATA_SUBJECT_TYPE);

        Map<String, String> createEntity = new HashMap<>();
        List<Phones> phones = workforcePerson.getPhones();
        if (!IsNullCheckUtils.isNullOrEmpty(phones))
            createEntity.put(WorkforcePersons.PHONES, convertPhonesToString(phones));

        List<Emails> emails = workforcePerson.getEmails();
        if (!IsNullCheckUtils.isNullOrEmpty(emails))
            createEntity.put(WorkforcePersons.EMAILS, convertEmailsToString(emails));

        List<ProfileDetails> profileDetails = workforcePerson.getProfileDetails();
        if (!IsNullCheckUtils.isNullOrEmpty(profileDetails))
            createEntity.put(WorkforcePersons.PROFILE_DETAILS, convertprofileDetailsToString(profileDetails));

        auditLogUtil.setIsRequestFromCAP(false);
        return auditLogUtil.prepareDataModificationAuditMessage(null, DATA_SUBJECT_TYPE, SERVICE_IDENTIFIER, CREATE_OPERATION, createEntity, null, dataSubject);
    }

    private boolean hasEmailsChanged(WorkforcePersons workforcePerson, WorkforcePersons existingWorkForcePerson) {
        List<Emails> newUpdatedEmails = getModifiedEmails(workforcePerson, existingWorkForcePerson);
        List<Emails> deletedUpdatedEmails = new ArrayList<>();
        if (IsNullCheckUtils.isNullOrEmpty(newUpdatedEmails))
            deletedUpdatedEmails = getModifiedEmails(existingWorkForcePerson, workforcePerson);

        return (!IsNullCheckUtils.isNullOrEmpty(newUpdatedEmails))
                || (!IsNullCheckUtils.isNullOrEmpty(deletedUpdatedEmails));
    }

    private boolean hasPhonesChanged(WorkforcePersons workforcePerson, WorkforcePersons existingWorkForcePerson) {
        List<Phones> newUpdatedPhones = getModifiedPhones(workforcePerson, existingWorkForcePerson);
        List<Phones> deletedUpdatedPhones = new ArrayList<>();
        if (IsNullCheckUtils.isNullOrEmpty(newUpdatedPhones))
            deletedUpdatedPhones = getModifiedPhones(existingWorkForcePerson, workforcePerson);

        return (!IsNullCheckUtils.isNullOrEmpty(newUpdatedPhones))
                || (!IsNullCheckUtils.isNullOrEmpty(deletedUpdatedPhones));

    }

    private boolean hasProfilesChanged(WorkforcePersons workforcePerson, WorkforcePersons existingWorkForcePerson) {
        List<ProfileDetails> newUpdatedProfiles = getModifiedProfileDetails(workforcePerson, existingWorkForcePerson);
        List<ProfileDetails> deletedUpdatedProfiles = new ArrayList<>();
        if (IsNullCheckUtils.isNullOrEmpty(newUpdatedProfiles))
            deletedUpdatedProfiles = getModifiedProfileDetails(existingWorkForcePerson, workforcePerson);
        return (!IsNullCheckUtils.isNullOrEmpty(newUpdatedProfiles))
                || (!IsNullCheckUtils.isNullOrEmpty(deletedUpdatedProfiles));
    }

    /**
     * Method to prepare data modification audit message before creation of
     * workforce person
     *
     * @param WorkforcePersons:        {@link WorkforcePersons} which needs to be
     *                                 updated
     * @param existingWorkForcePerson: {@link WorkforcePersons} which currently
     *                                 exists in the DB
     */
    private DataModificationAuditMessage prepareDataModificationAuditMessageForUpdate(WorkforcePersons workforcePerson,
            WorkforcePersons existingWorkForcePerson, boolean hasEmailsChanged, boolean hasPhonesChanged,
            boolean hasProfilesChanged) {
        LOGGER.info(WORKFORCE_REPLICATION_MARKER, "Preparing data modification message for the update event and id={}",
                workforcePerson.getId());
        AuditedDataSubject dataSubject = auditLogFactory.createAuditedDataSubject();
        dataSubject.addIdentifier("ID", workforcePerson.getExternalID());
        dataSubject.setType(DATA_SUBJECT_TYPE);

        HashMap<String, String> updatedEntity = new HashMap<>();
        HashMap<String, String> orginalEntity = new HashMap<>();

        if (hasEmailsChanged) {
            updatedEntity.put(WorkforcePersons.EMAILS, convertEmailsToString(workforcePerson.getEmails()));
            orginalEntity.put(WorkforcePersons.EMAILS, convertEmailsToString(existingWorkForcePerson.getEmails()));
        }

        if (hasPhonesChanged) {
            updatedEntity.put(WorkforcePersons.PHONES, convertPhonesToString(workforcePerson.getPhones()));
            orginalEntity.put(WorkforcePersons.PHONES, convertPhonesToString(existingWorkForcePerson.getPhones()));
        }

        if (hasProfilesChanged) {
            updatedEntity.put(WorkforcePersons.PROFILE_DETAILS,
                    convertprofileDetailsToString(workforcePerson.getProfileDetails()));
            orginalEntity.put(WorkforcePersons.PROFILE_DETAILS,
                    convertprofileDetailsToString(existingWorkForcePerson.getProfileDetails()));
        }
        auditLogUtil.setIsRequestFromCAP(false);
        return auditLogUtil.prepareDataModificationAuditMessage(null, DATA_SUBJECT_TYPE, SERVICE_IDENTIFIER, UPDATE_OPERATION, updatedEntity, orginalEntity,
                dataSubject);
    }

    private String convertEmailsToString(List<Emails> emails) {
        StringBuilder emailString = new StringBuilder();
        for (Emails email : emails)
            emailString.append(email.toJson());
        return emailString.toString();
    }

    private String convertPhonesToString(List<Phones> phones) {
        StringBuilder phoneString = new StringBuilder();
        for (Phones phone : phones)
            phoneString.append(phone.toJson());
        return phoneString.toString();
    }

    private String convertprofileDetailsToString(List<ProfileDetails> profileDetails) {
        StringBuilder profileDetailString = new StringBuilder();
        for (ProfileDetails profileDetail : profileDetails)
            profileDetailString.append(profileDetail.toJson());
        return profileDetailString.toString();
    }

    private List<Emails> getModifiedEmails(WorkforcePersons originalWorkForcePerson,
            WorkforcePersons updatedWorkForcePerson) {
        return originalWorkForcePerson.getEmails().stream()
                .filter(e -> (updatedWorkForcePerson.getEmails().stream()
                        .filter(d -> d.getIsDefault().equals(e.getIsDefault()) && d.getAddress().equals(e.getAddress())
                                && d.getUsageCode().equals(e.getUsageCode()))
                        .count()) < 1)
                .collect(Collectors.toList());
    }

    private List<Phones> getModifiedPhones(WorkforcePersons originalWorkForcePerson,
            WorkforcePersons updatedWorkForcePerson) {
        return originalWorkForcePerson.getPhones().stream()
                .filter(e -> (updatedWorkForcePerson.getPhones().stream()
                        .filter(d -> ((IsNullCheckUtils.isNullOrEmpty(d.getIsDefault())
                                && IsNullCheckUtils.isNullOrEmpty(e.getIsDefault()))
                                || (!(IsNullCheckUtils.isNullOrEmpty(d.getIsDefault()))
                                        && !(IsNullCheckUtils.isNullOrEmpty(e.getIsDefault()))
                                        && d.getIsDefault().equals(e.getIsDefault())))
                                && ((IsNullCheckUtils.isNullOrEmpty(d.getNumber())
                                        && IsNullCheckUtils.isNullOrEmpty(e.getNumber()))
                                        || (!(IsNullCheckUtils.isNullOrEmpty(d.getNumber()))
                                                && !(IsNullCheckUtils.isNullOrEmpty(e.getNumber()))
                                                && d.getNumber().equals(e.getNumber())))
                                && ((IsNullCheckUtils.isNullOrEmpty(d.getUsageCode())
                                        && IsNullCheckUtils.isNullOrEmpty(e.getUsageCode()))
                                        || (!(IsNullCheckUtils.isNullOrEmpty(d.getUsageCode()))
                                                && !(IsNullCheckUtils.isNullOrEmpty(e.getUsageCode()))
                                                && d.getUsageCode().equals(e.getUsageCode())))
                                && ((IsNullCheckUtils.isNullOrEmpty(d.getCountryCode())
                                        && IsNullCheckUtils.isNullOrEmpty(e.getCountryCode()))
                                        || (!(IsNullCheckUtils.isNullOrEmpty(d.getCountryCode()))
                                                && !(IsNullCheckUtils.isNullOrEmpty(e.getCountryCode()))
                                                && d.getCountryCode().equals(e.getCountryCode()))))
                        .count()) < 1)
                .collect(Collectors.toList());
    }

    private List<ProfileDetails> getModifiedProfileDetails(WorkforcePersons originalWorkForcePerson,
            WorkforcePersons updatedWorkForcePerson) {
        return originalWorkForcePerson.getProfileDetails().stream()
                .filter(e -> (updatedWorkForcePerson.getProfileDetails().stream()
                        .filter(d -> ((IsNullCheckUtils.isNullOrEmpty(d.getFirstName())
                                && IsNullCheckUtils.isNullOrEmpty(e.getFirstName()))
                                || (!(IsNullCheckUtils.isNullOrEmpty(d.getFirstName()))
                                        && !(IsNullCheckUtils.isNullOrEmpty(e.getFirstName()))
                                        && d.getFirstName().equals(e.getFirstName())))
                                && ((IsNullCheckUtils.isNullOrEmpty(d.getLastName())
                                        && IsNullCheckUtils.isNullOrEmpty(e.getLastName()))
                                        || (!(IsNullCheckUtils.isNullOrEmpty(d.getLastName()))
                                                && !(IsNullCheckUtils.isNullOrEmpty(e.getLastName()))
                                                && d.getLastName().equals(e.getLastName())))
                                && ((IsNullCheckUtils.isNullOrEmpty(d.getFormalName())
                                        && IsNullCheckUtils.isNullOrEmpty(e.getFormalName()))
                                        || (!(IsNullCheckUtils.isNullOrEmpty(d.getFormalName()))
                                                && !(IsNullCheckUtils.isNullOrEmpty(e.getFormalName()))
                                                && d.getFormalName().equals(e.getFormalName()))))
                        .count()) < 1)
                .collect(Collectors.toList());
    }

    public void cleanUpCapacityData(List<WorkAssignments> workAssignments) {
    	LOGGER.info(WORKFORCE_REPLICATION_MARKER, "Starting clean up of capacity data");
    	if (IsNullCheckUtils.isNullOrEmpty(workAssignments)) {
    		LOGGER.info(WORKFORCE_REPLICATION_MARKER, "No work assignments found.");
    	}
    	else {
    		CqnPredicate finalFilter = null;
    	  	CqnElementRef capacityResourceID = CQL.get(Capacity.RESOURCE_ID);
            CqnElementRef capacityStartTime = CQL.get(Capacity.START_TIME);
            CqnElementRef capacityWorkingTimeInMinutes = CQL.get(Capacity.WORKING_TIME_IN_MINUTES);
            CqnElementRef capacityPlannedNonWorkingTimeInMinutes = CQL.get(Capacity.PLANNED_NON_WORKING_TIME_IN_MINUTES);
            CqnElementRef capacityBookedTimeInMinutes = CQL.get(Capacity.BOOKED_TIME_IN_MINUTES);
            CqnElementRef capacityOverTimeInMinutes = CQL.get(Capacity.OVER_TIME_IN_MINUTES);
    	  	for (WorkAssignments workAssignment : workAssignments) {
    	  		Instant startDateInstant = DateTimeUtils.convertDateToTimeFormat(workAssignment.getStartDate());
    	  		Instant endDateInstant = DateTimeUtils.convertDateToTimeFormat(workAssignment.getEndDate());
    	  		CqnPredicate filter = CQL.and(
    	  				CQL.comparison(capacityResourceID, Operator.EQ, CQL.val(workAssignment.getId())),
    	  				CQL.and(
    	  						CQL.or(
	    	  						CQL.comparison(capacityStartTime, Operator.LT, CQL.val(startDateInstant)),
	    	  						CQL.comparison(capacityStartTime, Operator.GT, CQL.val(endDateInstant))
    	  						),
    	  						CQL.or(
    	  							CQL.comparison(capacityWorkingTimeInMinutes, Operator.NE, CQL.val(0)),
    	  							CQL.or(
	  									CQL.comparison(capacityPlannedNonWorkingTimeInMinutes, Operator.NE, CQL.val(0)),
	  									CQL.or(
  											CQL.comparison(capacityBookedTimeInMinutes, Operator.NE, CQL.val(0)),
  											CQL.comparison(capacityOverTimeInMinutes, Operator.NE, CQL.val(0))
  										)
	  								)
    	  						)
    	  					)
    	  				);
    	  		if (finalFilter == null)
    	  			finalFilter = filter;
    	  		finalFilter = CQL.or(filter, finalFilter);
    	  	}
            List<Capacity> capacities = this.capacityDAO.read(finalFilter);
            LOGGER.info(WORKFORCE_REPLICATION_MARKER, "Found " + capacities.size() + " capacities which needs to be cleaned up.");
            if (capacities.size() > 0) {
            	for (Capacity capacity : capacities) {
                	capacity.setWorkingTimeInMinutes(0);
                	capacity.setPlannedNonWorkingTimeInMinutes(0);
                	capacity.setBookedTimeInMinutes(0);
                	capacity.setOverTimeInMinutes(0);
                }
                this.capacityDAO.save(capacities);
            }
    	}
    	LOGGER.info(WORKFORCE_REPLICATION_MARKER, "Cleanup complete.");
    }

}
