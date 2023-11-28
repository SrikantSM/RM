package com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability;

import com.sap.c4p.rm.skill.config.LoggingMarker;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.masterdataintegration.MDIEntities;
import com.sap.c4p.rm.skill.mdiintegration.exceptions.*;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dao.WorkforceCapabilityDAO;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dao.WorkforceCapabilityReplicationDAO;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dto.CapabilityValue;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dto.WorkforceCapability;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dto.WorkforceCapabilityCatalogAssignment;
import com.sap.c4p.rm.skill.mdiintegration.replicationdao.MDIObjectReplicationStatusDAO;
import com.sap.c4p.rm.skill.mdiintegration.replicationdao.ReplicationFailureDAO;
import com.sap.c4p.rm.skill.mdiintegration.utils.CommonUtility;
import com.sap.c4p.rm.skill.mdiintegration.utils.IsNullCheckUtils;
import com.sap.c4p.rm.skill.mdiintegration.utils.LanguageContent;
import com.sap.cds.Row;
import com.sap.resourcemanagement.skill.*;
import com.sap.resourcemanagement.skill.integration.MDIObjectReplicationStatus;
import com.sap.resourcemanagement.skill.integration.ReplicationFailures;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

import static com.sap.c4p.rm.skill.mdiintegration.utils.Constants.*;

@Component
public class WorkforceCapabilityMDIEventsAPIProcessor {

  private static final Logger LOGGER = LoggerFactory.getLogger(WorkforceCapabilityMDIEventsAPIProcessor.class);
  private static final Marker WORKFORCE_CAPABILITY_REPLICATION = LoggingMarker.WORKFORCE_CAPABILITY_REPLICATION
      .getMarker();
  private final WorkforceCapabilityReplicationDAO workforceCapabilityReplicationDAO;
  private final WorkforceCapabilityDAO workforceCapabilityDAO;
  private final ReplicationFailureDAO replicationFailureDAO;
  private final CommonUtility commonUtility;
  private final MDIObjectReplicationStatusDAO mdiObjectReplicationStatusDAO;

  public static final String CATALOGS = "Catalogs";
  public static final String PROFICIENCY_SETS = "ProficiencySets";

  public static final String SKILLS = "Skills";
  public static final String STATUS_ACTIVE = "ACTIVE";
  public static final String STATUS_INACTIVE = "INACTIVE";

  @Autowired
  public WorkforceCapabilityMDIEventsAPIProcessor(
          final WorkforceCapabilityReplicationDAO workforceCapabilityReplicationDAO,
          final WorkforceCapabilityDAO workforceCapabilityDAO, ReplicationFailureDAO replicationFailureDAO,
          CommonUtility commonUtility, MDIObjectReplicationStatusDAO mdiObjectReplicationStatusDAO) {
    // For DAO
    this.workforceCapabilityReplicationDAO = workforceCapabilityReplicationDAO;
    this.workforceCapabilityDAO = workforceCapabilityDAO;
    this.replicationFailureDAO = replicationFailureDAO;
    this.commonUtility = commonUtility;
    this.mdiObjectReplicationStatusDAO = mdiObjectReplicationStatusDAO;
  }

  public Integer processWorkforceCapabilityLog(final List<CapabilityValue> workforcecapabilitylogs,
      final String subDomain, final JobSchedulerRunHeader jobSchedulerRunHeader) {
    AtomicInteger successRecords = new AtomicInteger(0);
    workforcecapabilitylogs.forEach(workForceProficiencyLog -> this.processMDILog(workForceProficiencyLog,
        successRecords, subDomain, jobSchedulerRunHeader));
    return successRecords.get();
  }

  private void processMDILog(CapabilityValue workforcecapabilitylogs, AtomicInteger successRecords, String subDomain,
      JobSchedulerRunHeader jobSchedulerRunHeader) {
    WorkforceCapability instance;
    String eventFromAPI = workforcecapabilitylogs.getEvent();
    String versionId = workforcecapabilitylogs.getVersionId();
    try {
      if (eventFromAPI.equals("created") || eventFromAPI.equals("included") || eventFromAPI.equals("updated")) {
        if ((instance = workforcecapabilitylogs.getInstance()) != null) {
          if (IsNullCheckUtils.isNullOrEmpty(instance.getid()))
            throw new MandatoryFieldException(INSTANCE_ID, INSTANCE);
          LOGGER.info(WORKFORCE_CAPABILITY_REPLICATION, MDI_LOG_PROCESSOR_INIT_MESSAGE, eventFromAPI, versionId,
              instance.getid());

          processCreateUpdateEvent(instance);
        }
      } else if (eventFromAPI.equals("deleted") || eventFromAPI.equals("excluded")) {
        String excludedId;
        if ((excludedId = workforcecapabilitylogs.getInstance().getid()) != null) {
          LOGGER.info(WORKFORCE_CAPABILITY_REPLICATION, MDI_LOG_PROCESSOR_INIT_MESSAGE, eventFromAPI, versionId,
                  excludedId);
          processDeleteEvent(excludedId);
        }
      } else {
        LOGGER.info(WORKFORCE_CAPABILITY_REPLICATION, "Skipping {} event", eventFromAPI);
      }
      successRecords.getAndIncrement();
    } catch (ReplicationException replicationException) {
      this.replicationFailureDAO.saveWorkforceCapabilityReplicationFailure(WORKFORCE_CAPABILITY_REPLICATION,
          replicationException, workforcecapabilitylogs, subDomain, jobSchedulerRunHeader);
    } catch (Exception exception) {
      LOGGER.info(WORKFORCE_CAPABILITY_REPLICATION, exception.getLocalizedMessage(), exception);
    }
  }

