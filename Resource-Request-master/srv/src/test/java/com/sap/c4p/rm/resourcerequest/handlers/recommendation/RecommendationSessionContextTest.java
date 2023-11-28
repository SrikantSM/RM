package com.sap.c4p.rm.resourcerequest.handlers.recommendation;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

@DisplayName("Unit test for Matching Candidates Handler class")
public class RecommendationSessionContextTest {

  /*
   * Class under test
   *
   */
  private static RecommendationSessionContext cut;
  private static Connection mockDatabaseConnection;
  private static PreparedStatement mockPreparedStatement;

  @BeforeAll
  public static void setUp() {
    cut = new RecommendationSessionContext();
    mockDatabaseConnection = mock(Connection.class);
  }

  @Nested
  @DisplayName("Unit Test for RecommendationSessionContext setSessionContext")
  public class WhenRecommendationSessionContextSetContext {

    @Test
    @DisplayName("Testing RecommendationSessionContext setSessionContext")
    public void testSetContext() throws SQLException {
      // Data needed for test
      String resourceRequestID = "450a2453-ec0a-4a85-8247-94c39b9bdd67";
      List<String> authResourceOrganizations = new ArrayList<String>();
      authResourceOrganizations.add("ROO1");
      authResourceOrganizations.add("ROO2");

      // Mocks
      mockPreparedStatement = mock(PreparedStatement.class);
      when(mockDatabaseConnection.prepareStatement(any())).thenReturn(mockPreparedStatement);
      // Test
      cut.setSessionContext(mockDatabaseConnection, resourceRequestID, authResourceOrganizations);
      // Assertions
      verify(mockPreparedStatement, times(1)).executeBatch();
      verify(mockPreparedStatement, times(2)).addBatch();
      verify(mockPreparedStatement, times(1)).setString(1, authResourceOrganizations.get(0));
      verify(mockPreparedStatement, times(1)).setString(1, authResourceOrganizations.get(1));
      verify(mockPreparedStatement, times(1)).setString(1, resourceRequestID);
      verify(mockPreparedStatement, times(1)).execute();
    }
  }

  @Nested
  @DisplayName("Unit Test for RecommendationSessionContext deleteDataFromTempTable")
  public class WhenRecommendationSessionContextDelete {

    @Test
    @DisplayName("Testing RecommendationSessionContext deleteDataFromTempTable")
    public void testDelete() throws SQLException {
      // Mocks
      mockPreparedStatement = mock(PreparedStatement.class);
      when(mockDatabaseConnection.prepareStatement(any())).thenReturn(mockPreparedStatement);
      // Test
      cut.deleteDataFromTempTable(mockDatabaseConnection);
      // Assertion
      verify(mockPreparedStatement, times(1)).execute();
    }
  }
}
