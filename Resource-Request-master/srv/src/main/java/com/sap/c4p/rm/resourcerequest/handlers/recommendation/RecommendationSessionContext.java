package com.sap.c4p.rm.resourcerequest.handlers.recommendation;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("cloud")
public class RecommendationSessionContext {

  private static final String SQL_CALL_PATTERN = "CALL COM_SAP_RESOURCEMANAGEMENT_MATCHINGCANDIDATE_SET_SESSION_CONTEXT(RESOURCEREQUEST_ID => ?)";
  private static final String SQL_INSERT_PATTERN = "INSERT INTO COM_SAP_RESOURCEMANAGEMENT_RESOURCEREQUEST_USERRESOURCEORGANIZATIONS VALUES(?)";
  private static final String SQL_DELETE_PATTERN = "DELETE FROM COM_SAP_RESOURCEMANAGEMENT_RESOURCEREQUEST_USERRESOURCEORGANIZATIONS";

  public void setSessionContext(Connection databaseConnection, String resourceRequestID,
      List<String> resourceOrganizations) throws SQLException {

    try (PreparedStatement insertStatement = databaseConnection.prepareStatement(SQL_INSERT_PATTERN)) {
      for (String resourceOrganization : resourceOrganizations) {
        insertStatement.setString(1, resourceOrganization);
        insertStatement.addBatch();
      }
      insertStatement.executeBatch();
    }

    try (PreparedStatement preparedStatement = databaseConnection.prepareStatement(SQL_CALL_PATTERN)) {
      preparedStatement.setString(1, resourceRequestID);
      preparedStatement.execute();
    }

  }

  public void deleteDataFromTempTable(Connection databaseConnection) throws SQLException {
    try (PreparedStatement deleteStatement = databaseConnection.prepareStatement(SQL_DELETE_PATTERN)) {
      deleteStatement.execute();
    }
  }
}
