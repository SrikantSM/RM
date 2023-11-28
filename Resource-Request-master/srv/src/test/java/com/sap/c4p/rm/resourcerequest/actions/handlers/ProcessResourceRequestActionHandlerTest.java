package com.sap.c4p.rm.resourcerequest.actions.handlers;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import com.sap.cds.Result;
import com.sap.cds.Struct;
import com.sap.cds.feature.xsuaa.XsuaaUserInfo;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.messages.Messages;
import com.sap.cds.services.request.UserInfo;

import com.sap.c4p.rm.resourcerequest.gen.MessageKeys;
import com.sap.c4p.rm.resourcerequest.handlers.ManageResourceRequestHandler;
import com.sap.c4p.rm.resourcerequest.utils.Constants;
import com.sap.c4p.rm.resourcerequest.validations.ResourceRequestValidator;

import processresourcerequestservice.ForwardResourceRequestContext;
import processresourcerequestservice.ResolveResourceRequestContext;
import processresourcerequestservice.ResourceRequests;
import processresourcerequestservice.SetMyResponsibilityResourceRequestContext;

@DisplayName("Unit test for Process Resource Request Actions Handler")
public class ProcessResourceRequestActionHandlerTest {

  /*
   * Class under test
   *
   */
  private static ProcessResourceRequestActionHandler cut;

  /*
   * mock objects
   *
   */

  private ManageResourceRequestHandler mockManageResourceRequestHandler;
  private ResourceRequestValidator mockResourceRequestValidator;
  private XsuaaUserInfo mockXsuaaUserInfo;
  private Messages mockMessages;
  /*
   * Setup data entity
   */
  private ResourceRequests resourceRequest;
  private String email;
  private String processor;
  private String rmanager;
  private Boolean setResponsibilityTrue;
  private Boolean setResponsibilityFalse;
  private Integer REQUEST_PUBLISH = 1;
  // private PersistenceService mockPersistenceService;

  /*
   * Set up of mock also in before each as both action cannot be called within
   * same scope
   */

  @BeforeEach
  public void setUp() {

    mockManageResourceRequestHandler = mock(ManageResourceRequestHandler.class);
    mockResourceRequestValidator = mock(ResourceRequestValidator.class);
    mockXsuaaUserInfo = mock(XsuaaUserInfo.class);
    mockMessages = mock(Messages.class, RETURNS_DEEP_STUBS);
    cut = new ProcessResourceRequestActionHandler(mockManageResourceRequestHandler, mockResourceRequestValidator,
        mockXsuaaUserInfo, mockMessages);

    resourceRequest = Struct.create(ResourceRequests.class);
    resourceRequest.setId("51051adf-06f2-4043-9179-abbfa82e182e");
    // resourceRequest.setProcessingCostCenterId("CCUS");
    resourceRequest.setProcessingResourceOrgId("ORG_US");
    email = "paul.singh@sap.com";
    // personUUID = "3f5ee64e-046a-11ea-8d71-362b9e155667";
    // ProcessorUUID = "3f5ee64e-046a-11ea-8d71-362b9e155677";

    processor = "ganesh@sap.com";
    rmanager = "jessica@sap.com";
    setResponsibilityTrue = true;
    setResponsibilityFalse = false;
  }

