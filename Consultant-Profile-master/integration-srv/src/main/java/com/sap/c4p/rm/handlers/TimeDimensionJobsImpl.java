package com.sap.c4p.rm.handlers;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.Timestamp;
import java.sql.Types;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.Period;
import java.time.temporal.TemporalAdjuster;
import java.time.temporal.TemporalAdjusters;

import javax.sql.DataSource;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobScheduleRunPayload;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.service.JobSchedulerService;
import com.sap.c4p.rm.config.LoggingMarker;
import com.sap.c4p.rm.exceptions.ReplicationException;
import com.sap.c4p.rm.exceptions.TransactionException;
import com.sap.c4p.rm.replicationdao.ReplicationErrorMessagesDAO;
import com.sap.c4p.rm.utils.StringFormatter;

/**
 *
 * @author I516423 An API to call the time dimension update procedure
 *
 */
@Component
public class TimeDimensionJobsImpl implements TimeDimensionJobs {

    private static final Logger LOGGER = LoggerFactory.getLogger(TimeDimensionJobsImpl.class);
    private static final Marker TIME_DIMENSION_DATA_GENERATION_MARKER = LoggingMarker.TIME_DIMENSION_DATA_GENERATION
            .getMarker();
    private static final String TOTAL_RECORDS_UPDATED = "totalRecordsInTimeDimensionUpdatedSuccessfully";
    private static final String START_TIMESTAMP = "startTimestamp";
    private static final String END_TIMESTAMP = "endTimestamp";
    private static final LocalDate now = LocalDate.now();

    private final DataSource datasource;
    private final JobSchedulerService jobSchedulerService;
    private final ReplicationErrorMessagesDAO replicationErrorMessagesDAO;

    @Autowired
    public TimeDimensionJobsImpl(final DataSource dataSource, final JobSchedulerService jobSchedulerService,
            final ReplicationErrorMessagesDAO replicationErrorMessagesDAO) {
        this.datasource = dataSource;
        this.jobSchedulerService = jobSchedulerService;
        this.replicationErrorMessagesDAO = replicationErrorMessagesDAO;
    }

    @Override
    public void submitForScheduleTimeDimension(final String subDomain,
            final JobSchedulerRunHeader jobSchedulerRunHeader) {
        if (this.jobSchedulerService.ifPreviousRunComplete(TIME_DIMENSION_DATA_GENERATION_MARKER, subDomain,
                jobSchedulerRunHeader)) {
            int noOfUpdatedRows = 0;
            LocalDateTime currentYearStartTime = now.with(TemporalAdjusters.firstDayOfYear()).atStartOfDay();
            TemporalAdjuster startTimeStampAdjuster = t -> t.minus(Period.ofYears(3));
            Timestamp startTimeStamp = Timestamp.valueOf(currentYearStartTime.with(startTimeStampAdjuster));
            LocalDateTime currentYearEndTime = now.with(TemporalAdjusters.lastDayOfYear()).atTime(LocalTime.MAX);
            TemporalAdjuster endTimeStampAdjuster = t -> t.plus(Period.ofYears(10));
            Timestamp endTimeStamp = Timestamp.valueOf(currentYearEndTime.with(endTimeStampAdjuster));
            // Generating start & end time parameters for the time dimension data
            LOGGER.info(TIME_DIMENSION_DATA_GENERATION_MARKER, "Start Time: {} ", startTimeStamp);
            LOGGER.info(TIME_DIMENSION_DATA_GENERATION_MARKER, "End Time: {} ", endTimeStamp);
            try {
                noOfUpdatedRows = callFillTimeDimensionProcedure(startTimeStamp, endTimeStamp);
            } catch (Exception exception) {
                LOGGER.info(TIME_DIMENSION_DATA_GENERATION_MARKER, "Exception: {}", exception.getMessage());
            }
            JSONObject jsonObject = new JSONObject();
            jsonObject.put(START_TIMESTAMP, startTimeStamp);
            jsonObject.put(END_TIMESTAMP, endTimeStamp);
            jsonObject.put(TOTAL_RECORDS_UPDATED, noOfUpdatedRows);
            JobScheduleRunPayload jobScheduleRunPayload;
            jobScheduleRunPayload = new JobScheduleRunPayload(true, jsonObject.toString());
            this.jobSchedulerService.updateJobRun(TIME_DIMENSION_DATA_GENERATION_MARKER, subDomain,
                    jobSchedulerRunHeader, jobScheduleRunPayload);
        }
    }

    private int callFillTimeDimensionProcedure(final Timestamp startTimeStamp, final Timestamp endTimeStamp) {
        int noOfRowsUpdated = 0;
        // Establishing database connection
        try (Connection conn = this.datasource.getConnection()) {
            connectionCheck(conn);
            // Function call Preparation
            try (CallableStatement stmt = conn.prepareCall("{call RM_FILL_TIME_DIMENSION(?,?,?,?)}")) {
                // Parameters to be passed for hdbprocedure
                stmt.setString(1, "05");
                stmt.setTimestamp(2, startTimeStamp);
                stmt.setTimestamp(3, endTimeStamp);
                stmt.registerOutParameter(4, Types.INTEGER);
                // Executing the CallableStatement
                stmt.executeQuery();
                // Return Parameter
                noOfRowsUpdated = stmt.getInt(4);
            }
        } catch (ServiceException serviceException) {
            LOGGER.error(serviceException.getLocalizedMessage(), serviceException);
        } catch (ReplicationException replicationException) {
            LOGGER.error(StringFormatter.format(
                    this.replicationErrorMessagesDAO.getReplicationErrorMessages()
                            .get(replicationException.getReplicationErrorCode().getErrorCode()),
                    replicationException.getParameters()), replicationException);
        } catch (Exception exception) {
            LOGGER.error(TIME_DIMENSION_DATA_GENERATION_MARKER,
                    "Error in DB connection for TimeDimension with error:{}", exception.getLocalizedMessage());
        }
        LOGGER.info(TIME_DIMENSION_DATA_GENERATION_MARKER, "Rows updated from logger: {} ", noOfRowsUpdated);
        return noOfRowsUpdated;
    }

    private void connectionCheck(Connection conn) {
        boolean connVar = conn == null;
        if (connVar)
            throw new TransactionException("generating", "time dimension");
    }
}
