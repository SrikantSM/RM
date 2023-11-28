package com.sap.c4p.rm.calm;

import java.time.Instant;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import com.sap.c4p.rm.calm.models.LogEntry;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.request.UserInfo;
import com.sap.xdsr.crunclient.model.im.NormalizedEvent;

@Service("calmService")
@Profile({ "hana" })
public class CalmServiceImpl implements CalmService {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(CalmServiceImpl.class);

	private CalmClient calmClient;

	protected UserInfo userInfo;

	@Autowired
	public CalmServiceImpl(CalmClient calmClient, UserInfo userInfo) {
		super();
		this.calmClient = calmClient;
		this.userInfo = userInfo;
	}

    @Override
	public void logReplicationFailure(Date timestamp, String objectType, String failureMessage) {
		String tenantId = userInfo.getTenant();
		if (tenantId != null) {
			LOGGER.info("Initializing CALM event for tenant {} for the replication of {} object with error message {}",
					tenantId, objectType, failureMessage);
			NormalizedEvent calmEvent = CalmUtil.initCalmEvent(timestamp, objectType);
			CalmUtil.updateCalmEventFailed(calmEvent, failureMessage);
			calmEvent.EventEndTimestamp = CalmUtil.formatCalmEventTimestamp(Date.from(Instant.now()));
			calmClient.sendCrunEvent(calmEvent, tenantId);
		} else {
			LOGGER.error("An unexpected error occurred while communicating with CALM service. The tenant ID could not be procured.");
		}

    }
    

    @Override
	public void logReplicationEvent(Date timestamp, String objectType, List<LogEntry> logEntries,
			int totalRecordsToBeProcessed, int totalRecordsProcessed) {
		String tenantId = userInfo.getTenant();
		if (tenantId != null) {
		LOGGER.info("Initializing CALM event for tenant {} for the replication of {} object", tenantId, objectType);
		NormalizedEvent calmEvent = CalmUtil.initCalmEvent(timestamp, objectType);
		CalmUtil.updateCalmEventSucceed(calmEvent, String.format(CalmConstants.COMPLETE_SUCCESS,
				totalRecordsToBeProcessed, totalRecordsProcessed, totalRecordsToBeProcessed - totalRecordsProcessed));
		LOGGER.info("Log Entries Added. Total entries: {}", logEntries.size());
		updateCalmEventStatus(totalRecordsProcessed, totalRecordsToBeProcessed, calmEvent);
		if (!logEntries.isEmpty()) {
			logEntries.forEach(
					logEntry -> calmEvent.ApplicationData.add(CalmUtil.buildLogEntryApplicationData(logEntry)));
		}
		calmEvent.EventEndTimestamp = CalmUtil.formatCalmEventTimestamp(Date.from(Instant.now()));
		calmClient.sendCrunEvent(calmEvent, tenantId);
	} else {
		throw new ServiceException("Tenant ID was not found while logging replication event with CALM service");
	}
    	
    }
    
	private void updateCalmEventStatus(int totalRecordsProcessed, int totalRecordsToBeProcessed,
			NormalizedEvent calmEvent) {
		if (totalRecordsProcessed < totalRecordsToBeProcessed) {
			if (totalRecordsProcessed == 0) {
				CalmUtil.updateCalmEventFailed(calmEvent,
						String.format(CalmConstants.COMPLETE_FAILURE, totalRecordsToBeProcessed));
			} else {
			CalmUtil.updateCalmEventFailed(calmEvent,
					String.format(CalmConstants.PARTIAL_SUCCESS, totalRecordsToBeProcessed, totalRecordsProcessed,
							totalRecordsToBeProcessed - totalRecordsProcessed));
			}
		} else {
			CalmUtil.updateCalmEventSucceed(calmEvent,
					String.format(CalmConstants.COMPLETE_SUCCESS, totalRecordsToBeProcessed, totalRecordsProcessed,
							totalRecordsToBeProcessed - totalRecordsProcessed));
		}

	}

}