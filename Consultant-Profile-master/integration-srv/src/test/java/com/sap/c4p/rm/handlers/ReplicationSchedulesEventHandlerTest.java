package com.sap.c4p.rm.handlers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.slf4j.Marker;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.context.support.ResourceBundleMessageSource;

import com.sap.cds.Row;
import com.sap.cds.Struct;
import com.sap.cds.feature.xsuaa.XsuaaUserInfo;
import com.sap.cds.ql.impl.SelectBuilder;
import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.cds.CdsReadEventContext;
import com.sap.cds.services.messages.Messages;

import com.sap.c4p.rm.InitMocks;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerInfo;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerSchedule;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.service.JobSchedulerSymbols;
import com.sap.c4p.rm.config.LoggingMarker;
import com.sap.c4p.rm.gen.MessageKeys;
import com.sap.c4p.rm.replicationdao.OneMDSReplicationDeltaTokenDAO;
import com.sap.c4p.rm.replicationschedules.ReplicationSchedulesService;
import com.sap.c4p.rm.utils.CqnAnalyzerUtil;
import com.sap.c4p.rm.utils.StringFormatter;

import replicationscheduleservice.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
public class ReplicationSchedulesEventHandlerTest extends InitMocks {
    private static final Marker LOGGING_MARKER = LoggingMarker.REPLICATION_SCHEDULES.getMarker();

    @Mock
    CqnAnalyzerUtil mockCqnAnalyzerUtil;

    MessageSource mockMessageSource;

    @Mock
    OneMDSReplicationDeltaTokenDAO mockOneMDSReplicationDeltaTokenDAO;

    @Mock
    ReplicationSchedulesService mockReplicationSchedulesService;

    @Mock
    XsuaaUserInfo mockXsuaaUserInfo;

    ReplicationSchedulesEventHandler classUnderTest;

    @BeforeEach
    public void setUp() {
        ResourceBundleMessageSource source = new ResourceBundleMessageSource();
        source.setBasenames("i18n/i18n");
        mockMessageSource = source;
        when(mockXsuaaUserInfo.getSubDomain()).thenReturn("rm-valiant");
        this.classUnderTest = new ReplicationSchedulesEventHandler(mockCqnAnalyzerUtil, mockMessageSource,
                mockOneMDSReplicationDeltaTokenDAO, mockReplicationSchedulesService, mockXsuaaUserInfo);
    }

    @Test
    @DisplayName("Verify if onReadReplicationSchedules returns ReplicationSchedules when a query to read all schedules is invoked")
    void onReadReplicationSchedulesTestQueryAll() {
        JobSchedulerSchedule schedule1 = new JobSchedulerSchedule();
        schedule1.setJobId("job-id");
        schedule1.setScheduleId("schedule-id");
        schedule1.setJobName("job-name_CS");
        schedule1.setDescription("Schedule to trigger the initial cost center data replication from the MDI system.");
        schedule1.setType("one-time");
        schedule1.setActive(Boolean.FALSE);
        schedule1.setTime("2020-11-12T06:40:53Z");

        CdsReadEventContext mockReadContext = CdsReadEventContext.create(ReplicationSchedule_.CDS_NAME);
        mockReadContext.setCqn(SelectBuilder.from(ReplicationSchedule_.class));
        when(this.mockReplicationSchedulesService.fetchJobSchedules()).thenReturn(Collections.singletonList(schedule1));
        classUnderTest.onReadReplicationSchedules(mockReadContext);
        Optional<Row> context = mockReadContext.getResult().first();
        assert context.isPresent();
        Row row = context.get();
        verify(this.mockReplicationSchedulesService, times(1)).fetchJobSchedules();
        assertEquals(Boolean.TRUE, mockReadContext.isCompleted());
        assertEquals(1, mockReadContext.getResult().rowCount());
        assertEquals("Cost Center", row.get(ReplicationSchedule.REPLICATION_OBJECT));
        assertEquals(Boolean.TRUE, row.get(ReplicationSchedule.IS_INACTIVE));
        assertEquals(Boolean.TRUE, row.get(ReplicationSchedule.IS_ONE_TIME));
    }
    
