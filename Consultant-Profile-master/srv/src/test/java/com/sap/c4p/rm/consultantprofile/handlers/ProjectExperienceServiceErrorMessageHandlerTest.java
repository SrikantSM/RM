package com.sap.c4p.rm.consultantprofile.handlers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;

import com.sap.c4p.rm.consultantprofile.InitMocks;
import com.sap.c4p.rm.consultantprofile.gen.MessageKeys;
import com.sap.cds.services.EventContext;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.application.ErrorResponseEventContext;
import com.sap.cds.services.application.ErrorResponseEventContext.ErrorResponse;
import com.sap.cds.services.impl.messages.MessageImpl;
import com.sap.cds.services.messages.Message;
import com.sap.cds.services.messages.Message.Severity;
import com.sap.cds.services.utils.CdsErrorStatuses;

import projectexperienceservice.ExternalWorkExperienceSkillAssignments_;
import projectexperienceservice.ExternalWorkExperience_;
import projectexperienceservice.Profiles_;
import projectexperienceservice.SkillAssignments_;

public class ProjectExperienceServiceErrorMessageHandlerTest extends InitMocks {

    @Mock
    private ErrorResponseEventContext mockErrorResponseEventContext;

    @Mock
    private ServiceException mockServiceException;

    @Mock
    private EventContext mockEventContext;

    @Mock
    private MessageSource mockMessageSource;

    @Autowired
    @InjectMocks
    @Spy
    private ProjectExperienceServiceErrorMessageHandler classUnderTest;

    @Test
    @DisplayName("Verify if validation message was overriden for Skill Assignments")
    void overrideValidationMessagesForSkillAssignments() {
		mockEventContext = EventContext.create("Test Event Context", SkillAssignments_.CDS_NAME);
        ErrorResponse errorResponse = ErrorResponse.create();
        List<Message> messages = new ArrayList<>();
        Message m1 = new MessageImpl(Severity.INFO, "Some Message");
        m1.code(CdsErrorStatuses.UNIQUE_CONSTRAINT_VIOLATED.getCodeString());
        messages.add(m1);
        errorResponse.setMessages(messages);
        when(mockServiceException.getEventContexts()).thenReturn(Arrays.asList(mockEventContext));
        when(mockErrorResponseEventContext.getException()).thenReturn(mockServiceException);
        when(mockErrorResponseEventContext.getResult()).thenReturn(errorResponse);
        when(mockMessageSource.getMessage(MessageKeys.INPUT_UNIQUE_SKILLASSIGNMENT, null,
                LocaleContextHolder.getLocale())).thenReturn("Expected Error Message");
        classUnderTest.overrideValidationMessages(mockErrorResponseEventContext);
        verify(mockErrorResponseEventContext, times(1)).getResult();
        assertEquals("Expected Error Message",
                mockErrorResponseEventContext.getResult().getMessages().get(0).getMessage());
        assertEquals(Severity.ERROR, mockErrorResponseEventContext.getResult().getMessages().get(0).getSeverity());
    }

    @Test
    @DisplayName("Verify if validation message was overriden for External Work Experience")
    void overrideValidationMessagesForExternalWorkExperience() {
		mockEventContext = EventContext.create("Test Event Context", ExternalWorkExperience_.CDS_NAME);
        ErrorResponse errorResponse = ErrorResponse.create();
        List<Message> messages = new ArrayList<>();
        Message m1 = new MessageImpl(Severity.INFO, "Some Message");
        m1.code(CdsErrorStatuses.UNIQUE_CONSTRAINT_VIOLATED.getCodeString());
        messages.add(m1);
        errorResponse.setMessages(messages);
        when(mockServiceException.getEventContexts()).thenReturn(Arrays.asList(mockEventContext));
        when(mockErrorResponseEventContext.getException()).thenReturn(mockServiceException);
        when(mockErrorResponseEventContext.getResult()).thenReturn(errorResponse);
        when(mockMessageSource.getMessage(MessageKeys.INPUT_UNIQUE_EXTERNALWORKEXPERIENCE, null,
                LocaleContextHolder.getLocale())).thenReturn("Expected Error Message");
        classUnderTest.overrideValidationMessages(mockErrorResponseEventContext);
        verify(mockErrorResponseEventContext, times(1)).getResult();
        assertEquals("Expected Error Message",
                mockErrorResponseEventContext.getResult().getMessages().get(0).getMessage());
        assertEquals(Severity.ERROR, mockErrorResponseEventContext.getResult().getMessages().get(0).getSeverity());
    }
    
