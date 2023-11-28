package com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import com.sap.c4p.rm.skill.mdiintegration.InitMocks;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;
import com.sap.c4p.rm.skill.mdiintegration.exceptions.ReplicationException;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dao.WorkForceProficiencyDAO;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dao.WorkforceProficiencyReplicationDAO;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dto.*;
import com.sap.c4p.rm.skill.mdiintegration.replicationdao.ReplicationFailureDAOImpl;
import com.sap.c4p.rm.skill.mdiintegration.utils.CommonUtility;
import com.sap.c4p.rm.skill.mdiintegration.utils.LanguageContent;
import com.sap.c4p.rm.skill.mdiintegration.utils.StringFormatter;
import com.sap.cds.Result;
import com.sap.cds.Row;
import com.sap.cds.services.persistence.PersistenceService;
import com.sap.resourcemanagement.skill.ProficiencyLevels;
import com.sap.resourcemanagement.skill.ProficiencySets;
import com.sap.resourcemanagement.skill.integration.ReplicationFailures;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionFailedException;
import org.springframework.core.convert.ConversionService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static com.sap.c4p.rm.skill.mdiintegration.TestConstants.*;
import static com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.WorkforceCapabilityMDIEventsAPIProcessor.STATUS_ACTIVE;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

public class WorkforceProficiencyScaleMDIEventsAPIProcessorTest extends InitMocks {

  private final Logger logger = (Logger) LoggerFactory.getLogger(WorkforceProficiencyScaleMDIEventsAPIProcessor.class);

  private ListAppender<ILoggingEvent> listAppender;

  private List<ProficiencyValue> workforcecapabilityProfLogs;

  @Mock
  WorkforceCapabilityProficiency workforceCapabilityProficiency;

  @Mock
  ProficiencySets proficiencySets;

  @Mock
  PersistenceService persistenceService;

  @Mock
  Result result;

  @Mock
  Row row;

  @Mock
  LanguageContent languageContent;

  @Mock
  CommonUtility commonUtility;

  @Mock
  ConversionService conversionService;

  @Mock
  ConversionFailedException conversionFailedException;

  @Mock
  JobSchedulerRunHeader jobSchedulerRunHeader;

  @Mock
  ReplicationFailureDAOImpl replicationFailureDAO;

  @Mock
  WorkForceProficiencyDAO workForceProficiencyDAO;

  @Mock
  WorkforceProficiencyReplicationDAO workforceProficiencyReplicationDAO;

  @Autowired
  @InjectMocks
  private WorkforceProficiencyScaleMDIEventsAPIProcessor classUnderTest;

  @BeforeEach
  void setUp() {
    this.workforcecapabilityProfLogs = new ArrayList<>();
    this.listAppender = new ListAppender<>();
    this.listAppender.start();
    logger.addAppender(listAppender);
  }

  @Test
  @DisplayName("test processWorkforceCapabilityProf with empty list of Logs")
  public void testProcessWorkforceCapabilityProfLogWithEmptyListOfLogs() {
    assertEquals(0, this.classUnderTest.processWorkforceCapabilityProfScaleLog(this.workforcecapabilityProfLogs,
        CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader));
    List<ILoggingEvent> logsList = listAppender.list;
    assertEquals(0, logsList.size());
  }

  @Test
  @DisplayName("test processWorkforceCapabilityProf having Logs with no instance")
  public void testProcessWorkforceCapabilityProfLogHavingLogsWithNoInstanceWithCreateEvent() {
    this.workforcecapabilityProfLogs.addAll(Stream.of(CREATED_EVENT, UPDATED_EVENT, OTHER_EVENT).map(event -> {
      ProficiencyValue logEvent = new ProficiencyValue();
      logEvent.setEvent(event);
      logEvent.setVersionId(VERSION_ID);
      return logEvent;
    }).collect(Collectors.toList()));

    assertEquals(3, this.classUnderTest.processWorkforceCapabilityProfScaleLog(this.workforcecapabilityProfLogs,
        CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader));
    List<ILoggingEvent> logsList = listAppender.list;
    assertEquals(1, logsList.size());
    ILoggingEvent debugLog = logsList.get(0);
    assertEquals(StringFormatter.format("Skipping {0} event", OTHER_EVENT), debugLog.getFormattedMessage());
    assertEquals(Level.INFO, debugLog.getLevel());
  }

