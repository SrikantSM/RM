package com.sap.c4p.rm.resourcerequest.handlers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import com.sap.cds.Result;
import com.sap.cds.Struct;
import com.sap.cds.ql.cqn.AnalysisResult;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnStructuredTypeRef;
import com.sap.cds.services.draft.DraftCancelEventContext;
import com.sap.cds.services.draft.DraftNewEventContext;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.messages.Messages;

import com.sap.c4p.rm.resourcerequest.actions.utils.CqnAnalyzerWrapper;
import com.sap.c4p.rm.resourcerequest.gen.MessageKeys;
import com.sap.c4p.rm.resourcerequest.utils.Constants;

import manageresourcerequestservice.ResourceRequestCapacities;

@DisplayName("Unit test for Capacity Requirements Handler class")
public class CapacityRequirementsHandlerTest {

  /*
   * Class under test
   *
   */
  private static CapacityRequirementsHandler cut;

  /*
   * mock object
   *
   */
  private Messages messages;
  private DraftService mockDraftService;
  private CqnAnalyzerWrapper cqnAnalyzerWrapper;
  private Result mockResult;

  @BeforeEach
  public void setUp() {

    messages = mock(Messages.class, RETURNS_DEEP_STUBS);
    mockDraftService = mock(DraftService.class);
    mockResult = mock(Result.class);
    cqnAnalyzerWrapper = mock(CqnAnalyzerWrapper.class);
    cut = new CapacityRequirementsHandler(messages, mockDraftService, cqnAnalyzerWrapper);

  }

  @Nested
  class BeforeCreate {

    @Test
    @DisplayName("test beforeResourceRequestCapacityDraftCreation Success.")
    public void beforeResourceRequestCapacityDraftCreationSucess() {

      /* Mock Data */
      final ResourceRequestCapacities resourceRequestCapacity = Struct.create(ResourceRequestCapacities.class);
      final DraftNewEventContext mockContext = mock(DraftNewEventContext.class);
      resourceRequestCapacity.setStartDate(LocalDate.of(2020, 1, 1));
      resourceRequestCapacity.setEndDate(LocalDate.of(2020, 1, 1));
      resourceRequestCapacity.setRequestedCapacity(new BigDecimal(10));
      final CapacityRequirementsHandler capacityHandlerSpy = spy(cut);
      doNothing().when(capacityHandlerSpy).fillRequestedCapacityInMinutes(resourceRequestCapacity);
      doNothing().when(capacityHandlerSpy).fillStartTime(resourceRequestCapacity);
      doNothing().when(capacityHandlerSpy).fillEndTime(resourceRequestCapacity);
      doReturn("Resource request ID").when(capacityHandlerSpy).getIDfromContext(mockContext);

      // Function under test
      capacityHandlerSpy.beforeResourceRequestCapacityDraftCreation(resourceRequestCapacity, mockContext);
      // Assertions
      verify(capacityHandlerSpy, times(1)).fillRequestedCapacityInMinutes(resourceRequestCapacity);
      verify(capacityHandlerSpy, times(1)).fillStartTime(resourceRequestCapacity);
      verify(capacityHandlerSpy, times(1)).fillEndTime(resourceRequestCapacity);
      verify(capacityHandlerSpy, times(1)).getIDfromContext(mockContext);
      assertEquals(Constants.UOM, resourceRequestCapacity.getRequestedUnit());
    }

    @Test
    @DisplayName("test beforeResourceRequestCapacityDraftCreation failure when requested capacity not passed.")
    public void beforeResourceRequestCapacityDraftCreationMissingCapacity() {

      /* Mock Data */
      final ResourceRequestCapacities resourceRequestCapacity = Struct.create(ResourceRequestCapacities.class);
      final DraftNewEventContext mockContext = mock(DraftNewEventContext.class);
      final CapacityRequirementsHandler capacityHandlerSpy = spy(cut);
      resourceRequestCapacity.setStartDate(LocalDate.of(2020, 1, 1));
      resourceRequestCapacity.setEndDate(LocalDate.of(2020, 1, 1));

      // Function under test
      capacityHandlerSpy.beforeResourceRequestCapacityDraftCreation(resourceRequestCapacity, mockContext);
      // Assertions
      verify(messages, times(1)).error(MessageKeys.MANDATORY_FIELDS);
    }

