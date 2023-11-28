package com.sap.c4p.rm.processor.workforce;
import static com.sap.c4p.rm.TestConstants.BUSINESS_USAGE_CODE;
import static com.sap.c4p.rm.TestConstants.CONSUMER_SUB_DOMAIN;
import static com.sap.c4p.rm.TestConstants.CREATED_EVENT;
import static com.sap.c4p.rm.TestConstants.CREATE_OPERATION;
import static com.sap.c4p.rm.TestConstants.EXCLUDED_EVENT;
import static com.sap.c4p.rm.TestConstants.EXTERNAL_ID;
import static com.sap.c4p.rm.TestConstants.INCLUDED_EVENT;
import static com.sap.c4p.rm.TestConstants.INSTANCE_ID;
import static com.sap.c4p.rm.TestConstants.MDI_WORK_ASSIGNMENT_ID;
import static com.sap.c4p.rm.TestConstants.MDI_WORK_ASSIGNMENT_ID_2;
import static com.sap.c4p.rm.TestConstants.MODIFIED_AT;
import static com.sap.c4p.rm.TestConstants.MODIFIED_BY;
import static com.sap.c4p.rm.TestConstants.OTHER_EVENT;
import static com.sap.c4p.rm.TestConstants.PHONE_NUMBER;
import static com.sap.c4p.rm.TestConstants.SERVICE_IDENTIFIER;
import static com.sap.c4p.rm.TestConstants.UPDATED_EVENT;
import static com.sap.c4p.rm.TestConstants.UPDATE_OPERATION;
import static com.sap.c4p.rm.TestConstants.VALID_FROM_DATE;
import static com.sap.c4p.rm.TestConstants.VALID_TO_DATE;
import static com.sap.c4p.rm.TestConstants.VERSION_ID;
import static com.sap.c4p.rm.utils.Constants.DATA_SUBJECT_TYPE;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionFailedException;
import org.springframework.core.convert.ConversionService;

import com.sap.c4p.rm.InitMocks;
import com.sap.c4p.rm.auditlog.AuditLogUtil;
import com.sap.c4p.rm.calm.CalmService;
import com.sap.c4p.rm.calm.CalmUtil;
import com.sap.c4p.rm.calm.models.LogEntry;
import com.sap.c4p.rm.calm.models.LogEntryStatus;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;
import com.sap.c4p.rm.cloudfoundry.service.masterdataintegration.MDIEntities;
import com.sap.c4p.rm.exceptions.ReplicationErrorCodes;
import com.sap.c4p.rm.exceptions.ReplicationException;
import com.sap.c4p.rm.processor.workforce.dao.AvailabilityReplicationSummaryDAOImpl;
import com.sap.c4p.rm.processor.workforce.dao.CapacityDAOImpl;
import com.sap.c4p.rm.processor.workforce.dao.WorkAssignmentDAOImpl;
import com.sap.c4p.rm.processor.workforce.dao.WorkforcePersonDAOImpl;
import com.sap.c4p.rm.processor.workforce.dao.WorkforceReplicationDAOImpl;
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
import com.sap.c4p.rm.replicationdao.ReplicationFailureDAOImpl;
import com.sap.c4p.rm.utils.CommonUtilityImpl;
import com.sap.c4p.rm.utils.StringFormatter;
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
import com.sap.xs.audit.api.exception.AuditLogNotAvailableException;
import com.sap.xs.audit.api.exception.AuditLogWriteException;
import com.sap.xs.audit.api.v2.AuditLogMessageFactory;
import com.sap.xs.audit.api.v2.AuditedDataSubject;
import com.sap.xs.audit.api.v2.DataModificationAuditMessage;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;


public class WorkforceMDILogAPIProcessorTest extends InitMocks {

	private Logger logger;

    private List<Log> workForcePersonLogs;
    private ListAppender<ILoggingEvent> listAppender;
    private LocalDate localValidFrom;
    private LocalDate localValidTo;

    @Mock
    AvailabilityReplicationSummaryDAOImpl availabilityReplicationSummaryDAO;

    @Mock
    private DataModificationAuditMessage dataModificationAuditMessage;

    @Mock
    CommonUtilityImpl commonUtility;

    @Mock
    ConversionService conversionService;

    @Mock
    ReplicationFailureDAOImpl replicationFailureDAO;

    @Mock
    WorkforcePersonDAOImpl workforcePersonDAO;

    @Mock
    WorkAssignmentDAOImpl workAssignmentDAO;
    
    @Mock
    CapacityDAOImpl capacityDAO;

    @Mock
    private AuditLogUtil auditLogUtil;

    @Mock
    private AuditLogMessageFactory auditLogMessageFactory;

    @Mock
    WorkforceReplicationDAOImpl workforceReplicationDAO;

    @Mock
    JobSchedulerRunHeader jobSchedulerRunHeader;

    @Mock
    Email oneMDSEmail1;

    @Mock
    Email oneMDSEmail2;

    @Mock
    Phone oneMDSPhone1;

    @Mock
    Phone oneMDSPhone2;

    @Mock
    UserAccount oneMDSUserAccount1;

    @Mock
    UserAccount oneMDSUserAccount2;

    @Mock
    ProfileDetail oneMDSProfileDetail1;

    @Mock
    ProfileDetail oneMDSProfileDetail2;

    @Mock
    WorkAssignment oneMDSWorkAssignment1;

    @Mock
    WorkAssignment oneMDSWorkAssignment2;

    @Mock
    WorkAssignment oneMDSWorkAssignment3;

    @Mock
    Detail oneMDSWorkAssignmentDetail1;

    @Mock
    Detail oneMDSWorkAssignmentDetail2;

    @Mock
    JobDetail oneMDSJobDetail;

    @Mock
    JobDetail oneMDSJobDetail2;

    @Mock
    JobDetail oneMDSJobDetail3;

    @Mock
    Content___ oneMDSJobDetailContent;

    @Mock
    ConversionFailedException conversionFailedException;

    @Mock
    private AuditedDataSubject dataSubject;

	@Mock
	private CalmService calmService;

    @Autowired
    @InjectMocks
    private WorkforceMDILogAPIProcessor classUnderTest;

    @BeforeEach
    void setUp() {
		logger = (Logger) LoggerFactory.getLogger(WorkforceMDILogAPIProcessor.class);
		logger.setLevel(Level.DEBUG);
        this.workForcePersonLogs = new ArrayList<>();
        this.listAppender = new ListAppender<>();
        this.listAppender.start();
        logger.addAppender(listAppender);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        this.localValidFrom = LocalDate.parse(VALID_FROM_DATE, formatter);
        when(this.commonUtility.toLocalDate(VALID_FROM_DATE)).thenReturn(localValidFrom);
        this.localValidTo = LocalDate.parse(VALID_TO_DATE, formatter);
        when(this.commonUtility.toLocalDate(VALID_TO_DATE)).thenReturn(localValidTo);
        this.classUnderTest.auditLogUtil = auditLogUtil;
        this.classUnderTest.auditLogFactory = auditLogMessageFactory;

    }

	@Test
    @DisplayName("test processWorkforceLog with empty list of Logs")
    public void testProcessWorkforceLogWithEmptyListOfLogs() {
		AtomicInteger successRecords = new AtomicInteger(0);
		assertEquals(Collections.emptyList(), this.classUnderTest.processWorkforceLog(this.workForcePersonLogs,
				CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader, successRecords));
		assertEquals(0, successRecords.get());
		List<ILoggingEvent> logsList = listAppender.list;
		assertEquals(0, logsList.size());
    }

	@Test
    @DisplayName("test processWorkforceLog having Logs with no instance")
    public void testProcessWorkforceLogHavingLogsWithNoInstanceWithCreateEvent() {
        Mockito.doReturn(dataModificationAuditMessage).when(auditLogMessageFactory)
                .createDataModificationAuditMessage();
        when(this.auditLogUtil.prepareDataModificationAuditMessage(any(), any(), any(), any(), any(), any(), any()))
                .thenReturn(dataModificationAuditMessage);
        this.workForcePersonLogs.addAll(
                Stream.of(CREATED_EVENT, UPDATED_EVENT, INCLUDED_EVENT, EXCLUDED_EVENT, OTHER_EVENT).map(event -> {
                    Log logEvent = new Log();
                    logEvent.setEvent(event);
                    logEvent.setVersionId(VERSION_ID);
                    return logEvent;
                }).collect(Collectors.toList()));

	List<LogEntry> logEntries = new ArrayList<LogEntry>();
        workForcePersonLogs.forEach(log -> logEntries.add(CalmUtil.prepareWorkforcePersonLogEntry(log, "", "")));

        AtomicInteger successRecords = new AtomicInteger(0);

        assertEquals(logEntries, this.classUnderTest.processWorkforceLog(this.workForcePersonLogs, CONSUMER_SUB_DOMAIN,
                        jobSchedulerRunHeader, successRecords));
        assertEquals(5, successRecords.get());
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(6, logsList.size());
        ILoggingEvent debugLog = logsList.get(4);
        assertEquals(StringFormatter.format("Skipping {0} event", OTHER_EVENT), debugLog.getFormattedMessage());
        assertEquals(Level.INFO, debugLog.getLevel());
    }

	@Test
    @DisplayName("test processWorkforceLog with Log event as excluded and employee does not exist.")
    public void testProcessWorkforceLogWithLogEventAsExcludedAndEmployeeDoNotExists() {
        Log excludeLog = new Log();
        excludeLog.setEvent(EXCLUDED_EVENT);
        excludeLog.setVersionId(VERSION_ID);
        excludeLog.setInstanceId(INSTANCE_ID);
        this.workForcePersonLogs.add(excludeLog);
        WorkforcePersons workforcePersons = WorkforcePersons.create();
        workforcePersons.setId(INSTANCE_ID);
        workforcePersons.setIsBusinessPurposeCompleted(Boolean.TRUE);
        when(this.workforcePersonDAO.isExists(INSTANCE_ID)).thenReturn(false);
		LogEntry logEntry = CalmUtil.prepareWorkforcePersonLogEntry(excludeLog, "", "");
		AtomicInteger successRecords = new AtomicInteger(0);
		assertEquals(List.of(logEntry),
				this.classUnderTest.processWorkforceLog(this.workForcePersonLogs, CONSUMER_SUB_DOMAIN,
				jobSchedulerRunHeader, successRecords));
		assertEquals(1, successRecords.get());

        verify(this.workforcePersonDAO, times(0)).update(workforcePersons);
		List<ILoggingEvent> logsList = listAppender.list;
		assertEquals(1, logsList.size());
    }

	@Test
    @DisplayName("test processWorkforceLog with Log event as excluded and employee exists.")
    public void testProcessWorkforceLogWithLogEventAsExcludedAndEmployeeExists() {
        Log excludeLog = new Log();
        excludeLog.setEvent(EXCLUDED_EVENT);
        excludeLog.setVersionId(VERSION_ID);
        excludeLog.setInstanceId(INSTANCE_ID);
        this.workForcePersonLogs.add(excludeLog);
        WorkforcePersons workforcePersons = WorkforcePersons.create();
        workforcePersons.setId(INSTANCE_ID);
        workforcePersons.setIsBusinessPurposeCompleted(Boolean.TRUE);
        BusinessPurposeCompletionDetails businessCompletionDetails = BusinessPurposeCompletionDetails.create();
        businessCompletionDetails.setId(INSTANCE_ID);
        businessCompletionDetails.setBusinessPurposeCompletionDate(LocalDate.now(Clock.systemUTC()));
        workforcePersons.setBusinessPurposeCompletionDetail(businessCompletionDetails);
        when(this.workforcePersonDAO.isExists(INSTANCE_ID)).thenReturn(true);
		LogEntry logEntry = CalmUtil.prepareWorkforcePersonLogEntry(excludeLog, "", "");
		AtomicInteger successRecords = new AtomicInteger(0);
		assertEquals(List.of(logEntry), this.classUnderTest.processWorkforceLog(this.workForcePersonLogs,
				CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader, successRecords));
		assertEquals(1, successRecords.get());
        verify(this.workforcePersonDAO, times(1)).update(workforcePersons);
		List<ILoggingEvent> logsList = listAppender.list;
		assertEquals(2, logsList.size());
		ILoggingEvent infoLog = logsList.get(0);
		assertEquals(StringFormatter.format(
				"Processing instance record with the event={0}, versionId={1} and instance.id={2}", EXCLUDED_EVENT,
				VERSION_ID, INSTANCE_ID), infoLog.getFormattedMessage());
		assertEquals(Level.INFO, infoLog.getLevel());
    }

