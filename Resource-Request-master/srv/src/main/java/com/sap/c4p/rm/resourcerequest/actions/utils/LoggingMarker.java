package com.sap.c4p.rm.resourcerequest.actions.utils;

import org.slf4j.Marker;
import org.slf4j.MarkerFactory;

public enum LoggingMarker {

  ASSIGNMENT_SERVICE_URL,
  AUDIT_LOG,
  AUTHORIZATION_EVENT,
  SIMULATE_ASSIGNMENT_MARKER,
  CREATE_ASSIGNMENT,
  CHANGE_ASSIGNMENT,
  DELETE_ASSIGNMENT,
  SUBSCRIPTION_HANDLER,
  HEALTH_CHECK_PROPERTIES,
  MIGRATION,
  MIGRATE_DRAFTS;

  public Marker getMarker() {
    return MarkerFactory.getMarker(this.toString());
  }
}