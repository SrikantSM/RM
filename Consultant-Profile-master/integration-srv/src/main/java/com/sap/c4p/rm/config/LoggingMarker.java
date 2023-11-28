package com.sap.c4p.rm.config;

import org.slf4j.Marker;
import org.slf4j.MarkerFactory;

public enum LoggingMarker {
    AUDIT_LOG,
    COST_CENTER_REPLICATION,
    CREATE_TENANT_JOBS,
    GET_SUBSCRIPTION_DEPENDENCIES,
    HOUSE_KEEPER_JOB,
    LOGGING,
    PRECOMPILER,
    REPLICATION_SCHEDULES,
    WORKFORCE_REPLICATION,
    TIME_DIMENSION_DATA_GENERATION,
    BUSINESS_PURPOSE_COMPLETION_TASK,
    SET_EXISTING_CUSTOMERS,
    SET_EVENT_SEQUENCE_IF_NULL,
    WORKFORCE_AVAILABILITY_MARKER,
	LANGUAGE_CODE_CONVERSION,
	CAPACITY_CLEANUP;

    public Marker getMarker() {
        return MarkerFactory.getMarker(this.toString());
    }
}
