package com.sap.c4p.rm.handlers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;

import com.sap.c4p.rm.gen.MessageKeys;
import com.sap.c4p.rm.utils.Constants;
import com.sap.cds.services.application.ApplicationLifecycleService;
import com.sap.cds.services.application.ErrorResponseEventContext;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.messages.Message;
import com.sap.cds.services.messages.Message.Severity;
import com.sap.cds.services.utils.CdsErrorStatuses;

import workforceavailabilityservice.WorkforceAvailability_;

@Component
@ServiceName(ApplicationLifecycleService.DEFAULT_NAME)
public class WorkforceAvailabilityServiceErrorMessageHandler implements EventHandler {
	
    @Autowired
    private MessageSource messageSource;

    @After
    public void overrideValidationMessages(ErrorResponseEventContext context) {
        context.getException().getEventContexts().stream().findFirst().ifPresent(originalContext -> {
        	List<Message> messages = context.getResult().getMessages();
        	String qualifiedName = originalContext.getTarget().getQualifiedName();
            for (int i = 0; i < messages.size(); ++i) {
                Message message = messages.get(i);
                if (CdsErrorStatuses.UNIQUE_CONSTRAINT_VIOLATED.getCodeString().equals(message.getCode()) && WorkforceAvailability_.CDS_NAME.equals(qualifiedName)) {
                	messages.set(i,
                            Message.create(Severity.ERROR,
                                    messageSource.getMessage(MessageKeys.INPUT_UNIQUE_WORKFORCE_AVAILABILITY, null,
                                            LocaleContextHolder.getLocale()),
                                    message));
                }
            }
        });
        List<Message> messages = context.getResult().getMessages();
        for (int i = 0; i < messages.size(); ++i) {
        	Message message = messages.get(i);
        	if (message.getMessage().equals(Constants.ERROR_MSG_AVAILABILITY_INTERVAL_NULL) &&
        			CdsErrorStatuses.INVALID_PAYLOAD.getCodeString().equals(message.getCode())) {
        		messages.set(i,
        				Message.create(Severity.ERROR,
                                messageSource.getMessage(MessageKeys.INPUT_AVAILABILITY_INTERVAL_NULL, null,
                                        LocaleContextHolder.getLocale()),
                                message));
        	} else if (message.getMessage().equals(Constants.ERROR_MSG_AVAILABILITY_SUPPLEMENT_NULL) &&
        			CdsErrorStatuses.INVALID_PAYLOAD.getCodeString().equals(message.getCode())) {
        		messages.set(i,
        				Message.create(Severity.ERROR,
                                messageSource.getMessage(MessageKeys.INPUT_AVAILABILITY_SUPPLEMENT_NULL, null,
                                        LocaleContextHolder.getLocale()),
                                message));
        	}
        }
    }
}
