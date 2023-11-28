package com.sap.c4p.rm.calm;

import static org.junit.Assert.assertNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;
import java.util.UUID;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.sap.c4p.rm.calm.models.LogEntry;
import com.sap.c4p.rm.calm.models.LogEntryStatus;
import com.sap.c4p.rm.processor.costcenter.dto.LocalIdS4;
import com.sap.hcp.cf.logging.common.Fields;
import com.sap.hcp.cf.logging.common.LogContext;
import com.sap.xdsr.crunclient.model.im.ApplicationData;
import com.sap.xdsr.crunclient.model.im.NormalizedEvent;
import com.sap.xdsr.passport.exception.PassportDecodingException;

public class CalmUtilTest {

	@Test
	public void testInitCalmEvent() throws PassportDecodingException {
		Date timestamp = new Date();
		String objectType = "SomeObjectType";
		UUID randomUUID = UUID.randomUUID();
		LogContext.add(Fields.SAP_PASSPORT, null);
		NormalizedEvent calmEvent = CalmUtil.initCalmEvent(timestamp, objectType);
		assertEquals(CalmConstants.EVENT_CATEGORY, calmEvent.Category);
		assertEquals(randomUUID.toString().length(), calmEvent.SourceEventId.length());
		assertEquals(CalmUtil.formatCalmEventTimestamp(timestamp), calmEvent.EventTimestamp);
		assertNotNull(calmEvent.ApplicationData);
		assertEquals(CalmConstants.DIRECTION_INBOUND, calmEvent.Direction);
	}

	@Test
	public void testInitCalmEventWithMalformedPassport() {
		Date timestamp = new Date();
		String objectType = "SomeObjectType";
		LogContext.add(Fields.SAP_PASSPORT, "invalidHexString");
		Assertions.assertThrows(IllegalStateException.class, () -> {
			CalmUtil.initCalmEvent(timestamp, objectType);
		});
	}

	@Test
	void testBuildLogEntryApplicationData() throws JsonProcessingException {
		LogEntry logEntry = new LogEntry();
		logEntry.setErrorCode("Test Property");
		ApplicationData result = CalmUtil.buildLogEntryApplicationData(logEntry);
		assertEquals("LogEntry", result.ParamId);
		assertEquals(
				"{\"ObjectType\":null,\"ObjectId\":null,\"ObjectVersionId\":null,\"LocalId\":null,\"Status\":null,\"ErrorCode\":\"Test Property\",\"ErrorMessage\":null}",
				result.ParamValue);
	}

	@Test
	public void testUpdateCalmEventSucceed() {
		NormalizedEvent calmEvent = new NormalizedEvent();
		String sbStatusText = "Event processing succeeded";
		CalmUtil.updateCalmEventSucceed(calmEvent, sbStatusText);
		assertEquals("SUCCESS", calmEvent.Status);
		assertEquals(sbStatusText, calmEvent.StatusText);
		assertEquals("SUCCESSFUL", calmEvent.StatusGroup);
	}

	@Test
	public void testUpdateCalmEventFailed() {
		NormalizedEvent calmEvent = new NormalizedEvent();
		String sbStatusText = "Some status text";
		CalmUtil.updateCalmEventFailed(calmEvent, sbStatusText);
		assertEquals("FAILURE", calmEvent.Status);
		assertEquals(sbStatusText, calmEvent.StatusText);
		assertEquals("ERROR", calmEvent.StatusGroup);
	}

	@Test
	void testLogEntryFailureReason() {
		LogEntry logEntry = new LogEntry();
		String errorCode = "ERR123";
		String errorMsg = "Something went wrong";
		CalmUtil.logEntryFailureReason(logEntry, errorCode, errorMsg);
		assertEquals(LogEntryStatus.FAILED, logEntry.getStatus());
		assertEquals(errorCode, logEntry.getErrorCode());
		assertEquals(errorMsg, logEntry.getErrorMessage());
	}

