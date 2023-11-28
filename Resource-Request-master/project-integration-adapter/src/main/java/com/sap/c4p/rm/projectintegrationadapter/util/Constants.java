package com.sap.c4p.rm.projectintegrationadapter.util;

public class Constants {
  public static final int PAGE_SIZE = 1000;
  public static final String UOM = "duration-hour";
  public static final int REQUEST_OPEN = 0;

  public static final int REQUEST_PRIORITY_MEDIUM = 1;
  public static final int TOTAL_HOURS = 0;
  public static final int DAILY_HOURS = 1;
  public static final int WEEKLY_HOURS = 2;
  public static final int CAPACITYREQUIREMENTS_SIZE = 1;
  public static final String PROJECT_TYPE_CUSTOMER = "C";
  public static final String PROJECT_TYPE_INTERNAL = "I";
  public static final int REQUEST_PUBLISH = 1;
  public static final int REQUEST_WITHDRAW = 0;
  public static final int AUTO_PUBLISH_ON = 1;
  public static final int AUTO_PUBLISH_OFF = 0;

  private Constants() {
    // To stop object creation
  }

  public static class ReplicationType {
    public static final int INITIAL = 1;
    public static final int DELTA = 2;
    public static final int DELETE = 3;

    private ReplicationType() {
      // To stop object creation
    }
  }

  public static class RunStatus {
    public static final int NEW = 0;
    public static final int ERROR = 1;
    public static final int PROCESSING = 2;
    public static final int COMPLETED = 3;
    public static final int CLOSED = 4;

    private RunStatus() {
      // To stop object creation
    }
  }

  public static class S4Constants {
    public static final String CUSTOMER_PROJECT_TYPE = "C";
    public static final String DEMAND_CURRENT_PLAN_VERSION_ID = "1";

    private S4Constants() {
      // To stop object creation
    }
  }

  public static class LoggerMessages {
    public static final String CREATE_WP_FAIL = "Error occured while creating new workpackage.";
    public static final String MAX_CHANGEON = "Error occured while deriving max changedOn";
    public static final String UPDATE_REPLICATION_STATUS_TO_PROCESSING = "Error occurred while setting replication status to processing.";
    public static final String DETERMINE_REPLICATION_STATUS = "Error in determining the replication status.";
    public static final String MAPPING_S4_PROJECT_TO_RM = "Failed while Mapping S4Project to RM Projects :{}";
    public static final String TRANSFORM_FAILED_FOR_DEMAND = "Transform failed for demand {}";
    public static final String TRANSFORM_FAILED_FOR_S4_PROJECT = "Transform failed for S4 project {}";
    public static final String TRANSFORM_FAILED_FOR_S4_WP = "Transform failed for S4 WP {}";
    public static final String TRANSFORM_FAILED_FOR_S4_DEMAND = "Transform failed for S4 demand {}";
    public static final String TRANSFORM_FAILED_FOR_S4_DEMAND_DISTRIBUTION = "Transform failed for S4 demand distribution{}";
    public static final String DISPLAYID_GENERATION_FAILED = "Generation of display ID failed.";

    private LoggerMessages() {
      // To stop object creation
    }
  }

}
