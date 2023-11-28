package com.sap.c4p.rm.resourcerequest.config;

import org.slf4j.Marker;
import org.slf4j.MarkerFactory;

public enum LoggingMarker {

  LOGGING,
  MIGRATION;

  public Marker getMarker() {
    return MarkerFactory.getMarker(this.toString());
  }

}