	@Test
	void testFormatCalmEventTimestamp() {
		Date timestamp = new Date();
		String expectedFormat = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
		String formattedTimestamp = CalmUtil.formatCalmEventTimestamp(timestamp);
		SimpleDateFormat sdf = new SimpleDateFormat(expectedFormat);
		sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
		String expectedFormattedTimestamp = sdf.format(timestamp);
		assertEquals(expectedFormattedTimestamp, formattedTimestamp);
	}

	@Test
	void testPreparecostCenterLogEntrySuccess() {
		com.sap.c4p.rm.processor.costcenter.dto.Log costcenterLog = new com.sap.c4p.rm.processor.costcenter.dto.Log();
		com.sap.c4p.rm.processor.costcenter.dto.Instance costCenterInstance = new com.sap.c4p.rm.processor.costcenter.dto.Instance();
		LocalIdS4 localIdS4 = new LocalIdS4();
		localIdS4.setCostCenterId("costcenter-id");
		costCenterInstance.setId("cc-id");
		costCenterInstance.setLocalIdS4(localIdS4);
		costcenterLog.setInstance(costCenterInstance);

		LogEntry result = CalmUtil.preparecostCenterLogEntry(costcenterLog, null, null);

		assertEquals(LogEntryStatus.SUCCESS, result.getStatus());
		assertNull(result.getErrorCode());
		assertNull(result.getErrorMessage());
	}

	@Test
	void testPreparecostCenterLogEntryFailed() {
		com.sap.c4p.rm.processor.costcenter.dto.Log costcenterLog = new com.sap.c4p.rm.processor.costcenter.dto.Log();
		com.sap.c4p.rm.processor.costcenter.dto.Instance costCenterInstance = new com.sap.c4p.rm.processor.costcenter.dto.Instance();
		LocalIdS4 localIdS4 = new LocalIdS4();
		localIdS4.setCostCenterId("costcenter-id");
		costCenterInstance.setId("cc-id");
		costCenterInstance.setLocalIdS4(localIdS4);
		costcenterLog.setInstance(costCenterInstance);
		String errorCode = "123";
		String errorMessage = "An error occurred";

		LogEntry result = CalmUtil.preparecostCenterLogEntry(costcenterLog, errorCode, errorMessage);

		assertEquals(LogEntryStatus.FAILED, result.getStatus());
		assertEquals(errorCode, result.getErrorCode());
		assertEquals(errorMessage, result.getErrorMessage());
	}

	@Test
	void testPreparecostCenterLogEntryInstanceNull() {
		com.sap.c4p.rm.processor.costcenter.dto.Log costcenterLog = new com.sap.c4p.rm.processor.costcenter.dto.Log();
		com.sap.c4p.rm.processor.costcenter.dto.Instance costCenterInstance = new com.sap.c4p.rm.processor.costcenter.dto.Instance();
		LocalIdS4 localIdS4 = new LocalIdS4();
		localIdS4.setCostCenterId("costcenter-id");
		costCenterInstance.setId("cc-id");
		costCenterInstance.setLocalIdS4(localIdS4);
		costcenterLog.setInstance(costCenterInstance);
		String errorCode = "123";
		String errorMessage = "An error occurred";

		LogEntry result = CalmUtil.preparecostCenterLogEntry(costcenterLog, errorCode, errorMessage);

		assertEquals(LogEntryStatus.FAILED, result.getStatus());
		assertEquals(errorCode, result.getErrorCode());
		assertEquals(errorMessage, result.getErrorMessage());
	}

