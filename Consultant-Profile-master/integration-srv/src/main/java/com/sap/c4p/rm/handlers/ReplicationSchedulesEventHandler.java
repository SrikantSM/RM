package com.sap.c4p.rm.handlers;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;

import com.sap.cds.Result;
import com.sap.cds.ResultBuilder;
import com.sap.cds.feature.xsuaa.XsuaaUserInfo;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.EventContext;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.cds.CdsReadEventContext;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;

import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerInfo;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerSchedule;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerTime;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.service.JobSchedulerSymbols;
import com.sap.c4p.rm.config.LoggingMarker;
import com.sap.c4p.rm.gen.MessageKeys;
import com.sap.c4p.rm.replicationdao.OneMDSReplicationDeltaTokenDAO;
import com.sap.c4p.rm.replicationschedules.JobSchedulerScheduleToReplicationSchedule;
import com.sap.c4p.rm.replicationschedules.ReplicationSchedulesService;
import com.sap.c4p.rm.utils.CqnAnalyzerUtil;

import replicationscheduleservice.*;

/**
 * @author I334184
 *
 */
@Component
@ServiceName(ReplicationScheduleService_.CDS_NAME)
public class ReplicationSchedulesEventHandler implements EventHandler {
    private static final Logger LOGGER = LoggerFactory.getLogger(ReplicationSchedulesEventHandler.class);
    private static final Marker LOGGING_MARKER = LoggingMarker.REPLICATION_SCHEDULES.getMarker();

    private final CqnAnalyzerUtil cqnAnalyzerUtil;
    private final MessageSource messageSource;
    private final OneMDSReplicationDeltaTokenDAO oneMDSReplicationDeltaTokenDAO;
    private final ReplicationSchedulesService replicationSchedulesService;
    private final XsuaaUserInfo xsuaaUserInfo;

    @Autowired
    public ReplicationSchedulesEventHandler(final CqnAnalyzerUtil cqnAnalyzerUtil, final MessageSource messageSource,
            final OneMDSReplicationDeltaTokenDAO oneMDSReplicationDeltaTokenDAO,
            final ReplicationSchedulesService replicationSchedulesService, final XsuaaUserInfo xsuaaUserInfo) {
        super();
        this.cqnAnalyzerUtil = cqnAnalyzerUtil;
        this.oneMDSReplicationDeltaTokenDAO = oneMDSReplicationDeltaTokenDAO;
        this.messageSource = messageSource;
        this.replicationSchedulesService = replicationSchedulesService;
        this.xsuaaUserInfo = xsuaaUserInfo;
    }

    @On(event = CqnService.EVENT_READ, entity = ReplicationSchedule_.CDS_NAME)
    public void onReadReplicationSchedules(CdsReadEventContext context) {
        LOGGER.debug(LOGGING_MARKER, "ReplicationJobsHandler invoked");
        List<JobSchedulerSchedule> allSchedules = new ArrayList<>();
        List<Map<String, Object>> rows;
        String subDomainId = xsuaaUserInfo.getSubDomain();
        CqnSelect incomingSelect = context.getCqn();
        if (incomingSelect.ref().targetSegment().filter().isPresent()) {
            Map<String, Object> keys = cqnAnalyzerUtil.getTargetKeyForCdsReadEventContext(context);
            JobSchedulerSchedule jobSchedule = replicationSchedulesService.fetchJobSchedule(
                    (String) keys.get(ReplicationSchedule.JOB_ID), (String) keys.get(ReplicationSchedule.SCHEDULE_ID),
                    subDomainId);
            if (handleNullJobSchedulerScheduleAndSetContext(jobSchedule, context)) {
                return;
            }
            jobSchedule.setJobName((String) keys.get(ReplicationSchedule.JOB_NAME));
            allSchedules.add(jobSchedule);
        } else {
            allSchedules = replicationSchedulesService.fetchJobSchedules();
        }
        rows = allSchedules.stream()
                .map(row -> JobSchedulerScheduleToReplicationSchedule.jobScheduleToRowHashMap(row, messageSource))
                .collect(Collectors.toList());
        Result result = ResultBuilder.insertedRows(rows).inlineCount(rows.size()).result();
        context.setResult(result);
        context.setCompleted();
    }