    @Test
    @DisplayName("Verify if validation message was overriden for External Work Experience Skill Assignments")
    void overrideValidationMessagesForExternalWorkExperienceSkillAssignments() {
		mockEventContext = EventContext.create("Test Event Context", ExternalWorkExperienceSkillAssignments_.CDS_NAME);
        ErrorResponse errorResponse = ErrorResponse.create();
        List<Message> messages = new ArrayList<>();
        Message m1 = new MessageImpl(Severity.INFO, "Some Message");
        m1.code(CdsErrorStatuses.UNIQUE_CONSTRAINT_VIOLATED.getCodeString());
        messages.add(m1);
        errorResponse.setMessages(messages);
        when(mockServiceException.getEventContexts()).thenReturn(Arrays.asList(mockEventContext));
        when(mockErrorResponseEventContext.getException()).thenReturn(mockServiceException);
        when(mockErrorResponseEventContext.getResult()).thenReturn(errorResponse);
        when(mockMessageSource.getMessage(MessageKeys.INPUT_UNIQUE_EXTERNALWORKEXPERIENCESKILLASSIGNMENT, null,
                LocaleContextHolder.getLocale())).thenReturn("Expected Error Message");
        classUnderTest.overrideValidationMessages(mockErrorResponseEventContext);
        verify(mockErrorResponseEventContext, times(1)).getResult();
        assertEquals("Expected Error Message",
                mockErrorResponseEventContext.getResult().getMessages().get(0).getMessage());
        assertEquals(Severity.ERROR, mockErrorResponseEventContext.getResult().getMessages().get(0).getSeverity());
    }

    @Test
    @DisplayName("Verify if validation message was not overriden for other entities")
    void doNotOverrideValidationMessagesOtherEntity() {
        mockEventContext = EventContext.create("Test Event Context", Profiles_.CDS_NAME);
        ErrorResponse errorResponse = ErrorResponse.create();
        List<Message> messages = new ArrayList<>();
        Message m1 = new MessageImpl(Severity.INFO, "Some Message");
        m1.code(CdsErrorStatuses.UNIQUE_CONSTRAINT_VIOLATED.getCodeString());
        messages.add(m1);
        errorResponse.setMessages(messages);
        when(mockServiceException.getEventContexts()).thenReturn(Arrays.asList(mockEventContext));
        when(mockErrorResponseEventContext.getException()).thenReturn(mockServiceException);
        when(mockErrorResponseEventContext.getResult()).thenReturn(errorResponse);
        classUnderTest.overrideValidationMessages(mockErrorResponseEventContext);
        assertEquals("Some Message",
                mockErrorResponseEventContext.getResult().getMessages().get(0).getMessage());
        assertEquals(Severity.INFO, mockErrorResponseEventContext.getResult().getMessages().get(0).getSeverity());
    }

    @Test
    @DisplayName("Verify if validation message was not overriden for other errors")
    void doNotOverrideValidationMessagesForOtherErrors() {
        mockEventContext = EventContext.create("Test Event Context", SkillAssignments_.CDS_NAME);
        ErrorResponse errorResponse = ErrorResponse.create();
        List<Message> messages = new ArrayList<>();
        Message m1 = new MessageImpl(Severity.INFO, "Some Message");
        m1.code(CdsErrorStatuses.AUDITLOG_DATA_SUBJECT_MISSING.getCodeString());
        messages.add(m1);
        errorResponse.setMessages(messages);
        when(mockServiceException.getEventContexts()).thenReturn(Arrays.asList(mockEventContext));
        when(mockErrorResponseEventContext.getException()).thenReturn(mockServiceException);
        when(mockErrorResponseEventContext.getResult()).thenReturn(errorResponse);
        when(mockMessageSource.getMessage(MessageKeys.INPUT_UNIQUE_SKILLASSIGNMENT, null,
                LocaleContextHolder.getLocale())).thenReturn("Expected Error Message");
        classUnderTest.overrideValidationMessages(mockErrorResponseEventContext);
        verify(mockErrorResponseEventContext, times(1)).getResult();
        assertEquals("Some Message",
                mockErrorResponseEventContext.getResult().getMessages().get(0).getMessage());
        assertEquals(Severity.INFO, mockErrorResponseEventContext.getResult().getMessages().get(0).getSeverity());
    }

}
