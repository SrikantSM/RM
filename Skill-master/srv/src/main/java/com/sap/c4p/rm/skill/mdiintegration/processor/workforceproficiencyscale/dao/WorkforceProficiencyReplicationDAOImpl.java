package com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dao;

import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.masterdataintegration.MDIEntities;
import com.sap.c4p.rm.skill.mdiintegration.replicationdao.MDIObjectReplicationStatusDAO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.sap.c4p.rm.skill.config.LoggingMarker;
import com.sap.c4p.rm.skill.mdiintegration.exceptions.TransactionException;
import com.sap.c4p.rm.skill.mdiintegration.replicationdao.ReplicationFailureDAO;

import com.sap.resourcemanagement.skill.ProficiencySets;
import com.sap.resourcemanagement.skill.integration.ReplicationFailures;

@Repository
public class WorkforceProficiencyReplicationDAOImpl implements WorkforceProficiencyReplicationDAO {

  private static final Marker WORKFORCE_CAPABILITY_PROFSET_REPL_MARKER = LoggingMarker.WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION
      .getMarker();
  private final WorkForceProficiencyDAO workForceProficiencyDAO;
  private static final Logger LOGGER = LoggerFactory.getLogger(WorkforceProficiencyReplicationDAOImpl.class);
  private final ReplicationFailureDAO replicationFailureDAO;

  private final MDIObjectReplicationStatusDAO mdiObjectReplicationStatusDAO;

  @Autowired
  public WorkforceProficiencyReplicationDAOImpl(final WorkForceProficiencyDAO workForceProficiencyDAO,
                                                ReplicationFailureDAO replicationFailureDAO, MDIObjectReplicationStatusDAO mdiObjectReplicationStatusDAO) {
    this.workForceProficiencyDAO = workForceProficiencyDAO;
    this.replicationFailureDAO = replicationFailureDAO;
    this.mdiObjectReplicationStatusDAO = mdiObjectReplicationStatusDAO;
  }

  @Override
  @Transactional(rollbackFor = { TransactionException.class })
  public void save(ProficiencySets proficiencySet) {
    LOGGER.info("Inserted Proficiency Set Successfully");
    this.workForceProficiencyDAO.save(proficiencySet);
  }

  @Override
  @Transactional(rollbackFor = { TransactionException.class })
  public void save(ProficiencySets proficiencySet, ReplicationFailures replicationFailures) {
    LOGGER.info("Inserted Proficiency Set Successfully");
    this.workForceProficiencyDAO.save(proficiencySet);
    this.replicationFailureDAO.update(WORKFORCE_CAPABILITY_PROFSET_REPL_MARKER, replicationFailures);
  }

  @Override
  @Transactional(rollbackFor = { TransactionException.class })
  public void update(ProficiencySets proficiencySet) {
    LOGGER.info("Updated Proficiency Set Successfully");
    this.workForceProficiencyDAO.update(proficiencySet);
  }

  @Override
  @Transactional(rollbackFor = { TransactionException.class })
  public void update(ProficiencySets proficiencySet, final ReplicationFailures replicationFailures) {
    LOGGER.info("Updated Proficiency Set Successfully");
    this.workForceProficiencyDAO.update(proficiencySet);
    this.mdiObjectReplicationStatusDAO.delete(MDIEntities.WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION, proficiencySet.getId());
    this.replicationFailureDAO.update(WORKFORCE_CAPABILITY_PROFSET_REPL_MARKER, replicationFailures);
  }

  @Override
  @Transactional(rollbackFor = { TransactionException.class })
  public void restrictProficiencySet(final String proficiencySetID, final ReplicationFailures replicationFailures) {
    this.workForceProficiencyDAO.restrictProficiencySet(proficiencySetID);
    this.mdiObjectReplicationStatusDAO.delete(MDIEntities.WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION, proficiencySetID);
    this.replicationFailureDAO.update(WORKFORCE_CAPABILITY_PROFSET_REPL_MARKER, replicationFailures);
  }
}
