package com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability;

import static com.sap.c4p.rm.skill.mdiintegration.TestConstants.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.sap.resourcemanagement.skill.SkillsTexts;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionService;

import com.sap.cds.Result;
import com.sap.cds.Row;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.skill.mdiintegration.InitMocks;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;
import com.sap.c4p.rm.skill.mdiintegration.exceptions.ReplicationException;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dao.WorkforceCapabilityDAO;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dao.WorkforceCapabilityReplicationDAO;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dto.CapabilityValue;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dto.Description;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dto.Name;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dto.WorkforceCapability;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dto.WorkforceCapabilityCatalog;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dto.WorkforceCapabilityCatalogAssignment;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dto.WorkforceCapabilityProficiencyScale;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dto.WorkforceCapabilityStatusCodes;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dto.WorkforceCapabilityTypeCodes;
import com.sap.c4p.rm.skill.mdiintegration.replicationdao.ReplicationFailureDAO;
import com.sap.c4p.rm.skill.mdiintegration.utils.CommonUtility;
import com.sap.c4p.rm.skill.mdiintegration.utils.LanguageContent;
import com.sap.c4p.rm.skill.mdiintegration.utils.StringFormatter;

import com.sap.resourcemanagement.skill.Catalogs;
import com.sap.resourcemanagement.skill.ProficiencySets;
import com.sap.resourcemanagement.skill.Skills;
import com.sap.resourcemanagement.skill.integration.ReplicationFailures;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;

public class WorkforceCapabilityMDIEventsAPIProcessorTest extends InitMocks {

  private final Logger logger = (Logger) LoggerFactory.getLogger(WorkforceCapabilityMDIEventsAPIProcessor.class);

  private static final String CAPABILITY_TYPE_CERTIFICATE = "CERTIFICATE";

  private static final String CAPABILITY_TYPE_SKILL = "SKILL";

  private static final String STATUS_ACTIVE = "ACTIVE";
  private static final String STATUS_INACTIVE = "INACTIVE";

  private ListAppender<ILoggingEvent> listAppender;

  private List<CapabilityValue> workForceCapabilityLogs;

  @Mock
  ReplicationException replicationException;

  @Mock
  Skills skills;

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
  JobSchedulerRunHeader jobSchedulerRunHeader;

  @Mock
  ReplicationFailureDAO replicationFailureDAO;

  @Mock
  WorkforceCapabilityDAO workForceCapabilityDAO;

  @Mock
  WorkforceCapabilityReplicationDAO workforceCapabilityReplicationDAO;

  @Autowired
  @InjectMocks
  private WorkforceCapabilityMDIEventsAPIProcessor classUnderTest;

  @BeforeEach
  void setUp() {
    this.workForceCapabilityLogs = new ArrayList<>();
    this.listAppender = new ListAppender<>();
    this.listAppender.start();
    logger.addAppender(listAppender);
  }

  @Test
  @DisplayName("test processWorkforceCapability with empty list of Logs")
  public void testprocessWorkforceCapabilityLogWithEmptyListOfLogs() {
    assertEquals(0, this.classUnderTest.processWorkforceCapabilityLog(this.workForceCapabilityLogs, CONSUMER_SUB_DOMAIN,
        jobSchedulerRunHeader));
    List<ILoggingEvent> logsList = listAppender.list;
    assertEquals(0, logsList.size());
  }

  @Test
  @DisplayName("test processWorkforceCapability having Logs with no instance")
  public void testprocessWorkforceCapabilityLogHavingLogsWithNoInstanceWithCreateEvent() {
    this.workForceCapabilityLogs.addAll(Stream.of(CREATED_EVENT, UPDATED_EVENT, OTHER_EVENT).map(event -> {
      CapabilityValue logEvent = new CapabilityValue();
      logEvent.setEvent(event);
      logEvent.setVersionId(VERSION_ID);
      return logEvent;
    }).collect(Collectors.toList()));

    assertEquals(3, this.classUnderTest.processWorkforceCapabilityLog(this.workForceCapabilityLogs, CONSUMER_SUB_DOMAIN,
        jobSchedulerRunHeader));
    List<ILoggingEvent> logsList = listAppender.list;
    assertEquals(1, logsList.size());
    ILoggingEvent debugLog = logsList.get(0);
    assertEquals(StringFormatter.format("Skipping {0} event", OTHER_EVENT), debugLog.getFormattedMessage());
    assertEquals(Level.INFO, debugLog.getLevel());
  }

