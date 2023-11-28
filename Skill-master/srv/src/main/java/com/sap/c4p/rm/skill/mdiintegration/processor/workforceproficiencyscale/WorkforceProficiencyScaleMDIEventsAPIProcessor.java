package com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale;

import com.sap.c4p.rm.skill.config.LoggingMarker;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.masterdataintegration.MDIEntities;
import com.sap.c4p.rm.skill.mdiintegration.exceptions.MandatoryFieldException;
import com.sap.c4p.rm.skill.mdiintegration.exceptions.ProficiencySetRestrictionException;
import com.sap.c4p.rm.skill.mdiintegration.exceptions.RecordNotFoundException;
import com.sap.c4p.rm.skill.mdiintegration.exceptions.ReplicationException;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dao.WorkForceProficiencyDAO;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dao.WorkforceProficiencyReplicationDAO;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dto.ProficiencyValue;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dto.WorkforceCapabilityProficiency;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dto.WorkforceCapabilityProficiencyScale;
import com.sap.c4p.rm.skill.mdiintegration.replicationdao.MDIObjectReplicationStatusDAO;
import com.sap.c4p.rm.skill.mdiintegration.replicationdao.ReplicationFailureDAO;
import com.sap.c4p.rm.skill.mdiintegration.utils.CommonUtility;
import com.sap.c4p.rm.skill.mdiintegration.utils.IsNullCheckUtils;
import com.sap.c4p.rm.skill.mdiintegration.utils.LanguageContent;
import com.sap.cds.Row;
import com.sap.resourcemanagement.skill.ProficiencyLevels;
import com.sap.resourcemanagement.skill.ProficiencySets;
import com.sap.resourcemanagement.skill.integration.MDIObjectReplicationStatus;
import com.sap.resourcemanagement.skill.integration.ReplicationFailures;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionFailedException;
import org.springframework.core.convert.ConversionService;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import static com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.WorkforceCapabilityMDIEventsAPIProcessor.*;
import static com.sap.c4p.rm.skill.mdiintegration.utils.Constants.*;

@Component
public class WorkforceProficiencyScaleMDIEventsAPIProcessor {

  private static final Logger LOGGER = LoggerFactory.getLogger(WorkforceProficiencyScaleMDIEventsAPIProcessor.class);
  private static final Marker WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION = LoggingMarker.WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION
      .getMarker();
  private WorkforceProficiencyReplicationDAO workforceProficiencyReplicationDAO;
  private final ConversionService conversionService;
  private WorkForceProficiencyDAO workForceProficiencyDAO;

  private final CommonUtility commonUtility;

  private final ReplicationFailureDAO replicationFailureDAO;

  private final MDIObjectReplicationStatusDAO mdiObjectReplicationStatusDAO;

  @Autowired
  public WorkforceProficiencyScaleMDIEventsAPIProcessor(
          final WorkforceProficiencyReplicationDAO workforceProficiencyReplicationDAO,
          final ConversionService conversionService, final WorkForceProficiencyDAO workForceProficiencyDAO,
          CommonUtility commonUtility, ReplicationFailureDAO replicationFailureDAO, MDIObjectReplicationStatusDAO mdiObjectReplicationStatusDAO) {
    this.workforceProficiencyReplicationDAO = workforceProficiencyReplicationDAO;
    this.conversionService = conversionService;
    this.workForceProficiencyDAO = workForceProficiencyDAO;
    this.commonUtility = commonUtility;
    this.replicationFailureDAO = replicationFailureDAO;
    this.mdiObjectReplicationStatusDAO = mdiObjectReplicationStatusDAO;
  }

  public Integer processWorkforceCapabilityProfScaleLog(final List<ProficiencyValue> workForceProficiencyLogs,
      final String subDomain, final JobSchedulerRunHeader jobSchedulerRunHeader) {
    AtomicInteger successRecords = new AtomicInteger(0);
    workForceProficiencyLogs.forEach(workForceProficiencyLog -> this.processMDILog(workForceProficiencyLog,
        successRecords, subDomain, jobSchedulerRunHeader));
    return successRecords.get();
  }

