package com.sap.c4p.rm.resourcerequest.exceptions;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.messages.Message;
import com.sap.cds.services.messages.Message.Severity;
import com.sap.cds.services.messages.Messages;

import com.sap.c4p.rm.resourcerequest.gen.MessageKeys;

public class ExceptionUtilityTest {

  private Messages mockMessages;

  private ExceptionUtility cut;

  @BeforeEach
  public void setUp() {
    mockMessages = mock(Messages.class, RETURNS_DEEP_STUBS);
  }

  @Nested
  @DisplayName("Raise exception when error")
  class RaiseExceptionWhenError {

    @Test
    @DisplayName("No error occurred")
    void noErrorOccurred() {
      List<Message> listMessage = new ArrayList<>();
      when(mockMessages.stream()).thenReturn(listMessage.stream());

      cut = new ExceptionUtility(mockMessages);

      assertDoesNotThrow(() -> cut.throwExceptionIfErrorWithGenericMessage());
    }

    @Test
    @DisplayName("Warning occurred")
    void warningOccurred() {
      Message mockMessage = mock(Message.class);
      when(mockMessage.getSeverity()).thenReturn(Severity.WARNING);
      when(mockMessage.getMessage()).thenReturn(MessageKeys.ERROR_OCCURED);
      List<Message> listMessage = new ArrayList<>();
      listMessage.add(mockMessage);
      when(mockMessages.stream()).thenReturn(listMessage.stream());

      cut = new ExceptionUtility(mockMessages);
      assertDoesNotThrow(() -> cut.throwExceptionIfErrorWithGenericMessage());
    }

    @Test
    @DisplayName("Error occurred.")
    void errorOccurredWithoutTarget() {
      Message mockMessage = mock(Message.class);
      when(mockMessage.getSeverity()).thenReturn(Severity.ERROR);
      when(mockMessage.getMessage()).thenReturn(MessageKeys.ERROR_OCCURED);
      List<Message> listMessage = new ArrayList<>();
      listMessage.add(mockMessage);
      when(mockMessages.stream()).thenReturn(listMessage.stream());

      cut = new ExceptionUtility(mockMessages);

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> cut.throwExceptionIfErrorWithGenericMessage());
      assertAll(() -> assertEquals(ErrorStatuses.BAD_REQUEST, exception.getErrorStatus()),
          () -> assertEquals(MessageKeys.ERROR_OCCURED, exception.getMessage()));
    }

  }
}