package com.sap.c4p.rm.calm;

public final class CalmConstants {

	private CalmConstants() {

	}

	/**
	 * Represents the status text on the message level for generic failure event.
	 */
	public static final String FAILURE = "An error has occured during the replication of data from MDI.";
	/**
	 * Represents the status text on the message level for partial success event,
	 * where in some of the objects replicated had functional errors. Here %s
	 * represents the numeric parameters for counts of total objects to be
	 * processed, total objects successfully processes, total objects failed.
	 */
	public static final String PARTIAL_SUCCESS = "The processing of the business objects received from MDI was partially successful. Total objects processed: %s, Success: %s, and Failed: %s. Please check Log Entry section for more details about the failures.";

	/**
	 * Represents the status text on the message level for complete failure event,
	 * where in all of the objects replicated had functional errors. Here %s
	 * represents the numeric parameters for counts of total objects to be
	 * processed.
	 */
	public static final String COMPLETE_FAILURE = "The processing of the business objects received from MDI has failed. Total objects processed: %s. Please check Log Entry section for more details about the failures.";

	/**
	 * Represents the status text on the message level for complete success event.
	 * Here %s represents the numeric parameters for counts of total objects to be
	 * processed, total objects successfully processes, total objects failed.
	 */
	public static final String COMPLETE_SUCCESS = "The processing of the business objects received from MDI was successful. Total objects processed: %s, Success: %s, and Failed: %s. Please check Log Entry section for more details about the objects.";

	public static final String DESTINATION_NOT_FOUND_RM_CP_012 = "The destination required for communication with MDI was not found.";

	public static final String MDI_AUTH_TOKEN_RM_CP_005 = "The destination is incorrectly configured as authorization token required for communication with MDI service could not be procured.";

	public static final String DESTINATION_AUTH_TOKEN = "An error has occured as authorization token required for communication with Destination service could not be procured.";

	public static final String DESTINATION_MDI_URL_RM_CP_006 = "The MDI URL configured in the destination used for communication with MDI is incorrect.";

	public static final String HTTP_EXCEPTION_MDI_RM_CP_009_010_011 = "An error has occured while communicating with MDI service.";

	public static final String RESET_ALL_MDI_RM_CP_007_008 = "An error has occured with MDI based data replication, to restore the replication to normal state you need to perform initial load again. To perform inital load, click on 'Reset All' button in the 'Manage Replication Schedules' application & reactivate the replication.";
	
	public static final String HTTP_EXCEPTION_DESTINATION_RM_CP_009_010_011 = "An error has occured while communicating with destination service.";

	public static final String MDI_OBJECT_PROCESSING_ERROR = "An error has occured while processing this instance";

	public static final String EVENT_CATEGORY = "SCP_RESOURCE_MANAGEMENT";

	public static final String SB_CALM_SERVICE_TYPE = "SPRC";

	public static final String DIRECTION_INBOUND = "INBOUND";

	public static final String JSON_DATE = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";

}