  @Nested
  @DisplayName("Set My Responsibility test scenarios")
  class SetResponsibilityResourceRequestTest {
    @Test
    @DisplayName("Check On Handler of Resource Request Set My Responsibility Action if selected as Resource Manager and Processor")
    public void onSetResponsibilityResourceRequestActionAsProcessorAndRMTest() {

      SetMyResponsibilityResourceRequestContext mockContext = mock(SetMyResponsibilityResourceRequestContext.class);

      Result mockResult = mock(Result.class);

      CqnService mockCqnService = mock(CqnService.class);

      CqnSelect mockSelect = mock(CqnSelect.class);

      Messages mockMessage = mock(Messages.class);

      final Optional<ResourceRequests> resourceRequestOptional = Optional.of(resourceRequest);

      when(mockContext.getService()).thenReturn(mockCqnService);

      when(mockContext.getCqn()).thenReturn(mockSelect);

      when(((CqnService) mockContext.getService()).run(mockContext.getCqn())).thenReturn(mockResult);

      when(mockResult.first(ResourceRequests.class)).thenReturn(resourceRequestOptional);

      when(mockContext.getProcessor()).thenReturn(setResponsibilityTrue);
      when(mockContext.getResourceManager()).thenReturn(setResponsibilityTrue);

      when(mockXsuaaUserInfo.getEmail()).thenReturn(email);
      // when(mockResource.getResourceId(email)).thenReturn(personUUID);
      when(mockContext.getMessages()).thenReturn(mockMessage);

      doNothing().when(mockResourceRequestValidator).validateReleaseStatusCode(REQUEST_PUBLISH);

      /*
       * Call the method and test
       */

      cut.onSetResponsibilityResourceRequestAction(mockContext);

      /*
       * However, doNothing() is Mockito's default behavior for void methods. Hence it
       * calls the void methods but does nothing hence checking the call happened once
       * or not
       *
       */

      verify(mockResourceRequestValidator, times(1)).validateRequestStatusCode(resourceRequest.getRequestStatusCode());

      verify(mockManageResourceRequestHandler, times(1)).updateResourceRequestAttributes(resourceRequest.getId(),
          ResourceRequests.RESOURCE_MANAGER, email);
      verify(mockManageResourceRequestHandler, times(1)).updateResourceRequestAttributes(resourceRequest.getId(),
          ResourceRequests.PROCESSOR, email);
      verify(mockMessages, times(1)).throwIfError();

      assertEquals(email, resourceRequest.getResourceManager(),
          "Set my responsibility as Resource Manager for the resource request is Unsuccessful");
      assertEquals(email, resourceRequest.getProcessor(),
          "Set my responsibility as Processor for the resource request is Unsuccessful");

    }

    @Test
    @DisplayName("Check On Handler of Resource Request Set My Responsibility Action if selected as Resource Manager")
    public void onSetResponsibilityResourceRequestActionAsResourceManagerTest() {

      SetMyResponsibilityResourceRequestContext mockContext = mock(SetMyResponsibilityResourceRequestContext.class);

      Result mockResult = mock(Result.class);

      CqnService mockCqnService = mock(CqnService.class);

      CqnSelect mockSelect = mock(CqnSelect.class);

      Messages mockMessage = mock(Messages.class);

      final Optional<ResourceRequests> resourceRequestOptional = Optional.of(resourceRequest);

      when(mockContext.getService()).thenReturn(mockCqnService);

      when(mockContext.getCqn()).thenReturn(mockSelect);

      when(((CqnService) mockContext.getService()).run(mockContext.getCqn())).thenReturn(mockResult);

      when(mockResult.first(ResourceRequests.class)).thenReturn(resourceRequestOptional);

      when(mockContext.getProcessor()).thenReturn(setResponsibilityFalse);
      when(mockContext.getResourceManager()).thenReturn(setResponsibilityTrue);

      when(mockXsuaaUserInfo.getEmail()).thenReturn(email);
      // when(mockResource.getResourceId(email)).thenReturn(personUUID);
      when(mockContext.getMessages()).thenReturn(mockMessage);
      doNothing().when(mockResourceRequestValidator).validateReleaseStatusCode(REQUEST_PUBLISH);

      /*
       * Call the method and test
       */

      cut.onSetResponsibilityResourceRequestAction(mockContext);

      /*
       * However, doNothing() is Mockito's default behavior for void methods. Hence it
       * calls the void methods but does nothing hence checking the call happened once
       * or not
       *
       */
      verify(mockResourceRequestValidator, times(1)).validateRequestStatusCode(resourceRequest.getRequestStatusCode());

      verify(mockManageResourceRequestHandler, times(1)).updateResourceRequestAttributes(resourceRequest.getId(),
          ResourceRequests.RESOURCE_MANAGER, email);
      verify(mockMessages, times(1)).throwIfError();

      assertEquals(email, resourceRequest.getResourceManager(),
          "Set My Responsibility as Resource Manager for the resource request is unsuccessful");

      assertNotEquals(email, resourceRequest.getProcessor(), "Error! Assigned as a Processor also");

    }

