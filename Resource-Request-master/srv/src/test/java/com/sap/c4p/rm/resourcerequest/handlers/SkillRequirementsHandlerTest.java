package com.sap.c4p.rm.resourcerequest.handlers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.sap.cds.Result;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.persistence.PersistenceService;
import manageresourcerequestservice.ResourceRequests;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import com.sap.cds.Struct;

import com.sap.c4p.rm.resourcerequest.utils.Constants;

import manageresourcerequestservice.SkillRequirements;
import manageresourcerequestservice.SkillsConsumptionVH;

@DisplayName("Unit test for SkillRequirements Handler class")
public class SkillRequirementsHandlerTest {

  /*
   * Class under test
   *
   */
  private static SkillRequirementsHandler cut;

  static PersistenceService mockPersistenceService;

  /*
   * Mock SkillRequirements object
   *
   */

  @BeforeAll
  public static void setUp() {
    mockPersistenceService = mock(PersistenceService.class);
    cut = new SkillRequirementsHandler(mockPersistenceService);
  }

  @Nested
  @DisplayName("Unit Test for Skill Requirement Handlers method")
  public class WhenHandlers {
    private SkillRequirements skillRequirement;
    private SkillsConsumptionVH skill;
    String skillId = UUID.randomUUID().toString();
    String proficiencySetID = UUID.randomUUID().toString();

    @BeforeEach
    public void setUpskillRequirements() {
      // Set Skill Requirement attribute
      skillRequirement = Struct.create(SkillRequirements.class);
      skillRequirement.setId(UUID.randomUUID().toString());
      skillRequirement.setSkillId(skillId);
    }

    @Test
    @DisplayName("Testing Before Patch Event Handler of SkillRequirements")
    public void beforeSkillRequirementsPatch() {
      cut.beforeSkillRequirementsPatch(skillRequirement);
      assertEquals(skillRequirement.getProficiencyLevelId(), null);
      assertEquals(skillRequirement.getImportanceCode(), 1);
      assertEquals(skillRequirement.getComment(), null);
    }

    @Test
    @DisplayName("Testing After New Draft Create")
    public void afterSkillRequirementsDraftNew() {
      cut.afterSkillRequirementsDraftNew(skillRequirement);
      assertEquals(skillRequirement.getProficiencyLevelFieldControl(), Constants.FIELD_CONTROL_READ);
    }

    @Test
    @DisplayName("Testing After SkillRequirements Read, skill exists")
    public void afterSkillRequirementsReadSetFieldControlEdit() {
      SkillRequirementsHandler spyOfCut = spy(cut);
      List<SkillRequirements> skillRequirementsList = new ArrayList<>();
      skillRequirementsList.add(skillRequirement);
      doNothing().when(spyOfCut).setSkillFieldControlFlag(skillRequirement);
      spyOfCut.afterSkillRequirementsRead(skillRequirementsList);
      assertEquals(skillRequirement.getProficiencyLevelFieldControl(), Constants.FIELD_CONTROL_EDIT);
    }

    @Test
    @DisplayName("Testing After SkillRequirements Read, skill does not exists")
    public void afterSkillRequirementsReadSetFiedlControlRead() {
      SkillRequirementsHandler spyOfCut = spy(cut);
      List<SkillRequirements> skillRequirementsList = new ArrayList<>();
      skillRequirementsList.add(skillRequirement);
      skillRequirement.setSkillId(null);
      doNothing().when(spyOfCut).setSkillFieldControlFlag(skillRequirement);
      spyOfCut.afterSkillRequirementsRead(skillRequirementsList);
      assertEquals(skillRequirement.getProficiencyLevelFieldControl(), Constants.FIELD_CONTROL_READ);
    }

    @Nested
    class ValidateSetSkillFFieldControlFlag{


        @Test
        public void testWhenRowCountIsGreaterThanZeroButRRIdNotFound(){
            SkillRequirementsHandler spyOfCut = spy(cut);
            Result mockResult = mock(Result.class);

            SkillRequirements mockSkillRequirement = mock(SkillRequirements.class);
            doReturn(mockResult).when(mockPersistenceService).run(any(CqnSelect.class));
            doReturn(1L).when(mockResult).rowCount();
            doReturn(mockSkillRequirement).when(mockResult).single(SkillRequirements.class);
            doReturn(null).when(mockSkillRequirement).getResourceRequestId();

            spyOfCut.setSkillFieldControlFlag(skillRequirement);

            verify(mockResult,times(1)).single(SkillRequirements.class);

        }

        @Test
        public void testWhenRowCountIsGreaterThanZeroButRRIdFound(){
            SkillRequirementsHandler spyOfCut = spy(cut);
            Result mockResult = mock(Result.class);

            SkillRequirements mockSkillRequirement = mock(SkillRequirements.class);
            doReturn(mockResult).when(mockPersistenceService).run(any(CqnSelect.class));
            doReturn(1L).when(mockResult).rowCount();
            doReturn(mockSkillRequirement).when(mockResult).single(SkillRequirements.class);
            doReturn("mockUUID").when(mockSkillRequirement).getResourceRequestId();

            doNothing().when(spyOfCut).checkIfResourceRequestPublished("mockUUID",skillRequirement);

            spyOfCut.setSkillFieldControlFlag(skillRequirement);

            verify(mockResult,times(1)).single(SkillRequirements.class);
            verify(spyOfCut,times(1)).checkIfResourceRequestPublished("mockUUID",skillRequirement);
        }

        @Test
        public void testWhenRowCountIsLessThanZero(){
            SkillRequirementsHandler spyOfCut = spy(cut);
            Result mockResult = mock(Result.class);

            doReturn(mockResult).when(mockPersistenceService).run(any(CqnSelect.class));
            doReturn(0L).when(mockResult).rowCount();


            spyOfCut.setSkillFieldControlFlag(skillRequirement);


            verify(spyOfCut,times(0)).checkIfResourceRequestPublished("mockUUID",skillRequirement);
            verify(mockResult,times(0)).single(SkillRequirements.class);
        }

    }

    @Nested
    class ValidateCheckIfResourceRequestPublished {

        @Test
        public void testWhenRequestPublished(){
            SkillRequirementsHandler spyOfCut = spy(cut);
            ResourceRequests mockResourceRequest = mock(ResourceRequests.class);
            Result mockResult = mock(Result.class);
            when(mockResult.single(ResourceRequests.class)).thenReturn(mockResourceRequest);

            when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
            when(mockResourceRequest.getReleaseStatusCode()).thenReturn(Constants.REQUEST_PUBLISH);

            spyOfCut.checkIfResourceRequestPublished("mockUUID",skillRequirement);

            assertEquals(skillRequirement.getSkillFieldControl(),Constants.FIELD_CONTROL_READ);
            assertEquals(skillRequirement.getProficiencyLevelFieldControl(),Constants.FIELD_CONTROL_READ);

        }

        @Test
        public void testWhenRequestNotPublished(){
            SkillRequirementsHandler spyOfCut = spy(cut);
            ResourceRequests mockResourceRequest = mock(ResourceRequests.class);
            Result mockResult = mock(Result.class);
            when(mockResult.single(ResourceRequests.class)).thenReturn(mockResourceRequest);

            when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
            when(mockResourceRequest.getReleaseStatusCode()).thenReturn(Constants.REQUEST_WITHDRAW);

            spyOfCut.checkIfResourceRequestPublished("mockUUID",skillRequirement);

            assertEquals(skillRequirement.getSkillFieldControl(),Constants.FIELD_CONTROL_EDIT);


        }
    }
  }
}
