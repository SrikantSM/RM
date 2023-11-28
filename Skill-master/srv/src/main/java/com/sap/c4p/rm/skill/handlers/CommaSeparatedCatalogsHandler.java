package com.sap.c4p.rm.skill.handlers;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
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

import skillservice.Catalogs2Skills;
import skillservice.SkillService_;
import skillservice.Skills;
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
public class CommaSeparatedCatalogsHandler implements EventHandler {

  private final SkillRepository skillRepository;

  @Autowired
  public CommaSeparatedCatalogsHandler(SkillRepository skillRepository) {
    this.skillRepository = skillRepository;
  }

  @After(event = CqnService.EVENT_READ, entity = Skills_.CDS_NAME)
  public void afterRead(CdsReadEventContext context, List<Skills> skills) {
    if (this.shouldComputeCommaSeparated(context.getCqn())) {
      List<Skills> expandedSkills = this.skillRepository.getActiveCatalogNamesBySkills(skills);
      Map<String, List<Catalogs2Skills>> catalogsBySkillId = expandedSkills.stream()
          .collect(Collectors.toMap(Skills::getId, Skills::getCatalogAssociations));
      skills.forEach(
          skill -> skill.setCommaSeparatedCatalogs(this.computeCommaSeparated(catalogsBySkillId.get(skill.getId()))));
    }
  }

  boolean shouldComputeCommaSeparated(CqnSelect cqn) {
    return cqn.items().stream().anyMatch(CqnSelectListItem::isStar)
        || cqn.items().stream().filter(CqnSelectListItem::isValue)
            .anyMatch(item -> item.asValue().displayName().equals(Skills.COMMA_SEPARATED_CATALOGS));
  }

  String computeCommaSeparated(List<Catalogs2Skills> catalogAssociations) {
    if (catalogAssociations == null) {
      return "";
    }
    return catalogAssociations.stream()
        .filter(c2s -> c2s.getCatalog() != null && c2s.getCatalog().getName() != null
            && !c2s.getCatalog().getName().isEmpty())
        .sorted(Comparator.comparing(c2s -> c2s.getCatalog().getName())).map(c2s -> c2s.getCatalog().getName())
        .collect(Collectors.joining(", "));
  }
}