	@Test
    @DisplayName("test processWorkforceLog with mandatory data missing.")
    public void testProcessWorkforceLogWithMandatoryDataMissing() {
        Log missingInstanceIdLog = new Log();
        missingInstanceIdLog.setEvent(CREATED_EVENT);
        missingInstanceIdLog.setVersionId(VERSION_ID);
        Instance missingInstanceIdInstance = new Instance();
        missingInstanceIdLog.setInstance(missingInstanceIdInstance);
        this.workForcePersonLogs.add(missingInstanceIdLog);

        Log missingExternalIdLog = new Log();
        missingExternalIdLog.setEvent(UPDATED_EVENT);
        missingExternalIdLog.setVersionId(VERSION_ID);
        Instance missingExternalIdInstance = new Instance();
        missingExternalIdInstance.setId(INSTANCE_ID);
        missingExternalIdLog.setInstance(missingExternalIdInstance);
        this.workForcePersonLogs.add(missingExternalIdLog);

        Log missingEmailLog = new Log();
        missingEmailLog.setEvent(INCLUDED_EVENT);
        missingEmailLog.setVersionId(VERSION_ID);
        Instance missingEmailInstance = new Instance();
        missingEmailInstance.setId(INSTANCE_ID);
        missingEmailInstance.setExternalId(EXTERNAL_ID);
        missingEmailLog.setInstance(missingEmailInstance);
        this.workForcePersonLogs.add(missingEmailLog);

        Log missingDefaultEmailLog = new Log();
        missingDefaultEmailLog.setEvent(CREATED_EVENT);
        missingDefaultEmailLog.setVersionId(VERSION_ID);
        Instance missingDefaultEmailInstance = new Instance();
        missingDefaultEmailInstance.setId(INSTANCE_ID);
        missingDefaultEmailInstance.setExternalId(EXTERNAL_ID);
        missingDefaultEmailInstance.setEmails(Collections.singletonList(oneMDSEmail1));
        missingDefaultEmailLog.setInstance(missingDefaultEmailInstance);
        Emails nonDefaultRMEmail = Emails.create();
        when(this.conversionService.convert(oneMDSEmail1, Emails.class)).thenReturn(nonDefaultRMEmail);
        this.workForcePersonLogs.add(missingDefaultEmailLog);

        Log missingWorkAssignmentLog = new Log();
        missingWorkAssignmentLog.setEvent(UPDATED_EVENT);
        missingWorkAssignmentLog.setVersionId(VERSION_ID);
        Instance missingWorkAssignmentInstance = new Instance();
        missingWorkAssignmentInstance.setId(INSTANCE_ID);
        missingWorkAssignmentInstance.setExternalId(EXTERNAL_ID);
        missingWorkAssignmentInstance.setEmails(Collections.singletonList(oneMDSEmail1));
        missingWorkAssignmentLog.setInstance(missingWorkAssignmentInstance);
        Emails withDefaultRMEmail = Emails.create();
        withDefaultRMEmail.setIsDefault(Boolean.TRUE);
        withDefaultRMEmail.setUsageCode(BUSINESS_USAGE_CODE);
        when(this.conversionService.convert(oneMDSEmail1, Emails.class)).thenReturn(withDefaultRMEmail);
        this.workForcePersonLogs.add(missingWorkAssignmentLog);

		LogEntry logEntry1 = CalmUtil.prepareWorkforcePersonLogEntry(missingInstanceIdLog, "DOES_NOT_HAVE_MANDATORY",
				null);
		LogEntry logEntry2 = CalmUtil.prepareWorkforcePersonLogEntry(missingExternalIdLog, "DOES_NOT_HAVE_MANDATORY",
				null);
		LogEntry logEntry3 = CalmUtil.prepareWorkforcePersonLogEntry(missingEmailLog, "DOES_NOT_HAVE_MANDATORY", null);
		LogEntry logEntry4 = CalmUtil.prepareWorkforcePersonLogEntry(missingDefaultEmailLog, "DOES_NOT_HAVE_MANDATORY",
				null);
		LogEntry logEntry5 = CalmUtil.prepareWorkforcePersonLogEntry(missingWorkAssignmentLog,
				"DOES_NOT_HAVE_MANDATORY", null);

		AtomicInteger successRecords = new AtomicInteger(0);
		assertEquals(List.of(logEntry1, logEntry2, logEntry3, logEntry4, logEntry5),
				this.classUnderTest.processWorkforceLog(this.workForcePersonLogs, CONSUMER_SUB_DOMAIN,
						jobSchedulerRunHeader, successRecords));
		assertEquals(0, successRecords.get());
        verify(this.workforceReplicationDAO, times(0)).save(any(Headers.class), any(WorkforcePersons.class), anyList(),
                any(ProfilePhoto.class), any(Attachment.class));
        verify(this.replicationFailureDAO, times(5)).saveWorkforceReplicationFailure(any(Marker.class),
                any(ReplicationException.class), any(Log.class), anyString(), any(JobSchedulerRunHeader.class));
		List<ILoggingEvent> logsList = listAppender.list;
		assertEquals(10, logsList.size());
		ILoggingEvent debugLog1 = logsList.get(0);
		ILoggingEvent debugLog2 = logsList.get(2);
		ILoggingEvent debugLog3 = logsList.get(4);
		ILoggingEvent debugLog4 = logsList.get(6);
		ILoggingEvent debugLog5 = logsList.get(8);
		assertEquals(StringFormatter.format(
				"Processing instance record with the event={0}, versionId={1} and instance.id={2}", CREATED_EVENT,
				VERSION_ID, null), debugLog1.getFormattedMessage());
		assertEquals(Level.INFO, debugLog1.getLevel());
		assertEquals(StringFormatter.format(
				"Processing instance record with the event={0}, versionId={1} and instance.id={2}", UPDATED_EVENT,
				VERSION_ID, INSTANCE_ID), debugLog2.getFormattedMessage());
		assertEquals(Level.INFO, debugLog2.getLevel());
		assertEquals(StringFormatter.format(
				"Processing instance record with the event={0}, versionId={1} and instance.id={2}", INCLUDED_EVENT,
				VERSION_ID, INSTANCE_ID), debugLog3.getFormattedMessage());
		assertEquals(Level.INFO, debugLog3.getLevel());
		assertEquals(StringFormatter.format(
				"Processing instance record with the event={0}, versionId={1} and instance.id={2}", CREATED_EVENT,
				VERSION_ID, INSTANCE_ID), debugLog4.getFormattedMessage());
		assertEquals(Level.INFO, debugLog4.getLevel());
		assertEquals(StringFormatter.format(
				"Processing instance record with the event={0}, versionId={1} and instance.id={2}", UPDATED_EVENT,
				VERSION_ID, INSTANCE_ID), debugLog5.getFormattedMessage());
		assertEquals(Level.INFO, debugLog5.getLevel());
    }

	@Test
    @DisplayName("test processWorkforceLog when conversion returns null.")
    public void testProcessWorkforceLogWhenConversionReturnsNull() {
        Mockito.doReturn(dataSubject).when(auditLogMessageFactory).createAuditedDataSubject();
        when(this.auditLogUtil.prepareDataModificationAuditMessage(any(), any(), any(), any(), any(), any(), any()))
                .thenReturn(dataModificationAuditMessage);
        Log emailConversionFailedLog = new Log();
        emailConversionFailedLog.setEvent(UPDATED_EVENT);
        emailConversionFailedLog.setVersionId(VERSION_ID);
        Instance emailConversionFailedInstance = new Instance();
        emailConversionFailedInstance.setId(INSTANCE_ID);
        emailConversionFailedInstance.setExternalId(EXTERNAL_ID);
        emailConversionFailedInstance.setEmails(Collections.singletonList(oneMDSEmail1));
        emailConversionFailedLog.setInstance(emailConversionFailedInstance);
        when(this.conversionService.convert(oneMDSEmail1, Emails.class)).thenReturn(null);
        this.workForcePersonLogs.add(emailConversionFailedLog);

        Log phoneConversionFailedLog = new Log();
        phoneConversionFailedLog.setEvent(UPDATED_EVENT);
        phoneConversionFailedLog.setVersionId(VERSION_ID);
        Instance phoneConversionFailedInstance = new Instance();
        phoneConversionFailedInstance.setId(INSTANCE_ID);
        phoneConversionFailedInstance.setExternalId(EXTERNAL_ID);
        phoneConversionFailedInstance.setEmails(Collections.singletonList(oneMDSEmail2));
        phoneConversionFailedInstance.setPhones(Collections.singletonList(oneMDSPhone1));
        phoneConversionFailedLog.setInstance(phoneConversionFailedInstance);
        Emails rmEmail = Emails.create();
        rmEmail.setUsageCode(BUSINESS_USAGE_CODE);
        rmEmail.setIsDefault(Boolean.TRUE);
        rmEmail.setAddress("testemail@gmail.com");
        when(this.conversionService.convert(oneMDSEmail2, Emails.class)).thenReturn(rmEmail);
        when(this.conversionService.convert(oneMDSPhone1, Phones.class)).thenReturn(null);
        this.workForcePersonLogs.add(phoneConversionFailedLog);

        Log sourceUserAccountsConversionFailedLog = new Log();
        sourceUserAccountsConversionFailedLog.setEvent(UPDATED_EVENT);
        sourceUserAccountsConversionFailedLog.setVersionId(VERSION_ID);
        Instance sourceUserAccountsConversionFailedInstance = new Instance();
        sourceUserAccountsConversionFailedInstance.setId(INSTANCE_ID);
        sourceUserAccountsConversionFailedInstance.setExternalId(EXTERNAL_ID);
        sourceUserAccountsConversionFailedInstance.setEmails(Collections.singletonList(oneMDSEmail2));
        sourceUserAccountsConversionFailedInstance.setPhones(Collections.singletonList(oneMDSPhone2));
        sourceUserAccountsConversionFailedInstance.setUserAccount(oneMDSUserAccount1);
        sourceUserAccountsConversionFailedLog.setInstance(sourceUserAccountsConversionFailedInstance);
        Phones rmPhone = Phones.create();
        rmPhone.setIsDefault(Boolean.TRUE);
        rmPhone.setCountryCode("CC");
        rmPhone.setUsageCode("Usage");
        rmPhone.setNumber("123456");
        when(this.conversionService.convert(oneMDSPhone2, Phones.class)).thenReturn(rmPhone);
        when(this.conversionService.convert(oneMDSUserAccount1, SourceUserAccounts.class)).thenReturn(null);
        this.workForcePersonLogs.add(sourceUserAccountsConversionFailedLog);

        Log profileDetailsConversionFailedLog = new Log();
        profileDetailsConversionFailedLog.setEvent(UPDATED_EVENT);
        profileDetailsConversionFailedLog.setVersionId(VERSION_ID);
        Instance profileDetailsConversionFailedInstance = new Instance();
        profileDetailsConversionFailedInstance.setId(INSTANCE_ID);
        profileDetailsConversionFailedInstance.setExternalId(EXTERNAL_ID);
        profileDetailsConversionFailedInstance.setEmails(Collections.singletonList(oneMDSEmail2));
        profileDetailsConversionFailedInstance.setPhones(Collections.singletonList(oneMDSPhone2));
        profileDetailsConversionFailedInstance.setUserAccount(oneMDSUserAccount2);
        profileDetailsConversionFailedInstance.setProfileDetail(Collections.singletonList(oneMDSProfileDetail1));
        profileDetailsConversionFailedLog.setInstance(profileDetailsConversionFailedInstance);
        SourceUserAccounts sourceUserAccounts = SourceUserAccounts.create();
        when(this.conversionService.convert(oneMDSUserAccount2, SourceUserAccounts.class))
                .thenReturn(sourceUserAccounts);
        when(this.conversionService.convert(oneMDSProfileDetail1, ProfileDetails.class)).thenReturn(null);
        this.workForcePersonLogs.add(profileDetailsConversionFailedLog);

        Log workAssignmentsConversionFailedLog = new Log();
        workAssignmentsConversionFailedLog.setEvent(UPDATED_EVENT);
        workAssignmentsConversionFailedLog.setVersionId(VERSION_ID);
        Instance workAssignmentsConversionFailedInstance = new Instance();
        workAssignmentsConversionFailedInstance.setId(INSTANCE_ID);
        workAssignmentsConversionFailedInstance.setExternalId(EXTERNAL_ID);
        workAssignmentsConversionFailedInstance.setEmails(Collections.singletonList(oneMDSEmail2));
        workAssignmentsConversionFailedInstance.setPhones(Collections.singletonList(oneMDSPhone2));
        workAssignmentsConversionFailedInstance.setUserAccount(oneMDSUserAccount2);
        workAssignmentsConversionFailedInstance.setProfileDetail(Collections.singletonList(oneMDSProfileDetail2));
        workAssignmentsConversionFailedInstance.setWorkAssignments(Collections.singletonList(oneMDSWorkAssignment1));
        workAssignmentsConversionFailedLog.setInstance(workAssignmentsConversionFailedInstance);
        ProfileDetails rmProfileDetails = ProfileDetails.create();
        when(this.conversionService.convert(oneMDSProfileDetail2, ProfileDetails.class)).thenReturn(rmProfileDetails);
        when(this.conversionService.convert(oneMDSWorkAssignment1, WorkAssignments.class)).thenReturn(null);
        this.workForcePersonLogs.add(workAssignmentsConversionFailedLog);

        Log workAssignmentDetailsConversionFailedLog = new Log();
        workAssignmentDetailsConversionFailedLog.setEvent(UPDATED_EVENT);
        workAssignmentDetailsConversionFailedLog.setVersionId(VERSION_ID);
        Instance workAssignmentDetailsConversionFailedInstance = new Instance();
        workAssignmentDetailsConversionFailedInstance.setId(INSTANCE_ID);
        workAssignmentDetailsConversionFailedInstance.setExternalId(EXTERNAL_ID);
        workAssignmentDetailsConversionFailedInstance.setEmails(Collections.singletonList(oneMDSEmail2));
        workAssignmentDetailsConversionFailedInstance.setPhones(Collections.singletonList(oneMDSPhone2));
        workAssignmentDetailsConversionFailedInstance.setUserAccount(oneMDSUserAccount2);
        workAssignmentDetailsConversionFailedInstance.setProfileDetail(Collections.singletonList(oneMDSProfileDetail2));
        when(this.oneMDSWorkAssignment2.getDetail()).thenReturn(Collections.singletonList(oneMDSWorkAssignmentDetail1));
        workAssignmentDetailsConversionFailedInstance
                .setWorkAssignments(Collections.singletonList(oneMDSWorkAssignment2));
        workAssignmentDetailsConversionFailedLog.setInstance(workAssignmentDetailsConversionFailedInstance);
        WorkAssignments rmWorkAssignments = WorkAssignments.create();
        rmWorkAssignments.setStartDate(this.localValidFrom);
        rmWorkAssignments.setEndDate(this.localValidTo);
        when(this.conversionService.convert(oneMDSWorkAssignment2, WorkAssignments.class))
                .thenReturn(rmWorkAssignments);
        when(this.conversionService.convert(oneMDSWorkAssignmentDetail1, WorkAssignmentDetails.class)).thenReturn(null);
        this.workForcePersonLogs.add(workAssignmentDetailsConversionFailedLog);

        Log jobDetailsConversionFailedLog = new Log();
        jobDetailsConversionFailedLog.setEvent(UPDATED_EVENT);
        jobDetailsConversionFailedLog.setVersionId(VERSION_ID);
        Instance jobDetailsConversionFailedInstance = new Instance();
        jobDetailsConversionFailedInstance.setId(INSTANCE_ID);
        jobDetailsConversionFailedInstance.setExternalId(EXTERNAL_ID);
        jobDetailsConversionFailedInstance.setEmails(Collections.singletonList(oneMDSEmail2));
        jobDetailsConversionFailedInstance.setPhones(Collections.singletonList(oneMDSPhone2));
        jobDetailsConversionFailedInstance.setUserAccount(oneMDSUserAccount2);
        jobDetailsConversionFailedInstance.setProfileDetail(Collections.singletonList(oneMDSProfileDetail2));
        when(this.oneMDSWorkAssignment3.getDetail()).thenReturn(Collections.singletonList(oneMDSWorkAssignmentDetail2));
        when(this.oneMDSWorkAssignment3.getJobDetails()).thenReturn(Collections.singletonList(oneMDSJobDetail));
        when(this.oneMDSJobDetail.getContent()).thenReturn(Collections.singletonList(oneMDSJobDetailContent));
        jobDetailsConversionFailedInstance.setWorkAssignments(Collections.singletonList(oneMDSWorkAssignment3));
        jobDetailsConversionFailedLog.setInstance(jobDetailsConversionFailedInstance);
        WorkAssignments rmWorkAssignments2 = WorkAssignments.create();
        rmWorkAssignments2.setStartDate(this.localValidFrom);
        rmWorkAssignments2.setEndDate(this.localValidTo);
        WorkAssignmentDetails rmWorkAssignmentDetails = WorkAssignmentDetails.create();
        when(this.conversionService.convert(oneMDSWorkAssignment3, WorkAssignments.class))
                .thenReturn(rmWorkAssignments2);
        when(this.conversionService.convert(oneMDSWorkAssignmentDetail2, WorkAssignmentDetails.class))
                .thenReturn(rmWorkAssignmentDetails);
        when(this.conversionService.convert(oneMDSJobDetailContent, JobDetails.class)).thenReturn(null);
        this.workForcePersonLogs.add(jobDetailsConversionFailedLog);

        Emails actualEmail1 = Emails.create();
        actualEmail1.setIsDefault(Boolean.TRUE);
        actualEmail1.setUsageCode(BUSINESS_USAGE_CODE);
        actualEmail1.setAddress("testemailactual1@gmail.com");
        List<Emails> emails = new ArrayList<>();
        emails.add(actualEmail1);
        Phones actualPhone = Phones.create();
        actualPhone.setNumber("1234567");
        actualPhone.setIsDefault(Boolean.TRUE);
        actualPhone.setUsageCode("usage");
        actualPhone.setCountryCode("CC");
        List<Phones> phones = new ArrayList<>();
        phones.add(actualPhone);
        ProfileDetails actualProfileDetails = ProfileDetails.create();
        actualProfileDetails.setFirstName("ActualFirstName");
        actualProfileDetails.setLastName("ActualLastName");
        actualProfileDetails.setFormalName("ActualFormalName");
        actualProfileDetails.setValidFrom(this.localValidFrom);
        actualProfileDetails.setValidTo(this.localValidTo);
        List<ProfileDetails> profileDetails = new ArrayList<>();
        profileDetails.add(actualProfileDetails);

        WorkforcePersons workforcePersons = WorkforcePersons.create();
        workforcePersons.setId(INSTANCE_ID);
        workforcePersons.setExternalID(EXTERNAL_ID);
        workforcePersons.setEmails(emails);
        workforcePersons.setPhones(phones);
        workforcePersons.setProfileDetails(profileDetails);

        when(this.workforcePersonDAO.read(any())).thenReturn(workforcePersons);
		LogEntry logEntry1 = CalmUtil.prepareWorkforcePersonLogEntry(emailConversionFailedLog,
				"DOES_NOT_HAVE_MANDATORY",
				null);
		LogEntry logEntry2 = CalmUtil.prepareWorkforcePersonLogEntry(phoneConversionFailedLog,
				"DOES_NOT_HAVE_MANDATORY",
				null);
		LogEntry logEntry3 = CalmUtil.prepareWorkforcePersonLogEntry(sourceUserAccountsConversionFailedLog,
				"DOES_NOT_HAVE_MANDATORY", null);
		LogEntry logEntry4 = CalmUtil.prepareWorkforcePersonLogEntry(profileDetailsConversionFailedLog,
				"DOES_NOT_HAVE_MANDATORY",
				null);
		LogEntry logEntry5 = CalmUtil.prepareWorkforcePersonLogEntry(workAssignmentsConversionFailedLog,
				"", "");
		LogEntry logEntry6 = CalmUtil.prepareWorkforcePersonLogEntry(workAssignmentDetailsConversionFailedLog,
				"", "");
		LogEntry logEntry7 = CalmUtil.prepareWorkforcePersonLogEntry(jobDetailsConversionFailedLog,
				"", "");

		AtomicInteger successRecords = new AtomicInteger(0);
		assertEquals(List.of(logEntry1, logEntry2, logEntry3, logEntry4, logEntry5, logEntry6, logEntry7),
				this.classUnderTest.processWorkforceLog(this.workForcePersonLogs, CONSUMER_SUB_DOMAIN,
						jobSchedulerRunHeader, successRecords));
		assertEquals(3, successRecords.get());

        verify(this.workforceReplicationDAO, times(0)).save(any(Headers.class), any(WorkforcePersons.class), anyList(),
                any(ProfilePhoto.class), any(Attachment.class));
        verify(this.replicationFailureDAO, times(4)).saveWorkforceReplicationFailure(any(Marker.class),
                any(ReplicationException.class), any(Log.class), anyString(), any(JobSchedulerRunHeader.class));
		List<ILoggingEvent> logsList = listAppender.list;
		assertEquals(26, logsList.size());
		ILoggingEvent debugLog1 = logsList.get(0);
		ILoggingEvent debugLog2 = logsList.get(1);
		ILoggingEvent debugLog3 = logsList.get(2);
		ILoggingEvent debugLog4 = logsList.get(3);
		ILoggingEvent debugLog5 = logsList.get(4);
		ILoggingEvent debugLog6 = logsList.get(5);
		ILoggingEvent debugLog7 = logsList.get(6);
		ILoggingEvent debugLog8 = logsList.get(7);
		ILoggingEvent debugLog9 = logsList.get(8);
		ILoggingEvent infoLog1 = logsList.get(9);
		ILoggingEvent infoLog2 = logsList.get(15);
		ILoggingEvent infoLog3 = logsList.get(21);
		ILoggingEvent debugLog14 = logsList.get(13);
		ILoggingEvent debugLog20 = logsList.get(19);
		ILoggingEvent debugLog26 = logsList.get(25);
		assertEquals(StringFormatter.format(
				"Processing instance record with the event={0}, versionId={1} and instance.id={2}", UPDATED_EVENT,
				VERSION_ID, INSTANCE_ID), debugLog1.getFormattedMessage());
		assertEquals(Level.INFO, debugLog1.getLevel());
		assertEquals(StringFormatter.format("Adding erroneous log entry"), debugLog2.getFormattedMessage());
		assertEquals(Level.INFO, debugLog2.getLevel());
		assertEquals(StringFormatter.format(
				"Processing instance record with the event={0}, versionId={1} and instance.id={2}", UPDATED_EVENT,
				VERSION_ID, INSTANCE_ID), debugLog3.getFormattedMessage());
		assertEquals(Level.INFO, debugLog3.getLevel());
		assertEquals(StringFormatter.format("Adding erroneous log entry"), debugLog4.getFormattedMessage());
		assertEquals(Level.INFO, debugLog4.getLevel());

		assertEquals(StringFormatter.format(
				"Processing instance record with the event={0}, versionId={1} and instance.id={2}", UPDATED_EVENT,
				VERSION_ID, INSTANCE_ID), debugLog5.getFormattedMessage());
		assertEquals(Level.INFO, debugLog5.getLevel());
		assertEquals(StringFormatter.format("Adding erroneous log entry"), debugLog6.getFormattedMessage());
		assertEquals(Level.INFO, debugLog6.getLevel());

		assertEquals(StringFormatter.format(
				"Processing instance record with the event={0}, versionId={1} and instance.id={2}", UPDATED_EVENT,
				VERSION_ID, INSTANCE_ID), debugLog7.getFormattedMessage());
		assertEquals(Level.INFO, debugLog7.getLevel());
		assertEquals(StringFormatter.format("Adding erroneous log entry"), debugLog8.getFormattedMessage());
		assertEquals(Level.INFO, debugLog8.getLevel());
		assertEquals(StringFormatter.format(
				"Processing instance record with the event={0}, versionId={1} and instance.id={2}", UPDATED_EVENT,
				VERSION_ID, INSTANCE_ID), debugLog9.getFormattedMessage());
		assertEquals(Level.INFO, debugLog9.getLevel());

		assertEquals(StringFormatter.format("Preparing data modification message for the update event and id={0}",
				INSTANCE_ID), infoLog1.getFormattedMessage());
		assertEquals(Level.INFO, infoLog1.getLevel());
		assertEquals(StringFormatter.format("Initiating addition of successful log entry"),
				debugLog14.getFormattedMessage());
		assertEquals(Level.DEBUG, debugLog14.getLevel());

		assertEquals(StringFormatter.format("Preparing data modification message for the update event and id={0}",
				INSTANCE_ID), infoLog2.getFormattedMessage());
		assertEquals(Level.INFO, infoLog2.getLevel());
		assertEquals(StringFormatter.format("Initiating addition of successful log entry"),
				debugLog20.getFormattedMessage());
		assertEquals(Level.DEBUG, debugLog20.getLevel());

		assertEquals(StringFormatter.format("Preparing data modification message for the update event and id={0}",
				INSTANCE_ID), infoLog3.getFormattedMessage());
		assertEquals(Level.INFO, infoLog3.getLevel());
		assertEquals(StringFormatter.format("Initiating addition of successful log entry"),
				debugLog26.getFormattedMessage());
		assertEquals(Level.DEBUG, debugLog26.getLevel());

    }