    @Test
    @DisplayName("Check On Handler of Resource Request Set My Responsibility Action if selected as Processor")
    public void onSetResponsibilityResourceRequestActionAsProcessorTest() {

      SetMyResponsibilityResourceRequestContext mockContext = mock(SetMyResponsibilityResourceRequestContext.class);

      Result mockResult = mock(Result.class);

      CqnService mockCqnService = mock(CqnService.class);

      CqnSelect mockSelect = mock(CqnSelect.class);

      Messages mockMessage = mock(Messages.class);

      final Optional<ResourceRequests> resourceRequestOptional = Optional.of(resourceRequest);

      when(mockContext.getService()).thenReturn(mockCqnService);

      when(mockContext.getCqn()).thenReturn(mockSelect);

      when(((CqnService) mockContext.getService()).run(mockContext.getCqn())).thenReturn(mockResult);

      when(mockResult.first(ResourceRequests.class)).thenReturn(resourceRequestOptional);

      when(mockContext.getProcessor()).thenReturn(setResponsibilityTrue);
      when(mockContext.getResourceManager()).thenReturn(setResponsibilityFalse);

      when(mockXsuaaUserInfo.getEmail()).thenReturn(email);
      // when(mockResource.getResourceId(email)).thenReturn(personUUID);
      when(mockContext.getMessages()).thenReturn(mockMessage);
      doNothing().when(mockResourceRequestValidator).validateReleaseStatusCode(REQUEST_PUBLISH);

      /*
       * Call the method and test
       */

      cut.onSetResponsibilityResourceRequestAction(mockContext);

      /*
       * However, doNothing() is Mockito's default behavior for void methods. Hence it
       * calls the void methods but does nothing hence checking the call happened once
       * or not
       *
       */

      verify(mockResourceRequestValidator, times(1)).validateRequestStatusCode(resourceRequest.getRequestStatusCode());

      verify(mockManageResourceRequestHandler, times(1)).updateResourceRequestAttributes(resourceRequest.getId(),
          ResourceRequests.PROCESSOR, email);
      verify(mockMessages, times(1)).throwIfError();

      assertEquals(email, resourceRequest.getProcessor(),
          "Set My Responsibility as processor for the resource request is unsuccessful");
      assertNotEquals(email, resourceRequest.getResourceManager(), "Error! Assigned as a Resource Manager also");

    }

    @Test
    @DisplayName("Check On Handler of Resource Request Set My Responsibility Action if neither Resource Manager and Processor is selected and login user is same as Resource Manager and Processor assigned")

    public void onUnSetResponsibilityResourceRequestActionTest() {

      SetMyResponsibilityResourceRequestContext mockContext = mock(SetMyResponsibilityResourceRequestContext.class);

      Result mockResult = mock(Result.class);

      CqnService mockCqnService = mock(CqnService.class);

      CqnSelect mockSelect = mock(CqnSelect.class);

      Messages mockMessage = mock(Messages.class);

      when(mockContext.getService()).thenReturn(mockCqnService);

      when(mockContext.getCqn()).thenReturn(mockSelect);

      when(((CqnService) mockContext.getService()).run(mockContext.getCqn())).thenReturn(mockResult);

      resourceRequest.setProcessor(email);
      resourceRequest.setResourceManager(email);
      final Optional<ResourceRequests> resourceRequestOptional = Optional.of(resourceRequest);
      when(mockResult.first(ResourceRequests.class)).thenReturn(resourceRequestOptional);

      when(mockContext.getProcessor()).thenReturn(setResponsibilityFalse);
      when(mockContext.getResourceManager()).thenReturn(setResponsibilityFalse);

      when(mockXsuaaUserInfo.getEmail()).thenReturn(email);
      // when(mockResource.getResourceId(email)).thenReturn(personUUID);
      when(mockContext.getMessages()).thenReturn(mockMessage);
      doNothing().when(mockResourceRequestValidator).validateReleaseStatusCode(REQUEST_PUBLISH);

      /*
       * Call the method and test
       */

      cut.onSetResponsibilityResourceRequestAction(mockContext);

      /*
       * However, doNothing() is Mockito's default behavior for void methods. Hence it
       * calls the void methods but does nothing hence checking the call happened once
       * or not
       *
       */

      verify(mockResourceRequestValidator, times(1)).validateRequestStatusCode(resourceRequest.getRequestStatusCode());

      verify(mockManageResourceRequestHandler, times(1)).updateResourceRequestAttributes(resourceRequest.getId(),
          ResourceRequests.PROCESSOR, null);

      verify(mockManageResourceRequestHandler, times(1)).updateResourceRequestAttributes(resourceRequest.getId(),
          ResourceRequests.RESOURCE_MANAGER, null);
      verify(mockMessages, times(1)).throwIfError();

      assertNotEquals(email, resourceRequest.getResourceManager(),
          "Removing my responsibility for the resource request as Resource Manager is unsuccessful");

      assertNotEquals(email, resourceRequest.getProcessor(),
          "Removing my responsibility for the resource request as Processor is unsuccessfull");

    }

    @Test
    @DisplayName("Check On Handler of Resource Request Set My Responsibility Action if neither Resource Manager and Processor is selected and login user,Resource Manager and Processor are diffrent")

