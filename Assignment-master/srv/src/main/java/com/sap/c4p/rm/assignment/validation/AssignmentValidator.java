package com.sap.c4p.rm.assignment.validation;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.EmptyResultException;
import com.sap.cds.feature.xsuaa.XsuaaUserInfo;
import com.sap.cds.ql.cqn.CqnAnalyzer;
import com.sap.cds.services.EventContext;
import com.sap.cds.services.cds.CdsUpdateEventContext;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.messages.Messages;
import com.sap.cds.services.request.UserInfo;
import com.sap.cds.services.runtime.CdsRuntime;
import com.sap.cds.services.runtime.RequestContextRunner;

import com.sap.c4p.rm.assignment.config.LoggingMarker;
import com.sap.c4p.rm.assignment.gen.MessageKeys;
import com.sap.c4p.rm.assignment.utils.AssignmentStatusValidationUtility;
import com.sap.c4p.rm.assignment.utils.DataProvider;

import com.sap.resourcemanagement.resource.Capacity;
import com.sap.resourcemanagement.resource.ResourceDetailsForTimeWindow;
import com.sap.resourcemanagement.resource.Types;
import com.sap.resourcemanagement.resourcerequest.ResourceRequests;
import com.sap.resourcemanagement.workforce.workassignment.ExtnWorkAssignmentFirstJobDetails;
import com.sap.resourcemanagement.workforce.workassignment.WorkAssignmentFirstJobDetails;
import com.sap.resourcemanagement.workforce.workassignment.WorkAssignments;

import assignment.DailyAssignmentDistribution;
import assignmentservice.AssignmentBuckets;
import assignmentservice.Assignments;

@Component
public class AssignmentValidator {

  private static final Logger LOGGER = LoggerFactory.getLogger(AssignmentValidator.class);
  private static final Marker SIMULATION_MARKER = LoggingMarker.SIMULATION_MARKER.getMarker();
  private static final Marker VALIDATION_MARKER = LoggingMarker.VALIDATION_MARKER.getMarker();

  private static final int REQUEST_OPEN = 0;
  private static final int REQUEST_PUBLISHED = 1;
  private static final String PROCESSING_RES_ORG_USER_IS_AUTHORIZED_FOR = "ProcessingResourceOrganization";
  private DataProvider dataProvider;
  private Messages messages;
  private CdsRuntime cdsRuntime;

  @Autowired
  public AssignmentValidator(DataProvider dataProvider, Messages messages, CdsRuntime cdsRuntime) {
    this.dataProvider = dataProvider;
    this.messages = messages;
    this.cdsRuntime = cdsRuntime;
  }

  /*******************************************************************/
  /* All validations that result in non-resolvable errors, first */
  /*******************************************************************/

  public void validateResourceRequestStatuses(String resourceRequestId) {

    Optional<ResourceRequests> resourceRequest = dataProvider.getRequestData(resourceRequestId);
    if (resourceRequest.isPresent()) {
      if (resourceRequest.get().getRequestStatusCode() != REQUEST_OPEN) {
        LOGGER.error(SIMULATION_MARKER, "Resource request is not open. Resource request status code {}",
            resourceRequest.get().getRequestStatusCode());
        messages.error(MessageKeys.REQUEST_CANNOT_BE_CHANGED, resourceRequest.get().getName());
      }
      if (resourceRequest.get().getReleaseStatusCode() != REQUEST_PUBLISHED) {
        LOGGER.warn(SIMULATION_MARKER, "Resource Request is not published. Resource request release status code {}",
            resourceRequest.get().getReleaseStatusCode());
        messages.error(MessageKeys.NO_ASSIGNMENT_ON_UNPUBLISHED_RESOURCE_REQUEST,
            resourceRequest.get().getReleaseStatusCode());
      }
    } else {
      messages.error(MessageKeys.REQUEST_NOT_FOUND);
    }
  }

  /*******************************************************************/
  /*
   * All validations that result in resolvable errors /
   *******************************************************************/

  public void validateResourceAvailability(String resourceId, Instant start, Instant end) {
    List<Capacity> resourceCapacityList = dataProvider.getResourceCapacities(resourceId, start, end);
    if (resourceCapacityList.isEmpty()) {
      LOGGER.warn(VALIDATION_MARKER, "Resource has no capacity during the chosen period.");
      messages.error(MessageKeys.RESOURCE_HAS_NO_CAPACITY_DURING_THE_PERIOD, start, end);
    }
  }