  private void processCreateUpdateEvent(WorkforceCapability instance) {
    ReplicationFailures replicationFailures = ReplicationFailures.create();
    replicationFailures.setInstanceId(instance.getid());
    replicationFailures.setReplicationFailureStatusCode(REPLICATION_FAILURE_STATUS_CLOSED);

    Skills skills = this.startProcess(instance.getid(), instance);
    String skillUUID = null;

    if (!IsNullCheckUtils.isNullOrEmpty(skills.getId())) {
      skillUUID = skills.getId();
    }
    List<Catalogs2Skills> catalogs2SkillsList = this.setCatalog2Skills(instance, skillUUID);

    if (skillUUID != null) {
      this.workforceCapabilityReplicationDAO.update(skills, catalogs2SkillsList, replicationFailures);
    } else {
      this.workforceCapabilityReplicationDAO.save(skills, catalogs2SkillsList, replicationFailures);
    }
  }

  private void processDeleteEvent(String excludedId) {
    ReplicationFailures replicationFailures = ReplicationFailures.create();
    replicationFailures.setInstanceId(excludedId);
    replicationFailures.setReplicationFailureStatusCode(REPLICATION_FAILURE_STATUS_CLOSED);

    Row existingSkill = this.workforceCapabilityDAO
            .getExistingSkill(excludedId);

    if (existingSkill != null) {
      String existingSkillId = existingSkill.get(Skills.ID).toString();
        this.workforceCapabilityReplicationDAO.restrictSkill(existingSkillId, replicationFailures);
    } else {
      throw new RecordNotFoundException(excludedId, SKILLS);
    }
  }

  public void takeExistingSkillSnapShot() {

    List<MDIObjectReplicationStatus> mdiObjectReplicationStatusList = new ArrayList<>();
    this.workforceCapabilityDAO.readAll().forEach(skill -> {
      MDIObjectReplicationStatus mdiObjectReplicationStatus = MDIObjectReplicationStatus.create();
      mdiObjectReplicationStatus.setId(skill.getId());
      mdiObjectReplicationStatus.setEntityName(MDIEntities.WORKFORCE_CAPABILITY_REPLICATION.getName());
      mdiObjectReplicationStatus.setExcludeStatus(Boolean.TRUE);
      mdiObjectReplicationStatusList.add(mdiObjectReplicationStatus);
    });
    this.mdiObjectReplicationStatusDAO.delete(MDIEntities.WORKFORCE_CAPABILITY_REPLICATION);
    if (!mdiObjectReplicationStatusList.isEmpty()) {
      this.mdiObjectReplicationStatusDAO.fillEntity(mdiObjectReplicationStatusList);
    }
  }

  public void cleanSkillSnapShot(final String subDomain,
                                 final JobSchedulerRunHeader jobSchedulerRunHeader) {
    List<MDIObjectReplicationStatus> mdiObjectReplicationStatusList = this.mdiObjectReplicationStatusDAO
            .readAll(MDIEntities.WORKFORCE_CAPABILITY_REPLICATION);
    mdiObjectReplicationStatusList.forEach(mdiObjectReplicationStatus -> {
      ReplicationFailures replicationFailures = ReplicationFailures.create();
      replicationFailures.setInstanceId(mdiObjectReplicationStatus.getId());
      replicationFailures.setReplicationFailureStatusCode(REPLICATION_FAILURE_STATUS_CLOSED);
      try {
        this.workforceCapabilityReplicationDAO.restrictSkill(mdiObjectReplicationStatus.getId(), replicationFailures);
      }catch (ReplicationException replicationException) {
        this.replicationFailureDAO.saveReplicationFailure(WORKFORCE_CAPABILITY_REPLICATION,
                replicationException, mdiObjectReplicationStatus.getId(), REPLICATION_TYPE_WORKFORCE_CAPABILITY , subDomain, jobSchedulerRunHeader);
      } catch (Exception exception) {
        LOGGER.info(WORKFORCE_CAPABILITY_REPLICATION, exception.getLocalizedMessage(), exception);
      }
    });
  }


