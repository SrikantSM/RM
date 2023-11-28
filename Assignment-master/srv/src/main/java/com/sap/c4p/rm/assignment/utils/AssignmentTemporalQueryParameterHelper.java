package com.sap.c4p.rm.assignment.utils;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import com.sap.cds.ql.Select;
import com.sap.cds.services.persistence.PersistenceService;
import com.sap.cds.services.runtime.CdsRuntime;

import com.sap.resourcemanagement.resource.ResourceDetailsForTimeWindow;
import com.sap.resourcemanagement.resource.ResourceDetailsForTimeWindow_;

import assignmentservice.AssignmentBuckets;

public class AssignmentTemporalQueryParameterHelper {

  /*
   * Suppressing warning 'Lambdas containing only one statement should not nest
   * this statement in a block' as it leads to compilation failure - 'reference to
   * run is ambiguous [ERROR]
   */
  @SuppressWarnings({ "squid:S1602" })
  public Optional<ResourceDetailsForTimeWindow> getTemporalResourceDetails(
      List<AssignmentBuckets> listAssignmentBuckets, CdsRuntime cdsRuntime, String resourceId,
      PersistenceService persistenceService) {

    Instant startDate = listAssignmentBuckets.get(0).getStartTime();
    Instant endDate = listAssignmentBuckets.get(listAssignmentBuckets.size() - 1).getStartTime();

    return cdsRuntime.requestContext().modifyParameters(p -> p.setValidFrom(startDate))
        .modifyParameters(p -> p.setValidTo(endDate)).run(internalContext -> {
          return persistenceService
              .run(Select.from(ResourceDetailsForTimeWindow_.CDS_NAME)
                  .columns(ResourceDetailsForTimeWindow.RESOURCE_ORG_CODE,
                      ResourceDetailsForTimeWindow.WORK_ASSIGNMENT_ID, ResourceDetailsForTimeWindow.COUNTRY_CODE)
                  .where(b -> b.get(ResourceDetailsForTimeWindow.RESOURCE_ID).eq(resourceId)))
              .first(ResourceDetailsForTimeWindow.class);
        });
  }
}