  @Test
  @DisplayName("test processWorkforceCapabilityLog with mandatory data missing.")
  public void testprocessWorkforceCapabilityLogWithMandatoryDataMissing() {
    CapabilityValue instanceIDMissing = new CapabilityValue();
    instanceIDMissing.setEvent(CREATED_EVENT);
    instanceIDMissing.setVersionId(VERSION_ID);
    WorkforceCapability workforcecapabilityMissingInstanceID = new WorkforceCapability();
    instanceIDMissing.setInstance(workforcecapabilityMissingInstanceID);
    this.workForceCapabilityLogs.add(instanceIDMissing);

    assertEquals(0, this.classUnderTest.processWorkforceCapabilityLog(this.workForceCapabilityLogs, CONSUMER_SUB_DOMAIN,
        jobSchedulerRunHeader));

    verify(this.replicationFailureDAO, times(1)).saveWorkforceCapabilityReplicationFailure(any(Marker.class),
        any(ReplicationException.class), any(CapabilityValue.class), anyString(), any(JobSchedulerRunHeader.class));
  }

  @Test
  @DisplayName("test processWorkforceCapabilityLog with unsupported data.")
  public void testprocessWorkforceCapabilityLogWithUnsupportedData() {
    WorkforceCapability unsupportedInstance = new WorkforceCapability();
    unsupportedInstance.setid(UUID.randomUUID().toString());
    WorkforceCapabilityTypeCodes code = new WorkforceCapabilityTypeCodes();
    code.setCode(CAPABILITY_TYPE_CERTIFICATE);
    unsupportedInstance.setCapabilityType(code);

    CapabilityValue value = new CapabilityValue();
    value.setEvent(CREATED_EVENT);
    value.setVersionId(VERSION_ID);
    value.setInstance(unsupportedInstance);
    this.workForceCapabilityLogs.add(value);

    assertEquals(0, this.classUnderTest.processWorkforceCapabilityLog(this.workForceCapabilityLogs, CONSUMER_SUB_DOMAIN,
        jobSchedulerRunHeader));

    verify(this.replicationFailureDAO, times(1)).saveWorkforceCapabilityReplicationFailure(any(Marker.class),
        any(ReplicationException.class), any(CapabilityValue.class), anyString(), any(JobSchedulerRunHeader.class));
  }

  @Test
  @DisplayName("test processWorkforceCapabilityLog with Record not found data - Prof.")
  public void testprocessWorkforceCapabilityLogWithRecordNotFoundDataProf() {
    WorkforceCapability recordNotFoundProfInstance = new WorkforceCapability();
    recordNotFoundProfInstance.setid(UUID.randomUUID().toString());
    WorkforceCapabilityTypeCodes code = new WorkforceCapabilityTypeCodes();
    code.setCode(CAPABILITY_TYPE_SKILL);
    recordNotFoundProfInstance.setCapabilityType(code);
    WorkforceCapabilityStatusCodes statusCodes = new WorkforceCapabilityStatusCodes();
    statusCodes.setCode(STATUS_ACTIVE);
    recordNotFoundProfInstance.setStatus(statusCodes);
    WorkforceCapabilityProficiencyScale workforceCapabilityProficiencyScale = new WorkforceCapabilityProficiencyScale();
    recordNotFoundProfInstance.setProficiencyScale(workforceCapabilityProficiencyScale);

    CapabilityValue value = new CapabilityValue();
    value.setEvent(CREATED_EVENT);
    value.setVersionId(VERSION_ID);
    value.setInstance(recordNotFoundProfInstance);
    this.workForceCapabilityLogs.add(value);

    assertEquals(0, this.classUnderTest.processWorkforceCapabilityLog(this.workForceCapabilityLogs, CONSUMER_SUB_DOMAIN,
        jobSchedulerRunHeader));

    verify(this.replicationFailureDAO, times(1)).saveWorkforceCapabilityReplicationFailure(any(Marker.class),
        any(ReplicationException.class), any(CapabilityValue.class), anyString(), any(JobSchedulerRunHeader.class));
  }

