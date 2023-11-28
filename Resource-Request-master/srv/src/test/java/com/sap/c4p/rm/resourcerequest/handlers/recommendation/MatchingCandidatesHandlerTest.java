package com.sap.c4p.rm.resourcerequest.handlers.recommendation;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.sql.Connection;
import java.sql.SQLException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import javax.sql.DataSource;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import com.sap.cds.Result;
import com.sap.cds.Struct;
import com.sap.cds.ql.cqn.AnalysisResult;
import com.sap.cds.ql.cqn.CqnAnalyzer;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.ResolvedSegment;
import com.sap.cds.reflect.CdsModel;
import com.sap.cds.services.cds.CdsReadEventContext;
import com.sap.cds.services.persistence.PersistenceService;
import com.sap.cds.services.request.UserInfo;
import com.sap.cds.services.runtime.CdsRuntime;

import com.sap.c4p.rm.resourcerequest.actions.utils.CqnAnalyzerWrapper;

import manageresourcerequestservice.ResourceRequests;
import processresourcerequestservice.MatchingCandidates;

@DisplayName("Unit test for Matching Candidates Handler class")
public class MatchingCandidatesHandlerTest {

  private static RecommendationSessionContext mockSessionContext;
  private static DataSource mockDataSource;
  private static CqnAnalyzerWrapper mockCqnAnalyzerWrapper;
  private static CdsRuntime mockCdsRuntime;
  private static PersistenceService mockPersistenceService;
  private Result mockResult;
  private static MatchingCandidatesHelper mockMatchingCandidatesHelper;

  /*
   * Class under test
   *
   */
  private static MatchingCandidatesHandler cut;

  @BeforeAll
  public static void setUp() {
    mockSessionContext = mock(RecommendationSessionContext.class);
    mockDataSource = mock(DataSource.class);
    mockCqnAnalyzerWrapper = mock(CqnAnalyzerWrapper.class);
    mockCdsRuntime = mock(CdsRuntime.class, RETURNS_DEEP_STUBS);
    mockPersistenceService = mock(PersistenceService.class);
    mockMatchingCandidatesHelper = mock(MatchingCandidatesHelper.class);

    cut = new MatchingCandidatesHandler(mockSessionContext, mockDataSource, mockCqnAnalyzerWrapper, mockCdsRuntime,
        mockPersistenceService, mockMatchingCandidatesHelper);
  }

  @Nested
  @DisplayName("Unit Test for mattching candidates method")
  public class WhenMatchingCandidatesHandlers {

    private ResourceRequests resourceRequest;
    List<String> authResourceOrganizations;

    public MatchingCandidatesHandler spyMatchingClass;

    @BeforeEach
    public void setUpResourceRequest() {

      resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setId("450a2453-ec0a-4a85-8247-94c39b9bdd67");
      authResourceOrganizations = new ArrayList<String>();
      authResourceOrganizations.add("ROO1");
      authResourceOrganizations.add("ROO2");
    }

    @Test
    @DisplayName("Testing Before Matching Cadidate Handler")
    public void beforeMatchingCandidatesRead() throws SQLException {

      CdsModel mockCdsModel = mock(CdsModel.class);
      CqnAnalyzer mockCqnAnalyzer = mockCqnAnalyzerWrapper.create(mockCdsModel);
      CdsReadEventContext mockContext = mock(CdsReadEventContext.class);
      UserInfo mockUserInfo = mock(UserInfo.class);
      CqnSelect selectContex = mock(CqnSelect.class);
      ResolvedSegment mockRow = mock(ResolvedSegment.class);
      Iterator<ResolvedSegment> mockIterator = mock(Iterator.class);
      Connection mockConnection = mock(Connection.class);
      spyMatchingClass = spy(cut);

      AnalysisResult mockAnalysisResult = mock(AnalysisResult.class);
      HashMap<String, Object> map = new HashMap<>();
      List<String> uaaResourceOrganizations = new ArrayList<>();
      uaaResourceOrganizations.add("ROO1");
      uaaResourceOrganizations.add("ROO2");

      when(mockContext.getModel()).thenReturn(mockCdsModel);
      when(mockContext.getCqn()).thenReturn(selectContex);
      when(mockCqnAnalyzerWrapper.analyze(mockCqnAnalyzer, selectContex)).thenReturn(mockAnalysisResult);
      map.put(ResourceRequests.ID, resourceRequest.getId());
      when(mockIterator.hasNext()).thenReturn(true);
      when(mockIterator.next()).thenReturn(mockRow);
      when(mockRow.keys()).thenReturn(map);
      when(mockAnalysisResult.iterator()).thenReturn(mockIterator);
      when(mockContext.getUserInfo()).thenReturn(mockUserInfo);
      when(mockUserInfo.getAttributeValues("ProcessingResourceOrganization")).thenReturn(uaaResourceOrganizations);

      doReturn(mockConnection).when(spyMatchingClass).getConnection(mockDataSource);

      spyMatchingClass.beforeMatchingCandidatesRead(mockContext);
      verify(mockSessionContext, times(1)).setSessionContext(mockConnection, resourceRequest.getId(),
          authResourceOrganizations);

    }

