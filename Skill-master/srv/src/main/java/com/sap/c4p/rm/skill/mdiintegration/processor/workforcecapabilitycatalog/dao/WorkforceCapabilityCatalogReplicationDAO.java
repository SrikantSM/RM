package com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapabilitycatalog.dao;

import com.sap.resourcemanagement.skill.Catalogs;
import com.sap.resourcemanagement.skill.integration.ReplicationFailures;

public interface WorkforceCapabilityCatalogReplicationDAO {
  void save(final Catalogs catalogs);

  void save(final Catalogs catalogs, final ReplicationFailures replicationFailures);

  void update(final Catalogs catalogs);

  void update(final Catalogs catalogs, final ReplicationFailures replicationFailures);

  void delete(final String catalogId, final ReplicationFailures replicationFailures);
}
