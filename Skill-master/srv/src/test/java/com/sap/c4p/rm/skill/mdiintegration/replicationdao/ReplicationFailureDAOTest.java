package com.sap.c4p.rm.skill.mdiintegration.replicationdao;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;

import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.ql.cqn.CqnUpsert;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.skill.mdiintegration.InitMocks;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.service.JobSchedulerService;
import com.sap.c4p.rm.skill.mdiintegration.exceptions.ReplicationErrorCodes;
import com.sap.c4p.rm.skill.mdiintegration.exceptions.ReplicationException;
import com.sap.c4p.rm.skill.mdiintegration.exceptions.TransactionException;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dto.CapabilityValue;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dto.WorkforceCapability;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapabilitycatalog.dto.CatalogValue;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapabilitycatalog.dto.Name;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapabilitycatalog.dto.WorkforceCapabilityCatalog;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dto.ProficiencyValue;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dto.WorkforceCapabilityProficiencyScale;
import com.sap.c4p.rm.skill.mdiintegration.utils.CommonUtility;
import com.sap.c4p.rm.skill.mdiintegration.utils.LanguageContent;

import com.sap.resourcemanagement.skill.integration.ReplicationFailures;

public class ReplicationFailureDAOTest extends InitMocks {

  public static final String CONSUMER_SUB_DOMAIN = "consumer-subdomain";

  @Mock
  LanguageContent languageContent;

  @Mock
  CommonUtility commonUtility;

  @Mock
  JobSchedulerService jobSchedulerService;

  @Mock
  Marker marker;

  @Mock
  PersistenceService persistenceService;

  @Mock
  ReplicationErrorMessagesDAO replicationErrorMessagesDAO;

  @Mock
  JobSchedulerRunHeader jobSchedulerRunHeader;

  @Autowired
  @InjectMocks
  ReplicationFailureDAOImpl classUnderTest;

  @Test
  @DisplayName("test update when persistence run raise exception")
  public void testUpdateWhenPersistenceRunRaiseException() {
    ReplicationFailures replicationFailures = ReplicationFailures.create();
    doThrow(ServiceException.class).when(this.persistenceService).run(any(CqnUpdate.class));
    assertThrows(TransactionException.class, () -> this.classUnderTest.update(marker, replicationFailures));
    verify(this.persistenceService, times(1)).run(any(CqnUpdate.class));
  }

  @Test
  @DisplayName("test update when persistence do not raise exception")
  public void testUpdateWhenPersistenceDoNotRaiseException() {
    ReplicationFailures replicationFailures = ReplicationFailures.create();
    this.classUnderTest.update(marker, replicationFailures);
    verify(this.persistenceService, times(1)).run(any(CqnUpdate.class));
  }

  @Test
  @DisplayName("test saveWorkforceCapabilityCatalogReplicationFailure when persistence run raise exception")
  public void testSaveWorkforceCapabilityCatalogReplicationFailureWhenPersistenceRunRaiseException() {
    ServiceException serviceException = new ServiceException("Something wrong");
    ReplicationException replicationException = new TransactionException(serviceException);
    CatalogValue catalogValue = new CatalogValue();
    catalogValue.setEvent("created");
    catalogValue.setVersionId("versionId");
    WorkforceCapabilityCatalog instance = new WorkforceCapabilityCatalog();
    instance.setId("Id");
    List<Name> nameList = new ArrayList<>(1);
    Name name1 = new Name();
    name1.setLang("en");
    name1.setContent("Catalog Set");
    nameList.add(name1);
    instance.setName(nameList);
    catalogValue.setInstance(instance);
    doThrow(ServiceException.class).when(this.persistenceService).run(any(CqnUpsert.class));
    Map<String, String> map = new HashMap<>();
    map.put(ReplicationErrorCodes.DB_TRANSACTION.getErrorCode(), "{0}{1}{2}{3}");
    when(this.replicationErrorMessagesDAO.getReplicationErrorMessages()).thenReturn(map);
    assertThrows(TransactionException.class,
        () -> this.classUnderTest.saveWorkforceCapabilityCatalogReplicationFailure(marker, replicationException,
            catalogValue, "subDomain", jobSchedulerRunHeader));
    verify(this.persistenceService, times(1)).run(any(CqnUpsert.class));
  }

