package com.sap.c4p.rm.projectintegrationadapter.util;

import org.springframework.stereotype.Component;

import com.sap.cloud.sdk.s4hana.connectivity.ErpHttpDestination;

@Component
public interface DestinationAccess {

  ErpHttpDestination getDestination();

}