    @On(event = IsInitialLoadCandidateContext.CDS_NAME)
    public void onIsInitialLoadCandidate(IsInitialLoadCandidateContext context) {
        context.setResult(this.oneMDSReplicationDeltaTokenDAO.checkIsInitialLoadCandidate());
        context.setCompleted();
    }

    @On(event = SetForInitialLoadContext.CDS_NAME, entity = ReplicationSchedule_.CDS_NAME)
    public void onSetForInitialLoad(SetForInitialLoadContext context) {
        List<JobSchedulerInfo> allJobs = this.replicationSchedulesService.fetchJobs();
        boolean status = true;
        for (JobSchedulerInfo job : allJobs) {
            String jobName = job.getName();
            if (jobName.contains(JobSchedulerSymbols.COST_CENTER.getSymbol())
                    || jobName.contains(JobSchedulerSymbols.WORKFORCE_PERSON.getSymbol())
            || jobName.contains(JobSchedulerSymbols.WORKFORCE_CAPABILITY.getSymbol())) {
                status = status && this.replicationSchedulesService.deactivateAllJobSchedules(job.getId());
            }
        }
        if (status) {
            this.oneMDSReplicationDeltaTokenDAO.markReplicationForInitialLoad(LOGGING_MARKER);
            this.oneMDSReplicationDeltaTokenDAO.markReplicationAsInitialLoadCandidate(Boolean.FALSE);
        }

        List<JobSchedulerSchedule> allSchedules;
        allSchedules = replicationSchedulesService.fetchJobSchedules();
        List<ReplicationSchedule> allSchedules1;

        allSchedules1 = allSchedules.stream().map(
                row -> JobSchedulerScheduleToReplicationSchedule.jobScheduleToReplicationSchedule(row, messageSource))
                .collect(Collectors.toList());
        context.setResult(allSchedules1);
        context.setCompleted();
    }

    @On(event = DeactivateContext.CDS_NAME, entity = ReplicationSchedule_.CDS_NAME)
    public void onDeactivate(DeactivateContext context) {
        String subDomainId = xsuaaUserInfo.getSubDomain();
        Map<String, Object> keys = cqnAnalyzerUtil.getTargetKeyForDectivateContext(context);
        replicationSchedulesService.deactivateJobSchedule((String) keys.get(ReplicationSchedule.JOB_ID),
                (String) keys.get(ReplicationSchedule.SCHEDULE_ID));
        JobSchedulerSchedule jobSchedulerSchedule = replicationSchedulesService.fetchJobSchedule(
                (String) keys.get(ReplicationSchedule.JOB_ID), (String) keys.get(ReplicationSchedule.SCHEDULE_ID),
                subDomainId);
        if (handleNullJobSchedulerScheduleAndSetContext(jobSchedulerSchedule, context)) {
            return;
        }
        jobSchedulerSchedule.setJobName((String) keys.get(ReplicationSchedule.JOB_NAME));
        ReplicationSchedule js = JobSchedulerScheduleToReplicationSchedule
                .jobScheduleToReplicationSchedule(jobSchedulerSchedule, messageSource);
        context.setResult(js);
        context.getMessages().success(MessageKeys.DEACTIVATED_SUCCESS, new Object() {
        });
        context.setCompleted();
    }

