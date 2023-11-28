package com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapabilitycatalog;

import static com.sap.c4p.rm.skill.mdiintegration.TestConstants.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
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
import org.springframework.core.convert.ConversionService;

import com.sap.cds.Result;
import com.sap.cds.Row;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.skill.mdiintegration.InitMocks;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;
import com.sap.c4p.rm.skill.mdiintegration.exceptions.ReplicationException;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapabilitycatalog.dao.WorkForceCapabilityCatalogDAO;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapabilitycatalog.dao.WorkforceCapabilityCatalogReplicationDAO;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapabilitycatalog.dto.CatalogValue;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapabilitycatalog.dto.Description;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapabilitycatalog.dto.Name;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapabilitycatalog.dto.WorkforceCapabilityCatalog;
import com.sap.c4p.rm.skill.mdiintegration.replicationdao.ReplicationFailureDAOImpl;
import com.sap.c4p.rm.skill.mdiintegration.utils.CommonUtility;
import com.sap.c4p.rm.skill.mdiintegration.utils.LanguageContent;
import com.sap.c4p.rm.skill.mdiintegration.utils.StringFormatter;

import com.sap.resourcemanagement.skill.Catalogs;
import com.sap.resourcemanagement.skill.integration.ReplicationFailures;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;

public class WorkforceCapabilityCatalogMDIEventsAPIProcessorTest extends InitMocks {

  private final Logger logger = (Logger) LoggerFactory.getLogger(WorkforceCapabilityCatalogMDIEventsAPIProcessor.class);

  private ListAppender<ILoggingEvent> listAppender;

  private List<CatalogValue> workForceCapabilityCatalogLogs;

  @Mock
  Catalogs catalogs;

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
  ReplicationFailureDAOImpl replicationFailureDAO;

  @Mock
  WorkForceCapabilityCatalogDAO workForceCapabilityCatalogDAO;

  @Mock
  WorkforceCapabilityCatalogReplicationDAO workforceCapabilityCatalogReplicationDAO;

  @Autowired
  @InjectMocks
  private WorkforceCapabilityCatalogMDIEventsAPIProcessor classUnderTest;

  @BeforeEach
  void setUp() {
    this.workForceCapabilityCatalogLogs = new ArrayList<>();
    this.listAppender = new ListAppender<>();
    this.listAppender.start();
    logger.addAppender(listAppender);
  }

  @Test
  @DisplayName("test processWorkforceCapabilityCatalogs with empty list of Logs")
  public void testProcessWorkforceCapabilityCatalogLogWithEmptyListOfLogs() {
    assertEquals(0, this.classUnderTest.processWorkforceCapabilityCatalogLog(this.workForceCapabilityCatalogLogs,
        CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader));
    List<ILoggingEvent> logsList = listAppender.list;
    assertEquals(0, logsList.size());
  }

  @Test
  @DisplayName("test processWorkforceCapabilityCatalogs having Logs with no instance")
  public void testProcessWorkforceCapabilityCatalogLogHavingLogsWithNoInstanceWithCreateEvent() {
    this.workForceCapabilityCatalogLogs.addAll(Stream.of(CREATED_EVENT, UPDATED_EVENT, OTHER_EVENT).map(event -> {
      CatalogValue logEvent = new CatalogValue();
      logEvent.setEvent(event);
      logEvent.setVersionId(VERSION_ID);
      return logEvent;
    }).collect(Collectors.toList()));

    assertEquals(3, this.classUnderTest.processWorkforceCapabilityCatalogLog(this.workForceCapabilityCatalogLogs,
        CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader));
    List<ILoggingEvent> logsList = listAppender.list;
    assertEquals(1, logsList.size());
    ILoggingEvent debugLog = logsList.get(0);
    assertEquals(StringFormatter.format("Skipping {0} event", OTHER_EVENT), debugLog.getFormattedMessage());
    assertEquals(Level.INFO, debugLog.getLevel());
  }

