package com.sap.c4p.rm.resourcerequest.handlers.recommendation;

import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.sap.cds.services.cds.CdsReadEventContext;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.ServiceName;

import processresourcerequestservice.MatchingCandidates;
import processresourcerequestservice.MatchingCandidates_;
import processresourcerequestservice.ProcessResourceRequestService_;

@Component
@Profile("local-test")
@ServiceName(ProcessResourceRequestService_.CDS_NAME)
public class MatchingCandidatesHandlerLocal implements EventHandler {

  private MatchingCandidatesHelper matchingCandidatesHelper;

  @Autowired
  public MatchingCandidatesHandlerLocal(MatchingCandidatesHelper matchingCandidatesHelper) {
    this.matchingCandidatesHelper = matchingCandidatesHelper;
  }

  @Transactional(rollbackFor = { SQLException.class })
  @After(event = CqnService.EVENT_READ, entity = MatchingCandidates_.CDS_NAME)
  public void afterMatchingCandidatesRead(final CdsReadEventContext context,
      List<MatchingCandidates> matchingCandidates) throws SQLException {
    matchingCandidatesHelper.computeCommaSeparatedFields(matchingCandidates);
  }
}
