package com.sap.c4p.rm.skill.mdiintegration.replicationdao;

import static com.sap.c4p.rm.skill.mdiintegration.utils.Constants.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.sap.cds.ql.Update;
import com.sap.cds.ql.Upsert;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.ql.cqn.CqnUpsert;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.model.JobScheduleRunPayload;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.service.JobSchedulerService;
import com.sap.c4p.rm.skill.mdiintegration.exceptions.ReplicationException;
import com.sap.c4p.rm.skill.mdiintegration.exceptions.TransactionException;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dto.CapabilityValue;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dto.WorkforceCapability;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapabilitycatalog.dto.CatalogValue;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapabilitycatalog.dto.WorkforceCapabilityCatalog;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dto.ProficiencyValue;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dto.WorkforceCapabilityProficiencyScale;
import com.sap.c4p.rm.skill.mdiintegration.utils.CommonUtility;
import com.sap.c4p.rm.skill.mdiintegration.utils.IsNullCheckUtils;
import com.sap.c4p.rm.skill.mdiintegration.utils.LanguageContent;
import com.sap.c4p.rm.skill.mdiintegration.utils.StringFormatter;

import com.sap.resourcemanagement.skill.integration.ReplicationFailures;
import com.sap.resourcemanagement.skill.integration.ReplicationFailures_;

/**
 * Class to implement {@link ReplicationFailureDAO}.
 */
@Repository
public class ReplicationFailureDAOImpl implements ReplicationFailureDAO {

  private static final Logger LOGGER = LoggerFactory.getLogger(ReplicationFailureDAOImpl.class);

  private static final String REPLICATION_FAILURES = "ReplicationFailures";
  private static final String INSTANCE_ID = "Instance Id";
  private static final String VERSION_ID = "Version Id";
  private static final String EVENT = "Event";
  private static final String MESSAGE = "Message";
  private static final String SAVING = "saving";

  private final JobSchedulerService jobSchedulerService;
  private final PersistenceService persistenceService;
  private final ReplicationErrorMessagesDAO replicationErrorMessagesDAO;

  private final CommonUtility commonUtility;

  @Autowired
  public ReplicationFailureDAOImpl(final JobSchedulerService jobSchedulerService,
      final PersistenceService persistenceService, final ReplicationErrorMessagesDAO replicationErrorMessagesDAO,
      CommonUtility commonUtility) {
    this.jobSchedulerService = jobSchedulerService;
    this.persistenceService = persistenceService;
    this.replicationErrorMessagesDAO = replicationErrorMessagesDAO;
    this.commonUtility = commonUtility;
  }

  @Override
  public void update(final Marker loggingMarker, final ReplicationFailures replicationFailure) {
    CqnUpdate cqnUpdate = Update.entity(ReplicationFailures_.CDS_NAME).data(replicationFailure);
    try {
      this.persistenceService.run(cqnUpdate);
    } catch (ServiceException serviceException) {
      LOGGER.error(loggingMarker, "Error occurred while updating ReplicationFailures Information");
      throw new TransactionException(serviceException, "updating", REPLICATION_FAILURES);
    }
  }

  @Override
  public void saveWorkforceCapabilityCatalogReplicationFailure(final Marker loggingMarker,
      final ReplicationException replicationException, CatalogValue catalogValue, final String subDomain,
      final JobSchedulerRunHeader jobSchedulerRunHeader) {
    String versionId = catalogValue.getVersionId();
    String logEvent = catalogValue.getEvent();
    WorkforceCapabilityCatalog instance = catalogValue.getInstance();
    String instanceId = instance.getId();

    String workForceCapabilityCatalogName = null;

    if (!IsNullCheckUtils.isNullOrEmpty(instance.getName())) {
      List<LanguageContent> nameLanguageContents = instance.getName().stream().map(catalogName -> {
        LanguageContent languageContent = LanguageContent.create();
        languageContent.setLang(catalogName.getLang());
        languageContent.setContent(catalogName.getContent());
        return languageContent;
      }).toList();
      workForceCapabilityCatalogName = this.commonUtility.getContent(nameLanguageContents);
    }

    ReplicationFailures replicationFailures = prepareReplicationFailureObject(versionId, logEvent, instanceId,
        workForceCapabilityCatalogName, REPLICATION_TYPE_WORKFORCE_CAPABILITY_CATALOG, replicationException);
    LOGGER.info("Replication Failures {} ", replicationFailures);
    CqnUpsert upsert = Upsert.into(ReplicationFailures_.CDS_NAME).entry(replicationFailures);

    Map<String, String> jsonObject = new HashMap<>();
    jsonObject.put("WorkforceCapabilityCatalogName", workForceCapabilityCatalogName);
    JobScheduleRunPayload jobScheduleRunPayload = this.prepareJobScheduleRunPayload(jsonObject, instanceId, versionId,
        logEvent, replicationException);

    try {
      this.jobSchedulerService.updateJobRun(loggingMarker, subDomain, jobSchedulerRunHeader, jobScheduleRunPayload);
      this.persistenceService.run(upsert);
    } catch (ServiceException serviceException) {
      LOGGER.error(loggingMarker,
          "Error occurred while saving WorkforceCapabilityCatalog ReplicationFailures Information");
      throw new TransactionException(serviceException, SAVING, REPLICATION_FAILURES);
    }
  }