  @Test
  @DisplayName("test processWorkforceCapabilityProfLog with mandatory data missing.")
  public void testProcessWorkforceCapabilityProfLogWithMandatoryDataMissing() {
    ProficiencyValue instanceIDMissing = new ProficiencyValue();
    instanceIDMissing.setEvent(CREATED_EVENT);
    instanceIDMissing.setVersionId(VERSION_ID);
    WorkforceCapabilityProficiencyScale workforceCapabilityProficiencyScaleinstanceMissing = new WorkforceCapabilityProficiencyScale();
    instanceIDMissing.setInstance(workforceCapabilityProficiencyScaleinstanceMissing);
    this.workforcecapabilityProfLogs.add(instanceIDMissing);

    WorkforceCapabilityProficiencyScaleStatusCodes statusCodes = new WorkforceCapabilityProficiencyScaleStatusCodes();
    statusCodes.setCode(STATUS_ACTIVE);
    workforceCapabilityProficiencyScaleinstanceMissing.setStatus(statusCodes);

    ProficiencyValue profLevelMissing = new ProficiencyValue();
    profLevelMissing.setEvent(UPDATED_EVENT);
    profLevelMissing.setVersionId(VERSION_ID);
    WorkforceCapabilityProficiencyScale workforceCapabilityProficiencyScaleMissing = new WorkforceCapabilityProficiencyScale();
    workforceCapabilityProficiencyScaleMissing.setId(UUID.randomUUID().toString());

    WorkforceCapabilityProficiencyScaleStatusCodes statusCodes2 = new WorkforceCapabilityProficiencyScaleStatusCodes();
    statusCodes2.setCode(STATUS_ACTIVE);
    workforceCapabilityProficiencyScaleMissing.setStatus(statusCodes2);

    when(commonUtility.getContentByPredicate(anyList(), any())).thenReturn(Optional.of(languageContent));

    List<Name> nameList = new ArrayList<>();
    Name name1 = new Name();
    name1.setLang("en");
    name1.setContent("Proficiency Set");
    nameList.add(name1);
    workforceCapabilityProficiencyScaleMissing.setName(nameList);

    List<Description> desList = new ArrayList<>();
    Description des1 = new Description();
    des1.setLang("en");
    des1.setContent("Proficiency Description Set");
    desList.add(des1);
    workforceCapabilityProficiencyScaleMissing.setDescription(desList);

    profLevelMissing.setInstance(workforceCapabilityProficiencyScaleMissing);
    this.workforcecapabilityProfLogs.add(profLevelMissing);

    // Ideally should be zero, but no checks are in place for missing ID;

    assertEquals(0, this.classUnderTest.processWorkforceCapabilityProfScaleLog(this.workforcecapabilityProfLogs,
        CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader));

    verify(this.replicationFailureDAO, times(2)).saveWorkforceCapabilityProfScaleReplicationFailure(any(Marker.class),
        any(ReplicationException.class), any(ProficiencyValue.class), anyString(), any(JobSchedulerRunHeader.class));
  }

