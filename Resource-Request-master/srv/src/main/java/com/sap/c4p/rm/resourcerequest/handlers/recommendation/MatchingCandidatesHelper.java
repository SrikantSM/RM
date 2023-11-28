package com.sap.c4p.rm.resourcerequest.handlers.recommendation;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.persistence.PersistenceService;

import processresourcerequestservice.MatchingCandidates;
import processresourcerequestservice.RoleAssignments;
import processresourcerequestservice.RoleAssignments_;

@Component
public class MatchingCandidatesHelper {

  private PersistenceService persistenceService;

  @Autowired
  public MatchingCandidatesHelper(PersistenceService persistenceService) {
    this.persistenceService = persistenceService;
  }

  public void computeCommaSeparatedFields(List<MatchingCandidates> matchingCandidates) {
    List<RoleAssignments> roleAssignments = getRoleAssignmentsByEmployeeIds(matchingCandidates);

    Map<String, List<RoleAssignments>> matchedProjectRolesByEmployeeId = roleAssignments.stream()
        .collect(Collectors.groupingBy(RoleAssignments::getEmployeeId));

    matchingCandidates.forEach(
        matchingCandidate -> matchingCandidate.setCommaSeparatedProjectRoles(this.computeCommaSeparatedProjectRoles(
            matchedProjectRolesByEmployeeId.get(matchingCandidate.getWorkforcePersonID()))));
  }

  public String computeCommaSeparatedProjectRoles(List<RoleAssignments> matchedProjectRoles) {
    if (matchedProjectRoles == null || matchedProjectRoles.isEmpty()) {
      return "";
    }

    return matchedProjectRoles.stream().map(matchedProjectRole -> matchedProjectRole.getRole().getName())
        .collect(Collectors.joining(", "));
  }

  public List<RoleAssignments> getRoleAssignmentsByEmployeeIds(final List<MatchingCandidates> matchingCandidates) {
    String[] workforcePersonIds = matchingCandidates.stream().map(MatchingCandidates::getWorkforcePersonID)
        .toArray(String[]::new);

    CqnSelect select = Select.from(RoleAssignments_.class)
        .columns(RoleAssignments_::employee_ID, r -> r.role().expand(p -> p.name()))
        .where(r -> r.employee_ID().in(workforcePersonIds));

    return persistenceService.run(select).listOf(RoleAssignments.class);
  }
}
