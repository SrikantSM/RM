package com.sap.c4p.rm.resourcerequest.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.sap.cds.Result;
import com.sap.cds.ql.CQL;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.resourcerequest.gen.MessageKeys;

import com.sap.resourcemanagement.resourcerequest.ResourceRequests_;

@Component
@Profile({ "default", "local-test" })
public class LocalDisplayIDGenerator implements DisplayIDGenerator {
  private PersistenceService persistenceService;

  @Autowired
  public LocalDisplayIDGenerator(PersistenceService persistenceService) {
    this.persistenceService = persistenceService;
  }

  @Override
  public String getDisplayId() {
    try {
      CqnSelect select = Select.from(ResourceRequests_.class).columns(c -> CQL.max(c.displayId()).as("maxDisplayID"));
      final Result result = persistenceService.run(select);
      String maxDisplayID = (String) result.single().get("maxDisplayID");
      long newDisplayID = Long.valueOf(maxDisplayID) + 1;
      return String.format("%010d", newDisplayID);
    } catch (Exception e) {
      throw new ServiceException(ErrorStatuses.BAD_GATEWAY, MessageKeys.DISPLAYID_GENERATION_FAILED);
    }
  }

}