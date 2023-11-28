package com.sap.c4p.rm.assignment.integration;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;

import com.sap.cds.services.ServiceException;
import com.sap.cloud.sdk.cloudplatform.connectivity.HttpDestination;
import com.sap.cloud.sdk.cloudplatform.resilience.ResilienceConfiguration;
import com.sap.cloud.sdk.cloudplatform.resilience.ResilienceDecorator;
import com.sap.cloud.sdk.datamodel.odata.helper.VdmEntity;
import com.sap.cloud.sdk.datamodel.odata.helper.batch.BatchResponseChangeSet;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceSup;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.EngmntProjRsceSupDistr;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.commercialproject.batch.CommercialProjectServiceBatchChangeSet;
import com.sap.cloud.sdk.s4hana.datamodel.odata.services.DefaultCommercialProjectService;

import com.sap.c4p.rm.assignment.config.LoggingMarker;
import com.sap.c4p.rm.assignment.gen.MessageKeys;

public class UpdateSupplyCommand {
  public final DefaultCommercialProjectService commercialProjectService;
  public final List<EngmntProjRsceSupDistr> supplyDistributionListToInsert;
  public final List<EngmntProjRsceSupDistr> supplyDistributionListToUpdate;
  public final List<EngmntProjRsceSupDistr> supplyDistributionListToDelete;
  public final List<EngmntProjRsceSup> supplyListToInsert;
  public final HttpDestination httpDestination;
  private final List<EngmntProjRsceSup> supplyListToDelete;
  private static final Logger LOGGER = LoggerFactory.getLogger(UpdateSupplyCommand.class);
  private static final Marker INT_CHANGE_MARKER = LoggingMarker.INTEGRATION_CHANGE_MARKER.getMarker();

  public UpdateSupplyCommand(HttpDestination httpDestination, DefaultCommercialProjectService commercialProjectService,
      List<EngmntProjRsceSupDistr> supplyDistributionListToInsert,
      List<EngmntProjRsceSupDistr> supplyDistributionListToUpdate,
      List<EngmntProjRsceSupDistr> supplyDistributionListToDelete, List<EngmntProjRsceSup> supplyListToInsert,
      List<EngmntProjRsceSup> supplyListToDelete) {
    this.commercialProjectService = commercialProjectService;
    this.supplyDistributionListToInsert = supplyDistributionListToInsert;
    this.supplyDistributionListToUpdate = supplyDistributionListToUpdate;
    this.supplyDistributionListToDelete = supplyDistributionListToDelete;
    this.supplyListToInsert = supplyListToInsert;
    this.supplyListToDelete = supplyListToDelete;
    this.httpDestination = httpDestination;
  }

  public List<EngmntProjRsceSup> execute() {
    return ResilienceDecorator.executeSupplier(this::run,
        ResilienceConfiguration.of(UpdateSupplyCommand.class).timeLimiterConfiguration(
            ResilienceConfiguration.TimeLimiterConfiguration.of().timeoutDuration(Duration.ofMillis(20000))));
  }

  private List<EngmntProjRsceSup> run() {
    if (supplyDistributionListToInsert.isEmpty() && supplyDistributionListToUpdate.isEmpty()
        && supplyDistributionListToDelete.isEmpty() && supplyListToInsert.isEmpty() && supplyListToDelete.isEmpty()) {
      LOGGER.info(INT_CHANGE_MARKER, "No supply distribution records found for create/update/delete");
      return Collections.emptyList();
    }

    LOGGER.info(INT_CHANGE_MARKER, "Updating supply in batch");

    CommercialProjectServiceBatchChangeSet updateActionChain = commercialProjectService.batch().beginChangeSet();

    for (EngmntProjRsceSup supplyToInsert : supplyListToInsert) {
      updateActionChain = updateActionChain.createEngmntProjRsceSup(supplyToInsert);
    }

    for (EngmntProjRsceSup supplyToDelete : supplyListToDelete) {
      updateActionChain = updateActionChain.deleteEngmntProjRsceSup(supplyToDelete);
    }

    for (EngmntProjRsceSupDistr supplyDistributionToInsertRecord : supplyDistributionListToInsert) {
      updateActionChain = updateActionChain.createEngmntProjRsceSupDistr(supplyDistributionToInsertRecord);
    }

    for (EngmntProjRsceSupDistr supplyDistributionToUpdateRecord : supplyDistributionListToUpdate) {
      updateActionChain = updateActionChain.updateEngmntProjRsceSupDistr(supplyDistributionToUpdateRecord);
    }
    for (EngmntProjRsceSupDistr supplyDistributionToDeleteRecord : supplyDistributionListToDelete) {
      updateActionChain = updateActionChain.deleteEngmntProjRsceSupDistr(supplyDistributionToDeleteRecord);
    }

    // All requests are sent as part of one changeset, hence the changeset response
    // would be located at index 0 (first get below)
    // The last get call returns a BatchResponseChangeSet object on success or
    // raises an ODataServiceErrorException on failure
    BatchResponseChangeSet response = updateActionChain.endChangeSet().executeRequest(httpDestination).get(0).get();

    List<EngmntProjRsceSup> returnedSupplyListFromS4 = new ArrayList<>();
    if (!supplyListToInsert.isEmpty()) {
      List<VdmEntity<?>> createdEntities = response.getCreatedEntities();
      for (VdmEntity<?> entity : createdEntities) {
        if (entity.getClass().equals(EngmntProjRsceSup.class)) {
          EngmntProjRsceSup returnedSupply = (EngmntProjRsceSup) entity;
          returnedSupplyListFromS4.add(returnedSupply);
        }
      }
    }

    if (returnedSupplyListFromS4.size() != supplyListToInsert.size()) {
      LOGGER.error("Created S4 supply information missing for some assignments");
      throw new ServiceException(MessageKeys.MISSING_SUPPLY_INFO_IN_S4_RESPONSE);
    }

    return returnedSupplyListFromS4;
  }
}
