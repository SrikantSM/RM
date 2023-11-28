package com.sap.c4p.rm.resourcerequest.utils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.resourcerequest.gen.MessageKeys;

@DisplayName("Unit test for HANA display ID Generator")
public class HanaDisplayIDGeneratorTest {

  private static DataSource mockDataSource;
  private static Connection mockConnection;
  private static PreparedStatement mockPreparedStatement;
  private static ResultSet mockResultSet;

  /*
   * Class under test
   *
   */
  private static HanaDisplayIDGenerator cut;

  @BeforeAll
  public static void setUp() {
    mockDataSource = mock(DataSource.class);
    mockConnection = mock(Connection.class);
    mockPreparedStatement = mock(PreparedStatement.class);
    mockResultSet = mock(ResultSet.class);
    cut = new HanaDisplayIDGenerator(mockDataSource);
  }

  @Nested
  @DisplayName("Unit Test for HANA display ID generator")
  public class WhenMatchingCandidatesHandlers {
    public HanaDisplayIDGenerator spyOfCut = spy(cut);

    @Test
    @DisplayName("Testing DisplayIDGenerator")
    public void validateGenerateDisplayID() throws SQLException {

      doReturn(mockConnection).when(spyOfCut).getConnection(mockDataSource);
      doReturn(mockPreparedStatement).when(mockConnection).prepareStatement(any());
      doReturn(mockResultSet).when(mockPreparedStatement).executeQuery();
      doReturn(true).when(mockResultSet).next();
      doReturn((long) 42).when(mockResultSet).getLong(any());

      assertEquals("0000000042", spyOfCut.getDisplayId());
    }

    @Test
    @DisplayName("Negative test Testing DisplayIDGenerator")
    public void validateFailureGenerateDisplayID() throws SQLException {
      doReturn(mockConnection).when(spyOfCut).getConnection(mockDataSource);

      ServiceException e = new ServiceException(MessageKeys.DISPLAYID_GENERATION_FAILED);
      doThrow(new SQLException("New SQL Exception.")).when(mockConnection).prepareStatement(any());
      final ServiceException exception = assertThrows(ServiceException.class, () -> spyOfCut.getDisplayId());
      assertEquals(e.getMessage(), exception.getMessage());
    }
  }
}
