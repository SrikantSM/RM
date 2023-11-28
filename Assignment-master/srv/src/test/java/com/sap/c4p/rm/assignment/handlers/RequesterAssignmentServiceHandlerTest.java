package com.sap.c4p.rm.assignment.handlers;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.sap.cds.services.ServiceException;
import com.sap.cds.services.messages.Messages;

import com.sap.c4p.rm.assignment.enums.AssignmentStatus;
import com.sap.c4p.rm.assignment.utils.AssignmentDraftsUtility;
import com.sap.c4p.rm.assignment.validation.AssignmentDraftsValidator;
import com.sap.c4p.rm.assignment.validation.AssignmentValidator;

import assignmentservice.Assignments;
import requesterassignmentservice.SetAssignmentStatusContext;

public class RequesterAssignmentServiceHandlerTest {

  private static final String ASSIGNMENT_ID = "AssignmentId";
  private static final String RESOURCE_REQUEST_ID = "ResourceRequestId";
  private AssignmentValidator mockValidator;
  private AssignmentDraftsValidator mockDraftsValidator;
  private AssignmentDraftsUtility mockDraftUtility;

  private RequesterAssignmentServiceHandler classUnderTest;

  @BeforeEach
  public void setUp() {
    this.mockDraftsValidator = mock(AssignmentDraftsValidator.class, Mockito.RETURNS_DEEP_STUBS);
    this.mockDraftUtility = mock(AssignmentDraftsUtility.class, Mockito.RETURNS_DEEP_STUBS);
    this.mockValidator = mock(AssignmentValidator.class, Mockito.RETURNS_DEEP_STUBS);

    this.classUnderTest = new RequesterAssignmentServiceHandler(mockValidator, mockDraftsValidator, mockDraftUtility);
  }

  @Test
  public void invalidStatusInputLeadsToError() {
    SetAssignmentStatusContext mockContext = SetAssignmentStatusContext.create();
    mockContext.setAssignmentID(ASSIGNMENT_ID);
    mockContext.setStatus(Integer.valueOf(42));

    assertThrows(ServiceException.class, () -> classUnderTest.setAssignmentStatus(mockContext));
  }

  @Test
  public void settingHardBookedStatusLeadsToError() {
    SetAssignmentStatusContext mockContext = SetAssignmentStatusContext.create();
    mockContext.setAssignmentID(ASSIGNMENT_ID);
    mockContext.setStatus(AssignmentStatus.HARDBOOKED.getCode());

    assertThrows(ServiceException.class, () -> classUnderTest.setAssignmentStatus(mockContext));
  }

  @Test
  public void settingSoftBookedStatusLeadsToError() {
    SetAssignmentStatusContext mockContext = SetAssignmentStatusContext.create();
    mockContext.setAssignmentID(ASSIGNMENT_ID);
    mockContext.setStatus(AssignmentStatus.SOFTBOOKED.getCode());

    assertThrows(ServiceException.class, () -> classUnderTest.setAssignmentStatus(mockContext));
  }

  @Test
  public void settingProposedStatusLeadsToError() {
    SetAssignmentStatusContext mockContext = SetAssignmentStatusContext.create();
    mockContext.setAssignmentID(ASSIGNMENT_ID);
    mockContext.setStatus(AssignmentStatus.PROPOSED.getCode());

    assertThrows(ServiceException.class, () -> classUnderTest.setAssignmentStatus(mockContext));
  }

