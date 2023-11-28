package com.sap.c4p.rm.replicationdao;

import com.sap.c4p.rm.cloudfoundry.service.masterdataintegration.MDIEntities;
import com.sap.c4p.rm.exceptions.TransactionException;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.Update;
import com.sap.cds.ql.Upsert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.ql.cqn.CqnUpsert;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;
import com.sap.resourcemanagement.consultantprofile.integration.OneMDSDeltaTokenInfo;
import com.sap.resourcemanagement.consultantprofile.integration.OneMDSDeltaTokenInfo_;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

/**
 * Class to implement {@link OneMDSReplicationDeltaTokenDAO}.
 */
@Repository
public class OneMDSReplicationDeltaTokenDAOImpl implements OneMDSReplicationDeltaTokenDAO {
    private static final Logger LOGGER = LoggerFactory.getLogger(OneMDSReplicationDeltaTokenDAOImpl.class);
    private static final String SYSTEM_USER = "System User";
    private static final String ONE_MDS_DELTA_TOKEN_INFO = "OneMDSDeltaTokenInfo";

    private final PersistenceService persistenceService;

    @Autowired
    public OneMDSReplicationDeltaTokenDAOImpl(final PersistenceService persistenceService) {
        this.persistenceService = persistenceService;
    }

    @Override
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
            throw new TransactionException(serviceException, "saving", ONE_MDS_DELTA_TOKEN_INFO);
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
    public boolean checkIsInitialLoadCandidate() {
        CqnSelect cqnSelect = Select.from(OneMDSDeltaTokenInfo_.class)
                .where(oneMDSDeltaTokenInfo -> oneMDSDeltaTokenInfo.deltaToken().isNotNull()
                        .and(oneMDSDeltaTokenInfo.isInitialLoadCandidate().is(Boolean.TRUE)));

        return this.persistenceService.run(cqnSelect).first(OneMDSDeltaTokenInfo.class).isPresent();
    }

    @Override
    @Transactional
    public void markReplicationAsInitialLoadCandidate(Boolean status) {
        try {
            OneMDSDeltaTokenInfo oneMDSDeltaTokenInfo = OneMDSDeltaTokenInfo.create();
            oneMDSDeltaTokenInfo.setIsInitialLoadCandidate(status);
            oneMDSDeltaTokenInfo.setModifiedAt(Instant.now());
            oneMDSDeltaTokenInfo.setModifiedBy(SYSTEM_USER);
            CqnUpdate cqnUpdate = Update.entity(OneMDSDeltaTokenInfo_.class).data(oneMDSDeltaTokenInfo);
            this.persistenceService.run(cqnUpdate);

            //TODO remove updation to skills table on migration to Central Services
            //Update Skills table
            com.sap.resourcemanagement.skill.integration.OneMDSDeltaTokenInfo oneMDSDeltaTokenInfoSkill = com.sap.resourcemanagement.skill.integration.OneMDSDeltaTokenInfo.create();
            oneMDSDeltaTokenInfoSkill.setIsInitialLoadCandidate(status);
            oneMDSDeltaTokenInfoSkill.setModifiedAt(Instant.now());
            oneMDSDeltaTokenInfoSkill.setModifiedBy(SYSTEM_USER);
            CqnUpdate cqnUpdateSkill = Update.entity(com.sap.resourcemanagement.skill.integration.OneMDSDeltaTokenInfo_.class).data(oneMDSDeltaTokenInfoSkill);
            this.persistenceService.run(cqnUpdateSkill);
        } catch (ServiceException exception) {
            LOGGER.error("Transactional Rollback in markReplicationAsInitialLoadCandidate while saving OneMDSDeltaTokenInfo");
            throw new TransactionException(exception, "updating", ONE_MDS_DELTA_TOKEN_INFO);
        }
    }

    @Transactional
    @Override
    public void markReplicationForInitialLoad(Marker loggingMarker) {
        try {
            OneMDSDeltaTokenInfo oneMDSDeltaTokenInfo = OneMDSDeltaTokenInfo.create();
            oneMDSDeltaTokenInfo.setPerformInitialLoad(Boolean.TRUE);
            oneMDSDeltaTokenInfo.setModifiedAt(Instant.now());
            oneMDSDeltaTokenInfo.setModifiedBy(SYSTEM_USER);
            CqnUpdate cqnUpdate = Update.entity(OneMDSDeltaTokenInfo_.class).data(oneMDSDeltaTokenInfo);
            this.persistenceService.run(cqnUpdate);

            //TODO remove updation to skills table on migration to Central Services
            //Update Skills table
            com.sap.resourcemanagement.skill.integration.OneMDSDeltaTokenInfo oneMDSDeltaTokenInfoSkill = com.sap.resourcemanagement.skill.integration.OneMDSDeltaTokenInfo.create();
            oneMDSDeltaTokenInfoSkill.setPerformInitialLoad(Boolean.TRUE);
            oneMDSDeltaTokenInfoSkill.setModifiedAt(Instant.now());
            oneMDSDeltaTokenInfoSkill.setModifiedBy(SYSTEM_USER);
            CqnUpdate cqnUpdateSkill = Update.entity(com.sap.resourcemanagement.skill.integration.OneMDSDeltaTokenInfo_.class).data(oneMDSDeltaTokenInfoSkill);
            this.persistenceService.run(cqnUpdateSkill);
        } catch (ServiceException exception) {
            LOGGER.error("Transactional Rollback in markReplicationForInitialLoad while saving OneMDSDeltaTokenInfo");
            throw new TransactionException(exception, "updating", ONE_MDS_DELTA_TOKEN_INFO);
        }
    }

}