    @Test
    @DisplayName("test beforeResourceRequestCapacityDraftCreation failure when start date not passed.")
    public void beforeResourceRequestCapacityDraftCreationMissingStartDate() {

      /* Mock Data */
      final ResourceRequestCapacities resourceRequestCapacity = Struct.create(ResourceRequestCapacities.class);
      final DraftNewEventContext mockContext = mock(DraftNewEventContext.class);
      final CapacityRequirementsHandler capacityHandlerSpy = spy(cut);
      resourceRequestCapacity.setEndDate(LocalDate.of(2020, 1, 1));
      resourceRequestCapacity.setRequestedCapacity(new BigDecimal(10));

      // Function under test
      capacityHandlerSpy.beforeResourceRequestCapacityDraftCreation(resourceRequestCapacity, mockContext);
      // Assertions
      verify(messages, times(1)).error(MessageKeys.MANDATORY_FIELDS);
    }

    @Test
    @DisplayName("test beforeResourceRequestCapacityDraftCreation failure when end date not passed.")
    public void beforeResourceRequestCapacityDraftCreationMissingEndDate() {

      /* Mock Data */
      final ResourceRequestCapacities resourceRequestCapacity = Struct.create(ResourceRequestCapacities.class);
      final DraftNewEventContext mockContext = mock(DraftNewEventContext.class);
      final CapacityRequirementsHandler capacityHandlerSpy = spy(cut);
      resourceRequestCapacity.setStartDate(LocalDate.of(2020, 1, 1));
      resourceRequestCapacity.setRequestedCapacity(new BigDecimal(10));

      // Function under test
      capacityHandlerSpy.beforeResourceRequestCapacityDraftCreation(resourceRequestCapacity, mockContext);
      // Assertions
      verify(messages, times(1)).error(MessageKeys.MANDATORY_FIELDS);
    }
  }

  @Nested
  class AfterCreate {

    @Test
    @DisplayName("test afterResourceRequestCapacityDraftCreation")
    public void afterResourceRequestCapacityDraftCreationTest() {
      final ResourceRequestCapacities resourceRequestCapacity = Struct.create(ResourceRequestCapacities.class);
      final DraftNewEventContext mockContext = mock(DraftNewEventContext.class);
      final CapacityRequirementsHandler capacityHandlerSpy = spy(cut);

      doNothing().when(capacityHandlerSpy).updateResourceRequestWithCapacity(any());
      // Function under test
      capacityHandlerSpy.afterResourceRequestCapacityDraftCreation(resourceRequestCapacity, mockContext);
      // Assertions
      verify(capacityHandlerSpy, times(1)).updateResourceRequestWithCapacity(any());
    }
  }

  @Nested
  class AfterUpdate {

    @Test
    @DisplayName("test afterResourceRequestCapacityDraftUpdation - parent is updated when there is change in requestedCapacity")
    public void afterResourceRequestCapacityDraftUpdationParentUpdateTest() {
      List<ResourceRequestCapacities> resourceRequestCapacities = new ArrayList<>();
      final ResourceRequestCapacities resourceRequestCapacity = Struct.create(ResourceRequestCapacities.class);
      resourceRequestCapacity.setRequestedCapacity(BigDecimal.valueOf(10));
      resourceRequestCapacities.add(resourceRequestCapacity);
      final ResourceRequestCapacities existingResourceRequestCapacity = Struct.create(ResourceRequestCapacities.class);
      existingResourceRequestCapacity.setRequestedCapacity(BigDecimal.valueOf(20));
      final DraftNewEventContext mockContext = mock(DraftNewEventContext.class);
      final CapacityRequirementsHandler capacityHandlerSpy = spy(cut);

      doReturn(existingResourceRequestCapacity).when(capacityHandlerSpy).getResourceRequestCapacityFromId(any());
      doNothing().when(capacityHandlerSpy).updateResourceRequestWithCapacity(any());
      // Function under test
      capacityHandlerSpy.afterResourceRequestCapacityDraftUpdation(resourceRequestCapacities, mockContext);
      // Assertions
      verify(capacityHandlerSpy, times(1)).getResourceRequestCapacityFromId(any());
      verify(capacityHandlerSpy, times(1)).updateResourceRequestWithCapacity(any());
    }

