package com.sap.c4p.rm.processor.costcenter;

import static com.sap.c4p.rm.TestConstants.CONSUMER_SUB_DOMAIN;
import static com.sap.c4p.rm.TestConstants.CREATED_EVENT;
import static com.sap.c4p.rm.TestConstants.EXCLUDED_EVENT;
import static com.sap.c4p.rm.TestConstants.INCLUDED_EVENT;
import static com.sap.c4p.rm.TestConstants.INSTANCE_ID;
import static com.sap.c4p.rm.TestConstants.OTHER_EVENT;
import static com.sap.c4p.rm.TestConstants.UPDATED_EVENT;
import static com.sap.c4p.rm.TestConstants.VALID_FROM_DATE;
import static com.sap.c4p.rm.TestConstants.VALID_TO_DATE;
import static com.sap.c4p.rm.TestConstants.VERSION_ID;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionFailedException;
import org.springframework.core.convert.ConversionService;

import com.sap.c4p.rm.InitMocks;
import com.sap.c4p.rm.calm.CalmService;
import com.sap.c4p.rm.calm.CalmUtil;
import com.sap.c4p.rm.calm.models.LogEntry;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;
import com.sap.c4p.rm.exceptions.ReplicationException;
import com.sap.c4p.rm.processor.costcenter.dao.CostCenterReplicationDAOImpl;
import com.sap.c4p.rm.processor.costcenter.dto.Attribute;
import com.sap.c4p.rm.processor.costcenter.dto.Content;
import com.sap.c4p.rm.processor.costcenter.dto.Description;
import com.sap.c4p.rm.processor.costcenter.dto.Instance;
import com.sap.c4p.rm.processor.costcenter.dto.IsValid;
import com.sap.c4p.rm.processor.costcenter.dto.LocalIdS4;
import com.sap.c4p.rm.processor.costcenter.dto.Log;
import com.sap.c4p.rm.processor.costcenter.dto.Name;
import com.sap.c4p.rm.replicationdao.ReplicationFailureDAOImpl;
import com.sap.c4p.rm.utils.CommonUtilityImpl;
import com.sap.c4p.rm.utils.StringFormatter;
import com.sap.resourcemanagement.organization.CostCenterAttributes;
import com.sap.resourcemanagement.organization.CostCenterValidity;
import com.sap.resourcemanagement.organization.CostCenters;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;

public class CostCenterMDILogAPIProcessorTest extends InitMocks {

    private final Logger logger = (Logger) LoggerFactory.getLogger(CostCenterMDILogAPIProcessor.class);

    private static final String COST_CENTER_DISPLAY_NAME = "CC display name";
    private static final String COMPANY_CODE = "companyCode";
    private static final String CONTROLLING_AREA = "controllingArea";
    private static final String COST_CENTER_ID = "costCenterID";
    private static final String LOGICAL_SYSTEM = "logicalSystem";
    private static final String NAME = "test name";
    private static final String DESCRIPTION = "test description";
    private static final String LANGUAGE = "en";

    private List<Log> costCenterLogs;
    private ListAppender<ILoggingEvent> listAppender;

    @Mock
    CostCenterReplicationDAOImpl costCenterReplicationDAO;

    @Mock
    ReplicationFailureDAOImpl replicationFailureDAO;

    @Mock
    ConversionService mockConversionService;

    @Mock
    ConversionFailedException conversionFailedException;

    @Mock
    JobSchedulerRunHeader jobSchedulerRunHeader;

    @Mock
    CommonUtilityImpl commonUtility;

	@Mock
	CalmService calmService;

    @Autowired
    @InjectMocks
    private CostCenterMDILogAPIProcessor classUnderTest;

    @BeforeEach
    public void setUp() {
        this.costCenterLogs = new ArrayList<>();
        this.listAppender = new ListAppender<>();
        this.listAppender.start();
        logger.addAppender(listAppender);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate localValidFrom = LocalDate.parse(VALID_FROM_DATE, formatter);
        when(this.commonUtility.toLocalDate(VALID_FROM_DATE)).thenReturn(localValidFrom);
        LocalDate localValidTo = LocalDate.parse(VALID_TO_DATE, formatter);
        when(this.commonUtility.toLocalDate(VALID_FROM_DATE)).thenReturn(localValidTo);
    }

	@Test
    @DisplayName("test processCostCenterLog with empty list of Logs")
    public void testProcessCostCenterLogWithEmptyListOfLogs() {
		assertEquals(Collections.emptyList(), this.classUnderTest.processCostCenterLog(this.costCenterLogs,
				CONSUMER_SUB_DOMAIN,
				jobSchedulerRunHeader, new AtomicInteger(0)));
		List<ILoggingEvent> logsList = listAppender.list;
		assertEquals(0, logsList.size());
    }

