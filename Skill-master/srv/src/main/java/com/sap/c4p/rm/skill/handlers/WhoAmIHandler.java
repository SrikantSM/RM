package com.sap.c4p.rm.skill.handlers;

import java.util.Collections;

import org.springframework.stereotype.Component;

import com.sap.cds.services.cds.CdsReadEventContext;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;

import fileuploadservice.FileUploadService_;
import fileuploadservice.WhoAmI;
import fileuploadservice.WhoAmI_;

@Component
@ServiceName(FileUploadService_.CDS_NAME)
public class WhoAmIHandler implements EventHandler {

  @On(event = CqnService.EVENT_READ, entity = WhoAmI_.CDS_NAME)
  public void onRequest(final CdsReadEventContext context) {
    WhoAmI user = WhoAmI.create();
    user.setUserName(context.getUserInfo().getName());
    context.setResult(Collections.singletonList(user));
    context.setCompleted();
  }
}