    @Test
    @DisplayName("Verify if onReadReplicationSchedules returns ReplicationSchedules when a query to read all schedules is invoked")
    void onReadReplicationSchedulesTestQueryAllLongDescription() {
        JobSchedulerSchedule schedule1 = new JobSchedulerSchedule();
        schedule1.setJobId("job-id");
        schedule1.setScheduleId("schedule-id");
        schedule1.setJobName("job-name_CS");
        schedule1.setDescription("Schedule to trigger the initial cost center data replication from the MDI system, this is a long text to test description length");
        schedule1.setType("one-time");
        schedule1.setActive(Boolean.FALSE);
        schedule1.setTime("2020-11-12T06:40:53Z");

        CdsReadEventContext mockReadContext = CdsReadEventContext.create(ReplicationSchedule_.CDS_NAME);
        mockReadContext.setCqn(SelectBuilder.from(ReplicationSchedule_.class));
        when(this.mockReplicationSchedulesService.fetchJobSchedules()).thenReturn(Collections.singletonList(schedule1));
        classUnderTest.onReadReplicationSchedules(mockReadContext);
        Optional<Row> context = mockReadContext.getResult().first();
        assert context.isPresent();
        Row row = context.get();
        verify(this.mockReplicationSchedulesService, times(1)).fetchJobSchedules();
        assertEquals(Boolean.TRUE, mockReadContext.isCompleted());
        assertEquals(1, mockReadContext.getResult().rowCount());
        assertEquals("Cost Center", row.get(ReplicationSchedule.REPLICATION_OBJECT));
        assertEquals(Boolean.TRUE, row.get(ReplicationSchedule.IS_INACTIVE));
        assertEquals(Boolean.TRUE, row.get(ReplicationSchedule.IS_ONE_TIME));
    }

    @Test
    @DisplayName("Verify if onReadReplicationSchedules returns no ReplicationSchedules when jobscheduler returns empty list")
    void onReadReplicationSchedulesTestQueryAllEmptyResponse() {
        JobSchedulerSchedule schedule1 = new JobSchedulerSchedule();
        schedule1.setJobId("job-id");
        schedule1.setScheduleId("schedule-id");
        schedule1.setJobName("job-name_CS");
        schedule1.setDescription("Schedule to trigger the initial cost center data replication from the MDI system.");
        schedule1.setType("one-time");
        schedule1.setActive(Boolean.FALSE);
        schedule1.setTime("2020-11-12T06:40:53Z");

        CdsReadEventContext mockReadContext = CdsReadEventContext.create(ReplicationSchedule_.CDS_NAME);
        mockReadContext.setCqn(SelectBuilder.from(ReplicationSchedule_.class));
        when(this.mockReplicationSchedulesService.fetchJobSchedules()).thenReturn(new ArrayList<>());
        classUnderTest.onReadReplicationSchedules(mockReadContext);
        verify(this.mockReplicationSchedulesService, times(1)).fetchJobSchedules();
        assertEquals(Boolean.TRUE, mockReadContext.isCompleted());
        assertEquals(0, mockReadContext.getResult().rowCount());
    }

    @Test
    @DisplayName("Verify if onDeactivate for a schedule deactivates ReplicationSchedule when invoked")
    void onDeactivateScheduleSuccessful() {
        Map<String, Object> keys = new HashMap<>();
        keys.put(ReplicationSchedule.JOB_ID, "job-id");
        keys.put(ReplicationSchedule.SCHEDULE_ID, "schedule-id");
        keys.put(ReplicationSchedule.JOB_NAME, "job-name_CS");
        final DeactivateContext mockContext = mock(DeactivateContext.class);
        final Messages mockMessages = mock(Messages.class);
        JobSchedulerSchedule schedule1 = new JobSchedulerSchedule();
        schedule1.setJobId("job-id");
        schedule1.setScheduleId("schedule-id");
        schedule1.setJobName("job-name_CS");
        schedule1.setDescription("Schedule to trigger the initial cost center data replication from the MDI system.");
        schedule1.setType("one-time");
        schedule1.setActive(Boolean.FALSE);
        schedule1.setTime("2020-11-12T06:40:53Z");
        when(this.mockReplicationSchedulesService.deactivateJobSchedule(schedule1.getJobId(),
                schedule1.getScheduleId())).thenReturn(schedule1);
        when(this.mockReplicationSchedulesService.fetchJobSchedule(schedule1.getJobId(), schedule1.getScheduleId(),
                "rm-valiant")).thenReturn(schedule1);
        when(this.mockCqnAnalyzerUtil.getTargetKeyForDectivateContext(mockContext)).thenReturn(keys);
        when(mockContext.getMessages()).thenReturn(mockMessages);
        classUnderTest.onDeactivate(mockContext);
        ReplicationSchedule resultSchedule = Struct.create(ReplicationSchedule.class);
        verify(this.mockReplicationSchedulesService, times(1)).deactivateJobSchedule(schedule1.getJobId(),
                schedule1.getScheduleId());
        resultSchedule.setReplicationObject("Cost Center");
        resultSchedule.setJobName("job-name_CS");
        resultSchedule.setJobID("job-id");
        resultSchedule.setScheduleID("schedule-id");
        resultSchedule.setScheduleStatusLabel("Inactive");
        resultSchedule
                .setDescription("Schedule to trigger the initial cost center data replication from the MDI system.");
        resultSchedule.setScheduleStatusCriticality(2);
        resultSchedule.setPattern("One-time");
        resultSchedule.setNextRun(null);
        resultSchedule.setIsActive(Boolean.FALSE);
        resultSchedule.setIsInactive(Boolean.TRUE);
        resultSchedule.setIsOneTime(Boolean.TRUE);
        resultSchedule.setIsRecurring(Boolean.FALSE);
        verify(mockContext).setResult(resultSchedule);
        verify(mockMessages).success(eq(MessageKeys.DEACTIVATED_SUCCESS), any());
        verify(mockContext).setCompleted();

    }

