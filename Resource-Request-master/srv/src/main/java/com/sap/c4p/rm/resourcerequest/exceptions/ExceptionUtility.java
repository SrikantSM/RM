package com.sap.c4p.rm.resourcerequest.exceptions;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.messages.Message.Severity;
import com.sap.cds.services.messages.Messages;

import com.sap.c4p.rm.resourcerequest.gen.MessageKeys;

@Component
public class ExceptionUtility {

  private Messages messages;

  @Autowired
  public ExceptionUtility(Messages messages) {
    this.messages = messages;
  }

  public void throwExceptionIfErrorWithGenericMessage() {
    if (messages.stream().anyMatch(message -> message.getSeverity() == Severity.ERROR)) {
      throw new ServiceException(ErrorStatuses.BAD_REQUEST, MessageKeys.ERROR_OCCURED);
    }
  }

}