	@Test
    @DisplayName("test processWorkforceProcessLog with workAssignment's child as null")
    public void testProcessWorkforceProcessLogWithWorkAssignmentChildAsNull() {
        Mockito.doReturn(dataSubject).when(auditLogMessageFactory).createAuditedDataSubject();
        when(this.auditLogUtil.prepareDataModificationAuditMessage(any(), any(), any(), any(), any(), any(), any()))
                .thenReturn(dataModificationAuditMessage);
        Log jobDetailsConversionFailedLog = new Log();
        jobDetailsConversionFailedLog.setEvent(CREATED_EVENT);
        jobDetailsConversionFailedLog.setVersionId(VERSION_ID);
        Instance jobDetailsConversionFailedInstance = new Instance();
        jobDetailsConversionFailedInstance.setId(INSTANCE_ID);
        jobDetailsConversionFailedInstance.setExternalId(EXTERNAL_ID);
        Emails rmEmail = Emails.create();
        rmEmail.setUsageCode(BUSINESS_USAGE_CODE);
        rmEmail.setIsDefault(Boolean.TRUE);
        when(this.conversionService.convert(oneMDSEmail1, Emails.class)).thenReturn(rmEmail);
        jobDetailsConversionFailedInstance.setEmails(Collections.singletonList(oneMDSEmail1));
        jobDetailsConversionFailedInstance.setPhones(Collections.singletonList(oneMDSPhone1));
        jobDetailsConversionFailedInstance.setUserAccount(oneMDSUserAccount1);
        jobDetailsConversionFailedInstance.setProfileDetail(Collections.singletonList(oneMDSProfileDetail1));
        jobDetailsConversionFailedInstance.setWorkAssignments(Collections.singletonList(oneMDSWorkAssignment1));
        jobDetailsConversionFailedLog.setInstance(jobDetailsConversionFailedInstance);
        WorkAssignments rmWorkAssignments = WorkAssignments.create();
        rmWorkAssignments.setStartDate(this.localValidFrom);
        rmWorkAssignments.setEndDate(this.localValidTo);
        when(this.conversionService.convert(oneMDSWorkAssignment1, WorkAssignments.class))
                .thenReturn(rmWorkAssignments);
        this.workForcePersonLogs.add(jobDetailsConversionFailedLog);
		AtomicInteger successRecords = new AtomicInteger(0);
		LogEntry logEntry = new LogEntry();
		logEntry.setStatus(LogEntryStatus.SUCCESS);
		logEntry.setObjectId(INSTANCE_ID);
		logEntry.setObjectVersionId(VERSION_ID);
		logEntry.setLocalId(EXTERNAL_ID);
		logEntry.setObjectType(MDIEntities.WORKFORCE_PERSON.getName());
		logEntry.setErrorCode("");
		logEntry.setErrorMessage("");

		assertEquals(List.of(logEntry), this.classUnderTest.processWorkforceLog(this.workForcePersonLogs,
				CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader, successRecords));
        verify(this.workforceReplicationDAO, times(1)).save(any(Headers.class), any(WorkforcePersons.class), anyList(),
                any(ProfilePhoto.class), any(Attachment.class), any(ReplicationFailures.class));
        verify(this.replicationFailureDAO, times(0)).saveWorkforceReplicationFailure(any(Marker.class),
                any(ReplicationException.class), any(Log.class), anyString(), any(JobSchedulerRunHeader.class));
        List<ILoggingEvent> logsList = listAppender.list;
		assertEquals(6, logsList.size());
        ILoggingEvent debugLog1 = logsList.get(0);
        ILoggingEvent infoLog1 = logsList.get(1);
        assertEquals(StringFormatter.format(
                "Processing instance record with the event={0}, versionId={1} and instance.id={2}", CREATED_EVENT,
                VERSION_ID, INSTANCE_ID), debugLog1.getFormattedMessage());
        assertEquals(Level.INFO, debugLog1.getLevel());
        assertEquals(StringFormatter.format("Preparing data modification message for the create event and id={0}",
                INSTANCE_ID), infoLog1.getFormattedMessage());
        assertEquals(Level.INFO, infoLog1.getLevel());
    }

