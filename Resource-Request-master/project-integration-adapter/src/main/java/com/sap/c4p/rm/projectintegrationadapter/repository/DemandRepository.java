package com.sap.c4p.rm.projectintegrationadapter.repository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.sap.cds.CdsData;
import com.sap.cds.Result;
import com.sap.cds.Row;
import com.sap.cds.ql.Delete;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.Upsert;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpsert;
import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.projectintegrationadapter.config.LoggingMarker;

import com.sap.resourcemanagement.project.BillingRoles;
import com.sap.resourcemanagement.project.BillingRoles_;
import com.sap.resourcemanagement.project.Demands;
import com.sap.resourcemanagement.project.Demands_;

@Repository
public class DemandRepository {

  private final PersistenceService persistenceService;
  private static final Logger logger = LoggerFactory.getLogger(DemandRepository.class);
  private static final Marker REP_DELETE_DEMAND_MARKER = LoggingMarker.REPLICATION_DELETE_DEMAND_MARKER.getMarker();
  private static final Marker REP_CHANGE_DEMAND_MARKER = LoggingMarker.REPLICATION_CHANGE_DEMAND_MARKER.getMarker();
  private static final Marker REP_FETCH_DEMAND_MARKER = LoggingMarker.REPLICATION_FETCH_DEMAND_MARKER.getMarker();

  @Autowired
  public DemandRepository(PersistenceService persistenceService) {
    this.persistenceService = persistenceService;
  }

  public void upsertDemands(List<CdsData> demands) {
    try {

      logger.debug(REP_CHANGE_DEMAND_MARKER, "Entered method upsertDemands in class DemandRepository");
      CqnUpsert query = Upsert.into(Demands_.class).entries(demands);
      persistenceService.run(query);
      logger.debug(REP_CHANGE_DEMAND_MARKER, "Demands were successfully upserted");

    } catch (ServiceException e) {
      logger.debug(REP_CHANGE_DEMAND_MARKER, "Failed to upsert demands {}", demands);
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed in upsertDemands {}", demands, e);
    }
  }

  public void upsertDemands(Demands demands) {
    try {
      logger.debug(REP_CHANGE_DEMAND_MARKER, "Entered method upsertDemand in class DemandRepository");
      CqnUpsert query = Upsert.into(Demands_.class).entry(demands);
      persistenceService.run(query);
      logger.debug(REP_CHANGE_DEMAND_MARKER, "{} Demand was successfully upserted", demands.getId());
    } catch (ServiceException e) {
      logger.debug(REP_CHANGE_DEMAND_MARKER, "Failed to upsert demands {}", demands);
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed in upsertDemands {}", demands, e);
    }
  }

  public void deleteDemand(Demands demand) {
    try {

      logger.debug(REP_DELETE_DEMAND_MARKER, "Entered method deleteDemand in class DemandRepository");
      CqnDelete query = Delete.from(Demands_.class).where(b -> b.ID().eq(demand.getId()));
      persistenceService.run(query);
      logger.debug(REP_DELETE_DEMAND_MARKER, "{} Demand was successfully deleted", demand.getId());
    } catch (ServiceException e) {
      logger.debug(REP_DELETE_DEMAND_MARKER, "Failed while deleting demand {}", demand);
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed in deleteDemand {}", demand, e);
    }
  }

  public List<Demands> selectDemandForWorkPackage(String workPackageID) {
    try {
      logger.debug(REP_FETCH_DEMAND_MARKER, "Entered method selectDemandForWorkPackage in class DemandRepository");
      CqnSelect query = Select.from(Demands_.class).where(b -> b.workPackage_ID().eq(workPackageID));
      Result selectedData = persistenceService.run(query);

      List<Demands> demands = new ArrayList<>();

      if (selectedData.rowCount() < 1) {
        return Collections.emptyList();
      }
      Iterator<Row> iterator = selectedData.iterator();
      while (iterator.hasNext()) {
        Demands demand = Demands.create();
        demand.putAll(iterator.next());
        demands.add(demand);
        logger.debug(REP_FETCH_DEMAND_MARKER, "Demand for {} WorkPackage has been selected", workPackageID);
      }

      return demands;
    } catch (Exception e) {
      logger.debug(REP_FETCH_DEMAND_MARKER, "Failed while selecting demand for work package with ID {}",
          REP_FETCH_DEMAND_MARKER);
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed in selectDemandForWorkPackage {}", workPackageID,
          e);
    }

  }

  public BillingRoles getBillingRoleById(String billingRoleId) {

    try {
      logger.debug(REP_FETCH_DEMAND_MARKER, "Entered method getBillingRoleById in class DemandRepository");
      CqnSelect query = Select.from(BillingRoles_.class).columns(p -> p._all()).where(p -> p.ID().eq(billingRoleId));

      Result result = persistenceService.run(query);

      if (result.rowCount() < 1) {
        return null;
      }

      BillingRoles selectedBillingRole = BillingRoles.create();
      selectedBillingRole.putAll(result.single(BillingRoles.class));
      logger.debug(REP_FETCH_DEMAND_MARKER, "{} BillingRole has been selected", billingRoleId);
      return selectedBillingRole;
    } catch (Exception e) {
      logger.debug(REP_FETCH_DEMAND_MARKER, "Failed while fetching billing role with ID {}", billingRoleId);
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed in getBillingRoleById {}", billingRoleId, e);
    }
  }

  public void upsertBillingRole(BillingRoles billingRole) {
    try {
      logger.debug(REP_CHANGE_DEMAND_MARKER, "Entered method upsertBillingRole in class DemandRepository");
      CqnUpsert query = Upsert.into(BillingRoles_.class).entry(billingRole);
      persistenceService.run(query);
      logger.debug(REP_CHANGE_DEMAND_MARKER, "{} BillingRole has been upserted", billingRole.getId());
    } catch (ServiceException e) {
      logger.debug(REP_CHANGE_DEMAND_MARKER, "Failed while upsert of billing role {}", billingRole);
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed in upsertBillingRole {}", billingRole, e);
    }
  }
}
