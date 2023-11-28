package com.sap.c4p.rm.assignment.integration;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;

import com.sap.cds.Result;
import com.sap.cds.Row;
import com.sap.cds.impl.RowImpl;
import com.sap.cds.ql.Delete;
import com.sap.cds.ql.Insert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.messages.Messages;
import com.sap.cds.services.persistence.PersistenceService;
import com.sap.cds.services.runtime.CdsRuntime;
import com.sap.cloud.sdk.cloudplatform.resilience.ResilienceRuntimeException;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceSup;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceSupDistr;

import com.sap.c4p.rm.assignment.gen.MessageKeys;
import com.sap.c4p.rm.assignment.utils.AssignmentTemporalQueryParameterHelper;

import com.sap.resourcemanagement.config.ResourceOrganizations;
import com.sap.resourcemanagement.project.Demands;
import com.sap.resourcemanagement.resource.ResourceDetailsForTimeWindow;
import com.sap.resourcemanagement.resourcerequest.ResourceRequests;
import com.sap.resourcemanagement.supply.AssignmentBucketsYearMonthAggregate;
import com.sap.resourcemanagement.supply.ResourceSupply;
import com.sap.resourcemanagement.supply.ResourceSupplyDetails;
import com.sap.resourcemanagement.supply.ResourceSupply_;

import assignmentservice.AssignmentBuckets;
import assignmentservice.Assignments;

public class AssignmentS4IntegrationTest {

  private static final String UNIT_OF_MEASURE = "H";
  private static final String WORKPACKAGE_ID = "dummyWP";
  private static final String WORKPACKAGE_ID1 = "dummyWP1";
  private static final String WORKPACKAGE_ID2 = "dummyWP2";
  private static final String RESOURCE_DEMAND = "1010";
  private static final String RESOURCE_SUPPLY = "1010";
  private static final String PLAN_VERSION_ID = "1";
  private static final String ASSIGNMENT_ID = "30970700-0000-0000-0000-000000309707";
  private static final String ASSIGNMENT_ID_HEADER1 = "30970700-0000-0000-0000-000000309717";
  private static final String ASSIGNMENT_ID_HEADER2 = "30970700-0000-0000-0000-000000309727";
  private static final String DELIVERY_ORG_CODE = "1010";
  private static final String WORK_ASSIGNMENT_ID = "309707";
  private static final String COUNTRY_CODE = "DE";
  private static final String RESOURCE_ID = "00000000-0000-0000-0000-000000309707";
  private static final String REQUEST_ID = "30970700-0000-0000-0000-000000000000";
  private static final String[] MOCK_STRING_ARRAY = { "this is an Error from S4", "2" };
  private static final String[] MOCK_STRING_ARRAY_INSERT = { "this is an Error from S4", "1" };
  private static final String[] MOCK_STRING_ARRAY_UPDATE = { "this is an Error from S4", "3" };
  private static final String[] MOCK_STRING_ARRAY_DELETE = { "this is an Error from S4", "5" };
  private static final String[] MOCK_STRING_FAILED_DELETE = { "No split in s4", "1" };
  private static final String[] MOCK_STRING_ARRAY_CREATE_HEADER = { "this is an Error from S4", "2" };
  private static final String[] MOCK_STRING_ARRAY_OUT_OF_BOUNDS = { "this is an Error from S4", "10" };

  private AssignmentS4Integration classUnderTest;

  private PersistenceService persistenceServiceMock;
  private SupplyDestination supplyDestinationMock;
  private SupplyCommandHelper commandHelperMock;
  private AssignmentTemporalQueryParameterHelper temporalQueryHelperMock;
  private CdsRuntime cdsRuntimeMock;
  private UpdateSupplyDistributionListCollector mockCollector;
  private UpdateSupplyDistrCollector mockDistrCollector;
  private SupplyErrorMessageParser mockMessageParser;
  private Messages mockMessages;
  private CreateSupplyCollector mockCreateSupplyCollector;
  private DeleteSupplyCollector mockDeleteSupplyCollector;

  private Result mockResult;

  private Result mockResult2;

  @BeforeEach
  public void setUp() {
    persistenceServiceMock = mock(PersistenceService.class, Mockito.RETURNS_DEEP_STUBS);
    cdsRuntimeMock = mock(CdsRuntime.class);
    supplyDestinationMock = mock(SupplyDestination.class);
    commandHelperMock = mock(SupplyCommandHelper.class, Mockito.RETURNS_DEEP_STUBS);
    temporalQueryHelperMock = mock(AssignmentTemporalQueryParameterHelper.class);
    mockCollector = mock(UpdateSupplyDistributionListCollector.class);
    mockDistrCollector = mock(UpdateSupplyDistrCollector.class);
    mockMessageParser = mock(SupplyErrorMessageParser.class);
    mockMessages = mock(Messages.class, RETURNS_DEEP_STUBS);
    mockMessages.error(MessageKeys.S4_SUPPLY_UPDATE_ACTION_FAILED).code("406").target(ASSIGNMENT_ID);
    mockCreateSupplyCollector = mock(CreateSupplyCollector.class);
    mockDeleteSupplyCollector = mock(DeleteSupplyCollector.class);
    classUnderTest = new AssignmentS4Integration(persistenceServiceMock, cdsRuntimeMock, mockMessages);
    classUnderTest.setCommandHelper(commandHelperMock);
    classUnderTest.setSupplyDestination(supplyDestinationMock);
    classUnderTest.setServiceHandlerContext(temporalQueryHelperMock);
    classUnderTest.setUpdateSupplyDistributionListCollector(mockCollector);
    classUnderTest.setMessageParser(mockMessageParser);
    classUnderTest.setCreateSupplyCollector(mockCreateSupplyCollector);
    classUnderTest.setUpdateSupplyDistrCollector(mockDistrCollector);
    classUnderTest.setDeleteSupplyCollector(mockDeleteSupplyCollector);
    classUnderTest.setMessages(mockMessages);
    this.mockResult = mock(Result.class, Mockito.RETURNS_DEEP_STUBS);
    this.mockResult2 = mock(Result.class, Mockito.RETURNS_DEEP_STUBS);
  }

  @Test
  void exceptionThrownOnS4UpdateIfSupplyInfoMissingInRM() {

    when(supplyDestinationMock.getDestination()).thenReturn(null);

    UpdateSupplyCommand commandMock = mock(UpdateSupplyCommand.class);
    when(commandMock.execute()).thenReturn(null);
    when(commandHelperMock.getUpdateSupplyCommand(any(), any(), any(), any(), any(), any(), any()))
        .thenReturn(commandMock);

    Optional<ResourceSupplyDetails> emptyDetails = Optional.empty();
    when(persistenceServiceMock.run(any(CqnSelect.class)).first(ResourceSupplyDetails.class)).thenReturn(emptyDetails);

    List<AssignmentBucketsYearMonthAggregate> oldMonthlyAggregatedAssignment = null;
    List<AssignmentBucketsYearMonthAggregate> newMonthlyAggregatedAssignment = null;

    assertThrows(ServiceException.class, () -> classUnderTest.prepareAssignmentUpdateInS4(ASSIGNMENT_ID,
        oldMonthlyAggregatedAssignment, newMonthlyAggregatedAssignment));
  }

  @Test
  void correctParametersToUpdateCommandInvocation_1Create_1Update_1Delete() {

    when(supplyDestinationMock.getDestination()).thenReturn(null);

    UpdateSupplyCommand commandMock = mock(UpdateSupplyCommand.class);
    when(commandMock.execute()).thenReturn(null);

    ResourceSupplyDetails resourceSupplyDetails = ResourceSupplyDetails.create();
    resourceSupplyDetails.setWorkPackage(WORKPACKAGE_ID);
    resourceSupplyDetails.setResourceDemand(RESOURCE_DEMAND);
    resourceSupplyDetails.setResourceSupply(RESOURCE_SUPPLY);

    Optional<ResourceSupplyDetails> resourceSupplyDetailsOptional = Optional.of(resourceSupplyDetails);
    when(persistenceServiceMock.run(any(CqnSelect.class)).first(ResourceSupplyDetails.class))
        .thenReturn(resourceSupplyDetailsOptional);

    List<AssignmentBucketsYearMonthAggregate> oldMonthlyAggregatedAssignment = new ArrayList<>();
    List<AssignmentBucketsYearMonthAggregate> newMonthlyAggregatedAssignment = new ArrayList<>();

    AssignmentBucketsYearMonthAggregate old_Jan = AssignmentBucketsYearMonthAggregate.create();
    old_Jan.setAssignmentId(ASSIGNMENT_ID);
    old_Jan.setYearMonth("202001");
    old_Jan.setBookedCapacityInHours(2);
    oldMonthlyAggregatedAssignment.add(old_Jan);

    AssignmentBucketsYearMonthAggregate old_Feb = AssignmentBucketsYearMonthAggregate.create();
    old_Feb.setAssignmentId(ASSIGNMENT_ID);
    old_Feb.setYearMonth("202002");
    old_Feb.setBookedCapacityInHours(2);
    oldMonthlyAggregatedAssignment.add(old_Feb);

    AssignmentBucketsYearMonthAggregate new_Feb = AssignmentBucketsYearMonthAggregate.create();
    new_Feb.setAssignmentId(ASSIGNMENT_ID);
    new_Feb.setYearMonth("202002");
    new_Feb.setBookedCapacityInHours(3);
    newMonthlyAggregatedAssignment.add(new_Feb);

    AssignmentBucketsYearMonthAggregate new_Mar = AssignmentBucketsYearMonthAggregate.create();
    new_Mar.setAssignmentId(ASSIGNMENT_ID);
    new_Mar.setYearMonth("202003");
    new_Mar.setBookedCapacityInHours(3);
    newMonthlyAggregatedAssignment.add(new_Mar);

    List<EngmntProjRsceSupDistr> expectedSupplyDistributionListToInsert = new ArrayList<>();
    List<EngmntProjRsceSupDistr> expectedSupplyDistributionListToUpdate = new ArrayList<>();
    List<EngmntProjRsceSupDistr> expectedSupplyDistributionListToDelete = new ArrayList<>();

    EngmntProjRsceSupDistr insertRecord = new EngmntProjRsceSupDistr();
    insertRecord.setWorkPackage(WORKPACKAGE_ID);
    insertRecord.setResourceDemand(RESOURCE_DEMAND);
    insertRecord.setResourceSupply(RESOURCE_SUPPLY);
    insertRecord.setVersion(PLAN_VERSION_ID);
    insertRecord.setCalendarYear("2020");
    insertRecord.setCalendarMonth("03");
    insertRecord.setUnitOfMeasure(UNIT_OF_MEASURE);
    insertRecord.setQuantity(new BigDecimal(3));

    expectedSupplyDistributionListToInsert.add(insertRecord);

    EngmntProjRsceSupDistr updateRecord = new EngmntProjRsceSupDistr();
    updateRecord.setWorkPackage(WORKPACKAGE_ID);
    updateRecord.setResourceDemand(RESOURCE_DEMAND);
    updateRecord.setResourceSupply(RESOURCE_SUPPLY);
    updateRecord.setVersion(PLAN_VERSION_ID);
    updateRecord.setCalendarYear("2020");
    updateRecord.setCalendarMonth("02");
    updateRecord.setUnitOfMeasure(UNIT_OF_MEASURE);
    updateRecord.setQuantity(new BigDecimal(3));
    expectedSupplyDistributionListToUpdate.add(updateRecord);

    EngmntProjRsceSupDistr deleteRecord = new EngmntProjRsceSupDistr();
    deleteRecord.setWorkPackage(WORKPACKAGE_ID);
    deleteRecord.setResourceDemand(RESOURCE_DEMAND);
    deleteRecord.setResourceSupply(RESOURCE_SUPPLY);
    deleteRecord.setVersion(PLAN_VERSION_ID);
    deleteRecord.setCalendarYear("2020");
    deleteRecord.setCalendarMonth("01");

    expectedSupplyDistributionListToDelete.add(deleteRecord);

    when(commandHelperMock.getUpdateSupplyCommand(any(), any(), any(), any(), any(), any(), any()))
        .thenReturn(commandMock);

    classUnderTest.prepareAssignmentUpdateInS4(ASSIGNMENT_ID, oldMonthlyAggregatedAssignment,
        newMonthlyAggregatedAssignment);

    verify(mockCollector, times(1)).addSupplyDistributionListToInsert(eq(expectedSupplyDistributionListToInsert));
    verify(mockCollector, times(1)).addSupplyDistributionListToUpdate(eq(expectedSupplyDistributionListToUpdate));
    verify(mockCollector, times(1)).addSupplyDistributionListToDelete(eq(expectedSupplyDistributionListToDelete));

  }

