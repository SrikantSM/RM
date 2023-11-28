package com.sap.c4p.rm.projectintegrationadapter.repository;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.sap.cds.Result;
import com.sap.cds.ql.Insert;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.Update;
import com.sap.cds.ql.Upsert;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.ql.cqn.CqnUpsert;
import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.projectintegrationadapter.config.LoggingMarker;
import com.sap.c4p.rm.projectintegrationadapter.util.Constants;

import com.sap.resourcemanagement.integration.ProjectReplicationStatus;
import com.sap.resourcemanagement.integration.ProjectReplicationStatus_;
import com.sap.resourcemanagement.integration.ProjectSync;
import com.sap.resourcemanagement.integration.ProjectSync_;
import com.sap.resourcemanagement.integration.SupplySync;
import com.sap.resourcemanagement.integration.SupplySync_;

@Repository
public class IntegrationStatusRepository {

  private final PersistenceService persistenceService;
  private static final Logger logger = LoggerFactory.getLogger(IntegrationStatusRepository.class);
  private static final Marker REP_CHANGE_PROJECTREPLICATION_MARKER = LoggingMarker.REPLICATION_CHANGE_PROJECTREPLICATION_MARKER
      .getMarker();
  private static final Marker REP_FETCH_PROJECTREPLICATION_MARKER = LoggingMarker.REPLICATION_FETCH_PROJECTREPLICATION_MARKER
      .getMarker();

  @Autowired
  public IntegrationStatusRepository(PersistenceService persistenceService) {
    this.persistenceService = persistenceService;
  }