  @Test
  @DisplayName("test processWorkforceCapabilityLog with Record not found data - Catalog.")
  public void testprocessWorkforceCapabilityLogWithRecordNotFoundDataCatalog() {
    WorkforceCapability recordNotFoundCatalogInstance = new WorkforceCapability();
    recordNotFoundCatalogInstance.setid(UUID.randomUUID().toString());
    WorkforceCapabilityTypeCodes code = new WorkforceCapabilityTypeCodes();
    code.setCode(CAPABILITY_TYPE_SKILL);
    recordNotFoundCatalogInstance.setCapabilityType(code);
    WorkforceCapabilityStatusCodes statusCodes = new WorkforceCapabilityStatusCodes();
    statusCodes.setCode(STATUS_INACTIVE);
    recordNotFoundCatalogInstance.setStatus(statusCodes);
    WorkforceCapabilityProficiencyScale workforceCapabilityProficiencyScale = new WorkforceCapabilityProficiencyScale();
    workforceCapabilityProficiencyScale.setID(UUID.randomUUID().toString());
    recordNotFoundCatalogInstance.setProficiencyScale(workforceCapabilityProficiencyScale);

    WorkforceCapabilityCatalog workforceCapabilityCatalog = new WorkforceCapabilityCatalog();
    WorkforceCapabilityCatalogAssignment catalogAssignment = new WorkforceCapabilityCatalogAssignment();
    catalogAssignment.setCatalog(workforceCapabilityCatalog);
    recordNotFoundCatalogInstance.setCatalogAssignment(Collections.singletonList(catalogAssignment));

    Row mockProfSet = mock(Row.class);
    when(workForceCapabilityDAO.getExistingProfID(Mockito.anyString())).thenAnswer(invocation -> {
      when(mockProfSet.get(ProficiencySets.ID)).thenReturn(recordNotFoundCatalogInstance.getProficiencyScale());
      return mockProfSet;
    });

    when((Integer) mockProfSet.get(ProficiencySets.LIFECYCLE_STATUS_CODE)).thenReturn(0);

    CapabilityValue value = new CapabilityValue();
    value.setEvent(CREATED_EVENT);
    value.setVersionId(VERSION_ID);
    value.setInstance(recordNotFoundCatalogInstance);
    this.workForceCapabilityLogs.add(value);

    assertEquals(0, this.classUnderTest.processWorkforceCapabilityLog(this.workForceCapabilityLogs, CONSUMER_SUB_DOMAIN,
        jobSchedulerRunHeader));

    verify(this.replicationFailureDAO, times(1)).saveWorkforceCapabilityReplicationFailure(any(Marker.class),
        any(ReplicationException.class), any(CapabilityValue.class), anyString(), any(JobSchedulerRunHeader.class));
  }