	@Test
    @DisplayName("test processCostCenterLog having Logs with no instance")
    public void testProcessCostCenterLogHavingLogsWithNoInstance() {
        this.costCenterLogs.addAll(
                Stream.of(CREATED_EVENT, UPDATED_EVENT, INCLUDED_EVENT, EXCLUDED_EVENT, OTHER_EVENT).map(event -> {
                    Log logEvent = new Log();
                    logEvent.setEvent(event);
                    logEvent.setVersionId(VERSION_ID);
                    return logEvent;
                }).collect(Collectors.toList()));
        List<LogEntry> logEntries = new ArrayList<LogEntry>();
		costCenterLogs.forEach(log -> logEntries.add(CalmUtil.preparecostCenterLogEntry(log, "", "")));

		AtomicInteger successRecords = new AtomicInteger(0);

		assertEquals(logEntries, this.classUnderTest.processCostCenterLog(this.costCenterLogs, CONSUMER_SUB_DOMAIN,
                jobSchedulerRunHeader, successRecords));
		assertEquals(5, successRecords.get());
		List<ILoggingEvent> logsList = listAppender.list;
		assertEquals(1, logsList.size());
		ILoggingEvent debugLog = logsList.get(0);
		assertEquals(StringFormatter.format("Skipping {0} event", OTHER_EVENT), debugLog.getFormattedMessage());
		assertEquals(Level.INFO, debugLog.getLevel());
    }

	@Test
    @DisplayName("test processCostCenterLog with Log event as excluded.")
    public void testProcessCostCenterLogWithLogEventAsExcluded() {
        Log excludeLog = new Log();
        excludeLog.setEvent(EXCLUDED_EVENT);
        excludeLog.setVersionId(VERSION_ID);
        Instance instance = new Instance();
        instance.setId(INSTANCE_ID);
		LocalIdS4 localIdS4 = new LocalIdS4();
		localIdS4.setCostCenterId("costCenterID");
		instance.setLocalIdS4(localIdS4);
        excludeLog.setInstance(instance);
        this.costCenterLogs.add(excludeLog);
        CostCenters costCenters = CostCenters.create();
        costCenters.setId(INSTANCE_ID);
        costCenters.setIsExcluded(Boolean.TRUE);
		LogEntry logEntry = CalmUtil.preparecostCenterLogEntry(excludeLog, "", "");
		AtomicInteger successRecords = new AtomicInteger(0);
		assertEquals(List.of(logEntry), this.classUnderTest.processCostCenterLog(this.costCenterLogs,
				CONSUMER_SUB_DOMAIN,
				jobSchedulerRunHeader, successRecords));
		assertEquals(1, successRecords.get());
        verify(this.costCenterReplicationDAO, times(0)).save(costCenters);
		List<ILoggingEvent> logsList = listAppender.list;
		assertEquals(1, logsList.size());
		ILoggingEvent infoLog = logsList.get(0);
		assertEquals(StringFormatter.format(
				"Processing instance record with the event={0}, versionId={1} and instance.id={2}", EXCLUDED_EVENT,
				VERSION_ID, INSTANCE_ID), infoLog.getFormattedMessage());
		assertEquals(Level.INFO, infoLog.getLevel());
    }

	@Test
    @DisplayName("test processCostCenterLog with event having no instanceId")
    public void testProcessCostCenterLogWithEventHavingNoInstanceId() {
        Instance instance = new Instance();
		LocalIdS4 localIdS4 = new LocalIdS4();
		localIdS4.setCostCenterId("costCenterID");
		instance.setLocalIdS4(localIdS4);
        Log createdLog = new Log();
        createdLog.setEvent(CREATED_EVENT);
        createdLog.setVersionId(VERSION_ID);
        createdLog.setInstance(instance);
        this.costCenterLogs.add(createdLog);
		LogEntry logEntry = CalmUtil.preparecostCenterLogEntry(createdLog, "DOES_NOT_HAVE_MANDATORY", null);
		AtomicInteger successRecords = new AtomicInteger(0);
		assertEquals(List.of(logEntry), this.classUnderTest.processCostCenterLog(this.costCenterLogs,
				CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader, successRecords));
		assertEquals(0, successRecords.get());
        verify(this.replicationFailureDAO, times(1)).saveCostCenterReplicationFailure(any(Marker.class),
                any(ReplicationException.class), any(Log.class), anyString(), any(JobSchedulerRunHeader.class));
		List<ILoggingEvent> logsList = listAppender.list;
		assertEquals(2, logsList.size());
		ILoggingEvent infoLog = logsList.get(0);
		assertEquals(StringFormatter.format(
				"Processing instance record with the event={0}, versionId={1} and instance.id={2}", CREATED_EVENT,
				VERSION_ID, null), infoLog.getFormattedMessage());
		assertEquals(Level.INFO, infoLog.getLevel());
    }