    @On(event = EditScheduleContext.CDS_NAME, entity = ReplicationSchedule_.CDS_NAME)
    public void onEditSchedule(EditScheduleContext context) {
        Map<String, Object> keys = cqnAnalyzerUtil.getTargetKeyForEditScheduleContext(context);
        Instant nextRun;
        Integer interval;
        String subDomainId = xsuaaUserInfo.getSubDomain();
        String jobName = (String) keys.get(ReplicationSchedule.JOB_NAME);
        String jobId = (String) keys.get(ReplicationSchedule.JOB_ID);
        String scheduleId = (String) keys.get(ReplicationSchedule.SCHEDULE_ID);
        validateActivation(jobName, jobId, scheduleId);
        JobSchedulerSchedule jobSchedulerSchedule = replicationSchedulesService.fetchJobSchedule(jobId, scheduleId,
                subDomainId);
        if (handleNullJobSchedulerScheduleAndSetContext(jobSchedulerSchedule, context)) {
            return;
        }
        if (jobSchedulerSchedule.getType().equals("one-time")) {
            nextRun = context.getNextRun();
            validateNextRunValue(nextRun);
            jobSchedulerSchedule = replicationSchedulesService.updateJobScheduleTime(jobId, scheduleId, nextRun);
            if (handleNullJobSchedulerScheduleAndSetContext(jobSchedulerSchedule, context)) {
                return;
            }
            JobSchedulerTime nextRunAt = new JobSchedulerTime();
            nextRunAt.fromJson(context.getNextRun().toString());
            jobSchedulerSchedule.setNextRunAt(nextRunAt);
        } else if (jobSchedulerSchedule.getType().equals("recurring")) {
            interval = context.getInterval();
            validateRepeatIntervalValue(interval);
            jobSchedulerSchedule = replicationSchedulesService.updateJobScheduleRepeatInterval(jobId, scheduleId,
                    interval);
            if (handleNullJobSchedulerScheduleAndSetContext(jobSchedulerSchedule, context)) {
                return;
            }
            Instant nextRunInstant = Instant.now().plusSeconds(((long) context.getInterval() * 60) + 1);
            JobSchedulerTime nextRunAt = new JobSchedulerTime();
            nextRunAt.fromJson(nextRunInstant.toString());
            jobSchedulerSchedule.setNextRunAt(nextRunAt);
        }
        jobSchedulerSchedule.setJobName(jobName);
        ReplicationSchedule repSchedule = JobSchedulerScheduleToReplicationSchedule
                .jobScheduleToReplicationSchedule(jobSchedulerSchedule, messageSource);
        context.setResult(repSchedule);
        context.getMessages().success(MessageKeys.ACTIVATED_SUCCESS, new Object() {
        });
        context.setCompleted();
    }

    private boolean handleNullJobSchedulerScheduleAndSetContext(JobSchedulerSchedule schedule, EventContext context) {
        if (schedule == null) {
            context.setCompleted();
            return true;
        }
        return false;
    }

    private void validateActivation(String jobName, String jobId, String scheduleId) {
        if (jobName.contains(JobSchedulerSymbols.COST_CENTER.getSymbol())) {
            replicationSchedulesService.validateCostCenterActivation(jobId, scheduleId);
        } else if (jobName.contains(JobSchedulerSymbols.WORKFORCE_PERSON.getSymbol())) {
            replicationSchedulesService.validateWorkforceActivation(jobId, scheduleId);
        } else  if(jobName.contains(JobSchedulerSymbols.WORKFORCE_CAPABILITY.getSymbol())) {
            replicationSchedulesService.validateWorkforceCapabilityOneTimeActivation(jobId, scheduleId);
        }
    }

    private void validateNextRunValue(Instant nextRun) {
        if (nextRun == null) {
            throw new ServiceException(ErrorStatuses.BAD_REQUEST,
                    messageSource.getMessage(MessageKeys.NEXT_RUN_VALUE_NULL, null, LocaleContextHolder.getLocale()))
                            .messageTarget(EditScheduleContext.NEXT_RUN);
        }
        if (nextRun.isBefore(Instant.now())) {
            throw new ServiceException(ErrorStatuses.BAD_REQUEST,
                    messageSource.getMessage(MessageKeys.NEXT_RUN_VALUE_PAST, null, LocaleContextHolder.getLocale()))
                            .messageTarget(EditScheduleContext.NEXT_RUN);
        }
    }

    private void validateRepeatIntervalValue(Integer repeatInterval) {
        if (repeatInterval == null) {
            throw new ServiceException(ErrorStatuses.BAD_REQUEST,
                    messageSource.getMessage(MessageKeys.INTERVAL_VALUE_NULL, null, LocaleContextHolder.getLocale()))
                            .messageTarget(EditScheduleContext.INTERVAL);
        }
        if (repeatInterval > 1440 || repeatInterval < 5) {
            throw new ServiceException(ErrorStatuses.BAD_REQUEST,
                    messageSource.getMessage(MessageKeys.INTERVAL_VALUE_ERROR, null, LocaleContextHolder.getLocale()))
                            .messageTarget(EditScheduleContext.INTERVAL);
        }
    }

}