  @Test
  @DisplayName("test process workforce proficiency with Log event as created")
  public void testProcessWorkForceProficiencyLogWithCreatedEvent() {
    WorkforceCapabilityProficiencyScale instance = new WorkforceCapabilityProficiencyScale();
    instance.setId(UUID.randomUUID().toString());

    WorkforceCapabilityProficiencyScaleStatusCodes statusCodes = new WorkforceCapabilityProficiencyScaleStatusCodes();
    statusCodes.setCode(STATUS_ACTIVE);
    instance.setStatus(statusCodes);

    List<Name> nameList = new ArrayList<>();
    Name name1 = new Name();
    name1.setLang("en");
    name1.setContent("Proficiency Set");
    nameList.add(name1);
    instance.setName(nameList);

    List<Description> desList = new ArrayList<>();
    Description des1 = new Description();
    des1.setLang("en");
    des1.setContent("Proficiency Description Set");
    desList.add(des1);
    instance.setDescription(desList);

    List<WorkforceCapabilityProficiency> profLevel = new ArrayList<>();
    WorkforceCapabilityProficiency wProficiency = new WorkforceCapabilityProficiency();
    wProficiency.setId(UUID.randomUUID().toString());
    wProficiency.setLevel(1);
    wProficiency.setName(nameList);
    wProficiency.setDescription(desList);
    profLevel.add(wProficiency);
    instance.setProficiencyLevel(profLevel);

    ProficiencyValue log = new ProficiencyValue();
    log.setInstance(instance);
    log.setEvent(CREATED_EVENT);
    log.setVersionId(VERSION_ID);
    this.workforcecapabilityProfLogs.add(log);

    when((conversionService.convert(ArgumentMatchers.any(WorkforceCapabilityProficiency.class),
        Mockito.eq(ProficiencyLevels.class)))).thenAnswer(invocation -> {
          ProficiencyLevels profLevels = ProficiencyLevels.create();
          profLevels.setId(UUID.randomUUID().toString());
          profLevels.setName(name1.getContent());
          profLevels.setDescription(des1.getContent());
          profLevels.setProficiencySetId(instance.getId());
          return profLevels;
        });

    assertEquals(1, this.classUnderTest.processWorkforceCapabilityProfScaleLog(this.workforcecapabilityProfLogs,
        CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader));

    verify(this.workforceProficiencyReplicationDAO, times(1)).save(any(ProficiencySets.class),
        any(ReplicationFailures.class));
    verify(this.replicationFailureDAO, times(0)).saveWorkforceCapabilityProfScaleReplicationFailure(any(Marker.class),
        any(ReplicationException.class), any(ProficiencyValue.class), anyString(), any(JobSchedulerRunHeader.class));
  }

  @Test
  @DisplayName("test if mandatory exception is thrown when rank is empty")
  public void testProfLevelRankMandatoryException() {
    WorkforceCapabilityProficiencyScale instance = new WorkforceCapabilityProficiencyScale();
    instance.setId(UUID.randomUUID().toString());

    WorkforceCapabilityProficiencyScaleStatusCodes statusCodes = new WorkforceCapabilityProficiencyScaleStatusCodes();
    statusCodes.setCode(STATUS_ACTIVE);
    instance.setStatus(statusCodes);

    List<Name> nameList = new ArrayList<>();
    Name name1 = new Name();
    name1.setLang("en");
    name1.setContent("Proficiency Set");
    nameList.add(name1);
    instance.setName(nameList);

    List<Description> desList = new ArrayList<>();
    Description des1 = new Description();
    des1.setLang("en");
    des1.setContent("Proficiency Description Set");
    desList.add(des1);
    instance.setDescription(desList);

    List<WorkforceCapabilityProficiency> profLevel = new ArrayList<>();
    WorkforceCapabilityProficiency wProficiency = new WorkforceCapabilityProficiency();
    wProficiency.setId(UUID.randomUUID().toString());
    wProficiency.setName(nameList);
    wProficiency.setDescription(desList);
    profLevel.add(wProficiency);
    instance.setProficiencyLevel(profLevel);

    ProficiencyValue log = new ProficiencyValue();
    log.setInstance(instance);
    log.setEvent(CREATED_EVENT);
    log.setVersionId(VERSION_ID);
    this.workforcecapabilityProfLogs.add(log);

    when((conversionService.convert(ArgumentMatchers.any(WorkforceCapabilityProficiency.class),
        Mockito.eq(ProficiencyLevels.class)))).thenAnswer(invocation -> {
          ProficiencyLevels profLevels = ProficiencyLevels.create();
          profLevels.setId(UUID.randomUUID().toString());
          profLevels.setName(name1.getContent());
          profLevels.setDescription(des1.getContent());
          profLevels.setProficiencySetId(instance.getId());
          return profLevels;
        });

    assertEquals(0, this.classUnderTest.processWorkforceCapabilityProfScaleLog(this.workforcecapabilityProfLogs,
        CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader));

    verify(this.replicationFailureDAO, times(1)).saveWorkforceCapabilityProfScaleReplicationFailure(any(Marker.class),
        any(ReplicationException.class), any(ProficiencyValue.class), anyString(), any(JobSchedulerRunHeader.class));
  }

