package com.sap.c4p.rm.resourcerequest.handlers;

import java.util.List;

import com.sap.cds.Result;
import org.springframework.stereotype.Component;

import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.resourcerequest.utils.Constants;

import manageresourcerequestservice.*;

@Component
@ServiceName(ManageResourceRequestService_.CDS_NAME)
public class SkillRequirementsHandler implements EventHandler {
  private final PersistenceService persistenceService;

  public SkillRequirementsHandler(PersistenceService persistenceService) {
    this.persistenceService = persistenceService;
  }

  @Before(event = { DraftService.EVENT_DRAFT_PATCH }, entity = SkillRequirements_.CDS_NAME)
  public void beforeSkillRequirementsPatch(SkillRequirements skillRequirement) {
    if (skillRequirement.containsKey(SkillRequirements.SKILL_ID) && skillRequirement.getProficiencyLevelId() == null) {
      /*
       * Set proficiency Level, Importance Code, Comment to null when skill changed.
       */
      skillRequirement.setProficiencyLevelId(null);
      skillRequirement.setImportanceCode(Constants.SKILL_IMPORTANCE_CODE_MANDATORY);
      skillRequirement.setComment(null);
    }
  }

  @After(event = { DraftService.EVENT_DRAFT_NEW }, entity = SkillRequirements_.CDS_NAME)
  public void afterSkillRequirementsDraftNew(SkillRequirements skillRequirement) {
    /*
     * Set proficiency Level to null and field control to Read Only when skill
     * requirement created.
     *
     */
    skillRequirement.setProficiencyLevelFieldControl(Constants.FIELD_CONTROL_READ);

  }

  @After(event = { CqnService.EVENT_READ }, entity = SkillRequirements_.CDS_NAME)
  public void afterSkillRequirementsRead(List<SkillRequirements> skillRequirements) {
    for (SkillRequirements skillRequirement : skillRequirements) {
      String skillId = skillRequirement.getSkillId();
      if (skillId != null && !skillId.isEmpty()) {
        /*
         * Set Field Cotrol of Proficiency Level as editable.
         */
        skillRequirement.setProficiencyLevelFieldControl(Constants.FIELD_CONTROL_EDIT);
      } else {
        skillRequirement.setProficiencyLevelFieldControl(Constants.FIELD_CONTROL_READ);
      }
      setSkillFieldControlFlag(skillRequirement);
    }
  }

  public void setSkillFieldControlFlag(SkillRequirements skillRequirement) {

    CqnSelect select = Select.from(SkillRequirements_.class).columns(SkillRequirements_::resourceRequest_ID)
        .where(skillRequirements -> skillRequirements.ID().eq(skillRequirement.getId()));

    Result result = persistenceService.run(select);

    if (result.rowCount() > 0) {
      SkillRequirements persisted = result.single(SkillRequirements.class);
      if (persisted.getResourceRequestId() != null) {
        checkIfResourceRequestPublished(persisted.getResourceRequestId(), skillRequirement);
      }

    }
  }

  public void checkIfResourceRequestPublished(String resourceRequestId, SkillRequirements skillRequirement) {
    CqnSelect select = Select.from(ResourceRequests_.class).columns(ResourceRequests_::releaseStatus_code)
        .where(resourceRequests -> resourceRequests.ID().eq(resourceRequestId));
    Integer releaseStatus = persistenceService.run(select).single(ResourceRequests.class).getReleaseStatusCode();
    if (releaseStatus == Constants.REQUEST_PUBLISH) {
      skillRequirement.setSkillFieldControl(Constants.FIELD_CONTROL_READ);
      skillRequirement.setProficiencyLevelFieldControl(Constants.FIELD_CONTROL_READ);
    } else {
      skillRequirement.setSkillFieldControl(Constants.FIELD_CONTROL_EDIT);
    }
  }

}
