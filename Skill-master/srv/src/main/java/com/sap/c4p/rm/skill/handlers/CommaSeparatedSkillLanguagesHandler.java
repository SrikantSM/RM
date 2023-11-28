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

import com.sap.c4p.rm.skill.repositories.SkillRepository;

import skillservice.SkillService_;
import skillservice.Skills;
import skillservice.SkillsTexts;
import skillservice.Skills_;

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
@ServiceName(SkillService_.CDS_NAME)
public class CommaSeparatedSkillLanguagesHandler implements EventHandler {

  private final SkillRepository skillRepository;

  @Autowired
  public CommaSeparatedSkillLanguagesHandler(final SkillRepository skillRepository) {
    this.skillRepository = skillRepository;
  }

  /**
   * After read event to calculate the virtual field for the comma separated
   * languages column
   * 
   * @param context CDS event context
   * @param skills  Skills to be enriched by the comma separated languages field
   */
  @After(event = CqnService.EVENT_READ, entity = Skills_.CDS_NAME)
  public void afterRead(final CdsReadEventContext context, final List<Skills> skills) {
    if (this.shouldComputeCommaSeparated(context.getCqn())) {
      // active skills
      List<Skills> activeSkills = skills.stream().filter(s -> s.getIsActiveEntity().equals(Boolean.TRUE))
          .collect(Collectors.toList());
      if (activeSkills != null && !activeSkills.isEmpty()) {
        List<Skills> expandedActiveSkills = this.skillRepository.getLanguagesBySkills(activeSkills, true);
        Map<String, List<SkillsTexts>> textsByActiveSkillId = expandedActiveSkills.stream()
            .collect(Collectors.toMap(Skills::getId, Skills::getTexts));
        activeSkills.forEach(
            s -> s.setCommaSeparatedLanguages(this.computeCommaSeparated(textsByActiveSkillId.get(s.getId()))));
      }

      // draft skills
      List<Skills> draftSkills = skills.stream().filter(s -> s.getIsActiveEntity().equals(Boolean.FALSE))
          .collect(Collectors.toList());
      if (draftSkills != null && !draftSkills.isEmpty()) {
        List<Skills> expandedDraftSkills = this.skillRepository.getLanguagesBySkills(draftSkills, false);
        Map<String, List<SkillsTexts>> textsByDraftSkillId = expandedDraftSkills.stream()
            .collect(Collectors.toMap(Skills::getId, Skills::getTexts));
        draftSkills
            .forEach(s -> s.setCommaSeparatedLanguages(this.computeCommaSeparated(textsByDraftSkillId.get(s.getId()))));
      }
    }
  }

  boolean shouldComputeCommaSeparated(final CqnSelect cqn) {
    return cqn.items().stream().anyMatch(CqnSelectListItem::isStar)
        || cqn.items().stream().filter(CqnSelectListItem::isValue)
            .anyMatch(item -> item.asValue().displayName().equals(Skills.COMMA_SEPARATED_LANGUAGES));
  }

  String computeCommaSeparated(final List<SkillsTexts> skillsTexts) {
    if (skillsTexts == null || skillsTexts.isEmpty()) {
      return "";
    }
    return skillsTexts.stream().map(SkillsTexts::getLocale).filter(Objects::nonNull).sorted()
        .collect(Collectors.joining(", "));
  }
}