    public void onUnSetResponsibilityResourceRequestActionNegativeTest() {

      SetMyResponsibilityResourceRequestContext mockContext = mock(SetMyResponsibilityResourceRequestContext.class);

      Result mockResult = mock(Result.class);

      CqnService mockCqnService = mock(CqnService.class);

      CqnSelect mockSelect = mock(CqnSelect.class);

      Messages mockMessage = mock(Messages.class);

      when(mockContext.getService()).thenReturn(mockCqnService);

      when(mockContext.getCqn()).thenReturn(mockSelect);

      when(((CqnService) mockContext.getService()).run(mockContext.getCqn())).thenReturn(mockResult);

      resourceRequest.setProcessor(processor);
      resourceRequest.setResourceManager(rmanager);
      final Optional<ResourceRequests> resourceRequestOptional = Optional.of(resourceRequest);
      when(mockResult.first(ResourceRequests.class)).thenReturn(resourceRequestOptional);

      when(mockContext.getProcessor()).thenReturn(setResponsibilityFalse);
      when(mockContext.getResourceManager()).thenReturn(setResponsibilityFalse);

      when(mockXsuaaUserInfo.getEmail()).thenReturn(email);
      // when(mockResource.getResourceId(email)).thenReturn(personUUID);
      when(mockContext.getMessages()).thenReturn(mockMessage);
      doNothing().when(mockResourceRequestValidator).validateReleaseStatusCode(REQUEST_PUBLISH);

      /*
       * Call the method and test
       */

      cut.onSetResponsibilityResourceRequestAction(mockContext);

      /*
       * However, doNothing() is Mockito's default behavior for void methods. Hence it
       * calls the void methods but does nothing hence checking the call happened once
       * or not
       *
       */

      verify(mockResourceRequestValidator, times(1)).validateRequestStatusCode(resourceRequest.getRequestStatusCode());

      verify(mockMessages, times(1)).throwIfError();
      assertEquals(rmanager, resourceRequest.getResourceManager(),
          "Error! Resource Manager removed from Resource Request");

      assertEquals(processor, resourceRequest.getProcessor(), "Error! Processor removed from Resource Request");

    }

    @Test
    @DisplayName("Check On Handler of Resource Request Set My Responsibility Action if Processor is not selected and login user is same as Processor assigned")

    public void onUnSetResponsibilityProcessorResourceRequestActionTest() {

      SetMyResponsibilityResourceRequestContext mockContext = mock(SetMyResponsibilityResourceRequestContext.class);

      Result mockResult = mock(Result.class);

      CqnService mockCqnService = mock(CqnService.class);

      CqnSelect mockSelect = mock(CqnSelect.class);

      Messages mockMessage = mock(Messages.class);

      when(mockContext.getService()).thenReturn(mockCqnService);

      when(mockContext.getCqn()).thenReturn(mockSelect);

      when(((CqnService) mockContext.getService()).run(mockContext.getCqn())).thenReturn(mockResult);

      resourceRequest.setProcessor(email);
      resourceRequest.setResourceManager(email);
      final Optional<ResourceRequests> resourceRequestOptional = Optional.of(resourceRequest);
      when(mockResult.first(ResourceRequests.class)).thenReturn(resourceRequestOptional);

      when(mockContext.getProcessor()).thenReturn(setResponsibilityFalse);
      when(mockContext.getResourceManager()).thenReturn(setResponsibilityTrue);

      when(mockXsuaaUserInfo.getEmail()).thenReturn(email);
      // when(mockResource.getResourceId(email)).thenReturn(personUUID);
      when(mockContext.getMessages()).thenReturn(mockMessage);
      doNothing().when(mockResourceRequestValidator).validateReleaseStatusCode(REQUEST_PUBLISH);

      /*
       * Call the method and test
       */

      cut.onSetResponsibilityResourceRequestAction(mockContext);

      /*
       * However, doNothing() is Mockito's default behavior for void methods. Hence it
       * calls the void methods but does nothing hence checking the call happened once
       * or not
       *
       */

      verify(mockResourceRequestValidator, times(1)).validateRequestStatusCode(resourceRequest.getRequestStatusCode());

      verify(mockManageResourceRequestHandler, times(1)).updateResourceRequestAttributes(resourceRequest.getId(),
          ResourceRequests.PROCESSOR, null);

      verify(mockManageResourceRequestHandler, times(1)).updateResourceRequestAttributes(resourceRequest.getId(),
          ResourceRequests.RESOURCE_MANAGER, email);
      verify(mockMessages, times(1)).throwIfError();

      assertEquals(email, resourceRequest.getResourceManager(),
          "Set my responsibility for the resource request as Resource Manager is unsuccessful");

      assertNotEquals(email, resourceRequest.getProcessor(),
          "Removing my responsibility for the resource request as Processor is unsuccessfull");

    }