  @Test
  @DisplayName("test process capability with Log event as created")
  public void testProcessWorkforceCapabilityLogCreatedEvent() {
    WorkforceCapability createdInstance = new WorkforceCapability();
    createdInstance.setid(UUID.randomUUID().toString());
    WorkforceCapabilityTypeCodes typeCodes = new WorkforceCapabilityTypeCodes();
    typeCodes.setCode("EXPERTISE");
    createdInstance.setCapabilityType(typeCodes);
    WorkforceCapabilityStatusCodes statusCodes = new WorkforceCapabilityStatusCodes();
    statusCodes.setCode(STATUS_INACTIVE);
    createdInstance.setStatus(statusCodes);

    WorkforceCapabilityCatalog workforceCapabilityCatalog = new WorkforceCapabilityCatalog();
    workforceCapabilityCatalog.setID(UUID.randomUUID().toString());
    WorkforceCapabilityCatalogAssignment catalogAssignment = new WorkforceCapabilityCatalogAssignment();
    catalogAssignment.setCatalog(workforceCapabilityCatalog);
    createdInstance.setCatalogAssignment(Collections.singletonList(catalogAssignment));

    WorkforceCapabilityProficiencyScale workforceCapabilityProficiencyScale = new WorkforceCapabilityProficiencyScale();
    workforceCapabilityProficiencyScale.setID(UUID.randomUUID().toString());
    createdInstance.setProficiencyScale(workforceCapabilityProficiencyScale);

    Row mockProfSet = mock(Row.class);
    when(workForceCapabilityDAO.getExistingProfID(Mockito.anyString())).thenAnswer(invocation -> {
      when(mockProfSet.get(ProficiencySets.ID)).thenReturn(createdInstance.getProficiencyScale());
      return mockProfSet;
    });

    when((Integer) mockProfSet.get(ProficiencySets.LIFECYCLE_STATUS_CODE)).thenReturn(0);

    when(workForceCapabilityDAO.getExistingCatalogID(Mockito.anyString())).thenAnswer(invocation -> {
      Row mockRow = mock(Row.class);
      when(mockRow.get(Catalogs.ID)).thenReturn(createdInstance.getCatalogAssignment().get(0).getCatalog());
      return mockRow;
    });

    List<Name> nameList = new ArrayList<>();
    Name name1 = new Name();
    name1.setLang("en");
    name1.setContent("Skill name");
    nameList.add(name1);
    createdInstance.setName(nameList);

    List<Description> desList = new ArrayList<>();
    Description des1 = new Description();
    des1.setLang("en");
    des1.setContent("Skill Description");
    desList.add(des1);
    createdInstance.setDescription(desList);

    CapabilityValue value = new CapabilityValue();
    value.setInstance(createdInstance);
    value.setEvent(CREATED_EVENT);
    value.setVersionId(VERSION_ID);
    this.workForceCapabilityLogs.add(value);

    assertEquals(1, this.classUnderTest.processWorkforceCapabilityLog(this.workForceCapabilityLogs, CONSUMER_SUB_DOMAIN,
        jobSchedulerRunHeader));
    verify(this.workforceCapabilityReplicationDAO, times(1)).save(any(Skills.class), any(List.class),
        any(ReplicationFailures.class));
  }