  public void validateDurationIsMultipleOfGranularity(final int durationInMinutes,
      final int resourceBookingGranularityInMinutes) {

    if (durationInMinutes % resourceBookingGranularityInMinutes != 0) {
      LOGGER.warn(SIMULATION_MARKER, "Duration value entered is not multiple of resource booking granularity");

      messages.error(MessageKeys.DURATION_MUST_BE_MULTIPLE_OF_GRANULARITY, durationInMinutes,
          resourceBookingGranularityInMinutes);
    }
  }

  public void validateResourceBookingGranularity(String resourceId, int durationToStaff) {
    Optional<Types> resourceBookingGranularityInMinutes = dataProvider
        .getResourceBookingGranularityInMinutes(resourceId);
    if (resourceBookingGranularityInMinutes.isPresent()
        && resourceBookingGranularityInMinutes.get().getBookingGranularityInMinutes() > 0) {
      LOGGER.debug(SIMULATION_MARKER, "Granularity for resource is {} minutes", resourceBookingGranularityInMinutes);
      validateDurationIsMultipleOfGranularity(durationToStaff,
          resourceBookingGranularityInMinutes.get().getBookingGranularityInMinutes());
    } else {
      messages.error(MessageKeys.MISSING_RESOURCE_BOOKING_GRANULARITY);
    }
  }

  public void validateAuthorizationForResource(final String resourceId, List<String> resOrgsUserIsAuthFor) {

    if (resOrgsUserIsAuthFor.isEmpty())
      return;

    Optional<ResourceDetailsForTimeWindow> resourceAssignmentPeriodDetails = dataProvider
        .getMatchingTimeSlice(resourceId);
    if (resourceAssignmentPeriodDetails.isPresent()) {

      String resOrgAssignedToResource = resourceAssignmentPeriodDetails.get().getResourceOrgCode();
      if (!resOrgsUserIsAuthFor.contains(resOrgAssignedToResource)) {
        LOGGER.info(SIMULATION_MARKER, "User is not authorized for resource {} res org {}", resourceId,
            resOrgAssignedToResource);
        messages.error(MessageKeys.USER_UNAUTHORIZED_ERROR);
      }

    } else {
      messages.error(MessageKeys.RESOURCE_ORGANIZATION_UNAUTHORIZED);
    }
  }

  public void validateAuthorizationForRequest(final String requestId, List<String> resOrgsUserIsAuthFor) {

    if (resOrgsUserIsAuthFor.isEmpty())
      return;

    Optional<ResourceRequests> requestDetails = dataProvider.getRequestData(requestId);
    if (requestDetails.isPresent()) {

      String processingResourceOrgOfRequest = requestDetails.get().getProcessingResourceOrgId();
      if (!resOrgsUserIsAuthFor.contains(processingResourceOrgOfRequest)) {
        LOGGER.info(SIMULATION_MARKER, "User is not authorized for request with ID {} ", requestId);
        messages.error(MessageKeys.USER_UNAUTHORIZED_ERROR);
      }

    } else {
      messages.error(MessageKeys.REQUEST_NOT_FOUND);
    }
  }

  public void validateActiveResource(String resourceId, LocalDate asgValidTo, LocalDate asgValidFrom) {

    Optional<WorkAssignments> workAssignment = dataProvider.getWorkAssignmentDetails(resourceId);
    if (workAssignment.isPresent()) {
      LocalDate resourceValidTo = (LocalDate) workAssignment.get().get(WorkAssignments.END_DATE);
      LocalDate resourceValidFrom = (LocalDate) workAssignment.get().get(WorkAssignments.START_DATE);
      if (!asgValidFrom.isBefore(resourceValidTo) || !asgValidTo.isAfter(resourceValidFrom)) {
        LOGGER.warn(SIMULATION_MARKER, "Resource is not active");
        messages.error(MessageKeys.INACTIVE_RESOURCE_FOUND);
      }
    } else {
      messages.error(MessageKeys.WORKASSIGNMENT_NOT_FOUND);
    }

  }

  public void validateMultiTimeSliceResource(String resourceId) {
    // this method always runs in a request context within sap-valid-from and
    // sap-valid-to
    List<WorkAssignmentFirstJobDetails> listCostCenters = dataProvider.getCostCenterRecords(resourceId);
    List<WorkAssignmentFirstJobDetails> distinctCostCenter = listCostCenters.stream().distinct()
        .collect(Collectors.toList());
    if (distinctCostCenter.size() > 1) {
      LOGGER.error(SIMULATION_MARKER,
          "The assignment cannot span across multiple cost center assignment of the resource");
      messages.error(MessageKeys.ASSIGNMENT_CANNOT_SPAN_MULTIPLE_COSTCENTERS);
    }
  }