  @Test
  @DisplayName("test processWorkforceCapabilityCatalogLog with mandatory data missing.")
  public void testProcessWorkforceCapabilityCatalogLogWithMandatoryDataMissing() {

    CatalogValue instanceIDMissing = new CatalogValue();
    instanceIDMissing.setEvent(CREATED_EVENT);
    instanceIDMissing.setVersionId(VERSION_ID);
    WorkforceCapabilityCatalog workforcecapabilitycatalogMissingInstanceID = new WorkforceCapabilityCatalog();
    instanceIDMissing.setInstance(workforcecapabilitycatalogMissingInstanceID);
    this.workForceCapabilityCatalogLogs.add(instanceIDMissing);

    // Ideally should be zero, but no checks are in place for missing ID;

    assertEquals(0, this.classUnderTest.processWorkforceCapabilityCatalogLog(this.workForceCapabilityCatalogLogs,
        CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader));

    verify(this.replicationFailureDAO, times(1)).saveWorkforceCapabilityCatalogReplicationFailure(any(Marker.class),
        any(ReplicationException.class), any(CatalogValue.class), anyString(), any(JobSchedulerRunHeader.class));
  }

  @Test
  @DisplayName("test process capability catalog with Log event as created")
  public void testProcessWorkforceCapabilityCatalogLogCreatedEvent() {

    WorkforceCapabilityCatalog instance = new WorkforceCapabilityCatalog();
    instance.setId(UUID.randomUUID().toString());

    List<Name> nameList = new ArrayList<>();
    Name name1 = new Name();
    name1.setLang("en");
    name1.setContent("Catalog Set");
    nameList.add(name1);
    instance.setName(nameList);

    List<Description> desList = new ArrayList<>();
    Description des1 = new Description();
    des1.setLang("en");
    des1.setContent("Catalog Description Set");
    desList.add(des1);
    instance.setDescription(desList);

    CatalogValue log = new CatalogValue();
    log.setInstance(instance);
    log.setEvent(CREATED_EVENT);
    log.setVersionId(VERSION_ID);
    this.workForceCapabilityCatalogLogs.add(log);

    assertEquals(1, this.classUnderTest.processWorkforceCapabilityCatalogLog(this.workForceCapabilityCatalogLogs,
        CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader));

    verify(this.workforceCapabilityCatalogReplicationDAO, times(1)).save(any(Catalogs.class),
        any(ReplicationFailures.class));
  }

  @Test
  @DisplayName("test process capability catalog with Log event as update event")
  public void testProcessWorkforceCapabilityCatalogLogUpdatedEvent() {
    WorkforceCapabilityCatalog instance = new WorkforceCapabilityCatalog();
    instance.setId(UUID.randomUUID().toString());

    List<Name> nameList = new ArrayList<>();
    Name name1 = new Name();
    name1.setLang("en");
    name1.setContent("Catalog Set");
    nameList.add(name1);
    instance.setName(nameList);

    List<Description> desList = new ArrayList<>();
    Description des1 = new Description();
    des1.setLang("en");
    des1.setContent("Catalog Description Set");
    desList.add(des1);
    instance.setDescription(desList);

    CatalogValue log = new CatalogValue();
    log.setInstance(instance);
    log.setEvent(UPDATED_EVENT);
    log.setVersionId(VERSION_ID);
    this.workForceCapabilityCatalogLogs.add(log);

    when(workForceCapabilityCatalogDAO.getExistingCatalog(Mockito.anyString())).thenAnswer(invocation -> {
      Row mockRow = mock(Row.class);
      when(mockRow.get(Catalogs.ID)).thenReturn(instance.getId());
      return mockRow;
    });
    assertEquals(1, this.classUnderTest.processWorkforceCapabilityCatalogLog(this.workForceCapabilityCatalogLogs,
        CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader));

    verify(workforceCapabilityCatalogReplicationDAO).update(any(Catalogs.class), any(ReplicationFailures.class));
    verify(workforceCapabilityCatalogReplicationDAO, never()).save(any(Catalogs.class), any(ReplicationFailures.class));

  }

}