  @Test
  public void settingAcceptedStatusSuccessful() {
    SetAssignmentStatusContext mockContext = mock(SetAssignmentStatusContext.class, Mockito.RETURNS_DEEP_STUBS);
    when(mockContext.getAssignmentID()).thenReturn(ASSIGNMENT_ID);
    when(mockContext.getStatus()).thenReturn(Integer.valueOf(AssignmentStatus.ACCEPTED.getCode()));
    when(mockContext.getUserInfo().getName()).thenReturn("Some Requester");

    Messages mockMessage = mock(Messages.class);
    when(mockContext.getMessages()).thenReturn(mockMessage);

    Assignments mockEditDraft = Assignments.create();
    mockEditDraft.setResourceRequestId(RESOURCE_REQUEST_ID);

    when(mockDraftUtility.getEditDraftForUser(ASSIGNMENT_ID, "Some Requester", mockMessage, true, true))
        .thenReturn(mockEditDraft);
    when(mockValidator.getMessages()).thenReturn(mockMessage);

    classUnderTest.setAssignmentStatus(mockContext);

    verify(mockDraftUtility, times(1)).updateAssignmentStatus(ASSIGNMENT_ID, mockContext.getStatus());
    verify(mockDraftUtility, times(1)).activateEditDraft(ASSIGNMENT_ID);
    verify(mockContext, times(1)).setCompleted();
  }

  @Test
  public void settingRejectedStatusSuccessful() {
    SetAssignmentStatusContext mockContext = mock(SetAssignmentStatusContext.class, Mockito.RETURNS_DEEP_STUBS);
    when(mockContext.getAssignmentID()).thenReturn(ASSIGNMENT_ID);
    when(mockContext.getStatus()).thenReturn(Integer.valueOf(AssignmentStatus.REJECTED.getCode()));
    when(mockContext.getUserInfo().getName()).thenReturn("Some Requester");

    Messages mockMessage = mock(Messages.class);
    when(mockContext.getMessages()).thenReturn(mockMessage);

    Assignments mockEditDraft = Assignments.create();
    mockEditDraft.setResourceRequestId(RESOURCE_REQUEST_ID);

    when(mockDraftUtility.getEditDraftForUser(ASSIGNMENT_ID, "Some Requester", mockMessage, true, true))
        .thenReturn(mockEditDraft);
    when(mockValidator.getMessages()).thenReturn(mockMessage);

    classUnderTest.setAssignmentStatus(mockContext);

    verify(mockDraftUtility, times(1)).updateAssignmentStatus(ASSIGNMENT_ID, mockContext.getStatus());
    verify(mockDraftUtility, times(1)).activateEditDraft(ASSIGNMENT_ID);
    verify(mockContext, times(1)).setCompleted();
  }

  @Test
  public void settingAcceptedStatusFailsIfNotAuthorized() {
    SetAssignmentStatusContext mockContext = mock(SetAssignmentStatusContext.class, Mockito.RETURNS_DEEP_STUBS);
    when(mockContext.getAssignmentID()).thenReturn(ASSIGNMENT_ID);
    when(mockContext.getStatus()).thenReturn(Integer.valueOf(AssignmentStatus.ACCEPTED.getCode()));
    when(mockContext.getUserInfo().getName()).thenReturn("Some Requester");

    Messages mockMessage = mock(Messages.class);
    when(mockContext.getMessages()).thenReturn(mockMessage);

    Assignments mockEditDraft = Assignments.create();
    mockEditDraft.setResourceRequestId(RESOURCE_REQUEST_ID);

    when(mockDraftUtility.getEditDraftForUser(ASSIGNMENT_ID, "Some Requester", mockMessage, true, true))
        .thenReturn(mockEditDraft);
    when(mockValidator.getMessages()).thenReturn(mockMessage);
    doThrow(ServiceException.class).when(mockMessage).throwIfError();

    assertThrows(ServiceException.class, () -> classUnderTest.setAssignmentStatus(mockContext));

    verify(mockDraftUtility, times(0)).updateAssignmentStatus(ASSIGNMENT_ID, mockContext.getStatus());
    verify(mockDraftUtility, times(0)).activateEditDraft(ASSIGNMENT_ID);
    verify(mockContext, times(0)).setCompleted();
  }