  public void validateAuthorizationForRequestAndResource(final EventContext context,
      assignmentservice.Assignments assignment) {

    if (!validateRequestResourceIsValid(assignment)) {
      return;
    }

    List<assignmentservice.AssignmentBuckets> listAssignmentBuckets = getAssignmentBucketList(assignment);

    if (!listAssignmentBuckets.isEmpty()) {

      // Not to be done if there are no buckets (can happen when an assignment with no
      // distribution (temporarily changed in the grid)
      // is being copy pasted)

      LOGGER.warn(SIMULATION_MARKER, "Resource has more than one cost center for the assignment period");

      int size = listAssignmentBuckets.size();
      Instant startDate = listAssignmentBuckets.get(0).getStartTime();
      Instant endDate = listAssignmentBuckets.get(size - 1).getStartTime();

      RequestContextRunner requestContextRunner = getRequestContextRunner(startDate, endDate);

      runHandlers(requestContextRunner, context, assignment);

      // Active resource check is independent of cost center authorization check
      performActiveResourceCheck(listAssignmentBuckets, assignment);

    }

  }

  public void validateAuthorizationForAcceptReject(String requestId, List<String> requestedResOrgsUserIsAuthFor) {

    /* Empty list signifies * authorization */
    if (requestedResOrgsUserIsAuthFor.isEmpty())
      return;

    Optional<ResourceRequests> requestDetails = dataProvider.getRequestData(requestId);
    if (requestDetails.isPresent()) {
      String requestedResourceOrgOfRequest = requestDetails.get().getRequestedResourceOrgId();
      if (!requestedResOrgsUserIsAuthFor.contains(requestedResourceOrgOfRequest)) {
        LOGGER.info(SIMULATION_MARKER, "Requester is not authorized for request with ID {} ", requestId);
        messages.error(MessageKeys.USER_UNAUTHORIZED_ERROR);
      }
    } else {
      messages.error(MessageKeys.REQUEST_NOT_FOUND);
    }
  }

  private void performActiveResourceCheck(List<AssignmentBuckets> listAssignmentBuckets, Assignments assignment) {

    final String resourceId = assignment.getResourceId();

    ZoneId zoneId = ZoneId.systemDefault();
    LocalDate validFrom = listAssignmentBuckets.get(0).getStartTime().atZone(zoneId).toLocalDate();
    LocalDate validTo = listAssignmentBuckets.get(listAssignmentBuckets.size() - 1).getStartTime().atZone(zoneId)
        .toLocalDate();

    validateActiveResource(resourceId, validTo, validFrom);

    LOGGER.debug(SIMULATION_MARKER, "Resource {} is active for time range {} to {}", resourceId, validFrom, validTo);

  }

  private void runHandlers(RequestContextRunner requestContextRunner, EventContext context, Assignments assignment) {

    List<String> listAuthorizedResOrgs = context.getUserInfo()
        .getAttributeValues(PROCESSING_RES_ORG_USER_IS_AUTHORIZED_FOR);
    final String resourceRequestId = assignment.getResourceRequestId();
    final String resourceId = assignment.getResourceId();

    if (!listAuthorizedResOrgs.isEmpty()) { // User has attributes maintained

      LOGGER.info(SIMULATION_MARKER,
          "Restricted res orgs are maintained for user, validation checks will be done against res orgs");
      LOGGER.debug(SIMULATION_MARKER, "List of res orgs assigned to user : {}", listAuthorizedResOrgs);

      requestContextRunner.run(req -> {
        validateAuthorizationForRequest(resourceRequestId, listAuthorizedResOrgs);
        validateAuthorizationForResource(resourceId, listAuthorizedResOrgs);
        validateMultiTimeSliceResource(resourceId);
        return null;
      });

      LOGGER.debug(SIMULATION_MARKER, "User has authorizations to modify request {} and resource {}", resourceRequestId,
          resourceId);
    }

    LOGGER.debug(SIMULATION_MARKER, "Resource {} has been validated successfully for multiple time slice ", resourceId);

    requestContextRunner.run(req -> {
      // Check for validating the resource with multiple cost centers for assignment
      // duration
      validateMultiTimeSliceResource(resourceId);
      return null;
    });

  }