  private void processMDILog(final ProficiencyValue proficiencyValue, AtomicInteger successRecords, String subDomain,
      final JobSchedulerRunHeader jobSchedulerRunHeader) {
    String eventFromAPI = proficiencyValue.getEvent();
    String versionId = proficiencyValue.getVersionId();
    WorkforceCapabilityProficiencyScale instance;

    try {
      if (eventFromAPI.equals("created") || eventFromAPI.equals("included") || eventFromAPI.equals("updated")) {
        if ((instance = proficiencyValue.getInstance()) != null) {
          if (IsNullCheckUtils.isNullOrEmpty(instance.getId()))
            throw new MandatoryFieldException(INSTANCE_ID, INSTANCE);
          LOGGER.info(WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION, MDI_LOG_PROCESSOR_INIT_MESSAGE, eventFromAPI,
              versionId, instance.getId());
          processCreateUpdateEvent(instance);
        }
      } else if (eventFromAPI.equals("deleted") || eventFromAPI.equals("excluded")) {
        String excludedId;
        if ((excludedId = proficiencyValue.getInstance().getId()) != null) {
          LOGGER.info(WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION, MDI_LOG_PROCESSOR_INIT_MESSAGE, eventFromAPI, versionId,
                  excludedId);
          processDeleteEvent(excludedId);
        }
      }
      else {
        LOGGER.info(WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION, "Skipping {} event", eventFromAPI);
      }
      successRecords.getAndIncrement();
    } catch (ReplicationException replicationException) {
      this.replicationFailureDAO.saveWorkforceCapabilityProfScaleReplicationFailure(
          WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION, replicationException, proficiencyValue, subDomain,
          jobSchedulerRunHeader);
    } catch (Exception exception) {
      LOGGER.info(WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION, exception.getLocalizedMessage(), exception);
    }
  }

  private void processCreateUpdateEvent(final WorkforceCapabilityProficiencyScale instance) {
    ProficiencySets proficiencySet;
    String instanceId = instance.getId();

    ReplicationFailures replicationFailures = ReplicationFailures.create();
    replicationFailures.setInstanceId(instanceId);
    replicationFailures.setReplicationFailureStatusCode(REPLICATION_FAILURE_STATUS_CLOSED);

    Row existingProfSet = this.workForceProficiencyDAO.getExistingProfSet(instanceId);
    String proficiencySetUUID = "";
    if (!IsNullCheckUtils.isNullOrEmpty(existingProfSet)) {
      proficiencySetUUID = existingProfSet.get(ProficiencySets.ID).toString();
    }

    proficiencySet = this.startProcess(instanceId, instance, proficiencySetUUID);
    if (!IsNullCheckUtils.isNullOrEmpty(proficiencySetUUID)) {
      proficiencySet.setId(proficiencySetUUID);
      this.workforceProficiencyReplicationDAO.update(proficiencySet, replicationFailures);
    } else {
      this.workforceProficiencyReplicationDAO.save(proficiencySet, replicationFailures);
    }
  }

  private void processDeleteEvent(String excludedId) {
    ReplicationFailures replicationFailures = ReplicationFailures.create();
    replicationFailures.setInstanceId(excludedId);
    replicationFailures.setReplicationFailureStatusCode(REPLICATION_FAILURE_STATUS_CLOSED);

    Row existingProficiencySet = this.workForceProficiencyDAO
            .getExistingProfSet(excludedId);

    if (existingProficiencySet != null) {
      String existingProficiencySetId = existingProficiencySet.get(ProficiencySets.ID).toString();
      if (this.workForceProficiencyDAO
              .isProficiencySetRestrictionAllowed(existingProficiencySetId).equals(Boolean.TRUE)) {
        this.workforceProficiencyReplicationDAO.restrictProficiencySet(existingProficiencySetId, replicationFailures);
      } else {
        // Add the entry to the MDIObjectReplicationStatus Table, before raising the exception
        MDIObjectReplicationStatus mdiObjectReplicationStatus = MDIObjectReplicationStatus.create();
        mdiObjectReplicationStatus.setId(existingProficiencySetId);
        mdiObjectReplicationStatus.setEntityName(MDIEntities.WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION.getName());
        mdiObjectReplicationStatus.setExcludeStatus(Boolean.TRUE);
        this.mdiObjectReplicationStatusDAO.fillEntry(mdiObjectReplicationStatus);

        throw new ProficiencySetRestrictionException(workForceProficiencyDAO.getProficiencySetName(existingProficiencySetId),
                PROFICIENCY_SETS);
      }
    } else {
      throw new RecordNotFoundException(excludedId, PROFICIENCY_SETS);
    }
  }