  public void insertProjectReplicationStatus(ProjectReplicationStatus projectReplicationStatus) {
    try {
      logger.debug(REP_CHANGE_PROJECTREPLICATION_MARKER,
          "Entered method insertProjectReplicationStatus in class IntegrationStatusRepository");
      CqnUpsert query = Upsert.into(ProjectReplicationStatus_.class).entry(projectReplicationStatus);
      persistenceService.run(query);
      logger.debug(REP_CHANGE_PROJECTREPLICATION_MARKER, "Inserted Project Replication Status Successfully");
    } catch (ServiceException e) {
      logger.debug(REP_CHANGE_PROJECTREPLICATION_MARKER, "Failed to insert project replication status {}",
          projectReplicationStatus);
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed in insertProjectReplicationStatus {}",
          projectReplicationStatus, e);
    }
  }

  public void updateProjectReplicationStatus(ProjectReplicationStatus projectReplicationStatus) {
    try {
      logger.debug(REP_CHANGE_PROJECTREPLICATION_MARKER,
          "Entered method updateProjectReplicationStatus in class IntegrationStatusRepository");
      CqnUpdate query = Update.entity(ProjectReplicationStatus_.class).data(projectReplicationStatus);
      persistenceService.run(query);
      logger.debug(REP_CHANGE_PROJECTREPLICATION_MARKER, "Updated Project Replication Status Successfully");
    } catch (ServiceException e) {
      logger.debug(REP_CHANGE_PROJECTREPLICATION_MARKER, "Failed to update project replication status {}",
          projectReplicationStatus);
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed in updateProjectReplicationStatus {}",
          projectReplicationStatus, e);
    }
  }

  public ProjectSync getSingleProjectSync(int status, int replicationType, List<String> serviceOrganizations) {
    try {
      logger.debug(REP_FETCH_PROJECTREPLICATION_MARKER,
          "Entered method getSingleProjectSync in class IntegrationStatusRepository");
      CqnSelect query = Select.from(ProjectSync_.class).limit(1).columns(p -> p._all())
          .where(ps -> ps.status_code().eq(status).and(
              ps.type_type_code().eq(replicationType).and(ps.serviceOrganization_code().in(serviceOrganizations))));
      Result result = persistenceService.run(query);

      if (result.rowCount() < 1) {
        return null;
      }

      ProjectSync projectSync = ProjectSync.create();
      projectSync.putAll(result.single(ProjectSync.class));
      return projectSync;
    } catch (Exception e) {
      logger.debug(REP_FETCH_PROJECTREPLICATION_MARKER,
          "Failed while fetching project sync by status for Status: {} Type: {} Service Organization: {}", status,
          replicationType, serviceOrganizations);
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed while getting SingleProjectSyncByStatus", e);
    }
  }

  public ProjectSync getProjectSyncByProject(String projectId, int replicationType) {

    try {
      logger.debug(REP_FETCH_PROJECTREPLICATION_MARKER,
          "Entered method getProjectSyncByProject in class IntegrationStatusRepository");
      CqnSelect query = Select.from(ProjectSync_.class).limit(1).columns(p -> p._all())
          .where(ps -> ps.project().eq(projectId).and(ps.type_type_code().eq(replicationType)));

      Result result = persistenceService.run(query);

      if (result.rowCount() < 1) {
        logger.debug(REP_FETCH_PROJECTREPLICATION_MARKER,
            "No records fetched from ProjectSync for project ID {} and replcation Type {}", projectId, replicationType);
        return null;
      }

      ProjectSync projectSync = ProjectSync.create();
      projectSync.putAll(result.single(ProjectSync.class));
      return projectSync;
    } catch (Exception e) {
      logger.debug(REP_FETCH_PROJECTREPLICATION_MARKER, "Failed to get project sync for project ID {}", projectId);
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed in getProjectSyncById {}", projectId, e);
    }

  }

  public void updateProjectSyncStatus(ProjectSync projectSync) {
    try {
      logger.debug(REP_CHANGE_PROJECTREPLICATION_MARKER,
          "Entered method updateProjectSyncStatus in class IntegrationStatusRepository");
      CqnUpdate query = Update.entity(ProjectSync_.class).data(projectSync);
      persistenceService.run(query);
      logger.debug(REP_CHANGE_PROJECTREPLICATION_MARKER, "Updated data of project Sync to {}", projectSync);
    } catch (ServiceException e) {
      logger.debug(REP_CHANGE_PROJECTREPLICATION_MARKER, "Failed to update project sync {}", projectSync);
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed in updateProjectSyncStatus {}", projectSync, e);
    }
  }

  public Set<ProjectSync> getErrorProjectsInprocess(int replicationType, List<String> serviceOrganizations) {
    Set<ProjectSync> projectSet = null;
    try {
      logger.debug(REP_FETCH_PROJECTREPLICATION_MARKER,
          "Entered method getErrorProjectsInprocess in class IntegrationStatusRepository");
      CqnSelect select = Select.from(ProjectSync_.class).columns(rs -> rs._all())
          .where(rs -> rs.status_code().eq(Constants.RunStatus.ERROR).and(rs.type_type_code().eq(replicationType))
              .and(rs.serviceOrganization_code().in(serviceOrganizations)));
      Result result = persistenceService.run(select);
      logger.debug(REP_FETCH_PROJECTREPLICATION_MARKER, "Count for Error Projects : {}", result.rowCount());
      if (result.rowCount() > 0) {
        List<ProjectSync> projects = result.listOf(ProjectSync.class);
        return projects.stream().map(project -> {

          ProjectSync single = ProjectSync.create();
          single.setProject(project.getProject());
          single.setStatusCode(Constants.RunStatus.PROCESSING);
          single.setTypeTypeCode(replicationType);
          single.setServiceOrganizationCode(project.getServiceOrganizationCode());

          return single;
        }).collect(Collectors.toSet());
      } else {
        return projectSet;
      }

    } catch (ServiceException e) {
      logger.debug(REP_FETCH_PROJECTREPLICATION_MARKER, "Failed while setting error projects to In-process.");
      // Error logged in calling function.
      throw new ServiceException(e);
    } catch (Exception e) {
      logger.debug(REP_FETCH_PROJECTREPLICATION_MARKER, "Failed while setting ErrorProjects To Inprocess.");
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed while setting ErrorProjects To Inprocess", e);
    }
  }

  public ProjectReplicationStatus readProjectReplicationStatus(final Integer type) {

    try {
      logger.debug(REP_FETCH_PROJECTREPLICATION_MARKER,
          "Entered method readProjectReplicationStatus in class IntegrationStatusRepository");
      CqnSelect select = Select.from(ProjectReplicationStatus_.class).columns(b -> b._all())
          .where(b -> b.type_code().eq(type));

      Result result = persistenceService.run(select);

      if (result.rowCount() >= 1) {
        return result.single(ProjectReplicationStatus.class);
      } else {
        logger.debug(REP_FETCH_PROJECTREPLICATION_MARKER, "No records fetched for type {}", type);
        return null;
      }

    } catch (ServiceException e) {
      logger.debug(REP_FETCH_PROJECTREPLICATION_MARKER, "Failed during read of ProjectReplicationStatus with status {}",
          type);
      // Error logged in calling function.
      throw new ServiceException(e);
    } catch (Exception e) {
      logger.debug(REP_FETCH_PROJECTREPLICATION_MARKER, "Failed during read of ProjectReplicationStatus with status {}",
          type);
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed during read of ProjectReplicationStatus", e);
    }
  }

  public void upsertProjectSync(List<ProjectSync> projectSyncData) {

    try {

      logger.debug(REP_CHANGE_PROJECTREPLICATION_MARKER,
          "Entered method upsertProjectSync in class IntegrationStatusRepository");

      CqnUpsert upsert = Upsert.into(ProjectSync_.class).entries(projectSyncData);

      persistenceService.run(upsert);

      logger.debug(REP_CHANGE_PROJECTREPLICATION_MARKER, "Upsert for  Project Sync {} Successfully", projectSyncData);
    } catch (Exception e) {
      logger.debug(REP_CHANGE_PROJECTREPLICATION_MARKER, "Failed in upsert project sync");
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed in upsert project sync", e);

    }

  }

  public void insertDemandInSupplySync(String demandId) {

    try {

      logger.debug(REP_CHANGE_PROJECTREPLICATION_MARKER,
          "Entered method insertDemandToSupplySync in class IntegrationStatusRepository");
      SupplySync supplySync = SupplySync.create();
      supplySync.setDemand(demandId);

      CqnInsert insert = Insert.into(SupplySync_.class).entry(supplySync);
      persistenceService.run(insert);
      logger.debug(REP_CHANGE_PROJECTREPLICATION_MARKER, "Insert of demand {} in Supplysync Successfully", demandId);
    } catch (Exception e) {
      logger.debug(REP_CHANGE_PROJECTREPLICATION_MARKER, "Failed in insert to Supplysync");
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed in insert to Supplysync", e);

    }

  }
}
