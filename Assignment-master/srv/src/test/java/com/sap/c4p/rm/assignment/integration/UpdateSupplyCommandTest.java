package com.sap.c4p.rm.assignment.integration;

import static org.junit.jupiter.api.Assertions.assertIterableEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.sap.cloud.sdk.cloudplatform.connectivity.HttpDestination;
import com.sap.cloud.sdk.cloudplatform.resilience.ResilienceRuntimeException;
import com.sap.cloud.sdk.datamodel.odata.client.exception.ODataException;
import com.sap.cloud.sdk.datamodel.odata.helper.VdmEntity;
import com.sap.cloud.sdk.datamodel.odata.helper.batch.BatchResponse;
import com.sap.cloud.sdk.datamodel.odata.helper.batch.BatchResponseChangeSet;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceSup;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceSupDistr;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.batch.CommercialProjectServiceBatch;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.batch.CommercialProjectServiceBatchChangeSet;
import com.sap.cloud.sdk.s4hana.datamodel.odata.services.DefaultCommercialProjectService;

import io.vavr.control.Try;

public class UpdateSupplyCommandTest {

  private UpdateSupplyCommand classUnderTest;
  private DefaultCommercialProjectService commercialProjectService;
  private HttpDestination httpDestination;
  private EngmntProjRsceSupDistr supplyDistributionListToInsertRecord;
  private EngmntProjRsceSupDistr supplyDistributionListToUpdateRecord;
  private EngmntProjRsceSupDistr supplyDistributionListToDeleteRecord;
  private final List<EngmntProjRsceSup> supplyListToInsert = new ArrayList<EngmntProjRsceSup>();
  private final List<EngmntProjRsceSup> supplyListToDelete = new ArrayList<EngmntProjRsceSup>();
  List<EngmntProjRsceSupDistr> supplyDistributionListToInsert = new ArrayList<EngmntProjRsceSupDistr>();
  List<EngmntProjRsceSupDistr> supplyDistributionListToUpdate = new ArrayList<EngmntProjRsceSupDistr>();
  List<EngmntProjRsceSupDistr> supplyDistributionListToDelete = new ArrayList<EngmntProjRsceSupDistr>();

  @BeforeEach
  public void setUp() {
    commercialProjectService = mock(DefaultCommercialProjectService.class, Mockito.RETURNS_DEEP_STUBS);
  }

  @Test
  void noRecordsLeadToEmptyResponse() throws ODataException {
    CommercialProjectServiceBatchChangeSet updateActionChainMock = mock(CommercialProjectServiceBatchChangeSet.class,
        Mockito.RETURNS_DEEP_STUBS);
    when(commercialProjectService.batch().beginChangeSet()).thenReturn(updateActionChainMock);
    when(updateActionChainMock.endChangeSet().executeRequest(any())).thenThrow(new ODataException(null, null, null));
    classUnderTest = new UpdateSupplyCommand(httpDestination, commercialProjectService, supplyDistributionListToInsert,
        supplyDistributionListToUpdate, supplyDistributionListToDelete, supplyListToInsert, supplyListToDelete);
    assertIterableEquals(Collections.emptyList(), classUnderTest.execute());
  }

  @Test
  void exceptionFromCloudSDKUpdateCallGetsForwarded() throws ODataException {
    CommercialProjectServiceBatchChangeSet updateActionChainMock = mock(CommercialProjectServiceBatchChangeSet.class,
        Mockito.RETURNS_DEEP_STUBS);
    when(commercialProjectService.batch().beginChangeSet()).thenReturn(updateActionChainMock);
    when(updateActionChainMock.createEngmntProjRsceSupDistr(any())).thenReturn(updateActionChainMock);
    when(updateActionChainMock.endChangeSet().executeRequest(any()).get(0).get())
        .thenThrow(new ODataException(null, null, null));

    supplyDistributionListToInsert.add(getDummySupplyDistributionRecord());

    classUnderTest = new UpdateSupplyCommand(httpDestination, commercialProjectService, supplyDistributionListToInsert,
        supplyDistributionListToUpdate, supplyDistributionListToDelete, supplyListToInsert, supplyListToDelete);
    assertThrows(ResilienceRuntimeException.class, () -> classUnderTest.execute());
  }