  public void takeExistingProficiencySetSnapShot() {

    List<MDIObjectReplicationStatus> mdiObjectReplicationStatusList = new ArrayList<>();
    this.workForceProficiencyDAO.readAll().forEach(proficiencySet -> {
      MDIObjectReplicationStatus mdiObjectReplicationStatus = MDIObjectReplicationStatus.create();
      mdiObjectReplicationStatus.setId(proficiencySet.getId());
      mdiObjectReplicationStatus.setEntityName(MDIEntities.WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION.getName());
      mdiObjectReplicationStatus.setExcludeStatus(Boolean.TRUE);
      mdiObjectReplicationStatusList.add(mdiObjectReplicationStatus);
    });
    this.mdiObjectReplicationStatusDAO.delete(MDIEntities.WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION);
    if (!mdiObjectReplicationStatusList.isEmpty()) {
      this.mdiObjectReplicationStatusDAO.fillEntity(mdiObjectReplicationStatusList);
    }
  }

  public void cleanProficiencySetSnapshot(final String subDomain,
                                          final JobSchedulerRunHeader jobSchedulerRunHeader) {
    List<MDIObjectReplicationStatus> mdiObjectReplicationStatusList = this.mdiObjectReplicationStatusDAO
            .readAll(MDIEntities.WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION);
    mdiObjectReplicationStatusList.forEach(mdiObjectReplicationStatus -> {
      ReplicationFailures replicationFailures = ReplicationFailures.create();
      replicationFailures.setInstanceId(mdiObjectReplicationStatus.getId());
      replicationFailures.setReplicationFailureStatusCode(REPLICATION_FAILURE_STATUS_CLOSED);
     try {
       if (this.workForceProficiencyDAO
               .isProficiencySetRestrictionAllowed(mdiObjectReplicationStatus.getId()).equals(Boolean.TRUE)) {
         this.workforceProficiencyReplicationDAO.restrictProficiencySet(mdiObjectReplicationStatus.getId(), replicationFailures);
       } else {
         throw new ProficiencySetRestrictionException(workForceProficiencyDAO.getProficiencySetName(mdiObjectReplicationStatus.getId()), PROFICIENCY_SETS);
       }
     } catch (ReplicationException replicationException) {
       this.replicationFailureDAO.saveReplicationFailure(
               WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION, replicationException, mdiObjectReplicationStatus.getId(),
               REPLICATION_TYPE_WORKFORCE_PROFICIENCY_SCALE, subDomain, jobSchedulerRunHeader);
     } catch (Exception exception) {
       LOGGER.info(WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION, exception.getLocalizedMessage(), exception);
     }
    });
  }




