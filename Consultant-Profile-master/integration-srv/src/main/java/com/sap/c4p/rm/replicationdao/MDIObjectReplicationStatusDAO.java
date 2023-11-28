package com.sap.c4p.rm.replicationdao;

import java.util.List;

import com.sap.c4p.rm.cloudfoundry.service.masterdataintegration.MDIEntities;

import com.sap.resourcemanagement.consultantprofile.integration.MDIObjectReplicationStatus;

public interface MDIObjectReplicationStatusDAO {

    void fillEntity(List<MDIObjectReplicationStatus> mdiObjectReplicationStatusList);

    List<MDIObjectReplicationStatus> readAll(MDIEntities entity);

    void delete(MDIEntities entity);

    void delete(MDIEntities entity, String id);
}