	@Test
    @DisplayName("test processCostCenterLog with event having no s4Assign details and conversion failed")
    public void testProcessCostCenterLogWithEventHavingNoS4AssignDetailsAndConversionFailed() {
        Log createdLog = new Log();
        createdLog.setEvent(CREATED_EVENT);
        Instance instance = new Instance();
        instance.setId(INSTANCE_ID);
        LocalIdS4 localIdS4 = new LocalIdS4();
        instance.setLocalIdS4(localIdS4);
        createdLog.setInstance(instance);
        Attribute attribute = new Attribute();
        when(this.mockConversionService.convert(attribute, CostCenterAttributes.class))
                .thenThrow(conversionFailedException);
        instance.setAttributes(Collections.singletonList(attribute));
        IsValid isValid = new IsValid();
        when(this.mockConversionService.convert(isValid, CostCenterValidity.class))
                .thenThrow(conversionFailedException);
        instance.setIsValid(Collections.singletonList(isValid));
        createdLog.setInstance(instance);
        this.costCenterLogs.add(createdLog);
		LogEntry logEntry = CalmUtil.preparecostCenterLogEntry(createdLog, "", "");
		AtomicInteger successRecords = new AtomicInteger(0);
		assertEquals(List.of(logEntry), this.classUnderTest.processCostCenterLog(this.costCenterLogs,
				CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader, successRecords));
		assertEquals(1, successRecords.get());
        verify(this.costCenterReplicationDAO, times(1)).save(any(CostCenters.class));
    }

	@Test
    @DisplayName("test processCostCenterLog with event having no s4Assign details and conversion returned null")
    public void testProcessCostCenterLogWithEventHavingNoS4AssignDetailsAndConversionReturnedNull() {
        Log createdLog = new Log();
        createdLog.setEvent(CREATED_EVENT);
        Instance instance = new Instance();
        instance.setId(INSTANCE_ID);
        LocalIdS4 localIdS4 = new LocalIdS4();
        instance.setLocalIdS4(localIdS4);
        createdLog.setInstance(instance);
        Attribute attribute = new Attribute();
        when(this.mockConversionService.convert(attribute, CostCenterAttributes.class)).thenReturn(null);
        instance.setAttributes(Collections.singletonList(attribute));
        IsValid isValid = new IsValid();
        when(this.mockConversionService.convert(isValid, CostCenterValidity.class)).thenReturn(null);
        instance.setIsValid(Collections.singletonList(isValid));
        createdLog.setInstance(instance);
        this.costCenterLogs.add(createdLog);
		LogEntry logEntry = CalmUtil.preparecostCenterLogEntry(createdLog, "", "");
		AtomicInteger successRecords = new AtomicInteger(0);
		assertEquals(List.of(logEntry), this.classUnderTest.processCostCenterLog(this.costCenterLogs,
				CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader, successRecords));
		assertEquals(1, successRecords.get());
        verify(this.costCenterReplicationDAO, times(1)).save(any(CostCenters.class));
    }