    @Test
    @DisplayName("Verify if onDeactivate for a schedule deactivates ReplicationSchedule when invoked - null response")
    void onDeactivateScheduleNullResponse() {
        Map<String, Object> keys = new HashMap<>();
        keys.put(ReplicationSchedule.JOB_ID, "job-id");
        keys.put(ReplicationSchedule.SCHEDULE_ID, "schedule-id");
        keys.put(ReplicationSchedule.JOB_NAME, "job-name_CS");
        DeactivateContext mockDeactivateContext = DeactivateContext.create(ReplicationSchedule_.CDS_NAME);
        when(this.mockReplicationSchedulesService.deactivateJobSchedule("job-id", "schedule-id")).thenReturn(null);
        when(this.mockCqnAnalyzerUtil.getTargetKeyForDectivateContext(mockDeactivateContext)).thenReturn(keys);
        classUnderTest.onDeactivate(mockDeactivateContext);
        verify(this.mockReplicationSchedulesService, times(1)).deactivateJobSchedule("job-id", "schedule-id");
        assertEquals(Boolean.TRUE, mockDeactivateContext.isCompleted());
        assertNull(mockDeactivateContext.getResult());
    }

    @Test
    @DisplayName("Verify if onEditSchedule for a schedule edits next run of a ReplicationSchedule when invoked")
    void onEditScheduleEditNextRun() {
        Map<String, Object> keys = new HashMap<>();
        keys.put(ReplicationSchedule.JOB_ID, "job-id");
        keys.put(ReplicationSchedule.SCHEDULE_ID, "schedule-id");
        keys.put(ReplicationSchedule.JOB_NAME, "job-name_CS");
        final EditScheduleContext mockContext = mock(EditScheduleContext.class);
        final Messages mockMessages = mock(Messages.class);
        Instant now = Instant.now().plusSeconds(30);
        when(this.mockCqnAnalyzerUtil.getTargetKeyForEditScheduleContext(mockContext)).thenReturn(keys);
        JobSchedulerSchedule schedule1 = new JobSchedulerSchedule();
        schedule1.setJobId("job-id");
        schedule1.setScheduleId("schedule-id");
        schedule1.setJobName("job-name_CS");
        schedule1.setDescription("Schedule to trigger the initial cost center data replication from the MDI system.");
        schedule1.setType("one-time");
        schedule1.setActive(Boolean.FALSE);
        schedule1.setTime("2020-11-12T06:40:53Z");
        when(this.mockReplicationSchedulesService.fetchJobSchedule(schedule1.getJobId(), schedule1.getScheduleId(),
                "rm-valiant")).thenReturn(schedule1);
        when(this.mockReplicationSchedulesService.updateJobScheduleTime(schedule1.getJobId(), schedule1.getScheduleId(),
                now)).thenReturn(schedule1);
        when(mockContext.getNextRun()).thenReturn(now);
        when(mockContext.getMessages()).thenReturn(mockMessages);
        classUnderTest.onEditSchedule(mockContext);
        ReplicationSchedule resultSchedule = Struct.create(ReplicationSchedule.class);
        verify(this.mockReplicationSchedulesService, times(1)).updateJobScheduleTime(schedule1.getJobId(),
                schedule1.getScheduleId(), now);
        resultSchedule.setReplicationObject("Cost Center");
        resultSchedule.setJobName("job-name_CS");
        resultSchedule.setJobID("job-id");
        resultSchedule.setScheduleID("schedule-id");
        resultSchedule.setScheduleStatusLabel("Inactive");
        resultSchedule
                .setDescription("Schedule to trigger the initial cost center data replication from the MDI system.");
        resultSchedule.setScheduleStatusCriticality(2);
        resultSchedule.setPattern("One-time");
        resultSchedule.setIsActive(Boolean.FALSE);
        resultSchedule.setIsInactive(Boolean.TRUE);
        resultSchedule.setIsOneTime(Boolean.TRUE);
        resultSchedule.setIsRecurring(Boolean.FALSE);
        resultSchedule.setNextRun(now.truncatedTo(ChronoUnit.SECONDS));
        verify(mockContext).setResult(resultSchedule);
        verify(mockMessages).success(eq(MessageKeys.ACTIVATED_SUCCESS), any());
        verify(mockContext).setCompleted();
    }

