package com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapabilitycatalog;

import static com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.WorkforceCapabilityMDIEventsAPIProcessor.CATALOGS;
import static com.sap.c4p.rm.skill.mdiintegration.utils.Constants.*;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.masterdataintegration.MDIEntities;
import com.sap.c4p.rm.skill.mdiintegration.exceptions.CatalogDeletionException;
import com.sap.c4p.rm.skill.mdiintegration.exceptions.RecordNotFoundException;
import com.sap.c4p.rm.skill.mdiintegration.replicationdao.MDIObjectReplicationStatusDAO;
import com.sap.resourcemanagement.skill.integration.MDIObjectReplicationStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.Row;

import com.sap.c4p.rm.skill.config.LoggingMarker;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;
import com.sap.c4p.rm.skill.mdiintegration.exceptions.MandatoryFieldException;
import com.sap.c4p.rm.skill.mdiintegration.exceptions.ReplicationException;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapabilitycatalog.dao.WorkForceCapabilityCatalogDAO;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapabilitycatalog.dao.WorkforceCapabilityCatalogReplicationDAO;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapabilitycatalog.dto.CatalogValue;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapabilitycatalog.dto.WorkforceCapabilityCatalog;
import com.sap.c4p.rm.skill.mdiintegration.replicationdao.ReplicationFailureDAO;
import com.sap.c4p.rm.skill.mdiintegration.utils.CommonUtility;
import com.sap.c4p.rm.skill.mdiintegration.utils.IsNullCheckUtils;
import com.sap.c4p.rm.skill.mdiintegration.utils.LanguageContent;

import com.sap.resourcemanagement.skill.Catalogs;
import com.sap.resourcemanagement.skill.integration.ReplicationFailures;

@Component
public class WorkforceCapabilityCatalogMDIEventsAPIProcessor {

  private static final Logger LOGGER = LoggerFactory.getLogger(WorkforceCapabilityCatalogMDIEventsAPIProcessor.class);

  private static final Marker WORKFORCE_CAPABILITY_CATALOG_REPLICATION = LoggingMarker.WORKFORCE_CAPABILITY_CATALOG_REPLICATION
      .getMarker();
  private final WorkforceCapabilityCatalogReplicationDAO workforceCapabilityCatalogReplicationDAO;
  private final WorkForceCapabilityCatalogDAO workForceCapabilityCatalogDAO;
  private final ReplicationFailureDAO replicationFailureDAO;
  private final CommonUtility commonUtility;

  private final MDIObjectReplicationStatusDAO mdiObjectReplicationStatusDAO;

  @Autowired
  public WorkforceCapabilityCatalogMDIEventsAPIProcessor(
          final WorkforceCapabilityCatalogReplicationDAO workforceCapabilityCatalogReplicationDAO,
          final WorkForceCapabilityCatalogDAO workForceCapabilityCatalogDAO, ReplicationFailureDAO replicationFailureDAO,
          CommonUtility commonUtility, MDIObjectReplicationStatusDAO mdiObjectReplicationStatusDAO) {
    this.workforceCapabilityCatalogReplicationDAO = workforceCapabilityCatalogReplicationDAO;
    this.workForceCapabilityCatalogDAO = workForceCapabilityCatalogDAO;
    this.replicationFailureDAO = replicationFailureDAO;
    this.commonUtility = commonUtility;
    this.mdiObjectReplicationStatusDAO = mdiObjectReplicationStatusDAO;
  }

  public Integer processWorkforceCapabilityCatalogLog(final List<CatalogValue> workForceCapabilityCatalogLogs,
      final String subDomain, final JobSchedulerRunHeader jobSchedulerRunHeader) {
    AtomicInteger successRecords = new AtomicInteger(0);
    workForceCapabilityCatalogLogs.forEach(workForceCapabilityCatalogLog -> this
        .processMDILog(workForceCapabilityCatalogLog, successRecords, subDomain, jobSchedulerRunHeader));

    return successRecords.get();
  }

