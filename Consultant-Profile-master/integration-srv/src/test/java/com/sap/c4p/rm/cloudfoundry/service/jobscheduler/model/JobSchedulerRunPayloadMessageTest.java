package com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class JobSchedulerRunPayloadMessageTest {

    private static final String ERROR_CODE = "RM_010";
    private static final String DELTA_TOKEN = "delta_token";
    private static final String ERROR_MESSAGE = "errorMessage";

    @Test
    @DisplayName("test All argument constructor and toString")
    public void testAllArgumentConstructorAndToString() {
        JobScheduleRunPayloadMessage jobScheduleRunPayloadMessage = new JobScheduleRunPayloadMessage(ERROR_CODE, DELTA_TOKEN, ERROR_MESSAGE);
        String response = jobScheduleRunPayloadMessage.toString();
        assertEquals("{errorCode: 'RM_010', deltaToken: 'delta_token', message: 'errorMessage'}",response);
    }

    @Test
    @DisplayName("test All argument constructor and getters")
    public void testAllArgumentConstructorAndGetters() {
        JobScheduleRunPayloadMessage jobScheduleRunPayloadMessage = new JobScheduleRunPayloadMessage(ERROR_CODE, DELTA_TOKEN, ERROR_MESSAGE);
        assertEquals(DELTA_TOKEN, jobScheduleRunPayloadMessage.getDeltaToken());
        assertEquals(ERROR_CODE, jobScheduleRunPayloadMessage.getErrorCode());
        assertEquals(ERROR_MESSAGE, jobScheduleRunPayloadMessage.getMessage());
    }

}
