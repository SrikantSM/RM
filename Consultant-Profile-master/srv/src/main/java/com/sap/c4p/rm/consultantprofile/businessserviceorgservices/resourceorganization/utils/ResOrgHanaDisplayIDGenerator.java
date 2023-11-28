package com.sap.c4p.rm.consultantprofile.businessserviceorgservices.resourceorganization.utils;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.Scope;
import org.springframework.jdbc.datasource.DataSourceUtils;
import org.springframework.stereotype.Component;

import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;

@Component
@Profile({ "cloud", "hana" })
@Scope("prototype")
public class ResOrgHanaDisplayIDGenerator implements ResOrgDisplayIDGenerator {

    private DataSource dataSource;
    private Connection connection;

    @Autowired
    public ResOrgHanaDisplayIDGenerator(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public String getDisplayId() {

        try {

            // Get connection.
            Connection databaseConnection = getConnection(dataSource);
            // Call Hana DB sequence to generate next displayID.
            try (PreparedStatement preparedStatement = databaseConnection
                    .prepareStatement("SELECT RES_ORG_DISPLAY_ID.NEXTVAL FROM DUMMY")) {
                ResultSet result = preparedStatement.executeQuery();
                result.next();
                long displayID = result.getLong("RES_ORG_DISPLAY_ID.NEXTVAL");
                // The value from db sequence will be of type long so converting to string with
                // preceding 0 and sending back.
                return String.format("%05d", displayID);
            }
        } catch (SQLException e) {
            throw new ServiceException(ErrorStatuses.BAD_GATEWAY, "Unable to generate display ID");
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