    @Test
    @DisplayName("test afterResourceRequestCapacityDraftUpdation - parent is not updated when there is change in requestedCapacity")
    public void afterResourceRequestCapacityDraftUpdationNoParentUpdateTest() {
      List<ResourceRequestCapacities> resourceRequestCapacities = new ArrayList<>();
      final ResourceRequestCapacities resourceRequestCapacity = Struct.create(ResourceRequestCapacities.class);
      resourceRequestCapacity.setRequestedCapacity(BigDecimal.valueOf(10));
      resourceRequestCapacities.add(resourceRequestCapacity);
      final ResourceRequestCapacities existingResourceRequestCapacity = Struct.create(ResourceRequestCapacities.class);
      existingResourceRequestCapacity.setRequestedCapacity(BigDecimal.valueOf(10));
      final DraftNewEventContext mockContext = mock(DraftNewEventContext.class);
      final CapacityRequirementsHandler capacityHandlerSpy = spy(cut);

      doReturn(existingResourceRequestCapacity).when(capacityHandlerSpy).getResourceRequestCapacityFromId(any());
      doNothing().when(capacityHandlerSpy).updateResourceRequestWithCapacity(any());
      // Function under test
      capacityHandlerSpy.afterResourceRequestCapacityDraftUpdation(resourceRequestCapacities, mockContext);
      // Assertions
      verify(capacityHandlerSpy, times(1)).getResourceRequestCapacityFromId(any());
      verify(capacityHandlerSpy, times(0)).updateResourceRequestWithCapacity(any());
    }
  }

  @Nested
  class BeforeUpdate {

    @Test
    @DisplayName("test beforeResourceRequestCapacityDraftUpdate capacity increased.")
    public void beforeResourceRequestCapacityDraftUpdateCapacityIncreased() {

      /* Mock Data */
      List<ResourceRequestCapacities> resourceRequestCapacities = new ArrayList<>();
      final ResourceRequestCapacities resourceRequestCapacity = Struct.create(ResourceRequestCapacities.class);
      resourceRequestCapacity.setRequestedCapacity(new BigDecimal(20));
      resourceRequestCapacity.setId("capacity ID");
      resourceRequestCapacities.add(resourceRequestCapacity);
      final CapacityRequirementsHandler capacityHandlerSpy = spy(cut);

      doNothing().when(capacityHandlerSpy).fillRequestedCapacityInMinutes(resourceRequestCapacity);

      // Function under test
      capacityHandlerSpy.beforeResourceRequestCapacityDraftUpdate(resourceRequestCapacities);
      // Assertions
      verify(capacityHandlerSpy, times(1)).fillRequestedCapacityInMinutes(resourceRequestCapacity);
    }

    @Test
    @DisplayName("test beforeResourceRequestCapacityDraftUpdate capacity decreased.")
    public void beforeResourceRequestCapacityDraftUpdateCapacityDecreased() {

      /* Mock Data */
      List<ResourceRequestCapacities> resourceRequestCapacities = new ArrayList<>();
      final ResourceRequestCapacities resourceRequestCapacity = Struct.create(ResourceRequestCapacities.class);
      resourceRequestCapacity.setRequestedCapacity(new BigDecimal(10));
      resourceRequestCapacity.setId("capacity ID");
      resourceRequestCapacities.add(resourceRequestCapacity);
      final CapacityRequirementsHandler capacityHandlerSpy = spy(cut);

      doNothing().when(capacityHandlerSpy).fillRequestedCapacityInMinutes(resourceRequestCapacity);

      // Function under test
      capacityHandlerSpy.beforeResourceRequestCapacityDraftUpdate(resourceRequestCapacities);
      // Assertions
      verify(capacityHandlerSpy, times(1)).fillRequestedCapacityInMinutes(resourceRequestCapacity);
    }

    @Test
    @DisplayName("test beforeResourceRequestCapacityDraftUpdate start date changed.")
    public void beforeResourceRequestCapacityDraftUpdateStartDateUpdated() {
      /* Mock Data */
      List<ResourceRequestCapacities> resourceRequestCapacities = new ArrayList<>();
      final ResourceRequestCapacities resourceRequestCapacity = Struct.create(ResourceRequestCapacities.class);
      resourceRequestCapacity.setStartDate(LocalDate.of(2020, 1, 1));
      resourceRequestCapacities.add(resourceRequestCapacity);
      final CapacityRequirementsHandler capacityHandlerSpy = spy(cut);
      doNothing().when(capacityHandlerSpy).fillStartTime(resourceRequestCapacity);
      // Function under test
      capacityHandlerSpy.beforeResourceRequestCapacityDraftUpdate(resourceRequestCapacities);
      // Assertions
      verify(capacityHandlerSpy, times(1)).fillStartTime(resourceRequestCapacity);
    }

