package com.sap.c4p.rm.assignment.integration;

import static com.sap.c4p.rm.assignment.utils.AssignmentUtility.minutesToHours;
import static com.sap.c4p.rm.assignment.utils.AssignmentUtility.raiseExceptionIfErrorWithTarget;

import java.math.*;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.*;
import java.util.Map.Entry;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.Row;
import com.sap.cds.ql.Delete;
import com.sap.cds.ql.Insert;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.changeset.ChangeSetListener;
import com.sap.cds.services.messages.Messages;
import com.sap.cds.services.persistence.PersistenceService;
import com.sap.cds.services.runtime.CdsRuntime;
import com.sap.cloud.sdk.cloudplatform.resilience.ResilienceRuntimeException;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceSup;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceSupDistr;
import com.sap.cloud.sdk.s4hana.datamodel.odata.services.DefaultCommercialProjectService;

import com.sap.c4p.rm.assignment.config.LoggingMarker;
import com.sap.c4p.rm.assignment.gen.MessageKeys;
import com.sap.c4p.rm.assignment.utils.AssignmentTemporalQueryParameterHelper;
import com.sap.c4p.rm.assignment.utils.HttpStatus;

import com.sap.resourcemanagement.config.ResourceOrganizations;
import com.sap.resourcemanagement.config.ResourceOrganizations_;
import com.sap.resourcemanagement.project.Demands;
import com.sap.resourcemanagement.resource.ResourceDetailsForTimeWindow;
import com.sap.resourcemanagement.resourcerequest.ResourceRequests;
import com.sap.resourcemanagement.resourcerequest.ResourceRequests_;
import com.sap.resourcemanagement.supply.AssignmentBucketsYearMonthAggregate;
import com.sap.resourcemanagement.supply.ResourceSupply;
import com.sap.resourcemanagement.supply.ResourceSupplyDetails;
import com.sap.resourcemanagement.supply.ResourceSupplyDetails_;
import com.sap.resourcemanagement.supply.ResourceSupply_;

import assignmentservice.AssignmentBuckets;
import assignmentservice.Assignments;

@Component
public class AssignmentS4Integration implements ChangeSetListener {

  private static final String PLAN_VERSION_ID = "1";
  private static final String HOUR = "H";
  private static final String ERROR_STRING = " Error message: {}";

  private CdsRuntime cdsRuntime;
  private SupplyDestination supplyDestination;
  private DefaultCommercialProjectService service;
  private PersistenceService persistenceService;
  private static final Logger LOGGER = LoggerFactory.getLogger(AssignmentS4Integration.class);
  private static final Marker INT_CREATE_MARKER = LoggingMarker.INTEGRATION_CREATE_MARKER.getMarker();
  private static final Marker INT_DELETE_MARKER = LoggingMarker.INTEGRATION_DELETE_MARKER.getMarker();
  private static final Marker INT_CHANGE_MARKER = LoggingMarker.INTEGRATION_CHANGE_MARKER.getMarker();
  private SupplyCommandHelper commandHelper;
  private AssignmentTemporalQueryParameterHelper serviceHandlerContext;

  private LocalDateTime assignmentStartDate = LocalDateTime.now();
  private UpdateSupplyDistributionListCollector updateSupplyDistributionListCollector;
  private SupplyErrorMessageParser messageParser;
  private Messages messages;
  private CreateSupplyCollector createSupplyCollector;
  private DeleteSupplyCollector deleteSupplyCollector;
  private UpdateSupplyDistrCollector updateSupplyDistrCollector;

  @Autowired
  public AssignmentS4Integration(PersistenceService persistenceService, CdsRuntime cdsRuntime, Messages messages) {
    this.supplyDestination = new SupplyDestination();
    service = new DefaultCommercialProjectService();
    this.persistenceService = persistenceService;
    this.cdsRuntime = cdsRuntime;
    commandHelper = new SupplyCommandHelper();
    this.serviceHandlerContext = new AssignmentTemporalQueryParameterHelper();
    this.updateSupplyDistributionListCollector = new UpdateSupplyDistributionListCollector();
    this.createSupplyCollector = new CreateSupplyCollector();
    this.updateSupplyDistrCollector = new UpdateSupplyDistrCollector();
    this.deleteSupplyCollector = new DeleteSupplyCollector();
    this.setMessageParser(new SupplyErrorMessageParser());
    this.messages = messages;
  }

