package com.sap.c4p.rm.calm;

import java.util.Date;
import java.util.List;

import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import com.sap.c4p.rm.calm.models.LogEntry;


@Service("calmService")
@Primary
@Profile({ "local-test", "integration-test"})
public class CalmServiceLocalImpl implements CalmService {

	@Override
	public void logReplicationFailure(Date timestamp, String objectType, String failureMessage) {
	}

	@Override
	public void logReplicationEvent(Date timestamp, String objectType, List<LogEntry> logEntries,
			int totalRecordsToBeProcessed, int totalRecordsProcessed) {
	}

}