    @Test
    @DisplayName("Verify if onEditSchedule for a schedule edits next run of a ReplicationSchedule when invoked - Null response on update")
    void onEditScheduleEditNextRunNullResponse() {
        Map<String, Object> keys = new HashMap<>();
        keys.put(ReplicationSchedule.JOB_ID, "job-id");
        keys.put(ReplicationSchedule.SCHEDULE_ID, "schedule-id");
        keys.put(ReplicationSchedule.JOB_NAME, "job-name_CS");
        EditScheduleContext context = EditScheduleContext.create(ReplicationSchedule_.CDS_NAME);
        Instant now = Instant.now().plusSeconds(100);
        context.setNextRun(now);
        when(this.mockCqnAnalyzerUtil.getTargetKeyForEditScheduleContext(context)).thenReturn(keys);
        JobSchedulerSchedule schedule1 = new JobSchedulerSchedule();
        schedule1.setJobId("job-id");
        schedule1.setScheduleId("schedule-id");
        schedule1.setJobName("job-name_CS");
        schedule1.setDescription("Schedule to trigger the initial cost center data replication from the MDI system.");
        schedule1.setType("one-time");
        schedule1.setActive(Boolean.FALSE);
        schedule1.setTime("2020-11-12T06:40:53Z");
        when(this.mockReplicationSchedulesService.fetchJobSchedule(schedule1.getJobId(), schedule1.getScheduleId(),
                "rm-valiant")).thenReturn(schedule1);
        when(this.mockReplicationSchedulesService.updateJobScheduleTime(schedule1.getJobId(), schedule1.getScheduleId(),
                now)).thenReturn(null);
        classUnderTest.onEditSchedule(context);
        verify(this.mockReplicationSchedulesService, times(1)).updateJobScheduleTime(schedule1.getJobId(),
                schedule1.getScheduleId(), now);
        assertEquals(Boolean.TRUE, context.isCompleted());
        assertNull(context.getResult());
    }

    @Test
    @DisplayName("Verify if onEditSchedule for a schedule edits next run of a ReplicationSchedule when invoked - Null response on fetch")
    void onEditScheduleEditNextRunNullResponse2() {
        Map<String, Object> keys = new HashMap<>();
        keys.put(ReplicationSchedule.JOB_ID, "job-id");
        keys.put(ReplicationSchedule.SCHEDULE_ID, "schedule-id");
        keys.put(ReplicationSchedule.JOB_NAME, "job-name_CS");
        EditScheduleContext context = EditScheduleContext.create(ReplicationSchedule_.CDS_NAME);
        Instant now = Instant.now();
        context.setNextRun(now);
        when(this.mockCqnAnalyzerUtil.getTargetKeyForEditScheduleContext(context)).thenReturn(keys);
        JobSchedulerSchedule schedule1 = new JobSchedulerSchedule();
        schedule1.setJobId("job-id");
        schedule1.setScheduleId("schedule-id");
        schedule1.setJobName("job-name_CS");
        schedule1.setDescription("Schedule to trigger the initial cost center data replication from the MDI system.");
        schedule1.setType("one-time");
        schedule1.setActive(Boolean.FALSE);
        schedule1.setTime("2020-11-12T06:40:53Z");
        when(this.mockReplicationSchedulesService.fetchJobSchedule(schedule1.getJobId(), schedule1.getScheduleId(),
                "rm-valiant")).thenReturn(null);
        classUnderTest.onEditSchedule(context);
        verify(this.mockReplicationSchedulesService, times(0)).updateJobScheduleTime(schedule1.getJobId(),
                schedule1.getScheduleId(), now);
        assertEquals(Boolean.TRUE, context.isCompleted());
        assertNull(context.getResult());
    }

