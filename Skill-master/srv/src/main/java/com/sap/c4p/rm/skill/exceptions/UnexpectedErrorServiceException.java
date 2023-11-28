package com.sap.c4p.rm.skill.exceptions;

import com.sap.cds.services.ErrorStatus;
import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.skill.gen.MessageKeys;
import com.sap.c4p.rm.skill.utils.HttpStatus;

public class UnexpectedErrorServiceException extends ServiceException {
  private static final long serialVersionUID = 1L;

  public UnexpectedErrorServiceException(Throwable e) {
    super(MessageKeys.UNEXPECTED_ERROR_OCCURRED, e);
  }

  public UnexpectedErrorServiceException() {
    super(MessageKeys.UNEXPECTED_ERROR_OCCURRED);
  }

  @Override
  public ErrorStatus getErrorStatus() {
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