    @Test
    @DisplayName("Check On Handler of Resource Request Set My Responsibility Action if Processor is not selected and login user and Processor assigned is different")

    public void onUnSetResponsibilityProcessorResourceRequestActionNegativeTest() {

      SetMyResponsibilityResourceRequestContext mockContext = mock(SetMyResponsibilityResourceRequestContext.class);

      Result mockResult = mock(Result.class);

      CqnService mockCqnService = mock(CqnService.class);

      CqnSelect mockSelect = mock(CqnSelect.class);

      Messages mockMessage = mock(Messages.class);

      when(mockContext.getService()).thenReturn(mockCqnService);

      when(mockContext.getCqn()).thenReturn(mockSelect);

      when(((CqnService) mockContext.getService()).run(mockContext.getCqn())).thenReturn(mockResult);

      resourceRequest.setProcessor(processor);
      resourceRequest.setResourceManager(rmanager);
      final Optional<ResourceRequests> resourceRequestOptional = Optional.of(resourceRequest);
      when(mockResult.first(ResourceRequests.class)).thenReturn(resourceRequestOptional);

      when(mockContext.getProcessor()).thenReturn(setResponsibilityFalse);
      when(mockContext.getResourceManager()).thenReturn(setResponsibilityTrue);

      when(mockXsuaaUserInfo.getEmail()).thenReturn(email);
      // when(mockResource.getResourceId(email)).thenReturn(personUUID);
      when(mockContext.getMessages()).thenReturn(mockMessage);
      doNothing().when(mockResourceRequestValidator).validateReleaseStatusCode(REQUEST_PUBLISH);

      /*
       * Call the method and test
       */

      cut.onSetResponsibilityResourceRequestAction(mockContext);

      /*
       * However, doNothing() is Mockito's default behavior for void methods. Hence it
       * calls the void methods but does nothing hence checking the call happened once
       * or not
       *
       */

      verify(mockResourceRequestValidator, times(1)).validateRequestStatusCode(resourceRequest.getRequestStatusCode());

      verify(mockManageResourceRequestHandler, times(1)).updateResourceRequestAttributes(resourceRequest.getId(),
          ResourceRequests.RESOURCE_MANAGER, email);
      verify(mockMessages, times(1)).throwIfError();

      assertEquals(email, resourceRequest.getResourceManager(),
          "Set my responsibility for the resource request as Resource Manager is unsuccessful");

      assertEquals(processor, resourceRequest.getProcessor(), "Error! Processor removed from Resource Request");

    }

    @Test
    @DisplayName("Check On Handler of Resource Request Set My Responsibility Action if Resource Manager is not selected and login user and Resource Manager assigned is same")

    public void onUnSetResponsibilityRManagerResourceRequestActionTest() {

      SetMyResponsibilityResourceRequestContext mockContext = mock(SetMyResponsibilityResourceRequestContext.class);

      Result mockResult = mock(Result.class);

      CqnService mockCqnService = mock(CqnService.class);

      CqnSelect mockSelect = mock(CqnSelect.class);

      Messages mockMessage = mock(Messages.class);

      when(mockContext.getService()).thenReturn(mockCqnService);

      when(mockContext.getCqn()).thenReturn(mockSelect);

      when(((CqnService) mockContext.getService()).run(mockContext.getCqn())).thenReturn(mockResult);

      resourceRequest.setProcessor(email);
      resourceRequest.setResourceManager(email);

      final Optional<ResourceRequests> resourceRequestOptional = Optional.of(resourceRequest);
      when(mockResult.first(ResourceRequests.class)).thenReturn(resourceRequestOptional);

      when(mockContext.getProcessor()).thenReturn(setResponsibilityTrue);
      when(mockContext.getResourceManager()).thenReturn(setResponsibilityFalse);

      when(mockXsuaaUserInfo.getEmail()).thenReturn(email);
      // when(mockResource.getResourceId(email)).thenReturn(personUUID);
      when(mockContext.getMessages()).thenReturn(mockMessage);
      doNothing().when(mockResourceRequestValidator).validateReleaseStatusCode(REQUEST_PUBLISH);

      /*
       * Call the method and test
       */

      cut.onSetResponsibilityResourceRequestAction(mockContext);

      /*
       * However, doNothing() is Mockito's default behavior for void methods. Hence it
       * calls the void methods but does nothing hence checking the call happened once
       * or not
       *
       */

      verify(mockResourceRequestValidator, times(1)).validateRequestStatusCode(resourceRequest.getRequestStatusCode());

      verify(mockManageResourceRequestHandler, times(1)).updateResourceRequestAttributes(resourceRequest.getId(),
          ResourceRequests.PROCESSOR, email);

      verify(mockManageResourceRequestHandler, times(1)).updateResourceRequestAttributes(resourceRequest.getId(),
          ResourceRequests.RESOURCE_MANAGER, null);
      verify(mockMessages, times(1)).throwIfError();

      assertEquals(null, resourceRequest.getResourceManager(),
          "Removing my responsibility for the resource request as Resource Manager is unsuccessful");

      assertEquals(email, resourceRequest.getProcessor(),
          "Set my responsibility for the resource request as Processor is unsuccessfull");

    }