  private Skills startProcess(String instanceID, WorkforceCapability instance) {
    if (IsNullCheckUtils.isNullOrEmpty(instanceID))
      throw new MandatoryFieldException(INSTANCE_ID, INSTANCE);
    if (IsNullCheckUtils.isNullOrEmpty(instance.getProficiencyScale()))
      throw new MandatoryFieldException("proficiency set", INSTANCE);

    Skills skills = Skills.create();
    skills.setOid(instanceID);

    // Set existing skill UUID
    Row existingSkill = this.workforceCapabilityDAO.getExistingSkill(instanceID);
    if (existingSkill != null) {
      skills.setId(existingSkill.get(Skills.ID).toString());
    }

    // set status code
    if (instance.getStatus().getCode().equals(STATUS_ACTIVE)) {
      skills.setLifecycleStatusCode(0);
    } else if (instance.getStatus().getCode().equals(STATUS_INACTIVE)) {
      skills.setLifecycleStatusCode(1);
    }

    // Set name
    List<LanguageContent> skillNameContents = new ArrayList<>();
    if (!IsNullCheckUtils.isNullOrEmpty(instance.getName())) {
      skillNameContents = this.commonUtility.prepareLanguageContents(instance.getName());
      skills.setName(this.commonUtility.getContent(skillNameContents));
    }

   //Set Proficiency Set
    Row existingProfSet = this.workforceCapabilityDAO.getExistingProfID(instance.getProficiencyScale().getID());

    if (existingProfSet != null) {
      if ((((Integer) existingProfSet.get(ProficiencySets.LIFECYCLE_STATUS_CODE)).equals(1)) && skills.getLifecycleStatusCode().equals(0))
      {
        throw new RestrictedProfSetAsstException(existingProfSet.get(ProficiencySets.NAME).toString(), skills.getName());
      }
      else {
        skills.setProficiencySetId(existingProfSet.get(ProficiencySets.ID).toString());
      }
    } else {
      throw new RecordNotFoundException(instance.getProficiencyScale().getID(), PROFICIENCY_SETS);
    }

    // Set Description
    List<LanguageContent> skillDescriptionContents = new ArrayList<>();
    if (!IsNullCheckUtils.isNullOrEmpty(instance.getDescription())) {
      skillDescriptionContents = this.commonUtility.prepareLanguageContents(instance.getDescription());
      skills.setDescription(this.commonUtility.getContent(skillDescriptionContents));
    }

    // Set Texts
    skills.setTexts(this.convertSkillTexts(skillNameContents, skillDescriptionContents));
    return skills;
  }

  private List<Catalogs2Skills> setCatalog2Skills(WorkforceCapability workForceCapability, String skillUUID) {
    List<Catalogs2Skills> catalogs2SkillsList = new ArrayList<>();
    if (!IsNullCheckUtils.isNullOrEmpty(workForceCapability.getCatalogAssignment())) {
      for (WorkforceCapabilityCatalogAssignment workforceCapabilityCatalogAssignment : workForceCapability
          .getCatalogAssignment()) {
        Catalogs2Skills catalogs2Skills = Catalogs2Skills.create();
        Row existingCatalog = workforceCapabilityDAO
            .getExistingCatalogID(workforceCapabilityCatalogAssignment.getCatalog().getID());
        if (!IsNullCheckUtils.isNullOrEmpty(existingCatalog)) {
          catalogs2Skills.setId(UUID.randomUUID().toString());
          catalogs2Skills.setCatalogId(existingCatalog.get(Catalogs.ID).toString());
          if (!IsNullCheckUtils.isNullOrEmpty(skillUUID)) {
            catalogs2Skills.setSkillId(skillUUID);
          }
          catalogs2SkillsList.add(catalogs2Skills);
        } else {
          throw new RecordNotFoundException(workforceCapabilityCatalogAssignment.getCatalog().getID(), CATALOGS);
        }
      }
    }
    return catalogs2SkillsList;
  }

  private List<SkillsTexts> convertSkillTexts(List<LanguageContent> skillNameContents, List<LanguageContent> skillDescContents) {
    Map<String, SkillsTexts> map = new HashMap<>();
    for(LanguageContent languageContent :  skillNameContents)
    {
      SkillsTexts skillsName = SkillsTexts.create();
      skillsName.setLocale(languageContent.getLang());
      skillsName.setName(languageContent.getContent());
      map.put(languageContent.getLang(), skillsName);
    }

    for(LanguageContent languageContent :  skillDescContents)
    {

      if(map.containsKey(languageContent.getLang())) {
        map.get(languageContent.getLang()).setDescription(languageContent.getContent());
      }
      else
      {
        SkillsTexts skillsDesc = SkillsTexts.create();
        skillsDesc.setLocale(languageContent.getLang());
        skillsDesc.setDescription(languageContent.getContent());
        map.put(languageContent.getLang(), skillsDesc);

      }
    }
    return new ArrayList<>(map.values());
  }
}