  @Test
  void resilienceExceptionWhileUpdateIsPropagatedWithErrorInThirdRecordFor_1Create_3Update_1Delete() {

    when(supplyDestinationMock.getDestination()).thenReturn(null);

    when(commandHelperMock.getUpdateSupplyCommand(any(), any(), any(), any(), any(), any(), any()))
        .thenThrow(new ResilienceRuntimeException());
    when(mockMessageParser.getErrorMessage(any())).thenReturn(MOCK_STRING_ARRAY_UPDATE);

    List<EngmntProjRsceSupDistr> expectedSupplyDistributionListToInsert = new ArrayList<>();
    List<EngmntProjRsceSupDistr> expectedSupplyDistributionListToUpdate = new ArrayList<>();
    List<EngmntProjRsceSupDistr> expectedSupplyDistributionListToDelete = new ArrayList<>();

    EngmntProjRsceSupDistr expectedSupplyDistribution1 = new EngmntProjRsceSupDistr();
    expectedSupplyDistribution1.setVersion("1");
    expectedSupplyDistribution1.setCalendarMonth("02");
    expectedSupplyDistribution1.setCalendarYear("2022");
    expectedSupplyDistribution1.setUnitOfMeasure("H");
    expectedSupplyDistribution1.setQuantity(BigDecimal.valueOf(4));
    expectedSupplyDistributionListToUpdate.add(expectedSupplyDistribution1);
    Map<EngmntProjRsceSupDistr, String> updateSupplyDistrMap;
    updateSupplyDistrMap = new HashMap<>();
    updateSupplyDistrMap.put(expectedSupplyDistribution1, ASSIGNMENT_ID);

    EngmntProjRsceSupDistr expectedSupplyDistribution2 = new EngmntProjRsceSupDistr();
    expectedSupplyDistribution2.setVersion("1");
    expectedSupplyDistribution2.setCalendarMonth("03");
    expectedSupplyDistribution2.setCalendarYear("2022");
    expectedSupplyDistribution2.setUnitOfMeasure("H");
    expectedSupplyDistribution2.setQuantity(BigDecimal.valueOf(4));
    expectedSupplyDistributionListToUpdate.add(expectedSupplyDistribution2);
    updateSupplyDistrMap.put(expectedSupplyDistribution2, ASSIGNMENT_ID);

    EngmntProjRsceSupDistr expectedSupplyDistribution3 = new EngmntProjRsceSupDistr();
    expectedSupplyDistribution3.setVersion("1");
    expectedSupplyDistribution3.setCalendarMonth("04");
    expectedSupplyDistribution3.setCalendarYear("2022");
    expectedSupplyDistribution3.setUnitOfMeasure("H");
    expectedSupplyDistribution3.setQuantity(BigDecimal.valueOf(4));
    expectedSupplyDistributionListToUpdate.add(expectedSupplyDistribution3);
    mockDistrCollector.addSupply(expectedSupplyDistribution3, ASSIGNMENT_ID);
    updateSupplyDistrMap.put(expectedSupplyDistribution3, ASSIGNMENT_ID);

    EngmntProjRsceSupDistr expectedSupplyDistribution4 = new EngmntProjRsceSupDistr();
    expectedSupplyDistribution4.setVersion("1");
    expectedSupplyDistribution4.setCalendarMonth("05");
    expectedSupplyDistribution4.setCalendarYear("2022");
    expectedSupplyDistribution4.setUnitOfMeasure("H");
    expectedSupplyDistribution4.setQuantity(BigDecimal.valueOf(4));
    expectedSupplyDistributionListToInsert.add(expectedSupplyDistribution4);
    mockDistrCollector.addSupply(expectedSupplyDistribution4, ASSIGNMENT_ID);
    updateSupplyDistrMap.put(expectedSupplyDistribution4, ASSIGNMENT_ID);

    EngmntProjRsceSupDistr expectedSupplyDistribution5 = new EngmntProjRsceSupDistr();
    expectedSupplyDistribution5.setVersion("1");
    expectedSupplyDistribution5.setCalendarMonth("06");
    expectedSupplyDistribution5.setCalendarYear("2022");
    expectedSupplyDistribution5.setUnitOfMeasure("H");
    expectedSupplyDistribution5.setQuantity(BigDecimal.valueOf(4));
    expectedSupplyDistributionListToDelete.add(expectedSupplyDistribution5);
    mockDistrCollector.addSupply(expectedSupplyDistribution5, ASSIGNMENT_ID);
    updateSupplyDistrMap.put(expectedSupplyDistribution5, ASSIGNMENT_ID);

    mockDistrCollector.updateSupplyDistrMap = updateSupplyDistrMap;

    when(mockDistrCollector.getCreateSupplyMap()).thenReturn(updateSupplyDistrMap);

    mockCollector.supplyDistributionListToInsert = expectedSupplyDistributionListToInsert;
    mockCollector.supplyDistributionListToUpdate = expectedSupplyDistributionListToUpdate;
    mockCollector.supplyDistributionListToDelete = expectedSupplyDistributionListToDelete;
    doThrow(ServiceException.class).when(mockMessages).throwIfError();
    assertThrows(ServiceException.class, () -> classUnderTest.beforeClose(), MOCK_STRING_ARRAY[0]);
    verify(mockCollector, times(1)).clearAll();
    verify(mockDistrCollector, times(1)).clearAll();
  }

  @Test
  void resilienceExceptionWhileUpdateIsPropagatedWithErrorInFirstRecordFor_3Create_1Update_1Delete() {

    when(supplyDestinationMock.getDestination()).thenReturn(null);

    when(commandHelperMock.getUpdateSupplyCommand(any(), any(), any(), any(), any(), any(), any()))
        .thenThrow(new ResilienceRuntimeException());
    when(mockMessageParser.getErrorMessage(any())).thenReturn(MOCK_STRING_ARRAY_INSERT);

    List<EngmntProjRsceSupDistr> expectedSupplyDistributionListToInsert = new ArrayList<>();
    List<EngmntProjRsceSupDistr> expectedSupplyDistributionListToUpdate = new ArrayList<>();
    List<EngmntProjRsceSupDistr> expectedSupplyDistributionListToDelete = new ArrayList<>();

    EngmntProjRsceSupDistr expectedSupplyDistribution1 = new EngmntProjRsceSupDistr();
    expectedSupplyDistribution1.setVersion("1");
    expectedSupplyDistribution1.setCalendarMonth("02");
    expectedSupplyDistribution1.setCalendarYear("2022");
    expectedSupplyDistribution1.setUnitOfMeasure("H");
    expectedSupplyDistribution1.setQuantity(BigDecimal.valueOf(4));
    expectedSupplyDistributionListToInsert.add(expectedSupplyDistribution1);
    Map<EngmntProjRsceSupDistr, String> updateSupplyDistrMap;
    updateSupplyDistrMap = new HashMap<>();
    updateSupplyDistrMap.put(expectedSupplyDistribution1, ASSIGNMENT_ID);

    EngmntProjRsceSupDistr expectedSupplyDistribution2 = new EngmntProjRsceSupDistr();
    expectedSupplyDistribution2.setVersion("1");
    expectedSupplyDistribution2.setCalendarMonth("03");
    expectedSupplyDistribution2.setCalendarYear("2022");
    expectedSupplyDistribution2.setUnitOfMeasure("H");
    expectedSupplyDistribution2.setQuantity(BigDecimal.valueOf(4));
    expectedSupplyDistributionListToInsert.add(expectedSupplyDistribution2);
    updateSupplyDistrMap.put(expectedSupplyDistribution2, ASSIGNMENT_ID);

    EngmntProjRsceSupDistr expectedSupplyDistribution3 = new EngmntProjRsceSupDistr();
    expectedSupplyDistribution3.setVersion("1");
    expectedSupplyDistribution3.setCalendarMonth("04");
    expectedSupplyDistribution3.setCalendarYear("2022");
    expectedSupplyDistribution3.setUnitOfMeasure("H");
    expectedSupplyDistribution3.setQuantity(BigDecimal.valueOf(4));
    expectedSupplyDistributionListToInsert.add(expectedSupplyDistribution3);
    mockDistrCollector.addSupply(expectedSupplyDistribution3, ASSIGNMENT_ID);
    updateSupplyDistrMap.put(expectedSupplyDistribution3, ASSIGNMENT_ID);

    EngmntProjRsceSupDistr expectedSupplyDistribution4 = new EngmntProjRsceSupDistr();
    expectedSupplyDistribution4.setVersion("1");
    expectedSupplyDistribution4.setCalendarMonth("05");
    expectedSupplyDistribution4.setCalendarYear("2022");
    expectedSupplyDistribution4.setUnitOfMeasure("H");
    expectedSupplyDistribution4.setQuantity(BigDecimal.valueOf(4));
    expectedSupplyDistributionListToUpdate.add(expectedSupplyDistribution4);
    mockDistrCollector.addSupply(expectedSupplyDistribution4, ASSIGNMENT_ID);
    updateSupplyDistrMap.put(expectedSupplyDistribution4, ASSIGNMENT_ID);

    EngmntProjRsceSupDistr expectedSupplyDistribution5 = new EngmntProjRsceSupDistr();
    expectedSupplyDistribution5.setVersion("1");
    expectedSupplyDistribution5.setCalendarMonth("06");
    expectedSupplyDistribution5.setCalendarYear("2022");
    expectedSupplyDistribution5.setUnitOfMeasure("H");
    expectedSupplyDistribution5.setQuantity(BigDecimal.valueOf(4));
    expectedSupplyDistributionListToDelete.add(expectedSupplyDistribution5);
    mockDistrCollector.addSupply(expectedSupplyDistribution5, ASSIGNMENT_ID);
    updateSupplyDistrMap.put(expectedSupplyDistribution5, ASSIGNMENT_ID);

    mockDistrCollector.updateSupplyDistrMap = updateSupplyDistrMap;

    when(mockDistrCollector.getCreateSupplyMap()).thenReturn(updateSupplyDistrMap);

    mockCollector.supplyDistributionListToInsert = expectedSupplyDistributionListToInsert;
    mockCollector.supplyDistributionListToUpdate = expectedSupplyDistributionListToUpdate;
    mockCollector.supplyDistributionListToDelete = expectedSupplyDistributionListToDelete;
    doThrow(ServiceException.class).when(mockMessages).throwIfError();
    assertThrows(ServiceException.class, () -> classUnderTest.beforeClose(), MOCK_STRING_ARRAY[0]);
    verify(mockCollector, times(1)).clearAll();
    verify(mockDistrCollector, times(1)).clearAll();
  }

