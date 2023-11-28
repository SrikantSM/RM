package com.sap.c4p.rm.resourcerequest.handlers;

import static com.sap.cds.ql.CQL.get;
import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnPredicate;
import com.sap.cds.services.cds.CdsReadEventContext;

import processresourcerequestservice.ProjectRoles_;

@DisplayName("Unit test for Process Resource Request Handler class")
public class ProcessResourceRequestHandlerTest {
  /*
   * Class under test
   *
   */
  private static ProcessResourceRequestHandler cut;

  /*
   * Mock ProcessResourceRequestHandler object setup
   *
   */
  @BeforeEach
  public void setUp() {
    cut = new ProcessResourceRequestHandler();
  }

  @Test
  @DisplayName("Check read call to Project Roles has filter query added for unrestricted roles")
  public void verifyBeforeProjectRolesRead() {
    CqnPredicate expectedUnrestrictedRolesFilter = get("roleLifecycleStatus_code").eq(0);

    CdsReadEventContext expectedContext = CdsReadEventContext.create(ProjectRoles_.CDS_NAME);
    expectedContext.setCqn(Select.from(ProjectRoles_.CDS_NAME)
        .columns(role -> role.get("ID"), role -> role.get("code"), role -> role.get("name")).limit(20, 0)
        .where(expectedUnrestrictedRolesFilter));

    CdsReadEventContext mockContext = CdsReadEventContext.create(ProjectRoles_.CDS_NAME);
    mockContext.setCqn(Select.from(ProjectRoles_.CDS_NAME)
        .columns(role -> role.get("ID"), role -> role.get("code"), role -> role.get("name")).limit(20, 0));

    cut.beforeProjectRolesRead(mockContext);

    assertEquals(expectedContext.getCqn().toString(), mockContext.getCqn().toString(),
        "Select query does not match expected query with unrestricted roles");
  }
}