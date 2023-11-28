package com.sap.c4p.rm.skill.mdiintegration.replicationdao;

import java.time.Instant;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.sap.cds.ql.Select;
import com.sap.cds.ql.Update;
import com.sap.cds.ql.Upsert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.ql.cqn.CqnUpsert;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.masterdataintegration.MDIEntities;
import com.sap.c4p.rm.skill.mdiintegration.exceptions.TransactionException;

import com.sap.resourcemanagement.skill.integration.OneMDSDeltaTokenInfo;
import com.sap.resourcemanagement.skill.integration.OneMDSDeltaTokenInfo_;

/**
 * Class to implement {@link OneMDSReplicationDeltaTokenDAO}.
 */
@Repository
public class OneMDSReplicationDeltaTokenDAOImpl implements OneMDSReplicationDeltaTokenDAO {
  private static final Logger LOGGER = LoggerFactory.getLogger(OneMDSReplicationDeltaTokenDAOImpl.class);
  private static final String SYSTEM_USER = "System User";

  private final PersistenceService persistenceService;

  @Autowired
  public OneMDSReplicationDeltaTokenDAOImpl(final PersistenceService persistenceService) {
    this.persistenceService = persistenceService;
  }

  @Override
  @Transactional
  public void save(final Marker loggingMarker, final MDIEntities entity, final String deltaToken) {
    OneMDSDeltaTokenInfo oneMDSDeltaTokenInfo = OneMDSDeltaTokenInfo.create();
    oneMDSDeltaTokenInfo.setEntityName(entity.getName());
    oneMDSDeltaTokenInfo.setDeltaToken(deltaToken);
    oneMDSDeltaTokenInfo.setPerformInitialLoad(Boolean.FALSE);
    oneMDSDeltaTokenInfo.setModifiedAt(Instant.now());
    oneMDSDeltaTokenInfo.setModifiedBy(SYSTEM_USER);
    CqnUpsert upsertQuery = Upsert.into(OneMDSDeltaTokenInfo_.CDS_NAME).entry(oneMDSDeltaTokenInfo);
    try {
      this.persistenceService.run(upsertQuery);
    } catch (ServiceException serviceException) {
      LOGGER.error(loggingMarker, "Error occurred while saving OneMDSDeltaToken Information");
      throw new TransactionException(serviceException, "saving", "OneMDSDeltaTokenInfo");
    }
    // Update CP table - Temporary solution until the code base is moved to Central
    // services
    com.sap.resourcemanagement.consultantprofile.integration.OneMDSDeltaTokenInfo oneMDSDeltaTokenInfoCP = com.sap.resourcemanagement.consultantprofile.integration.OneMDSDeltaTokenInfo
        .create();
    oneMDSDeltaTokenInfoCP.setEntityName(entity.getName());
    oneMDSDeltaTokenInfoCP.setDeltaToken(deltaToken);
    oneMDSDeltaTokenInfoCP.setPerformInitialLoad(Boolean.FALSE);
    oneMDSDeltaTokenInfoCP.setModifiedAt(Instant.now());
    oneMDSDeltaTokenInfoCP.setModifiedBy(SYSTEM_USER);
    CqnUpsert upsertQueryCP = Upsert
        .into(com.sap.resourcemanagement.consultantprofile.integration.OneMDSDeltaTokenInfo_.CDS_NAME)
        .entry(oneMDSDeltaTokenInfoCP);
    try {
      this.persistenceService.run(upsertQueryCP);
    } catch (ServiceException serviceException) {
      LOGGER.error(loggingMarker, "Error occurred while saving OneMDSDeltaToken Information in CP");
      throw new TransactionException(serviceException, "saving", "OneMDSDeltaTokenInfoCP");
    }
  }

  @Override
  public Optional<OneMDSDeltaTokenInfo> getDeltaToken(final MDIEntities entity) {
    CqnSelect cqnSelect = Select.from(OneMDSDeltaTokenInfo_.class)
        .where(oneMDSDeltaTokenInfo -> oneMDSDeltaTokenInfo.entityName().eq(entity.getName())
            .and(oneMDSDeltaTokenInfo.deltaToken().isNotNull())
            .and(oneMDSDeltaTokenInfo.performInitialLoad().eq(false)))
        .columns(OneMDSDeltaTokenInfo_::deltaToken);
    return this.persistenceService.run(cqnSelect).first(OneMDSDeltaTokenInfo.class);
  }

  @Override
  @Transactional
  public void markReplicationAsInitialLoadCandidate(Boolean status) {
    OneMDSDeltaTokenInfo oneMDSDeltaTokenInfo = OneMDSDeltaTokenInfo.create();
    oneMDSDeltaTokenInfo.setIsInitialLoadCandidate(status);
    oneMDSDeltaTokenInfo.setModifiedAt(Instant.now());
    oneMDSDeltaTokenInfo.setModifiedBy(SYSTEM_USER);
    CqnUpdate cqnUpdate = Update.entity(OneMDSDeltaTokenInfo_.class).data(oneMDSDeltaTokenInfo);
    this.persistenceService.run(cqnUpdate);

    // Update CP Table - Temporary solution until the code base is moved to Central
    // services
    com.sap.resourcemanagement.consultantprofile.integration.OneMDSDeltaTokenInfo oneMDSDeltaTokenInfoCP = com.sap.resourcemanagement.consultantprofile.integration.OneMDSDeltaTokenInfo
        .create();
    oneMDSDeltaTokenInfoCP.setIsInitialLoadCandidate(status);
    oneMDSDeltaTokenInfoCP.setModifiedAt(Instant.now());
    oneMDSDeltaTokenInfoCP.setModifiedBy(SYSTEM_USER);
    CqnUpdate cqnUpdateCP = Update
        .entity(com.sap.resourcemanagement.consultantprofile.integration.OneMDSDeltaTokenInfo_.class)
        .data(oneMDSDeltaTokenInfoCP);
    this.persistenceService.run(cqnUpdateCP);
  }

  @Override
  @Transactional
  public void markReplicationForInitialLoad(Marker loggingMarker) {
    OneMDSDeltaTokenInfo oneMDSDeltaTokenInfo = OneMDSDeltaTokenInfo.create();
    oneMDSDeltaTokenInfo.setPerformInitialLoad(Boolean.TRUE);
    oneMDSDeltaTokenInfo.setModifiedAt(Instant.now());
    oneMDSDeltaTokenInfo.setModifiedBy(SYSTEM_USER);
    CqnUpdate cqnUpdate = Update.entity(OneMDSDeltaTokenInfo_.class).data(oneMDSDeltaTokenInfo);
    this.persistenceService.run(cqnUpdate);

    // Update CP table - Temporary solution until the code base is moved to Central
    // services
    com.sap.resourcemanagement.consultantprofile.integration.OneMDSDeltaTokenInfo oneMDSDeltaTokenInfoCP = com.sap.resourcemanagement.consultantprofile.integration.OneMDSDeltaTokenInfo
        .create();
    oneMDSDeltaTokenInfoCP.setPerformInitialLoad(Boolean.TRUE);
    oneMDSDeltaTokenInfoCP.setModifiedAt(Instant.now());
    oneMDSDeltaTokenInfoCP.setModifiedBy(SYSTEM_USER);
    CqnUpdate cqnUpdateCP = Update
        .entity(com.sap.resourcemanagement.consultantprofile.integration.OneMDSDeltaTokenInfo_.class)
        .data(oneMDSDeltaTokenInfoCP);
    this.persistenceService.run(cqnUpdateCP);
  }

}