    @Test
    @DisplayName("Verify if onEditSchedule for a schedule edits repeat interval of a ReplicationSchedule when invoked")
    void onEditScheduleEditRepeatInterval() {
        final Messages mockMessages = mock(Messages.class);
        Map<String, Object> keys = new HashMap<>();
        keys.put(ReplicationSchedule.JOB_ID, "job-id");
        keys.put(ReplicationSchedule.SCHEDULE_ID, "schedule-id");
        keys.put(ReplicationSchedule.JOB_NAME, "job-name_CS");
        final EditScheduleContext mockContext = mock(EditScheduleContext.class);
        when(this.mockCqnAnalyzerUtil.getTargetKeyForEditScheduleContext(mockContext)).thenReturn(keys);
        JobSchedulerSchedule schedule1 = new JobSchedulerSchedule();
        schedule1.setJobId("job-id");
        schedule1.setScheduleId("schedule-id");
        schedule1.setJobName("job-name_CS");
        schedule1.setDescription("Schedule to trigger the initial cost center data replication from the MDI system.");
        schedule1.setType("recurring");
        schedule1.setActive(Boolean.TRUE);
        schedule1.setRepeatInterval("30 minutes");
        Instant now = Instant.now();
        when(this.mockReplicationSchedulesService.fetchJobSchedule(schedule1.getJobId(), schedule1.getScheduleId(),
                "rm-valiant")).thenReturn(schedule1);
        when(this.mockReplicationSchedulesService.updateJobScheduleRepeatInterval(schedule1.getJobId(),
                schedule1.getScheduleId(), 30)).thenReturn(schedule1);
        when(mockContext.getMessages()).thenReturn(mockMessages);
        when(mockContext.getInterval()).thenReturn(30);

        classUnderTest.onEditSchedule(mockContext);
        ReplicationSchedule resultSchedule = Struct.create(ReplicationSchedule.class);
        verify(this.mockReplicationSchedulesService, times(1)).updateJobScheduleRepeatInterval(schedule1.getJobId(),
                schedule1.getScheduleId(), 30);
        resultSchedule.setReplicationObject("Cost Center");
        resultSchedule.setJobName("job-name_CS");
        resultSchedule.setJobID("job-id");
        resultSchedule.setScheduleID("schedule-id");
        resultSchedule.setScheduleStatusLabel("Active");
        resultSchedule.setPatternValue(30);
        resultSchedule.setPattern("Recurring - 30 minutes");
        resultSchedule
                .setDescription("Schedule to trigger the periodic cost center data replication from the MDI system.");
        resultSchedule.setScheduleStatusCriticality(3);
        resultSchedule.setIsActive(Boolean.TRUE);
        resultSchedule.setIsInactive(Boolean.FALSE);
        resultSchedule.setIsOneTime(Boolean.FALSE);
        resultSchedule.setIsRecurring(Boolean.TRUE);
        resultSchedule.setNextRun(now.plusSeconds((30 * 60) + 1).truncatedTo(ChronoUnit.SECONDS));
        verify(mockContext).setResult(resultSchedule);
        verify(mockMessages).success(eq(MessageKeys.ACTIVATED_SUCCESS), any());
        verify(mockContext).setCompleted();
    }

    @Test
    @DisplayName("Verify if onEditSchedule for a schedule throws an exception when the repeat interval is a negative value")
    void onEditScheduleEditRepeatIntervalNegativeValue() {
        Map<String, Object> keys = new HashMap<>();
        keys.put(ReplicationSchedule.JOB_ID, "job-id");
        keys.put(ReplicationSchedule.SCHEDULE_ID, "schedule-id");
        keys.put(ReplicationSchedule.JOB_NAME, "job-name_CS");
        JobSchedulerSchedule schedule1 = new JobSchedulerSchedule();
        schedule1.setJobId("job-id");
        schedule1.setScheduleId("schedule-id");
        schedule1.setJobName("job-name_CS");
        schedule1.setDescription("Schedule to trigger the initial cost center data replication from the MDI system.");
        schedule1.setType("recurring");
        schedule1.setActive(Boolean.FALSE);
        schedule1.setTime("2020-11-12T06:40:53Z");
        EditScheduleContext context = EditScheduleContext.create(ReplicationSchedule_.CDS_NAME);
        context.setInterval(-30);
        when(this.mockReplicationSchedulesService.fetchJobSchedule(schedule1.getJobId(), schedule1.getScheduleId(),
                "rm-valiant")).thenReturn(schedule1);
        when(this.mockCqnAnalyzerUtil.getTargetKeyForEditScheduleContext(context)).thenReturn(keys);
        ServiceException exception = assertThrows(ServiceException.class, () -> classUnderTest.onEditSchedule(context));
        assertEquals(ErrorStatuses.BAD_REQUEST, exception.getErrorStatus());
        assertEquals(
                mockMessageSource.getMessage(MessageKeys.INTERVAL_VALUE_ERROR, null, LocaleContextHolder.getLocale()),
                exception.getMessage());
        verify(this.mockReplicationSchedulesService, times(0)).updateJobScheduleRepeatInterval(schedule1.getJobId(),
                schedule1.getScheduleId(), -30);
    }

    @Test
    @DisplayName("Verify if onEditSchedule for a schedule throws an exception when the repeat interval is a value greater then 1440")
    void onEditScheduleEditRepeatIntervalValueGreaterThanLimit() {
        Map<String, Object> keys = new HashMap<>();
        keys.put(ReplicationSchedule.JOB_ID, "job-id");
        keys.put(ReplicationSchedule.SCHEDULE_ID, "schedule-id");
        keys.put(ReplicationSchedule.JOB_NAME, "job-name_CS");
        JobSchedulerSchedule schedule1 = new JobSchedulerSchedule();
        schedule1.setJobId("job-id");
        schedule1.setScheduleId("schedule-id");
        schedule1.setJobName("job-name_CS");
        schedule1.setDescription("Schedule to trigger the initial cost center data replication from the MDI system.");
        schedule1.setType("recurring");
        schedule1.setActive(Boolean.FALSE);
        schedule1.setTime("2020-11-12T06:40:53Z");
        when(this.mockReplicationSchedulesService.fetchJobSchedule(schedule1.getJobId(), schedule1.getScheduleId(),
                "rm-valiant")).thenReturn(schedule1);
        EditScheduleContext context = EditScheduleContext.create(ReplicationSchedule_.CDS_NAME);
        context.setInterval(1441);
        when(this.mockCqnAnalyzerUtil.getTargetKeyForEditScheduleContext(context)).thenReturn(keys);
        ServiceException exception = assertThrows(ServiceException.class, () -> classUnderTest.onEditSchedule(context));
        assertEquals(ErrorStatuses.BAD_REQUEST, exception.getErrorStatus());
        assertEquals(
                mockMessageSource.getMessage(MessageKeys.INTERVAL_VALUE_ERROR, null, LocaleContextHolder.getLocale()),
                exception.getMessage());
        verify(this.mockReplicationSchedulesService, times(0)).updateJobScheduleRepeatInterval(any(), any(), any());
    }