  @Test
  void resilienceExceptionWhileUpdateIsPropagatedWithErrorInFifthRecordFor_1Create_1Update_3Delete() {

    when(supplyDestinationMock.getDestination()).thenReturn(null);

    when(commandHelperMock.getUpdateSupplyCommand(any(), any(), any(), any(), any(), any(), any()))
        .thenThrow(new ResilienceRuntimeException());
    when(mockMessageParser.getErrorMessage(any())).thenReturn(MOCK_STRING_ARRAY_DELETE);

    List<EngmntProjRsceSupDistr> expectedSupplyDistributionListToInsert = new ArrayList<>();
    List<EngmntProjRsceSupDistr> expectedSupplyDistributionListToUpdate = new ArrayList<>();
    List<EngmntProjRsceSupDistr> expectedSupplyDistributionListToDelete = new ArrayList<>();

    EngmntProjRsceSupDistr expectedSupplyDistribution1 = new EngmntProjRsceSupDistr();
    expectedSupplyDistribution1.setVersion("1");
    expectedSupplyDistribution1.setCalendarMonth("02");
    expectedSupplyDistribution1.setCalendarYear("2022");
    expectedSupplyDistribution1.setUnitOfMeasure("H");
    expectedSupplyDistribution1.setQuantity(BigDecimal.valueOf(4));
    expectedSupplyDistributionListToDelete.add(expectedSupplyDistribution1);
    Map<EngmntProjRsceSupDistr, String> updateSupplyDistrMap;
    updateSupplyDistrMap = new HashMap<>();
    updateSupplyDistrMap.put(expectedSupplyDistribution1, ASSIGNMENT_ID);

    EngmntProjRsceSupDistr expectedSupplyDistribution2 = new EngmntProjRsceSupDistr();
    expectedSupplyDistribution2.setVersion("1");
    expectedSupplyDistribution2.setCalendarMonth("03");
    expectedSupplyDistribution2.setCalendarYear("2022");
    expectedSupplyDistribution2.setUnitOfMeasure("H");
    expectedSupplyDistribution2.setQuantity(BigDecimal.valueOf(4));
    expectedSupplyDistributionListToDelete.add(expectedSupplyDistribution2);
    updateSupplyDistrMap.put(expectedSupplyDistribution2, ASSIGNMENT_ID);

    EngmntProjRsceSupDistr expectedSupplyDistribution3 = new EngmntProjRsceSupDistr();
    expectedSupplyDistribution3.setVersion("1");
    expectedSupplyDistribution3.setCalendarMonth("04");
    expectedSupplyDistribution3.setCalendarYear("2022");
    expectedSupplyDistribution3.setUnitOfMeasure("H");
    expectedSupplyDistribution3.setQuantity(BigDecimal.valueOf(4));
    expectedSupplyDistributionListToDelete.add(expectedSupplyDistribution3);
    mockDistrCollector.addSupply(expectedSupplyDistribution3, ASSIGNMENT_ID);
    updateSupplyDistrMap.put(expectedSupplyDistribution3, ASSIGNMENT_ID);

    EngmntProjRsceSupDistr expectedSupplyDistribution4 = new EngmntProjRsceSupDistr();
    expectedSupplyDistribution4.setVersion("1");
    expectedSupplyDistribution4.setCalendarMonth("05");
    expectedSupplyDistribution4.setCalendarYear("2022");
    expectedSupplyDistribution4.setUnitOfMeasure("H");
    expectedSupplyDistribution4.setQuantity(BigDecimal.valueOf(4));
    expectedSupplyDistributionListToInsert.add(expectedSupplyDistribution4);
    mockDistrCollector.addSupply(expectedSupplyDistribution4, ASSIGNMENT_ID);
    updateSupplyDistrMap.put(expectedSupplyDistribution4, ASSIGNMENT_ID);

    EngmntProjRsceSupDistr expectedSupplyDistribution5 = new EngmntProjRsceSupDistr();
    expectedSupplyDistribution5.setVersion("1");
    expectedSupplyDistribution5.setCalendarMonth("06");
    expectedSupplyDistribution5.setCalendarYear("2022");
    expectedSupplyDistribution5.setUnitOfMeasure("H");
    expectedSupplyDistribution5.setQuantity(BigDecimal.valueOf(4));
    expectedSupplyDistributionListToUpdate.add(expectedSupplyDistribution5);
    mockDistrCollector.addSupply(expectedSupplyDistribution5, ASSIGNMENT_ID);
    updateSupplyDistrMap.put(expectedSupplyDistribution5, ASSIGNMENT_ID);

    mockDistrCollector.updateSupplyDistrMap = updateSupplyDistrMap;

    when(mockDistrCollector.getCreateSupplyMap()).thenReturn(updateSupplyDistrMap);

    mockCollector.supplyDistributionListToInsert = expectedSupplyDistributionListToInsert;
    mockCollector.supplyDistributionListToUpdate = expectedSupplyDistributionListToUpdate;
    mockCollector.supplyDistributionListToDelete = expectedSupplyDistributionListToDelete;
    doThrow(ServiceException.class).when(mockMessages).throwIfError();
    assertThrows(ServiceException.class, () -> classUnderTest.beforeClose(), MOCK_STRING_ARRAY[0]);
    verify(mockCollector, times(1)).clearAll();
    verify(mockDistrCollector, times(1)).clearAll();
  }

  @Test
  void resilienceExceptionWhileUpdateIsPropagatedWithErrorInSecondRecordFor_1Create_1Update_1Delete_3Header() {

    int countOfCreateSupply = 3;
    when(supplyDestinationMock.getDestination()).thenReturn(null);

    when(commandHelperMock.getUpdateSupplyCommand(any(), any(), any(), any(), any(), any(), any()))
        .thenThrow(new ResilienceRuntimeException());
    when(mockMessageParser.getErrorMessage(any())).thenReturn(MOCK_STRING_ARRAY_CREATE_HEADER);

    when(mockCreateSupplyCollector.getSize()).thenReturn(countOfCreateSupply);

    List<EngmntProjRsceSupDistr> expectedSupplyDistributionListToInsert = new ArrayList<>();
    List<EngmntProjRsceSupDistr> expectedSupplyDistributionListToUpdate = new ArrayList<>();
    List<EngmntProjRsceSupDistr> expectedSupplyDistributionListToDelete = new ArrayList<>();

    EngmntProjRsceSup supplyInfoInRM1 = new EngmntProjRsceSup();
    supplyInfoInRM1.setWorkPackage(WORKPACKAGE_ID);
    supplyInfoInRM1.setResourceDemand(RESOURCE_DEMAND);
    supplyInfoInRM1.setWorkforcePersonUserID(RESOURCE_ID);

    Map<String, EngmntProjRsceSup> createSupplyMap = new HashMap<>();
    createSupplyMap.put(ASSIGNMENT_ID, supplyInfoInRM1);

    EngmntProjRsceSup supplyInfoInRM2 = new EngmntProjRsceSup();
    supplyInfoInRM2.setWorkPackage(WORKPACKAGE_ID1);
    supplyInfoInRM2.setResourceDemand(RESOURCE_DEMAND);
    supplyInfoInRM2.setWorkforcePersonUserID(RESOURCE_ID);

    createSupplyMap.put(ASSIGNMENT_ID_HEADER1, supplyInfoInRM2);

    EngmntProjRsceSup supplyInfoInRM3 = new EngmntProjRsceSup();
    supplyInfoInRM3.setWorkPackage(WORKPACKAGE_ID2);
    supplyInfoInRM3.setResourceDemand(RESOURCE_DEMAND);
    supplyInfoInRM3.setWorkforcePersonUserID(RESOURCE_ID);

    createSupplyMap.put(ASSIGNMENT_ID_HEADER2, supplyInfoInRM3);

    mockCreateSupplyCollector.createSupplyMap = createSupplyMap;

    when(mockCreateSupplyCollector.getCreateSupplyMap()).thenReturn(createSupplyMap);

    EngmntProjRsceSupDistr expectedSupplyDistribution1 = new EngmntProjRsceSupDistr();
    expectedSupplyDistribution1.setVersion("1");
    expectedSupplyDistribution1.setCalendarMonth("02");
    expectedSupplyDistribution1.setCalendarYear("2022");
    expectedSupplyDistribution1.setUnitOfMeasure("H");
    expectedSupplyDistribution1.setQuantity(BigDecimal.valueOf(4));
    expectedSupplyDistributionListToInsert.add(expectedSupplyDistribution1);
    Map<EngmntProjRsceSupDistr, String> updateSupplyDistrMap;
    updateSupplyDistrMap = new HashMap<>();
    updateSupplyDistrMap.put(expectedSupplyDistribution1, ASSIGNMENT_ID);

    EngmntProjRsceSupDistr expectedSupplyDistribution2 = new EngmntProjRsceSupDistr();
    expectedSupplyDistribution2.setVersion("1");
    expectedSupplyDistribution2.setCalendarMonth("03");
    expectedSupplyDistribution2.setCalendarYear("2022");
    expectedSupplyDistribution2.setUnitOfMeasure("H");
    expectedSupplyDistribution2.setQuantity(BigDecimal.valueOf(4));
    expectedSupplyDistributionListToUpdate.add(expectedSupplyDistribution2);
    updateSupplyDistrMap.put(expectedSupplyDistribution2, ASSIGNMENT_ID);

    EngmntProjRsceSupDistr expectedSupplyDistribution3 = new EngmntProjRsceSupDistr();
    expectedSupplyDistribution3.setVersion("1");
    expectedSupplyDistribution3.setCalendarMonth("04");
    expectedSupplyDistribution3.setCalendarYear("2022");
    expectedSupplyDistribution3.setUnitOfMeasure("H");
    expectedSupplyDistribution3.setQuantity(BigDecimal.valueOf(4));
    expectedSupplyDistributionListToDelete.add(expectedSupplyDistribution3);
    mockDistrCollector.addSupply(expectedSupplyDistribution3, ASSIGNMENT_ID);
    updateSupplyDistrMap.put(expectedSupplyDistribution3, ASSIGNMENT_ID);

    mockDistrCollector.updateSupplyDistrMap = updateSupplyDistrMap;

    mockCollector.supplyDistributionListToInsert = expectedSupplyDistributionListToInsert;
    mockCollector.supplyDistributionListToUpdate = expectedSupplyDistributionListToUpdate;
    mockCollector.supplyDistributionListToDelete = expectedSupplyDistributionListToDelete;
    doThrow(ServiceException.class).when(mockMessages).throwIfError();
    assertThrows(ServiceException.class, () -> classUnderTest.beforeClose(), MOCK_STRING_ARRAY[0]);
    verify(mockCollector, times(1)).clearAll();
    verify(mockDistrCollector, times(1)).clearAll();
    verify(mockCreateSupplyCollector, times(1)).clearAll();
  }