  public void prepareAssignmentCreateInS4(Assignments assignment,
  List<AssignmentBucketsYearMonthAggregate> monthlyAggregatedAssignmentAfterUpdate) {

    EngmntProjRsceSup supplyToCreate = new EngmntProjRsceSup();

    String resourceId = assignment.getResourceId();
    String resourceRequestId = assignment.getResourceRequestId();

    populateDemandDetails(supplyToCreate, resourceRequestId);
    populateResourceDetails(supplyToCreate, resourceId, assignment);

    int bookedCapacityInMinutes = assignment.getBookedCapacityInMinutes();
    BigDecimal quantity = new BigDecimal(minutesToHours(bookedCapacityInMinutes));
    supplyToCreate.setQuantity(quantity);
    supplyToCreate.setUnitOfMeasure(HOUR);

    Optional<Instant> assignmentStartInstantOptional = assignment.getAssignmentBuckets().stream()
        .map(AssignmentBuckets::getStartTime).min((a, b) -> a.compareTo(b));
    Instant assignmentStartInstant = assignmentStartInstantOptional.isPresent() ? assignmentStartInstantOptional.get()
        : Instant.now();

    supplyToCreate.setKeyDate(LocalDateTime.ofInstant(assignmentStartInstant, ZoneOffset.UTC));

    List<EngmntProjRsceSupDistr> supplyDistributionRecordList = new ArrayList<>(
        monthlyAggregatedAssignmentAfterUpdate.size());
    for (AssignmentBucketsYearMonthAggregate currRecord : monthlyAggregatedAssignmentAfterUpdate) {
      EngmntProjRsceSupDistr currSupplyDistRecord = new EngmntProjRsceSupDistr();
      currSupplyDistRecord.setVersion(PLAN_VERSION_ID);
      currSupplyDistRecord.setCalendarMonth(currRecord.getYearMonth().substring(4));
      currSupplyDistRecord.setCalendarYear(currRecord.getYearMonth().substring(0, 4));
      currSupplyDistRecord.setUnitOfMeasure(HOUR);
      currSupplyDistRecord.setQuantity(new BigDecimal(currRecord.getBookedCapacityInHours()));
      supplyDistributionRecordList.add(currSupplyDistRecord);
    }
    supplyToCreate.setResourceSupplyDistribution(supplyDistributionRecordList);

    createSupplyCollector.addSupply(assignment.getId(), supplyToCreate);

  }

  public void prepareAssignmentDeleteInS4(String assignmentId, String resourceId, Assignments deletedAssignmentWithBuckets) {

    LOGGER.info(INT_DELETE_MARKER, "Preparing assignment deletion in S4");

    EngmntProjRsceSup supplyToDelete = getSupplyInformationFromAssignmentId(assignmentId);
  
    supplyToDelete.setWorkforcePersonUserID(getWorkforcePersonUserID(supplyToDelete, resourceId, deletedAssignmentWithBuckets));
    
    deleteSupplyCollector.addSupply(assignmentId, supplyToDelete);
    persistenceService
        .run(Delete.from(ResourceSupply_.CDS_NAME).where(b -> b.get(ResourceSupply.ASSIGNMENT_ID).eq(assignmentId)));
  }

