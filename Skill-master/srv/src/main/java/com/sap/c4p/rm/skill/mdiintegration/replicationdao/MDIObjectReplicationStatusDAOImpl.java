package com.sap.c4p.rm.skill.mdiintegration.replicationdao;

import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.masterdataintegration.MDIEntities;
import com.sap.cds.ql.Delete;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.Upsert;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpsert;
import com.sap.cds.services.persistence.PersistenceService;
import com.sap.resourcemanagement.skill.integration.MDIObjectReplicationStatus;
import com.sap.resourcemanagement.skill.integration.MDIObjectReplicationStatus_;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

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
        .where(mdiObjectReplicationStatus -> mdiObjectReplicationStatus.entityName().eq(entity.getName())
                .and(mdiObjectReplicationStatus.excludeStatus().eq(Boolean.TRUE)));
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

  @Override
  public void fillEntry(MDIObjectReplicationStatus mdiObjectReplicationStatus) {
    CqnUpsert cqnUpsert = Upsert.into(MDIObjectReplicationStatus_.class).entry(mdiObjectReplicationStatus);
    this.persistenceService.run(cqnUpsert);
  }

}
