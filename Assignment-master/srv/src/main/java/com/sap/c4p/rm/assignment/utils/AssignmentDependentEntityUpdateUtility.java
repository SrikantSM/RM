package com.sap.c4p.rm.assignment.utils;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

import com.sap.cds.CdsLockTimeoutException;
import com.sap.cds.ql.Delete;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.Upsert;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpsert;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.assignment.gen.MessageKeys;

import com.sap.resourcemanagement.resource.BookedCapacityAggregate;
import com.sap.resourcemanagement.resource.BookedCapacityAggregate_;

import assignmentservice.AssignmentBuckets;
import assignmentservice.Assignments;

@Component
@RequestScope
public class AssignmentDependentEntityUpdateUtility {

  private static final int ZERO = 0;
  private static final Logger LOGGER = LoggerFactory.getLogger(AssignmentDependentEntityUpdateUtility.class);

  private DataProvider dataProvider;
  private PersistenceService persistenceService;

  @Autowired
  public AssignmentDependentEntityUpdateUtility(DataProvider dataProvider, PersistenceService persistenceService) {
    this.dataProvider = dataProvider;
    this.persistenceService = persistenceService;
  }

  public void updateResourceBookedCapacity(Assignments oldAssignmentWithBuckets, Assignments newAssignmentWithBuckets) {

    String resourceId = Optional.ofNullable(oldAssignmentWithBuckets.getResourceId())
        .orElse(newAssignmentWithBuckets.getResourceId());

    Instant oldStart = getAssignmentStartFromBucketList(oldAssignmentWithBuckets);
    Instant newStart = getAssignmentStartFromBucketList(newAssignmentWithBuckets);
    Instant oldEnd = getAssignmentEndFromBucketList(oldAssignmentWithBuckets);
    Instant newEnd = getAssignmentEndFromBucketList(newAssignmentWithBuckets);

    Instant instantToUpdateBookedCapacityFrom = oldStart.isBefore(newStart) ? oldStart : newStart;
    Instant instantToUpdateBookedCapacityTill = oldEnd.isAfter(newEnd) ? oldEnd : newEnd;

    LOGGER.info("Attempting to acquire locks on resource {} from {} to {}", resourceId,
        instantToUpdateBookedCapacityFrom, instantToUpdateBookedCapacityTill);
    acquireLockOnBookedCapacityAggregateTableRecords(resourceId, instantToUpdateBookedCapacityFrom,
        instantToUpdateBookedCapacityTill);

    /*
     * Read the updated value of aggregate buckets. This method would be triggered
     * during the @After event and thus it is expected that the persistence service
     * would return the updated aggregated values taking into account the changes to
     * buckets made in this transaction
     */

    LOGGER.info("Invoking getResourceBookedCapacityAggregate for resourceId {} for period {} to {}", resourceId,
        instantToUpdateBookedCapacityFrom, instantToUpdateBookedCapacityTill);
    List<BookedCapacityAggregate> bookedCapacityAggregateRecordList = dataProvider.getResourceBookedCapacityAggregate(
        resourceId, instantToUpdateBookedCapacityFrom, instantToUpdateBookedCapacityTill);

    LOGGER.info("Upserting {} records now", bookedCapacityAggregateRecordList.size());
    CqnUpsert upsert = Upsert.into(BookedCapacityAggregate_.CDS_NAME).entries(bookedCapacityAggregateRecordList);
    persistenceService.run(upsert);

    LOGGER.info("Deleting records with ZERO bookedCapacity");
    CqnDelete delete = Delete.from(BookedCapacityAggregate_.class)
        .where(r -> r.resourceID().eq(resourceId).and(r.bookedCapacityInMinutes().le(ZERO)));
    persistenceService.run(delete);

  }

  private void acquireLockOnBookedCapacityAggregateTableRecords(String resourceId, Instant lockFrom, Instant lockTill) {
    CqnSelect selectRecordsToLock = Select.from(BookedCapacityAggregate_.class)
        .where(b -> b.resourceID().eq(resourceId).and(b.startTime().between(lockFrom, lockTill))).lock();
    try {
      persistenceService.run(selectRecordsToLock);
      LOGGER.info("Successfully acquired lock for resourceId {} from {} to {}", resourceId, lockFrom, lockTill);
    } catch (CdsLockTimeoutException lockTimeOutException) {
      LOGGER.error(
          "Could not acquire lock on the table {} for resourceId {} between {} to {}. Caught CdsLockTimeoutException: {}",
          BookedCapacityAggregate_.CDS_NAME, resourceId, lockFrom, lockTill, lockTimeOutException);
      // Raising ServiceException to roll back transaction
      throw new ServiceException(HttpStatus.CONFLICT, MessageKeys.RESOURCE_BOOKED_CAPACITY_CHANGED);
    }
  }

  private Instant getAssignmentStartFromBucketList(Assignments assignmentWithBuckets) {
    return Optional.ofNullable(assignmentWithBuckets.getAssignmentBuckets()).isPresent()
        ? assignmentWithBuckets.getAssignmentBuckets().stream().map(AssignmentBuckets::getStartTime)
            .min((a, b) -> a.compareTo(b)).orElse(Instant.MAX)
        : Instant.MAX;
  }

  private Instant getAssignmentEndFromBucketList(Assignments assignmentWithBuckets) {
    return Optional.ofNullable(assignmentWithBuckets.getAssignmentBuckets()).isPresent()
        ? assignmentWithBuckets.getAssignmentBuckets().stream().map(AssignmentBuckets::getStartTime)
            .max((a, b) -> a.compareTo(b)).orElse(Instant.MIN)
        : Instant.MIN;
  }

}
