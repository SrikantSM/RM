package com.sap.c4p.rm.projectintegrationadapter.util;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.datasource.DataSourceUtils;
import org.springframework.stereotype.Component;

import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;

@Component
@Profile({ "cloud" })
public class HanaDisplaylIDGenerator implements DisplayIDGenerator {
  private DataSource dataSource;
  private Connection connection;

  @Autowired
  public HanaDisplaylIDGenerator(DataSource dataSource) {
    this.dataSource = dataSource;
  }

  @Override
  public String getDisplayId() {
    try {
      // Get connection.
      Connection databaseConnection = getConnection(dataSource);
      // Call Hana DB sequence to generate next displayID.
      try (PreparedStatement preparedStatement = databaseConnection
          .prepareStatement("SELECT DISPLAY_ID.NEXTVAL FROM DUMMY")) {
        ResultSet result = preparedStatement.executeQuery();
        result.next();
        long displayID = result.getLong("DISPLAY_ID.NEXTVAL");
        // The value from db sequence will be of type long so converting to string with
        // preceding 0 and sending back. 
        return String.format("%010d", displayID);
      }
    } catch (SQLException e) {
      throw new ServiceException(ErrorStatuses.BAD_GATEWAY, Constants.LoggerMessages.DISPLAYID_GENERATION_FAILED);
    }
  }

  public Connection getConnection(DataSource dataSource) throws SQLException {
    // Check if an open connection already exists.
    if (connection == null || connection.isClosed()) {
      connection = DataSourceUtils.getConnection(dataSource);
    }
    return connection;
  }

}