package com.sap.c4p.rm.assignment.integration;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import com.sap.cloud.sdk.cloudplatform.resilience.ResilienceRuntimeException;
import com.sap.cloud.sdk.cloudplatform.thread.exception.ThreadContextExecutionException;
import com.sap.cloud.sdk.datamodel.odata.client.exception.ODataResponseException;
import com.sap.cloud.sdk.datamodel.odata.client.exception.ODataServiceError;
import com.sap.cloud.sdk.datamodel.odata.client.exception.ODataServiceErrorException;

import io.vavr.control.Option;

public class SupplyErrorMessageParserTest {

  static SupplyErrorMessageParser messageParser;

  @BeforeAll
  static void setUp() {
    messageParser = new SupplyErrorMessageParser();
  }

  @Test
  void returnsNullWhenErrorObjectMissingInMessage() {
    ResilienceRuntimeException mockResilienceRuntimeException = mock(ResilienceRuntimeException.class);
    assertNull(messageParser.getErrorMessage(mockResilienceRuntimeException));
  }

  @Test
  void returnsNullWhenODataExceptionIsMissing() {
    ResilienceRuntimeException mockResilienceRuntimeException = mock(ResilienceRuntimeException.class);
    ThreadContextExecutionException mockThreadContextExecutionException = mock(ThreadContextExecutionException.class);

    when(mockResilienceRuntimeException.getCause()).thenReturn(mockThreadContextExecutionException);

    assertNull(messageParser.getErrorMessage(mockResilienceRuntimeException));
  }

  @Test
  void returnsErrorMessageWhenPresentInODataServiceErrorException() {
    ResilienceRuntimeException mockResilienceRuntimeException = mock(ResilienceRuntimeException.class);
    ThreadContextExecutionException mockThreadContextExecutionException = mock(ThreadContextExecutionException.class);
    ODataServiceErrorException mockODataServiceErrorException = mock(ODataServiceErrorException.class);
    ODataServiceError mockODataServiceError = mock(ODataServiceError.class);

    String[] mockODataErrorStringArray = { "Resource not found for segment A_EngmntProjRsceSupDistrType,", "1" };

    when(mockResilienceRuntimeException.getCause()).thenReturn(mockThreadContextExecutionException);
    when(mockResilienceRuntimeException.getCause().getCause()).thenReturn(mockODataServiceErrorException);
    when(mockODataServiceErrorException.getOdataError()).thenReturn(mockODataServiceError);
    when(mockODataServiceError.getODataMessage()).thenReturn(mockODataErrorStringArray[0]);
    String body = "{\"error\":{\"code\":\"/IWBEP/CM_MGW_RT/020\",\"message\":{\"lang\":\"en\",\"value\":\"Resource not found for segment A_EngmntProjRsceSupDistrType\"},\"inner error\":{\"application\":{\"component_id\":\"CA-CPD-SS\",\"service_namespace\":\"/CPD/\",\"service_id\":\"SC_PROJ_ENGMT_CREATE_UPD_SRV\",\"service_version\":\"0001\"},\"transactionid\":\"1670F840E46401A0E0062DD727521641\",\"timestamp\":\"20220725110959.5171980\",\"Error_Resolution\":{\"SAP_Transaction\":\"For backend administrators:use ADT feed reader\\\"SAP Gateway Error Log\\\"or run transaction/IWFND/ERROR_LOG on SAP Gateway hub system and search for entries with the timestamp above for more details\",\"SAP_Note\":\"See SAP Note 1797736 for error analysis(https://service.sap.com/sap/support/notes/1797736)\",\"Batch_SAP_Note\":\"See SAP Note 1869434 for details about working with $batch(https://service.sap.com/sap/support/notes/1869434)\"},\"errordetails\":[{\"ContentID\":\"1\",\"code\":\"/IWBEP/CM_MGW_RT/020\",\"message\":\"Resource not found for segment A_EngmntProjRsceSupDistrType\",\"longtext_url\":\"/sap/opu/odata/iwbep/message_text;o=LOCAL/T100_longtexts(MSGID=%2FIWBEP%2FCM_MGW_RT,MSGNO=020,MESSAGE_V1=A_EngmntProjRsceSupDistrType,MESSAGE_V2=``,MESSAGE_V3=``,MESSAGE_V4=``)/$value\",\"propertyref\":\"\",\"severity\":\"error\",\"transition\":false,\"target\":\"\"}]}}}";
    when(mockODataServiceErrorException.getHttpBody()).thenReturn(Option.of(body));

    assertArrayEquals(mockODataErrorStringArray, messageParser.getErrorMessage(mockResilienceRuntimeException));
  }

  @Test
  void returnsErrorMessageWhenPresentInODataResponseException() {
    ResilienceRuntimeException mockResilienceRuntimeException = mock(ResilienceRuntimeException.class);
    ThreadContextExecutionException mockThreadContextExecutionException = mock(ThreadContextExecutionException.class);
    ODataResponseException mockODataResponseException = mock(ODataResponseException.class);

    String[] mockODataErrorStringArray = { "Resource not found for segment A_EngmntProjRsceSupDistrType,", "1" };

    when(mockResilienceRuntimeException.getCause()).thenReturn(mockThreadContextExecutionException);
    when(mockResilienceRuntimeException.getCause().getCause()).thenReturn(mockODataResponseException);
    String body = "{\"error\":{\"code\":\"/IWBEP/CM_MGW_RT/020\",\"message\":{\"lang\":\"en\",\"value\":\"Resource not found for segment A_EngmntProjRsceSupDistrType\"},\"inner error\":{\"application\":{\"component_id\":\"CA-CPD-SS\",\"service_namespace\":\"/CPD/\",\"service_id\":\"SC_PROJ_ENGMT_CREATE_UPD_SRV\",\"service_version\":\"0001\"},\"transactionid\":\"1670F840E46401A0E0062DD727521641\",\"timestamp\":\"20220725110959.5171980\",\"Error_Resolution\":{\"SAP_Transaction\":\"For backend administrators:use ADT feed reader\\\"SAP Gateway Error Log\\\"or run transaction/IWFND/ERROR_LOG on SAP Gateway hub system and search for entries with the timestamp above for more details\",\"SAP_Note\":\"See SAP Note 1797736 for error analysis(https://service.sap.com/sap/support/notes/1797736)\",\"Batch_SAP_Note\":\"See SAP Note 1869434 for details about working with $batch(https://service.sap.com/sap/support/notes/1869434)\"},\"errordetails\":[{\"ContentID\":\"1\",\"code\":\"/IWBEP/CM_MGW_RT/020\",\"message\":\"Resource not found for segment A_EngmntProjRsceSupDistrType\",\"longtext_url\":\"/sap/opu/odata/iwbep/message_text;o=LOCAL/T100_longtexts(MSGID=%2FIWBEP%2FCM_MGW_RT,MSGNO=020,MESSAGE_V1=A_EngmntProjRsceSupDistrType,MESSAGE_V2=``,MESSAGE_V3=``,MESSAGE_V4=``)/$value\",\"propertyref\":\"\",\"severity\":\"error\",\"transition\":false,\"target\":\"\"}]}}}";
    when(mockODataResponseException.getHttpBody()).thenReturn(Option.of(body));

    assertArrayEquals(mockODataErrorStringArray, messageParser.getErrorMessage(mockResilienceRuntimeException));
  }
}