	@Test
    @DisplayName("test processWorkforceProcessLog when event is created")
    public void testProcessWorkforceProcessLogCreatedEvent() {
        Mockito.doReturn(dataSubject).when(auditLogMessageFactory).createAuditedDataSubject();
        Log jobDetailsConversionFailedLog = new Log();
        jobDetailsConversionFailedLog.setEvent(CREATED_EVENT);
        jobDetailsConversionFailedLog.setVersionId(VERSION_ID);
        Instance jobDetailsConversionFailedInstance = new Instance();
        jobDetailsConversionFailedInstance.setId(INSTANCE_ID);
        jobDetailsConversionFailedInstance.setExternalId(EXTERNAL_ID);
        Emails rmEmail = Emails.create();
        rmEmail.setIsDefault(Boolean.FALSE);
        Emails rmEmail2 = Emails.create();
        rmEmail2.setUsageCode("C");
        rmEmail2.setIsDefault(Boolean.FALSE);
        Emails rmEmail3 = Emails.create();
        rmEmail3.setUsageCode(BUSINESS_USAGE_CODE);
        rmEmail3.setIsDefault(Boolean.TRUE);
        Emails rmEmail4 = Emails.create();
        rmEmail4.setIsDefault(Boolean.FALSE);
        when(this.conversionService.convert(oneMDSEmail1, Emails.class)).thenReturn(rmEmail, rmEmail2, rmEmail3,
                rmEmail4);
        jobDetailsConversionFailedInstance
                .setEmails(Arrays.asList(oneMDSEmail1, oneMDSEmail1, oneMDSEmail1, oneMDSEmail1));
        jobDetailsConversionFailedInstance.setPhones(Collections.singletonList(oneMDSPhone1));
        jobDetailsConversionFailedInstance.setUserAccount(oneMDSUserAccount1);
        jobDetailsConversionFailedInstance.setProfileDetail(Collections.singletonList(oneMDSProfileDetail1));
        jobDetailsConversionFailedInstance
                .setWorkAssignments(Arrays.asList(oneMDSWorkAssignment1, oneMDSWorkAssignment2));
        when(this.oneMDSJobDetail.getValidFrom()).thenReturn(VALID_FROM_DATE);
        when(this.oneMDSJobDetail.getValidTo()).thenReturn(VALID_TO_DATE);
        when(this.oneMDSJobDetail.getContent()).thenReturn(Collections.singletonList(oneMDSJobDetailContent));
        when(this.oneMDSJobDetail2.getValidFrom()).thenReturn(VALID_TO_DATE);
        when(this.oneMDSJobDetail2.getValidTo()).thenReturn(VALID_TO_DATE);
        when(this.oneMDSJobDetail2.getContent()).thenReturn(Collections.singletonList(oneMDSJobDetailContent));
        when(this.oneMDSJobDetail3.getValidFrom()).thenReturn(VALID_FROM_DATE);
        when(this.oneMDSJobDetail3.getValidTo()).thenReturn(VALID_FROM_DATE);
        when(this.oneMDSPhone1.getNumber()).thenReturn(PHONE_NUMBER);
        when(this.oneMDSJobDetail3.getContent()).thenReturn(null);
        when(this.oneMDSWorkAssignment1.getJobDetails())
                .thenReturn(Arrays.asList(oneMDSJobDetail, oneMDSJobDetail2, oneMDSJobDetail3));
        when(this.oneMDSWorkAssignment2.getJobDetails())
                .thenReturn(Arrays.asList(oneMDSJobDetail, oneMDSJobDetail2, oneMDSJobDetail3));
        when(this.auditLogUtil.prepareDataModificationAuditMessage(any(), any(), any(), any(), any(), any(), any()))
                .thenReturn(dataModificationAuditMessage);
        jobDetailsConversionFailedLog.setInstance(jobDetailsConversionFailedInstance);
        WorkAssignments rmWorkAssignments = WorkAssignments.create();
        rmWorkAssignments.setStartDate(this.localValidFrom);
        rmWorkAssignments.setEndDate(this.localValidTo);
        rmWorkAssignments.setWorkAssignmentID(MDI_WORK_ASSIGNMENT_ID);
        when(this.workAssignmentDAO.getWorkAssignmentKeyId(MDI_WORK_ASSIGNMENT_ID)).thenReturn(Optional.empty());
        when(this.conversionService.convert(oneMDSWorkAssignment1, WorkAssignments.class))
                .thenReturn(rmWorkAssignments);
        WorkAssignments rmWorkAssignments1 = WorkAssignments.create();
        rmWorkAssignments1.setStartDate(this.localValidTo);
        rmWorkAssignments1.setEndDate(this.localValidTo);
        rmWorkAssignments1.setWorkAssignmentID(MDI_WORK_ASSIGNMENT_ID_2);
        when(this.conversionService.convert(oneMDSWorkAssignment2, WorkAssignments.class))
                .thenReturn(rmWorkAssignments1);
        AvailabilityReplicationSummary availabilityReplicationSummary = AvailabilityReplicationSummary.create();
        String resourceId = UUID.randomUUID().toString();
        availabilityReplicationSummary.setResourceId(resourceId);
        WorkAssignments workAssignments = WorkAssignments.create();
        workAssignments.setId(resourceId);
        when(this.workAssignmentDAO.getWorkAssignmentKeyId(MDI_WORK_ASSIGNMENT_ID_2))
                .thenReturn(Optional.of(workAssignments));
        when(this.availabilityReplicationSummaryDAO.getAvailabilityReplicationSummary(MDI_WORK_ASSIGNMENT_ID))
                .thenReturn(Optional.of(availabilityReplicationSummary));
        JobDetails rmJobDetail = JobDetails.create();
        rmJobDetail.setValidFrom(localValidFrom);
        rmJobDetail.setValidTo(localValidTo);
        rmJobDetail.setCostCenterExternalID(UUID.randomUUID().toString());
        JobDetails rmJobDetail1 = JobDetails.create();
        rmJobDetail1.setValidFrom(localValidTo);
        rmJobDetail1.setValidTo(localValidTo);
        rmJobDetail1.setCostCenterExternalID(UUID.randomUUID().toString());
        when(this.conversionService.convert(oneMDSJobDetailContent, JobDetails.class)).thenReturn(rmJobDetail,
                rmJobDetail1);
        when(this.availabilityReplicationSummaryDAO.getAvailabilityReplicationSummary(MDI_WORK_ASSIGNMENT_ID_2))
                .thenReturn(null);

        this.workForcePersonLogs.add(jobDetailsConversionFailedLog);
        
        Instant instant = Instant.parse("1970-01-01T00:00:00.00Z");
        List<Capacity> capacities = new ArrayList<>();
        Capacity capacity = Capacity.create();
        capacity.setResourceId("test-resourceId");
        capacity.setStartTime(instant);
        capacities.add(capacity);
        when(capacityDAO.read(any())).thenReturn(capacities);
		AtomicInteger successRecords = new AtomicInteger(0);
		LogEntry logEntry = new LogEntry();
		logEntry.setStatus(LogEntryStatus.SUCCESS);
		logEntry.setObjectId(INSTANCE_ID);
		logEntry.setObjectVersionId(VERSION_ID);
		logEntry.setLocalId(EXTERNAL_ID);
		logEntry.setObjectType(MDIEntities.WORKFORCE_PERSON.getName());
		logEntry.setErrorCode("");
		logEntry.setErrorMessage("");
        
		assertEquals(List.of(logEntry), this.classUnderTest.processWorkforceLog(this.workForcePersonLogs,
				CONSUMER_SUB_DOMAIN,
				jobSchedulerRunHeader, successRecords));
        verify(this.workforceReplicationDAO, times(1)).save(any(Headers.class), any(WorkforcePersons.class), anyList(),
                any(ProfilePhoto.class), any(Attachment.class), any(ReplicationFailures.class));
        verify(this.replicationFailureDAO, times(0)).saveWorkforceReplicationFailure(any(Marker.class),
                any(ReplicationException.class), any(Log.class), anyString(), any(JobSchedulerRunHeader.class));
        List<ILoggingEvent> logsList = listAppender.list;
		assertEquals(6, logsList.size());
        ILoggingEvent debugLog1 = logsList.get(0);
        ILoggingEvent infoLog1 = logsList.get(1);
        ILoggingEvent infoLog2 = logsList.get(2);
        ILoggingEvent infoLog3 = logsList.get(3);
        ILoggingEvent infoLog4 = logsList.get(4);
		ILoggingEvent infoLog5 = logsList.get(5);

        assertEquals(StringFormatter.format(
                "Processing instance record with the event={0}, versionId={1} and instance.id={2}", CREATED_EVENT,
                VERSION_ID, INSTANCE_ID), debugLog1.getFormattedMessage());
        assertEquals(Level.INFO, debugLog1.getLevel());
        assertEquals(StringFormatter.format("Preparing data modification message for the create event and id={0}",
                INSTANCE_ID), infoLog1.getFormattedMessage());
        assertEquals(Level.INFO, infoLog1.getLevel());
        assertEquals("Starting clean up of capacity data", infoLog2.getFormattedMessage());
        assertEquals("Found 1 capacities which needs to be cleaned up.",
        		infoLog3.getFormattedMessage());
        assertEquals("Cleanup complete.", infoLog4.getFormattedMessage());
		assertEquals("Initiating addition of successful log entry", infoLog5.getFormattedMessage());

    }

	@Test
    @DisplayName("test processWorkforceProcessLog updated event")
    public void testProcessWorkforceProcessLogUpdatedEvent() {
        Mockito.doReturn(dataSubject).when(auditLogMessageFactory).createAuditedDataSubject();
        Log jobDetailsConversionFailedLog = new Log();
        jobDetailsConversionFailedLog.setEvent(UPDATED_EVENT);
        jobDetailsConversionFailedLog.setVersionId(VERSION_ID);
        Instance jobDetailsConversionFailedInstance = new Instance();
        jobDetailsConversionFailedInstance.setId(INSTANCE_ID);
        jobDetailsConversionFailedInstance.setExternalId(EXTERNAL_ID);
        Emails rmEmail = Emails.create();
        rmEmail.setIsDefault(Boolean.FALSE);
        Emails rmEmail2 = Emails.create();
        rmEmail2.setUsageCode("C");
        rmEmail2.setIsDefault(Boolean.FALSE);
        Emails rmEmail3 = Emails.create();
        rmEmail3.setUsageCode(BUSINESS_USAGE_CODE);
        rmEmail3.setIsDefault(Boolean.TRUE);
        Emails rmEmail4 = Emails.create();
        rmEmail4.setIsDefault(Boolean.FALSE);
        Headers employeeHeader = Headers.create();
        employeeHeader.setId(INSTANCE_ID);
        employeeHeader.setModifiedAt(MODIFIED_AT);
        employeeHeader.setModifiedBy(MODIFIED_BY);
        when(this.conversionService.convert(oneMDSEmail1, Emails.class)).thenReturn(rmEmail, rmEmail2, rmEmail3,
                rmEmail4);
        jobDetailsConversionFailedInstance
                .setEmails(Arrays.asList(oneMDSEmail1, oneMDSEmail1, oneMDSEmail1, oneMDSEmail1));
        jobDetailsConversionFailedInstance.setPhones(Collections.singletonList(oneMDSPhone1));
        jobDetailsConversionFailedInstance.setUserAccount(oneMDSUserAccount1);
        jobDetailsConversionFailedInstance.setProfileDetail(Collections.singletonList(oneMDSProfileDetail1));
        jobDetailsConversionFailedInstance
                .setWorkAssignments(Arrays.asList(oneMDSWorkAssignment1, oneMDSWorkAssignment2));
        when(this.oneMDSJobDetail.getValidFrom()).thenReturn(VALID_FROM_DATE);
        when(this.oneMDSJobDetail.getValidTo()).thenReturn(VALID_TO_DATE);
        when(this.oneMDSJobDetail.getContent()).thenReturn(Collections.singletonList(oneMDSJobDetailContent));
        when(this.oneMDSJobDetail2.getValidFrom()).thenReturn(VALID_TO_DATE);
        when(this.oneMDSJobDetail2.getValidTo()).thenReturn(VALID_TO_DATE);
        when(this.oneMDSJobDetail2.getContent()).thenReturn(Collections.singletonList(oneMDSJobDetailContent));
        when(this.oneMDSJobDetail3.getValidFrom()).thenReturn(VALID_FROM_DATE);
        when(this.oneMDSJobDetail3.getValidTo()).thenReturn(VALID_FROM_DATE);
        when(this.oneMDSPhone1.getNumber()).thenReturn(PHONE_NUMBER);
        when(this.oneMDSJobDetail3.getContent()).thenReturn(null);
        when(this.oneMDSWorkAssignment1.getJobDetails())
                .thenReturn(Arrays.asList(oneMDSJobDetail, oneMDSJobDetail2, oneMDSJobDetail3));
        when(this.oneMDSWorkAssignment2.getJobDetails())
                .thenReturn(Arrays.asList(oneMDSJobDetail, oneMDSJobDetail2, oneMDSJobDetail3));
        when(this.auditLogUtil.prepareDataModificationAuditMessage(any(), any(), any(), any(), any(), any(), any()))
                .thenReturn(dataModificationAuditMessage);
        jobDetailsConversionFailedLog.setInstance(jobDetailsConversionFailedInstance);
        WorkAssignments rmWorkAssignments = WorkAssignments.create();
        rmWorkAssignments.setStartDate(this.localValidFrom);
        rmWorkAssignments.setEndDate(this.localValidTo);
        rmWorkAssignments.setWorkAssignmentID(MDI_WORK_ASSIGNMENT_ID);
        when(this.workAssignmentDAO.getWorkAssignmentKeyId(MDI_WORK_ASSIGNMENT_ID)).thenReturn(Optional.empty());
        when(this.conversionService.convert(oneMDSWorkAssignment1, WorkAssignments.class))
                .thenReturn(rmWorkAssignments);
        WorkAssignments rmWorkAssignments1 = WorkAssignments.create();
        rmWorkAssignments1.setStartDate(this.localValidTo);
        rmWorkAssignments1.setEndDate(this.localValidTo);
        rmWorkAssignments1.setWorkAssignmentID(MDI_WORK_ASSIGNMENT_ID_2);
        when(this.conversionService.convert(oneMDSWorkAssignment2, WorkAssignments.class))
                .thenReturn(rmWorkAssignments1);
        AvailabilityReplicationSummary availabilityReplicationSummary = AvailabilityReplicationSummary.create();
        String resourceId = UUID.randomUUID().toString();
        availabilityReplicationSummary.setResourceId(resourceId);
        WorkAssignments workAssignments = WorkAssignments.create();
        workAssignments.setId(resourceId);
        when(this.workAssignmentDAO.getWorkAssignmentKeyId(MDI_WORK_ASSIGNMENT_ID_2))
                .thenReturn(Optional.of(workAssignments));
        when(this.availabilityReplicationSummaryDAO.getAvailabilityReplicationSummary(MDI_WORK_ASSIGNMENT_ID))
                .thenReturn(Optional.of(availabilityReplicationSummary));
        JobDetails rmJobDetail = JobDetails.create();
        rmJobDetail.setValidFrom(localValidFrom);
        rmJobDetail.setValidTo(localValidTo);
        rmJobDetail.setCostCenterExternalID(UUID.randomUUID().toString());
        JobDetails rmJobDetail1 = JobDetails.create();
        rmJobDetail1.setValidFrom(localValidTo);
        rmJobDetail1.setValidTo(localValidTo);
        rmJobDetail1.setCostCenterExternalID(UUID.randomUUID().toString());
        when(this.conversionService.convert(oneMDSJobDetailContent, JobDetails.class)).thenReturn(rmJobDetail,
                rmJobDetail1);
        when(this.workforcePersonDAO.isExists(INSTANCE_ID)).thenReturn(true);
        when(this.availabilityReplicationSummaryDAO.getAvailabilityReplicationSummary(MDI_WORK_ASSIGNMENT_ID_2))
                .thenReturn(null);

        this.workForcePersonLogs.add(jobDetailsConversionFailedLog);

		AtomicInteger successRecords = new AtomicInteger(0);
		LogEntry logEntry = new LogEntry();
		logEntry.setStatus(LogEntryStatus.SUCCESS);
		logEntry.setObjectId(INSTANCE_ID);
		logEntry.setObjectVersionId(VERSION_ID);
		logEntry.setLocalId(EXTERNAL_ID);
		logEntry.setObjectType(MDIEntities.WORKFORCE_PERSON.getName());
		logEntry.setErrorCode("");
		logEntry.setErrorMessage("");

		assertEquals(List.of(logEntry), this.classUnderTest.processWorkforceLog(this.workForcePersonLogs,
				CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader, successRecords));
        verify(this.workforceReplicationDAO, times(1)).save(any(Headers.class), any(WorkforcePersons.class), anyList(),
                any(ProfilePhoto.class), any(Attachment.class), any(ReplicationFailures.class));
        verify(this.replicationFailureDAO, times(0)).saveWorkforceReplicationFailure(any(Marker.class),
                any(ReplicationException.class), any(Log.class), anyString(), any(JobSchedulerRunHeader.class));
        List<ILoggingEvent> logsList = listAppender.list;
		assertEquals(6, logsList.size());
        ILoggingEvent debugLog1 = logsList.get(0);
        ILoggingEvent infoLog1 = logsList.get(1);
		ILoggingEvent infoLog6 = logsList.get(5);

        assertEquals(StringFormatter.format(
                "Processing instance record with the event={0}, versionId={1} and instance.id={2}", UPDATED_EVENT,
                VERSION_ID, INSTANCE_ID), debugLog1.getFormattedMessage());
        assertEquals(Level.INFO, debugLog1.getLevel());
        assertEquals(StringFormatter.format("Preparing data modification message for the create event and id={0}",
                INSTANCE_ID), infoLog1.getFormattedMessage());
        assertEquals(Level.INFO, infoLog1.getLevel());
        assertEquals(MODIFIED_BY, employeeHeader.getModifiedBy());
        assertEquals(MODIFIED_AT, employeeHeader.getModifiedAt());
		assertEquals("Initiating addition of successful log entry", infoLog6.getFormattedMessage());

    }

