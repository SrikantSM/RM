package com.sap.c4p.rm.resourcerequest.handlers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.HashMap;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import com.sap.cds.Struct;
import com.sap.cds.ql.cqn.AnalysisResult;
import com.sap.cds.ql.cqn.CqnAnalyzer;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.reflect.CdsModel;
import com.sap.cds.services.cds.CdsCreateEventContext;
import com.sap.cds.services.cds.CdsDeleteEventContext;
import com.sap.cds.services.cds.CdsUpdateEventContext;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.request.UserInfo;

import com.sap.c4p.rm.resourcerequest.actions.utils.CqnAnalyzerWrapper;
import com.sap.c4p.rm.resourcerequest.exceptions.ExceptionUtility;
import com.sap.c4p.rm.resourcerequest.helpers.ResourceRequestHelper;
import com.sap.c4p.rm.resourcerequest.utils.DisplayIDGenerator;
import com.sap.c4p.rm.resourcerequest.validations.ReferenceObjectPublicApiValidator;
import com.sap.c4p.rm.resourcerequest.validations.ResourceRequestPublicApiValidator;
import com.sap.c4p.rm.resourcerequest.validations.ResourceRequestValidator;

import manageresourcerequestservice.ResourceRequests;

@DisplayName("Unit test for Exposed Resource Request Service Handler class")
public class ResourceRequestServiceHandlerTest {

  /*
   * Class under test
   *
   */
  private static ResourceRequestServiceHandler cut;

  /*
   * mock object
   *
   */
  private DisplayIDGenerator mockDisplayIDGenerator;
  private ResourceRequestValidator mockResourceRequestValidator;
  private ResourceRequestHelper mockResourceRequestHelper;
  private ExceptionUtility mockExceptionUtility;
  private CqnAnalyzerWrapper mockCqnAnalyzerWrapper;

  private ResourceRequestPublicApiValidator mockResourceRequestPublicApiValidator;

  private ReferenceObjectPublicApiValidator mockReferenceObjectPublicApiValidator;

  /*
   * Mock resource request object
   *
   */

  @BeforeEach
  public void setUp() {

    // mockCqnAnalyzerWrapper = mock(CdsModel.class);
    mockExceptionUtility = mock(ExceptionUtility.class);
    mockDisplayIDGenerator = mock(DisplayIDGenerator.class);
    mockResourceRequestValidator = mock(ResourceRequestValidator.class);
    mockResourceRequestHelper = mock(ResourceRequestHelper.class);
    mockCqnAnalyzerWrapper = mock(CqnAnalyzerWrapper.class);
    mockResourceRequestPublicApiValidator = mock(ResourceRequestPublicApiValidator.class);
    mockReferenceObjectPublicApiValidator = mock(ReferenceObjectPublicApiValidator.class);

    cut = new ResourceRequestServiceHandler(mockDisplayIDGenerator, mockResourceRequestValidator,
        mockResourceRequestHelper, mockExceptionUtility, mockCqnAnalyzerWrapper, mockResourceRequestPublicApiValidator,
        mockReferenceObjectPublicApiValidator);
  }

  @Nested
  @DisplayName("Before Create Handler Test")
  class BeforeCreate {
    @Test
    @DisplayName("Check method calls when Requested Resource Org ID is not passed.")
    public void beforeResourceRequestCreateWithoutRequestedResourceOrgId() {

      final resourcerequestservice.ResourceRequests resourceRequest = Struct
          .create(resourcerequestservice.ResourceRequests.class);
      CdsCreateEventContext mockContext = mock(CdsCreateEventContext.class);

      doNothing().when(mockResourceRequestValidator).validateResourceRequestPropertyApi(resourceRequest,
          CqnService.EVENT_CREATE);
      doNothing().when(mockExceptionUtility).throwExceptionIfErrorWithGenericMessage();
      doNothing().when(mockResourceRequestPublicApiValidator).validateForInjection(resourceRequest);

      cut.beforeResourceRequestCreate(resourceRequest, mockContext);

      verify(mockResourceRequestValidator, times(1)).validateResourceRequestPropertyApi(resourceRequest,
          CqnService.EVENT_CREATE);
      verify(mockExceptionUtility, times(1)).throwExceptionIfErrorWithGenericMessage();
      verify(mockResourceRequestPublicApiValidator, times(1)).validateForInjection(resourceRequest);
    }
  }