    @Test
    @DisplayName("test beforeResourceRequestCapacityDraftUpdate end date changed.")
    public void beforeResourceRequestCapacityDraftUpdateEndDateUpdated() {
      /* Mock Data */
      List<ResourceRequestCapacities> resourceRequestCapacities = new ArrayList<>();
      final ResourceRequestCapacities resourceRequestCapacity = Struct.create(ResourceRequestCapacities.class);
      resourceRequestCapacity.setEndDate(LocalDate.of(2020, 1, 1));
      resourceRequestCapacities.add(resourceRequestCapacity);
      final CapacityRequirementsHandler capacityHandlerSpy = spy(cut);
      doNothing().when(capacityHandlerSpy).fillEndTime(resourceRequestCapacity);
      // Function under test
      capacityHandlerSpy.beforeResourceRequestCapacityDraftUpdate(resourceRequestCapacities);
      // Assertions
      verify(capacityHandlerSpy, times(1)).fillEndTime(resourceRequestCapacity);
    }
  }

  @Nested
  class BeforeDelete {

    @Test
    @DisplayName("test beforeResourceRequestCapacityDraftDelete.")
    public void beforeResourceRequestCapacityDelete() {

      /* Mock Data */
      final ResourceRequestCapacities resourceRequestCapacity = Struct.create(ResourceRequestCapacities.class);
      resourceRequestCapacity.setId("Capacity ID");
      resourceRequestCapacity.setRequestedCapacity(new BigDecimal(10));
      final DraftCancelEventContext mockContext = mock(DraftCancelEventContext.class);
      final CapacityRequirementsHandler capacityHandlerSpy = spy(cut);

      doReturn(resourceRequestCapacity.getId()).when(capacityHandlerSpy).getIDfromContext(mockContext);
      doReturn(resourceRequestCapacity).when(capacityHandlerSpy)
          .getResourceRequestCapacityFromId(resourceRequestCapacity.getId());
      doNothing().when(capacityHandlerSpy).deleteResourceRequestWithCapacity(any(), any());
      // Function under test
      capacityHandlerSpy.beforeResourceRequestCapacityDraftDelete(mockContext);
      // Assertions
      verify(capacityHandlerSpy, times(1)).getIDfromContext(mockContext);
      verify(capacityHandlerSpy, times(1)).getResourceRequestCapacityFromId(resourceRequestCapacity.getId());
      verify(capacityHandlerSpy, times(1)).deleteResourceRequestWithCapacity(any(), any());
    }

  }

  @Nested
  class UpdateResourceRequestWithCapacity {

    @Test
    @DisplayName("test updateResourceRequestWithCapacity.")
    public void updateResourceRequestWithCapacity() {

      /* Mock Data */
      final ResourceRequestCapacities resourceRequestCapacity = Struct.create(ResourceRequestCapacities.class);
      resourceRequestCapacity.setResourceRequestId("Resource request ID");
      final CapacityRequirementsHandler capacityHandlerSpy = spy(cut);
      doReturn(new BigDecimal(10)).when(capacityHandlerSpy).getTotalRequestedCapacityFromId(any());

      // Function under test
      capacityHandlerSpy.updateResourceRequestWithCapacity(any());
      // Assertions
      verify(mockDraftService, times(1)).patchDraft(any());
    }
  }

  @Nested
  class DeleteResourceRequestWithCapacity {

    @Test
    @DisplayName("test deleteResourceRequestWithCapacity.")
    public void deleteResourceRequestWithCapacity() {

      /* Mock Data */
      final ResourceRequestCapacities resourceRequestCapacity = Struct.create(ResourceRequestCapacities.class);
      resourceRequestCapacity.setResourceRequestId("Resource request ID");
      resourceRequestCapacity.setRequestedCapacity(new BigDecimal(5));
      final CapacityRequirementsHandler capacityHandlerSpy = spy(cut);
      doReturn(new BigDecimal(10)).when(capacityHandlerSpy).getTotalRequestedCapacityFromId(any());

      // Function under test
      capacityHandlerSpy.deleteResourceRequestWithCapacity(resourceRequestCapacity.getResourceRequestId(),
          resourceRequestCapacity.getRequestedCapacity());
      // Assertions
      verify(mockDraftService, times(1)).patchDraft(any());
    }
  }

