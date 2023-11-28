package com.sap.c4p.rm.resourcerequest.validations;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import com.sap.cds.Struct;
import com.sap.cds.services.messages.Messages;

import com.sap.c4p.rm.resourcerequest.gen.MessageKeys;

import resourcerequestservice.ResourceRequests;

public class ResourceRequestPublicAPIValidatorTest {
  private Messages messages;
  private static ResourceRequestPublicApiValidator resourceRequestServiceValidator;
  private static final String EVIL_SCRIPT_TAG = "<script src=\"https://evilpage.de/assets/js/evilScript.js\"></script>";
  private static final String EVIL_CSV = "=cmd|'/Ccalc.exe'!z";

  @BeforeEach
  void beforeEach() {
    messages = mock(Messages.class, RETURNS_DEEP_STUBS);
    resourceRequestServiceValidator = new ResourceRequestPublicApiValidator(messages);
  }

  @Nested
  class validateResReqSrvFieldInputsForXSSFormulaInjection {
    @Test
    @DisplayName("check if the validation is passed when the fields inputs do not contain html tags")
    void validateForInjectionWithNoTagsInResReqSrvtexts() {

      ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setName("name");
      resourceRequest.setDescription("description");

      resourceRequestServiceValidator.validateForInjection(resourceRequest);
      verify(messages, times(0)).error(any(), any());
    }

    @Test
    @DisplayName("check if the validation fails when the resource request name contains a script tag")
    void validateForInjectionWithTagInResReqName() {
      ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setName(EVIL_SCRIPT_TAG);
      resourceRequestServiceValidator.validateForInjection(resourceRequest);
      verify(messages, times(1)).error(eq(MessageKeys.RRSRV_CONTAINS_HTML_TAG));
    }

    @Test
    @DisplayName("check if the validation fails when the resource request description contains a script tag")
    void validateForInjectionWithTagResReqDesc() {
      ResourceRequests resourceRequest = Struct.create(ResourceRequests.class);
      resourceRequest.setDescription(EVIL_SCRIPT_TAG);
      resourceRequestServiceValidator.validateForInjection(resourceRequest);
      verify(messages, times(1)).error(eq(MessageKeys.RRSRV_CONTAINS_HTML_TAG));
    }

    @Test
    @DisplayName("get correct message key for html injection")
    void getMessageKeyForHtmlInjection() {
      String messageKey = resourceRequestServiceValidator.getMessageKeyForHtmlInjection();
      assertEquals(MessageKeys.RRSRV_CONTAINS_HTML_TAG, messageKey);
    }

    @Test
    @DisplayName("get correct message key for csv injection")
    void getMessageKeyForCsvInjection() {
      String messageKey = resourceRequestServiceValidator.getMessageKeyForCsvInjection();
      assertEquals(MessageKeys.FORBIDDEN_FIRST_CHARACTER_RRSRV, messageKey);
    }
  }

}