  @Test
  @DisplayName("test saveWorkforceCapabilityCatalogReplicationFailure when persistence do not raise exception")
  public void testSaveWorkforceCapabilityCatalogReplicationFailureWhenPersistenceDoNotRaiseException() {
    ReplicationException replicationException = new TransactionException("errorParam1", "errorParam2", "errorParam3",
        "errorParam4");
    CatalogValue catalogValue = new CatalogValue();
    catalogValue.setEvent("created");
    catalogValue.setVersionId("versionId");
    WorkforceCapabilityCatalog instance = new WorkforceCapabilityCatalog();
    instance.setId("Id");
    List<Name> nameList = new ArrayList<>(1);
    Name name1 = new Name();
    name1.setLang("en");
    name1.setContent("Catalog Set");
    nameList.add(name1);
    instance.setName(nameList);
    catalogValue.setInstance(instance);
    Map<String, String> map = new HashMap<>();
    map.put(ReplicationErrorCodes.DB_TRANSACTION.getErrorCode(), "{0}{1}{2}{3}");
    when(this.replicationErrorMessagesDAO.getReplicationErrorMessages()).thenReturn(map);
    this.classUnderTest.saveWorkforceCapabilityCatalogReplicationFailure(marker, replicationException, catalogValue,
        CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader);
    verify(this.persistenceService, times(1)).run(any(CqnUpsert.class));
  }

  @Test
  @DisplayName("test saveWorkforceCapabilityProficiencyReplicationFailure when persistence run raise exception")
  public void testSaveWorkforceCapabilityProficiencyReplicationFailureWhenPersistenceRunRaiseException() {
    ServiceException serviceException = new ServiceException("Something wrong");
    ReplicationException replicationException = new TransactionException(serviceException);
    ProficiencyValue proficiencyValue = new ProficiencyValue();
    proficiencyValue.setEvent("created");
    proficiencyValue.setVersionId("versionId");
    WorkforceCapabilityProficiencyScale instance = new WorkforceCapabilityProficiencyScale();
    instance.setId("Id");
    List<com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dto.Name> nameList = new ArrayList<>(
        1);
    com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dto.Name name1 = new com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dto.Name();
    name1.setLang("en");
    name1.setContent("Proficiency Set");
    nameList.add(name1);
    instance.setName(nameList);
    proficiencyValue.setInstance(instance);
    doThrow(ServiceException.class).when(this.persistenceService).run(any(CqnUpsert.class));
    Map<String, String> map = new HashMap<>();
    map.put(ReplicationErrorCodes.DB_TRANSACTION.getErrorCode(), "{0}{1}{2}{3}");
    when(this.replicationErrorMessagesDAO.getReplicationErrorMessages()).thenReturn(map);
    assertThrows(TransactionException.class,
        () -> this.classUnderTest.saveWorkforceCapabilityProfScaleReplicationFailure(marker, replicationException,
            proficiencyValue, "subDomain", jobSchedulerRunHeader));
    verify(this.persistenceService, times(1)).run(any(CqnUpsert.class));
  }

  @Test
  @DisplayName("test saveWorkforceCapabilityProficiencyReplicationFailure when persistence do not raise exception")
  public void testSaveWorkforceCapabilityProficiencyReplicationFailureWhenPersistenceDoNotRaiseException() {
    ReplicationException replicationException = new TransactionException("errorParam1", "errorParam2", "errorParam3",
        "errorParam4");
    ProficiencyValue proficiencyValue = new ProficiencyValue();
    proficiencyValue.setEvent("created");
    proficiencyValue.setVersionId("versionId");
    WorkforceCapabilityProficiencyScale instance = new WorkforceCapabilityProficiencyScale();
    instance.setId("Id");
    List<com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dto.Name> nameList = new ArrayList<>(
        1);
    com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dto.Name name1 = new com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dto.Name();
    name1.setLang("en");
    name1.setContent("Proficiency Set");
    nameList.add(name1);
    instance.setName(nameList);
    proficiencyValue.setInstance(instance);
    Map<String, String> map = new HashMap<>();
    map.put(ReplicationErrorCodes.DB_TRANSACTION.getErrorCode(), "{0}{1}{2}{3}");
    when(this.replicationErrorMessagesDAO.getReplicationErrorMessages()).thenReturn(map);
    this.classUnderTest.saveWorkforceCapabilityProfScaleReplicationFailure(marker, replicationException,
        proficiencyValue, "subDomain", jobSchedulerRunHeader);
    verify(this.persistenceService, times(1)).run(any(CqnUpsert.class));
  }