  @Test
  @DisplayName("test process capability with Log event as update")
  public void testProcessWorkforceCapabilityLogUpdatedEvent() {
    WorkforceCapability updatedInstance = new WorkforceCapability();
    updatedInstance.setid(UUID.randomUUID().toString());
    WorkforceCapabilityTypeCodes typeCodes = new WorkforceCapabilityTypeCodes();
    typeCodes.setCode(CAPABILITY_TYPE_SKILL);
    updatedInstance.setCapabilityType(typeCodes);
    WorkforceCapabilityStatusCodes statusCodes = new WorkforceCapabilityStatusCodes();
    statusCodes.setCode(STATUS_INACTIVE);
    updatedInstance.setStatus(statusCodes);

    WorkforceCapabilityCatalog workforceCapabilityCatalog = new WorkforceCapabilityCatalog();
    workforceCapabilityCatalog.setID(UUID.randomUUID().toString());
    WorkforceCapabilityCatalogAssignment catalogAssignment = new WorkforceCapabilityCatalogAssignment();
    catalogAssignment.setCatalog(workforceCapabilityCatalog);
    updatedInstance.setCatalogAssignment(Collections.singletonList(catalogAssignment));

    WorkforceCapabilityProficiencyScale workforceCapabilityProficiencyScale = new WorkforceCapabilityProficiencyScale();
    workforceCapabilityProficiencyScale.setID(UUID.randomUUID().toString());
    updatedInstance.setProficiencyScale(workforceCapabilityProficiencyScale);

    when(workForceCapabilityDAO.getExistingSkill(Mockito.anyString())).thenAnswer(invocation -> {
      Row mockRow = mock(Row.class);
      when(mockRow.get(Skills.ID)).thenReturn(updatedInstance.getid());
      return mockRow;
    });

    Row mockProfSet = mock(Row.class);
    when(workForceCapabilityDAO.getExistingProfID(Mockito.anyString())).thenAnswer(invocation -> {
      when(mockProfSet.get(ProficiencySets.ID)).thenReturn(updatedInstance.getProficiencyScale());
      return mockProfSet;
    });

    when((Integer) mockProfSet.get(ProficiencySets.LIFECYCLE_STATUS_CODE)).thenReturn(0);

    when(workForceCapabilityDAO.getExistingCatalogID(Mockito.anyString())).thenAnswer(invocation -> {
      Row mockRow = mock(Row.class);
      when(mockRow.get(Catalogs.ID)).thenReturn(updatedInstance.getCatalogAssignment().get(0).getCatalog());
      return mockRow;
    });

    List<Name> nameList = new ArrayList<>();
    Name name1 = new Name();
    name1.setLang("en");
    name1.setContent("Skill name");
    nameList.add(name1);
    updatedInstance.setName(nameList);

    List<Description> desList = new ArrayList<>();
    Description des1 = new Description();
    des1.setLang("en");
    des1.setContent("Skill Description");
    desList.add(des1);
    updatedInstance.setDescription(desList);

    CapabilityValue value = new CapabilityValue();
    value.setInstance(updatedInstance);
    value.setEvent(CREATED_EVENT);
    value.setVersionId(VERSION_ID);
    this.workForceCapabilityLogs.add(value);

    assertEquals(1, this.classUnderTest.processWorkforceCapabilityLog(this.workForceCapabilityLogs, CONSUMER_SUB_DOMAIN,
        jobSchedulerRunHeader));
    verify(this.workforceCapabilityReplicationDAO, times(0)).save(any(Skills.class), any(List.class),
        any(ReplicationFailures.class));

    verify(this.workforceCapabilityReplicationDAO, times(1)).update(any(Skills.class), any(List.class),
        any(ReplicationFailures.class));
  }

  @Test
  @DisplayName("test process capability with Log event as created - create skills with name and no description")
  public void testProcessWorkforceCapabilityLogCreatedEventOnlyName() {
    WorkforceCapability createdInstance = new WorkforceCapability();
    createdInstance.setid(UUID.randomUUID().toString());
    WorkforceCapabilityTypeCodes typeCodes = new WorkforceCapabilityTypeCodes();
    typeCodes.setCode(CAPABILITY_TYPE_SKILL);
    createdInstance.setCapabilityType(typeCodes);
    WorkforceCapabilityStatusCodes statusCodes = new WorkforceCapabilityStatusCodes();
    statusCodes.setCode(STATUS_ACTIVE);
    createdInstance.setStatus(statusCodes);

    WorkforceCapabilityCatalog workforceCapabilityCatalog = new WorkforceCapabilityCatalog();
    workforceCapabilityCatalog.setID(UUID.randomUUID().toString());
    WorkforceCapabilityCatalogAssignment catalogAssignment = new WorkforceCapabilityCatalogAssignment();
    catalogAssignment.setCatalog(workforceCapabilityCatalog);
    createdInstance.setCatalogAssignment(Collections.singletonList(catalogAssignment));

    WorkforceCapabilityProficiencyScale workforceCapabilityProficiencyScale = new WorkforceCapabilityProficiencyScale();
    workforceCapabilityProficiencyScale.setID(UUID.randomUUID().toString());
    createdInstance.setProficiencyScale(workforceCapabilityProficiencyScale);

    Row mockProfSet = mock(Row.class);
    when(workForceCapabilityDAO.getExistingProfID(Mockito.anyString())).thenAnswer(invocation -> {
      when(mockProfSet.get(ProficiencySets.ID)).thenReturn(createdInstance.getProficiencyScale());
      return mockProfSet;
    });

    when((Integer) mockProfSet.get(ProficiencySets.LIFECYCLE_STATUS_CODE)).thenReturn(0);

    when(workForceCapabilityDAO.getExistingCatalogID(Mockito.anyString())).thenAnswer(invocation -> {
      Row mockRow = mock(Row.class);
      when(mockRow.get(Catalogs.ID)).thenReturn(createdInstance.getCatalogAssignment().get(0).getCatalog());
      return mockRow;
    });

    List<Name> nameList = new ArrayList<>();
    Name name1 = new Name();
    name1.setLang("en");
    name1.setContent("Skill name");
    nameList.add(name1);
    createdInstance.setName(nameList);

    CapabilityValue value = new CapabilityValue();
    value.setInstance(createdInstance);
    value.setEvent(CREATED_EVENT);
    value.setVersionId(VERSION_ID);
    this.workForceCapabilityLogs.add(value);

    assertEquals(1, this.classUnderTest.processWorkforceCapabilityLog(this.workForceCapabilityLogs, CONSUMER_SUB_DOMAIN,
        jobSchedulerRunHeader));
    verify(this.workforceCapabilityReplicationDAO, times(1)).save(any(Skills.class), any(List.class),
        any(ReplicationFailures.class));
  }