	@Test
    @DisplayName("test processWorkforceProcessLog included event")
    public void testProcessWorkforceProcessLogIncludedEvent() {
        Mockito.doReturn(dataSubject).when(auditLogMessageFactory).createAuditedDataSubject();
        Log jobDetailsConversionFailedLog = new Log();
        jobDetailsConversionFailedLog.setEvent(INCLUDED_EVENT);
        jobDetailsConversionFailedLog.setVersionId(VERSION_ID);
        Instance jobDetailsConversionFailedInstance = new Instance();
        jobDetailsConversionFailedInstance.setId(INSTANCE_ID);
        jobDetailsConversionFailedInstance.setExternalId(EXTERNAL_ID);
        Emails rmEmail = Emails.create();
        rmEmail.setIsDefault(Boolean.FALSE);
        Emails rmEmail2 = Emails.create();
        rmEmail2.setUsageCode("C");
        rmEmail2.setIsDefault(Boolean.FALSE);
        Emails rmEmail3 = Emails.create();
        rmEmail3.setUsageCode(BUSINESS_USAGE_CODE);
        rmEmail3.setIsDefault(Boolean.TRUE);
        Emails rmEmail4 = Emails.create();
        rmEmail4.setIsDefault(Boolean.FALSE);
        when(this.conversionService.convert(oneMDSEmail1, Emails.class)).thenReturn(rmEmail, rmEmail2, rmEmail3,
                rmEmail4);
        jobDetailsConversionFailedInstance
                .setEmails(Arrays.asList(oneMDSEmail1, oneMDSEmail1, oneMDSEmail1, oneMDSEmail1));
        jobDetailsConversionFailedInstance.setPhones(Collections.singletonList(oneMDSPhone1));
        jobDetailsConversionFailedInstance.setUserAccount(oneMDSUserAccount1);
        jobDetailsConversionFailedInstance.setProfileDetail(Collections.singletonList(oneMDSProfileDetail1));
        jobDetailsConversionFailedInstance
                .setWorkAssignments(Arrays.asList(oneMDSWorkAssignment1, oneMDSWorkAssignment2));
        when(this.oneMDSJobDetail.getValidFrom()).thenReturn(VALID_FROM_DATE);
        when(this.oneMDSJobDetail.getValidTo()).thenReturn(VALID_TO_DATE);
        when(this.oneMDSJobDetail.getContent()).thenReturn(Collections.singletonList(oneMDSJobDetailContent));
        when(this.oneMDSJobDetail2.getValidFrom()).thenReturn(VALID_TO_DATE);
        when(this.oneMDSJobDetail2.getValidTo()).thenReturn(VALID_TO_DATE);
        when(this.oneMDSJobDetail2.getContent()).thenReturn(Collections.singletonList(oneMDSJobDetailContent));
        when(this.oneMDSJobDetail3.getValidFrom()).thenReturn(VALID_FROM_DATE);
        when(this.oneMDSJobDetail3.getValidTo()).thenReturn(VALID_FROM_DATE);
        when(this.oneMDSPhone1.getNumber()).thenReturn(PHONE_NUMBER);
        when(this.oneMDSJobDetail3.getContent()).thenReturn(null);
        when(this.oneMDSWorkAssignment1.getJobDetails())
                .thenReturn(Arrays.asList(oneMDSJobDetail, oneMDSJobDetail2, oneMDSJobDetail3));
        when(this.oneMDSWorkAssignment2.getJobDetails())
                .thenReturn(Arrays.asList(oneMDSJobDetail, oneMDSJobDetail2, oneMDSJobDetail3));
        when(this.auditLogUtil.prepareDataModificationAuditMessage(any(), any(), any(), any(), any(), any(), any()))
                .thenReturn(dataModificationAuditMessage);
        jobDetailsConversionFailedLog.setInstance(jobDetailsConversionFailedInstance);
        WorkAssignments rmWorkAssignments = WorkAssignments.create();
        rmWorkAssignments.setStartDate(this.localValidFrom);
        rmWorkAssignments.setEndDate(this.localValidTo);
        rmWorkAssignments.setWorkAssignmentID(MDI_WORK_ASSIGNMENT_ID);
        when(this.workAssignmentDAO.getWorkAssignmentKeyId(MDI_WORK_ASSIGNMENT_ID)).thenReturn(Optional.empty());
        when(this.conversionService.convert(oneMDSWorkAssignment1, WorkAssignments.class))
                .thenReturn(rmWorkAssignments);
        WorkAssignments rmWorkAssignments1 = WorkAssignments.create();
        rmWorkAssignments1.setStartDate(this.localValidTo);
        rmWorkAssignments1.setEndDate(this.localValidTo);
        rmWorkAssignments1.setWorkAssignmentID(MDI_WORK_ASSIGNMENT_ID_2);
        when(this.conversionService.convert(oneMDSWorkAssignment2, WorkAssignments.class))
                .thenReturn(rmWorkAssignments1);
        AvailabilityReplicationSummary availabilityReplicationSummary = AvailabilityReplicationSummary.create();
        String resourceId = UUID.randomUUID().toString();
        availabilityReplicationSummary.setResourceId(resourceId);
        WorkAssignments workAssignments = WorkAssignments.create();
        workAssignments.setId(resourceId);
        when(this.workAssignmentDAO.getWorkAssignmentKeyId(MDI_WORK_ASSIGNMENT_ID_2))
                .thenReturn(Optional.of(workAssignments));
        when(this.availabilityReplicationSummaryDAO.getAvailabilityReplicationSummary(MDI_WORK_ASSIGNMENT_ID))
                .thenReturn(Optional.of(availabilityReplicationSummary));
        JobDetails rmJobDetail = JobDetails.create();
        rmJobDetail.setValidFrom(localValidFrom);
        rmJobDetail.setValidTo(localValidTo);
        rmJobDetail.setCostCenterExternalID(UUID.randomUUID().toString());
        JobDetails rmJobDetail1 = JobDetails.create();
        rmJobDetail1.setValidFrom(localValidTo);
        rmJobDetail1.setValidTo(localValidTo);
        rmJobDetail1.setCostCenterExternalID(UUID.randomUUID().toString());
        when(this.conversionService.convert(oneMDSJobDetailContent, JobDetails.class)).thenReturn(rmJobDetail,
                rmJobDetail1);
        when(this.availabilityReplicationSummaryDAO.getAvailabilityReplicationSummary(MDI_WORK_ASSIGNMENT_ID_2))
                .thenReturn(null);

        this.workForcePersonLogs.add(jobDetailsConversionFailedLog);

		AtomicInteger successRecords = new AtomicInteger(0);
		LogEntry logEntry = new LogEntry();
		logEntry.setStatus(LogEntryStatus.SUCCESS);
		logEntry.setObjectId(INSTANCE_ID);
		logEntry.setObjectVersionId(VERSION_ID);
		logEntry.setLocalId(EXTERNAL_ID);
		logEntry.setObjectType(MDIEntities.WORKFORCE_PERSON.getName());
		logEntry.setErrorCode("");
		logEntry.setErrorMessage("");

		assertEquals(List.of(logEntry), this.classUnderTest.processWorkforceLog(this.workForcePersonLogs,
				CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader, successRecords));
        verify(this.workforceReplicationDAO, times(1)).save(any(Headers.class), any(WorkforcePersons.class), anyList(),
                any(ProfilePhoto.class), any(Attachment.class), any(ReplicationFailures.class));
        verify(this.replicationFailureDAO, times(0)).saveWorkforceReplicationFailure(any(Marker.class),
                any(ReplicationException.class), any(Log.class), anyString(), any(JobSchedulerRunHeader.class));
        List<ILoggingEvent> logsList = listAppender.list;
		assertEquals(6, logsList.size());
        ILoggingEvent debugLog1 = logsList.get(0);
        ILoggingEvent infoLog1 = logsList.get(1);
        assertEquals(StringFormatter.format(
                "Processing instance record with the event={0}, versionId={1} and instance.id={2}", INCLUDED_EVENT,
                VERSION_ID, INSTANCE_ID), debugLog1.getFormattedMessage());
        assertEquals(Level.INFO, debugLog1.getLevel());
        assertEquals(StringFormatter.format("Preparing data modification message for the create event and id={0}",
                INSTANCE_ID), infoLog1.getFormattedMessage());
        assertEquals(Level.INFO, infoLog1.getLevel());
    }

	@Test
    @DisplayName("test prepareDataModificationAuditMessageForCreate")
    public void testPrepareDataModificationAuditMessageForCreate()
            throws AuditLogNotAvailableException, AuditLogWriteException {
        Mockito.doReturn(dataSubject).when(auditLogMessageFactory).createAuditedDataSubject();
        when(this.auditLogUtil.prepareDataModificationAuditMessage(any(), any(), any(), any(), any(), any(), any()))
                .thenReturn(dataModificationAuditMessage);

        Log jobDetailsConversionFailedLog = new Log();
        jobDetailsConversionFailedLog.setEvent(CREATED_EVENT);
        jobDetailsConversionFailedLog.setVersionId(VERSION_ID);
        Instance jobDetailsConversionFailedInstance = new Instance();
        jobDetailsConversionFailedInstance.setId(INSTANCE_ID);
        jobDetailsConversionFailedInstance.setExternalId(EXTERNAL_ID);
        Emails rmEmail = Emails.create();
        rmEmail.setIsDefault(Boolean.TRUE);
        rmEmail.setUsageCode(BUSINESS_USAGE_CODE);
        rmEmail.setAddress("testemail@gmail.com");
        Phones rmPhone = Phones.create();
        rmPhone.setNumber("123456");
        rmPhone.setIsDefault(Boolean.TRUE);
        ProfileDetails rmProfileDetails = ProfileDetails.create();
        rmProfileDetails.setFirstName("FirstName");
        rmProfileDetails.setLastName("LastName");
        rmProfileDetails.setFormalName("FormalName");
        rmProfileDetails.setValidFrom(this.localValidFrom);
        rmProfileDetails.setValidTo(this.localValidTo);
        when(this.conversionService.convert(oneMDSEmail1, Emails.class)).thenReturn(rmEmail);
        when(this.conversionService.convert(oneMDSPhone1, Phones.class)).thenReturn(rmPhone);
        when(this.conversionService.convert(oneMDSProfileDetail1, ProfileDetails.class)).thenReturn(rmProfileDetails);
        jobDetailsConversionFailedInstance.setEmails(Collections.singletonList(oneMDSEmail1));
        jobDetailsConversionFailedInstance.setPhones(Collections.singletonList(oneMDSPhone1));
        jobDetailsConversionFailedInstance.setUserAccount(oneMDSUserAccount1);
        jobDetailsConversionFailedInstance.setProfileDetail(Collections.singletonList(oneMDSProfileDetail1));
        jobDetailsConversionFailedInstance.setWorkAssignments(Collections.singletonList(oneMDSWorkAssignment1));

        jobDetailsConversionFailedLog.setInstance(jobDetailsConversionFailedInstance);
        this.workForcePersonLogs.add(jobDetailsConversionFailedLog);

		AtomicInteger successRecords = new AtomicInteger(0);
		LogEntry logEntry = new LogEntry();
		logEntry.setStatus(LogEntryStatus.SUCCESS);
		logEntry.setObjectId(INSTANCE_ID);
		logEntry.setObjectVersionId(VERSION_ID);
		logEntry.setLocalId(EXTERNAL_ID);
		logEntry.setObjectType(MDIEntities.WORKFORCE_PERSON.getName());
		logEntry.setErrorCode("");
		logEntry.setErrorMessage("");

		assertEquals(List.of(logEntry), this.classUnderTest.processWorkforceLog(this.workForcePersonLogs,
				CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader, successRecords));
        verify(dataSubject, times(1)).addIdentifier("ID", EXTERNAL_ID);
        verify(dataSubject, times(1)).setType(DATA_SUBJECT_TYPE);
        verify(this.auditLogUtil, times(1)).prepareDataModificationAuditMessage(isNull(), eq(DATA_SUBJECT_TYPE), eq(SERVICE_IDENTIFIER), eq(CREATE_OPERATION), anyMap(),
                isNull(), any(AuditedDataSubject.class));
        verify(dataModificationAuditMessage, times(1)).logSuccess();
    }

	@Test
    @DisplayName("test prepareDataModificationAuditMessageForCreate when personal details are null")
    public void testPrepareDataModificationAuditMessageForCreateWithDataAsNull()
            throws AuditLogNotAvailableException, AuditLogWriteException {
        Mockito.doReturn(dataSubject).when(auditLogMessageFactory).createAuditedDataSubject();
        when(this.auditLogUtil.prepareDataModificationAuditMessage(any(), any(), any(), any(), any(), any(), any()))
                .thenReturn(dataModificationAuditMessage);
        Log jobDetailsConversionFailedLog = new Log();
        jobDetailsConversionFailedLog.setEvent(CREATED_EVENT);
        jobDetailsConversionFailedLog.setVersionId(VERSION_ID);
        Instance jobDetailsConversionFailedInstance = new Instance();
        jobDetailsConversionFailedInstance.setId(INSTANCE_ID);
        jobDetailsConversionFailedInstance.setExternalId(EXTERNAL_ID);
        Emails rmEmail = Emails.create();
        rmEmail.setIsDefault(Boolean.TRUE);
        rmEmail.setUsageCode(BUSINESS_USAGE_CODE);
        rmEmail.setAddress("testemail@gmail.com");
        when(this.conversionService.convert(oneMDSEmail1, Emails.class)).thenReturn(rmEmail);
        jobDetailsConversionFailedInstance.setEmails(Collections.singletonList(oneMDSEmail1));
        jobDetailsConversionFailedInstance.setPhones(Collections.singletonList(oneMDSPhone1));
        jobDetailsConversionFailedInstance.setUserAccount(oneMDSUserAccount1);
        jobDetailsConversionFailedInstance.setProfileDetail(Collections.singletonList(oneMDSProfileDetail1));
        jobDetailsConversionFailedInstance.setWorkAssignments(Collections.singletonList(oneMDSWorkAssignment1));

        jobDetailsConversionFailedLog.setInstance(jobDetailsConversionFailedInstance);
        this.workForcePersonLogs.add(jobDetailsConversionFailedLog);
		AtomicInteger successRecords = new AtomicInteger(0);
		LogEntry logEntry = new LogEntry();
		logEntry.setStatus(LogEntryStatus.SUCCESS);
		logEntry.setObjectId(INSTANCE_ID);
		logEntry.setObjectVersionId(VERSION_ID);
		logEntry.setLocalId(EXTERNAL_ID);
		logEntry.setObjectType(MDIEntities.WORKFORCE_PERSON.getName());
		logEntry.setErrorCode("");
		logEntry.setErrorMessage("");

		assertEquals(List.of(logEntry), this.classUnderTest.processWorkforceLog(this.workForcePersonLogs,
				CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader, successRecords));
        verify(dataSubject, times(1)).addIdentifier("ID", EXTERNAL_ID);
        verify(dataSubject, times(1)).setType(DATA_SUBJECT_TYPE);
        verify(this.auditLogUtil, times(1)).prepareDataModificationAuditMessage(isNull(), eq(DATA_SUBJECT_TYPE), eq(SERVICE_IDENTIFIER), eq(CREATE_OPERATION), anyMap(),
                isNull(), any(AuditedDataSubject.class));
        verify(dataModificationAuditMessage, times(1)).logSuccess();
    }

