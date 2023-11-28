package com.sap.c4p.rm.consultantprofile.businessserviceorgservices.resourceorganization.utils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import com.sap.cds.services.ServiceException;

import com.sap.resourcemanagement.config.ResourceOrganizations;

@DisplayName("Unit test for Resource Organization HANA Display ID Generator")
public class ResOrgHanaDisplayIDGeneratorTest {

    @Mock
    private DataSource mockDataSource;

    @Mock
    private Connection mockConnection;

    @Mock
    private PreparedStatement mockPreparedStatement;

    @Mock
    private ResultSet mockResultSet;

    /**
     * Class Under Test
     *
     */
    private ResOrgHanaDisplayIDGenerator cut;

    @BeforeEach
    public void setUp() throws Exception {
        MockitoAnnotations.openMocks(this).close();
        cut = new ResOrgHanaDisplayIDGenerator(mockDataSource);
    }

    @Nested
    @DisplayName("Unit Tests for getDisplayId")
    public class DisplayIdTest {
        @Test
        @DisplayName("Unit Test when resource Org ID doesn't exist, On Success")
        public void validateGetDisplayIdOnSuccess() throws SQLException {
            ResOrgHanaDisplayIDGenerator spyOfCut = Mockito.spy(cut);
            ResourceOrganizations mockResourceOrganization = mock(ResourceOrganizations.class);

            doReturn(mockConnection).when(spyOfCut).getConnection(mockDataSource);
            doReturn(mockPreparedStatement).when(mockConnection).prepareStatement(any());
            doReturn(mockResultSet).when(mockPreparedStatement).executeQuery();
            doReturn(true).when(mockResultSet).next();

            doReturn((long) 42).when(mockResultSet).getLong(any());

            assertEquals("00042", spyOfCut.getDisplayId());
            verify(mockResourceOrganization, times(0)).getDisplayId();
            verify(spyOfCut, times(1)).getConnection(mockDataSource);
            verify(mockConnection, times(1)).prepareStatement(any());

        }

        @Test
        @DisplayName("Negative Testing")
        public void validateGetDisplayIDWhenException() throws SQLException {
            ResOrgHanaDisplayIDGenerator spyOfCut = Mockito.spy(cut);
            doReturn(mockConnection).when(spyOfCut).getConnection(mockDataSource);

            ServiceException e = new ServiceException("Unable to generate display ID");
            doThrow(new SQLException("New SQL Exception.")).when(mockConnection).prepareStatement(any());
            final ServiceException exception = assertThrows(ServiceException.class, () -> spyOfCut.getDisplayId());
            assertEquals(e.getMessage(), exception.getMessage());
        }
    }

}
