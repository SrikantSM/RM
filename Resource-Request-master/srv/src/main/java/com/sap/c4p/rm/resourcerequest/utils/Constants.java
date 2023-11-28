package com.sap.c4p.rm.resourcerequest.utils;

public final class Constants {

  public static final String UOM = "duration-hour";
  public static final int REQUEST_PRIORITY_MEDIUM = 1;
  public static final int REQUEST_OPEN = 0;
  public static final int REQUEST_RESOLVE = 1;
  public static final int REQUEST_PUBLISH = 1;
  public static final int REQUEST_WITHDRAW = 0;
  public static final int TOTAL_HOURS = 0;
  public static final int DAILY_HOURS = 1;
  public static final int WEEKLY_HOURS = 2;
  public static final int FIELD_CONTROL_READ = 1;
  public static final int FIELD_CONTROL_EDIT = 7;
  public static final int FIELD_CONTROL_OPTIONAL = 3;
  public static final int REFERENCE_TYPE_NONE = 0;
  public static final String ACTION_RESOURCE_REQUEST_SET_RESPONSIBILITY = "setMyResponsibilityResourceRequest";
  public static final String ACTION_RESOURCE_REQUEST_FORWARD = "forwardResourceRequest";
  public static final String ACTION_RESOURCE_REQUEST_RESOLVE = "resolveResourceRequest";
  public static final String ACTION_PUBLISH_RESOURCE_REQUEST = "publishResourceRequest";
  public static final String ACTION_WITHDRAW_RESOURCE_REQUEST = "withdrawResourceRequest";
  public static final String ACTION_DELETE_ASSIGNMENT = "DeleteAssignment";
  public static final String ACTION_CHANGE_ASSIGNMENT = "ChangeAssignment";
  public static final String ACTION_ASSIGN_FOR_SPECIFIC_PERIOD = "AssignForSpecificPeriod";
  public static final String ACTION_ASSIGN_AS_REQUESTED = "AssignAsRequested";
  public static final int NOT_STAFFED = 0;
  public static final String REQUESTED_RESOURCEORG = "RequestedResourceOrganization";
  public static final String PROCESSING_RESOURCEORG = "ProcessingResourceOrganization";
  public static final String RESOURCE_REQUEST_ID = "resourceRequestId";
  public static final String RESOURCE_ID = "resourceId";
  public static final String MODE = "mode";
  public static final int SKILL_IMPORTANCE_CODE_MANDATORY = 1;

  public static final String AUTHORIZATION_FAILURE_SERVICE = "AUTHORIZATION_FAILURE_SERVICE";
  public static final String AUTHORIZATION_SUCCESS_SERVICE = "AUTHORIZATION_SUCCESS_SERVICE";
  public static final String AUTHORIZATION_FAILURE_ENTITY = "AUTHORIZATION_FAILURE_ENTITY";
  public static final String AUTHORIZATION_SUCCESS_ENTITY = "AUTHORIZATION_SUCCESS_ENTITY";
  public static final String LOG_LEVEL_ERROR = "ERROR";
  public static final String LOG_LEVEL_INFO = "INFO";
  public static final String INSERT_MODE = "I";
  public static final String CHANGE_MODE = "C";
  /*
   * The caller references the constants using <tt>Constants.UOM</tt>, and so on.
   * Thus, the caller should be prevented from constructing objects of this class,
   * by declaring this private constructor.
   */

  private Constants() {

    /*
     * this prevents even the native class from calling this constructor as well :
     */

    throw new AssertionError();

  }

  public static class PropertyNames {
    public static final String ID = "ID";
    public static final String DISPLAY_ID = "DISPLAY_ID";
    public static final String START_DATE = "START_DATE";
    public static final String END_DATE = "END_DATE";
    public static final String REQUESTED_CAPACITY = "REQUESTED_CAPACITY";
    public static final String NAME = "NAME";
    public static final String DESCRIPTION = "DESCRIPTION";

    private PropertyNames() {
      // To stop object creation
    }
  }

  public static class AssignmentStatus {
    public static final String ACCEPT_ASSIGNMENT_PROPOSAL = "acceptAssignmentProposal";
    public static final String REJECT_ASSIGNMENT_PROPOSAL = "rejectAssignmentProposal";
    public static final int ACCEPT_ASSIGNMENT_STATUS_CODE = 3;
    public static final int REJECT_ASSIGNMENT_STATUS_CODE = 4;

    public static final int PROPOSAL_ASSIGNMENT_STATUS_CODE = 2;

    private AssignmentStatus() {
      // To stop object Creation
    }
  }
}