  public void prepareAssignmentUpdateInS4(final String assignmentId,
      final List<AssignmentBucketsYearMonthAggregate> oldMonthlyAggregatedAssignment,
      List<AssignmentBucketsYearMonthAggregate> newMonthlyAggregatedAssignment) {

    List<EngmntProjRsceSupDistr> resourceSupplyDistributionListToInsert = new ArrayList<>();
    List<EngmntProjRsceSupDistr> resourceSupplyDistributionListToUpdate = new ArrayList<>();
    List<EngmntProjRsceSupDistr> resourceSupplyDistributionListToDelete = new ArrayList<>();

    LOGGER.info(INT_CHANGE_MARKER, "Preparing S4 supply update for corresponding assigmment {}", assignmentId);

    Optional<ResourceSupplyDetails> supplyDetails = persistenceService.run(Select.from(ResourceSupplyDetails_.class)
        .columns(ResourceSupplyDetails_::_all).where(b -> b.assignment_ID().eq(assignmentId)))
        .first(ResourceSupplyDetails.class);

    if (!supplyDetails.isPresent()) {
      LOGGER.info(INT_CHANGE_MARKER, "Supply details corresponding to assignment {} are not found", assignmentId);
      throw new ServiceException(HttpStatus.BAD_REQUEST, "Could not find existing supply information");
    }

    String workPackageId = supplyDetails.get().getWorkPackage();
    String resourceDemand = supplyDetails.get().getResourceDemand();
    String resourceSupply = supplyDetails.get().getResourceSupply();

    LOGGER.info(INT_CHANGE_MARKER,
        "Supply details are successfully retrieved with workpackage {}, demand {} and resourceSupply {}", workPackageId,
        resourceDemand, resourceSupply);

    Map<String, Integer> oldMonthlyAssignmentDistributionMap = createMapFromMonthlyAssignmentDistributionList(
        oldMonthlyAggregatedAssignment);

    for (AssignmentBucketsYearMonthAggregate currYearMonthRecord : newMonthlyAggregatedAssignment) {
      String currYearMonth = currYearMonthRecord.getYearMonth();
      Integer newStaffedHours = currYearMonthRecord.getBookedCapacityInHours();
      Integer oldStaffedHours = oldMonthlyAssignmentDistributionMap.get(currYearMonth);

      EngmntProjRsceSupDistr supplyDistributionRecord = new EngmntProjRsceSupDistr();
      supplyDistributionRecord.setWorkPackage(workPackageId);
      supplyDistributionRecord.setResourceDemand(resourceDemand);
      supplyDistributionRecord.setResourceSupply(resourceSupply);
      supplyDistributionRecord.setVersion(PLAN_VERSION_ID);
      supplyDistributionRecord.setCalendarYear(currYearMonth.substring(0, 4));
      supplyDistributionRecord.setCalendarMonth(currYearMonth.substring(4));
      supplyDistributionRecord.setQuantity(new BigDecimal(newStaffedHours));
      supplyDistributionRecord.setUnitOfMeasure(HOUR);

      if (oldStaffedHours != null) {
        if (!oldStaffedHours.equals(newStaffedHours)) {
          LOGGER.info(INT_CHANGE_MARKER, "Staffed hours for the month of {} to be updated", currYearMonth);
          // Current month staffed hours has changed and needs to be updated
          resourceSupplyDistributionListToUpdate.add(supplyDistributionRecord);
        }
      } else {
        LOGGER.info(INT_CHANGE_MARKER, "Staffed hours for the month of {} to be newly added", currYearMonth);
        // there were no staffed hour on this month before
        resourceSupplyDistributionListToInsert.add(supplyDistributionRecord);
      }
      oldMonthlyAssignmentDistributionMap.remove(currYearMonth);
    }

    // Finally all the old records that did not find a counterpart among the new
    // records to be deleted
    for (String remainingOldYearMonth : oldMonthlyAssignmentDistributionMap.keySet()) {
      LOGGER.info(INT_CHANGE_MARKER, "Supply {} will be deleted", resourceSupply);
      EngmntProjRsceSupDistr deleteRecord = new EngmntProjRsceSupDistr();
      deleteRecord.setWorkPackage(workPackageId);
      deleteRecord.setResourceDemand(resourceDemand);
      deleteRecord.setResourceSupply(resourceSupply);
      deleteRecord.setVersion(PLAN_VERSION_ID);
      deleteRecord.setCalendarYear(remainingOldYearMonth.substring(0, 4));
      deleteRecord.setCalendarMonth(remainingOldYearMonth.substring(4));

      resourceSupplyDistributionListToDelete.add(deleteRecord);
    }

    LOGGER.info(INT_CHANGE_MARKER,
        " {} records will be inserted, {} records will be updated and {} records will be deleted",
        resourceSupplyDistributionListToInsert.size(), resourceSupplyDistributionListToUpdate.size(),
        resourceSupplyDistributionListToDelete.size());

    updateSupplyDistributionListCollector.addSupplyDistributionListToInsert(resourceSupplyDistributionListToInsert);
    updateSupplyDistributionListCollector.addSupplyDistributionListToUpdate(resourceSupplyDistributionListToUpdate);
    updateSupplyDistributionListCollector.addSupplyDistributionListToDelete(resourceSupplyDistributionListToDelete);

    updateSupplyDistrCollector.addMapsForSupplyDistr(resourceSupplyDistributionListToInsert, assignmentId);
    updateSupplyDistrCollector.addMapsForSupplyDistr(resourceSupplyDistributionListToUpdate, assignmentId);
    updateSupplyDistrCollector.addMapsForSupplyDistr(resourceSupplyDistributionListToDelete, assignmentId);

    LOGGER.info(INT_CHANGE_MARKER, " {} {} records will be added to updateSupplyDistrCollector ",
        updateSupplyDistrCollector.getSize(), assignmentId);

  }