    @Test
    @DisplayName("Verify if onEditSchedule for a schedule throws an exception when the repeat interval is null")
    void onEditScheduleEditRepeatIntervalValueNullValue() {
        Map<String, Object> keys = new HashMap<>();
        keys.put(ReplicationSchedule.JOB_ID, "job-id");
        keys.put(ReplicationSchedule.SCHEDULE_ID, "schedule-id");
        keys.put(ReplicationSchedule.JOB_NAME, "job-name_CS");
        JobSchedulerSchedule schedule1 = new JobSchedulerSchedule();
        schedule1.setJobId("job-id");
        schedule1.setScheduleId("schedule-id");
        schedule1.setJobName("job-name_CS");
        schedule1.setDescription("Schedule to trigger the initial cost center data replication from the MDI system.");
        schedule1.setType("recurring");
        schedule1.setActive(Boolean.FALSE);
        schedule1.setTime("2020-11-12T06:40:53Z");
        when(this.mockReplicationSchedulesService.fetchJobSchedule(schedule1.getJobId(), schedule1.getScheduleId(),
                "rm-valiant")).thenReturn(schedule1);
        EditScheduleContext context = EditScheduleContext.create(ReplicationSchedule_.CDS_NAME);
        context.setInterval(null);
        when(this.mockCqnAnalyzerUtil.getTargetKeyForEditScheduleContext(context)).thenReturn(keys);
        ServiceException exception = assertThrows(ServiceException.class, () -> classUnderTest.onEditSchedule(context));
        assertEquals(ErrorStatuses.BAD_REQUEST, exception.getErrorStatus());
        assertEquals(
                mockMessageSource.getMessage(MessageKeys.INTERVAL_VALUE_NULL, null, LocaleContextHolder.getLocale()),
                exception.getMessage());
        verify(this.mockReplicationSchedulesService, times(0)).updateJobScheduleRepeatInterval(any(), any(), any());
    }

    @Test
    @DisplayName("Verify if onEditSchedule for a schedule throws an exception when next run is null")
    void onEditScheduleEditNextRunNullValue() {
        Map<String, Object> keys = new HashMap<>();
        keys.put(ReplicationSchedule.JOB_ID, "job-id");
        keys.put(ReplicationSchedule.SCHEDULE_ID, "schedule-id");
        keys.put(ReplicationSchedule.JOB_NAME, "job-name_CS");
        EditScheduleContext context = EditScheduleContext.create(ReplicationSchedule_.CDS_NAME);
        context.setNextRun(null);
        when(this.mockCqnAnalyzerUtil.getTargetKeyForEditScheduleContext(context)).thenReturn(keys);
        JobSchedulerSchedule schedule1 = new JobSchedulerSchedule();
        schedule1.setJobId("job-id");
        schedule1.setScheduleId("schedule-id");
        schedule1.setJobName("job-name_CS");
        schedule1.setDescription("Schedule to trigger the initial cost center data replication from the MDI system.");
        schedule1.setType("one-time");
        schedule1.setActive(Boolean.FALSE);
        schedule1.setTime("2020-11-12T06:40:53Z");
        when(this.mockReplicationSchedulesService.fetchJobSchedule(schedule1.getJobId(), schedule1.getScheduleId(),
                "rm-valiant")).thenReturn(schedule1);
        ServiceException exception = assertThrows(ServiceException.class, () -> classUnderTest.onEditSchedule(context));
        assertEquals(ErrorStatuses.BAD_REQUEST, exception.getErrorStatus());
        assertEquals(
                mockMessageSource.getMessage(MessageKeys.NEXT_RUN_VALUE_NULL, null, LocaleContextHolder.getLocale()),
                exception.getMessage());
        verify(this.mockReplicationSchedulesService, times(0)).updateJobScheduleTime(any(), any(), any());
    }