  private void processMDILog(final CatalogValue workForceCapabilityCatalogLog, AtomicInteger successRecords,
      String subDomain, final JobSchedulerRunHeader jobSchedulerRunHeader) {
    String eventFromAPI = workForceCapabilityCatalogLog.getEvent();
    String versionId = workForceCapabilityCatalogLog.getVersionId();
    WorkforceCapabilityCatalog instance;

    try {
      if (eventFromAPI.equals("created") || eventFromAPI.equals("included") || eventFromAPI.equals("updated")) {
        if ((instance = workForceCapabilityCatalogLog.getInstance()) != null) {
          if (IsNullCheckUtils.isNullOrEmpty(instance.getId()))
            throw new MandatoryFieldException(INSTANCE_ID, INSTANCE);
          LOGGER.info(WORKFORCE_CAPABILITY_CATALOG_REPLICATION, MDI_LOG_PROCESSOR_INIT_MESSAGE, eventFromAPI, versionId,
                  instance.getId());
          processCreateUpdateEvent(instance);
        }
      } else if (eventFromAPI.equals("deleted") || eventFromAPI.equals("excluded")) {
        String excludedId;
        if ((excludedId = workForceCapabilityCatalogLog.getInstance().getId()) != null) {
          LOGGER.info(WORKFORCE_CAPABILITY_CATALOG_REPLICATION, MDI_LOG_PROCESSOR_INIT_MESSAGE, eventFromAPI, versionId,
                  excludedId);
          processDeleteEvent(excludedId);
        }
      }
      else {
        LOGGER.info(WORKFORCE_CAPABILITY_CATALOG_REPLICATION, "Skipping {} event", eventFromAPI);
      }
      successRecords.getAndIncrement();
    } catch (ReplicationException replicationException) {
      this.replicationFailureDAO.saveWorkforceCapabilityCatalogReplicationFailure(
          WORKFORCE_CAPABILITY_CATALOG_REPLICATION, replicationException, workForceCapabilityCatalogLog, subDomain,
          jobSchedulerRunHeader);
    } catch (Exception exception) {
      LOGGER.info(WORKFORCE_CAPABILITY_CATALOG_REPLICATION, exception.getLocalizedMessage(), exception);
    }
  }

  private void processCreateUpdateEvent(WorkforceCapabilityCatalog instance) {
    Catalogs catalog;
    String instanceId = instance.getId();
    ReplicationFailures replicationFailures = ReplicationFailures.create();
    replicationFailures.setInstanceId(instanceId);
    replicationFailures.setReplicationFailureStatusCode(REPLICATION_FAILURE_STATUS_CLOSED);

    catalog = this.startProcess(instanceId, instance);
    Row existingCatalog = this.workForceCapabilityCatalogDAO
            .getExistingCatalog(instanceId);
    if (existingCatalog != null) {
      catalog.setId(existingCatalog.get(Catalogs.ID).toString());
      this.workforceCapabilityCatalogReplicationDAO.update(catalog, replicationFailures);
    } else {
      this.workforceCapabilityCatalogReplicationDAO.save(catalog, replicationFailures);
    }
  }

  private void processDeleteEvent(String excludedId) {
      ReplicationFailures replicationFailures = ReplicationFailures.create();
      replicationFailures.setInstanceId(excludedId);
      replicationFailures.setReplicationFailureStatusCode(REPLICATION_FAILURE_STATUS_CLOSED);

      Row existingCatalog = this.workForceCapabilityCatalogDAO
              .getExistingCatalog(excludedId);

      if (existingCatalog != null) {
        String existingCatalogId = existingCatalog.get(Catalogs.ID).toString();
        if (this.workForceCapabilityCatalogDAO
                .isCatalogDeletionAllowed(existingCatalogId).equals(Boolean.TRUE)) {
          this.workforceCapabilityCatalogReplicationDAO.delete(existingCatalogId, replicationFailures);
        } else {
          //Add the entry to the MDIObjectReplicationStatus Table, before raising exception which would be logged on jobscheduler
          MDIObjectReplicationStatus mdiObjectReplicationStatus = MDIObjectReplicationStatus.create();
          mdiObjectReplicationStatus.setId(existingCatalogId);
          mdiObjectReplicationStatus.setEntityName(MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION.getName());
          mdiObjectReplicationStatus.setExcludeStatus(Boolean.TRUE);
          this.mdiObjectReplicationStatusDAO.fillEntry(mdiObjectReplicationStatus);

          throw new CatalogDeletionException(workForceCapabilityCatalogDAO.getCatalogName(existingCatalogId), CATALOGS);
        }
      } else {
        throw new RecordNotFoundException(excludedId, CATALOGS);
      }
    }


