package com.sap.c4p.rm.resourcerequest.validations;

import java.math.BigDecimal;
import java.time.chrono.ChronoLocalDate;
import java.util.List;
import java.util.function.Supplier;

import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.resourcerequest.utils.ValuePath;

import manageresourcerequestservice.Demands;
import manageresourcerequestservice.ResourceRequests;
import manageresourcerequestservice.ResourceRequests_;

public interface ResourceRequestValidator {

  /*
   * Common method which will receive resource request object passed via API and
   * validate the fields which are provided by user.
   */

  void validateResourceRequestPropertyApi(resourcerequestservice.ResourceRequests resourceRequest, String eventType);

  /*
   * Common method which will receive resource request object and validate each
   * attributes
   */

  void validateResourceRequestProperty(ResourceRequests resourceRequest);

  /**
   * Foreign Key Validation: Checks demand_ID exists in the system.
   *
   *
   */

  Demands validateDemandIdExist(String demandId);

  /**
   * validate display is not null.
   */

  void validateDisplayId(String displayID, String entityName);

  /**
   * Foreign Key Validation: Checks projectRole_ID exists in the system.
   *
   *
   */
  void validateProjectRoleIdIfExists(String projectRoleId, String resourceRequestId);

  /**
   * Foreign Key Validation: Checks priority_code_ID exists in the system.
   *
   *
   */
  void validatePriorityCodeExist(Integer priorityCode);

  /**
   * Foreign Key Validation: Checks releaseStatus_code exists in the system.
   *
   *
   */
  void validateReleaseStatusCodeExist(Integer releaseStatusCode);

  /**
   * Foreign Key Validation: Checks requestStatus_code exists in the system.
   *
   */
  void validateRequestStatusCode(Integer requestStatusCode);

  /*
   * Validate if resource request is withdrawn
   */
  void validateReleaseStatusCode(Integer releaseStatusCode);

  /**
   * Validates the value of requestedCapacity is positive.
   *
   *
   */
  void validateRequestedCapacityValueIsPositive(BigDecimal requestedCapacity, String entityName);

  /**
   * Validates Resource Request Start and End Date.
   *
   *
   */
  void validateResourceRequestDates(ChronoLocalDate startDate, ChronoLocalDate endDate, ChronoLocalDate startDateRange,
      ChronoLocalDate endDateRange, String entityName);

  /**
   * Foreign Key Validation: Checks Employee Id exists in the system.
   *
   *
   */
  void validateEmployeeExist(String employeeId);

  /**
   * Foreign Key Validation: Checks Processing Resource Org exists in the system.
   *
   *
   */
  void validateProcessingResourceOrganizationExist(String resourceOrgCode);

  /**
   * Foreign Key Validation: Checks Requested Resource Org exists in the system.
   *
   *
   */
  void validateRequestedResourceOrganizationExist(String resourceOrgCode, String entityName);

  /*
   * Valid the Unit of Measure of Resource Request
   */

  void validateResourceRequestRequestedUnit(String uom);

  /*
   * Validate the Resource Request name
   */

  void validateResourceRequestNameInputValidation(String nameValue, String entityName);

  /*
   * Check the Staffing Status of Resource Request
   */

  void checkResourceRequestStaffing(String resourceRequestId);

  /*
   * Check the Assignment Status for Resource Request before changing the
   * Processing Resource Org
   */
  void validateProcessingResourceOrgUpdation(String resourceRequestId, String newProcessingResourceOrg,
      String oldProcessingResourceOrg);

  /*
   * Check whether action to perform publish and withdraw is allowed or not
   */

  void checkPublishWithdrawAllowed(Boolean resourceRequestActiveStatus);

  /*
   * Check for demand, already resource request created
   */

  void checkResourceRequestExistsForDemand(String demandId);

  /*
   * Validate user authorization for an action
   */

  boolean isUserAuthorizedForTheAction(List<String> resourceOrgs, String resourceOrganization);

  /*
   * Check whether action to perform delete is allowed or not
   */

  void checkResourceRequestDeleteUpdate(String resourceRequestId, String evetType);

  /*
   * Supplier service exception to throw error message
   */

  Supplier<ServiceException> notFound(String message);

  List<ValuePath<String, ResourceRequests_>> extractValuesForInjection(final ResourceRequests resourceRequest);

  void checkAssignmentProposalExists(ResourceRequests resourceRequest);

  void validateReferenceObjectIfTypeNone(ResourceRequests resourceRequest);

  void validateIfReferenceObjectMapped(ResourceRequests resourceRequest);

  void validateReferenceObjAssignedToResourceRequest(resourcerequestservice.ResourceRequests resourceRequest,
      String eventType);

  void validateRRDateChange(ResourceRequests resourceRequest);

  void validateRRDateChangeWhenPublishedAPI(resourcerequestservice.ResourceRequests resourceRequest);

}