    @Test
    @DisplayName("Verify if onEditSchedule for a schedule throws an exception when next run is in the past")
    void onEditScheduleEditNextRunPastValue() {
        Map<String, Object> keys = new HashMap<>();
        keys.put(ReplicationSchedule.JOB_ID, "job-id");
        keys.put(ReplicationSchedule.SCHEDULE_ID, "schedule-id");
        keys.put(ReplicationSchedule.JOB_NAME, "job-name_CS");
        EditScheduleContext context = EditScheduleContext.create(ReplicationSchedule_.CDS_NAME);
        context.setNextRun(Instant.now().minusSeconds(500));
        when(this.mockCqnAnalyzerUtil.getTargetKeyForEditScheduleContext(context)).thenReturn(keys);
        JobSchedulerSchedule schedule1 = new JobSchedulerSchedule();
        schedule1.setJobId("job-id");
        schedule1.setScheduleId("schedule-id");
        schedule1.setJobName("job-name_CS");
        schedule1.setDescription("Schedule to trigger the initial cost center data replication from the MDI system.");
        schedule1.setType("one-time");
        schedule1.setActive(Boolean.FALSE);
        schedule1.setTime("2020-11-12T06:40:53Z");
        when(this.mockReplicationSchedulesService.fetchJobSchedule(schedule1.getJobId(), schedule1.getScheduleId(),
                "rm-valiant")).thenReturn(schedule1);
        ServiceException exception = assertThrows(ServiceException.class, () -> classUnderTest.onEditSchedule(context));
        assertEquals(ErrorStatuses.BAD_REQUEST, exception.getErrorStatus());
        assertEquals(
                mockMessageSource.getMessage(MessageKeys.NEXT_RUN_VALUE_PAST, null, LocaleContextHolder.getLocale()),
                exception.getMessage());
        verify(this.mockReplicationSchedulesService, times(0)).updateJobScheduleTime(any(), any(), any());
    }

    @Test
    @DisplayName("Verify if onEditSchedule for a schedule edits repeat interval of a ReplicationSchedule when invoked - Null response")
    void onEditScheduleEditRecurrencePatternNullResponse() {
        Map<String, Object> keys = new HashMap<>();
        keys.put(ReplicationSchedule.JOB_ID, "job-id");
        keys.put(ReplicationSchedule.SCHEDULE_ID, "schedule-id");
        keys.put(ReplicationSchedule.JOB_NAME, "job-name_CS");
        EditScheduleContext context = EditScheduleContext.create(ReplicationSchedule_.CDS_NAME);
        context.setInterval(30);
        when(this.mockCqnAnalyzerUtil.getTargetKeyForEditScheduleContext(context)).thenReturn(keys);
        JobSchedulerSchedule schedule1 = new JobSchedulerSchedule();
        schedule1.setJobId("job-id");
        schedule1.setScheduleId("schedule-id");
        schedule1.setJobName("job-name_CS");
        schedule1.setDescription("Schedule to trigger the initial cost center data replication from the MDI system.");
        schedule1.setType("recurring");
        schedule1.setActive(Boolean.FALSE);
        schedule1.setRepeatInterval("15 minutes");
        when(this.mockReplicationSchedulesService.fetchJobSchedule(schedule1.getJobId(), schedule1.getScheduleId(),
                "rm-valiant")).thenReturn(schedule1);
        when(this.mockReplicationSchedulesService.updateJobScheduleRepeatInterval(schedule1.getJobId(),
                schedule1.getScheduleId(), 30)).thenReturn(null);
        classUnderTest.onEditSchedule(context);
        verify(this.mockReplicationSchedulesService, times(1)).updateJobScheduleRepeatInterval(schedule1.getJobId(),
                schedule1.getScheduleId(), 30);
        assertEquals(Boolean.TRUE, context.isCompleted());
    }

    @Test
    @DisplayName("test onIsInitialLoadCandidate")
    public void testOnIsInitialLoadCandidate() {
        IsInitialLoadCandidateContext context = IsInitialLoadCandidateContext.create();
        classUnderTest.onIsInitialLoadCandidate(context);
        verify(this.mockOneMDSReplicationDeltaTokenDAO, times(1)).checkIsInitialLoadCandidate();
    }

    @Test
    @DisplayName("test onSetForInitialLoad with no jobs available")
    public void testOnSetForInitialLoad() {
        SetForInitialLoadContext context = SetForInitialLoadContext.create();
        classUnderTest.onSetForInitialLoad(context);
        verify(this.mockReplicationSchedulesService, times(0)).deactivateAllJobSchedules(anyString());
        verify(this.mockReplicationSchedulesService, times(1)).fetchJobSchedules();
        verify(this.mockOneMDSReplicationDeltaTokenDAO, times(1)).markReplicationForInitialLoad(LOGGING_MARKER);
    }