    @Test
    @DisplayName("Check On Handler of Resource Request Set My Responsibility Action if Resource Manager is not selected and login user and Resource Manager assigned is different")

    public void onUnSetResponsibilityRManagerResourceRequestActionNeativeTest() {

      SetMyResponsibilityResourceRequestContext mockContext = mock(SetMyResponsibilityResourceRequestContext.class);

      Result mockResult = mock(Result.class);

      CqnService mockCqnService = mock(CqnService.class);

      CqnSelect mockSelect = mock(CqnSelect.class);

      Messages mockMessage = mock(Messages.class);

      when(mockContext.getService()).thenReturn(mockCqnService);

      when(mockContext.getCqn()).thenReturn(mockSelect);

      when(((CqnService) mockContext.getService()).run(mockContext.getCqn())).thenReturn(mockResult);

      resourceRequest.setProcessor(processor);
      resourceRequest.setResourceManager(rmanager);
      final Optional<ResourceRequests> resourceRequestOptional = Optional.of(resourceRequest);
      when(mockResult.first(ResourceRequests.class)).thenReturn(resourceRequestOptional);

      when(mockContext.getProcessor()).thenReturn(setResponsibilityTrue);
      when(mockContext.getResourceManager()).thenReturn(setResponsibilityFalse);

      when(mockXsuaaUserInfo.getEmail()).thenReturn(email);
      // when(mockResource.getResourceId(email)).thenReturn(personUUID);
      when(mockContext.getMessages()).thenReturn(mockMessage);
      doNothing().when(mockResourceRequestValidator).validateReleaseStatusCode(REQUEST_PUBLISH);

      /*
       * Call the method and test
       */

      cut.onSetResponsibilityResourceRequestAction(mockContext);

      /*
       * However, doNothing() is Mockito's default behavior for void methods. Hence it
       * calls the void methods but does nothing hence checking the call happened once
       * or not
       *
       */

      verify(mockResourceRequestValidator, times(1)).validateRequestStatusCode(resourceRequest.getRequestStatusCode());

      verify(mockManageResourceRequestHandler, times(1)).updateResourceRequestAttributes(resourceRequest.getId(),
          ResourceRequests.PROCESSOR, email);
      verify(mockMessages, times(1)).throwIfError();

      assertEquals(rmanager, resourceRequest.getResourceManager(),
          "Error! Resource Manager removed from resource request");

      assertEquals(email, resourceRequest.getProcessor(),
          "Removing my responsibility for the resource request as Processor is unsuccessfull");

    }
  }