  private RequestContextRunner getRequestContextRunner(Instant startDate, Instant endDate) {

    return cdsRuntime.requestContext().modifyParameters(p -> p.setValidFrom(startDate))
        .modifyParameters(p -> p.setValidTo(endDate));
  }

  private boolean validateRequestResourceIsValid(Assignments assignment) {

    final String resourceRequestId = assignment.getResourceRequestId();
    final String resourceId = assignment.getResourceId();

    if (resourceRequestId == null || resourceId == null || resourceRequestId.isEmpty() || resourceId.isEmpty()) {

      LOGGER.error("Technical error: the system could not determine request/resource ID");
      messages.error(MessageKeys.RESREQID_RESID_NOTFOUND);

      return false;
    }

    return true;
  }

  private List<AssignmentBuckets> getAssignmentBucketList(Assignments assignment) {

    return assignment.getAssignmentBuckets().stream().sorted((o1, o2) -> o1.getStartTime().compareTo(o2.getStartTime()))
        .collect(Collectors.toList());

  }

  public void validateAssignedDatesAgainstRequestDates(Instant assignedStart, Instant assignedEnd,
      ResourceRequests resourceRequest) {

    Instant requestStart = resourceRequest.getStartDate().atStartOfDay().toInstant(ZoneOffset.UTC);
    Instant requestEnd = resourceRequest.getEndDate().atStartOfDay().toInstant(ZoneOffset.UTC);

    LOGGER.debug("Assigned start:{} and assigned end:{}. While request start:{} and request end:{}", assignedStart,
        assignedEnd, requestStart, requestEnd);
    if (assignedStart.isBefore(requestStart)) {
      LOGGER.warn("Start date of assignment is before request start date");
      messages.error(MessageKeys.ASSIGNED_START_BEFORE_REQUEST_START, assignedStart);
    }
    if (assignedEnd.isAfter(requestEnd)) {
      LOGGER.warn("End date of assignment is after request end date");
      messages.error(MessageKeys.ASSIGNED_END_AFTER_REQUEST_END, assignedEnd);
    }
  }

  public Messages getMessages() {
    return messages;
  }

  public Map<String, Object> getKeys(EventContext context) {

    CdsUpdateEventContext draftContext = (CdsUpdateEventContext) context;
    CqnAnalyzer cqnAnalyzer = CqnAnalyzer.create(draftContext.getModel());
    return cqnAnalyzer.analyze(draftContext.getCqn()).targetKeys();

  }

  public void validateAssignmentStatus(Integer assignmentStatusCode) {
    AssignmentStatusValidationUtility.isValidAssignmentStatus(assignmentStatusCode, messages);
  }

  public void validateAssignmentStatusChange(String assignmentId, Integer newAssignmentStatusCode) {

    Optional<com.sap.resourcemanagement.assignment.Assignments> assignmentHeader = dataProvider
        .getAssignmentHeader(assignmentId);
    Integer existingAssignmentStatusCode = assignmentHeader.isPresent()
        ? assignmentHeader.get().getAssignmentStatusCode()
        : newAssignmentStatusCode;

    AssignmentStatusValidationUtility.validateAssignmentStatusChange(existingAssignmentStatusCode,
        newAssignmentStatusCode, messages);
  }

  public void validateExistingAssignment(String event, Map<String, String> assignmentDetails) {
    Optional<com.sap.resourcemanagement.assignment.Assignments> existingAssignment;
    if (event.equals(CqnService.EVENT_CREATE)) {
      existingAssignment = dataProvider.getAssignmentForResourceAndRequest((String) assignmentDetails.get("resourceID"),
          (String) assignmentDetails.get("requestID"));
      if (existingAssignment.isPresent())
        messages.error(MessageKeys.ASSIGNMENT_EXISTS_FOR_RES_AND_REQ);
    } else if (event.equals(CqnService.EVENT_UPDATE)) {
      existingAssignment = dataProvider.getAssignmentHeader((String) assignmentDetails.get("assignmentID"));
      if (!existingAssignment.isPresent()) {
        messages.error(MessageKeys.ASSIGNMENT_NOT_EXISTS_FOR_RES_AND_REQ);
      }
    }
  }

