package com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapabilitycatalog.dao;

import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.masterdataintegration.MDIEntities;
import com.sap.c4p.rm.skill.mdiintegration.replicationdao.MDIObjectReplicationStatusDAO;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.sap.c4p.rm.skill.config.LoggingMarker;
import com.sap.c4p.rm.skill.mdiintegration.exceptions.TransactionException;
import com.sap.c4p.rm.skill.mdiintegration.replicationdao.ReplicationFailureDAO;

import com.sap.resourcemanagement.skill.Catalogs;
import com.sap.resourcemanagement.skill.integration.ReplicationFailures;

@Repository
public class WorkforceCapabilityCatalogReplicationDAOImpl implements WorkforceCapabilityCatalogReplicationDAO {

  private static final Marker WORKFORCE_CAPABILITY_CATALOG_REPL_MARKER = LoggingMarker.WORKFORCE_CAPABILITY_CATALOG_REPLICATION
      .getMarker();
  private final WorkForceCapabilityCatalogDAO workForceCapabilityCatalogDAO;

  private final ReplicationFailureDAO replicationFailureDAO;

  private final MDIObjectReplicationStatusDAO mdiObjectReplicationStatusDAO;

  @Autowired
  public WorkforceCapabilityCatalogReplicationDAOImpl(final WorkForceCapabilityCatalogDAO workForceCapabilityCatalogDAO,
                                                      ReplicationFailureDAO replicationFailureDAO, MDIObjectReplicationStatusDAO mdiObjectReplicationStatusDAO) {
    this.workForceCapabilityCatalogDAO = workForceCapabilityCatalogDAO;
    this.replicationFailureDAO = replicationFailureDAO;
    this.mdiObjectReplicationStatusDAO = mdiObjectReplicationStatusDAO;
  }

  @Override
  @Transactional(rollbackFor = { TransactionException.class })
  public void save(Catalogs catalogs) {
    this.workForceCapabilityCatalogDAO.save(catalogs);
  }

  @Override
  @Transactional(rollbackFor = { TransactionException.class })
  public void save(Catalogs catalogs, final ReplicationFailures replicationFailures) {
    this.workForceCapabilityCatalogDAO.save(catalogs);
    this.replicationFailureDAO.update(WORKFORCE_CAPABILITY_CATALOG_REPL_MARKER, replicationFailures);
  }

  @Override
  @Transactional(rollbackFor = { TransactionException.class })
  public void update(Catalogs catalogs) {
    this.workForceCapabilityCatalogDAO.update(catalogs);
  }

  @Override
  @Transactional(rollbackFor = { TransactionException.class })
  public void update(Catalogs catalog, final ReplicationFailures replicationFailures) {
    this.workForceCapabilityCatalogDAO.update(catalog);
    this.mdiObjectReplicationStatusDAO.delete(MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION, catalog.getId());
    this.replicationFailureDAO.update(WORKFORCE_CAPABILITY_CATALOG_REPL_MARKER, replicationFailures);
  }
  @Override
  @Transactional(rollbackFor = { TransactionException.class })
  public void delete(final String catalogId, final ReplicationFailures replicationFailures) {
   this.workForceCapabilityCatalogDAO.delete(catalogId);
   this.mdiObjectReplicationStatusDAO.delete(MDIEntities.WORKFORCE_CAPABILITY_CATALOG_REPLICATION, catalogId);
   this.replicationFailureDAO.update(WORKFORCE_CAPABILITY_CATALOG_REPL_MARKER, replicationFailures);
  }

}
