package com.sap.c4p.rm.calm;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

import org.junit.jupiter.api.Test;

import com.sap.xdsr.crunclient.model.im.NormalizedEvent;

class CalmClientTest {

	@Test
	void testSendCrunEvent() {
		CalmClient calmClient = new CalmClient();
		NormalizedEvent event = new NormalizedEvent();
		String tenantId = "testTenant";
		assertDoesNotThrow(() -> calmClient.sendCrunEvent(event, tenantId));
	}
}