  @Test
  @DisplayName("test if mandatory exception is thrown when proficiency level ID is empty")
  public void testProfLevelIDMandatoryException() {
    WorkforceCapabilityProficiencyScale instance = new WorkforceCapabilityProficiencyScale();
    instance.setId(UUID.randomUUID().toString());

    WorkforceCapabilityProficiencyScaleStatusCodes statusCodes = new WorkforceCapabilityProficiencyScaleStatusCodes();
    statusCodes.setCode(STATUS_ACTIVE);
    instance.setStatus(statusCodes);

    List<Name> nameList = new ArrayList<>();
    Name name1 = new Name();
    name1.setLang("en");
    name1.setContent("Proficiency Set");
    nameList.add(name1);
    instance.setName(nameList);

    List<Description> desList = new ArrayList<>();
    Description des1 = new Description();
    des1.setLang("en");
    des1.setContent("Proficiency Description Set");
    desList.add(des1);
    instance.setDescription(desList);

    List<WorkforceCapabilityProficiency> profLevel = new ArrayList<>();
    WorkforceCapabilityProficiency wProficiency = new WorkforceCapabilityProficiency();
    wProficiency.setLevel(1);
    wProficiency.setName(nameList);
    wProficiency.setDescription(desList);
    profLevel.add(wProficiency);
    instance.setProficiencyLevel(profLevel);

    ProficiencyValue log = new ProficiencyValue();
    log.setInstance(instance);
    log.setEvent(CREATED_EVENT);
    log.setVersionId(VERSION_ID);
    this.workforcecapabilityProfLogs.add(log);

    when((conversionService.convert(ArgumentMatchers.any(WorkforceCapabilityProficiency.class),
        Mockito.eq(ProficiencyLevels.class)))).thenAnswer(invocation -> {
          ProficiencyLevels profLevels = ProficiencyLevels.create();
          profLevels.setId(UUID.randomUUID().toString());
          profLevels.setName(name1.getContent());
          profLevels.setDescription(des1.getContent());
          profLevels.setProficiencySetId(instance.getId());
          return profLevels;
        });

    assertEquals(0, this.classUnderTest.processWorkforceCapabilityProfScaleLog(this.workforcecapabilityProfLogs,
        CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader));

    verify(this.replicationFailureDAO, times(1)).saveWorkforceCapabilityProfScaleReplicationFailure(any(Marker.class),
        any(ReplicationException.class), any(ProficiencyValue.class), anyString(), any(JobSchedulerRunHeader.class));
  }

