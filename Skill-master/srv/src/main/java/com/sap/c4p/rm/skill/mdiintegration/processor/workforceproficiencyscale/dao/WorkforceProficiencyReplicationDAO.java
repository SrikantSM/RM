package com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dao;

import com.sap.resourcemanagement.skill.ProficiencySets;
import com.sap.resourcemanagement.skill.integration.ReplicationFailures;

public interface WorkforceProficiencyReplicationDAO {
  void save(final ProficiencySets proficiencySet);

  void save(final ProficiencySets proficiencySet, final ReplicationFailures replicationFailures);

  void update(final ProficiencySets proficiencySet);

  void update(final ProficiencySets proficiencySet, final ReplicationFailures replicationFailures);

  void restrictProficiencySet(final String proficiencySet, final ReplicationFailures replicationFailures);
}