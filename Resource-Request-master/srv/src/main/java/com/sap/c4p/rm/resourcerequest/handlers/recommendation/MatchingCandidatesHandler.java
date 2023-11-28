package com.sap.c4p.rm.resourcerequest.handlers.recommendation;

import java.sql.Connection;
import java.sql.SQLException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.datasource.DataSourceUtils;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.sap.cds.Result;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnAnalyzer;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.cds.CdsReadEventContext;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.persistence.PersistenceService;
import com.sap.cds.services.request.UserInfo;
import com.sap.cds.services.runtime.CdsRuntime;

import com.sap.c4p.rm.resourcerequest.actions.utils.CqnAnalyzerWrapper;
import com.sap.c4p.rm.resourcerequest.utils.Constants;

import manageresourcerequestservice.ResourceRequests;
import manageresourcerequestservice.ResourceRequests_;
import processresourcerequestservice.MatchingCandidates;
import processresourcerequestservice.MatchingCandidates_;
import processresourcerequestservice.ProcessResourceRequestService_;

@Component
@Profile({ "cloud" })
@ServiceName(ProcessResourceRequestService_.CDS_NAME)
public class MatchingCandidatesHandler implements EventHandler {

  private RecommendationSessionContext sessionContext;
  private DataSource dataSource;
  private CqnAnalyzerWrapper cqnAnalyzerWrapper;
  private PersistenceService persistenceService;
  private MatchingCandidatesHelper matchingCandidatesHelper;

  private CdsRuntime cdsRuntime;

  @Autowired
  public MatchingCandidatesHandler(RecommendationSessionContext sessionContext, DataSource dataSource,
      CqnAnalyzerWrapper cqnAnalyzerWrapper, CdsRuntime cdsRuntime, PersistenceService persistenceService,
      MatchingCandidatesHelper matchingCandidatesHelper) {
    this.sessionContext = sessionContext;
    this.dataSource = dataSource;
    this.cqnAnalyzerWrapper = cqnAnalyzerWrapper;
    this.cdsRuntime = cdsRuntime;
    this.persistenceService = persistenceService;
    this.matchingCandidatesHelper = matchingCandidatesHelper;
  }

  @Transactional(rollbackFor = { SQLException.class })
  @Before(event = CqnService.EVENT_READ, entity = MatchingCandidates_.CDS_NAME)
  public void beforeMatchingCandidatesRead(final CdsReadEventContext context) throws SQLException {
    UserInfo userInfo = context.getUserInfo();
    CqnAnalyzer cqnAnalyzer = cqnAnalyzerWrapper.create(context.getModel());
    CqnSelect query = context.getCqn();

    /* Get the resourceRequestID from the context */
    Map<String, Object> keys = cqnAnalyzerWrapper.analyze(cqnAnalyzer, query).iterator().next().keys();
    String resourceRequestId = (String) keys.get("ID");

    /* Get costCenter of ResourceManager from userInfo */
    List<String> userResourceOrganizations = userInfo.getAttributeValues(Constants.PROCESSING_RESOURCEORG).stream()
        .collect(Collectors.toList());

    sessionContext.setSessionContext(getConnection(dataSource), resourceRequestId, userResourceOrganizations);

  }

  @On(event = CqnService.EVENT_READ, entity = MatchingCandidates_.CDS_NAME)
  protected Result onMatchingCandidatesRead(CdsReadEventContext context) {

    CqnAnalyzer cqnAnalyzer = cqnAnalyzerWrapper.create(context.getModel());
    CqnSelect query = context.getCqn();

    /* Get the resourceRequestID from the context */
    Map<String, Object> keys = cqnAnalyzerWrapper.analyze(cqnAnalyzer, query).iterator().next().keys();
    String resourceRequestId = (String) keys.get("ID");

    /* Get the valid-from and valid-to from the Resource Request */
    Instant contextValidFrom = getValidDate(resourceRequestId);
    Instant contextValidTo = contextValidFrom;

    return cdsRuntime.requestContext().modifyParameters(p -> p.setValidFrom(contextValidFrom))
        .modifyParameters(p -> p.setValidTo(contextValidTo)).run(req -> {
          return persistenceService.run(context.getCqn(), context.getCqnNamedValues());
        });

  }

  @Transactional(rollbackFor = { SQLException.class })
  @After(event = CqnService.EVENT_READ, entity = MatchingCandidates_.CDS_NAME)
  public void afterMatchingCandidatesRead(final CdsReadEventContext context,
      List<MatchingCandidates> matchingCandidates) throws SQLException {
    matchingCandidatesHelper.computeCommaSeparatedFields(matchingCandidates);

    sessionContext.deleteDataFromTempTable(getConnection(dataSource));
  }

  public Connection getConnection(DataSource dataSource) {
    return DataSourceUtils.getConnection(dataSource);
  }

  public Instant getValidDate(String resourceRequestId) {

    CqnSelect select = Select.from(ResourceRequests_.class)
        .where(resourceRequest -> resourceRequest.ID().eq(resourceRequestId));
    final Result result = persistenceService.run(select);

    ResourceRequests resourceRequest = result.single(ResourceRequests.class);

    LocalDate startDateRR = resourceRequest.getStartDate();
    Instant startDate = startDateRR.atStartOfDay(ZoneId.systemDefault()).toInstant();
    Instant currentDate = LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant();

    if (currentDate.compareTo(startDate) > 0) {
      return currentDate;
    } else {
      return startDate;
    }

  }

}
