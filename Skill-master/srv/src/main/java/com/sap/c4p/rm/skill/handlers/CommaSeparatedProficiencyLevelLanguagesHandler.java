package com.sap.c4p.rm.skill.handlers;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnSelectListItem;
import com.sap.cds.services.cds.CdsReadEventContext;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.ServiceName;

import com.sap.c4p.rm.skill.repositories.ProficiencyLevelRepository;
import com.sap.c4p.rm.skill.utils.EventHandlerUtility;

import proficiencyservice.ProficiencyLevels;
import proficiencyservice.ProficiencyLevelsTexts;
import proficiencyservice.ProficiencyLevels_;
import proficiencyservice.ProficiencyService_;

/**
 * This handler is required as a workaround until Multi-Value Fields are
 * available in FEv4. https://sapjira.wdf.sap.corp/browse/FIORITECHP1-11941
 *
 * Other workarounds used before (breakout columns with Tokenizer) had
 * accessibility issues, so we resorted to the safe solution of computing the
 * column on read. To keep the workaround easy to remove (the FE BLI is to be
 * delivered soon), the relevant coding is bundled in this separate class and
 * not packed inside the SkillEventHandler and a Service
 */
@Component
@ServiceName(ProficiencyService_.CDS_NAME)
public class CommaSeparatedProficiencyLevelLanguagesHandler implements EventHandler {

  private final ProficiencyLevelRepository proficiencyLevelRepository;
  private final EventHandlerUtility eventHandlerUtility;

  @Autowired
  public CommaSeparatedProficiencyLevelLanguagesHandler(ProficiencyLevelRepository proficiencyLevelRepository,
      EventHandlerUtility eventHandlerUtility) {
    this.proficiencyLevelRepository = proficiencyLevelRepository;
    this.eventHandlerUtility = eventHandlerUtility;
  }

  /**
   * After read event to calculate the virtual field for the comma separated
   * languages column
   * 
   * @param context           CDS event context
   * @param proficiencyLevels Proficiency levels to be enriched by the comma
   *                          separated languages field
   */
  @After(event = CqnService.EVENT_READ, entity = ProficiencyLevels_.CDS_NAME)
  public void afterRead(CdsReadEventContext context, List<ProficiencyLevels> proficiencyLevels) {
    Map<String, Object> rootKeys = this.eventHandlerUtility.getRootKeysFromEventContext(context.getModel(),
        context.getCqn());

    if (rootKeys.get("IsActiveEntity") != null) {
      boolean isActiveEntity = (boolean) rootKeys.get("IsActiveEntity");

      if (this.shouldComputeCommaSeparated(context.getCqn())) {
        List<ProficiencyLevels> expandedProficiencyLevels = this.proficiencyLevelRepository
            .getLanguagesByProficiencyLevels(proficiencyLevels, isActiveEntity);
        Map<String, List<ProficiencyLevelsTexts>> textsByProficiencyLevelId = expandedProficiencyLevels.stream()
            .collect(Collectors.toMap(ProficiencyLevels::getId, ProficiencyLevels::getTexts));
        proficiencyLevels.forEach(proficiencyLevel -> proficiencyLevel.setCommaSeparatedLanguages(
            this.computeCommaSeparated(textsByProficiencyLevelId.get(proficiencyLevel.getId()))));
      }
    }
  }

  boolean shouldComputeCommaSeparated(CqnSelect cqn) {
    return cqn.items().stream().anyMatch(CqnSelectListItem::isStar)
        || cqn.items().stream().filter(CqnSelectListItem::isValue)
            .anyMatch(item -> item.asValue().displayName().equals(ProficiencyLevels.COMMA_SEPARATED_LANGUAGES));
  }

  String computeCommaSeparated(List<ProficiencyLevelsTexts> proficiencyLevelsTexts) {
    if (proficiencyLevelsTexts == null) {
      return "";
    }
    return proficiencyLevelsTexts.stream().map(ProficiencyLevelsTexts::getLocale).filter(Objects::nonNull).sorted()
        .collect(Collectors.joining(", "));
  }
}
