package com.sap.c4p.rm.projectintegrationadapter.repository;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.sap.cds.ql.Select;
import com.sap.cds.ql.Update;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.projectintegrationadapter.config.LoggingMarker;

import com.sap.resourcemanagement.config.ProjectReplicationTasks;
import com.sap.resourcemanagement.config.ProjectReplicationTasks_;

@Repository
public class ProjectReplicationTasksRepository {

  private final PersistenceService persistenceService;
  private static final Logger logger = LoggerFactory.getLogger(ProjectReplicationTasksRepository.class);
  private static final Marker REP_CHANGE_PROJECTREPLICATION_MARKER = LoggingMarker.REPLICATION_CHANGE_PROJECTREPLICATION_MARKER
      .getMarker();
  private static final Marker REP_FETCH_PROJECTREPLICATION_MARKER = LoggingMarker.REPLICATION_FETCH_PROJECTREPLICATION_MARKER
      .getMarker();

  @Autowired
  public ProjectReplicationTasksRepository(PersistenceService persistenceService) {
    this.persistenceService = persistenceService;
  }

  /**
   * Method to get the Project Replication Tasks based on Status Code
   */
  public List<ProjectReplicationTasks> getProjectReplicationTaskBasedonTaskStatusCode(Integer status) {
    try {
      logger.debug(REP_FETCH_PROJECTREPLICATION_MARKER, "Getting Project Replication Tasks based on Status");
      Select<ProjectReplicationTasks_> query = Select.from(ProjectReplicationTasks_.class).columns(p -> p._all())
          .where(p -> p.taskStatus_code().eq(status));

      return persistenceService.run(query).listOf(ProjectReplicationTasks.class);
    } catch (Exception e) {
      logger.debug(REP_FETCH_PROJECTREPLICATION_MARKER,
          "Failed while getting service organizations based on initial load status {}", status);
      // Error logged in calling function
      throw new ServiceException(ErrorStatuses.SERVER_ERROR,
          "Failed while getting ServiceOrganizations based on initial load status", e);
    }
  }

  /**
   * Method to update the Project Replication Task Status
   */
  public void updateProjectReplicationTaskStatus(Map<String, Object> data, Map<String, Object> keys) {
    try {

      logger.debug(REP_CHANGE_PROJECTREPLICATION_MARKER,
          "Entered method updateProjectReplicationTaskStatus in class ProjectReplicationTasksRepository");
      CqnUpdate update = Update.entity(ProjectReplicationTasks_.class).data(data).matching(keys);
      persistenceService.run(update);
      logger.info(REP_CHANGE_PROJECTREPLICATION_MARKER, "Updated the Project Replication Task Status Successfully");
    } catch (Exception e) {
      logger.debug(REP_CHANGE_PROJECTREPLICATION_MARKER, "Failed while updating project replication task status");
      // Error logged in calling function
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed while Updating Project Replication Task Status",
          e);
    }
  }

}
