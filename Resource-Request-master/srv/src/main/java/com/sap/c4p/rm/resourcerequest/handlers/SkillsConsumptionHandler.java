package com.sap.c4p.rm.resourcerequest.handlers;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.sap.cds.ql.CQL;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnSelectListItem;
import com.sap.cds.ql.cqn.Modifier;
import com.sap.cds.services.cds.CdsReadEventContext;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.Before;

import manageresourcerequestservice.Catalogs2SkillsConsumption;
import manageresourcerequestservice.CatalogsConsumption;
import manageresourcerequestservice.ManageResourceRequestService_;
import manageresourcerequestservice.SkillsConsumptionVH;
import manageresourcerequestservice.SkillsConsumptionVH_;

@Component
public class SkillsConsumptionHandler implements EventHandler {

  @Before(service = ManageResourceRequestService_.CDS_NAME, event = CqnService.EVENT_READ, entity = SkillsConsumptionVH_.CDS_NAME)
  public void beforeRead(CdsReadEventContext context) {
    if (shouldComputeCommaSeparated(context.getCqn())) {
      context.setCqn(ensureCatalogExpansion(context.getCqn()));
    }
  }

  @After(service = ManageResourceRequestService_.CDS_NAME, event = CqnService.EVENT_READ, entity = SkillsConsumptionVH_.CDS_NAME)
  public void afterRead(CdsReadEventContext context, List<SkillsConsumptionVH> skills) {
    if (shouldComputeCommaSeparated(context.getCqn())) {
      skills.forEach(skill -> {
        skill.setCommaSeparatedCatalogs(computeCommaSeparated(skill.getCatalogAssociations()));
        // CAP tries to serialize the added expansion as "Non-nullable property not
        // present". Hence, we have to remove it
        removeInvalidAssociation(skill);
      });
    }
  }

  boolean shouldComputeCommaSeparated(CqnSelect cqn) {
    return cqn.items().stream().filter(CqnSelectListItem::isValue)
        .anyMatch(item -> item.asValue().displayName().equals(SkillsConsumptionVH.COMMA_SEPARATED_CATALOGS));
  }

  CqnSelect ensureCatalogExpansion(CqnSelect cqn) {
    return CQL.copy(cqn, new Modifier() {
      @Override
      public List<CqnSelectListItem> items(List<CqnSelectListItem> columns) {
        columns.add(CQL.to(SkillsConsumptionVH.CATALOG_ASSOCIATIONS)
            .expand(a -> a.to(Catalogs2SkillsConsumption.CATALOG).expand(CatalogsConsumption.NAME)));
        return columns;
      }
    });
  }

  String computeCommaSeparated(List<Catalogs2SkillsConsumption> catalogAssociations) {
    if (catalogAssociations == null) {
      return "";
    }
    return catalogAssociations.stream()
        .filter(c2s -> c2s.getCatalog() != null && c2s.getCatalog().getName() != null
            && !c2s.getCatalog().getName().isEmpty())
        .sorted(Comparator.comparing(c2s -> c2s.getCatalog().getName())).map(c2s -> c2s.getCatalog().getName())
        .collect(Collectors.joining(", "));
  }

  // Serialization fails if non-nullable properties are null -- which they might
  // be, as our expand is as sparse as possible
  void removeInvalidAssociation(SkillsConsumptionVH skill) {
    if (skill.getCatalogAssociations().stream().anyMatch(c2s -> c2s.getId() == null)) {
      skill.remove(SkillsConsumptionVH.CATALOG_ASSOCIATIONS);
    }
  }

}