  @Test
  void resilienceExceptionWhileUpdateIsPropagatedWithErrorForaRecordNotPresentInCurrentPayload() {

    when(supplyDestinationMock.getDestination()).thenReturn(null);

    when(commandHelperMock.getUpdateSupplyCommand(any(), any(), any(), any(), any(), any(), any()))
        .thenThrow(new ResilienceRuntimeException());
    when(mockMessageParser.getErrorMessage(any())).thenReturn(MOCK_STRING_ARRAY_OUT_OF_BOUNDS);

    List<EngmntProjRsceSupDistr> expectedSupplyDistributionListToInsert = new ArrayList<>();
    List<EngmntProjRsceSupDistr> expectedSupplyDistributionListToUpdate = new ArrayList<>();
    List<EngmntProjRsceSupDistr> expectedSupplyDistributionListToDelete = new ArrayList<>();

    EngmntProjRsceSupDistr expectedSupplyDistribution1 = new EngmntProjRsceSupDistr();
    expectedSupplyDistribution1.setVersion("1");
    expectedSupplyDistribution1.setCalendarMonth("02");
    expectedSupplyDistribution1.setCalendarYear("2022");
    expectedSupplyDistribution1.setUnitOfMeasure("H");
    expectedSupplyDistribution1.setQuantity(BigDecimal.valueOf(4));
    expectedSupplyDistributionListToInsert.add(expectedSupplyDistribution1);
    Map<EngmntProjRsceSupDistr, String> updateSupplyDistrMap;
    updateSupplyDistrMap = new HashMap<>();
    updateSupplyDistrMap.put(expectedSupplyDistribution1, ASSIGNMENT_ID);

    EngmntProjRsceSupDistr expectedSupplyDistribution2 = new EngmntProjRsceSupDistr();
    expectedSupplyDistribution2.setVersion("1");
    expectedSupplyDistribution2.setCalendarMonth("03");
    expectedSupplyDistribution2.setCalendarYear("2022");
    expectedSupplyDistribution2.setUnitOfMeasure("H");
    expectedSupplyDistribution2.setQuantity(BigDecimal.valueOf(4));
    expectedSupplyDistributionListToUpdate.add(expectedSupplyDistribution2);
    updateSupplyDistrMap.put(expectedSupplyDistribution2, ASSIGNMENT_ID);

    EngmntProjRsceSupDistr expectedSupplyDistribution3 = new EngmntProjRsceSupDistr();
    expectedSupplyDistribution3.setVersion("1");
    expectedSupplyDistribution3.setCalendarMonth("04");
    expectedSupplyDistribution3.setCalendarYear("2022");
    expectedSupplyDistribution3.setUnitOfMeasure("H");
    expectedSupplyDistribution3.setQuantity(BigDecimal.valueOf(4));
    expectedSupplyDistributionListToDelete.add(expectedSupplyDistribution3);
    mockDistrCollector.addSupply(expectedSupplyDistribution3, ASSIGNMENT_ID);
    updateSupplyDistrMap.put(expectedSupplyDistribution3, ASSIGNMENT_ID);

    mockDistrCollector.updateSupplyDistrMap = updateSupplyDistrMap;

    mockCollector.supplyDistributionListToInsert = expectedSupplyDistributionListToInsert;
    mockCollector.supplyDistributionListToUpdate = expectedSupplyDistributionListToUpdate;
    mockCollector.supplyDistributionListToDelete = expectedSupplyDistributionListToDelete;

    assertThrows(ServiceException.class, () -> classUnderTest.beforeClose(), MOCK_STRING_ARRAY[0]);
    verify(mockCollector, times(1)).clearAll();
    verify(mockDistrCollector, times(1)).clearAll();
    verify(mockCreateSupplyCollector, times(1)).clearAll();
  }

  @Test
  void resilienceExceptionOnDelete() {

    List<EngmntProjRsceSupDistr> expectedSupplyDistributionListToInsert = new ArrayList<>();
    List<EngmntProjRsceSupDistr> expectedSupplyDistributionListToUpdate = new ArrayList<>();
    List<EngmntProjRsceSupDistr> expectedSupplyDistributionListToDelete = new ArrayList<>();

    mockCollector.supplyDistributionListToInsert = expectedSupplyDistributionListToInsert;
    mockCollector.supplyDistributionListToUpdate = expectedSupplyDistributionListToUpdate;
    mockCollector.supplyDistributionListToDelete = expectedSupplyDistributionListToDelete;

    Map<String, EngmntProjRsceSup> deleteSupplyMap = new HashMap<>();

    EngmntProjRsceSup supplyInfoInRM3 = new EngmntProjRsceSup();
    supplyInfoInRM3.setWorkPackage(WORKPACKAGE_ID2);
    supplyInfoInRM3.setResourceDemand(RESOURCE_DEMAND);
    supplyInfoInRM3.setWorkforcePersonUserID(RESOURCE_ID);

    deleteSupplyMap.put(ASSIGNMENT_ID_HEADER2, supplyInfoInRM3);

    mockDeleteSupplyCollector.deleteSupplyMap = deleteSupplyMap;

    when(mockDeleteSupplyCollector.getDeleteSupplyMap()).thenReturn(deleteSupplyMap);

    when(commandHelperMock.getUpdateSupplyCommand(any(), any(), any(), any(), any(), any(), any()))
        .thenThrow(new ResilienceRuntimeException());

    when(mockMessageParser.getErrorMessage(any())).thenReturn(MOCK_STRING_FAILED_DELETE);

    when(mockDeleteSupplyCollector.getSize()).thenReturn(1);

    assertThrows(ServiceException.class, () -> classUnderTest.beforeClose(), MOCK_STRING_ARRAY[0]);
    verify(mockCollector, times(1)).clearAll();
    verify(mockDistrCollector, times(1)).clearAll();
    verify(mockDeleteSupplyCollector, times(1)).clearAll();
  }

  @Test
  void resilienceExceptionWhileUpdateIsPropagatedWithGenericError() {

    when(supplyDestinationMock.getDestination()).thenReturn(null);

    when(commandHelperMock.getUpdateSupplyCommand(any(), any(), any(), any(), any(), any(), any()))
        .thenThrow(new ResilienceRuntimeException());
    when(mockMessageParser.getErrorMessage(any())).thenReturn(null);

    assertThrows(ServiceException.class, () -> classUnderTest.beforeClose(), MessageKeys.ASSIGNMENT_NOT_CHANGED);
    verify(mockCollector, times(1)).clearAll();
  }

  @Test
  void exceptionWhileUpdateIsPropagated() {

    when(supplyDestinationMock.getDestination()).thenReturn(null);

    when(commandHelperMock.getUpdateSupplyCommand(any(), any(), any(), any(), any(), any(), any()))
        .thenThrow(new RuntimeException());

    assertThrows(ServiceException.class, () -> classUnderTest.beforeClose());
    verify(mockCollector, times(1)).clearAll();
  }

  @Test
  void noExceptionWhileUpdateIsSuccessful() {

    when(supplyDestinationMock.getDestination()).thenReturn(null);

    when(commandHelperMock.getUpdateSupplyCommand(any(), any(), any(), any(), any(), any(), any()).execute())
        .thenReturn(Collections.emptyList());

    assertDoesNotThrow(() -> classUnderTest.beforeClose());

  }

