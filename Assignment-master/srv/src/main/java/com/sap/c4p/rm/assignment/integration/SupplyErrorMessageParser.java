package com.sap.c4p.rm.assignment.integration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;

import com.sap.cloud.sdk.cloudplatform.resilience.ResilienceRuntimeException;
import com.sap.cloud.sdk.cloudplatform.thread.exception.ThreadContextExecutionException;
import com.sap.cloud.sdk.datamodel.odata.client.exception.ODataResponseException;
import com.sap.cloud.sdk.datamodel.odata.client.exception.ODataServiceError;
import com.sap.cloud.sdk.datamodel.odata.client.exception.ODataServiceErrorException;

import com.sap.c4p.rm.assignment.config.LoggingMarker;

import io.vavr.control.Option;

public class SupplyErrorMessageParser {

  private static final Logger LOGGER = LoggerFactory.getLogger(SupplyErrorMessageParser.class);
  private static final Marker ERROR_PARSER_MARKER = LoggingMarker.ERROR_PARSER_MARKER.getMarker();

  public String[] getErrorMessage(ResilienceRuntimeException e) {
    // Check whether ODataServiceErrorException is wrapped within the Resilence
    // runtime exception object
    String[] arrayOfMessageContent = new String[2];
    if (e.getCause() instanceof ThreadContextExecutionException) {
      LOGGER.warn(ERROR_PARSER_MARKER, "Exception object {} is wrapped within ResilenceRuntime Exception",
          e.getCause().getClass());
      if (e.getCause().getCause() instanceof ODataServiceErrorException) {
        LOGGER.warn(ERROR_PARSER_MARKER, "Exception object {} is wrapped within ThreadContextExecutionException",
            e.getCause().getCause().getClass());
        ODataServiceErrorException oDataServiceErrorException = (ODataServiceErrorException) e.getCause().getCause();
        ODataServiceError oDataError = oDataServiceErrorException.getOdataError();
        String errorMessage = oDataError.getODataMessage();
        LOGGER.warn(ERROR_PARSER_MARKER, "Error message from S4: {}", errorMessage);
        Option<String> httpBody = oDataServiceErrorException.getHttpBody();
        LOGGER.warn(ERROR_PARSER_MARKER, "Errorbody for ODataServiceErrorException:{}", httpBody.get());
        String responseFromHttpBody = httpBody.get();
        if (responseFromHttpBody != null) {
          arrayOfMessageContent = getContentIdAndErrorMessage(responseFromHttpBody, errorMessage);
        } else {
          arrayOfMessageContent[0] = errorMessage;
        }
        return arrayOfMessageContent;
      } else if (e.getCause().getCause() instanceof ODataResponseException) {
        LOGGER.warn(ERROR_PARSER_MARKER, "Exception object {} is wrapped within ThreadContextExecutionException",
            e.getCause().getCause().getClass());
        ODataResponseException oDataResponseException = (ODataResponseException) e.getCause().getCause();
        Option<String> httpBody = oDataResponseException.getHttpBody();
        LOGGER.warn(ERROR_PARSER_MARKER, "Errorbody:{}", httpBody.get());
        String responseFromHttpBody = httpBody.get();
        String errorMessage = oDataResponseException.getMessage();
        if (responseFromHttpBody != null) {
          arrayOfMessageContent = getContentIdAndErrorMessage(responseFromHttpBody, errorMessage);
        } else {
          arrayOfMessageContent[0] = errorMessage;
        }
        return arrayOfMessageContent;
      }
      return null;
    }
    return null;
  }

  public String[] getContentIdAndErrorMessage(String responseFromHttpBody, String errorMessage) {
    String[] arrayOfMessageContent = new String[2];
    try {
      String errorDetails = responseFromHttpBody
          .substring(responseFromHttpBody.indexOf("[{"), responseFromHttpBody.indexOf("]}")).replace("\"", "");
      LOGGER.warn(ERROR_PARSER_MARKER, "ErrorDetails:{}", errorDetails);
      String stringOfErrorMessage = errorDetails
          .substring(errorDetails.indexOf("message"), errorDetails.indexOf("longtext_url")).replace("message:", "");
      arrayOfMessageContent[0] = stringOfErrorMessage;
      LOGGER.warn(ERROR_PARSER_MARKER, "Message{}", arrayOfMessageContent[0]);
      if (arrayOfMessageContent[0] != null) {
        arrayOfMessageContent[1] = errorDetails.substring(errorDetails.indexOf("ContentID"), errorDetails.indexOf(","))
            .replace("ContentID:", "");
        LOGGER.warn(ERROR_PARSER_MARKER, "ContentID:{}", arrayOfMessageContent[1]);
      }
    } catch (final Exception e) {
      arrayOfMessageContent[0] = errorMessage;
      return arrayOfMessageContent;
    }
    return arrayOfMessageContent;
  }

}