	@Test
    @DisplayName("test prepareDataModificationAuditMessageForUpdate all data update")
    public void testPrepareDataModificationAuditMessageForUpdate()
            throws AuditLogNotAvailableException, AuditLogWriteException {
        Mockito.doReturn(dataSubject).when(auditLogMessageFactory).createAuditedDataSubject();
        when(this.auditLogUtil.prepareDataModificationAuditMessage(any(), any(), any(), any(), any(), any(), any()))
                .thenReturn(dataModificationAuditMessage);

        String workforcePersonId = INSTANCE_ID;
        String workforcePersonExternalId = EXTERNAL_ID;
        Emails actualEmail1 = Emails.create();
        actualEmail1.setIsDefault(Boolean.TRUE);
        actualEmail1.setUsageCode(BUSINESS_USAGE_CODE);
        actualEmail1.setAddress("testemailactual1@gmail.com");
        List<Emails> emails = new ArrayList<>();
        emails.add(actualEmail1);
        Phones actualPhone = Phones.create();
        actualPhone.setNumber("1234567");
        actualPhone.setIsDefault(Boolean.TRUE);
        actualPhone.setUsageCode("usage");
        actualPhone.setCountryCode("CC");
        List<Phones> phones = new ArrayList<>();
        phones.add(actualPhone);
        ProfileDetails actualProfileDetails = ProfileDetails.create();
        actualProfileDetails.setFirstName("ActualFirstName");
        actualProfileDetails.setLastName("ActualLastName");
        actualProfileDetails.setFormalName("ActualFormalName");
        actualProfileDetails.setValidFrom(this.localValidFrom);
        actualProfileDetails.setValidTo(this.localValidTo);
        List<ProfileDetails> profileDetails = new ArrayList<>();
        profileDetails.add(actualProfileDetails);

        WorkforcePersons workforcePersons = WorkforcePersons.create();
        workforcePersons.setId(workforcePersonId);
        workforcePersons.setExternalID(workforcePersonExternalId);
        workforcePersons.setEmails(emails);
        workforcePersons.setPhones(phones);
        workforcePersons.setProfileDetails(profileDetails);

        Log jobDetailsConversionFailedLog = new Log();
        jobDetailsConversionFailedLog.setEvent(UPDATED_EVENT);
        jobDetailsConversionFailedLog.setVersionId(VERSION_ID);
        Instance jobDetailsConversionFailedInstance = new Instance();
        jobDetailsConversionFailedInstance.setId(workforcePersonId);
        jobDetailsConversionFailedInstance.setExternalId(workforcePersonExternalId);
        Emails rmEmail = Emails.create();
        rmEmail.setIsDefault(Boolean.TRUE);
        rmEmail.setUsageCode(BUSINESS_USAGE_CODE);
        rmEmail.setAddress("testemail@gmail.com");
        Phones rmPhone = Phones.create();
        rmPhone.setNumber("123456");
        rmPhone.setIsDefault(Boolean.FALSE);
        rmPhone.setUsageCode("usageupdate");
        rmPhone.setCountryCode("CCUpdate");
        ProfileDetails rmProfileDetails = ProfileDetails.create();
        rmProfileDetails.setFirstName("FirstName");
        rmProfileDetails.setLastName("LastName");
        rmProfileDetails.setFormalName("FormalName");
        rmProfileDetails.setValidFrom(this.localValidFrom);
        rmProfileDetails.setValidTo(this.localValidTo);
        when(this.conversionService.convert(oneMDSEmail1, Emails.class)).thenReturn(rmEmail);
        when(this.conversionService.convert(oneMDSPhone1, Phones.class)).thenReturn(rmPhone);
        when(this.conversionService.convert(oneMDSProfileDetail1, ProfileDetails.class)).thenReturn(rmProfileDetails);
        when(this.workforcePersonDAO.read(workforcePersonId)).thenReturn(workforcePersons);
        jobDetailsConversionFailedInstance.setEmails(Collections.singletonList(oneMDSEmail1));
        jobDetailsConversionFailedInstance.setPhones(Collections.singletonList(oneMDSPhone1));
        jobDetailsConversionFailedInstance.setUserAccount(oneMDSUserAccount1);
        jobDetailsConversionFailedInstance.setProfileDetail(Collections.singletonList(oneMDSProfileDetail1));
        jobDetailsConversionFailedInstance.setWorkAssignments(Collections.singletonList(oneMDSWorkAssignment1));

        jobDetailsConversionFailedLog.setInstance(jobDetailsConversionFailedInstance);
        this.workForcePersonLogs.add(jobDetailsConversionFailedLog);

		AtomicInteger successRecords = new AtomicInteger(0);
		LogEntry logEntry = new LogEntry();
		logEntry.setStatus(LogEntryStatus.SUCCESS);
		logEntry.setObjectId(INSTANCE_ID);
		logEntry.setObjectVersionId(VERSION_ID);
		logEntry.setLocalId(EXTERNAL_ID);
		logEntry.setObjectType(MDIEntities.WORKFORCE_PERSON.getName());
		logEntry.setErrorCode("");
		logEntry.setErrorMessage("");

		assertEquals(List.of(logEntry), this.classUnderTest.processWorkforceLog(this.workForcePersonLogs,
				CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader, successRecords));
        verify(dataSubject, times(1)).addIdentifier("ID", workforcePersonExternalId);
        verify(dataSubject, times(1)).setType(DATA_SUBJECT_TYPE);
        verify(this.auditLogUtil, times(1)).prepareDataModificationAuditMessage(isNull(), eq(DATA_SUBJECT_TYPE), eq(SERVICE_IDENTIFIER), eq(UPDATE_OPERATION), anyMap(),
                anyMap(), any(AuditedDataSubject.class));
        verify(dataModificationAuditMessage, times(1)).logSuccess();
    }

	@Test
    @DisplayName("test prepareDataModificationAuditMessageForUpdate Profile details are changed")
    public void testPrepareDataModificationAuditMessageForUpdatePhonesChanged()
            throws AuditLogNotAvailableException, AuditLogWriteException {
        Mockito.doReturn(dataSubject).when(auditLogMessageFactory).createAuditedDataSubject();
        when(this.auditLogUtil.prepareDataModificationAuditMessage(any(), any(), any(), any(), any(), any(), any()))
                .thenReturn(dataModificationAuditMessage);

        String workforcePersonId = INSTANCE_ID;
        String workforcePersonExternalId = EXTERNAL_ID;
        Emails actualEmail1 = Emails.create();
        actualEmail1.setIsDefault(Boolean.TRUE);
        actualEmail1.setUsageCode(BUSINESS_USAGE_CODE);
        actualEmail1.setAddress("testemail@gmail.com");
        List<Emails> emails = new ArrayList<>();
        emails.add(actualEmail1);
        Phones actualPhone = Phones.create();
        actualPhone.setNumber("123456");
        actualPhone.setIsDefault(Boolean.FALSE);
        actualPhone.setUsageCode("usage");
        actualPhone.setCountryCode("CC");
        List<Phones> phones = new ArrayList<>();
        phones.add(actualPhone);
        ProfileDetails actualProfileDetails = ProfileDetails.create();
        actualProfileDetails.setFirstName("ActualFirstName");
        actualProfileDetails.setLastName("ActualLastName");
        actualProfileDetails.setFormalName("ActualFormalName");
        actualProfileDetails.setValidFrom(this.localValidFrom);
        actualProfileDetails.setValidTo(this.localValidTo);
        List<ProfileDetails> profileDetails = new ArrayList<>();
        profileDetails.add(actualProfileDetails);

        WorkforcePersons workforcePersons = WorkforcePersons.create();
        workforcePersons.setId(workforcePersonId);
        workforcePersons.setExternalID(workforcePersonExternalId);
        workforcePersons.setEmails(emails);
        workforcePersons.setPhones(phones);
        workforcePersons.setProfileDetails(profileDetails);

        Log jobDetailsConversionFailedLog = new Log();
        jobDetailsConversionFailedLog.setEvent(UPDATED_EVENT);
        jobDetailsConversionFailedLog.setVersionId(VERSION_ID);
        Instance jobDetailsConversionFailedInstance = new Instance();
        jobDetailsConversionFailedInstance.setId(workforcePersonId);
        jobDetailsConversionFailedInstance.setExternalId(workforcePersonExternalId);
        Emails rmEmail = Emails.create();
        rmEmail.setIsDefault(Boolean.TRUE);
        rmEmail.setUsageCode(BUSINESS_USAGE_CODE);
        rmEmail.setAddress("testemail@gmail.com");
        Phones rmPhone = Phones.create();
        rmPhone.setNumber("123456");
        rmPhone.setIsDefault(Boolean.FALSE);
        rmPhone.setUsageCode("usage");
        rmPhone.setCountryCode("CC");
        ProfileDetails rmProfileDetails = ProfileDetails.create();
        rmProfileDetails.setFirstName("FirstName");
        rmProfileDetails.setLastName("LastName");
        rmProfileDetails.setFormalName("FormalName");
        rmProfileDetails.setValidFrom(this.localValidFrom);
        rmProfileDetails.setValidTo(this.localValidTo);
        when(this.conversionService.convert(oneMDSEmail1, Emails.class)).thenReturn(rmEmail);
        when(this.conversionService.convert(oneMDSPhone1, Phones.class)).thenReturn(rmPhone);
        when(this.conversionService.convert(oneMDSProfileDetail1, ProfileDetails.class)).thenReturn(rmProfileDetails);
        when(this.workforcePersonDAO.read(workforcePersonId)).thenReturn(workforcePersons);
        jobDetailsConversionFailedInstance.setEmails(Collections.singletonList(oneMDSEmail1));
        jobDetailsConversionFailedInstance.setPhones(Collections.singletonList(oneMDSPhone1));
        jobDetailsConversionFailedInstance.setUserAccount(oneMDSUserAccount1);
        jobDetailsConversionFailedInstance.setProfileDetail(Collections.singletonList(oneMDSProfileDetail1));
        jobDetailsConversionFailedInstance.setWorkAssignments(Collections.singletonList(oneMDSWorkAssignment1));

        jobDetailsConversionFailedLog.setInstance(jobDetailsConversionFailedInstance);
        this.workForcePersonLogs.add(jobDetailsConversionFailedLog);

		AtomicInteger successRecords = new AtomicInteger(0);
		LogEntry logEntry = new LogEntry();
		logEntry.setStatus(LogEntryStatus.SUCCESS);
		logEntry.setObjectId(INSTANCE_ID);
		logEntry.setObjectVersionId(VERSION_ID);
		logEntry.setLocalId(EXTERNAL_ID);
		logEntry.setObjectType(MDIEntities.WORKFORCE_PERSON.getName());
		logEntry.setErrorCode("");
		logEntry.setErrorMessage("");

		assertEquals(List.of(logEntry), this.classUnderTest.processWorkforceLog(this.workForcePersonLogs,
				CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader, successRecords));
        verify(dataSubject, times(1)).addIdentifier("ID", workforcePersonExternalId);
        verify(dataSubject, times(1)).setType(DATA_SUBJECT_TYPE);
        verify(this.auditLogUtil, times(1)).prepareDataModificationAuditMessage(isNull(), eq(DATA_SUBJECT_TYPE), eq(SERVICE_IDENTIFIER), eq(UPDATE_OPERATION), anyMap(),
                anyMap(), any(AuditedDataSubject.class));
        verify(dataModificationAuditMessage, times(1)).logSuccess();
    }

	@Test
    @DisplayName("test prepareDataModificationAuditMessageForUpdate Phones are changed")
    public void testPrepareDataModificationAuditMessageForUpdateProfileDetailsChanged()
            throws AuditLogNotAvailableException, AuditLogWriteException {
        Mockito.doReturn(dataSubject).when(auditLogMessageFactory).createAuditedDataSubject();
        when(this.auditLogUtil.prepareDataModificationAuditMessage(any(), any(), any(), any(), any(), any(), any()))
                .thenReturn(dataModificationAuditMessage);

        String workforcePersonId = INSTANCE_ID;
        String workforcePersonExternalId = EXTERNAL_ID;
        Emails actualEmail1 = Emails.create();
        actualEmail1.setIsDefault(Boolean.TRUE);
        actualEmail1.setUsageCode(BUSINESS_USAGE_CODE);
        actualEmail1.setAddress("testemail@gmail.com");
        List<Emails> emails = new ArrayList<>();
        emails.add(actualEmail1);
        Phones actualPhone = Phones.create();
        actualPhone.setNumber("123456");
        actualPhone.setIsDefault(Boolean.FALSE);
        actualPhone.setUsageCode("usage");
        actualPhone.setCountryCode("CC");
        List<Phones> phones = new ArrayList<>();
        phones.add(actualPhone);
        ProfileDetails actualProfileDetails = ProfileDetails.create();
        actualProfileDetails.setFirstName("FirstName");
        actualProfileDetails.setLastName("LastName");
        actualProfileDetails.setFormalName("FormalName");
        actualProfileDetails.setValidFrom(this.localValidFrom);
        actualProfileDetails.setValidTo(this.localValidTo);
        List<ProfileDetails> profileDetails = new ArrayList<>();
        profileDetails.add(actualProfileDetails);

        WorkforcePersons workforcePersons = WorkforcePersons.create();
        workforcePersons.setId(workforcePersonId);
        workforcePersons.setExternalID(workforcePersonExternalId);
        workforcePersons.setEmails(emails);
        workforcePersons.setPhones(phones);
        workforcePersons.setProfileDetails(profileDetails);

        Log jobDetailsConversionFailedLog = new Log();
        jobDetailsConversionFailedLog.setEvent(UPDATED_EVENT);
        jobDetailsConversionFailedLog.setVersionId(VERSION_ID);
        Instance jobDetailsConversionFailedInstance = new Instance();
        jobDetailsConversionFailedInstance.setId(workforcePersonId);
        jobDetailsConversionFailedInstance.setExternalId(workforcePersonExternalId);
        Emails rmEmail = Emails.create();
        rmEmail.setIsDefault(Boolean.TRUE);
        rmEmail.setUsageCode(BUSINESS_USAGE_CODE);
        rmEmail.setAddress("testemail@gmail.com");
        Phones rmPhone = Phones.create();
        rmPhone.setNumber("12345678");
        rmPhone.setIsDefault(Boolean.FALSE);
        rmPhone.setUsageCode("usage");
        rmPhone.setCountryCode("CC");
        ProfileDetails rmProfileDetails = ProfileDetails.create();
        rmProfileDetails.setFirstName("FirstName");
        rmProfileDetails.setLastName("LastName");
        rmProfileDetails.setFormalName("FormalName");
        rmProfileDetails.setValidFrom(this.localValidFrom);
        rmProfileDetails.setValidTo(this.localValidTo);
        when(this.conversionService.convert(oneMDSEmail1, Emails.class)).thenReturn(rmEmail);
        when(this.conversionService.convert(oneMDSPhone1, Phones.class)).thenReturn(rmPhone);
        when(this.conversionService.convert(oneMDSProfileDetail1, ProfileDetails.class)).thenReturn(rmProfileDetails);
        when(this.workforcePersonDAO.read(workforcePersonId)).thenReturn(workforcePersons);
        jobDetailsConversionFailedInstance.setEmails(Collections.singletonList(oneMDSEmail1));
        jobDetailsConversionFailedInstance.setPhones(Collections.singletonList(oneMDSPhone1));
        jobDetailsConversionFailedInstance.setUserAccount(oneMDSUserAccount1);
        jobDetailsConversionFailedInstance.setProfileDetail(Collections.singletonList(oneMDSProfileDetail1));
        jobDetailsConversionFailedInstance.setWorkAssignments(Collections.singletonList(oneMDSWorkAssignment1));

        jobDetailsConversionFailedLog.setInstance(jobDetailsConversionFailedInstance);
        this.workForcePersonLogs.add(jobDetailsConversionFailedLog);

		AtomicInteger successRecords = new AtomicInteger(0);
		LogEntry logEntry = new LogEntry();
		logEntry.setStatus(LogEntryStatus.SUCCESS);
		logEntry.setObjectId(INSTANCE_ID);
		logEntry.setObjectVersionId(VERSION_ID);
		logEntry.setLocalId(EXTERNAL_ID);
		logEntry.setObjectType(MDIEntities.WORKFORCE_PERSON.getName());
		logEntry.setErrorCode("");
		logEntry.setErrorMessage("");

		assertEquals(List.of(logEntry), this.classUnderTest.processWorkforceLog(this.workForcePersonLogs,
				CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader, successRecords));
        verify(dataSubject, times(1)).addIdentifier("ID", workforcePersonExternalId);
        verify(dataSubject, times(1)).setType(DATA_SUBJECT_TYPE);
        verify(this.auditLogUtil, times(1)).prepareDataModificationAuditMessage(isNull(), eq(DATA_SUBJECT_TYPE), eq(SERVICE_IDENTIFIER), eq(UPDATE_OPERATION), anyMap(),
                anyMap(), any(AuditedDataSubject.class));
        verify(dataModificationAuditMessage, times(1)).logSuccess();
    }