  @Test
  @DisplayName("test process capability with Log event as created - create skills with description and no name")
  public void testProcessWorkforceCapabilityLogCreatedEventOnlyDescription() {
    WorkforceCapability createdInstance = new WorkforceCapability();
    createdInstance.setid(UUID.randomUUID().toString());
    WorkforceCapabilityTypeCodes typeCodes = new WorkforceCapabilityTypeCodes();
    typeCodes.setCode(CAPABILITY_TYPE_SKILL);
    createdInstance.setCapabilityType(typeCodes);
    WorkforceCapabilityStatusCodes statusCodes = new WorkforceCapabilityStatusCodes();
    statusCodes.setCode(STATUS_INACTIVE);
    createdInstance.setStatus(statusCodes);

    WorkforceCapabilityCatalog workforceCapabilityCatalog = new WorkforceCapabilityCatalog();
    workforceCapabilityCatalog.setID(UUID.randomUUID().toString());
    WorkforceCapabilityCatalogAssignment catalogAssignment = new WorkforceCapabilityCatalogAssignment();
    catalogAssignment.setCatalog(workforceCapabilityCatalog);
    createdInstance.setCatalogAssignment(Collections.singletonList(catalogAssignment));

    WorkforceCapabilityProficiencyScale workforceCapabilityProficiencyScale = new WorkforceCapabilityProficiencyScale();
    workforceCapabilityProficiencyScale.setID(UUID.randomUUID().toString());
    createdInstance.setProficiencyScale(workforceCapabilityProficiencyScale);

    Row mockProfSet = mock(Row.class);
    when(workForceCapabilityDAO.getExistingProfID(Mockito.anyString())).thenAnswer(invocation -> {
      when(mockProfSet.get(ProficiencySets.ID)).thenReturn(createdInstance.getProficiencyScale());
      return mockProfSet;
    });

    when((Integer) mockProfSet.get(ProficiencySets.LIFECYCLE_STATUS_CODE)).thenReturn(0);

    when(workForceCapabilityDAO.getExistingCatalogID(Mockito.anyString())).thenAnswer(invocation -> {
      Row mockRow = mock(Row.class);
      when(mockRow.get(Catalogs.ID)).thenReturn(createdInstance.getCatalogAssignment().get(0).getCatalog());
      return mockRow;
    });

    List<Description> desList = new ArrayList<>();
    Description des1 = new Description();
    des1.setLang("en");
    des1.setContent("Skill Description");
    desList.add(des1);
    createdInstance.setDescription(desList);

    CapabilityValue value = new CapabilityValue();
    value.setInstance(createdInstance);
    value.setEvent(CREATED_EVENT);
    value.setVersionId(VERSION_ID);
    this.workForceCapabilityLogs.add(value);

    assertEquals(1, this.classUnderTest.processWorkforceCapabilityLog(this.workForceCapabilityLogs, CONSUMER_SUB_DOMAIN,
        jobSchedulerRunHeader));
    verify(this.workforceCapabilityReplicationDAO, times(1)).save(any(Skills.class), any(List.class),
        any(ReplicationFailures.class));
  }
}