  @Override
  public void saveWorkforceCapabilityProfScaleReplicationFailure(final Marker loggingMarker,
      final ReplicationException replicationException, final ProficiencyValue proficiencyValue, final String subDomain,
      final JobSchedulerRunHeader jobSchedulerRunHeader) {
    String versionId = proficiencyValue.getVersionId();
    String logEvent = proficiencyValue.getEvent();
    WorkforceCapabilityProficiencyScale instance = proficiencyValue.getInstance();
    String instanceId = instance.getId();

    String workforceCapabilityProfScaleName = null;

    if (!IsNullCheckUtils.isNullOrEmpty(instance.getName())) {
      List<LanguageContent> nameLanguageContents = instance.getName().stream().map(profScaleName -> {
        LanguageContent languageContent = LanguageContent.create();
        languageContent.setLang(profScaleName.getLang());
        languageContent.setContent(profScaleName.getContent());
        return languageContent;
      }).toList();
      workforceCapabilityProfScaleName = this.commonUtility.getContent(nameLanguageContents);
    }

    ReplicationFailures replicationFailures = prepareReplicationFailureObject(versionId, logEvent, instanceId,
        workforceCapabilityProfScaleName, REPLICATION_TYPE_WORKFORCE_PROFICIENCY_SCALE, replicationException);
    LOGGER.info("Replication Failures {} ", replicationFailures);
    CqnUpsert upsert = Upsert.into(ReplicationFailures_.CDS_NAME).entry(replicationFailures);

    Map<String, String> jsonObject = new HashMap<>();
    jsonObject.put("WorkforceCapabilityProficiencyScaleName", workforceCapabilityProfScaleName);
    JobScheduleRunPayload jobScheduleRunPayload = this.prepareJobScheduleRunPayload(jsonObject, instanceId, versionId,
        logEvent, replicationException);

    try {
      this.jobSchedulerService.updateJobRun(loggingMarker, subDomain, jobSchedulerRunHeader, jobScheduleRunPayload);
      this.persistenceService.run(upsert);
    } catch (ServiceException serviceException) {
      LOGGER.error(loggingMarker,
          "Error occurred while saving WorkforceCapabilityProficiencyScale ReplicationFailures Information");
      throw new TransactionException(serviceException, SAVING, REPLICATION_FAILURES);
    }
  }

  private JobScheduleRunPayload prepareJobScheduleRunPayload(final Map<String, String> jsonObject,
      final String instanceId, final String versionId, final String logEvent,
      final ReplicationException replicationException) {
    jsonObject.put(INSTANCE_ID, instanceId);
    jsonObject.put(VERSION_ID, versionId);
    jsonObject.put(EVENT, logEvent);

    Throwable throwable;

    if ((throwable = replicationException.getThrowable()) != null)
      jsonObject.put(MESSAGE, throwable.getLocalizedMessage());
    else
      jsonObject.put(MESSAGE,
          StringFormatter.format(
              this.replicationErrorMessagesDAO.getReplicationErrorMessages()
                  .get(replicationException.getReplicationErrorCode().getErrorCode()),
              replicationException.getParameters().toArray()));

    return new JobScheduleRunPayload(true, jsonObject.toString());
  }