  @Test
  void correctParametersToUpdateCommandInvocation_1Create_1Update_0Delete() {

    when(supplyDestinationMock.getDestination()).thenReturn(null);

    UpdateSupplyCommand commandMock = mock(UpdateSupplyCommand.class);
    when(commandMock.execute()).thenReturn(null);

    ResourceSupplyDetails resourceSupplyDetails = ResourceSupplyDetails.create();
    resourceSupplyDetails.setWorkPackage(WORKPACKAGE_ID);
    resourceSupplyDetails.setResourceDemand(RESOURCE_DEMAND);
    resourceSupplyDetails.setResourceSupply(RESOURCE_SUPPLY);

    Optional<ResourceSupplyDetails> resourceSupplyDetailsOptional = Optional.of(resourceSupplyDetails);
    when(persistenceServiceMock.run(any(CqnSelect.class)).first(ResourceSupplyDetails.class))
        .thenReturn(resourceSupplyDetailsOptional);

    List<AssignmentBucketsYearMonthAggregate> oldMonthlyAggregatedAssignment = new ArrayList<>();
    List<AssignmentBucketsYearMonthAggregate> newMonthlyAggregatedAssignment = new ArrayList<>();

    AssignmentBucketsYearMonthAggregate old_Feb = AssignmentBucketsYearMonthAggregate.create();
    old_Feb.setAssignmentId(ASSIGNMENT_ID);
    old_Feb.setYearMonth("202002");
    old_Feb.setBookedCapacityInHours(2);
    oldMonthlyAggregatedAssignment.add(old_Feb);

    AssignmentBucketsYearMonthAggregate new_Feb = AssignmentBucketsYearMonthAggregate.create();
    new_Feb.setAssignmentId(ASSIGNMENT_ID);
    new_Feb.setYearMonth("202002");
    new_Feb.setBookedCapacityInHours(3);
    newMonthlyAggregatedAssignment.add(new_Feb);

    AssignmentBucketsYearMonthAggregate new_Mar = AssignmentBucketsYearMonthAggregate.create();
    new_Mar.setAssignmentId(ASSIGNMENT_ID);
    new_Mar.setYearMonth("202003");
    new_Mar.setBookedCapacityInHours(3);
    newMonthlyAggregatedAssignment.add(new_Mar);

    List<EngmntProjRsceSupDistr> expectedSupplyDistributionListToInsert = new ArrayList<>();
    List<EngmntProjRsceSupDistr> expectedSupplyDistributionListToUpdate = new ArrayList<>();
    List<EngmntProjRsceSupDistr> expectedSupplyDistributionListToDelete = new ArrayList<>();

    EngmntProjRsceSupDistr insertRecord = new EngmntProjRsceSupDistr();
    insertRecord.setWorkPackage(WORKPACKAGE_ID);
    insertRecord.setResourceDemand(RESOURCE_DEMAND);
    insertRecord.setResourceSupply(RESOURCE_SUPPLY);
    insertRecord.setVersion(PLAN_VERSION_ID);
    insertRecord.setCalendarYear("2020");
    insertRecord.setCalendarMonth("03");
    insertRecord.setUnitOfMeasure(UNIT_OF_MEASURE);
    insertRecord.setQuantity(new BigDecimal(3));

    expectedSupplyDistributionListToInsert.add(insertRecord);

    EngmntProjRsceSupDistr updateRecord = new EngmntProjRsceSupDistr();
    updateRecord.setWorkPackage(WORKPACKAGE_ID);
    updateRecord.setResourceDemand(RESOURCE_DEMAND);
    updateRecord.setResourceSupply(RESOURCE_SUPPLY);
    updateRecord.setVersion(PLAN_VERSION_ID);
    updateRecord.setCalendarYear("2020");
    updateRecord.setCalendarMonth("02");
    updateRecord.setUnitOfMeasure(UNIT_OF_MEASURE);
    updateRecord.setQuantity(new BigDecimal(3));
    expectedSupplyDistributionListToUpdate.add(updateRecord);

    when(commandHelperMock.getUpdateSupplyCommand(any(), any(), any(), any(), any(), any(), any()))
        .thenReturn(commandMock);

    classUnderTest.prepareAssignmentUpdateInS4(ASSIGNMENT_ID, oldMonthlyAggregatedAssignment,
        newMonthlyAggregatedAssignment);

    verify(mockCollector, times(1)).addSupplyDistributionListToInsert(eq(expectedSupplyDistributionListToInsert));
    verify(mockCollector, times(1)).addSupplyDistributionListToUpdate(eq(expectedSupplyDistributionListToUpdate));
    verify(mockCollector, times(1)).addSupplyDistributionListToDelete(eq(expectedSupplyDistributionListToDelete));
  }

  @Test
  void correctParametersToUpdateCommandInvocation_1Create_0Update_0Delete() {

    when(supplyDestinationMock.getDestination()).thenReturn(null);

    UpdateSupplyCommand commandMock = mock(UpdateSupplyCommand.class);
    when(commandMock.execute()).thenReturn(null);

    ResourceSupplyDetails resourceSupplyDetails = ResourceSupplyDetails.create();
    resourceSupplyDetails.setWorkPackage(WORKPACKAGE_ID);
    resourceSupplyDetails.setResourceDemand(RESOURCE_DEMAND);
    resourceSupplyDetails.setResourceSupply(RESOURCE_SUPPLY);

    Optional<ResourceSupplyDetails> resourceSupplyDetailsOptional = Optional.of(resourceSupplyDetails);
    when(persistenceServiceMock.run(any(CqnSelect.class)).first(ResourceSupplyDetails.class))
        .thenReturn(resourceSupplyDetailsOptional);

    List<AssignmentBucketsYearMonthAggregate> oldMonthlyAggregatedAssignment = new ArrayList<>();
    List<AssignmentBucketsYearMonthAggregate> newMonthlyAggregatedAssignment = new ArrayList<>();

    AssignmentBucketsYearMonthAggregate new_Feb = AssignmentBucketsYearMonthAggregate.create();
    new_Feb.setAssignmentId(ASSIGNMENT_ID);
    new_Feb.setYearMonth("202002");
    new_Feb.setBookedCapacityInHours(3);
    newMonthlyAggregatedAssignment.add(new_Feb);

    List<EngmntProjRsceSupDistr> expectedSupplyDistributionListToInsert = new ArrayList<>();
    List<EngmntProjRsceSupDistr> expectedSupplyDistributionListToUpdate = new ArrayList<>();
    List<EngmntProjRsceSupDistr> expectedSupplyDistributionListToDelete = new ArrayList<>();

    EngmntProjRsceSupDistr insertRecord = new EngmntProjRsceSupDistr();
    insertRecord.setWorkPackage(WORKPACKAGE_ID);
    insertRecord.setResourceDemand(RESOURCE_DEMAND);
    insertRecord.setResourceSupply(RESOURCE_SUPPLY);
    insertRecord.setVersion(PLAN_VERSION_ID);
    insertRecord.setCalendarYear("2020");
    insertRecord.setCalendarMonth("02");
    insertRecord.setUnitOfMeasure(UNIT_OF_MEASURE);
    insertRecord.setQuantity(new BigDecimal(3));

    expectedSupplyDistributionListToInsert.add(insertRecord);

    classUnderTest.prepareAssignmentUpdateInS4(ASSIGNMENT_ID, oldMonthlyAggregatedAssignment,
        newMonthlyAggregatedAssignment);

    verify(mockCollector, times(1)).addSupplyDistributionListToInsert(eq(expectedSupplyDistributionListToInsert));
    verify(mockCollector, times(1)).addSupplyDistributionListToUpdate(eq(expectedSupplyDistributionListToUpdate));
    verify(mockCollector, times(1)).addSupplyDistributionListToDelete(eq(expectedSupplyDistributionListToDelete));
  }

  @Test
  void correctParametersToUpdateCommandInvocation_0Create_1Update_0Delete() {

    when(supplyDestinationMock.getDestination()).thenReturn(null);

    UpdateSupplyCommand commandMock = mock(UpdateSupplyCommand.class);
    when(commandMock.execute()).thenReturn(null);

    ResourceSupplyDetails resourceSupplyDetails = ResourceSupplyDetails.create();
    resourceSupplyDetails.setWorkPackage(WORKPACKAGE_ID);
    resourceSupplyDetails.setResourceDemand(RESOURCE_DEMAND);
    resourceSupplyDetails.setResourceSupply(RESOURCE_SUPPLY);

    Optional<ResourceSupplyDetails> resourceSupplyDetailsOptional = Optional.of(resourceSupplyDetails);
    when(persistenceServiceMock.run(any(CqnSelect.class)).first(ResourceSupplyDetails.class))
        .thenReturn(resourceSupplyDetailsOptional);

    List<AssignmentBucketsYearMonthAggregate> oldMonthlyAggregatedAssignment = new ArrayList<>();
    List<AssignmentBucketsYearMonthAggregate> newMonthlyAggregatedAssignment = new ArrayList<>();

    AssignmentBucketsYearMonthAggregate old_Feb = AssignmentBucketsYearMonthAggregate.create();
    old_Feb.setAssignmentId(ASSIGNMENT_ID);
    old_Feb.setYearMonth("202002");
    old_Feb.setBookedCapacityInHours(2);
    oldMonthlyAggregatedAssignment.add(old_Feb);

    AssignmentBucketsYearMonthAggregate new_Feb = AssignmentBucketsYearMonthAggregate.create();
    new_Feb.setAssignmentId(ASSIGNMENT_ID);
    new_Feb.setYearMonth("202002");
    new_Feb.setBookedCapacityInHours(3);
    newMonthlyAggregatedAssignment.add(new_Feb);

    List<EngmntProjRsceSupDistr> expectedSupplyDistributionListToInsert = new ArrayList<>();
    List<EngmntProjRsceSupDistr> expectedSupplyDistributionListToUpdate = new ArrayList<>();
    List<EngmntProjRsceSupDistr> expectedSupplyDistributionListToDelete = new ArrayList<>();

    EngmntProjRsceSupDistr updateRecord = new EngmntProjRsceSupDistr();
    updateRecord.setWorkPackage(WORKPACKAGE_ID);
    updateRecord.setResourceDemand(RESOURCE_DEMAND);
    updateRecord.setResourceSupply(RESOURCE_SUPPLY);
    updateRecord.setVersion(PLAN_VERSION_ID);
    updateRecord.setCalendarYear("2020");
    updateRecord.setCalendarMonth("02");
    updateRecord.setUnitOfMeasure(UNIT_OF_MEASURE);
    updateRecord.setQuantity(new BigDecimal(3));
    expectedSupplyDistributionListToUpdate.add(updateRecord);

    when(commandHelperMock.getUpdateSupplyCommand(any(), any(), any(), any(), any(), any(), any()))
        .thenReturn(commandMock);

    classUnderTest.prepareAssignmentUpdateInS4(ASSIGNMENT_ID, oldMonthlyAggregatedAssignment,
        newMonthlyAggregatedAssignment);

    verify(mockCollector, times(1)).addSupplyDistributionListToInsert(eq(expectedSupplyDistributionListToInsert));
    verify(mockCollector, times(1)).addSupplyDistributionListToUpdate(eq(expectedSupplyDistributionListToUpdate));
    verify(mockCollector, times(1)).addSupplyDistributionListToDelete(eq(expectedSupplyDistributionListToDelete));
  }

