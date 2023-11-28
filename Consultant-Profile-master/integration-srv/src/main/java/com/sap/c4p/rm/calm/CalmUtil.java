package com.sap.c4p.rm.calm;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.TimeZone;
import java.util.UUID;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sap.c4p.rm.calm.models.LogEntry;
import com.sap.c4p.rm.calm.models.LogEntryStatus;
import com.sap.c4p.rm.utils.IsNullCheckUtils;
import com.sap.hcp.cf.logging.common.Fields;
import com.sap.hcp.cf.logging.common.LogContext;
import com.sap.xdsr.crunclient.model.im.ApplicationData;
import com.sap.xdsr.crunclient.model.im.NormalizedEvent;
import com.sap.xdsr.passport.DsrPassport;
import com.sap.xdsr.passport.exception.PassportDecodingException;

public class CalmUtil {

	private CalmUtil() {
        throw new IllegalStateException("Utility Class");
    }

    private static final ObjectMapper ob = new ObjectMapper();

	public static NormalizedEvent initCalmEvent(Date timestamp, String objectType) {
        NormalizedEvent calmEvent = new NormalizedEvent();
		calmEvent.Category = CalmConstants.EVENT_CATEGORY;
        calmEvent.SourceEventId = UUID.randomUUID().toString(); 
        calmEvent.EventTimestamp = formatCalmEventTimestamp(timestamp);
        calmEvent.ApplicationData = initCALMAppData(objectType);
		calmEvent.Direction = CalmConstants.DIRECTION_INBOUND;
        try {
            if (LogContext.get(Fields.SAP_PASSPORT) != null) {
                calmEvent.passport = DsrPassport.fromHexString(LogContext.get(Fields.SAP_PASSPORT));
            }
        } catch (PassportDecodingException e) {
            throw new IllegalStateException("Malformed sap passport in log context", e);
        }
        return calmEvent;
    }

    public static ApplicationData buildLogEntryApplicationData(LogEntry logEntry) {
        try {
            ApplicationData appDataLogEntry = new ApplicationData();
            appDataLogEntry.ParamId = "LogEntry";
            appDataLogEntry.ParamValue = ob.writeValueAsString(logEntry);
            return appDataLogEntry;
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Serializing Json for LogEntry failed", e);
        }
    }

    public static void updateCalmEventSucceed(
            final NormalizedEvent calmEvent, String sbStatusText) {
        calmEvent.Status = "SUCCESS";
        calmEvent.StatusText = sbStatusText;
        // SUCCESSFUL, IN_PROCESS, INFO, ERROR, CANCELED, WARNING, OTHERS
        calmEvent.StatusGroup = "SUCCESSFUL";
    }

    public static void updateCalmEventFailed(
            final NormalizedEvent calmEvent, String sbStatusText) {
        calmEvent.Status = "FAILURE";
        calmEvent.StatusText = sbStatusText;
        // SUCCESSFUL, IN_PROCESS, INFO, ERROR, CANCELED, WARNING, OTHERS
        calmEvent.StatusGroup = "ERROR";
    }

    public static void logEntryFailureReason(
            final LogEntry logEntry, String errorCode, String errorMsg) {
        logEntry.setStatus(LogEntryStatus.FAILED);
        logEntry.setErrorCode(errorCode);
        logEntry.setErrorMessage(errorMsg);
    }

    public static String formatCalmEventTimestamp(Date timestamp) {
		SimpleDateFormat sdf = new SimpleDateFormat(CalmConstants.JSON_DATE);
        sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
        return sdf.format(timestamp);
    }
    
	public static LogEntry preparecostCenterLogEntry(com.sap.c4p.rm.processor.costcenter.dto.Log costcenterLog,
			String errorCode, String errorMessage) {
        LogEntry logEntry = new LogEntry();
        if (costcenterLog.getInstance()!=null) {
        	logEntry.setObjectId(costcenterLog.getInstance().getId());
        }
        logEntry.setObjectType("sap.odm.finance.costobject.CostCenter");
        logEntry.setObjectVersionId(costcenterLog.getVersionId());
        if (costcenterLog.getInstance()!=null) {
        	logEntry.setLocalId(costcenterLog.getInstance().getLocalIdS4().getCostCenterId());
        }
        if (IsNullCheckUtils.isNullOrEmpty(errorCode)) {
        	logEntry.setStatus(LogEntryStatus.SUCCESS);
        } else {
        	logEntry.setStatus(LogEntryStatus.FAILED);
        }
        logEntry.setErrorCode(errorCode);
        logEntry.setErrorMessage(errorMessage);
        return logEntry;
    }
    
    public static LogEntry prepareWorkforcePersonLogEntry(com.sap.c4p.rm.processor.workforce.dto.Log workforcePersonLog, String errorCode, String errorMessage) {
        LogEntry logEntry = new LogEntry();
        if (workforcePersonLog.getInstance()!=null) {
        	logEntry.setObjectId(workforcePersonLog.getInstance().getId());
        } else {
        	logEntry.setObjectId(workforcePersonLog.getInstanceId());
        }
        logEntry.setObjectType("sap.odm.workforce.WorkforcePerson");
        logEntry.setObjectVersionId(workforcePersonLog.getVersionId());
        if(workforcePersonLog.getInstance()!=null) {
        	logEntry.setLocalId(workforcePersonLog.getInstance().getExternalId());
        }
        if (IsNullCheckUtils.isNullOrEmpty(errorCode)) {
        	logEntry.setStatus(LogEntryStatus.SUCCESS);
        } else {
        	logEntry.setStatus(LogEntryStatus.FAILED);
        }
        logEntry.setErrorCode(errorCode);
        logEntry.setErrorMessage(errorMessage);
        return logEntry;
    }

    private static Set<ApplicationData> initCALMAppData(String objectType) {
        Set<ApplicationData> applicationData = new HashSet<>();
        ApplicationData communicationScenario = new ApplicationData();
        communicationScenario.ParamId = "CommunicationScenario";
        communicationScenario.ParamValue = "MDI";
        applicationData.add(communicationScenario);
        ApplicationData serviceRole = new ApplicationData();
        serviceRole.ParamId = "ServiceRole";
        serviceRole.ParamValue = "CONSUMER";
        applicationData.add(serviceRole);
        ApplicationData objTypes = new ApplicationData();
        objTypes.ParamId = "ObjectTypes";
        objTypes.ParamValue = objectType;
        applicationData.add(objTypes);
        return applicationData;
    }

}