  private ReplicationFailures prepareReplicationFailureObject(final String versionId, final String logEvent,
      final String instanceId, final String externalId, final String replicationType,
      final ReplicationException replicationException) {
    ReplicationFailures replicationFailures = ReplicationFailures.create();
    replicationFailures.setVersionId(versionId);
    replicationFailures.setEvent(logEvent);
    replicationFailures.setInstanceId(instanceId);
    replicationFailures.setExternalId(externalId);
    replicationFailures.setReplicationType(replicationType);
    replicationFailures.setReplicationFailureStatusCode(REPLICATION_FAILURE_STATUS_OPEN);
    replicationFailures.setReplicationErrorMessageCode(replicationException.getReplicationErrorCode().getErrorCode());
    List<String> errorParams = replicationException.getParameters();
    String errorParam1;
    if ((errorParam1 = errorParams.get(0)) != null)
      replicationFailures.setErrorParam1(errorParam1);
    String errorParam2;
    if ((errorParam2 = errorParams.get(1)) != null)
      replicationFailures.setErrorParam2(errorParam2);
    String errorParam3;
    if ((errorParam3 = errorParams.get(2)) != null)
      replicationFailures.setErrorParam3(errorParam3);
    String errorParam4;
    if ((errorParam4 = errorParams.get(3)) != null)
      replicationFailures.setErrorParam4(errorParam4);
    return replicationFailures;
  }

  @Override
  public void saveWorkforceCapabilityReplicationFailure(Marker loggingMarker, ReplicationException replicationException,
      CapabilityValue capabilityValue, String subDomain, JobSchedulerRunHeader jobSchedulerRunHeader) {
    String versionId = capabilityValue.getVersionId();
    String logEvent = capabilityValue.getEvent();
    WorkforceCapability instance = capabilityValue.getInstance();
    String instanceId = instance.getid();

    String workForceCapabilityName = null;

    if (!IsNullCheckUtils.isNullOrEmpty(instance.getName())) {
      List<LanguageContent> nameLanguageContents = instance.getName().stream().map(capabilityName -> {
        LanguageContent languageContent = LanguageContent.create();
        languageContent.setLang(capabilityName.getLang());
        languageContent.setContent(capabilityName.getContent());
        return languageContent;
      }).toList();
      workForceCapabilityName = this.commonUtility.getContent(nameLanguageContents);
    }

    ReplicationFailures replicationFailures = prepareReplicationFailureObject(versionId, logEvent, instanceId,
        workForceCapabilityName, REPLICATION_TYPE_WORKFORCE_CAPABILITY, replicationException);
    LOGGER.info("Replication Failures {} ", replicationFailures);
    CqnUpsert upsert = Upsert.into(ReplicationFailures_.CDS_NAME).entry(replicationFailures);

    Map<String, String> jsonObject = new HashMap<>();
    jsonObject.put("WorkforceCapabilityName", workForceCapabilityName);
    JobScheduleRunPayload jobScheduleRunPayload = this.prepareJobScheduleRunPayload(jsonObject, instanceId, versionId,
        logEvent, replicationException);

    try {
      this.jobSchedulerService.updateJobRun(loggingMarker, subDomain, jobSchedulerRunHeader, jobScheduleRunPayload);
      this.persistenceService.run(upsert);
    } catch (ServiceException serviceException) {
      LOGGER.error(loggingMarker, "Error occurred while saving WorkforceCapability ReplicationFailures Information");
      throw new TransactionException(serviceException, SAVING, REPLICATION_FAILURES);
    }
  }

  @Override
  public void saveReplicationFailure(final Marker loggingMarker, final ReplicationException replicationException,
                              final String entityID, final String replicationType,
                              final String subDomain, final JobSchedulerRunHeader jobSchedulerRunHeader) {

    String logEvent = "ProcessFailedEntries";

    //Since the entries that were deleted/excluded in MDI and not received in RM are calculated in RM and not flown in via MDI
    //These entries would not have a versionId, instanceId- hence passing an empty string
    String emptyString = "";

    ReplicationFailures replicationFailures = prepareReplicationFailureObject(emptyString, logEvent, emptyString,
            entityID, replicationType, replicationException);
    LOGGER.info("Replication Failures {} ", replicationFailures);
    CqnUpsert upsert = Upsert.into(ReplicationFailures_.CDS_NAME).entry(replicationFailures);

    Map<String, String> jsonObject = new HashMap<>();
    jsonObject.put("ID", entityID);
    JobScheduleRunPayload jobScheduleRunPayload = this.prepareJobScheduleRunPayload(jsonObject, emptyString, emptyString,
            logEvent, replicationException);

    try {
      this.jobSchedulerService.updateJobRun(loggingMarker, subDomain, jobSchedulerRunHeader, jobScheduleRunPayload);
      this.persistenceService.run(upsert);
    } catch (ServiceException serviceException) {
      LOGGER.error(loggingMarker, "Error occurred while saving ReplicationFailures Information");
      throw new TransactionException(serviceException, SAVING, REPLICATION_FAILURES);
    }
  }
}
