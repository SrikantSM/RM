package com.sap.c4p.rm.calm;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.slf4j.Logger;

import com.sap.c4p.rm.InitMocks;
import com.sap.c4p.rm.calm.models.LogEntry;
import com.sap.cds.services.request.UserInfo;
import com.sap.hcp.cf.logging.common.Fields;
import com.sap.hcp.cf.logging.common.LogContext;
import com.sap.xdsr.crunclient.model.im.NormalizedEvent;

public class CalmServiceTest extends InitMocks {

	@Mock
	private CalmClient calmClient;

	@Mock
	private Logger logger;

	@Mock
	private UserInfo userInfo;

	@InjectMocks
	private CalmServiceImpl calmService;

	@Test
	void testLogReplicationFailure() {
		LogContext.remove(Fields.SAP_PASSPORT);
		Date timestamp = Date.from(Instant.now());
		String objectType = "SomeObjectType";
		String failureMessage = "Failure message";
		String tenantId = "testTenant";

		when(userInfo.getTenant()).thenReturn(tenantId);

		calmService.logReplicationFailure(timestamp, objectType, failureMessage);

		ArgumentCaptor<NormalizedEvent> captor = ArgumentCaptor.forClass(NormalizedEvent.class);
		verify(calmClient).sendCrunEvent(captor.capture(), eq(tenantId));
		assertEquals(3, captor.getValue().ApplicationData.size());
		assertEquals("FAILURE", captor.getValue().Status);
		assertEquals("ERROR", captor.getValue().StatusGroup);
		assertEquals(failureMessage, captor.getValue().StatusText);
	}

	@Test
	void testLogReplicationEventPartialSuccess() {
		LogContext.remove(Fields.SAP_PASSPORT);
		Date timestamp = Date.from(Instant.now());
		String objectType = "SomeObjectType";
		List<LogEntry> logEntries = new ArrayList<>();
		int totalRecordsToBeProcessed = 100;
		int totalRecordsProcessed = 50;
		String tenantId = "testTenant";

		when(userInfo.getTenant()).thenReturn(tenantId);

		calmService.logReplicationEvent(timestamp, objectType, logEntries, totalRecordsToBeProcessed,
				totalRecordsProcessed);

		ArgumentCaptor<NormalizedEvent> captor = ArgumentCaptor.forClass(NormalizedEvent.class);
		verify(calmClient).sendCrunEvent(captor.capture(), eq(tenantId));
		assertEquals(3, captor.getValue().ApplicationData.size());
		assertEquals("FAILURE", captor.getValue().Status);
		assertEquals("ERROR", captor.getValue().StatusGroup);
		assertEquals(String.format(CalmConstants.PARTIAL_SUCCESS, totalRecordsToBeProcessed, totalRecordsProcessed,
				totalRecordsToBeProcessed - totalRecordsProcessed), captor.getValue().StatusText);
	}

	@Test
	void testLogReplicationEventPartialSuccessLogEntry() {
		LogContext.remove(Fields.SAP_PASSPORT);
		Date timestamp = Date.from(Instant.now());
		String objectType = "SomeObjectType";
		List<LogEntry> logEntries = new ArrayList<>();
		LogEntry logEntry = new LogEntry();
		logEntry.setLocalId("local-id");
		logEntry.setObjectId("object-id");
		logEntry.setObjectType("object-type");
		logEntry.setObjectVersionId("version-id");
		logEntries.add(logEntry);
		int totalRecordsToBeProcessed = 100;
		int totalRecordsProcessed = 50;
		String tenantId = "testTenant";

		when(userInfo.getTenant()).thenReturn(tenantId);

		calmService.logReplicationEvent(timestamp, objectType, logEntries, totalRecordsToBeProcessed,
				totalRecordsProcessed);

		ArgumentCaptor<NormalizedEvent> captor = ArgumentCaptor.forClass(NormalizedEvent.class);
		verify(calmClient).sendCrunEvent(captor.capture(), eq(tenantId));
		assertEquals(4, captor.getValue().ApplicationData.size());
		assertEquals("FAILURE", captor.getValue().Status);
		assertEquals("ERROR", captor.getValue().StatusGroup);
		assertEquals(String.format(CalmConstants.PARTIAL_SUCCESS, totalRecordsToBeProcessed, totalRecordsProcessed,
				totalRecordsToBeProcessed - totalRecordsProcessed), captor.getValue().StatusText);
	}

	@Test
	void testLogReplicationEventAllSuccess() {
		LogContext.remove(Fields.SAP_PASSPORT);
		Date timestamp = Date.from(Instant.now());
		String objectType = "SomeObjectType";
		List<LogEntry> logEntries = new ArrayList<>();
		LogEntry logEntry = new LogEntry();
		logEntry.setLocalId("local-id");
		logEntry.setObjectId("object-id");
		logEntry.setObjectType("object-type");
		logEntry.setObjectVersionId("version-id");
		logEntries.add(logEntry);

		int totalRecordsToBeProcessed = 100;
		int totalRecordsProcessed = 100;
		String tenantId = "testTenant";

		when(userInfo.getTenant()).thenReturn(tenantId);

		calmService.logReplicationEvent(timestamp, objectType, logEntries, totalRecordsToBeProcessed,
				totalRecordsProcessed);

		ArgumentCaptor<NormalizedEvent> captor = ArgumentCaptor.forClass(NormalizedEvent.class);
		verify(calmClient).sendCrunEvent(captor.capture(), eq(tenantId));
		assertEquals(4, captor.getValue().ApplicationData.size());
		assertEquals("SUCCESS", captor.getValue().Status);
		assertEquals("SUCCESSFUL", captor.getValue().StatusGroup);
		assertEquals(String.format(CalmConstants.COMPLETE_SUCCESS, totalRecordsToBeProcessed, totalRecordsProcessed,
				totalRecordsToBeProcessed - totalRecordsProcessed), captor.getValue().StatusText);
	}

	@Test
	void testLogReplicationEventAllFailure() {
		LogContext.remove(Fields.SAP_PASSPORT);
		Date timestamp = Date.from(Instant.now());
		String objectType = "SomeObjectType";
		List<LogEntry> logEntries = new ArrayList<>();
		LogEntry logEntry = new LogEntry();
		logEntry.setLocalId("local-id");
		logEntry.setObjectId("object-id");
		logEntry.setObjectType("object-type");
		logEntry.setObjectVersionId("version-id");
		logEntries.add(logEntry);

		int totalRecordsToBeProcessed = 100;
		int totalRecordsProcessed = 0;
		String tenantId = "testTenant";

		when(userInfo.getTenant()).thenReturn(tenantId);

		calmService.logReplicationEvent(timestamp, objectType, logEntries, totalRecordsToBeProcessed,
				totalRecordsProcessed);

		ArgumentCaptor<NormalizedEvent> captor = ArgumentCaptor.forClass(NormalizedEvent.class);
		verify(calmClient).sendCrunEvent(captor.capture(), eq(tenantId));
		assertEquals(4, captor.getValue().ApplicationData.size());
		assertEquals("FAILURE", captor.getValue().Status);
		assertEquals("ERROR", captor.getValue().StatusGroup);
		assertEquals(String.format(CalmConstants.COMPLETE_FAILURE, totalRecordsToBeProcessed),
				captor.getValue().StatusText);
	}
}