  @Test
  public void settingRejectedStatusFailsIfNotAuthorized() {
    SetAssignmentStatusContext mockContext = mock(SetAssignmentStatusContext.class, Mockito.RETURNS_DEEP_STUBS);
    when(mockContext.getAssignmentID()).thenReturn(ASSIGNMENT_ID);
    when(mockContext.getStatus()).thenReturn(Integer.valueOf(AssignmentStatus.REJECTED.getCode()));
    when(mockContext.getUserInfo().getName()).thenReturn("Some Requester");

    Messages mockMessage = mock(Messages.class);
    when(mockContext.getMessages()).thenReturn(mockMessage);

    Assignments mockEditDraft = Assignments.create();
    mockEditDraft.setResourceRequestId(RESOURCE_REQUEST_ID);

    when(mockDraftUtility.getEditDraftForUser(ASSIGNMENT_ID, "Some Requester", mockMessage, true, true))
        .thenReturn(mockEditDraft);
    when(mockValidator.getMessages()).thenReturn(mockMessage);
    doThrow(ServiceException.class).when(mockMessage).throwIfError();

    assertThrows(ServiceException.class, () -> classUnderTest.setAssignmentStatus(mockContext));

    verify(mockDraftUtility, times(0)).updateAssignmentStatus(ASSIGNMENT_ID, mockContext.getStatus());
    verify(mockDraftUtility, times(0)).activateEditDraft(ASSIGNMENT_ID);
    verify(mockContext, times(0)).setCompleted();
  }

  @Test
  public void settingAcceptedStatusFailsIfDraftValidationsFail() {
    SetAssignmentStatusContext mockContext = mock(SetAssignmentStatusContext.class, Mockito.RETURNS_DEEP_STUBS);
    when(mockContext.getAssignmentID()).thenReturn(ASSIGNMENT_ID);
    when(mockContext.getStatus()).thenReturn(Integer.valueOf(AssignmentStatus.ACCEPTED.getCode()));
    when(mockContext.getUserInfo().getName()).thenReturn("Some Requester");

    Messages mockEmptyMessage = mock(Messages.class);
    when(mockContext.getMessages()).thenReturn(mockEmptyMessage);

    Assignments mockEditDraft = Assignments.create();
    mockEditDraft.setResourceRequestId(RESOURCE_REQUEST_ID);

    when(mockDraftUtility.getEditDraftForUser(ASSIGNMENT_ID, "Some Requester", mockEmptyMessage, true, true))
        .thenReturn(mockEditDraft);
    when(mockValidator.getMessages()).thenReturn(mockEmptyMessage);

    Messages mockErrorMessage = mock(Messages.class);
    when(mockDraftsValidator.validate(ASSIGNMENT_ID)).thenReturn(mockErrorMessage);
    doThrow(ServiceException.class).when(mockErrorMessage).throwIfError();

    assertThrows(ServiceException.class, () -> classUnderTest.setAssignmentStatus(mockContext));

    verify(mockDraftUtility, times(1)).updateAssignmentStatus(ASSIGNMENT_ID, mockContext.getStatus());
    verify(mockDraftUtility, times(0)).activateEditDraft(ASSIGNMENT_ID);
    verify(mockContext, times(0)).setCompleted();
  }

