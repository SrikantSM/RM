package com.sap.c4p.rm.skill.handlers;

import java.util.List;

import org.springframework.stereotype.Component;

import com.sap.cds.services.ServiceException;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.draft.DraftNewEventContext;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.ServiceName;

import com.sap.c4p.rm.skill.gen.MessageKeys;
import com.sap.c4p.rm.skill.services.ProficiencyLevelRankingService;
import com.sap.c4p.rm.skill.services.ProficiencyLevelTextReplicationService;
import com.sap.c4p.rm.skill.utils.HttpStatus;

import proficiencyservice.ProficiencyLevels;
import proficiencyservice.ProficiencyLevels_;
import proficiencyservice.ProficiencyService_;

@Component
@ServiceName(ProficiencyService_.CDS_NAME)
public class ProficiencyLevelHandler implements EventHandler {

  private final ProficiencyLevelRankingService proficiencyLevelRankingService;
  private final ProficiencyLevelTextReplicationService proficiencyLevelTextReplicationService;

  public ProficiencyLevelHandler(final ProficiencyLevelRankingService proficiencyLevelRankingService,
      final ProficiencyLevelTextReplicationService proficiencyLevelTextReplicationService) {
    this.proficiencyLevelRankingService = proficiencyLevelRankingService;
    this.proficiencyLevelTextReplicationService = proficiencyLevelTextReplicationService;
  }

  @Before(event = { CqnService.EVENT_CREATE, CqnService.EVENT_UPSERT,
      CqnService.EVENT_UPDATE }, entity = ProficiencyLevels_.CDS_NAME)
  public void beforeModification() {
    throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.ACTIVE_PATCH_NOT_ALLOWED);
  }

  @After(event = DraftService.EVENT_DRAFT_NEW, entity = ProficiencyLevels_.CDS_NAME)
  public void afterDraftNew(final DraftNewEventContext context, final List<ProficiencyLevels> proficiencyLevels) {
    proficiencyLevels.forEach(this.proficiencyLevelRankingService::assignNextRank);
    proficiencyLevels.forEach(this.proficiencyLevelTextReplicationService::createProficiencyLevelText);
  }
}