  @Test
  @DisplayName("test saveWorkforceCapabilityReplicationFailure when persistence run raise exception")
  public void testSaveWorkforceCapabilityReplicationFailureWhenPersistenceRunRaiseException() {
    ServiceException serviceException = new ServiceException("Something wrong");
    ReplicationException replicationException = new TransactionException(serviceException);
    CapabilityValue capabilityValue = new CapabilityValue();
    capabilityValue.setEvent("created");
    capabilityValue.setVersionId("versionId");
    WorkforceCapability instance = new WorkforceCapability();
    instance.setid("Id");
    List<com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dto.Name> nameList = new ArrayList<>(1);
    com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dto.Name name1 = new com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dto.Name();
    name1.setLang("en");
    name1.setContent("Skill name");
    nameList.add(name1);
    instance.setName(nameList);
    capabilityValue.setInstance(instance);
    doThrow(ServiceException.class).when(this.persistenceService).run(any(CqnUpsert.class));
    Map<String, String> map = new HashMap<>();
    map.put(ReplicationErrorCodes.DB_TRANSACTION.getErrorCode(), "{0}{1}{2}{3}");
    when(this.replicationErrorMessagesDAO.getReplicationErrorMessages()).thenReturn(map);
    assertThrows(TransactionException.class, () -> this.classUnderTest.saveWorkforceCapabilityReplicationFailure(marker,
        replicationException, capabilityValue, "subDomain", jobSchedulerRunHeader));
    verify(this.persistenceService, times(1)).run(any(CqnUpsert.class));
  }

  @Test
  @DisplayName("test saveWorkforceCapabilityReplicationFailure when persistence do not raise exception")
  public void testSaveWorkforceCapabilityReplicationFailureWhenPersistenceDoNotRaiseException() {
    ReplicationException replicationException = new TransactionException("errorParam1", "errorParam2", "errorParam3",
        "errorParam4");
    CapabilityValue capabilityValue = new CapabilityValue();
    capabilityValue.setEvent("created");
    capabilityValue.setVersionId("versionId");
    WorkforceCapability instance = new WorkforceCapability();
    instance.setid("Id");
    List<com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dto.Name> nameList = new ArrayList<>(1);
    com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dto.Name name1 = new com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dto.Name();
    name1.setLang("en");
    name1.setContent("Skill name");
    nameList.add(name1);
    instance.setName(nameList);
    capabilityValue.setInstance(instance);
    Map<String, String> map = new HashMap<>();
    map.put(ReplicationErrorCodes.DB_TRANSACTION.getErrorCode(), "{0}{1}{2}{3}");
    when(this.replicationErrorMessagesDAO.getReplicationErrorMessages()).thenReturn(map);
    this.classUnderTest.saveWorkforceCapabilityReplicationFailure(marker, replicationException, capabilityValue,
        "subDomain", jobSchedulerRunHeader);
    verify(this.persistenceService, times(1)).run(any(CqnUpsert.class));
  }

  @Test
  @DisplayName("test saveReplicationFailure when persistence run raise exception")
  public void testReplicationFailureWhenPersistenceRunRaiseException() {
    ServiceException serviceException = new ServiceException("Something wrong");
    ReplicationException replicationException = new TransactionException(serviceException);
    doThrow(ServiceException.class).when(this.persistenceService).run(any(CqnUpsert.class));
    Map<String, String> map = new HashMap<>();
    map.put(ReplicationErrorCodes.DB_TRANSACTION.getErrorCode(), "{0}{1}{2}{3}");
    when(this.replicationErrorMessagesDAO.getReplicationErrorMessages()).thenReturn(map);
    assertThrows(TransactionException.class, () -> this.classUnderTest.saveReplicationFailure(marker,
            replicationException, "02bd6964-5e5f-4bec-b5c8-6271625ec8f1", "workforceCapabilityData",
            "subDomain", jobSchedulerRunHeader));
    verify(this.persistenceService, times(1)).run(any(CqnUpsert.class));
  }


  @Test
  @DisplayName("test saveReplicationFailure when persistence do not raise exception")
  public void testSaveReplicationFailureWhenPersistenceDoNotRaiseException() {
    ReplicationException replicationException = new TransactionException("errorParam1", "errorParam2", "errorParam3",
            "errorParam4");
    Map<String, String> map = new HashMap<>();
    map.put(ReplicationErrorCodes.DB_TRANSACTION.getErrorCode(), "{0}{1}{2}{3}");
    when(this.replicationErrorMessagesDAO.getReplicationErrorMessages()).thenReturn(map);
    this.classUnderTest.saveReplicationFailure(marker, replicationException, "02bd6964-5e5f-4bec-b5c8-6271625ec8f1", "workforceCapabilityData",
            "subDomain", jobSchedulerRunHeader);
    verify(this.persistenceService, times(1)).run(any(CqnUpsert.class));
  }
}