  @Nested
  @DisplayName("Forward test scenarios")
  class ForwardResourceRequestTest {
    @Test
    @DisplayName("Check On Handler of Resource Request Forward Action: successfully forward the Request to Processing resource organization")
    public void onForwardToRMProcessorAndProcessingCostCenterSuccess() {

      String newProcessingResourceOrg = "ORG_IN";
      List<String> userCostCenters = new ArrayList<>();
      userCostCenters.add("CCIN");

      ForwardResourceRequestContext mockContext = mock(ForwardResourceRequestContext.class);

      Result mockResult = mock(Result.class);

      CqnService mockCqnService = mock(CqnService.class);

      CqnSelect mockSelect = mock(CqnSelect.class);

      Messages mockMessage = mock(Messages.class);

      UserInfo mockUserInfo = mock(UserInfo.class);

      final Optional<ResourceRequests> resourceRequestOptional = Optional.of(resourceRequest);

      when(mockContext.getUserInfo()).thenReturn(mockUserInfo);

      when(mockUserInfo.getAttributeValues("ProcessingCostCenter")).thenReturn(userCostCenters);

      when(mockResourceRequestValidator.isUserAuthorizedForTheAction(any(), any())).thenReturn(true);

      when(mockContext.getService()).thenReturn(mockCqnService);

      when(mockContext.getCqn()).thenReturn(mockSelect);

      when(mockContext.getMessages()).thenReturn(mockMessage);

      when(((CqnService) mockContext.getService()).run(mockContext.getCqn())).thenReturn(mockResult);

      when(mockResult.first(ResourceRequests.class)).thenReturn(resourceRequestOptional);

      when(mockContext.getProcessingResourceOrgId()).thenReturn(newProcessingResourceOrg);
      doNothing().when(mockResourceRequestValidator).validateReleaseStatusCode(REQUEST_PUBLISH);

      cut.onForwardResourceRequestAction(mockContext);

      /*
       * However, doNothing() is Mockito's default behavior for void methods. Hence it
       * calls the void methods but does nothing hence checking the call happened once
       * or not
       *
       */

      verify(mockResourceRequestValidator, times(1)).validateRequestStatusCode(resourceRequest.getRequestStatusCode());

      verify(mockResourceRequestValidator, times(1)).isUserAuthorizedForTheAction(any(), any());

      verify(mockResourceRequestValidator, times(1)).validateProcessingResourceOrgUpdation(resourceRequest.getId(),
          newProcessingResourceOrg, "ORG_US");

      verify(mockManageResourceRequestHandler, times(1)).updateResourceRequestAttributes(resourceRequest.getId(),
          ResourceRequests.PROCESSING_RESOURCE_ORG_ID, newProcessingResourceOrg);
      verify(mockMessages, times(1)).throwIfError();
      assertEquals(newProcessingResourceOrg, resourceRequest.getProcessingResourceOrgId(),
          "Forwarding the resource request to Processing resource org is successful");

    }

    @Test
    @DisplayName("Resource Request Forward Action Negative test: If none of the option is selected in the Forward Dialog")
    public void onResourceRequestForwardActionNegativeTest() {
      ForwardResourceRequestContext mockContext = mock(ForwardResourceRequestContext.class);

      Result mockResult = mock(Result.class);

      CqnService mockCqnService = mock(CqnService.class);

      CqnSelect mockSelect = mock(CqnSelect.class);

      Messages mockMessage = mock(Messages.class);

      final Optional<ResourceRequests> resourceRequestOptional = Optional.of(resourceRequest);

      when(mockContext.getService()).thenReturn(mockCqnService);

      when(mockContext.getCqn()).thenReturn(mockSelect);

      when(mockContext.getMessages()).thenReturn(mockMessage);

      when(((CqnService) mockContext.getService()).run(mockContext.getCqn())).thenReturn(mockResult);

      when(mockResult.first(ResourceRequests.class)).thenReturn(resourceRequestOptional);

      when(mockContext.getProcessingResourceOrgId()).thenReturn("");
      doNothing().when(mockResourceRequestValidator).validateReleaseStatusCode(REQUEST_PUBLISH);

      verify(mockMessages, times(0)).throwIfError();

      ServiceException exception = assertThrows(ServiceException.class,
          () -> cut.onForwardResourceRequestAction(mockContext));

      assertAll(() -> assertEquals(ErrorStatuses.PRECONDITION_FAILED, exception.getErrorStatus()),
          () -> assertEquals((MessageKeys.INVALID_RESOURCEORGANIZATION), exception.getMessage()));
    }

    @Test
    @DisplayName("Resource Request Forward Action Authorization check: Fails to forward resource request to unauthorized resource organization")
    public void forwardToUnAuthorizedResourceOrganizationFails() {
      ForwardResourceRequestContext mockContext = mock(ForwardResourceRequestContext.class);

      String newProcessingResourceOrg = "ORG_IN";
      List<String> resOrgs = new ArrayList<String>() {
        {
          add("RORG1");
        }
      };

      Result mockResult = mock(Result.class);

      CqnService mockCqnService = mock(CqnService.class);

      CqnSelect mockSelect = mock(CqnSelect.class);

      Messages mockMessage = mock(Messages.class);

      UserInfo mockUserInfo = mock(UserInfo.class);

      final Optional<ResourceRequests> resourceRequestOptional = Optional.of(resourceRequest);

      when(mockContext.getUserInfo()).thenReturn(mockUserInfo);

      when(mockContext.getService()).thenReturn(mockCqnService);

      when(mockContext.getCqn()).thenReturn(mockSelect);

      when(mockContext.getMessages()).thenReturn(mockMessage);

      when(((CqnService) mockContext.getService()).run(mockContext.getCqn())).thenReturn(mockResult);

      when(mockResult.first(ResourceRequests.class)).thenReturn(resourceRequestOptional);

      when(mockContext.getProcessingResourceOrgId()).thenReturn(newProcessingResourceOrg);

      when(mockUserInfo.getAttributeValues("ProcessingResourceOrganization")).thenReturn(resOrgs);
      doNothing().when(mockResourceRequestValidator).validateReleaseStatusCode(REQUEST_PUBLISH);

      when(mockResourceRequestValidator.isUserAuthorizedForTheAction(resOrgs.stream().collect(Collectors.toList()),
          newProcessingResourceOrg)).thenReturn(false);

      verify(mockMessages, times(0)).throwIfError();

      ServiceException exception = assertThrows(ServiceException.class,
          () -> cut.onForwardResourceRequestAction(mockContext));

      assertAll(() -> assertEquals(ErrorStatuses.UNAUTHORIZED, exception.getErrorStatus()),
          () -> assertEquals((MessageKeys.NOT_AUTHORIZED_TO_FORWARD), exception.getMessage()));
    }
  }

