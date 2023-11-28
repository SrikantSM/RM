package com.sap.c4p.rm.skill.mdiintegration.replicationdao;

import java.util.List;

import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.masterdataintegration.MDIEntities;

import com.sap.resourcemanagement.skill.integration.MDIObjectReplicationStatus;

public interface MDIObjectReplicationStatusDAO {

  void fillEntity(List<MDIObjectReplicationStatus> mdiObjectReplicationStatusList);

  List<MDIObjectReplicationStatus> readAll(MDIEntities entity);

  void delete(MDIEntities entity);

  void delete(MDIEntities entity, String id);

  void fillEntry(MDIObjectReplicationStatus mdiObjectReplicationStatus);
}