  @Nested
  @DisplayName("After Create Handler Test")
  class AfterCreate {
    @Test
    @DisplayName("Check method calls.")
    public void afterResourceRequestCreate() {

      final resourcerequestservice.ResourceRequests resourceRequest = Struct
          .create(resourcerequestservice.ResourceRequests.class);
      final ResourceRequests resourceRequests = Struct.create(ResourceRequests.class);
      String displayID = "displayID";
      final ResourceRequestServiceHandler spyOfCut = spy(cut);

      doReturn(resourceRequests).when(mockResourceRequestHelper).getStructureWithDefaultValues();
      doReturn(displayID).when(mockDisplayIDGenerator).getDisplayId();
      doNothing().when(mockResourceRequestValidator).validateDisplayId(displayID,
          resourcerequestservice.ResourceRequests_.CDS_NAME);
      doNothing().when(mockResourceRequestHelper).fillValuesPassedByUser(resourceRequests, resourceRequest);
      doNothing().when(mockResourceRequestHelper).fillResourceRequestDerivedValues(resourceRequests);
      doNothing().when(mockResourceRequestHelper).updateDbData(resourceRequests);
      doNothing().when(mockResourceRequestHelper).modifyCapacitiesForTotalEffortDistributionType(resourceRequests);
      doNothing().when(mockExceptionUtility).throwExceptionIfErrorWithGenericMessage();

      spyOfCut.afterResourceRequestCreate(resourceRequest);

      verify(mockResourceRequestHelper, times(1)).getStructureWithDefaultValues();
      assertEquals(false, resourceRequests.getIsS4Cloud());
      assertEquals(displayID, resourceRequest.getDisplayId());
      verify(mockResourceRequestValidator, times(1)).validateDisplayId(displayID,
          resourcerequestservice.ResourceRequests_.CDS_NAME);
      verify(mockResourceRequestHelper, times(1)).fillValuesPassedByUser(resourceRequests, resourceRequest);
      verify(mockResourceRequestHelper, times(1)).fillResourceRequestDerivedValues(resourceRequests);
      verify(mockResourceRequestHelper, times(1)).updateDbData(resourceRequests);
      verify(mockResourceRequestHelper, times(1)).modifyCapacitiesForTotalEffortDistributionType(resourceRequests);
      verify(mockExceptionUtility, times(1)).throwExceptionIfErrorWithGenericMessage();

    }
  }

  @Nested
  @DisplayName("Before Update Handler Test")
  class CheckBeforeUpdate {

    @Test
    @DisplayName("Before resource request update")
    public void onBeforeResourceRequestUpdate() {

      resourcerequestservice.ResourceRequests mockResourceRequest = Struct
          .create(resourcerequestservice.ResourceRequests.class);
      mockResourceRequest.setId("450a2453-ec0a-4a85-8247-94c39b9bdd67");
      mockResourceRequest.setName("Updated Name");
      CdsModel mockCdsModel = mock(CdsModel.class);
      CqnAnalyzer mockCqnAnalyzer = CqnAnalyzer.create(mockCdsModel);
      CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class);
      UserInfo mockUserInfo = mock(UserInfo.class);

      CqnUpdate mockCqnUpdate = mock(CqnUpdate.class);
      AnalysisResult mockAnalysisResult = mock(AnalysisResult.class);
      HashMap<String, Object> map = new HashMap<>();
      when(mockContext.getModel()).thenReturn(mockCdsModel);
      when(mockCqnAnalyzerWrapper.create(mockCdsModel)).thenReturn(mockCqnAnalyzer);
      when(mockContext.getCqn()).thenReturn(mockCqnUpdate);
      map.put(resourcerequestservice.ResourceRequests.ID, mockResourceRequest.getId());

      when(mockCqnAnalyzerWrapper.analyze(mockCqnAnalyzer, mockCqnUpdate)).thenReturn(mockAnalysisResult);
      when(mockAnalysisResult.targetKeys()).thenReturn(map);
      when(mockContext.getUserInfo()).thenReturn(mockUserInfo);

      final ResourceRequestServiceHandler spyOfCut = spy(cut);

      doNothing().when(mockResourceRequestValidator).checkResourceRequestDeleteUpdate(mockResourceRequest.getId(),
          CqnService.EVENT_UPDATE);
      doNothing().when(mockResourceRequestValidator).validateResourceRequestPropertyApi(mockResourceRequest,
          CqnService.EVENT_UPDATE);
      doNothing().when(mockExceptionUtility).throwExceptionIfErrorWithGenericMessage();
      doNothing().when(mockResourceRequestPublicApiValidator).validateForInjection(mockResourceRequest);