  @Test
  void correctParametersToUpdateCommandInvocation_0Create_1Update_1Delete() {

    when(supplyDestinationMock.getDestination()).thenReturn(null);

    UpdateSupplyCommand commandMock = mock(UpdateSupplyCommand.class);
    when(commandMock.execute()).thenReturn(null);

    ResourceSupplyDetails resourceSupplyDetails = ResourceSupplyDetails.create();
    resourceSupplyDetails.setWorkPackage(WORKPACKAGE_ID);
    resourceSupplyDetails.setResourceDemand(RESOURCE_DEMAND);
    resourceSupplyDetails.setResourceSupply(RESOURCE_SUPPLY);

    Optional<ResourceSupplyDetails> resourceSupplyDetailsOptional = Optional.of(resourceSupplyDetails);
    when(persistenceServiceMock.run(any(CqnSelect.class)).first(ResourceSupplyDetails.class))
        .thenReturn(resourceSupplyDetailsOptional);

    List<AssignmentBucketsYearMonthAggregate> oldMonthlyAggregatedAssignment = new ArrayList<>();
    List<AssignmentBucketsYearMonthAggregate> newMonthlyAggregatedAssignment = new ArrayList<>();

    AssignmentBucketsYearMonthAggregate old_Jan = AssignmentBucketsYearMonthAggregate.create();
    old_Jan.setAssignmentId(ASSIGNMENT_ID);
    old_Jan.setYearMonth("202001");
    old_Jan.setBookedCapacityInHours(2);
    oldMonthlyAggregatedAssignment.add(old_Jan);

    AssignmentBucketsYearMonthAggregate old_Feb = AssignmentBucketsYearMonthAggregate.create();
    old_Feb.setAssignmentId(ASSIGNMENT_ID);
    old_Feb.setYearMonth("202002");
    old_Feb.setBookedCapacityInHours(2);
    oldMonthlyAggregatedAssignment.add(old_Feb);

    AssignmentBucketsYearMonthAggregate new_Feb = AssignmentBucketsYearMonthAggregate.create();
    new_Feb.setAssignmentId(ASSIGNMENT_ID);
    new_Feb.setYearMonth("202002");
    new_Feb.setBookedCapacityInHours(3);
    newMonthlyAggregatedAssignment.add(new_Feb);

    List<EngmntProjRsceSupDistr> expectedSupplyDistributionListToInsert = new ArrayList<>();
    List<EngmntProjRsceSupDistr> expectedSupplyDistributionListToUpdate = new ArrayList<>();
    List<EngmntProjRsceSupDistr> expectedSupplyDistributionListToDelete = new ArrayList<>();

    EngmntProjRsceSupDistr updateRecord = new EngmntProjRsceSupDistr();
    updateRecord.setWorkPackage(WORKPACKAGE_ID);
    updateRecord.setResourceDemand(RESOURCE_DEMAND);
    updateRecord.setResourceSupply(RESOURCE_SUPPLY);
    updateRecord.setVersion(PLAN_VERSION_ID);
    updateRecord.setCalendarYear("2020");
    updateRecord.setCalendarMonth("02");
    updateRecord.setUnitOfMeasure(UNIT_OF_MEASURE);
    updateRecord.setQuantity(new BigDecimal(3));
    expectedSupplyDistributionListToUpdate.add(updateRecord);

    EngmntProjRsceSupDistr deleteRecord = new EngmntProjRsceSupDistr();
    deleteRecord.setWorkPackage(WORKPACKAGE_ID);
    deleteRecord.setResourceDemand(RESOURCE_DEMAND);
    deleteRecord.setResourceSupply(RESOURCE_SUPPLY);
    deleteRecord.setVersion(PLAN_VERSION_ID);
    deleteRecord.setCalendarYear("2020");
    deleteRecord.setCalendarMonth("01");

    expectedSupplyDistributionListToDelete.add(deleteRecord);

    classUnderTest.prepareAssignmentUpdateInS4(ASSIGNMENT_ID, oldMonthlyAggregatedAssignment,
        newMonthlyAggregatedAssignment);

    verify(mockCollector, times(1)).addSupplyDistributionListToInsert(eq(expectedSupplyDistributionListToInsert));
    verify(mockCollector, times(1)).addSupplyDistributionListToUpdate(eq(expectedSupplyDistributionListToUpdate));
    verify(mockCollector, times(1)).addSupplyDistributionListToDelete(eq(expectedSupplyDistributionListToDelete));

  }

  @Test
  void correctParametersToUpdateCommandInvocation_0Create_0Update_1Delete() {

    when(supplyDestinationMock.getDestination()).thenReturn(null);

    UpdateSupplyCommand commandMock = mock(UpdateSupplyCommand.class);
    when(commandMock.execute()).thenReturn(null);

    ResourceSupplyDetails resourceSupplyDetails = ResourceSupplyDetails.create();
    resourceSupplyDetails.setWorkPackage(WORKPACKAGE_ID);
    resourceSupplyDetails.setResourceDemand(RESOURCE_DEMAND);
    resourceSupplyDetails.setResourceSupply(RESOURCE_SUPPLY);

    Optional<ResourceSupplyDetails> resourceSupplyDetailsOptional = Optional.of(resourceSupplyDetails);
    when(persistenceServiceMock.run(any(CqnSelect.class)).first(ResourceSupplyDetails.class))
        .thenReturn(resourceSupplyDetailsOptional);

    List<AssignmentBucketsYearMonthAggregate> oldMonthlyAggregatedAssignment = new ArrayList<>();
    List<AssignmentBucketsYearMonthAggregate> newMonthlyAggregatedAssignment = new ArrayList<>();

    AssignmentBucketsYearMonthAggregate old_Jan = AssignmentBucketsYearMonthAggregate.create();
    old_Jan.setAssignmentId(ASSIGNMENT_ID);
    old_Jan.setYearMonth("202001");
    old_Jan.setBookedCapacityInHours(2);
    oldMonthlyAggregatedAssignment.add(old_Jan);

    AssignmentBucketsYearMonthAggregate old_Feb = AssignmentBucketsYearMonthAggregate.create();
    old_Feb.setAssignmentId(ASSIGNMENT_ID);
    old_Feb.setYearMonth("202002");
    old_Feb.setBookedCapacityInHours(2);
    oldMonthlyAggregatedAssignment.add(old_Feb);

    AssignmentBucketsYearMonthAggregate new_Feb = AssignmentBucketsYearMonthAggregate.create();
    new_Feb.setAssignmentId(ASSIGNMENT_ID);
    new_Feb.setYearMonth("202002");
    new_Feb.setBookedCapacityInHours(2);
    newMonthlyAggregatedAssignment.add(new_Feb);

    List<EngmntProjRsceSupDistr> expectedSupplyDistributionListToInsert = new ArrayList<>();
    List<EngmntProjRsceSupDistr> expectedSupplyDistributionListToUpdate = new ArrayList<>();
    List<EngmntProjRsceSupDistr> expectedSupplyDistributionListToDelete = new ArrayList<>();

    EngmntProjRsceSupDistr deleteRecord = new EngmntProjRsceSupDistr();
    deleteRecord.setWorkPackage(WORKPACKAGE_ID);
    deleteRecord.setResourceDemand(RESOURCE_DEMAND);
    deleteRecord.setResourceSupply(RESOURCE_SUPPLY);
    deleteRecord.setVersion(PLAN_VERSION_ID);
    deleteRecord.setCalendarYear("2020");
    deleteRecord.setCalendarMonth("01");

    expectedSupplyDistributionListToDelete.add(deleteRecord);

    when(commandHelperMock.getUpdateSupplyCommand(any(), any(), any(), any(), any(), any(), any()))
        .thenReturn(commandMock);

    classUnderTest.prepareAssignmentUpdateInS4(ASSIGNMENT_ID, oldMonthlyAggregatedAssignment,
        newMonthlyAggregatedAssignment);

    verify(mockCollector, times(1)).addSupplyDistributionListToInsert(eq(expectedSupplyDistributionListToInsert));
    verify(mockCollector, times(1)).addSupplyDistributionListToUpdate(eq(expectedSupplyDistributionListToUpdate));
    verify(mockCollector, times(1)).addSupplyDistributionListToDelete(eq(expectedSupplyDistributionListToDelete));
  }

  @Test
  void correctParametersToUpdateCommandInvocation_1Create_0Update_1Delete() {

    when(supplyDestinationMock.getDestination()).thenReturn(null);

    UpdateSupplyCommand commandMock = mock(UpdateSupplyCommand.class);
    when(commandMock.execute()).thenReturn(null);

    ResourceSupplyDetails resourceSupplyDetails = ResourceSupplyDetails.create();
    resourceSupplyDetails.setWorkPackage(WORKPACKAGE_ID);
    resourceSupplyDetails.setResourceDemand(RESOURCE_DEMAND);
    resourceSupplyDetails.setResourceSupply(RESOURCE_SUPPLY);

    Optional<ResourceSupplyDetails> resourceSupplyDetailsOptional = Optional.of(resourceSupplyDetails);
    when(persistenceServiceMock.run(any(CqnSelect.class)).first(ResourceSupplyDetails.class))
        .thenReturn(resourceSupplyDetailsOptional);

    List<AssignmentBucketsYearMonthAggregate> oldMonthlyAggregatedAssignment = new ArrayList<>();
    List<AssignmentBucketsYearMonthAggregate> newMonthlyAggregatedAssignment = new ArrayList<>();

    AssignmentBucketsYearMonthAggregate old_Jan = AssignmentBucketsYearMonthAggregate.create();
    old_Jan.setAssignmentId(ASSIGNMENT_ID);
    old_Jan.setYearMonth("202001");
    old_Jan.setBookedCapacityInHours(2);
    oldMonthlyAggregatedAssignment.add(old_Jan);

    AssignmentBucketsYearMonthAggregate old_Feb = AssignmentBucketsYearMonthAggregate.create();
    old_Feb.setAssignmentId(ASSIGNMENT_ID);
    old_Feb.setYearMonth("202002");
    old_Feb.setBookedCapacityInHours(2);
    oldMonthlyAggregatedAssignment.add(old_Feb);

    AssignmentBucketsYearMonthAggregate new_Feb = AssignmentBucketsYearMonthAggregate.create();
    new_Feb.setAssignmentId(ASSIGNMENT_ID);
    new_Feb.setYearMonth("202002");
    new_Feb.setBookedCapacityInHours(2);
    newMonthlyAggregatedAssignment.add(new_Feb);

    AssignmentBucketsYearMonthAggregate new_Mar = AssignmentBucketsYearMonthAggregate.create();
    new_Mar.setAssignmentId(ASSIGNMENT_ID);
    new_Mar.setYearMonth("202003");
    new_Mar.setBookedCapacityInHours(3);
    newMonthlyAggregatedAssignment.add(new_Mar);

    List<EngmntProjRsceSupDistr> expectedSupplyDistributionListToInsert = new ArrayList<>();
    List<EngmntProjRsceSupDistr> expectedSupplyDistributionListToUpdate = new ArrayList<>();
    List<EngmntProjRsceSupDistr> expectedSupplyDistributionListToDelete = new ArrayList<>();

    EngmntProjRsceSupDistr insertRecord = new EngmntProjRsceSupDistr();
    insertRecord.setWorkPackage(WORKPACKAGE_ID);
    insertRecord.setResourceDemand(RESOURCE_DEMAND);
    insertRecord.setResourceSupply(RESOURCE_SUPPLY);
    insertRecord.setVersion(PLAN_VERSION_ID);
    insertRecord.setCalendarYear("2020");
    insertRecord.setCalendarMonth("03");
    insertRecord.setUnitOfMeasure(UNIT_OF_MEASURE);
    insertRecord.setQuantity(new BigDecimal(3));

    expectedSupplyDistributionListToInsert.add(insertRecord);

    EngmntProjRsceSupDistr deleteRecord = new EngmntProjRsceSupDistr();
    deleteRecord.setWorkPackage(WORKPACKAGE_ID);
    deleteRecord.setResourceDemand(RESOURCE_DEMAND);
    deleteRecord.setResourceSupply(RESOURCE_SUPPLY);
    deleteRecord.setVersion(PLAN_VERSION_ID);
    deleteRecord.setCalendarYear("2020");
    deleteRecord.setCalendarMonth("01");

    expectedSupplyDistributionListToDelete.add(deleteRecord);

    when(commandHelperMock.getUpdateSupplyCommand(any(), any(), any(), any(), any(), any(), any()))
        .thenReturn(commandMock);

    classUnderTest.prepareAssignmentUpdateInS4(ASSIGNMENT_ID, oldMonthlyAggregatedAssignment,
        newMonthlyAggregatedAssignment);

    verify(mockCollector, times(1)).addSupplyDistributionListToInsert(eq(expectedSupplyDistributionListToInsert));
    verify(mockCollector, times(1)).addSupplyDistributionListToUpdate(eq(expectedSupplyDistributionListToUpdate));
    verify(mockCollector, times(1)).addSupplyDistributionListToDelete(eq(expectedSupplyDistributionListToDelete));
  }

