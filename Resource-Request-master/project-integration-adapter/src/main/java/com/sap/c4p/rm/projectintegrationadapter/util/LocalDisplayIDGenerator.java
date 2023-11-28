package com.sap.c4p.rm.projectintegrationadapter.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;

@Component
@Profile({ "default" })
public class LocalDisplayIDGenerator implements DisplayIDGenerator {
  private int startPoint;

  @Autowired
  public LocalDisplayIDGenerator() {
    this.startPoint = 0;
  }

  @Override
  public String getDisplayId() {
    try {
      return String.format("%010d", startPoint++);
    } catch (Exception e) {
      throw new ServiceException(ErrorStatuses.BAD_GATEWAY, Constants.LoggerMessages.DISPLAYID_GENERATION_FAILED);
    }
  }

}