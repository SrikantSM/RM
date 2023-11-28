package com.sap.c4p.rm.calm;

import java.util.Date;
import java.util.List;

import com.sap.c4p.rm.calm.models.LogEntry;

public interface CalmService {
    
	/**
	 * @param timestamp      Indicates when failure occurred
	 * @param objectType     The MDI business object type
	 * @param failureMessage String with details about the failure
	 * 
	 *                       Triggers call to CALM service to log failure message
	 * 
	 */
	public void logReplicationFailure(Date timestamp, String objectType, String failureMessage);
    
	/**
	 * @param timestampIndicates        when failure occurred
	 * @param objectType                The MDI business object type
	 * @param logEntries                An array containing details about the
	 *                                  business objects that were processed
	 * @param totalRecordsToBeProcessed count of total business objects that were
	 *                                  processed
	 * @param totalRecordsProcessed     count of total business objects that were
	 *                                  processed successfully
	 * 
	 *                                  Triggers call to CALM service to log
	 *                                  successful processing message
	 * 
	 */
	public void logReplicationEvent(Date timestamp, String objectType, List<LogEntry> logEntries,
			int totalRecordsToBeProcessed, int totalRecordsProcessed);

}
