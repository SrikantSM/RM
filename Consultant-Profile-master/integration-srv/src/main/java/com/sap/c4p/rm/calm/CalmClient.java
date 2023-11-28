package com.sap.c4p.rm.calm;

import java.util.Collections;
import java.util.HashSet;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.sap.xdsr.crunclient.api.CrunInstrumentation;
import com.sap.xdsr.crunclient.model.im.ImPayload;
import com.sap.xdsr.crunclient.model.im.ImRuntimeData;
import com.sap.xdsr.crunclient.model.im.NormalizedEvent;

@Component
public class CalmClient {

	private static final Logger LOGGER = LoggerFactory.getLogger(CalmClient.class);
	
    public void sendCrunEvent(NormalizedEvent event, String tenantId) {
		try {
			CrunInstrumentation calm = new CrunInstrumentation();
			ImRuntimeData imRuntimeData = new ImRuntimeData();
			imRuntimeData.tenantId = tenantId;
			ImPayload payload = new ImPayload();
			payload.SelfComponentName = tenantId;
			payload.NormalizedEvents = new HashSet<>(Collections.singleton(event));
			imRuntimeData.payload = new HashSet<>(Collections.singleton(payload));
			calm.sendCrunContent(imRuntimeData, CalmConstants.SB_CALM_SERVICE_TYPE, tenantId);
		} catch (Exception e) {
			LOGGER.error("An unexpected error occurred while communicating with CALM service with message {} for tenant {}",e.getMessage(), tenantId);
		}
    }
    

}
