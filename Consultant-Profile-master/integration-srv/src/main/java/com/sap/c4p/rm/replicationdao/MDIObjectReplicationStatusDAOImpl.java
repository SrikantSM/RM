package com.sap.c4p.rm.replicationdao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.sap.cds.ql.*;
import com.sap.cds.ql.cqn.*;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.cloudfoundry.service.masterdataintegration.MDIEntities;

import com.sap.resourcemanagement.consultantprofile.integration.MDIObjectReplicationStatus;
import com.sap.resourcemanagement.consultantprofile.integration.MDIObjectReplicationStatus_;

@Repository
public class MDIObjectReplicationStatusDAOImpl implements MDIObjectReplicationStatusDAO {
    private final PersistenceService persistenceService;

    @Autowired
    public MDIObjectReplicationStatusDAOImpl(final PersistenceService persistenceService) {
        this.persistenceService = persistenceService;
    }

    @Override
    public void fillEntity(List<MDIObjectReplicationStatus> mdiObjectReplicationStatusList) {
        CqnUpsert cqnUpsert = Upsert.into(MDIObjectReplicationStatus_.class).entries(mdiObjectReplicationStatusList);
        this.persistenceService.run(cqnUpsert);
    }

    @Override
    public List<MDIObjectReplicationStatus> readAll(MDIEntities entity) {
        CqnSelect cqnSelect = Select.from(MDIObjectReplicationStatus_.class)
                .where(mdiObjectReplicationStatus -> mdiObjectReplicationStatus.entityName().eq(entity.getName()));
        return this.persistenceService.run(cqnSelect).listOf(MDIObjectReplicationStatus.class);
    }

    @Override
    public void delete(MDIEntities entity) {
        CqnDelete cqnDelete = Delete.from(MDIObjectReplicationStatus_.class)
                .where(mdiObjectReplicationStatus -> mdiObjectReplicationStatus.entityName().eq(entity.getName()));
        this.persistenceService.run(cqnDelete);
    }

    @Override
    public void delete(MDIEntities entity, String id) {
        CqnDelete cqnDelete = Delete.from(MDIObjectReplicationStatus_.class)
                .where(mdiObjectReplicationStatus -> mdiObjectReplicationStatus.entityName().eq(entity.getName())
                        .and(mdiObjectReplicationStatus.ID().eq(id)));
        this.persistenceService.run(cqnDelete);
    }

}