  @Test
  void createSupplyRecordsAreBatchedAndResponseCollectedCorrectlyForCloudSDKUpdateCall() throws ODataException {
    CommercialProjectServiceBatchChangeSet updateActionChainMock = mock(CommercialProjectServiceBatchChangeSet.class,
        Mockito.RETURNS_DEEP_STUBS);
    when(commercialProjectService.batch().beginChangeSet()).thenReturn(updateActionChainMock);
    EngmntProjRsceSup dummySupplyRecordToInsert = mock(EngmntProjRsceSup.class);
    supplyListToInsert.add(dummySupplyRecordToInsert);

    classUnderTest = new UpdateSupplyCommand(httpDestination, commercialProjectService, supplyDistributionListToInsert,
        supplyDistributionListToUpdate, supplyDistributionListToDelete, supplyListToInsert, supplyListToDelete);

    BatchResponseChangeSet mockBatchResponseChangeSet = mock(BatchResponseChangeSet.class);
    VdmEntity<?> mockEntityReturnedByS4 = new EngmntProjRsceSup();
    List<VdmEntity<?>> mockCreatedEntityList = Arrays.asList(mockEntityReturnedByS4);
    when(mockBatchResponseChangeSet.getCreatedEntities()).thenReturn(mockCreatedEntityList);

    BatchResponse mockBatchResponse = mock(BatchResponse.class);

    @SuppressWarnings("unchecked")
    Try<BatchResponseChangeSet> mockTryBatchResponseChangeSet = mock(Try.class);
    when(mockBatchResponse.get(0)).thenReturn(mockTryBatchResponseChangeSet);
    when(mockTryBatchResponseChangeSet.get()).thenReturn(mockBatchResponseChangeSet);

    CommercialProjectServiceBatch mockCommercialProjectServiceBatch = updateActionChainMock.endChangeSet();
    when(updateActionChainMock.createEngmntProjRsceSup(any())).thenReturn(updateActionChainMock);
    when(updateActionChainMock.endChangeSet()).thenReturn(mockCommercialProjectServiceBatch);
    when(mockCommercialProjectServiceBatch.executeRequest(any())).thenReturn(mockBatchResponse);

    assertIterableEquals(mockCreatedEntityList, classUnderTest.execute());

    verify(updateActionChainMock, times(1)).createEngmntProjRsceSup(dummySupplyRecordToInsert);
    verify(updateActionChainMock, times(0)).createEngmntProjRsceSupDistr(any());
    verify(updateActionChainMock, times(0)).updateEngmntProjRsceSupDistr(any());
    verify(updateActionChainMock, times(0)).deleteEngmntProjRsceSupDistr(any());
  }

  @Test
  void exceptionThrownWhenS4DoesNotReturnCorrectNumberOfCreatedSupplyRecords() throws ODataException {
    CommercialProjectServiceBatchChangeSet updateActionChainMock = mock(CommercialProjectServiceBatchChangeSet.class,
        Mockito.RETURNS_DEEP_STUBS);
    when(commercialProjectService.batch().beginChangeSet()).thenReturn(updateActionChainMock);
    EngmntProjRsceSup dummySupplyRecordToInsert = mock(EngmntProjRsceSup.class);
    supplyListToInsert.add(dummySupplyRecordToInsert);

    classUnderTest = new UpdateSupplyCommand(httpDestination, commercialProjectService, supplyDistributionListToInsert,
        supplyDistributionListToUpdate, supplyDistributionListToDelete, supplyListToInsert, supplyListToDelete);

    BatchResponseChangeSet mockBatchResponseChangeSet = mock(BatchResponseChangeSet.class);
    when(mockBatchResponseChangeSet.getCreatedEntities()).thenReturn(Collections.emptyList());

    BatchResponse mockBatchResponse = mock(BatchResponse.class);

    @SuppressWarnings("unchecked")
    Try<BatchResponseChangeSet> mockTryBatchResponseChangeSet = mock(Try.class);
    when(mockBatchResponse.get(0)).thenReturn(mockTryBatchResponseChangeSet);
    when(mockTryBatchResponseChangeSet.get()).thenReturn(mockBatchResponseChangeSet);

    CommercialProjectServiceBatch mockCommercialProjectServiceBatch = updateActionChainMock.endChangeSet();
    when(updateActionChainMock.createEngmntProjRsceSup(any())).thenReturn(updateActionChainMock);
    when(updateActionChainMock.endChangeSet()).thenReturn(mockCommercialProjectServiceBatch);
    when(mockCommercialProjectServiceBatch.executeRequest(any())).thenReturn(mockBatchResponse);

    assertThrows(Exception.class, () -> classUnderTest.execute());

  }

