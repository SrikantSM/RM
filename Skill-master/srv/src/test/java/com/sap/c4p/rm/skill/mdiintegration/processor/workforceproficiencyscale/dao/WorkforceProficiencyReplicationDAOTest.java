package com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dao;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;

import com.sap.cds.Row;

import com.sap.c4p.rm.skill.config.LoggingMarker;
import com.sap.c4p.rm.skill.mdiintegration.InitMocks;
import com.sap.c4p.rm.skill.mdiintegration.replicationdao.MDIObjectReplicationStatusDAO;
import com.sap.c4p.rm.skill.mdiintegration.replicationdao.ReplicationFailureDAO;

import com.sap.resourcemanagement.skill.ProficiencySets;
import com.sap.resourcemanagement.skill.integration.ReplicationFailures;

public class WorkforceProficiencyReplicationDAOTest extends InitMocks {

  private static final Marker WORKFORCE_PROF_REPLICATION_MARKER = LoggingMarker.WORKFORCE_CAPABILITY_PROFICIENCY_REPLICATION
      .getMarker();

  @Mock
  Row row;

  @Mock
  WorkForceProficiencyDAO workForceProficiencyDAO;

  @Mock
  ReplicationFailureDAO replicationFailureDAO;

  @Mock
  MDIObjectReplicationStatusDAO mdiObjectReplicationStatusDAO;

  @Autowired
  @InjectMocks
  WorkforceProficiencyReplicationDAOImpl classUnderTest;

  @Test
  @DisplayName("test save for create event of OneMDS")
  public void testSaveForCreateEventOfOneMDSWithNoReplicationFailure() {
    ProficiencySets proficiencySets = ProficiencySets.create();
    this.classUnderTest.save(proficiencySets);
    verify(this.workForceProficiencyDAO, times(1)).save(proficiencySets);
  }

  @Test
  @DisplayName("test save for create event of OneMDS - Replication Failures")
  public void testSaveForCreateEventOfOneMDSWithReplicationFailure() {
    ProficiencySets proficiencySets = ProficiencySets.create();
    ReplicationFailures replicationFailures = ReplicationFailures.create();
    this.classUnderTest.save(proficiencySets, replicationFailures);
    verify(this.workForceProficiencyDAO, times(1)).save(proficiencySets);
    verify(this.replicationFailureDAO, times(1)).update(WORKFORCE_PROF_REPLICATION_MARKER, replicationFailures);
  }

  @Test
  @DisplayName("test update for update event of OneMDS")
  public void testUpdateForUpdateEventOfOneMDSWithNoReplicationFailure() {
    ProficiencySets proficiencySets = ProficiencySets.create();
    this.classUnderTest.update(proficiencySets);
    verify(this.workForceProficiencyDAO, times(1)).update(proficiencySets);
  }

  @Test
  @DisplayName("test update for update event of OneMDS - Replication Failures")
  public void testUpdateForUpdateEventOfOneMDSWithReplicationFailure() {
    ProficiencySets proficiencySets = ProficiencySets.create();
    ReplicationFailures replicationFailures = ReplicationFailures.create();
    this.classUnderTest.update(proficiencySets, replicationFailures);
    verify(this.workForceProficiencyDAO, times(1)).update(proficiencySets);
    verify(this.replicationFailureDAO, times(1)).update(WORKFORCE_PROF_REPLICATION_MARKER, replicationFailures);
  }
}