    @Test
    @DisplayName("test onSetForInitialLoad with jobs and the deactivation fails")
    public void testOnSetForInitialLoadWithJobsAndTheDeactivationFails() {
        SetForInitialLoadContext context = SetForInitialLoadContext.create();
        String tenantId = UUID.randomUUID().toString();
        JobSchedulerInfo jobSchedulerInfo1 = new JobSchedulerInfo();
        String jobId1 = "12345";
        jobSchedulerInfo1.setId(jobId1);
        jobSchedulerInfo1
                .setName(StringFormatter.format("CF_{0}_{1}", JobSchedulerSymbols.COST_CENTER.getSymbol(), tenantId));
        JobSchedulerInfo jobSchedulerInfo2 = new JobSchedulerInfo();
        String jobId2 = "12346";
        jobSchedulerInfo2.setId(jobId2);
        jobSchedulerInfo2.setName(
                StringFormatter.format("CF_{0}_{1}", JobSchedulerSymbols.WORKFORCE_PERSON.getSymbol(), tenantId));
        JobSchedulerInfo jobSchedulerInfo3 = new JobSchedulerInfo();
        String jobId3 = "12347";
        jobSchedulerInfo3.setId(jobId3);
        jobSchedulerInfo3.setName(StringFormatter.format("CF_{0}_{1}", "TD", tenantId));

        when(this.mockReplicationSchedulesService.fetchJobs())
                .thenReturn(Arrays.asList(jobSchedulerInfo1, jobSchedulerInfo2, jobSchedulerInfo3));
        when(this.mockReplicationSchedulesService.deactivateAllJobSchedules(jobId1)).thenReturn(Boolean.FALSE);
        when(this.mockReplicationSchedulesService.deactivateAllJobSchedules(jobId2)).thenReturn(Boolean.FALSE);
        when(this.mockReplicationSchedulesService.deactivateAllJobSchedules(jobId3)).thenReturn(Boolean.FALSE);

        classUnderTest.onSetForInitialLoad(context);

        verify(this.mockReplicationSchedulesService, times(1)).deactivateAllJobSchedules(anyString());
        verify(this.mockReplicationSchedulesService, times(1)).deactivateAllJobSchedules(jobId1);
        verify(this.mockReplicationSchedulesService, times(0)).deactivateAllJobSchedules(jobId2);
        verify(this.mockReplicationSchedulesService, times(0)).deactivateAllJobSchedules(jobId3);
        verify(this.mockReplicationSchedulesService, times(1)).fetchJobSchedules();
        verify(this.mockOneMDSReplicationDeltaTokenDAO, times(0)).markReplicationForInitialLoad(LOGGING_MARKER);
    }

    @Test
    @DisplayName("test onSetForInitialLoad with jobs and the deactivation succeed")
    public void testOnSetForInitialLoadWithJobsAndTheDeactivationSucceed() {
        SetForInitialLoadContext context = SetForInitialLoadContext.create();
        String tenantId = UUID.randomUUID().toString();
        JobSchedulerInfo jobSchedulerInfo1 = new JobSchedulerInfo();
        String jobId1 = "12345";
        jobSchedulerInfo1.setId(jobId1);
        jobSchedulerInfo1
                .setName(StringFormatter.format("CF_{0}_{1}", JobSchedulerSymbols.COST_CENTER.getSymbol(), tenantId));
        JobSchedulerInfo jobSchedulerInfo2 = new JobSchedulerInfo();
        String jobId2 = "12346";
        jobSchedulerInfo2.setId(jobId2);
        jobSchedulerInfo2.setName(
                StringFormatter.format("CF_{0}_{1}", JobSchedulerSymbols.WORKFORCE_PERSON.getSymbol(), tenantId));
        JobSchedulerInfo jobSchedulerInfo3 = new JobSchedulerInfo();
        String jobId3 = "12347";
        jobSchedulerInfo3.setId(jobId3);
        jobSchedulerInfo3.setName(StringFormatter.format("CF_{0}_{1}", "TD", tenantId));

        when(this.mockReplicationSchedulesService.fetchJobs())
                .thenReturn(Arrays.asList(jobSchedulerInfo1, jobSchedulerInfo2, jobSchedulerInfo3));
        when(this.mockReplicationSchedulesService.deactivateAllJobSchedules(jobId1)).thenReturn(Boolean.TRUE);
        when(this.mockReplicationSchedulesService.deactivateAllJobSchedules(jobId2)).thenReturn(Boolean.TRUE);
        when(this.mockReplicationSchedulesService.deactivateAllJobSchedules(jobId3)).thenReturn(Boolean.FALSE);

        classUnderTest.onSetForInitialLoad(context);

        verify(this.mockReplicationSchedulesService, times(2)).deactivateAllJobSchedules(anyString());
        verify(this.mockReplicationSchedulesService, times(1)).deactivateAllJobSchedules(jobId1);
        verify(this.mockReplicationSchedulesService, times(1)).deactivateAllJobSchedules(jobId2);
        verify(this.mockReplicationSchedulesService, times(0)).deactivateAllJobSchedules(jobId3);
        verify(this.mockReplicationSchedulesService, times(1)).fetchJobSchedules();
        verify(this.mockOneMDSReplicationDeltaTokenDAO, times(1)).markReplicationForInitialLoad(LOGGING_MARKER);
    }

}