  @Override
  public void beforeClose() {

    LOGGER.info(INT_CHANGE_MARKER, "In beforeClose() changeset handler");
    try {

      Set<Entry<String, EngmntProjRsceSup>> supplyToCreateSet = createSupplyCollector.getCreateSupplyMap().entrySet();

      List<EngmntProjRsceSup> returnedSupplyFromS4List = commandHelper
          .getUpdateSupplyCommand(supplyDestination.getDestination(), service,
              updateSupplyDistributionListCollector.getSupplyDistributionListToInsert(),
              updateSupplyDistributionListCollector.getSupplyDistributionListToUpdate(),
              updateSupplyDistributionListCollector.getSupplyDistributionListToDelete(),
              createSupplyCollector.getCreateSupplyMap().entrySet().stream().map(Entry::getValue)
                  .collect(Collectors.toList()),
              deleteSupplyCollector.getDeleteSupplyMap().entrySet().stream().map(Entry::getValue)
                  .collect(Collectors.toList()))
          .execute();

      List<ResourceSupply> resourceSupplyToInsertInRMList = new ArrayList<>(returnedSupplyFromS4List.size());

      /*
       * Before executing S4 integration we remember in RM which records were meant to
       * be pushed as new supply. S4 would create the corresponding supply and return
       * the supply Ids in response. With the help of mapping <AssignmentId,
       * EngmntProjRsceSup> stored in supplyToCreateSet, we find the assignmentId in
       * RM for each returnedS4SupplyId by comparing fields of object
       * EngmntProjRsceSup returned by S4 below
       */
      for (Entry<String, EngmntProjRsceSup> supplyToCreateEntry : supplyToCreateSet) {
        // for each remembered <Assignment, EngmntProjRsceSup> mapping
        EngmntProjRsceSup supplyToCreate = supplyToCreateEntry.getValue();
        for (EngmntProjRsceSup returnedSupplyFromS4 : returnedSupplyFromS4List) {
          // find the corresponding supply returned from S4 by checking equality for the
          // three fields
          if (returnedSupplyFromS4.getWorkPackage().equals(supplyToCreate.getWorkPackage())
              && returnedSupplyFromS4.getResourceDemand().equals(supplyToCreate.getResourceDemand())
              && returnedSupplyFromS4.getWorkforcePersonUserID().equals(supplyToCreate.getWorkforcePersonUserID())) {

            ResourceSupply resourceSupply = ResourceSupply.create();
            resourceSupply.setAssignmentId(supplyToCreateEntry.getKey());
            resourceSupply.setResourceSupplyId(returnedSupplyFromS4.getResourceSupply());
            resourceSupplyToInsertInRMList.add(resourceSupply);
          }
        }
      }

      persistenceService.run(Insert.into(ResourceSupply_.CDS_NAME).entries(resourceSupplyToInsertInRMList));

    } catch (ResilienceRuntimeException e) {
      LOGGER.error(INT_CHANGE_MARKER, "Caught ResilenceRuntimeException while assignment change");
      String[] errorMessage = (String[]) messageParser.getErrorMessage(e);
      LOGGER.error(INT_CHANGE_MARKER, "Assignment change failed because of exception", e);
      if (errorMessage != null) {
        if (errorMessage[1] != null) {
          EngmntProjRsceSupDistr supplyDistributionRecord = getRecordBasedOnContentId(errorMessage);
          if (supplyDistributionRecord != null) {
            LOGGER.info(INT_CHANGE_MARKER,
                "supplyDistributionRecord was not empty. And now using it, for the corresponding distribution record an exception will be raised ");
            raiseExceptionForSupplyDistr(supplyDistributionRecord, errorMessage);
          } else {
            LOGGER.info(INT_CHANGE_MARKER,
                "content ID is present. but is out of bounds. So the error message{} should be displayed ");
            LOGGER.error(INT_CHANGE_MARKER, ERROR_STRING, errorMessage[0]);
            throw new ServiceException(HttpStatus.BAD_REQUEST, errorMessage[0]);
          }
        } else {
          LOGGER.info(INT_CHANGE_MARKER, "content ID is not present.So the error message{} should be displayed ");
          LOGGER.error(INT_CHANGE_MARKER, ERROR_STRING, errorMessage[0]);
          throw new ServiceException(HttpStatus.BAD_REQUEST, errorMessage[0]);
        }
      } else {
        LOGGER.info(INT_CHANGE_MARKER,
            "The error message was empty so now atleast the 400 bad request should be raised  ");
        throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.ASSIGNMENT_NOT_CHANGED);
      }
    } catch (final Exception e) {
      LOGGER.error(INT_CHANGE_MARKER, "Caught Generic Exception while assignment change");
      LOGGER.error(INT_CHANGE_MARKER, "Assignment change failed because of exception", e);
      String errorMessage = e.getMessage();
      LOGGER.error(INT_CHANGE_MARKER, ERROR_STRING, errorMessage);
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.ASSIGNMENT_NOT_CHANGED);
    } finally {
      updateSupplyDistributionListCollector.clearAll();
      updateSupplyDistrCollector.clearAll();
      createSupplyCollector.clearAll();
      deleteSupplyCollector.clearAll();
    }
  }

  String getAssignmentIdForSupplyDistr(EngmntProjRsceSupDistr supplyDistributionRecord) {

    Map<EngmntProjRsceSupDistr, String> supplyDistToCreate = updateSupplyDistrCollector.getCreateSupplyMap();

    String assignmentId = supplyDistToCreate.get(supplyDistributionRecord);
    LOGGER.warn(INT_CHANGE_MARKER,
        "Assignment ID in the getAssignmentIdForSupplyDistr method {} via the AssignmentId  new concept ",
        assignmentId);
    return assignmentId;

  }

  EngmntProjRsceSupDistr getRecordBasedOnContentId(String[] erorrMessage) {


    int countOfSupplyDistributionListToInsert = updateSupplyDistributionListCollector.supplyDistributionListToInsert.size();
    int countOfSupplyDistributionListToUpdate = updateSupplyDistributionListCollector.supplyDistributionListToUpdate.size();
    int countOfSupplyDistributionListToDelete = updateSupplyDistributionListCollector.supplyDistributionListToDelete.size();

    int contentId = Integer.parseInt(erorrMessage[1]);
    LOGGER.warn(INT_CHANGE_MARKER, "The contentId is {} in method GetRecordBasedOnContentID ", contentId);

    int countSupplyToCreate = createSupplyCollector.getSize();

    //Assumption: The create supply is always executed first, and hence the content ID will also start with that.
    //Refer to the order in run method of the UpdateSupplyCommand.java
    if (contentId <= countSupplyToCreate) {

      String assignmentId = getAssignmentIdForCreateSupply(contentId);
      String errorMessageToUI = erorrMessage[0];
      this.messages.error(errorMessageToUI);
      raiseExceptionIfErrorWithTarget(messages, assignmentId);
    }
    contentId = contentId - countSupplyToCreate;

    int countSupplyToDelete = deleteSupplyCollector.getSize();

    //Assumption: The delete supply will be handled next
    if (contentId <= countSupplyToDelete) {

      String assignmentId = getAssignmentIdForDeleteSupply(contentId);
      String errorMessageToUI = erorrMessage[0];
      this.messages.error(errorMessageToUI);
      raiseExceptionIfErrorWithTarget(messages, assignmentId);
    }

    //Then comes the supply distribution updates in the order of insert, update and delete.
    if (contentId <= countOfSupplyDistributionListToInsert) {
      EngmntProjRsceSupDistr supplyDistributionToInsertRecord = updateSupplyDistributionListCollector.supplyDistributionListToInsert
          .get(contentId - 1);
      String workPackageId = supplyDistributionToInsertRecord.getWorkPackage();
      String resourceDemand = supplyDistributionToInsertRecord.getResourceDemand();
      String resourceSupply = supplyDistributionToInsertRecord.getResourceSupply();

      LOGGER.info(INT_CHANGE_MARKER,
          "Supply details are successfully retrieved for supplyDistributionToInsertRecord with workpackage {}, demand {} and resourceSupply {}",
          workPackageId, resourceDemand, resourceSupply);
      LOGGER.info(INT_CHANGE_MARKER,
          "In GetRecordBasedOnContentID method {} is content ID.{} Records found in supplyDistributionListToInsert",
          contentId, countOfSupplyDistributionListToInsert);
      return supplyDistributionToInsertRecord;
    }

    contentId = contentId - countOfSupplyDistributionListToInsert;
    if (contentId <= countOfSupplyDistributionListToUpdate) {
      EngmntProjRsceSupDistr supplyDistributionToUpdateRecord = updateSupplyDistributionListCollector.supplyDistributionListToUpdate
          .get(contentId - 1);
      String workPackageId = supplyDistributionToUpdateRecord.getWorkPackage();
      String resourceDemand = supplyDistributionToUpdateRecord.getResourceDemand();
      String resourceSupply = supplyDistributionToUpdateRecord.getResourceSupply();

      LOGGER.info(INT_CHANGE_MARKER,
          "Supply details are successfully retrieved for supplyDistributionToUpdateRecord with workpackage {}, demand {} and resourceSupply {}",
          workPackageId, resourceDemand, resourceSupply);
      LOGGER.info(INT_CHANGE_MARKER,
          "In GetRecordBasedOnContentID method {} is content ID.{} Records found in supplyDistributionListToUpdate",
          contentId, countOfSupplyDistributionListToUpdate);
      return supplyDistributionToUpdateRecord;
    }

    contentId = contentId - countOfSupplyDistributionListToUpdate;
    if (contentId <= countOfSupplyDistributionListToDelete) {
      EngmntProjRsceSupDistr supplyDistributionToDeleteRecord = updateSupplyDistributionListCollector.supplyDistributionListToDelete
          .get(contentId - 1);
      String workPackageId = supplyDistributionToDeleteRecord.getWorkPackage();
      String resourceDemand = supplyDistributionToDeleteRecord.getResourceDemand();
      String resourceSupply = supplyDistributionToDeleteRecord.getResourceSupply();

      LOGGER.info(INT_CHANGE_MARKER,
          "Supply details are successfully retrieved for supplyDistributionToDeleteRecord with workpackage {}, demand {} and resourceSupply {}",
          workPackageId, resourceDemand, resourceSupply);
      LOGGER.info(INT_CHANGE_MARKER,
          "In GetRecordBasedOnContentID method {} is content ID.{} Records found in supplyDistributionListToUpdate",
          contentId, countOfSupplyDistributionListToDelete);

      return supplyDistributionToDeleteRecord;
    }
    return null;
  }

  private void raiseExceptionForSupplyDistr(EngmntProjRsceSupDistr supplyDistributionRecord, String[] errorMessage) {
    String assignmentId = getAssignmentIdForSupplyDistr(supplyDistributionRecord);
    String errorMessageToUI = errorMessage[0];
    this.messages.error(errorMessageToUI);
    raiseExceptionIfErrorWithTarget(messages, assignmentId);
  }

  private String getAssignmentIdForCreateSupply(int contentId) {
    List<EngmntProjRsceSup> supplyToCreateList = createSupplyCollector.getCreateSupplyMap().entrySet().stream()
        .map(Entry::getValue).collect(Collectors.toList());
    LOGGER.warn(INT_CHANGE_MARKER,
        "Reached here because there is a softbook to hard book conversion. check for the distribution record is already completed.current content ID: {}",
        contentId);
    EngmntProjRsceSup engmntProjRsceSuprecord = supplyToCreateList.get(contentId - 1);
    Set<Entry<String, EngmntProjRsceSup>> supplyToCreateSet = createSupplyCollector.getCreateSupplyMap().entrySet();
    for (Entry<String, EngmntProjRsceSup> supplyToCreateEntry : supplyToCreateSet) {
      EngmntProjRsceSup supplyToCreate = supplyToCreateEntry.getValue();
      // for each remembered <Assignment, EngmntProjRsceSup> mapping
      if (engmntProjRsceSuprecord.getWorkPackage().equals(supplyToCreate.getWorkPackage())
          && engmntProjRsceSuprecord.getResourceDemand().equals(supplyToCreate.getResourceDemand())
          && engmntProjRsceSuprecord.getWorkforcePersonUserID().equals(supplyToCreate.getWorkforcePersonUserID())) {

        String assignmentId = supplyToCreateEntry.getKey();
        String workPackageId = engmntProjRsceSuprecord.getWorkPackage();
        String resourceDemand = engmntProjRsceSuprecord.getResourceDemand();
        String resourceSupply = engmntProjRsceSuprecord.getResourceSupply();

        LOGGER.info(INT_CHANGE_MARKER,
            "Supply details are successfully retrieved for engmntProjRsceSuprecord with workpackage {}, demand {} and resourceSupply {}",
            workPackageId, resourceDemand, resourceSupply);
        LOGGER.warn(INT_CHANGE_MARKER,
            "A matching record in the createSupplyCollector was found.The assignment ID and corresponding contentID{} {}",
            assignmentId, contentId);
        return assignmentId;
      }
    }
    return null;
  }

  private String getAssignmentIdForDeleteSupply(int contentId) {

    List<EngmntProjRsceSup> supplyToDeleteList = deleteSupplyCollector.getDeleteSupplyMap().entrySet().stream().map(Entry::getValue).collect(Collectors.toList());

    LOGGER.warn(INT_CHANGE_MARKER, "Reached here because an assignment has been deleted. Current content ID: {}", contentId);

    EngmntProjRsceSup engmntProjRsceSuprecord = supplyToDeleteList.get(contentId - 1);
    Set<Entry<String, EngmntProjRsceSup>> supplyToDeleteSet = deleteSupplyCollector.getDeleteSupplyMap().entrySet();
    for (Entry<String, EngmntProjRsceSup> supplyToDeleteEntry : supplyToDeleteSet) {
      EngmntProjRsceSup supplyToDelete = supplyToDeleteEntry.getValue();
      
      if (engmntProjRsceSuprecord.getWorkPackage().equals(supplyToDelete.getWorkPackage())
          && engmntProjRsceSuprecord.getResourceDemand().equals(supplyToDelete.getResourceDemand())
          && engmntProjRsceSuprecord.getWorkforcePersonUserID().equals(supplyToDelete.getWorkforcePersonUserID())) {

        String assignmentId = supplyToDeleteEntry.getKey();
        String workPackageId = engmntProjRsceSuprecord.getWorkPackage();
        String resourceDemand = engmntProjRsceSuprecord.getResourceDemand();
        String resourceSupply = engmntProjRsceSuprecord.getResourceSupply();

        LOGGER.info(INT_CHANGE_MARKER,
            "Supply details are successfully retrieved for engmntProjRsceSuprecord with workpackage {}, demand {} and resourceSupply {}",
            workPackageId, resourceDemand, resourceSupply);
        LOGGER.warn(INT_CHANGE_MARKER,
            "A matching record in the deleteSupplyCollector was found.The assignment ID and corresponding contentID{} {}",
            assignmentId, contentId);
        return assignmentId;
      }
    }
    return null;
  }

  private Map<String, Integer> createMapFromMonthlyAssignmentDistributionList(
      List<AssignmentBucketsYearMonthAggregate> monthlyAggregatedAssignmentList) {

    Map<String, Integer> mapOfAssignmentDistribution = new LinkedHashMap<>(monthlyAggregatedAssignmentList.size());
    for (AssignmentBucketsYearMonthAggregate assignmentRecord : monthlyAggregatedAssignmentList) {
      String yearMonth = assignmentRecord.getYearMonth();
      mapOfAssignmentDistribution.put(yearMonth, assignmentRecord.getBookedCapacityInHours());
    }
    return mapOfAssignmentDistribution;
  }

  private void populateResourceDetails(EngmntProjRsceSup supplyHeader, String resourceId, Assignments assignments) {

    List<AssignmentBuckets> listAssignmentBuckets = getAssignmentBucketsSortedByDate(assignments);
    Optional<ResourceDetailsForTimeWindow> resourceDetails = getTemporalResourceDetails(supplyHeader, resourceId, listAssignmentBuckets);

    if (!resourceDetails.isPresent()) {
      LOGGER.error(INT_CREATE_MARKER,
          "Resource with ID {} has no employment information for assignment period {} to {}", resourceId,
          listAssignmentBuckets.get(0).getStartTime(),
          listAssignmentBuckets.get(listAssignmentBuckets.size() - 1).getStartTime());
      throw new ServiceException(HttpStatus.BAD_REQUEST,
          "Resource employment information was not found during assignment period");
    }

    String resourceOrgCode = resourceDetails.get().getResourceOrgCode();
    String deliveryOrgCode = getDeliveryOrgForResourceOrg(resourceOrgCode);

    supplyHeader.setDeliveryOrganization(deliveryOrgCode);
    supplyHeader.setWorkforcePersonUserID(resourceDetails.get().getWorkAssignmentID());
    supplyHeader.setCountry2DigitISOCode(resourceDetails.get().getCountryCode());
    supplyHeader.setKeyDate(assignmentStartDate);
  }

  Optional<ResourceDetailsForTimeWindow> getTemporalResourceDetails(EngmntProjRsceSup supplyHeader, String resourceId, List<AssignmentBuckets> listAssignmentBuckets) {
    return this.serviceHandlerContext
        .getTemporalResourceDetails(listAssignmentBuckets, cdsRuntime, resourceId, persistenceService);
  }

  private String getWorkforcePersonUserID(EngmntProjRsceSup supplyHeader, String resourceId, Assignments assignments) {

    List<AssignmentBuckets> listAssignmentBuckets = getAssignmentBucketsSortedByDate(assignments);
    Optional<ResourceDetailsForTimeWindow> resourceDetails = getTemporalResourceDetails(supplyHeader, resourceId, listAssignmentBuckets);

    if (resourceDetails.isPresent()) {
      return resourceDetails.get().getWorkAssignmentID();
    } else return null;
  }

  private String getDeliveryOrgForResourceOrg(String resourceOrgCode) {

    CqnSelect selectServiceOrg = Select.from(ResourceOrganizations_.class).columns(ResourceOrganizations_::_all)
        .where(b -> b.displayId().eq(resourceOrgCode));
    Optional<ResourceOrganizations> result = persistenceService.run(selectServiceOrg)
        .first(ResourceOrganizations.class);

    if (result.isPresent()) {
      return result.get().getServiceOrganizationCode();
    }
    throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.RESORG_NOT_LINKED_TO_SERV_ORG, resourceOrgCode);
  }

  private void populateDemandDetails(EngmntProjRsceSup supplyHeader, String resourceRequestId) {

    Row requestS4Details = persistenceService.run(Select.from(ResourceRequests_.CDS_NAME)
        .columns(b -> b.to(ResourceRequests.DEMAND).get(Demands.EXTERNAL_ID),
            b -> b.get(ResourceRequests.WORKPACKAGE_ID))
        .where(b -> b.get(ResourceRequests.ID).eq(resourceRequestId))).single();

    supplyHeader.setWorkPackage(requestS4Details.get(ResourceRequests.WORKPACKAGE_ID).toString());
    supplyHeader.setResourceDemand(requestS4Details.get(Demands.EXTERNAL_ID).toString());
    supplyHeader.setVersion(PLAN_VERSION_ID);
  }

  private EngmntProjRsceSup getSupplyInformationFromAssignmentId(String assignmentId) {

    Optional<Row> supplyDetails = persistenceService.run(Select.from(ResourceSupplyDetails_.CDS_NAME)
        .columns(b -> b.get(ResourceSupplyDetails.WORK_PACKAGE), b -> b.get(ResourceSupplyDetails.RESOURCE_DEMAND),
            b -> b.get(ResourceSupplyDetails.RESOURCE_SUPPLY))
        .where(b -> b.get(ResourceSupplyDetails.ASSIGNMENT_ID).eq(assignmentId))).first();

    if (!supplyDetails.isPresent()) {
      LOGGER.error(INT_DELETE_MARKER, "Supply information was not found for assignment {}", assignmentId);
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.MISSING_SUPPLY_INFORMATION);
    }
    EngmntProjRsceSup supplyHeader = new EngmntProjRsceSup();
    supplyHeader.setWorkPackage(supplyDetails.get().get(ResourceSupplyDetails.WORK_PACKAGE).toString());
    supplyHeader.setResourceDemand(supplyDetails.get().get(ResourceSupplyDetails.RESOURCE_DEMAND).toString());
    supplyHeader.setVersion(PLAN_VERSION_ID);
    supplyHeader.setResourceSupply(supplyDetails.get().get(ResourceSupplyDetails.RESOURCE_SUPPLY).toString());

    return supplyHeader;
  }

  private List<AssignmentBuckets> getAssignmentBucketsSortedByDate(Assignments assignmentRecord) {
    List<AssignmentBuckets> listAssignmentBuckets = assignmentRecord.getAssignmentBuckets().stream()
        .collect(Collectors.toList());

    Comparator<AssignmentBuckets> assignmentBucketsComparator = (o1, o2) -> o1.getStartTime()
        .compareTo(o2.getStartTime());

    Collections.sort(listAssignmentBuckets, assignmentBucketsComparator);
    return listAssignmentBuckets;
  }

  public void setSupplyDestination(SupplyDestination supplyDestination) {
    this.supplyDestination = supplyDestination;
  }

  public void setCommandHelper(SupplyCommandHelper commandHelper) {
    this.commandHelper = commandHelper;
  }

  public void setServiceHandlerContext(AssignmentTemporalQueryParameterHelper serviceHandlerContext) {
    this.serviceHandlerContext = serviceHandlerContext;
  }

  public void setUpdateSupplyDistributionListCollector(
      UpdateSupplyDistributionListCollector updateSupplyDistributionListCollector) {
    this.updateSupplyDistributionListCollector = updateSupplyDistributionListCollector;
  }

  public final void setMessageParser(SupplyErrorMessageParser messageParser) {
    this.messageParser = messageParser;
  }

  public void setUpdateSupplyDistrCollector(UpdateSupplyDistrCollector updateSupplyDistrCollector) {
    this.updateSupplyDistrCollector = updateSupplyDistrCollector;
  }

  public void setCreateSupplyCollector(CreateSupplyCollector createSupplyCollector) {
    this.createSupplyCollector = createSupplyCollector;
  }

  public void setDeleteSupplyCollector(DeleteSupplyCollector deleteSupplyCollector) {
    this.deleteSupplyCollector = deleteSupplyCollector;
  }

  public void setMessages(Messages messages) {
    this.messages = messages;
  }

}