	@Test
	void testPreparecostCenterLogEntryEmptyErrorCode() {
		com.sap.c4p.rm.processor.costcenter.dto.Log costcenterLog = new com.sap.c4p.rm.processor.costcenter.dto.Log();
		com.sap.c4p.rm.processor.costcenter.dto.Instance costCenterInstance = new com.sap.c4p.rm.processor.costcenter.dto.Instance();
		LocalIdS4 localIdS4 = new LocalIdS4();
		localIdS4.setCostCenterId("costcenter-id");
		costCenterInstance.setId("cc-id");
		costCenterInstance.setLocalIdS4(localIdS4);
		costcenterLog.setInstance(costCenterInstance);
		LogEntry result = CalmUtil.preparecostCenterLogEntry(costcenterLog, "", null);

		assertEquals(LogEntryStatus.SUCCESS, result.getStatus());
		assertEquals(0, result.getErrorCode().length());
		assertEquals(null, result.getErrorMessage());
	}

	@Test
	void testPrepareWorkforceLogEntrySuccess() {
		com.sap.c4p.rm.processor.workforce.dto.Log workforceLog = new com.sap.c4p.rm.processor.workforce.dto.Log();
		com.sap.c4p.rm.processor.workforce.dto.Instance workforcerInstance = new com.sap.c4p.rm.processor.workforce.dto.Instance();
		workforcerInstance.setId("wf-id");
		workforceLog.setInstance(workforcerInstance);

		LogEntry result = CalmUtil.prepareWorkforcePersonLogEntry(workforceLog, null, null);

		assertEquals(LogEntryStatus.SUCCESS, result.getStatus());
		assertNull(result.getErrorCode());
		assertNull(result.getErrorMessage());
	}

	@Test
	void testPrepareWorkforceLogEntryFailed() {
		com.sap.c4p.rm.processor.workforce.dto.Log workforceLog = new com.sap.c4p.rm.processor.workforce.dto.Log();
		com.sap.c4p.rm.processor.workforce.dto.Instance workforcerInstance = new com.sap.c4p.rm.processor.workforce.dto.Instance();
		workforcerInstance.setId("wf-id");
		workforceLog.setInstance(workforcerInstance);
		String errorCode = "123";
		String errorMessage = "An error occurred";

		LogEntry result = CalmUtil.prepareWorkforcePersonLogEntry(workforceLog, errorCode, errorMessage);

		assertEquals(LogEntryStatus.FAILED, result.getStatus());
		assertEquals(errorCode, result.getErrorCode());
		assertEquals(errorMessage, result.getErrorMessage());
	}

	@Test
	void testPrepareWorkforceLogEntryInstanceNull() {
		com.sap.c4p.rm.processor.workforce.dto.Log workforceLog = new com.sap.c4p.rm.processor.workforce.dto.Log();
		com.sap.c4p.rm.processor.workforce.dto.Instance workforcerInstance = new com.sap.c4p.rm.processor.workforce.dto.Instance();
		workforcerInstance.setId("wf-id");
		workforceLog.setInstance(workforcerInstance);
		String errorCode = "123";
		String errorMessage = "An error occurred";


		LogEntry result = CalmUtil.prepareWorkforcePersonLogEntry(workforceLog, errorCode, errorMessage);

		assertEquals(LogEntryStatus.FAILED, result.getStatus());
		assertEquals(errorCode, result.getErrorCode());
		assertEquals(errorMessage, result.getErrorMessage());
	}

	@Test
	void testPrepareWorkforceLogEntryEmptyErrorCode() {
		com.sap.c4p.rm.processor.workforce.dto.Log workforceLog = new com.sap.c4p.rm.processor.workforce.dto.Log();
		com.sap.c4p.rm.processor.workforce.dto.Instance workforcerInstance = new com.sap.c4p.rm.processor.workforce.dto.Instance();
		workforcerInstance.setId("wf-id");
		workforceLog.setInstance(workforcerInstance);

		LogEntry result = CalmUtil.prepareWorkforcePersonLogEntry(workforceLog, "", null);

		assertEquals(LogEntryStatus.SUCCESS, result.getStatus());
		assertEquals(0, result.getErrorCode().length());
		assertEquals(null, result.getErrorMessage());
	}

}