  @Test
  @DisplayName("test process workforce proficiency with Log event as update event")
  public void testProcessWorkForceProficiencyLogUpdatedEvent() {
    WorkforceCapabilityProficiencyScale instance = new WorkforceCapabilityProficiencyScale();
    instance.setId(UUID.randomUUID().toString());

    WorkforceCapabilityProficiencyScaleStatusCodes statusCodes = new WorkforceCapabilityProficiencyScaleStatusCodes();
    statusCodes.setCode(STATUS_ACTIVE);
    instance.setStatus(statusCodes);

    List<Name> nameList = new ArrayList<>();
    Name name1 = new Name();
    name1.setLang("en");
    name1.setContent("Proficiency Set");
    nameList.add(name1);
    instance.setName(nameList);

    List<Description> desList = new ArrayList<>();
    Description des1 = new Description();
    des1.setLang("en");
    des1.setContent("Proficiency Description Set");
    desList.add(des1);
    instance.setDescription(desList);

    List<WorkforceCapabilityProficiency> profLevel = new ArrayList<>();
    WorkforceCapabilityProficiency wProficiency = new WorkforceCapabilityProficiency();
    wProficiency.setId(UUID.randomUUID().toString());
    wProficiency.setLevel(1);
    wProficiency.setName(nameList);
    wProficiency.setDescription(desList);
    profLevel.add(wProficiency);
    instance.setProficiencyLevel(profLevel);

    ProficiencyValue log = new ProficiencyValue();
    log.setInstance(instance);
    log.setEvent(UPDATED_EVENT);
    log.setVersionId(VERSION_ID);
    this.workforcecapabilityProfLogs.add(log);

    ProficiencyLevels profLevels = ProficiencyLevels.create();
    profLevels.setId(UUID.randomUUID().toString());
    profLevels.setName(name1.getContent());
    profLevels.setDescription(des1.getContent());

    when((conversionService.convert(ArgumentMatchers.any(WorkforceCapabilityProficiency.class),
        Mockito.eq(ProficiencyLevels.class)))).thenAnswer(invocation -> {
          ProficiencyLevels profLevels1 = ProficiencyLevels.create();
          profLevels1.setId(UUID.randomUUID().toString());
          profLevels1.setName(name1.getContent());
          profLevels1.setDescription(des1.getContent());
          profLevels1.setProficiencySetId(instance.getId());
          return profLevels1;
        });

    when(workForceProficiencyDAO.getExistingProfSet(Mockito.anyString())).thenAnswer(invocation -> {
      Row mockRow = mock(Row.class);
      when(mockRow.get(ProficiencySets.ID)).thenReturn(instance.getId());
      return mockRow;
    });
    assertEquals(1, this.classUnderTest.processWorkforceCapabilityProfScaleLog(this.workforcecapabilityProfLogs,
        CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader));

    verify(workforceProficiencyReplicationDAO).update(any(ProficiencySets.class), any(ReplicationFailures.class));
    verify(workforceProficiencyReplicationDAO, never()).save(any(ProficiencySets.class),
        any(ReplicationFailures.class));

    verify(this.replicationFailureDAO, times(0)).saveWorkforceCapabilityProfScaleReplicationFailure(any(Marker.class),
        any(ReplicationException.class), any(ProficiencyValue.class), anyString(), any(JobSchedulerRunHeader.class));
  }

  @Test
  @DisplayName("test processWorkforceCapabilityProfScaleLog with Log event as Conversion returns null")
  public void testProcessWorkForceCapabilityProfScaleLogConversionNull() {
    WorkforceCapabilityProficiencyScale instance = new WorkforceCapabilityProficiencyScale();
    instance.setId(UUID.randomUUID().toString());

    WorkforceCapabilityProficiencyScaleStatusCodes statusCodes = new WorkforceCapabilityProficiencyScaleStatusCodes();
    statusCodes.setCode(STATUS_ACTIVE);
    instance.setStatus(statusCodes);

    List<Name> nameList = new ArrayList<>();
    Name name1 = new Name();
    name1.setLang("en");
    name1.setContent("Proficiency Set");
    nameList.add(name1);
    instance.setName(nameList);

    List<Description> desList = new ArrayList<>();
    Description des1 = new Description();
    des1.setLang("en");
    des1.setContent("Proficiency Description Set");
    desList.add(des1);
    instance.setDescription(desList);

    List<WorkforceCapabilityProficiency> profLevel = new ArrayList<>();
    WorkforceCapabilityProficiency wProficiency = new WorkforceCapabilityProficiency();
    wProficiency.setId(UUID.randomUUID().toString());
    wProficiency.setLevel(1);
    wProficiency.setName(nameList);
    wProficiency.setDescription(desList);
    profLevel.add(wProficiency);
    instance.setProficiencyLevel(profLevel);

    ProficiencyValue log = new ProficiencyValue();
    log.setInstance(instance);
    log.setEvent(UPDATED_EVENT);
    log.setVersionId(VERSION_ID);
    this.workforcecapabilityProfLogs.add(log);

    when(conversionService.convert(workforceCapabilityProficiency, ProficiencyLevels.class)).thenReturn(null);

    assertEquals(1, this.classUnderTest.processWorkforceCapabilityProfScaleLog(this.workforcecapabilityProfLogs,
        CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader));

    verify(this.replicationFailureDAO, times(0)).saveWorkforceCapabilityProfScaleReplicationFailure(any(Marker.class),
        any(ReplicationException.class), any(ProficiencyValue.class), anyString(), any(JobSchedulerRunHeader.class));
  }
}
