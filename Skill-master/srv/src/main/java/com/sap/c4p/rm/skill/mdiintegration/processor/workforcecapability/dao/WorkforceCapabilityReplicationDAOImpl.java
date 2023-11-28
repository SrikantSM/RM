package com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dao;

import java.util.List;

import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.masterdataintegration.MDIEntities;
import com.sap.c4p.rm.skill.mdiintegration.replicationdao.MDIObjectReplicationStatusDAO;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.sap.c4p.rm.skill.config.LoggingMarker;
import com.sap.c4p.rm.skill.mdiintegration.exceptions.TransactionException;
import com.sap.c4p.rm.skill.mdiintegration.replicationdao.ReplicationFailureDAO;

import com.sap.resourcemanagement.skill.Catalogs2Skills;
import com.sap.resourcemanagement.skill.Skills;
import com.sap.resourcemanagement.skill.integration.ReplicationFailures;

@Repository
public class WorkforceCapabilityReplicationDAOImpl implements WorkforceCapabilityReplicationDAO {

  private static final Marker WORKFORCE_CAPABILITY_REPL_MARKER = LoggingMarker.WORKFORCE_CAPABILITY_REPLICATION
      .getMarker();
  private final WorkforceCapabilityDAO workforceCapabilityDAO;
  private final ReplicationFailureDAO replicationFailureDAO;

  private final MDIObjectReplicationStatusDAO mdiObjectReplicationStatusDAO;

  @Autowired
  public WorkforceCapabilityReplicationDAOImpl(final WorkforceCapabilityDAO workforceCapabilityDAO,
                                               ReplicationFailureDAO replicationFailureDAO, MDIObjectReplicationStatusDAO mdiObjectReplicationStatusDAO) {
    this.workforceCapabilityDAO = workforceCapabilityDAO;
    this.replicationFailureDAO = replicationFailureDAO;
    this.mdiObjectReplicationStatusDAO = mdiObjectReplicationStatusDAO;
  }

  @Override
  @Transactional(rollbackFor = { TransactionException.class })
  public void save(Skills skills, List<Catalogs2Skills> catalogs2SkillsList) {
    this.workforceCapabilityDAO.save(skills, catalogs2SkillsList);
  }

  @Override
  @Transactional(rollbackFor = { TransactionException.class })
  public void save(Skills skills, List<Catalogs2Skills> catalogs2SkillsList, ReplicationFailures replicationFailures) {
    this.workforceCapabilityDAO.save(skills, catalogs2SkillsList);
    this.replicationFailureDAO.update(WORKFORCE_CAPABILITY_REPL_MARKER, replicationFailures);

  }

  @Override
  @Transactional(rollbackFor = { TransactionException.class })
  public void update(Skills skills, List<Catalogs2Skills> catalogs2SkillsList) {
    this.workforceCapabilityDAO.update(skills, catalogs2SkillsList);
  }

  @Override
  @Transactional(rollbackFor = { TransactionException.class })
  public void update(Skills skill, List<Catalogs2Skills> catalogs2SkillsList,
      ReplicationFailures replicationFailures) {
    this.workforceCapabilityDAO.update(skill, catalogs2SkillsList);
    this.mdiObjectReplicationStatusDAO.delete(MDIEntities.WORKFORCE_CAPABILITY_REPLICATION, skill.getId());
    this.replicationFailureDAO.update(WORKFORCE_CAPABILITY_REPL_MARKER, replicationFailures);
  }

  @Override
  @Transactional(rollbackFor = { TransactionException.class })
  public void restrictSkill(final String skillID, final ReplicationFailures replicationFailures) {
    this.workforceCapabilityDAO.restrictSkill(skillID);
    this.mdiObjectReplicationStatusDAO.delete(MDIEntities.WORKFORCE_CAPABILITY_REPLICATION, skillID);
    this.replicationFailureDAO.update(WORKFORCE_CAPABILITY_REPL_MARKER, replicationFailures);
  }

}
