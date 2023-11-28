package com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dao;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import java.util.ArrayList;
import java.util.List;

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

import com.sap.resourcemanagement.skill.Catalogs2Skills;
import com.sap.resourcemanagement.skill.Skills;
import com.sap.resourcemanagement.skill.integration.ReplicationFailures;

public class WorkforceCapabilityReplicationDAOTest extends InitMocks {

  private static final Marker WORKFORCE_CAPABILITY_REPL_MARKER = LoggingMarker.WORKFORCE_CAPABILITY_REPLICATION
      .getMarker();

  @Mock
  Row row;

  @Mock
  WorkforceCapabilityDAO workForceCapabilityDAO;

  @Mock
  ReplicationFailureDAO replicationFailureDAO;

  @Mock
  MDIObjectReplicationStatusDAO mdiObjectReplicationStatusDAO;

  @Autowired
  @InjectMocks
  WorkforceCapabilityReplicationDAOImpl classUnderTest;

  @Test
  @DisplayName("test save for create event of OneMDS")
  public void testSaveForCreateEventOfOneMDSWithNoReplicationFailure() {
    Skills skills = Skills.create();
    Catalogs2Skills catalogs2Skills = Catalogs2Skills.create();
    List<Catalogs2Skills> catalogs2SkillsList = new ArrayList<>();
    catalogs2SkillsList.add(catalogs2Skills);
    this.classUnderTest.save(skills, catalogs2SkillsList);
    verify(this.workForceCapabilityDAO, times(1)).save(skills, catalogs2SkillsList);
  }

  @Test
  @DisplayName("test save for create event of OneMDS - Replication Failures")
  public void testSaveForCreateEventOfOneMDSWithReplicationFailure() {
    Skills skills = Skills.create();
    Catalogs2Skills catalogs2Skills = Catalogs2Skills.create();
    List<Catalogs2Skills> catalogs2SkillsList = new ArrayList<>();
    catalogs2SkillsList.add(catalogs2Skills);
    ReplicationFailures replicationFailures = ReplicationFailures.create();
    this.classUnderTest.save(skills, catalogs2SkillsList, replicationFailures);
    verify(this.workForceCapabilityDAO, times(1)).save(skills, catalogs2SkillsList);
    verify(this.replicationFailureDAO, times(1)).update(WORKFORCE_CAPABILITY_REPL_MARKER, replicationFailures);
  }

  @Test
  @DisplayName("test update for update event of OneMDS")
  public void testUpdateForUpdateEventOfOneMDSWithNoReplicationFailure() {
    Skills skills = Skills.create();
    Catalogs2Skills catalogs2Skills = Catalogs2Skills.create();
    List<Catalogs2Skills> catalogs2SkillsList = new ArrayList<>();
    catalogs2SkillsList.add(catalogs2Skills);
    this.classUnderTest.update(skills, catalogs2SkillsList);
    verify(this.workForceCapabilityDAO, times(1)).update(skills, catalogs2SkillsList);
  }

  @Test
  @DisplayName("test update for update event of OneMDS - Replication Failures")
  public void testUpdateForUpdateEventOfOneMDSWithReplicationFailure() {
    Skills skills = Skills.create();
    Catalogs2Skills catalogs2Skills = Catalogs2Skills.create();
    List<Catalogs2Skills> catalogs2SkillsList = new ArrayList<>();
    catalogs2SkillsList.add(catalogs2Skills);
    ReplicationFailures replicationFailures = ReplicationFailures.create();
    this.classUnderTest.update(skills, catalogs2SkillsList, replicationFailures);
    verify(this.workForceCapabilityDAO, times(1)).update(skills, catalogs2SkillsList);
    verify(this.replicationFailureDAO, times(1)).update(WORKFORCE_CAPABILITY_REPL_MARKER, replicationFailures);
  }
}