    @Test
    @DisplayName("Testing On Matching Cadidate Handler")
    public void onMatchingCandidatesRead() throws SQLException {

      CdsModel mockCdsModel = mock(CdsModel.class);
      CqnAnalyzer mockCqnAnalyzer = mockCqnAnalyzerWrapper.create(mockCdsModel);
      CdsReadEventContext mockContext = mock(CdsReadEventContext.class);
      CqnSelect selectContex = mock(CqnSelect.class);
      ResolvedSegment mockRow = mock(ResolvedSegment.class);
      Iterator<ResolvedSegment> mockIterator = mock(Iterator.class);
      spyMatchingClass = spy(cut);

      AnalysisResult mockAnalysisResult = mock(AnalysisResult.class);
      HashMap<String, Object> map = new HashMap<>();

      when(mockContext.getModel()).thenReturn(mockCdsModel);
      when(mockContext.getCqn()).thenReturn(selectContex);
      when(mockCqnAnalyzerWrapper.analyze(mockCqnAnalyzer, selectContex)).thenReturn(mockAnalysisResult);
      map.put(ResourceRequests.ID, resourceRequest.getId());
      when(mockIterator.hasNext()).thenReturn(true);
      when(mockIterator.next()).thenReturn(mockRow);
      when(mockRow.keys()).thenReturn(map);
      when(mockAnalysisResult.iterator()).thenReturn(mockIterator);
      doReturn(Instant.now()).when(spyMatchingClass).getValidDate(resourceRequest.getId());

      spyMatchingClass.onMatchingCandidatesRead(mockContext);

      verify(mockCdsRuntime, times(1)).requestContext();
      verify(mockCqnAnalyzerWrapper, times(1)).analyze(mockCqnAnalyzer, selectContex);

    }

    @Test
    @DisplayName("Testing After Matching Cadidate Handler")
    public void onAfterMatchingCandidates() throws SQLException {
      Connection mockConnection = mock(Connection.class);

      CdsModel mockCdsModel = mock(CdsModel.class);
      CdsReadEventContext mockContext = mock(CdsReadEventContext.class);
      CqnSelect selectContext = mock(CqnSelect.class);
      ResolvedSegment mockRow = mock(ResolvedSegment.class);
      Iterator<ResolvedSegment> mockIterator = mock(Iterator.class);

      spyMatchingClass = spy(cut);

      AnalysisResult mockAnalysisResult = mock(AnalysisResult.class);
      HashMap<String, Object> map = new HashMap<>();

      when(mockContext.getModel()).thenReturn(mockCdsModel);
      when(mockContext.getCqn()).thenReturn(selectContext);
      map.put(ResourceRequests.ID, resourceRequest.getId());
      when(mockIterator.hasNext()).thenReturn(true);
      when(mockIterator.next()).thenReturn(mockRow);
      when(mockRow.keys()).thenReturn(map);
      when(mockAnalysisResult.iterator()).thenReturn(mockIterator);

      List<MatchingCandidates> matchingCandidates = new ArrayList<>();

      doReturn(mockConnection).when(spyMatchingClass).getConnection(mockDataSource);
      doNothing().when(mockSessionContext).deleteDataFromTempTable(mockConnection);
      doNothing().when(mockMatchingCandidatesHelper).computeCommaSeparatedFields(matchingCandidates);

      spyMatchingClass.afterMatchingCandidatesRead(mockContext, matchingCandidates);

      verify(mockSessionContext, times(1)).deleteDataFromTempTable(mockConnection);
      verify(mockMatchingCandidatesHelper, times(1)).computeCommaSeparatedFields(matchingCandidates);
    }
  }

  @Nested
  @DisplayName("Test Valid Date ")
  public class getValidDate {
    private ResourceRequests resourceRequest;

    @BeforeEach
    public void setUpResourceRequest() {
      resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setId("450a2453-ec0a-4a85-8247-94c39b9bdd67");
    }

    @Test
    @DisplayName("Check valid date when Resource Request start date is after current date")
    public void getValidDateStartDate() throws SQLException {

      LocalDate currentDate = LocalDate.now();
      LocalDate startDate = currentDate.plusMonths(5);
      resourceRequest.setStartDate(startDate);

      mockResult = mock(Result.class);
      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.single(ResourceRequests.class)).thenReturn(resourceRequest);

      Instant ValidDate = cut.getValidDate(resourceRequest.getId());
      assertEquals(startDate.atStartOfDay(ZoneId.systemDefault()).toInstant(), ValidDate);

    }

    @Test
    @DisplayName("Check valid date when Resource Request start date is before current date")
    public void getValidDateCurrentDate() throws SQLException {

      LocalDate currentDate = LocalDate.now();
      LocalDate startDate = currentDate.minusMonths(5);
      resourceRequest.setStartDate(startDate);

      mockResult = mock(Result.class);
      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.single(ResourceRequests.class)).thenReturn(resourceRequest);

      Instant ValidDate = cut.getValidDate(resourceRequest.getId());
      assertEquals(currentDate.atStartOfDay(ZoneId.systemDefault()).toInstant(), ValidDate);

    }

  }

}
