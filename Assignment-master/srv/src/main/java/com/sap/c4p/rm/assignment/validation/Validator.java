package com.sap.c4p.rm.assignment.validation;

import com.sap.cds.services.EventContext;
import com.sap.cds.services.messages.Messages;

public interface Validator {
  Messages validate(EventContext c);
}