  public void validateDistributionDates(List<DailyAssignmentDistribution> dailyDistribution) {

    List<LocalDate> dates = new ArrayList<>();
    Boolean atLeastOneValidDistributionExists = false;

    for (DailyAssignmentDistribution dailyAssignmentDistribution : dailyDistribution) {

      LocalDate dateUserInput = dailyAssignmentDistribution.getDate();

      dates.add(dateUserInput);

      if (dailyAssignmentDistribution.getBookedCapacity().intValue() > 0) {
        atLeastOneValidDistributionExists = true;

      }

    }

    Set<LocalDate> uniqueDates = new java.util.HashSet<>(dates);
    if (dates.size() != uniqueDates.size()) {
      messages.error(MessageKeys.DUPLICATE_DISTRIBUTION_DATES);
    }
    if (!Boolean.TRUE.equals(atLeastOneValidDistributionExists)) {
      messages.error(MessageKeys.NON_ZERO_DAILY_DISTRIBUTION);
    }

  }

  public void validateResourceOrgMatch(String resourceId, String processingResourceOrgId) {

    Optional<ResourceDetailsForTimeWindow> resourceAssignmentPeriodDetails = dataProvider
        .getMatchingTimeSlice(resourceId);
    if (resourceAssignmentPeriodDetails.isPresent()) {
      String resOrgAssignedToResource = resourceAssignmentPeriodDetails.get().getResourceOrgCode();
      if (!processingResourceOrgId.equals(resOrgAssignedToResource)) {
        LOGGER.info(SIMULATION_MARKER, "Mismatch in resource - {} and request -{} resource org",
            resOrgAssignedToResource, processingResourceOrgId);
        messages.error(MessageKeys.RESOURCEORG_MISMATCH);
      }

    }
  }

  public void validateNoAssignmentExists(String resourceID, String requestID) {
    Optional<com.sap.resourcemanagement.assignment.Assignments> existingAssignment = dataProvider
        .getAssignmentForResourceAndRequest(resourceID, requestID);
    if (existingAssignment.isPresent())
      messages.error(MessageKeys.ASSIGNMENT_EXISTS_FOR_RES_AND_REQ);
  }

  public void validateAssignmentExists(String assignmentID) {
    Optional<com.sap.resourcemanagement.assignment.Assignments> existingAssignment = dataProvider
        .getAssignmentHeader(assignmentID);
    if (!existingAssignment.isPresent())
      messages.error(MessageKeys.ASSIGNMENT_NOT_EXISTS_FOR_RES_AND_REQ);
  }

  public void validateConsultantStaffedOnAssignment(String assignmentId, UserInfo userInfo) {

    Optional<String> emailAddressOfStaffedResource = dataProvider.getEmailAddressOfStaffedResource(assignmentId);
    if (emailAddressOfStaffedResource.isPresent()) {
      XsuaaUserInfo xsuaaUserInfo = userInfo.as(XsuaaUserInfo.class);
      String emailFromXsuaa = xsuaaUserInfo.getEmail();
      if (emailAddressOfStaffedResource.get().equalsIgnoreCase(emailFromXsuaa)) {
        return;
      }
      LOGGER.info("User's XSUAA email address {} does not match staffed consultant's {} for assignment {}",
          emailFromXsuaa, emailAddressOfStaffedResource.get(), assignmentId);
    }
    LOGGER.warn(VALIDATION_MARKER, "Consultant {} is not authorized to change assignment {}", userInfo.getName(),
        assignmentId);
    messages.error(MessageKeys.CONSULTANT_ASGN_CHANGE_NOT_ALLOWED);
  }

  public void validateReferenceAssignment(String referenceAssignment) {

    if (referenceAssignment != null) {

      try {

        dataProvider.getAssignmentHeaderDraft(referenceAssignment);

      } catch (EmptyResultException e) {

        Optional<com.sap.resourcemanagement.assignment.Assignments> referenceAssignmentHeader = dataProvider
            .getAssignmentHeader(referenceAssignment);

        if (!referenceAssignmentHeader.isPresent()) {

          // Referenced assignment no longer exists. Action is aborted.
          messages.error(MessageKeys.REFERENCE_ASSIGNMENT_ERROR);

        }
      }
    }
  }

  public void validateResourceValidity(Instant startDate, Instant endDate, String resourceId,
      String processingResourceOrgId) {

    Optional<ExtnWorkAssignmentFirstJobDetails> resourceValidity = dataProvider.getResourceValidity(startDate, endDate,
        resourceId, processingResourceOrgId);
    if (!resourceValidity.isPresent()) {

      LOGGER.warn(SIMULATION_MARKER, "Resource is not valid in this time period.");
      messages.error(MessageKeys.RESOURCE_NOT_VALID_TEMPORAL);

    }

  }

}
