package com.sap.c4p.rm.resourcerequest.handlers.recommendation;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.sap.cds.Result;
import com.sap.cds.Struct;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.persistence.PersistenceService;

import manageresourcerequestservice.ResourceRequests;
import processresourcerequestservice.MatchingCandidates;
import processresourcerequestservice.ProjectRoles;
import processresourcerequestservice.RoleAssignments;
import processresourcerequestservice.RoleAssignments_;

@DisplayName("Unit test for Matching Candidates Helper class")
public class MatchingCandidatesHelperTest {
  private static PersistenceService mockPersistenceService;

  private static MatchingCandidatesHelper cut;

  @BeforeAll
  public static void setUp() {
    mockPersistenceService = mock(PersistenceService.class);

    cut = new MatchingCandidatesHelper(mockPersistenceService);
  }

  @Nested
  @DisplayName("Unit Test for matching candidates helper method")
  public class WhenMatchingCandidatesHelpers {
    private ResourceRequests resourceRequest;

    public MatchingCandidatesHelper spyMatchingHelperClass = spy(cut);

    @BeforeEach
    public void setUpResourceRequest() {
      resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setId("450a2453-ec0a-4a85-8247-94c39b9bdd67");
    }

    @Test
    @DisplayName("Testing compute CommaSeparated Fields method")
    public void computeCommaSeparatedFields() throws SQLException {
      List<MatchingCandidates> matchingCandidates = new ArrayList<>();

      MatchingCandidates matchingCandidate = Struct.create(MatchingCandidates.class);
      matchingCandidate.setResourceId("8f605bdc-e472-47b4-ab28-4590e33e798f");
      matchingCandidate.setWorkforcePersonID("8f605bdc-e472-47b4-ab28-4590e33e792q");

      RoleAssignments roleAssignments = Struct.create(RoleAssignments.class);
      roleAssignments.setId("8f605bdc-e472-47b4-ab28-4590e33e798q");
      roleAssignments.setEmployeeId("8f605bdc-e472-47b4-ab28-4590e33e792q");
      roleAssignments.setRoleId("9f605bdc-e472-47b4-ab28-4590e33e792q");

      matchingCandidate.setMatchedProjectRoles(Collections.singletonList(roleAssignments));

      matchingCandidates.add(matchingCandidate);

      doReturn(Collections.singletonList(roleAssignments)).when(spyMatchingHelperClass)
          .getRoleAssignmentsByEmployeeIds(any());
      doReturn("").when(spyMatchingHelperClass).computeCommaSeparatedProjectRoles(any());

      spyMatchingHelperClass.computeCommaSeparatedFields(matchingCandidates);

      verify(spyMatchingHelperClass, times(1)).getRoleAssignmentsByEmployeeIds(any());
      verify(spyMatchingHelperClass, times(1)).computeCommaSeparatedProjectRoles(any());
    }

    @Test
    @DisplayName("gets names of (active) project roles by Employee Ids")
    void getRoleAssignmentsByEmployeeIds() {
      MatchingCandidates matchingCandidate1 = Struct.create(MatchingCandidates.class);
      matchingCandidate1.setResourceId("8f605bdc-e472-47b4-ab28-4590e33e798f");
      matchingCandidate1.setResourceRequestId("450a2453-ec0a-4a85-8247-94c39b9bdd67");
      matchingCandidate1.setWorkforcePersonID("8f605bdc-e472-47b4-ab28-4590e33e792q");

      MatchingCandidates matchingCandidate2 = Struct.create(MatchingCandidates.class);
      matchingCandidate2.setResourceId("8f605bdc-e472-47b4-ab28-4590e33e799f");
      matchingCandidate2.setResourceRequestId("450a2453-ec0a-4a85-8247-94c39b9bdd67");
      matchingCandidate2.setWorkforcePersonID("8f605bdc-e472-47b4-ab28-4590e33e792l");

      CqnSelect expectedSelect = Select.from(RoleAssignments_.class)
          .columns(RoleAssignments_::employee_ID, r -> r.role().expand(p -> p.name())).where(
              r -> r.employee_ID().in("8f605bdc-e472-47b4-ab28-4590e33e792q", "8f605bdc-e472-47b4-ab28-4590e33e792l"));

      Result mockResult = mock(Result.class);
      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

      spyMatchingHelperClass.getRoleAssignmentsByEmployeeIds(Arrays.asList(matchingCandidate1, matchingCandidate2));

      final ArgumentCaptor<CqnSelect> argument = ArgumentCaptor.forClass(CqnSelect.class);
      verify(mockPersistenceService, times(1)).run(argument.capture());
      assertEquals(expectedSelect.toJson(), argument.getValue().toJson());
    }

    @Test
    @DisplayName("verify that computeCommaSeparatedProjectRoles correctly processes a list of RoleAssignments Associations")
    void computeCommaSeparatedProjectRoles() {
      ProjectRoles projectRoles1 = Struct.create(ProjectRoles.class);
      projectRoles1.setName("role 1");
      RoleAssignments roleAssignments1 = Struct.create(RoleAssignments.class);
      roleAssignments1.setRole(projectRoles1);

      ProjectRoles projectRoles2 = Struct.create(ProjectRoles.class);
      projectRoles2.setName("role 2");
      RoleAssignments roleAssignments2 = Struct.create(RoleAssignments.class);
      roleAssignments2.setRole(projectRoles2);

      assertEquals("role 1, role 2",
          cut.computeCommaSeparatedProjectRoles(Arrays.asList(roleAssignments1, roleAssignments2)));
    }
  }
}