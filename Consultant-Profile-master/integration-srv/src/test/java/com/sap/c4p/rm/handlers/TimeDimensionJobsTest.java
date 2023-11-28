package com.sap.c4p.rm.handlers;

import static com.sap.c4p.rm.TestConstants.CONSUMER_SUB_DOMAIN;
import static org.mockito.Mockito.*;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;

import com.sap.c4p.rm.InitMocks;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.service.JobSchedulerService;
import com.sap.c4p.rm.config.LoggingMarker;

public class TimeDimensionJobsTest extends InitMocks {

    private static final Marker TIME_DIMENSION_DATA_GENERATION = LoggingMarker.TIME_DIMENSION_DATA_GENERATION
            .getMarker();

    @Mock
    DataSource datasource;

    @Mock
    JobSchedulerService jobSchedulerService;

    @Mock
    JobSchedulerRunHeader jobSchedulerRunHeader;

    @Mock
    Connection connection;

    @Mock
    CallableStatement callableStatement;

    @Autowired
    @InjectMocks
    TimeDimensionJobsImpl classUnderTest;

    @Test
    @DisplayName("test submitForScheduleTimeDimension with already running job")
    public void testSubmitForScheduleTimeDimensionWithAlreadyRunningJob() {
        when(this.jobSchedulerService.ifPreviousRunComplete(TIME_DIMENSION_DATA_GENERATION, CONSUMER_SUB_DOMAIN,
                this.jobSchedulerRunHeader)).thenReturn(false);
        try {
            this.classUnderTest.submitForScheduleTimeDimension(CONSUMER_SUB_DOMAIN, this.jobSchedulerRunHeader);
            verify(this.connection, times(0)).prepareCall(anyString());
        } catch (SQLException sqlException) {
            System.out.println("SQLException occurred");
        }
    }

    @Test
    @DisplayName("test submitForScheduleTimeDimension when connection to database is not provided")
    public void testSubmitForScheduleTimeDimensionWhenConnectionToDatabaseIsNotProvided() {
        when(this.jobSchedulerService.ifPreviousRunComplete(TIME_DIMENSION_DATA_GENERATION, CONSUMER_SUB_DOMAIN,
                this.jobSchedulerRunHeader)).thenReturn(true);
        try {
            doReturn(null).when(this.datasource).getConnection();
            this.classUnderTest.submitForScheduleTimeDimension(CONSUMER_SUB_DOMAIN, this.jobSchedulerRunHeader);
            verify(this.connection, times(0)).prepareCall(anyString());
        } catch (SQLException sqlException) {
            System.out.println("SQLException occurred");
        }
    }

    @Test
    @DisplayName("test submitForScheduleTimeDimension when connection is provided and statement is not provided.")
    public void testSubmitForScheduleTimeDimensionWhenConnectionIsProvidedAndStatementIsNotProvided() {
        when(this.jobSchedulerService.ifPreviousRunComplete(TIME_DIMENSION_DATA_GENERATION, CONSUMER_SUB_DOMAIN,
                this.jobSchedulerRunHeader)).thenReturn(true);
        try {
            doReturn(connection).when(this.datasource).getConnection();
            this.classUnderTest.submitForScheduleTimeDimension(CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader);
            verify(this.connection, times(1)).prepareCall(anyString());
        } catch (SQLException sqlException) {
            System.out.println("SQLException occurred");
        }
    }

    @Test
    @DisplayName("test submitForScheduleTimeDimension when connection is provided and statement is not provided.")
    public void testSubmitForScheduleTimeDimensionWhenConnectionIsProvided() {
        when(this.jobSchedulerService.ifPreviousRunComplete(TIME_DIMENSION_DATA_GENERATION, CONSUMER_SUB_DOMAIN,
                this.jobSchedulerRunHeader)).thenReturn(true);
        try {
            when(this.connection.prepareCall(anyString())).thenReturn(callableStatement);
            when(this.datasource.getConnection()).thenReturn(connection);
            this.classUnderTest.submitForScheduleTimeDimension(CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader);
            verify(this.connection, times(1)).prepareCall(anyString());
        } catch (SQLException sqlException) {
            System.out.println("SQLException occurred");
        }
    }

    @Test
    @DisplayName("test submitForScheduleTimeDimension when a exception is recorded.")
    public void testSubmitForScheduleTimeDimensionWhenWhenExceptionIsRecorded() {
        when(this.jobSchedulerService.ifPreviousRunComplete(TIME_DIMENSION_DATA_GENERATION, CONSUMER_SUB_DOMAIN,
                this.jobSchedulerRunHeader)).thenReturn(true);
        try {
            doThrow(RuntimeException.class).when(this.connection).close();
            when(this.datasource.getConnection()).thenReturn(connection);
            this.classUnderTest.submitForScheduleTimeDimension(CONSUMER_SUB_DOMAIN, jobSchedulerRunHeader);
            verify(this.connection, times(1)).prepareCall(anyString());
        } catch (SQLException sqlException) {
            System.out.println("SQLException occurred");
        }
    }

}
