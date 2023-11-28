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

import com.sap.cds.Result;
import com.sap.cds.Row;
import com.sap.cds.ql.Delete;
import com.sap.cds.ql.Insert;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.Update;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.projectintegrationadapter.config.LoggingMarker;

import com.sap.resourcemanagement.project.WorkPackages;
import com.sap.resourcemanagement.project.WorkPackages_;

@Repository
public class WorkPackageRepository {

  private final PersistenceService persistenceService;

  private static final Logger logger = LoggerFactory.getLogger(WorkPackageRepository.class);
  private static final Marker REP_CREATE_WORKPACKAGE_MARKER = LoggingMarker.REPLICATION_CREATE_WORKPACKAGE_MARKER
      .getMarker();
  private static final Marker REP_DELETE_WORKPACKAGE_MARKER = LoggingMarker.REPLICATION_DELETE_WORKPACKAGE_MARKER
      .getMarker();
  private static final Marker REP_CHANGE_WORKPACKAGE_MARKER = LoggingMarker.REPLICATION_CHANGE_WORKPACKAGE_MARKER
      .getMarker();
  private static final Marker REP_FETCH_WORKPACKAGE_MARKER = LoggingMarker.REPLICATION_FETCH_WORKPACKAGE_MARKER
      .getMarker();

  @Autowired
  public WorkPackageRepository(PersistenceService persistenceService) {
    this.persistenceService = persistenceService;
  }

  public void updateWorkPackage(WorkPackages workPackage) {
    try {
      logger.debug(REP_CHANGE_WORKPACKAGE_MARKER, "Entered method updateWorkPackage in class WorkPackageRepository");
      CqnUpdate query = Update.entity(WorkPackages_.class).data(workPackage);
      persistenceService.run(query);

      logger.debug(REP_CHANGE_WORKPACKAGE_MARKER, "{} Workpackage was successfully updated", workPackage.getId());

    } catch (ServiceException e) {
      logger.debug(REP_CHANGE_WORKPACKAGE_MARKER, "Failed to update work package with ID {}.", workPackage.getId());
      // Error logged in calling function
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed in updateWorkPackage {}", workPackage, e);
    }
  }

  public void createWorkPackage(WorkPackages workPackage) {
    try {
      logger.debug(REP_CREATE_WORKPACKAGE_MARKER, "Entered method createWorkPackage in class WorkPackageRepository");
      CqnInsert query = Insert.into(WorkPackages_.class).entry(workPackage);
      persistenceService.run(query);
      logger.debug(REP_CREATE_WORKPACKAGE_MARKER, "{} Workpackage was successfully created", workPackage.getId());
    } catch (ServiceException e) {
      logger.debug(REP_CREATE_WORKPACKAGE_MARKER, "Failed to create work package with ID {}.", workPackage.getId());
      // Error logged in calling function
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed in createWorkPackage {}", workPackage, e);
    }
  }

  public void deleteWorkPackage(String workPackageID) {

    try {
      logger.debug(REP_DELETE_WORKPACKAGE_MARKER, "Entered method deleteWorkPackage in class WorkPackageRepository");
      CqnDelete query = Delete.from(WorkPackages_.class).where(b -> b.ID().eq(workPackageID));
      persistenceService.run(query);
      logger.debug(REP_DELETE_WORKPACKAGE_MARKER, "{} Workpackage was successfully deleted", workPackageID);
    } catch (ServiceException e) {
      logger.debug(REP_DELETE_WORKPACKAGE_MARKER, "Failed to delete work package with ID {}.", workPackageID);
      // Error logged in calling function
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed in deleteWorkPackage {}", workPackageID, e);
    }
  }

  public List<WorkPackages> selectWorkPackageForProject(String projectID) {
    try {
      logger.debug(REP_FETCH_WORKPACKAGE_MARKER,
          "Entered method selectWorkPackageForProject in class WorkPackageRepository");
      CqnSelect query = Select.from(WorkPackages_.class).where(b -> b.project_ID().eq(projectID));
      Result selectedData = persistenceService.run(query);

      List<WorkPackages> workPackages = new ArrayList<>();

      if (selectedData.rowCount() < 1) {
        return Collections.emptyList();
      }

      Iterator<Row> iterator = selectedData.iterator();

      while (iterator.hasNext()) {
        WorkPackages workPackage = WorkPackages.create();
        workPackage.putAll(iterator.next());
        workPackages.add(workPackage);
      }

      logger.debug(REP_FETCH_WORKPACKAGE_MARKER, "Workpackage for a {} project has been seleted", projectID);
      return workPackages;
    } catch (Exception e) {
      logger.debug(REP_FETCH_WORKPACKAGE_MARKER, "Failed while selecting work package for project {}", projectID);
      // Error logged in calling function
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed while selecting WorkPackage For Project", e);
    }

  }

  public String getWorkPackageNameById(String workPackageId) {
    try {
      logger.debug(REP_FETCH_WORKPACKAGE_MARKER,
          "Entered method getWorkPackageNameById in class WorkPackageRepository");

      CqnSelect query = Select.from(WorkPackages_.class).columns(p -> p.name()).where(p -> p.ID().eq(workPackageId));

      Result result = persistenceService.run(query);

      logger.debug(REP_FETCH_WORKPACKAGE_MARKER, "Fetched WorkPackage Name for ID {}", workPackageId);

      if ((result.iterator().hasNext()) && result.iterator().next().get(WorkPackages.NAME) != null) {
        return result.iterator().next().get(WorkPackages.NAME).toString();
      }
      return null;
    } catch (Exception e) {
      logger.debug(REP_FETCH_WORKPACKAGE_MARKER, "Failed while getting WorkPackage Name by Id {}", workPackageId);
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed while getting WorkPackage Name by Id", e);
    }
  }

}
