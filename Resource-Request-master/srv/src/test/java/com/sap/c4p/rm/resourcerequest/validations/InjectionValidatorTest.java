package com.sap.c4p.rm.resourcerequest.validations;

import static java.util.Collections.singletonList;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Stream;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.sap.cds.CdsData;
import com.sap.cds.Struct;
import com.sap.cds.services.messages.Message;
import com.sap.cds.services.messages.Messages;

import com.sap.c4p.rm.resourcerequest.utils.ValuePath;

import manageresourcerequestservice.ResourceRequests_;

public class InjectionValidatorTest {
  private static final String EVIL_SCRIPT_TAG = "<script src=\"https://evilpage.de/assets/js/evilScript.js\"></script>";
  private static final String EVIL_CSV = "@Evil";
  private static final String HARMLESS_VALUE = "I am harmless";
  private static final String HTML_INJECTION_MESSAGE_KEY = "htmlInjectionMessageKey";
  private static final String CSV_INJECTION_MESSAGE_KEY = "csvInjectionMessageKey";

  private InjectionValidator<CdsData, ResourceRequests_> cut;
  private Messages mockMessages;
  private CdsData testData = Struct.create(CdsData.class);

  @SuppressWarnings("unchecked")
  @BeforeEach
  public void setUp() {
    this.mockMessages = mock(Messages.class, RETURNS_DEEP_STUBS);
    this.cut = mock(InjectionValidator.class, Mockito.withSettings()
        .useConstructor(this.mockMessages, ResourceRequests_.class).defaultAnswer(Mockito.CALLS_REAL_METHODS));

    // mockMessages: Return a plausible .stream() based on invocation of .error()
    // https://github.wdf.sap.corp/cap/issues/issues/7529
    // This can be replaced with a verification of throwIfError (CAP >= 1.15.0)
    Message mockError = mock(Message.class);
    doReturn(Message.Severity.ERROR).when(mockError).getSeverity();
    AtomicBoolean mockErrorCalled = new AtomicBoolean(false);
    doAnswer(invocation -> {
      mockErrorCalled.set(true);
      return mock(Message.class);
    }).when(this.mockMessages).error(anyString());
    doAnswer(invocation -> mockErrorCalled.get() ? Stream.of(mockError) : Stream.of()).when(this.mockMessages).stream();
  }

  @Test
  @DisplayName("check if validateForInjection() throws a ServiceException when a cds entity contains an evil html tag")
  public void validateForInjectionHtmlTagsDetected() {
    doReturn(HTML_INJECTION_MESSAGE_KEY).when(this.cut).getMessageKeyForHtmlInjection();
    doReturn(singletonList(new ValuePath<>(EVIL_SCRIPT_TAG, ResourceRequests_::name))).when(this.cut)
        .extractValuesForHtmlInjection(any());

    this.cut.validateForInjection(this.testData);
    verify(this.mockMessages, times(1)).error(HTML_INJECTION_MESSAGE_KEY);
  }

  @Test
  @DisplayName("check if validateForInjection() throws a ServiceException when a cds entity contains a forbidden first character")
  public void validateForInjectionForbiddenFirstCharactersDetected() {
    doReturn(CSV_INJECTION_MESSAGE_KEY).when(this.cut).getMessageKeyForCsvInjection();
    doReturn(singletonList(new ValuePath<>(EVIL_CSV, ResourceRequests_::description))).when(this.cut)
        .extractValuesForCsvInjection(any());

    this.cut.validateForInjection(this.testData);
    verify(this.mockMessages, times(1)).error(CSV_INJECTION_MESSAGE_KEY);
  }

  @Test
  @DisplayName("check if validateForInjection() runs through successfully when a cds entity neither contains evil html tags nor forbidden first characters")
  public void validateForInjectionWithoutEvilInjection() {
    doReturn(CSV_INJECTION_MESSAGE_KEY).when(this.cut).getMessageKeyForCsvInjection();
    doReturn(HTML_INJECTION_MESSAGE_KEY).when(this.cut).getMessageKeyForHtmlInjection();
    doReturn(singletonList(new ValuePath<>(HARMLESS_VALUE, ResourceRequests_::name))).when(this.cut)
        .extractValuesForHtmlInjection(any());
    doReturn(singletonList(new ValuePath<>(HARMLESS_VALUE, ResourceRequests_::name))).when(this.cut)
        .extractValuesForCsvInjection(any());

    assertDoesNotThrow(() -> this.cut.validateForInjection(this.testData));
    verify(this.mockMessages, times(0)).error(anyString());
  }

  @Test
  @DisplayName("check if validateForInjection() throws UnsupportedOperationsException when a cds entity contains an evil html tag and the method getMessageKeyForHtmlInjection() was not overridden")
  public void validateForInjectionHtmlTagsDetectedWithoutMessageKeyMethodOverridden() {
    doReturn(singletonList(new ValuePath<>(EVIL_SCRIPT_TAG, ResourceRequests_::name))).when(this.cut)
        .extractValuesForHtmlInjection(any());
    assertThrows(UnsupportedOperationException.class, () -> this.cut.validateForInjection(this.testData));
  }

  @Test
  @DisplayName("check if validateForInjection() throws UnsupportedOperationsException when a cds entity contains forbidden first characters and the method getMessageKeyForHtmlInjection() was not overridden")
  public void validateForInjectionForbiddenFirstCharactersDetectedWithoutMessageKeyMethodOverridden() {
    doReturn(singletonList(new ValuePath<>(EVIL_CSV, ResourceRequests_::name))).when(this.cut)
        .extractValuesForCsvInjection(any());
    assertThrows(UnsupportedOperationException.class, () -> this.cut.validateForInjection(this.testData));
  }
}
