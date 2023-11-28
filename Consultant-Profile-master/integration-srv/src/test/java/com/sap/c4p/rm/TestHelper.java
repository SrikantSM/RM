package com.sap.c4p.rm;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.spi.ILoggingEvent;
import com.sap.c4p.rm.utils.StringFormatter;
import org.springframework.http.HttpMethod;

import static com.sap.c4p.rm.TestConstants.DESTINATION_NOT_FOUND;
import static com.sap.c4p.rm.TestConstants.SOMETHING_WENT_WRONG;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class TestHelper {

    public static void assertTokenFetch(ILoggingEvent infoLog) {
        assertEquals(Level.INFO, infoLog.getLevel());
        assertEquals("Token fetched", infoLog.getFormattedMessage());
    }

    public static void assertRequestingToken(ILoggingEvent infoLog) {
        assertEquals(Level.INFO, infoLog.getLevel());
        assertEquals("Requesting the access token to the auth server", infoLog.getFormattedMessage());
    }

    public static void assertRequestingTokenWithCertificate(ILoggingEvent infoLog) {
        assertEquals(Level.INFO, infoLog.getLevel());
        assertEquals("Requesting the access token from the auth server using X.509 certificate",
                infoLog.getFormattedMessage());
    }

    public static void assertHttpClientError(ILoggingEvent errorLog, HttpMethod httpMethod, String url,
            String errorResponse) {
        assertEquals(Level.ERROR, errorLog.getLevel());
        assertEquals(StringFormatter.format(
                "{0} {1} returned error code {2}. Response Body: {3} Message: {4}",
                httpMethod.toString(), url, 400, errorResponse, SOMETHING_WENT_WRONG),
                errorLog.getFormattedMessage());
    }

    public static void assertHttpServerError(ILoggingEvent errorLog, HttpMethod httpMethod, String url,
            String errorResponse) {
        assertEquals(Level.ERROR, errorLog.getLevel());
        assertEquals(StringFormatter.format(
                "{0} {1} returned error code {2}. Response Body: {3} Message: {4}",
                httpMethod.toString(), url, 500, errorResponse, SOMETHING_WENT_WRONG), errorLog.getFormattedMessage());
    }

    public static void assertNotFoundError(ILoggingEvent errorLog, HttpMethod httpMethod, String url,
                                           String errorResponse) {
        assertEquals(Level.ERROR, errorLog.getLevel());
        assertEquals(StringFormatter.format(
            "{0} {1} returned error code {2}. Response Body: {3} Message: {4}",
            httpMethod.toString(), url, 404, errorResponse, DESTINATION_NOT_FOUND), errorLog.getFormattedMessage());
    }

    public static void assertUnableProcureToken(ILoggingEvent errorLog, int rawStatusCode) {
        assertEquals(Level.ERROR, errorLog.getLevel());
        assertEquals(
                StringFormatter.format("Unable to procure credentials token, and the HttpStatus: {0}", rawStatusCode),
                errorLog.getFormattedMessage());
    }

    public static void assertJobUpdateFail(ILoggingEvent errorLog) {
        assertEquals(Level.ERROR, errorLog.getLevel());
        assertEquals(
                "Job Run update has failed (jobId: x-sap-job-id, schedulerId: x-sap-job-schedule-id, runId: x-sap-job-run-id)has been updated.",
                errorLog.getFormattedMessage());
    }

}