      spyOfCut.beforeResourceRequestUpdate(mockResourceRequest, mockContext);

      verify(mockResourceRequestValidator, times(1)).checkResourceRequestDeleteUpdate(mockResourceRequest.getId(),
          CqnService.EVENT_UPDATE);

      verify(mockResourceRequestValidator, times(1)).validateResourceRequestPropertyApi(mockResourceRequest,
          CqnService.EVENT_UPDATE);

      verify(mockExceptionUtility, times(1)).throwExceptionIfErrorWithGenericMessage();
      verify(mockResourceRequestPublicApiValidator, times(1)).validateForInjection(mockResourceRequest);

    }
  }

  @Nested
  @DisplayName("Before Delete Handler Test")

  class CheckBeforeDelete {

    @Test
    @DisplayName("Before Resource Request Delete")

    public void onBeforeResourceRequestDelete() {

      String mockResourceRequestId = "450a2453-ec0a-4a85-8247-94c39b9bdd67";

      CdsModel mockCdsModel = mock(CdsModel.class);
      CqnAnalyzer mockCqnAnalyzer = CqnAnalyzer.create(mockCdsModel);
      CdsDeleteEventContext mockContext = mock(CdsDeleteEventContext.class);
      UserInfo mockUserInfo = mock(UserInfo.class);

      CqnDelete mockCqnDelete = mock(CqnDelete.class);
      AnalysisResult mockAnalysisResult = mock(AnalysisResult.class);
      HashMap<String, Object> map = new HashMap<>();
      when(mockContext.getModel()).thenReturn(mockCdsModel);
      when(mockCqnAnalyzerWrapper.create(mockCdsModel)).thenReturn(mockCqnAnalyzer);
      when(mockContext.getCqn()).thenReturn(mockCqnDelete);
      map.put(resourcerequestservice.ResourceRequests.ID, mockResourceRequestId);

      when(mockCqnAnalyzerWrapper.analyze(mockCqnAnalyzer, mockCqnDelete)).thenReturn(mockAnalysisResult);
      when(mockAnalysisResult.targetKeys()).thenReturn(map);
      when(mockContext.getUserInfo()).thenReturn(mockUserInfo);

      final ResourceRequestServiceHandler spyOfCut = spy(cut);

      doNothing().when(mockResourceRequestValidator).checkResourceRequestDeleteUpdate(mockResourceRequestId,
          CqnService.EVENT_DELETE);
      doNothing().when(mockExceptionUtility).throwExceptionIfErrorWithGenericMessage();

      spyOfCut.beforeResourceRequestDelete(mockContext);

      verify(mockResourceRequestValidator, times(1)).checkResourceRequestDeleteUpdate(mockResourceRequestId,
          CqnService.EVENT_DELETE);

      verify(mockExceptionUtility, times(1)).throwExceptionIfErrorWithGenericMessage();

    }
  }

  @Nested
  @DisplayName("Before Reference Object Create")
  class BeforeRefObjCreate {
    @Test
    @DisplayName("Validations before create of ReferenceObject")
    public void validateRefObjBeforeCreate() {

      final resourcerequestservice.ReferenceObjects refObj = Struct
          .create(resourcerequestservice.ReferenceObjects.class);
      refObj.setDisplayId("Project1");
      refObj.setName("Project Name");
      refObj.setTypeCode(1);
      refObj.setStartDate(LocalDate.parse("2023-02-02"));
      refObj.setEndDate(LocalDate.parse("2023-03-02"));
      final ResourceRequestServiceHandler spyOfCut = spy(cut);

      spyOfCut.beforeReferenceObjectCreate(refObj);

      verify(mockReferenceObjectPublicApiValidator, times(1)).validateReferenceObjectPropertyApi(refObj,
          CqnService.EVENT_CREATE);
      verify(mockExceptionUtility, times(1)).throwExceptionIfErrorWithGenericMessage();

    }
  }

  @Nested
  @DisplayName("Before Reference Object Update Test")
  class ValidateBeforeRefObjUpdate {
    @Test
    @DisplayName("Validations before update of ReferenceObject")
    public void validateRefObjBeforeUpdateTest() {

      String mockReferenceObjectId = "450a2453-ec0a-4a85-8247-94c39b9bdd67";
      resourcerequestservice.ReferenceObjects mockReferenceObject = Struct
          .create(resourcerequestservice.ReferenceObjects.class);

      CdsModel mockCdsModel = mock(CdsModel.class);
      CqnAnalyzer mockCqnAnalyzer = CqnAnalyzer.create(mockCdsModel);
      CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class);
      UserInfo mockUserInfo = mock(UserInfo.class);

      CqnUpdate mockCqnUpdate = mock(CqnUpdate.class);
      AnalysisResult mockAnalysisResult = mock(AnalysisResult.class);
      HashMap<String, Object> map = new HashMap<>();
      when(mockContext.getModel()).thenReturn(mockCdsModel);
      when(mockCqnAnalyzerWrapper.create(mockCdsModel)).thenReturn(mockCqnAnalyzer);
      when(mockContext.getCqn()).thenReturn(mockCqnUpdate);
      map.put(resourcerequestservice.ReferenceObjects.ID, mockReferenceObjectId);

      when(mockCqnAnalyzerWrapper.analyze(mockCqnAnalyzer, mockCqnUpdate)).thenReturn(mockAnalysisResult);
      when(mockAnalysisResult.targetKeys()).thenReturn(map);
      when(mockContext.getUserInfo()).thenReturn(mockUserInfo);

      final ResourceRequestServiceHandler spyOfCut = spy(cut);

      doNothing().when(mockReferenceObjectPublicApiValidator).validateReferenceObjectPropertyApi(mockReferenceObject,
          CqnService.EVENT_UPDATE);
      doNothing().when(mockExceptionUtility).throwExceptionIfErrorWithGenericMessage();

      spyOfCut.beforeReferenceObjectUpdate(mockReferenceObject, mockContext);

      verify(mockReferenceObjectPublicApiValidator, times(1)).validateReferenceObjectPropertyApi(mockReferenceObject,
          CqnService.EVENT_UPDATE);
      verify(mockExceptionUtility, times(1)).throwExceptionIfErrorWithGenericMessage();

    }
  }

  @Nested
  @DisplayName("Before Reference Object Delete Test")
  class ValidateBeforeRefObjDelete {
    @Test
    @DisplayName("Validations before delete of ReferenceObject")
    public void validateRefObjBeforeDeleteTest() {

      String mockReferenceObjectId = "450a2453-ec0a-4a85-8247-94c39b9bdd67";

      CdsModel mockCdsModel = mock(CdsModel.class);
      CqnAnalyzer mockCqnAnalyzer = CqnAnalyzer.create(mockCdsModel);
      CdsDeleteEventContext mockContext = mock(CdsDeleteEventContext.class);
      UserInfo mockUserInfo = mock(UserInfo.class);

      CqnDelete mockCqnDelete = mock(CqnDelete.class);
      AnalysisResult mockAnalysisResult = mock(AnalysisResult.class);
      HashMap<String, Object> map = new HashMap<>();
      when(mockContext.getModel()).thenReturn(mockCdsModel);
      when(mockCqnAnalyzerWrapper.create(mockCdsModel)).thenReturn(mockCqnAnalyzer);
      when(mockContext.getCqn()).thenReturn(mockCqnDelete);
      map.put(resourcerequestservice.ReferenceObjects.ID, mockReferenceObjectId);

      when(mockCqnAnalyzerWrapper.analyze(mockCqnAnalyzer, mockCqnDelete)).thenReturn(mockAnalysisResult);
      when(mockAnalysisResult.targetKeys()).thenReturn(map);
      when(mockContext.getUserInfo()).thenReturn(mockUserInfo);

      final ResourceRequestServiceHandler spyOfCut = spy(cut);

      doNothing().when(mockReferenceObjectPublicApiValidator).integrityCheckForRefObject(mockReferenceObjectId);
      doNothing().when(mockReferenceObjectPublicApiValidator).validateRefObjDeletion(mockReferenceObjectId);
      doNothing().when(mockExceptionUtility).throwExceptionIfErrorWithGenericMessage();

      spyOfCut.beforeReferenceObjectDelete(mockContext);

      verify(mockReferenceObjectPublicApiValidator, times(1)).validateRefObjDeletion(mockReferenceObjectId);
      verify(mockReferenceObjectPublicApiValidator, times(1)).integrityCheckForRefObject(mockReferenceObjectId);
      verify(mockExceptionUtility, times(1)).throwExceptionIfErrorWithGenericMessage();

    }
  }

}