	@Test
    @DisplayName("test prepareDataModificationAuditMessageForUpdate with no data update")
    public void testPrepareDataModificationAuditMessageForUpdateNoDataUpdate()
            throws AuditLogNotAvailableException, AuditLogWriteException {
        Mockito.doReturn(dataSubject).when(auditLogMessageFactory).createAuditedDataSubject();
        when(this.auditLogUtil.prepareDataModificationAuditMessage(any(), any(), any(), any(), any(), any(), any()))
                .thenReturn(dataModificationAuditMessage);

        String workforcePersonId = INSTANCE_ID;
        String workforcePersonExternalId = EXTERNAL_ID;
        Emails actualEmail1 = Emails.create();
        actualEmail1.setIsDefault(Boolean.TRUE);
        actualEmail1.setUsageCode(BUSINESS_USAGE_CODE);
        actualEmail1.setAddress("testemailactual1@gmail.com");
        List<Emails> emails = new ArrayList<>();
        emails.add(actualEmail1);
        Phones actualPhone = Phones.create();
        actualPhone.setNumber("1234567");
        actualPhone.setIsDefault(Boolean.TRUE);
        actualPhone.setUsageCode("usage");
        actualPhone.setCountryCode("CC");
        List<Phones> phones = new ArrayList<>();
        phones.add(actualPhone);
        ProfileDetails actualProfileDetails = ProfileDetails.create();
        actualProfileDetails.setFirstName("ActualFirstName");
        actualProfileDetails.setLastName("ActualLastName");
        actualProfileDetails.setFormalName("ActualFormalName");
        actualProfileDetails.setValidFrom(this.localValidFrom);
        actualProfileDetails.setValidTo(this.localValidTo);
        List<ProfileDetails> profileDetails = new ArrayList<>();
        profileDetails.add(actualProfileDetails);

        WorkforcePersons workforcePersons = WorkforcePersons.create();
        workforcePersons.setId(workforcePersonId);
        workforcePersons.setExternalID(workforcePersonExternalId);
        workforcePersons.setEmails(emails);
        workforcePersons.setPhones(phones);
        workforcePersons.setProfileDetails(profileDetails);

        Log jobDetailsConversionFailedLog = new Log();
        jobDetailsConversionFailedLog.setEvent(UPDATED_EVENT);
        jobDetailsConversionFailedLog.setVersionId(VERSION_ID);
        Instance jobDetailsConversionFailedInstance = new Instance();
        jobDetailsConversionFailedInstance.setId(workforcePersonId);
        jobDetailsConversionFailedInstance.setExternalId(workforcePersonExternalId);
        Emails rmEmail = Emails.create();
        rmEmail.setIsDefault(Boolean.TRUE);
        rmEmail.setUsageCode(BUSINESS_USAGE_CODE);
        rmEmail.setAddress("testemailactual1@gmail.com");
        Phones rmPhone = Phones.create();
        rmPhone.setNumber("1234567");
        rmPhone.setIsDefault(Boolean.TRUE);
        rmPhone.setUsageCode("usage");
        rmPhone.setCountryCode("CC");
        ProfileDetails rmProfileDetails = ProfileDetails.create();
        rmProfileDetails.setFirstName("ActualFirstName");
        rmProfileDetails.setLastName("ActualLastName");
        rmProfileDetails.setFormalName("ActualFormalName");
        rmProfileDetails.setValidFrom(this.localValidFrom);
        rmProfileDetails.setValidTo(this.localValidTo);
        when(this.conversionService.convert(oneMDSEmail1, Emails.class)).thenReturn(rmEmail);
        when(this.conversionService.convert(oneMDSPhone1, Phones.class)).thenReturn(rmPhone);
        when(this.conversionService.convert(oneMDSProfileDetail1, ProfileDetails.class)).thenReturn(rmProfileDetails);
        when(this.workforcePersonDAO.read(workforcePersonId)).thenReturn(workforcePersons);
        jobDetailsConversionFailedInstance.setEmails(Collections.singletonList(oneMDSEmail1));
        jobDetailsConversionFailedInstance.setPhones(Collections.singletonList(oneMDSPhone1));
        jobDetailsConversionFailedInstance.setUserAccount(oneMDSUserAccount1);
        jobDetailsConversionFailedInstance.setProfileDetail(Collections.singletonList(oneMDSProfileDetail1));
        jobDetailsConversionFailedInstance.setWorkAssignments(Collections.singletonList(oneMDSWorkAssignment1));

        jobDetailsConversionFailedLog.setInstance(jobDetailsConversionFailedInstance);
        this.workForcePersonLogs.add(jobDetailsConversionFailedLog);

		AtomicInteger successRecords = new AtomicInteger(0);
		LogEntry logEntry = new LogEntry();
		logEntry.setStatus(LogEntryStatus.SUCCESS);
		logEntry.setObjectId(INSTANCE_ID);
		logEntry.setObjectVersionId(VERSION_ID);
		logEntry.setLocalId(EXTERNAL_ID);
		logEntry.setObjectType(MDIEntities.WORKFORCE_PERSON.getName());
		logEntry.setErrorCode("");
		logEntry.setErrorMessage("");

		assertEquals(List.of(logEntry), this.classUnderTest.processWorkforceLog(this.workForcePersonLogs,
				CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader, successRecords));
        verify(dataSubject, times(0)).addIdentifier("ID", workforcePersonExternalId);
        verify(dataSubject, times(0)).setType(DATA_SUBJECT_TYPE);
        verify(this.auditLogUtil, times(0)).prepareDataModificationAuditMessage(isNull(), eq(DATA_SUBJECT_TYPE), eq(SERVICE_IDENTIFIER), eq(UPDATE_OPERATION), anyMap(),
                anyMap(), any(AuditedDataSubject.class));
        verify(dataModificationAuditMessage, times(0)).logSuccess();
    }

	@Test
    @DisplayName("test prepareDataModificationAuditMessageForUpdate with new data addition")
    public void testPrepareDataModificationAuditMessageForUpdateWithNewDataUpdate()
            throws AuditLogNotAvailableException, AuditLogWriteException {
        Mockito.doReturn(dataSubject).when(auditLogMessageFactory).createAuditedDataSubject();
        when(this.auditLogUtil.prepareDataModificationAuditMessage(any(), any(), any(), any(), any(), any(), any()))
                .thenReturn(dataModificationAuditMessage);

        String workforcePersonId = INSTANCE_ID;
        String workforcePersonExternalId = EXTERNAL_ID;
        Emails actualEmail1 = Emails.create();
        actualEmail1.setIsDefault(Boolean.TRUE);
        actualEmail1.setUsageCode(BUSINESS_USAGE_CODE);
        actualEmail1.setAddress("testemail@gmail.com");
        List<Emails> emails = new ArrayList<>();
        emails.add(actualEmail1);
        Phones actualPhone = Phones.create();
        actualPhone.setNumber("123456");
        actualPhone.setIsDefault(Boolean.TRUE);
        actualPhone.setUsageCode("usage");
        actualPhone.setCountryCode("CC");
        List<Phones> phones = new ArrayList<>();
        phones.add(actualPhone);
        ProfileDetails actualProfileDetails = ProfileDetails.create();
        actualProfileDetails.setFirstName("FirstName");
        actualProfileDetails.setLastName("LastName");
        actualProfileDetails.setFormalName("FormalName");
        actualProfileDetails.setValidFrom(this.localValidFrom);
        actualProfileDetails.setValidTo(this.localValidTo);
        List<ProfileDetails> profileDetails = new ArrayList<>();
        profileDetails.add(actualProfileDetails);

        WorkforcePersons workforcePersons = WorkforcePersons.create();
        workforcePersons.setId(workforcePersonId);
        workforcePersons.setExternalID(workforcePersonExternalId);
        workforcePersons.setEmails(emails);
        workforcePersons.setPhones(phones);
        workforcePersons.setProfileDetails(profileDetails);

        Log jobDetailsConversionFailedLog = new Log();
        jobDetailsConversionFailedLog.setEvent(UPDATED_EVENT);
        jobDetailsConversionFailedLog.setVersionId(VERSION_ID);
        Instance jobDetailsConversionFailedInstance = new Instance();
        jobDetailsConversionFailedInstance.setId(workforcePersonId);
        jobDetailsConversionFailedInstance.setExternalId(workforcePersonExternalId);
        Emails rmEmail = Emails.create();
        rmEmail.setIsDefault(Boolean.TRUE);
        rmEmail.setUsageCode(BUSINESS_USAGE_CODE);
        rmEmail.setAddress("testemail@gmail.com");
        Emails rmEmail2 = Emails.create();
        rmEmail2.setIsDefault(Boolean.FALSE);
        rmEmail2.setUsageCode("U");
        rmEmail2.setAddress("testemail2@gmail.com");
        Phones rmPhone = Phones.create();
        rmPhone.setNumber("123456");
        rmPhone.setIsDefault(Boolean.TRUE);
        rmPhone.setUsageCode("usage");
        rmPhone.setCountryCode("CC");
        ProfileDetails rmProfileDetails = ProfileDetails.create();
        rmProfileDetails.setFirstName("FirstName");
        rmProfileDetails.setLastName("LastName");
        rmProfileDetails.setFormalName("FormalName");
        rmProfileDetails.setValidFrom(this.localValidFrom);
        rmProfileDetails.setValidTo(this.localValidTo);
        when(this.conversionService.convert(oneMDSEmail1, Emails.class)).thenReturn(rmEmail);
        when(this.conversionService.convert(oneMDSEmail2, Emails.class)).thenReturn(rmEmail2);
        when(this.conversionService.convert(oneMDSPhone1, Phones.class)).thenReturn(rmPhone);
        when(this.conversionService.convert(oneMDSProfileDetail1, ProfileDetails.class)).thenReturn(rmProfileDetails);
        when(this.workforcePersonDAO.read(workforcePersonId)).thenReturn(workforcePersons);
        jobDetailsConversionFailedInstance.setEmails(Arrays.asList(oneMDSEmail1, oneMDSEmail2));
        jobDetailsConversionFailedInstance.setPhones(Collections.singletonList(oneMDSPhone1));
        jobDetailsConversionFailedInstance.setUserAccount(oneMDSUserAccount1);
        jobDetailsConversionFailedInstance.setProfileDetail(Collections.singletonList(oneMDSProfileDetail1));
        jobDetailsConversionFailedInstance.setWorkAssignments(Collections.singletonList(oneMDSWorkAssignment1));

        jobDetailsConversionFailedLog.setInstance(jobDetailsConversionFailedInstance);
        this.workForcePersonLogs.add(jobDetailsConversionFailedLog);

		AtomicInteger successRecords = new AtomicInteger(0);
		LogEntry logEntry = new LogEntry();
		logEntry.setStatus(LogEntryStatus.SUCCESS);
		logEntry.setObjectId(INSTANCE_ID);
		logEntry.setObjectVersionId(VERSION_ID);
		logEntry.setLocalId(EXTERNAL_ID);
		logEntry.setObjectType(MDIEntities.WORKFORCE_PERSON.getName());
		logEntry.setErrorCode("");
		logEntry.setErrorMessage("");

		assertEquals(List.of(logEntry), this.classUnderTest.processWorkforceLog(this.workForcePersonLogs,
				CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader, successRecords));
        verify(dataSubject, times(1)).addIdentifier("ID", workforcePersonExternalId);
        verify(dataSubject, times(1)).setType(DATA_SUBJECT_TYPE);
        verify(this.auditLogUtil, times(1)).prepareDataModificationAuditMessage(isNull(), eq(DATA_SUBJECT_TYPE), eq(SERVICE_IDENTIFIER), eq(UPDATE_OPERATION), anyMap(),
                anyMap(), any(AuditedDataSubject.class));
        verify(dataModificationAuditMessage, times(1)).logSuccess();
    }