  @Test
  public void settingRejectedStatusFailsIfDraftValidationsFail() {
    SetAssignmentStatusContext mockContext = mock(SetAssignmentStatusContext.class, Mockito.RETURNS_DEEP_STUBS);
    when(mockContext.getAssignmentID()).thenReturn(ASSIGNMENT_ID);
    when(mockContext.getStatus()).thenReturn(Integer.valueOf(AssignmentStatus.REJECTED.getCode()));
    when(mockContext.getUserInfo().getName()).thenReturn("Some Requester");

    Messages mockEmptyMessage = mock(Messages.class);
    when(mockContext.getMessages()).thenReturn(mockEmptyMessage);

    Assignments mockEditDraft = Assignments.create();
    mockEditDraft.setResourceRequestId(RESOURCE_REQUEST_ID);

    when(mockDraftUtility.getEditDraftForUser(ASSIGNMENT_ID, "Some Requester", mockEmptyMessage, true, true))
        .thenReturn(mockEditDraft);
    when(mockValidator.getMessages()).thenReturn(mockEmptyMessage);

    Messages mockErrorMessage = mock(Messages.class);
    when(mockDraftsValidator.validate(ASSIGNMENT_ID)).thenReturn(mockErrorMessage);
    doThrow(ServiceException.class).when(mockErrorMessage).throwIfError();

    assertThrows(ServiceException.class, () -> classUnderTest.setAssignmentStatus(mockContext));

    verify(mockDraftUtility, times(1)).updateAssignmentStatus(ASSIGNMENT_ID, mockContext.getStatus());
    verify(mockDraftUtility, times(0)).activateEditDraft(ASSIGNMENT_ID);
    verify(mockContext, times(0)).setCompleted();
  }

  @Test
  public void settingAcceptedStatusFailsIfEditDraftCouldNotBeCreated() {
    SetAssignmentStatusContext mockContext = mock(SetAssignmentStatusContext.class, Mockito.RETURNS_DEEP_STUBS);
    when(mockContext.getAssignmentID()).thenReturn(ASSIGNMENT_ID);
    when(mockContext.getStatus()).thenReturn(Integer.valueOf(AssignmentStatus.ACCEPTED.getCode()));
    when(mockContext.getUserInfo().getName()).thenReturn("Some Requester");

    Messages mockEmptyMessage = mock(Messages.class);
    when(mockContext.getMessages()).thenReturn(mockEmptyMessage);

    Assignments mockEditDraft = Assignments.create();
    mockEditDraft.setResourceRequestId(RESOURCE_REQUEST_ID);

    when(mockDraftUtility.getEditDraftForUser(ASSIGNMENT_ID, "Some Requester", mockEmptyMessage, true, true))
        .thenReturn(null);
    when(mockValidator.getMessages()).thenReturn(mockEmptyMessage);

    assertThrows(ServiceException.class, () -> classUnderTest.setAssignmentStatus(mockContext));

    verify(mockDraftUtility, times(0)).updateAssignmentStatus(ASSIGNMENT_ID, mockContext.getStatus());
    verify(mockDraftUtility, times(0)).activateEditDraft(ASSIGNMENT_ID);
    verify(mockContext, times(0)).setCompleted();
  }

  @Test
  public void settingRejectedStatusFailsIfEditDraftCouldNotBeCreated() {
    SetAssignmentStatusContext mockContext = mock(SetAssignmentStatusContext.class, Mockito.RETURNS_DEEP_STUBS);
    when(mockContext.getAssignmentID()).thenReturn(ASSIGNMENT_ID);
    when(mockContext.getStatus()).thenReturn(Integer.valueOf(AssignmentStatus.REJECTED.getCode()));
    when(mockContext.getUserInfo().getName()).thenReturn("Some Requester");

    Messages mockEmptyMessage = mock(Messages.class);
    when(mockContext.getMessages()).thenReturn(mockEmptyMessage);

    Assignments mockEditDraft = Assignments.create();
    mockEditDraft.setResourceRequestId(RESOURCE_REQUEST_ID);

    when(mockDraftUtility.getEditDraftForUser(ASSIGNMENT_ID, "Some Requester", mockEmptyMessage, true, true))
        .thenReturn(null);
    when(mockValidator.getMessages()).thenReturn(mockEmptyMessage);

    assertThrows(ServiceException.class, () -> classUnderTest.setAssignmentStatus(mockContext));

    verify(mockDraftUtility, times(0)).updateAssignmentStatus(ASSIGNMENT_ID, mockContext.getStatus());
    verify(mockDraftUtility, times(0)).activateEditDraft(ASSIGNMENT_ID);
    verify(mockContext, times(0)).setCompleted();
  }

}