  @Test
  void prepareAssignmentDeleteInS4() {

    Assignments assignment = Assignments.create();
    assignment.setId(ASSIGNMENT_ID);
    assignment.setResourceId(RESOURCE_ID);
    assignment.setResourceRequestId(REQUEST_ID);
    assignment.setBookedCapacityInMinutes(420);

    AssignmentBuckets bucket1 = AssignmentBuckets.create();
    bucket1.setAssignmentId(ASSIGNMENT_ID);
    bucket1.setStartTime(LocalDate.parse("2022-01-01").atStartOfDay().toInstant(ZoneOffset.UTC));

    AssignmentBuckets bucket2 = AssignmentBuckets.create();
    bucket2.setAssignmentId(ASSIGNMENT_ID);
    bucket2.setStartTime(LocalDate.parse("2022-02-01").atStartOfDay().toInstant(ZoneOffset.UTC));

    assignment.setAssignmentBuckets(Arrays.asList(bucket1, bucket2));

    Map<String, Object> mockData1 = new HashMap<String, Object>();
    mockData1.put(ResourceSupplyDetails.WORK_PACKAGE, WORKPACKAGE_ID.toString());
    mockData1.put(ResourceSupplyDetails.RESOURCE_DEMAND, RESOURCE_DEMAND.toString());
    mockData1.put(ResourceSupplyDetails.RESOURCE_SUPPLY, RESOURCE_SUPPLY.toString());
    Row mockRow1 = RowImpl.row(mockData1);
    Optional<Row> optionalMockRow1 = Optional.of(mockRow1);

    when(persistenceServiceMock.run(any(CqnSelect.class))).thenReturn((Result) mockResult)
        .thenReturn((Result) mockResult2);
    when(mockResult.first()).thenReturn(optionalMockRow1);

    classUnderTest.prepareAssignmentDeleteInS4(ASSIGNMENT_ID, RESOURCE_ID, assignment);
    ArgumentCaptor<Delete> argCaptor = ArgumentCaptor.forClass(Delete.class);
    verify(persistenceServiceMock).run(argCaptor.capture());

  }

  @Test
  void correctParametersToUpdateCommandInvocation_nCreate_nUpdate_nDelete() {

    when(supplyDestinationMock.getDestination()).thenReturn(null);

    UpdateSupplyCommand commandMock = mock(UpdateSupplyCommand.class);
    when(commandMock.execute()).thenReturn(null);

    ResourceSupplyDetails resourceSupplyDetails = ResourceSupplyDetails.create();
    resourceSupplyDetails.setWorkPackage(WORKPACKAGE_ID);
    resourceSupplyDetails.setResourceDemand(RESOURCE_DEMAND);
    resourceSupplyDetails.setResourceSupply(RESOURCE_SUPPLY);

    Optional<ResourceSupplyDetails> resourceSupplyDetailsOptional = Optional.of(resourceSupplyDetails);
    when(persistenceServiceMock.run(any(CqnSelect.class)).first(ResourceSupplyDetails.class))
        .thenReturn(resourceSupplyDetailsOptional);

    List<AssignmentBucketsYearMonthAggregate> oldMonthlyAggregatedAssignment = new ArrayList<>();
    List<AssignmentBucketsYearMonthAggregate> newMonthlyAggregatedAssignment = new ArrayList<>();

    AssignmentBucketsYearMonthAggregate old_Jan = AssignmentBucketsYearMonthAggregate.create();
    old_Jan.setAssignmentId(ASSIGNMENT_ID);
    old_Jan.setYearMonth("202001");
    old_Jan.setBookedCapacityInHours(2);
    oldMonthlyAggregatedAssignment.add(old_Jan);

    AssignmentBucketsYearMonthAggregate old_Feb = AssignmentBucketsYearMonthAggregate.create();
    old_Feb.setAssignmentId(ASSIGNMENT_ID);
    old_Feb.setYearMonth("202002");
    old_Feb.setBookedCapacityInHours(2);
    oldMonthlyAggregatedAssignment.add(old_Feb);

    AssignmentBucketsYearMonthAggregate old_Mar = AssignmentBucketsYearMonthAggregate.create();
    old_Mar.setAssignmentId(ASSIGNMENT_ID);
    old_Mar.setYearMonth("202003");
    old_Mar.setBookedCapacityInHours(2);
    oldMonthlyAggregatedAssignment.add(old_Mar);

    AssignmentBucketsYearMonthAggregate old_Apr = AssignmentBucketsYearMonthAggregate.create();
    old_Apr.setAssignmentId(ASSIGNMENT_ID);
    old_Apr.setYearMonth("202004");
    old_Apr.setBookedCapacityInHours(2);
    oldMonthlyAggregatedAssignment.add(old_Apr);

    AssignmentBucketsYearMonthAggregate new_Mar = AssignmentBucketsYearMonthAggregate.create();
    new_Mar.setAssignmentId(ASSIGNMENT_ID);
    new_Mar.setYearMonth("202003");
    new_Mar.setBookedCapacityInHours(3);
    newMonthlyAggregatedAssignment.add(new_Mar);

    AssignmentBucketsYearMonthAggregate new_Apr = AssignmentBucketsYearMonthAggregate.create();
    new_Apr.setAssignmentId(ASSIGNMENT_ID);
    new_Apr.setYearMonth("202004");
    new_Apr.setBookedCapacityInHours(3);
    newMonthlyAggregatedAssignment.add(new_Apr);

    AssignmentBucketsYearMonthAggregate new_May = AssignmentBucketsYearMonthAggregate.create();
    new_May.setAssignmentId(ASSIGNMENT_ID);
    new_May.setYearMonth("202005");
    new_May.setBookedCapacityInHours(3);
    newMonthlyAggregatedAssignment.add(new_May);

    AssignmentBucketsYearMonthAggregate new_Jun = AssignmentBucketsYearMonthAggregate.create();
    new_Jun.setAssignmentId(ASSIGNMENT_ID);
    new_Jun.setYearMonth("202006");
    new_Jun.setBookedCapacityInHours(3);
    newMonthlyAggregatedAssignment.add(new_Jun);

    List<EngmntProjRsceSupDistr> expectedSupplyDistributionListToInsert = new ArrayList<>();
    List<EngmntProjRsceSupDistr> expectedSupplyDistributionListToUpdate = new ArrayList<>();
    List<EngmntProjRsceSupDistr> expectedSupplyDistributionListToDelete = new ArrayList<>();

    EngmntProjRsceSupDistr insertRecord1 = new EngmntProjRsceSupDistr();
    insertRecord1.setWorkPackage(WORKPACKAGE_ID);
    insertRecord1.setResourceDemand(RESOURCE_DEMAND);
    insertRecord1.setResourceSupply(RESOURCE_SUPPLY);
    insertRecord1.setVersion(PLAN_VERSION_ID);
    insertRecord1.setCalendarYear("2020");
    insertRecord1.setCalendarMonth("05");
    insertRecord1.setUnitOfMeasure(UNIT_OF_MEASURE);
    insertRecord1.setQuantity(new BigDecimal(3));

    EngmntProjRsceSupDistr insertRecord2 = new EngmntProjRsceSupDistr();
    insertRecord2.setWorkPackage(WORKPACKAGE_ID);
    insertRecord2.setResourceDemand(RESOURCE_DEMAND);
    insertRecord2.setResourceSupply(RESOURCE_SUPPLY);
    insertRecord2.setVersion(PLAN_VERSION_ID);
    insertRecord2.setCalendarYear("2020");
    insertRecord2.setCalendarMonth("06");
    insertRecord2.setUnitOfMeasure(UNIT_OF_MEASURE);
    insertRecord2.setQuantity(new BigDecimal(3));

    expectedSupplyDistributionListToInsert.add(insertRecord1);
    expectedSupplyDistributionListToInsert.add(insertRecord2);

    EngmntProjRsceSupDistr updateRecord1 = new EngmntProjRsceSupDistr();
    updateRecord1.setWorkPackage(WORKPACKAGE_ID);
    updateRecord1.setResourceDemand(RESOURCE_DEMAND);
    updateRecord1.setResourceSupply(RESOURCE_SUPPLY);
    updateRecord1.setVersion(PLAN_VERSION_ID);
    updateRecord1.setCalendarYear("2020");
    updateRecord1.setCalendarMonth("03");
    updateRecord1.setUnitOfMeasure(UNIT_OF_MEASURE);
    updateRecord1.setQuantity(new BigDecimal(3));

    EngmntProjRsceSupDistr updateRecord2 = new EngmntProjRsceSupDistr();
    updateRecord2.setWorkPackage(WORKPACKAGE_ID);
    updateRecord2.setResourceDemand(RESOURCE_DEMAND);
    updateRecord2.setResourceSupply(RESOURCE_SUPPLY);
    updateRecord2.setVersion(PLAN_VERSION_ID);
    updateRecord2.setCalendarYear("2020");
    updateRecord2.setCalendarMonth("04");
    updateRecord2.setUnitOfMeasure(UNIT_OF_MEASURE);
    updateRecord2.setQuantity(new BigDecimal(3));

    expectedSupplyDistributionListToUpdate.add(updateRecord1);
    expectedSupplyDistributionListToUpdate.add(updateRecord2);

    EngmntProjRsceSupDistr deleteRecord1 = new EngmntProjRsceSupDistr();
    deleteRecord1.setWorkPackage(WORKPACKAGE_ID);
    deleteRecord1.setResourceDemand(RESOURCE_DEMAND);
    deleteRecord1.setResourceSupply(RESOURCE_SUPPLY);
    deleteRecord1.setVersion(PLAN_VERSION_ID);
    deleteRecord1.setCalendarYear("2020");
    deleteRecord1.setCalendarMonth("01");

    EngmntProjRsceSupDistr deleteRecord2 = new EngmntProjRsceSupDistr();
    deleteRecord2.setWorkPackage(WORKPACKAGE_ID);
    deleteRecord2.setResourceDemand(RESOURCE_DEMAND);
    deleteRecord2.setResourceSupply(RESOURCE_SUPPLY);
    deleteRecord2.setVersion(PLAN_VERSION_ID);
    deleteRecord2.setCalendarYear("2020");
    deleteRecord2.setCalendarMonth("02");

    expectedSupplyDistributionListToDelete.add(deleteRecord1);
    expectedSupplyDistributionListToDelete.add(deleteRecord2);

    when(commandHelperMock.getUpdateSupplyCommand(any(), any(), any(), any(), any(), any(), any()))
        .thenReturn(commandMock);

    classUnderTest.prepareAssignmentUpdateInS4(ASSIGNMENT_ID, oldMonthlyAggregatedAssignment,
        newMonthlyAggregatedAssignment);

    verify(mockCollector, times(1)).addSupplyDistributionListToInsert(eq(expectedSupplyDistributionListToInsert));
    verify(mockCollector, times(1)).addSupplyDistributionListToUpdate(eq(expectedSupplyDistributionListToUpdate));
    verify(mockCollector, times(1)).addSupplyDistributionListToDelete(eq(expectedSupplyDistributionListToDelete));
  }