  @Nested
  class GetTotalRequestedCapacityFromId {

    @Test
    @DisplayName("Test getTotalRequestedCapacityFromId when total capacity is returned is big decimal")
    public void getTotalRequestedCapacityFromIdAsBigDecimal() {
      /* Mock Data */
      final String TOTAL_CAPACITY = "totalCapacity";
      final ResourceRequestCapacities resourceRequestCapacity = mock(ResourceRequestCapacities.class);
      resourceRequestCapacity.setId("Capacity ID");

      final CapacityRequirementsHandler capacityHandlerSpy = spy(cut);

      doReturn(resourceRequestCapacity).when(mockResult).single(any());
      doReturn(new BigDecimal(1)).when(resourceRequestCapacity).get(TOTAL_CAPACITY);
      doReturn(mockResult).when(mockDraftService).run(any(CqnSelect.class));
      doReturn(resourceRequestCapacity).when(mockResult).single(any());

      // Function under test
      BigDecimal actualResult = capacityHandlerSpy
          .getTotalRequestedCapacityFromId(resourceRequestCapacity.getResourceRequestId());
      // Assertions
      assertEquals(new BigDecimal(1), actualResult);
    }

    @Test
    @DisplayName("Test getTotalRequestedCapacityFromId when total capacity is returned is integer")
    public void getTotalRequestedCapacityFromIdAsInteger() {
      /* Mock Data */
      final String TOTAL_CAPACITY = "totalCapacity";
      final ResourceRequestCapacities resourceRequestCapacity = mock(ResourceRequestCapacities.class);
      resourceRequestCapacity.setId("Capacity ID");

      final CapacityRequirementsHandler capacityHandlerSpy = spy(cut);

      doReturn(resourceRequestCapacity).when(mockResult).single(any());
      doReturn(1).when(resourceRequestCapacity).get(TOTAL_CAPACITY);
      doReturn(mockResult).when(mockDraftService).run(any(CqnSelect.class));
      doReturn(resourceRequestCapacity).when(mockResult).single(any());

      // Function under test
      BigDecimal actualResult = capacityHandlerSpy
          .getTotalRequestedCapacityFromId(resourceRequestCapacity.getResourceRequestId());
      // Assertions
      assertEquals(new BigDecimal(1), actualResult);
    }
  }

  @Nested
  class GetIDfromContext {

    @Test
    @DisplayName("test getIDfromContextn new Scenario.")
    public void getIDfromContextNew() {

      /* Mock Data */
      String expectedIDValue = "ID From URL";
      final CapacityRequirementsHandler capacityHandlerSpy = spy(cut);
      final DraftNewEventContext mockContext = mock(DraftNewEventContext.class);
      final AnalysisResult mockAnalysisResult = mock(AnalysisResult.class);
      final CqnInsert mockCqnInsert = mock(CqnInsert.class);
      final CqnStructuredTypeRef mockCqnStructuredTypeRef = mock(CqnStructuredTypeRef.class);
      Map<String, Object> targetKeys = new HashMap<String, Object>();
      targetKeys.put("ID", expectedIDValue);
      doReturn(null).when(mockContext).getModel();
      doReturn(DraftService.EVENT_DRAFT_NEW).when(mockContext).getEvent();
      doReturn(null).when(cqnAnalyzerWrapper).create(any());
      doReturn(mockCqnInsert).when(mockContext).getCqn();
      doReturn(mockCqnStructuredTypeRef).when(mockCqnInsert).ref();
      doReturn(mockAnalysisResult).when(cqnAnalyzerWrapper).analyze(any(), any(CqnStructuredTypeRef.class));
      doReturn(targetKeys).when(mockAnalysisResult).rootKeys();

      // Function under test
      String observedIDValue = capacityHandlerSpy.getIDfromContext(mockContext);
      // Assertions
      assertEquals(expectedIDValue, observedIDValue);
    }

