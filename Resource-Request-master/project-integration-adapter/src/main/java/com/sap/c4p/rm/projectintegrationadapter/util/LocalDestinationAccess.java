package com.sap.c4p.rm.projectintegrationadapter.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.sap.cloud.sdk.cloudplatform.connectivity.DestinationAccessor;
import com.sap.cloud.sdk.s4hana.connectivity.DefaultErpHttpDestination;
import com.sap.cloud.sdk.s4hana.connectivity.ErpHttpDestination;

import com.sap.c4p.rm.projectintegrationadapter.config.LoggingMarker;

@Component
@Profile({ "default" })
public class LocalDestinationAccess implements DestinationAccess {

  private static final Logger logger = LoggerFactory.getLogger(LocalDestinationAccess.class);
  private static final Marker MARKER = LoggingMarker.REPLICATION_DESTINATION_ACCESS_MARKER.getMarker();

  @Override
  public ErpHttpDestination getDestination() {
    logger.info(MARKER, "Accessing the ERP Endpoint Destination for local.");
    return DestinationAccessor.getDestination("ErpQueryEndpoint").asHttp().decorate(DefaultErpHttpDestination::new);

  }

}