	@Test
    @DisplayName("test processCostCenterLog with Log event as created")
    public void testProcessCostCenterLogWithCreatedEvent() {
        Instance instance = new Instance();
        instance.setId(INSTANCE_ID);
        instance.setDisplayName(COST_CENTER_DISPLAY_NAME);
        IsValid isValid = new IsValid();
        isValid.setValidFrom(VALID_FROM_DATE);
        isValid.setValidTo(VALID_TO_DATE);
        isValid.setContent(true);
        instance.setIsValid(Collections.singletonList(isValid));
        LocalIdS4 localIdS4 = new LocalIdS4();
        localIdS4.setCompanyCode(COMPANY_CODE);
        localIdS4.setControllingArea(CONTROLLING_AREA);
        localIdS4.setCostCenterId(COST_CENTER_ID);
        localIdS4.setLogicalSystem(LOGICAL_SYSTEM);
        instance.setLocalIdS4(localIdS4);
        Attribute attributes = new Attribute();
        attributes.setValidFrom(VALID_FROM_DATE);
        attributes.setValidTo(VALID_TO_DATE);
        Description description = new Description();
        description.setLang(LANGUAGE);
        description.setContent(DESCRIPTION);
        Name name = new Name();
        name.setLang(LANGUAGE);
        name.setContent(NAME);
        Content content = new Content();
        content.setDescription(Collections.singletonList(description));
        content.setName(Collections.singletonList(name));
        attributes.setContent(content);
        instance.setAttributes(Collections.singletonList(attributes));
        Log log = new Log();
        log.setInstance(instance);
        log.setEvent(CREATED_EVENT);
        log.setVersionId(VERSION_ID);
        this.costCenterLogs.add(log);
        CostCenterValidity costCenterValidity = CostCenterValidity.create();
        costCenterValidity.setValidFrom(this.commonUtility.toLocalDate(VALID_FROM_DATE));
        costCenterValidity.setValidTo(this.commonUtility.toLocalDate(VALID_TO_DATE));
        when(this.mockConversionService.convert(any(IsValid.class), any())).thenReturn(costCenterValidity);
        CostCenterAttributes costCenterAttributes = CostCenterAttributes.create();
        costCenterAttributes.setName(NAME);
        costCenterAttributes.setDescription(DESCRIPTION);
        costCenterAttributes.setParent(INSTANCE_ID);
        when(this.mockConversionService.convert(any(Attribute.class), any())).thenReturn(costCenterAttributes);
		LogEntry logEntry = CalmUtil.preparecostCenterLogEntry(log, "", "");
		AtomicInteger successRecords = new AtomicInteger(0);
		assertEquals(List.of(logEntry), this.classUnderTest.processCostCenterLog(this.costCenterLogs,
				CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader, successRecords));
		assertEquals(1, successRecords.get());
        verify(this.costCenterReplicationDAO, times(1)).save(any(CostCenters.class));
    }

	@Test
    @DisplayName("test processCostCenterLog with Log event as update event")
    public void testProcessCostCenterLogUpdatedEvent() {
        Instance instance = new Instance();
        instance.setId(INSTANCE_ID);
        instance.setDisplayName(COST_CENTER_DISPLAY_NAME);
        IsValid isValid = new IsValid();
        isValid.setValidFrom(VALID_FROM_DATE);
        isValid.setValidTo(VALID_TO_DATE);
        isValid.setContent(true);
        instance.setIsValid(Collections.singletonList(isValid));
        LocalIdS4 localIdS4 = new LocalIdS4();
        localIdS4.setCompanyCode(COMPANY_CODE);
        localIdS4.setControllingArea(CONTROLLING_AREA);
        localIdS4.setCostCenterId(COST_CENTER_ID);
        localIdS4.setLogicalSystem(LOGICAL_SYSTEM);
        instance.setLocalIdS4(localIdS4);
        Attribute attributes = new Attribute();
        attributes.setValidFrom(VALID_FROM_DATE);
        attributes.setValidTo(VALID_TO_DATE);
        Description description = new Description();
        description.setLang(LANGUAGE);
        description.setContent(DESCRIPTION);
        Name name = new Name();
        name.setLang(LANGUAGE);
        name.setContent(NAME);
        Content content = new Content();
        content.setDescription(Collections.singletonList(description));
        content.setName(Collections.singletonList(name));
        attributes.setContent(content);
        instance.setAttributes(Collections.singletonList(attributes));
        Log log = new Log();
        log.setInstance(instance);
        log.setEvent(UPDATED_EVENT);
        log.setVersionId(VERSION_ID);
        this.costCenterLogs.add(log);
        CostCenterValidity costCenterValidity = CostCenterValidity.create();
        costCenterValidity.setValidFrom(this.commonUtility.toLocalDate(VALID_FROM_DATE));
        costCenterValidity.setValidTo(this.commonUtility.toLocalDate(VALID_TO_DATE));
        when(this.mockConversionService.convert(any(IsValid.class), any())).thenReturn(costCenterValidity);
        CostCenterAttributes costCenterAttributes = CostCenterAttributes.create();
        costCenterAttributes.setName(NAME);
        costCenterAttributes.setDescription(DESCRIPTION);
        costCenterAttributes.setParent(INSTANCE_ID);
        when(this.mockConversionService.convert(any(Attribute.class), any())).thenReturn(costCenterAttributes);
		LogEntry logEntry = CalmUtil.preparecostCenterLogEntry(log, "", "");
		AtomicInteger successRecords = new AtomicInteger(0);
		assertEquals(List.of(logEntry), this.classUnderTest.processCostCenterLog(this.costCenterLogs,
				CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader, successRecords));
		assertEquals(1, successRecords.get());
    }

}