  private ProficiencySets startProcess(final String proficiencySetInstanceId,
      final WorkforceCapabilityProficiencyScale instance, String proficiencySetUUID) {

    if (IsNullCheckUtils.isNullOrEmpty(proficiencySetInstanceId))
      throw new MandatoryFieldException(INSTANCE_ID, INSTANCE);

    ProficiencySets proficiencySet = ProficiencySets.create();
    proficiencySet.setOid(proficiencySetInstanceId);

    //set status code
    if (instance.getStatus().getCode().equals(STATUS_INACTIVE)) {

      // Validate if proficiency set can be restricted
      //Existing proficiency set
      if (!proficiencySetUUID.isEmpty()) {
        if (this.workForceProficiencyDAO
                .isProficiencySetRestrictionAllowed(proficiencySetUUID).equals(Boolean.TRUE)) {
          proficiencySet.setLifecycleStatusCode(1);
        } else {
          // Add the entry to the MDIObjectReplicationStatus Table, before raising the exception
          MDIObjectReplicationStatus mdiObjectReplicationStatus = MDIObjectReplicationStatus.create();
          mdiObjectReplicationStatus.setId(proficiencySetUUID);
          mdiObjectReplicationStatus.setEntityName(MDIEntities.WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION.getName());
          mdiObjectReplicationStatus.setExcludeStatus(Boolean.TRUE);
          this.mdiObjectReplicationStatusDAO.fillEntry(mdiObjectReplicationStatus);

          throw new ProficiencySetRestrictionException(workForceProficiencyDAO.getProficiencySetName(proficiencySetUUID), PROFICIENCY_SETS);
        }
      }
      else
      {
        //new proficiency set
        proficiencySet.setLifecycleStatusCode(1);
      }
    } else if (instance.getStatus().getCode().equals(STATUS_ACTIVE)) {
       proficiencySet.setLifecycleStatusCode(0);
    }

    // Set name
    if (!IsNullCheckUtils.isNullOrEmpty(instance.getName())) {
      List<LanguageContent> nameLanguageContents = instance.getName().stream().map(workforceProfScaleName -> {
        LanguageContent languageContent = LanguageContent.create();
        languageContent.setLang(workforceProfScaleName.getLang());
        languageContent.setContent(workforceProfScaleName.getContent());
        return languageContent;
      }).toList();
      proficiencySet.setName(this.commonUtility.getContent(nameLanguageContents));
    }

    // Set Description
    if (!IsNullCheckUtils.isNullOrEmpty(instance.getDescription())) {
      List<LanguageContent> descriptionLanguageContents = instance.getDescription().stream()
          .map(workforceProfScaleDesc -> {
            LanguageContent languageContent = LanguageContent.create();
            languageContent.setLang(workforceProfScaleDesc.getLang());
            languageContent.setContent(workforceProfScaleDesc.getContent());
            return languageContent;
          }).toList();

      proficiencySet.setDescription(this.commonUtility.getContent(descriptionLanguageContents));
    }

    proficiencySet.setIsCustom(false);
    List<ProficiencyLevels> proficiencyLevels = this.setProficiencyLevelDetails(instance.getProficiencyLevel(),
        proficiencySetUUID);
    proficiencySet.setProficiencyLevels(proficiencyLevels);
    return proficiencySet;
  }

  private List<ProficiencyLevels> setProficiencyLevelDetails(
      List<WorkforceCapabilityProficiency> workforceProficiencyLevels, String proficiencySetUUID) {
    if (IsNullCheckUtils.isNullOrEmpty(workforceProficiencyLevels))
      throw new MandatoryFieldException("proficiency levels", INSTANCE);
    List<ProficiencyLevels> proficiencyLevels = new ArrayList<>();
    try {
      for (WorkforceCapabilityProficiency proficiencyLevel : workforceProficiencyLevels) {
        ProficiencyLevels profLevel;
        if (IsNullCheckUtils.isNullOrEmpty(proficiencyLevel.getId()))
          throw new MandatoryFieldException("proficiencyLevelID", INSTANCE);
        if (IsNullCheckUtils.isNullOrEmpty(proficiencyLevel.getLevel()))
          throw new MandatoryFieldException("rank", INSTANCE);
        if ((profLevel = conversionService.convert(proficiencyLevel, ProficiencyLevels.class)) != null) {
          profLevel.setProficiencySetId(proficiencySetUUID);
          proficiencyLevels.add(profLevel);
        }
      }
    } catch (ConversionFailedException conversionFailedException) {
      LOGGER.error("Proficiency level attributes data conversion Failed", conversionFailedException);
    }
    return proficiencyLevels;
  }
}