  public void takeExistingCatalogSnapShot() {

    List<MDIObjectReplicationStatus> mdiObjectReplicationStatusList = new ArrayList<>();
    this.workForceCapabilityCatalogDAO.readAll().forEach(catalog -> {
      MDIObjectReplicationStatus mdiObjectReplicationStatus = MDIObjectReplicationStatus.create();
      mdiObjectReplicationStatus.setId(catalog.getId());
      mdiObjectReplicationStatus.setEntityName(MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION.getName());
      mdiObjectReplicationStatus.setExcludeStatus(Boolean.TRUE);
      mdiObjectReplicationStatusList.add(mdiObjectReplicationStatus);
    });
    this.mdiObjectReplicationStatusDAO.delete(MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION);
    if (!mdiObjectReplicationStatusList.isEmpty()) {
      this.mdiObjectReplicationStatusDAO.fillEntity(mdiObjectReplicationStatusList);
    }
  }

  public void cleanCatalogSnapshot(final String subDomain,
                                   final JobSchedulerRunHeader jobSchedulerRunHeader) {
    List<MDIObjectReplicationStatus> mdiObjectReplicationStatusList = this.mdiObjectReplicationStatusDAO
            .readAll(MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION);
    mdiObjectReplicationStatusList.forEach(mdiObjectReplicationStatus -> {
      ReplicationFailures replicationFailures = ReplicationFailures.create();
      replicationFailures.setInstanceId(mdiObjectReplicationStatus.getId());
      replicationFailures.setReplicationFailureStatusCode(REPLICATION_FAILURE_STATUS_CLOSED);
      try {
        if (this.workForceCapabilityCatalogDAO
                .isCatalogDeletionAllowed(mdiObjectReplicationStatus.getId()).equals(Boolean.TRUE)) {
          this.workforceCapabilityCatalogReplicationDAO.delete(mdiObjectReplicationStatus.getId(), replicationFailures);
        } else {
          throw new CatalogDeletionException(this.workForceCapabilityCatalogDAO.getCatalogName(mdiObjectReplicationStatus.getId()), CATALOGS);
        }
      } catch (ReplicationException replicationException) {
        this.replicationFailureDAO.saveReplicationFailure(
                WORKFORCE_CAPABILITY_CATALOG_REPLICATION, replicationException, mdiObjectReplicationStatus.getId(),
                REPLICATION_TYPE_WORKFORCE_CAPABILITY_CATALOG, subDomain, jobSchedulerRunHeader);
        LOGGER.info(WORKFORCE_CAPABILITY_CATALOG_REPLICATION, replicationException.getLocalizedMessage(), replicationException);
      } catch (Exception exception) {
        LOGGER.info(WORKFORCE_CAPABILITY_CATALOG_REPLICATION, exception.getLocalizedMessage(), exception);
      }
    });
  }



  private Catalogs startProcess(final String catalogInstanceId, final WorkforceCapabilityCatalog instance) {

    Catalogs catalog = Catalogs.create();
    catalog.setOid(catalogInstanceId);
    // Set catalog name
    if (!IsNullCheckUtils.isNullOrEmpty(instance.getName())) {
      List<LanguageContent> nameLanguageContents = instance.getName().stream().map(catalogName -> {
        LanguageContent languageContent = LanguageContent.create();
        languageContent.setLang(catalogName.getLang());
        languageContent.setContent(catalogName.getContent());
        return languageContent;
      }).toList();
      catalog.setName(this.commonUtility.getContent(nameLanguageContents));
    }

    // Set catalog description
    if (!IsNullCheckUtils.isNullOrEmpty(instance.getDescription())) {
      List<LanguageContent> descriptionLanguageContents = instance.getDescription().stream().map(catalogDesc -> {
        LanguageContent languageContent = LanguageContent.create();
        languageContent.setLang(catalogDesc.getLang());
        languageContent.setContent(catalogDesc.getContent());
        return languageContent;
      }).toList();

      catalog.setDescription(this.commonUtility.getContent(descriptionLanguageContents));
    }

    return catalog;
  }
}