  @Nested
  @DisplayName("Resource Request status resolve")
  class ResourceRequestStatusResolve {
    @Test
    @DisplayName("Check On Handler of Resource Request Resolve Action")
    public void onResourceRequestStatusResolveTest() {

      ResolveResourceRequestContext mockContext = mock(ResolveResourceRequestContext.class);

      Result mockResult = mock(Result.class);

      CqnService mockCqnService = mock(CqnService.class);

      CqnSelect mockSelect = mock(CqnSelect.class);

      Messages mockMessage = mock(Messages.class);

      final Optional<ResourceRequests> resourceRequestOptional = Optional.of(resourceRequest);

      when(mockContext.getService()).thenReturn(mockCqnService);

      when(mockContext.getCqn()).thenReturn(mockSelect);

      when(((CqnService) mockContext.getService()).run(mockContext.getCqn())).thenReturn(mockResult);
      when(mockResult.rowCount()).thenReturn((long) 1);
      when(mockResult.first(ResourceRequests.class)).thenReturn(resourceRequestOptional);
      when(mockContext.getMessages()).thenReturn(mockMessage);
      doNothing().when(mockResourceRequestValidator).validateReleaseStatusCode(REQUEST_PUBLISH);

      /*
       * Call the method and test
       */

      cut.onResourceRequestStatusResolve(mockContext);

      /*
       * However, doNothing() is Mockito's default behavior for void methods. Hence it
       * calls the void methods but does nothing hence checking the call happened once
       * or not
       *
       */

      verify(mockManageResourceRequestHandler, times(1)).updateResourceRequestStatus(resourceRequest.getId(),
          ResourceRequests.REQUEST_STATUS_CODE, resourceRequest.getRequestStatusCode());
      verify(mockMessages, times(1)).throwIfError();
      assertEquals(Constants.REQUEST_RESOLVE, resourceRequest.getRequestStatusCode(), "Status not set to resolve");
      assertEquals(Boolean.TRUE, resourceRequest.getIsResolved(), "Resolve flag not set to true");

    }

    @Test
    @DisplayName("Unauthorized user tries to resolve resource request")
    public void onResourceRequestStatusResolveByUnAuthorizedUserTest() {

      /*
       * Mock and setup resource request data
       *
       */
      ResolveResourceRequestContext mockContext = mock(ResolveResourceRequestContext.class);

      Result mockResult = mock(Result.class);

      CqnService mockCqnService = mock(CqnService.class);

      CqnSelect mockSelect = mock(CqnSelect.class);

      final Optional<ResourceRequests> resourceRequestOptional = Optional.of(resourceRequest);

      when(mockContext.getService()).thenReturn(mockCqnService);

      when(mockContext.getCqn()).thenReturn(mockSelect);

      when(((CqnService) mockContext.getService()).run(mockContext.getCqn())).thenReturn(mockResult);

      when(mockResult.first(ResourceRequests.class)).thenReturn(resourceRequestOptional);

      when(mockResult.rowCount()).thenReturn((long) 0);

      when(mockContext.getMessages()).thenReturn(mockMessages);
      doNothing().when(mockResourceRequestValidator).validateReleaseStatusCode(REQUEST_PUBLISH);

      /*
       * Call the method and test
       */

      cut.onResourceRequestStatusResolve(mockContext);

      /*
       * However, doNothing() is Mockito's default behavior for void methods. Hence it
       * calls the void methods but does nothing hence checking the call happened once
       * or not
       *
       */
      verify(mockMessages, times(1)).throwIfError();
      verify(mockMessages, times(1)).error(MessageKeys.NOT_AUTHORIZED_TO_RESOLVE);

    }
  }
}