  @Test
  void updateInS4StopsWithExceptionIfDestinationNotFound() {

    when(supplyDestinationMock.getDestination()).thenThrow(new ServiceException("Failed to get Destination"));

    UpdateSupplyCommand commandMock = mock(UpdateSupplyCommand.class);
    when(commandMock.execute()).thenReturn(null);
    when(commandHelperMock.getUpdateSupplyCommand(any(), any(), any(), any(), any(), any(), any()))
        .thenReturn(commandMock);

    List<AssignmentBucketsYearMonthAggregate> oldMonthlyAggregatedAssignment = null;
    List<AssignmentBucketsYearMonthAggregate> newMonthlyAggregatedAssignment = null;

    assertThrows(ServiceException.class, () -> classUnderTest.prepareAssignmentUpdateInS4(ASSIGNMENT_ID,
        oldMonthlyAggregatedAssignment, newMonthlyAggregatedAssignment));
  }

  @Test
  void returnedSupplyFromS4IsCorrectlyMappedToAssignmentAndPersisted() {

    EngmntProjRsceSup supplyInfoInRM = new EngmntProjRsceSup();
    supplyInfoInRM.setWorkPackage(WORKPACKAGE_ID);
    supplyInfoInRM.setResourceDemand(RESOURCE_DEMAND);
    supplyInfoInRM.setWorkforcePersonUserID(RESOURCE_ID);

    Map<String, EngmntProjRsceSup> createSupplyMap = new HashMap<>();
    createSupplyMap.put(ASSIGNMENT_ID, supplyInfoInRM);
    when(mockCreateSupplyCollector.getCreateSupplyMap()).thenReturn(createSupplyMap);

    EngmntProjRsceSup returnedSupplyFromS4 = new EngmntProjRsceSup();
    returnedSupplyFromS4.setWorkPackage(WORKPACKAGE_ID);
    returnedSupplyFromS4.setResourceDemand(RESOURCE_DEMAND);
    returnedSupplyFromS4.setWorkforcePersonUserID(RESOURCE_ID);
    returnedSupplyFromS4.setResourceSupply(RESOURCE_SUPPLY);

    when(commandHelperMock.getUpdateSupplyCommand(any(), any(), any(), any(), any(), any(), any()).execute())
        .thenReturn(Arrays.asList(returnedSupplyFromS4));

    classUnderTest.beforeClose();

    ResourceSupply expectedResourceSupply = ResourceSupply.create();
    expectedResourceSupply.setAssignmentId(ASSIGNMENT_ID);
    expectedResourceSupply.setResourceSupplyId(RESOURCE_SUPPLY);
    List<ResourceSupply> expectedResourceSupplyToInsertList = Arrays.asList(expectedResourceSupply);
    Insert expectedInsert = Insert.into(ResourceSupply_.CDS_NAME).entries(expectedResourceSupplyToInsertList);

    ArgumentCaptor<Insert> argCaptor = ArgumentCaptor.forClass(Insert.class);
    verify(persistenceServiceMock).run(argCaptor.capture());
    verify(mockCreateSupplyCollector).clearAll();

    assertEquals(expectedInsert.toString(), argCaptor.getValue().toString());
  }

  @Test
  void prepareAssignmentCreateInS4InvocationAddsEntriesToCreateSupplyCollectorCorrectly() {

    Assignments assignment = Assignments.create();
    assignment.setId(ASSIGNMENT_ID);
    assignment.setResourceId(RESOURCE_ID);
    assignment.setResourceRequestId(REQUEST_ID);
    assignment.setBookedCapacityInMinutes(420);

    AssignmentBuckets bucket1 = AssignmentBuckets.create();
    bucket1.setAssignmentId(ASSIGNMENT_ID);
    bucket1.setStartTime(LocalDate.parse("2022-01-01").atStartOfDay().toInstant(ZoneOffset.UTC));

    AssignmentBuckets bucket2 = AssignmentBuckets.create();
    bucket2.setAssignmentId(ASSIGNMENT_ID);
    bucket2.setStartTime(LocalDate.parse("2022-02-01").atStartOfDay().toInstant(ZoneOffset.UTC));

    assignment.setAssignmentBuckets(Arrays.asList(bucket1, bucket2));

    EngmntProjRsceSup expectedSupplyToCreate = new EngmntProjRsceSup();
    expectedSupplyToCreate.setQuantity(BigDecimal.valueOf(7));
    expectedSupplyToCreate.setUnitOfMeasure("H");
    expectedSupplyToCreate.setDeliveryOrganization(DELIVERY_ORG_CODE);
    expectedSupplyToCreate.setWorkforcePersonUserID(WORK_ASSIGNMENT_ID);
    expectedSupplyToCreate.setCountry2DigitISOCode(COUNTRY_CODE);
    expectedSupplyToCreate.setKeyDate(LocalDateTime.of(2022, 01, 01, 00, 00));
    expectedSupplyToCreate.setWorkPackage(WORKPACKAGE_ID);
    expectedSupplyToCreate.setResourceDemand(RESOURCE_DEMAND);
    expectedSupplyToCreate.setVersion(PLAN_VERSION_ID);

    AssignmentBucketsYearMonthAggregate yearMonthAggregate1 = AssignmentBucketsYearMonthAggregate.create();
    yearMonthAggregate1.setAssignmentId(ASSIGNMENT_ID);
    yearMonthAggregate1.setYearMonth("202201");
    yearMonthAggregate1.setBookedCapacityInHours(3);

    AssignmentBucketsYearMonthAggregate yearMonthAggregate2 = AssignmentBucketsYearMonthAggregate.create();
    yearMonthAggregate2.setAssignmentId(ASSIGNMENT_ID);
    yearMonthAggregate2.setYearMonth("202202");
    yearMonthAggregate2.setBookedCapacityInHours(4);

    List<AssignmentBucketsYearMonthAggregate> monthlyAggregatedAssignmentAfterUpdate = Arrays
        .asList(yearMonthAggregate1, yearMonthAggregate2);

    EngmntProjRsceSupDistr expectedSupplyDistribution1 = new EngmntProjRsceSupDistr();
    expectedSupplyDistribution1.setVersion(PLAN_VERSION_ID);
    expectedSupplyDistribution1.setCalendarMonth("01");
    expectedSupplyDistribution1.setCalendarYear("2022");
    expectedSupplyDistribution1.setUnitOfMeasure("H");
    expectedSupplyDistribution1.setQuantity(BigDecimal.valueOf(3));

    EngmntProjRsceSupDistr expectedSupplyDistribution2 = new EngmntProjRsceSupDistr();
    expectedSupplyDistribution2.setVersion("1");
    expectedSupplyDistribution2.setCalendarMonth("02");
    expectedSupplyDistribution2.setCalendarYear("2022");
    expectedSupplyDistribution2.setUnitOfMeasure("H");
    expectedSupplyDistribution2.setQuantity(BigDecimal.valueOf(4));

    List<EngmntProjRsceSupDistr> expectedSupplyDistributionRecordList = Arrays.asList(expectedSupplyDistribution1,
        expectedSupplyDistribution2);
    expectedSupplyToCreate.setResourceSupplyDistribution(expectedSupplyDistributionRecordList);

    Result mockRequestDetailResult = mock(Result.class);
    Row mockRequestDetailsRow = mock(Row.class);
    when(mockRequestDetailResult.single()).thenReturn(mockRequestDetailsRow);
    when(mockRequestDetailsRow.get(ResourceRequests.WORKPACKAGE_ID)).thenReturn(WORKPACKAGE_ID);
    when(mockRequestDetailsRow.get(Demands.EXTERNAL_ID)).thenReturn(RESOURCE_DEMAND);

    ResourceOrganizations dummyResourceOrganizations = ResourceOrganizations.create();
    dummyResourceOrganizations.setServiceOrganizationCode(DELIVERY_ORG_CODE);

    Result dummyResult = mock(Result.class);
    when(dummyResult.first(ResourceOrganizations.class)).thenReturn(Optional.of(dummyResourceOrganizations));

    when(persistenceServiceMock.run(any(CqnSelect.class))).thenReturn(mockRequestDetailResult).thenReturn(dummyResult);

    ResourceDetailsForTimeWindow mockResourceDetailsForTimeWindow = ResourceDetailsForTimeWindow.create();
    mockResourceDetailsForTimeWindow.setResourceOrgCode(DELIVERY_ORG_CODE);
    mockResourceDetailsForTimeWindow.setWorkAssignmentID(WORK_ASSIGNMENT_ID);
    mockResourceDetailsForTimeWindow.setCountryCode(COUNTRY_CODE);

    when(temporalQueryHelperMock.getTemporalResourceDetails(any(), any(), any(), any()))
        .thenReturn(Optional.of(mockResourceDetailsForTimeWindow));

    classUnderTest.prepareAssignmentCreateInS4(assignment, monthlyAggregatedAssignmentAfterUpdate);

    verify(mockCreateSupplyCollector).addSupply(ASSIGNMENT_ID, expectedSupplyToCreate);

  }

}