  @Test
  void createSupplyDistributionRecordsAreBatchedCorrectlyForCloudSDKUpdateCall() throws ODataException {
    CommercialProjectServiceBatchChangeSet updateActionChainMock = mock(CommercialProjectServiceBatchChangeSet.class,
        Mockito.RETURNS_DEEP_STUBS);
    when(commercialProjectService.batch().beginChangeSet()).thenReturn(updateActionChainMock);

    supplyDistributionListToInsert.add(getDummySupplyDistributionRecord());

    classUnderTest = new UpdateSupplyCommand(httpDestination, commercialProjectService, supplyDistributionListToInsert,
        supplyDistributionListToUpdate, supplyDistributionListToDelete, supplyListToInsert, supplyListToDelete);

    when(updateActionChainMock.endChangeSet().executeRequest(any())).thenReturn(null);

    classUnderTest.execute();

    verify(updateActionChainMock, times(1)).createEngmntProjRsceSupDistr(supplyDistributionListToInsert.get(0));
    verify(updateActionChainMock, times(0)).updateEngmntProjRsceSupDistr(supplyDistributionListToUpdateRecord);
    verify(updateActionChainMock, times(0)).deleteEngmntProjRsceSupDistr(supplyDistributionListToDeleteRecord);
    verify(updateActionChainMock, times(1)).endChangeSet();
  }

  @Test
  void updateRecordsAreBatchedCorrectlyForCloudSDKUpdateCall() throws ODataException {
    CommercialProjectServiceBatchChangeSet updateActionChainMock = mock(CommercialProjectServiceBatchChangeSet.class,
        Mockito.RETURNS_DEEP_STUBS);
    when(commercialProjectService.batch().beginChangeSet()).thenReturn(updateActionChainMock);

    supplyDistributionListToUpdate.add(getDummySupplyDistributionRecord());

    classUnderTest = new UpdateSupplyCommand(httpDestination, commercialProjectService, supplyDistributionListToInsert,
        supplyDistributionListToUpdate, supplyDistributionListToDelete, supplyListToInsert, supplyListToDelete);

    when(updateActionChainMock.endChangeSet().executeRequest(any())).thenReturn(null);

    classUnderTest.execute();

    verify(updateActionChainMock, times(0)).createEngmntProjRsceSupDistr(supplyDistributionListToInsertRecord);
    verify(updateActionChainMock, times(1)).updateEngmntProjRsceSupDistr(supplyDistributionListToUpdate.get(0));
    verify(updateActionChainMock, times(0)).deleteEngmntProjRsceSupDistr(supplyDistributionListToDeleteRecord);
    verify(updateActionChainMock, times(1)).endChangeSet();
  }

  @Test
  void deleteRecordsAreBatchedCorrectlyForCloudSDKUpdateCall() throws ODataException {
    CommercialProjectServiceBatchChangeSet updateActionChainMock = mock(CommercialProjectServiceBatchChangeSet.class,
        Mockito.RETURNS_DEEP_STUBS);
    when(commercialProjectService.batch().beginChangeSet()).thenReturn(updateActionChainMock);

    supplyDistributionListToDelete.add(getDummySupplyDistributionRecord());

    classUnderTest = new UpdateSupplyCommand(httpDestination, commercialProjectService, supplyDistributionListToInsert,
        supplyDistributionListToUpdate, supplyDistributionListToDelete, supplyListToInsert, supplyListToDelete);

    when(updateActionChainMock.endChangeSet().executeRequest(any())).thenReturn(null);

    classUnderTest.execute();

    verify(updateActionChainMock, times(0)).createEngmntProjRsceSupDistr(supplyDistributionListToInsertRecord);
    verify(updateActionChainMock, times(0)).updateEngmntProjRsceSupDistr(supplyDistributionListToUpdateRecord);
    verify(updateActionChainMock, times(1)).deleteEngmntProjRsceSupDistr(supplyDistributionListToDelete.get(0));
    verify(updateActionChainMock, times(1)).endChangeSet();
  }

  private EngmntProjRsceSupDistr getDummySupplyDistributionRecord() {
    EngmntProjRsceSupDistr supplyDistributionRecord = new EngmntProjRsceSupDistr();
    supplyDistributionRecord.setResourceDemand("1010");
    supplyDistributionRecord.setCurrency("USD");
    supplyDistributionRecord.setCalendarMonth("01");
    supplyDistributionRecord.setCalendarYear("2020");
    return supplyDistributionRecord;
  }
}