    @Test
    @DisplayName("test getIDfromContextn patch Scenario.")
    public void getIDfromContextcancel() {

      /* Mock Data */
      String expectedIDValue = "ID From URL";
      final CapacityRequirementsHandler capacityHandlerSpy = spy(cut);
      final DraftCancelEventContext mockContext = mock(DraftCancelEventContext.class);
      final AnalysisResult mockAnalysisResult = mock(AnalysisResult.class);
      Map<String, Object> targetKeys = new HashMap<String, Object>();
      targetKeys.put("ID", expectedIDValue);
      doReturn(null).when(mockContext).getModel();
      doReturn(DraftService.EVENT_DRAFT_CANCEL).when(mockContext).getEvent();
      doReturn(null).when(cqnAnalyzerWrapper).create(any());
      doReturn(mock(CqnDelete.class)).when(mockContext).getCqn();
      doReturn(mockAnalysisResult).when(cqnAnalyzerWrapper).analyze(any(), any(CqnDelete.class));
      doReturn(targetKeys).when(mockAnalysisResult).targetKeys();

      // Function under test
      String observedIDValue = capacityHandlerSpy.getIDfromContext(mockContext);
      // Assertions
      assertEquals(expectedIDValue, observedIDValue);
    }
  }

  @Nested
  class GetResourceRequestCapacityFromId {

    @Test
    @DisplayName("test getResourceRequestCapacityFromId.")
    public void getResourceRequestCapacityFromId() {

      /* Mock Data */
      final ResourceRequestCapacities resourceRequestCapacity = Struct.create(ResourceRequestCapacities.class);
      resourceRequestCapacity.setId("Capacity ID");

      doReturn(mockResult).when(mockDraftService).run(any(CqnSelect.class));
      doReturn(resourceRequestCapacity).when(mockResult).single(any());
      final CapacityRequirementsHandler capacityHandlerSpy = spy(cut);
      // Function under test
      final ResourceRequestCapacities observedRequestCapacity = capacityHandlerSpy
          .getResourceRequestCapacityFromId(resourceRequestCapacity.getId());
      // Assertions
      assertEquals(resourceRequestCapacity, observedRequestCapacity);
    }
  }

  @Nested
  class FillRequestedCapacityInMinutes {

    @Test
    @DisplayName("Check if requested capacity in minutes is filled.")
    public void fillRequestedCapacityInMinutes() {

      /* Mock Data */
      final ResourceRequestCapacities resourceRequestCapacity = Struct.create(ResourceRequestCapacities.class);
      resourceRequestCapacity.setRequestedCapacity(BigDecimal.TEN);
      final CapacityRequirementsHandler capacityHandlerSpy = spy(cut);
      // Function under test
      capacityHandlerSpy.fillRequestedCapacityInMinutes(resourceRequestCapacity);
      // Assertions
      assertEquals(600, resourceRequestCapacity.getRequestedCapacityInMinutes());
    }
  }

  @Nested
  class FillStartTime {

    @Test
    @DisplayName("Check if start time is filled.")
    public void fillStartTime() {

      /* Mock Data */
      final ResourceRequestCapacities resourceRequestCapacity = Struct.create(ResourceRequestCapacities.class);
      LocalDate startDate = LocalDate.of(2021, 1, 1);
      Instant startTime = startDate.atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant();
      resourceRequestCapacity.setStartDate(startDate);
      final CapacityRequirementsHandler capacityHandlerSpy = spy(cut);
      // Function under test
      capacityHandlerSpy.fillStartTime(resourceRequestCapacity);
      // Assertions
      assertEquals(startTime, resourceRequestCapacity.getStartTime());
    }
  }

  @Nested
  class FillEndTime {

    @Test
    @DisplayName("Check if end time is filled.")
    public void fillEndime() {

      /* Mock Data */
      final ResourceRequestCapacities resourceRequestCapacity = Struct.create(ResourceRequestCapacities.class);
      LocalDate endDate = LocalDate.of(2021, 1, 1);
      Instant endTime = endDate.plusDays(1).atTime(LocalTime.MIDNIGHT).atZone(ZoneId.systemDefault()).toInstant();
      resourceRequestCapacity.setEndDate(endDate);
      final CapacityRequirementsHandler capacityHandlerSpy = spy(cut);
      // Function under test
      capacityHandlerSpy.fillEndTime(resourceRequestCapacity);
      // Assertions
      assertEquals(endTime, resourceRequestCapacity.getEndTime());
    }
  }

}