	@Test
    @DisplayName("test prepareDataModificationAuditMessageForUpdate with data deletion")
    public void testPrepareDataModificationAuditMessageForUpdateWithDeleteDataUpdate()
            throws AuditLogNotAvailableException, AuditLogWriteException {
        Mockito.doReturn(dataSubject).when(auditLogMessageFactory).createAuditedDataSubject();
        when(this.auditLogUtil.prepareDataModificationAuditMessage(any(), any(), any(), any(), any(), any(), any()))
                .thenReturn(dataModificationAuditMessage);

        String workforcePersonId = INSTANCE_ID;
        String workforcePersonExternalId = EXTERNAL_ID;
        Emails actualEmail1 = Emails.create();
        actualEmail1.setIsDefault(Boolean.TRUE);
        actualEmail1.setUsageCode(BUSINESS_USAGE_CODE);
        actualEmail1.setAddress("testemail@gmail.com");
        Emails actualEmail2 = Emails.create();
        actualEmail2.setIsDefault(Boolean.FALSE);
        actualEmail2.setUsageCode("U");
        actualEmail2.setAddress("testemail2@gmail.com");
        List<Emails> emails = new ArrayList<>();
        emails.add(actualEmail2);
        emails.add(actualEmail1);
        Phones actualPhone1 = Phones.create();
        actualPhone1.setNumber("123456");
        actualPhone1.setIsDefault(Boolean.TRUE);
        actualPhone1.setUsageCode("usage");
        actualPhone1.setCountryCode("CC");
        Phones actualPhone2 = Phones.create();
        actualPhone2.setNumber("1234567");
        actualPhone2.setIsDefault(Boolean.FALSE);
        actualPhone2.setUsageCode("usage2");
        actualPhone2.setCountryCode("CC2");
        List<Phones> phones = new ArrayList<>();
        phones.add(actualPhone2);
        phones.add(actualPhone1);
        ProfileDetails actualProfileDetails1 = ProfileDetails.create();
        actualProfileDetails1.setFirstName("FirstName");
        actualProfileDetails1.setLastName("LastName");
        actualProfileDetails1.setFormalName("FormalName");
        actualProfileDetails1.setValidFrom(this.localValidFrom);
        actualProfileDetails1.setValidTo(this.localValidTo);
        ProfileDetails actualProfileDetails2 = ProfileDetails.create();
        actualProfileDetails2.setFirstName("FirstName2");
        actualProfileDetails2.setLastName("LastName2");
        actualProfileDetails2.setFormalName("FormalName2");
        actualProfileDetails2.setValidFrom(this.localValidFrom);
        actualProfileDetails2.setValidTo(this.localValidTo);
        List<ProfileDetails> profileDetails = new ArrayList<>();
        profileDetails.add(actualProfileDetails2);
        profileDetails.add(actualProfileDetails1);

        WorkforcePersons workforcePersons = WorkforcePersons.create();
        workforcePersons.setId(workforcePersonId);
        workforcePersons.setExternalID(workforcePersonExternalId);
        workforcePersons.setEmails(emails);
        workforcePersons.setPhones(phones);
        workforcePersons.setProfileDetails(profileDetails);

        Log jobDetailsConversionFailedLog = new Log();
        jobDetailsConversionFailedLog.setEvent(UPDATED_EVENT);
        jobDetailsConversionFailedLog.setVersionId(VERSION_ID);
        Instance jobDetailsConversionFailedInstance = new Instance();
        jobDetailsConversionFailedInstance.setId(workforcePersonId);
        jobDetailsConversionFailedInstance.setExternalId(workforcePersonExternalId);
        Emails rmEmail = Emails.create();
        rmEmail.setIsDefault(Boolean.TRUE);
        rmEmail.setUsageCode(BUSINESS_USAGE_CODE);
        rmEmail.setAddress("testemail@gmail.com");
        Phones rmPhone = Phones.create();
        rmPhone.setNumber("123456");
        rmPhone.setIsDefault(Boolean.TRUE);
        rmPhone.setUsageCode("usage");
        rmPhone.setCountryCode("CC");
        ProfileDetails rmProfileDetails = ProfileDetails.create();
        rmProfileDetails.setFirstName("FirstName");
        rmProfileDetails.setLastName("LastName");
        rmProfileDetails.setFormalName("FormalName");
        rmProfileDetails.setValidFrom(this.localValidFrom);
        rmProfileDetails.setValidTo(this.localValidTo);
        when(this.conversionService.convert(oneMDSEmail1, Emails.class)).thenReturn(rmEmail);
        when(this.conversionService.convert(oneMDSPhone1, Phones.class)).thenReturn(rmPhone);
        when(this.conversionService.convert(oneMDSProfileDetail1, ProfileDetails.class)).thenReturn(rmProfileDetails);
        jobDetailsConversionFailedInstance.setEmails(Collections.singletonList(oneMDSEmail1));
        jobDetailsConversionFailedInstance.setPhones(Collections.singletonList(oneMDSPhone1));
        jobDetailsConversionFailedInstance.setUserAccount(oneMDSUserAccount1);
        jobDetailsConversionFailedInstance.setProfileDetail(Collections.singletonList(oneMDSProfileDetail1));
        jobDetailsConversionFailedInstance.setWorkAssignments(Collections.singletonList(oneMDSWorkAssignment1));

        jobDetailsConversionFailedLog.setInstance(jobDetailsConversionFailedInstance);
        this.workForcePersonLogs.add(jobDetailsConversionFailedLog);
        when(this.workforcePersonDAO.read(workforcePersonId)).thenReturn(workforcePersons);

		AtomicInteger successRecords = new AtomicInteger(0);
		LogEntry logEntry = new LogEntry();
		logEntry.setStatus(LogEntryStatus.SUCCESS);
		logEntry.setObjectId(INSTANCE_ID);
		logEntry.setObjectVersionId(VERSION_ID);
		logEntry.setLocalId(EXTERNAL_ID);
		logEntry.setObjectType(MDIEntities.WORKFORCE_PERSON.getName());
		logEntry.setErrorCode("");
		logEntry.setErrorMessage("");

		assertEquals(List.of(logEntry), this.classUnderTest.processWorkforceLog(this.workForcePersonLogs,
				CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader, successRecords));
        verify(dataSubject, times(1)).addIdentifier("ID", workforcePersonExternalId);
        verify(dataSubject, times(1)).setType(DATA_SUBJECT_TYPE);
        verify(this.auditLogUtil, times(1)).prepareDataModificationAuditMessage(isNull(), eq(DATA_SUBJECT_TYPE), eq(SERVICE_IDENTIFIER), eq(UPDATE_OPERATION), anyMap(),
                anyMap(), any(AuditedDataSubject.class));
        verify(dataModificationAuditMessage, times(1)).logSuccess();
    }

	@Test
    @DisplayName("test prepareDataModificationAuditMessageForUpdate with some personal data as null")
    public void testPrepareDataModificationAuditMessageForUpdateWithNullEntries()
            throws AuditLogNotAvailableException, AuditLogWriteException {
        Mockito.doReturn(dataSubject).when(auditLogMessageFactory).createAuditedDataSubject();
        when(this.auditLogUtil.prepareDataModificationAuditMessage(any(), any(), any(), any(), any(), any(), any()))
                .thenReturn(dataModificationAuditMessage);

        String workforcePersonId = INSTANCE_ID;
        String workforcePersonExternalId = EXTERNAL_ID;
        Emails actualEmail1 = Emails.create();
        actualEmail1.setIsDefault(Boolean.TRUE);
        actualEmail1.setUsageCode(BUSINESS_USAGE_CODE);
        actualEmail1.setAddress("testemail@gmail.com");
        List<Emails> emails = new ArrayList<>();
        emails.add(actualEmail1);
        Phones actualPhone1 = Phones.create();
        actualPhone1.setIsDefault(null);
        actualPhone1.setCountryCode(null);
        actualPhone1.setUsageCode(null);
        actualPhone1.setNumber(null);
        List<Phones> phones = new ArrayList<>();
        phones.add(actualPhone1);
        ProfileDetails actualProfileDetails1 = ProfileDetails.create();
        actualProfileDetails1.setFirstName(null);
        actualProfileDetails1.setLastName(null);
        actualProfileDetails1.setFormalName(null);
        List<ProfileDetails> profileDetails = new ArrayList<>();
        profileDetails.add(actualProfileDetails1);

        WorkforcePersons workforcePersons = WorkforcePersons.create();
        workforcePersons.setId(workforcePersonId);
        workforcePersons.setExternalID(workforcePersonExternalId);
        workforcePersons.setEmails(emails);
        workforcePersons.setPhones(phones);
        workforcePersons.setProfileDetails(profileDetails);

        Log jobDetailsConversionFailedLog = new Log();
        jobDetailsConversionFailedLog.setEvent(UPDATED_EVENT);
        jobDetailsConversionFailedLog.setVersionId(VERSION_ID);
        Instance jobDetailsConversionFailedInstance = new Instance();
        jobDetailsConversionFailedInstance.setId(workforcePersonId);
        jobDetailsConversionFailedInstance.setExternalId(workforcePersonExternalId);

        Emails rmEmail = Emails.create();
        rmEmail.setIsDefault(Boolean.TRUE);
        rmEmail.setUsageCode(BUSINESS_USAGE_CODE);
        rmEmail.setAddress("testemail1@gmail.com");
        Phones rmPhone = Phones.create();
        rmPhone.setIsDefault(null);
        rmPhone.setCountryCode(null);
        rmPhone.setUsageCode(null);
        rmPhone.setNumber(null);
        ProfileDetails rmProfileDetails = ProfileDetails.create();
        rmProfileDetails.setFirstName(null);
        rmProfileDetails.setLastName(null);
        rmProfileDetails.setFormalName(null);

        when(this.conversionService.convert(oneMDSEmail1, Emails.class)).thenReturn(rmEmail);
        when(this.conversionService.convert(oneMDSPhone1, Phones.class)).thenReturn(rmPhone);
        when(this.conversionService.convert(oneMDSProfileDetail1, ProfileDetails.class)).thenReturn(rmProfileDetails);

        jobDetailsConversionFailedInstance.setEmails(Collections.singletonList(oneMDSEmail1));
        jobDetailsConversionFailedInstance.setPhones(Collections.singletonList(oneMDSPhone1));
        jobDetailsConversionFailedInstance.setUserAccount(oneMDSUserAccount1);
        jobDetailsConversionFailedInstance.setProfileDetail(Collections.singletonList(oneMDSProfileDetail1));
        jobDetailsConversionFailedInstance.setWorkAssignments(Collections.singletonList(oneMDSWorkAssignment1));

        jobDetailsConversionFailedLog.setInstance(jobDetailsConversionFailedInstance);
        this.workForcePersonLogs.add(jobDetailsConversionFailedLog);
        when(this.workforcePersonDAO.read(workforcePersonId)).thenReturn(workforcePersons);
		AtomicInteger successRecords = new AtomicInteger(0);
		LogEntry logEntry = new LogEntry();
		logEntry.setStatus(LogEntryStatus.SUCCESS);
		logEntry.setObjectId(INSTANCE_ID);
		logEntry.setObjectVersionId(VERSION_ID);
		logEntry.setLocalId(EXTERNAL_ID);
		logEntry.setObjectType(MDIEntities.WORKFORCE_PERSON.getName());
		logEntry.setErrorCode("");
		logEntry.setErrorMessage("");

		assertEquals(List.of(logEntry), this.classUnderTest.processWorkforceLog(this.workForcePersonLogs,
				CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader, successRecords));
        verify(dataSubject, times(1)).addIdentifier("ID", workforcePersonExternalId);
        verify(dataSubject, times(1)).setType(DATA_SUBJECT_TYPE);
        verify(this.auditLogUtil, times(1)).prepareDataModificationAuditMessage(isNull(), eq(DATA_SUBJECT_TYPE), eq(SERVICE_IDENTIFIER), eq(UPDATE_OPERATION), anyMap(),
                anyMap(), any(AuditedDataSubject.class));
        verify(dataModificationAuditMessage, times(1)).logSuccess();
    }

	@Test
    @DisplayName("test if setDataModificationAuditMessageToFailure is called when there is an exception")
    public void setDataModificationAuditMessageToFailureOnException() {
        Mockito.doReturn(dataSubject).when(auditLogMessageFactory).createAuditedDataSubject();
        when(this.auditLogUtil.prepareDataModificationAuditMessage(any(), any(), any(), any(), any(), any(), any()))
                .thenReturn(dataModificationAuditMessage);
	ReplicationException exception = new ReplicationException(new Exception(), ReplicationErrorCodes.CONFLICT);
	doThrow(exception).when(this.workforceReplicationDAO).save(any(), any(), any(), any(), any(), any());
        Log jobDetailsConversionFailedLog = new Log();
        jobDetailsConversionFailedLog.setEvent(CREATED_EVENT);
        jobDetailsConversionFailedLog.setVersionId(VERSION_ID);
        Instance jobDetailsConversionFailedInstance = new Instance();
        jobDetailsConversionFailedInstance.setId(INSTANCE_ID);
        jobDetailsConversionFailedInstance.setExternalId(EXTERNAL_ID);
        Emails rmEmail = Emails.create();
        rmEmail.setIsDefault(Boolean.TRUE);
        rmEmail.setUsageCode(BUSINESS_USAGE_CODE);
        rmEmail.setAddress("testemail@gmail.com");
        Phones rmPhone = Phones.create();
        rmPhone.setNumber("123456");
        rmPhone.setIsDefault(Boolean.TRUE);
        ProfileDetails rmProfileDetails = ProfileDetails.create();
        rmProfileDetails.setFirstName("FirstName");
        rmProfileDetails.setLastName("LastName");
        rmProfileDetails.setFormalName("FormalName");
        rmProfileDetails.setValidFrom(this.localValidFrom);
        rmProfileDetails.setValidTo(this.localValidTo);
        when(this.conversionService.convert(oneMDSEmail1, Emails.class)).thenReturn(rmEmail);
        when(this.conversionService.convert(oneMDSPhone1, Phones.class)).thenReturn(rmPhone);
        when(this.conversionService.convert(oneMDSProfileDetail1, ProfileDetails.class)).thenReturn(rmProfileDetails);
        jobDetailsConversionFailedInstance.setEmails(Collections.singletonList(oneMDSEmail1));
        jobDetailsConversionFailedInstance.setPhones(Collections.singletonList(oneMDSPhone1));
        jobDetailsConversionFailedInstance.setUserAccount(oneMDSUserAccount1);
        jobDetailsConversionFailedInstance.setProfileDetail(Collections.singletonList(oneMDSProfileDetail1));
        jobDetailsConversionFailedInstance.setWorkAssignments(Collections.singletonList(oneMDSWorkAssignment1));

        jobDetailsConversionFailedLog.setInstance(jobDetailsConversionFailedInstance);
        this.workForcePersonLogs.add(jobDetailsConversionFailedLog);
		AtomicInteger successRecords = new AtomicInteger(0);
		LogEntry logEntry = new LogEntry();
		logEntry.setStatus(LogEntryStatus.FAILED);
		logEntry.setObjectId(INSTANCE_ID);
		logEntry.setObjectVersionId(VERSION_ID);
		logEntry.setLocalId(EXTERNAL_ID);
		logEntry.setObjectType(MDIEntities.WORKFORCE_PERSON.getName());
		logEntry.setErrorCode("CONFLICT");
		logEntry.setErrorMessage(null);

		assertEquals(List.of(logEntry), this.classUnderTest.processWorkforceLog(this.workForcePersonLogs,
				CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader, successRecords));
		verify(this.auditLogUtil, times(1)).setDataModificationAuditMessageToFailure(dataModificationAuditMessage);
    }
}
