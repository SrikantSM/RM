package com.sap.c4p.rm.assignment.utils;

import java.time.Instant;
import java.util.Optional;

import com.sap.cds.ql.Select;
import com.sap.cds.services.persistence.PersistenceService;
import com.sap.cds.services.runtime.CdsRuntime;
import com.sap.cds.services.runtime.RequestContextRunner;

import com.sap.resourcemanagement.workforce.workassignment.ExtnWorkAssignmentFirstJobDetails;
import com.sap.resourcemanagement.workforce.workassignment.ExtnWorkAssignmentFirstJobDetails_;

public class ResourceValidityUtility {

  public Optional<ExtnWorkAssignmentFirstJobDetails> getResourceValidityForTheGivenPeriodAndResourceOrg(
      Instant startDate, Instant endDate, String resourceId, String resourceOrg, PersistenceService persistenceService,
      CdsRuntime cdsRuntime) {

    RequestContextRunner requestContextRunner = cdsRuntime.requestContext()
        .modifyParameters(p -> p.setValidFrom(startDate)).modifyParameters(p -> p.setValidTo(endDate));

    return requestContextRunner.run(req -> {

      return persistenceService
          .run(Select.from(ExtnWorkAssignmentFirstJobDetails_.class)
              .columns(b -> b.ID(), b -> b.validFrom(), b -> b.validTo()).orderBy(b -> b.validFrom().asc())
              .where(b -> b.parent().eq(resourceId).and(b.to("resourceOrg").get("ID").eq(resourceOrg))))
          .first(ExtnWorkAssignmentFirstJobDetails.class);

    });

  }
}
