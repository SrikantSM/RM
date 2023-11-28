package com.sap.c4p.rm.consultantprofile.handlers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;

import com.sap.c4p.rm.consultantprofile.gen.MessageKeys;
import com.sap.cds.services.application.ApplicationLifecycleService;
import com.sap.cds.services.application.ErrorResponseEventContext;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.messages.Message;
import com.sap.cds.services.messages.Message.Severity;
import com.sap.cds.services.utils.CdsErrorStatuses;

import projectexperienceservice.ExternalWorkExperienceSkillAssignments_;
import projectexperienceservice.ExternalWorkExperience_;
import projectexperienceservice.SkillAssignments_;

@Component
@ServiceName(ApplicationLifecycleService.DEFAULT_NAME)
public class ProjectExperienceServiceErrorMessageHandler implements EventHandler {

	@Autowired
	private MessageSource messageSource;

	@After
	public void overrideValidationMessages(ErrorResponseEventContext context) {
		context.getException().getEventContexts().stream().findFirst().ifPresent(originalContext -> {
			List<Message> messages = context.getResult().getMessages();
			String qualifiedName = originalContext.getTarget() != null ? originalContext.getTarget().getQualifiedName() : null;
				for (int i = 0; i < messages.size(); ++i) {
					Message message = messages.get(i);
					if (CdsErrorStatuses.UNIQUE_CONSTRAINT_VIOLATED.getCodeString().equals(message.getCode())) {
						if (SkillAssignments_.CDS_NAME.equals(qualifiedName)) {
							messages.set(i,
									Message.create(Severity.ERROR,
											messageSource.getMessage(MessageKeys.INPUT_UNIQUE_SKILLASSIGNMENT, null,
													LocaleContextHolder.getLocale()),
											message));
						} else if (ExternalWorkExperience_.CDS_NAME.equals(qualifiedName)) {
							messages.set(i,
									Message.create(Severity.ERROR,
											messageSource.getMessage(MessageKeys.INPUT_UNIQUE_EXTERNALWORKEXPERIENCE,
													null, LocaleContextHolder.getLocale()),
											message));
						} else if (ExternalWorkExperienceSkillAssignments_.CDS_NAME.equals(qualifiedName)) {
							messages.set(i,
									Message.create(Severity.ERROR,
											messageSource.getMessage(
													MessageKeys.INPUT_UNIQUE_EXTERNALWORKEXPERIENCESKILLASSIGNMENT,
													null, LocaleContextHolder.getLocale()),
											message));
						}
					}
				}
		});
	}
}
