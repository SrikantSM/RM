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
import com.sap.cds.ql.Update;
import com.sap.cds.ql.Upsert;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.ql.cqn.CqnUpsert;
import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.projectintegrationadapter.config.LoggingMarker;

import com.sap.resourcemanagement.integration.ProjectSync_;
import com.sap.resourcemanagement.project.Customers;
import com.sap.resourcemanagement.project.Customers_;
import com.sap.resourcemanagement.project.Projects;
import com.sap.resourcemanagement.project.Projects_;

@Repository
public class ProjectRepository {

  private final PersistenceService persistenceService;

  private static final Logger logger = LoggerFactory.getLogger(ProjectRepository.class);
  private static final Marker REP_DELETE_PROJECT_MARKER = LoggingMarker.REPLICATION_DELETE_PROJECT_MARKER.getMarker();
  private static final Marker REP_CHANGE_PROJECT_MARKER = LoggingMarker.REPLICATION_CHANGE_PROJECT_MARKER.getMarker();
  private static final Marker REP_FETCH_PROJECT_MARKER = LoggingMarker.REPLICATION_CHANGE_PROJECT_MARKER.getMarker();

  @Autowired
  public ProjectRepository(PersistenceService persistenceService) {
    this.persistenceService = persistenceService;
  }

  public void upsertProjects(List<CdsData> projects) {
    try {
      logger.debug(REP_CHANGE_PROJECT_MARKER, "Entered method upsertProjects in class ProjectRepository");
      CqnUpsert query = Upsert.into(Projects_.class).entries(projects);
      persistenceService.run(query);
      logger.debug(REP_CHANGE_PROJECT_MARKER, "Projects were successfully upserted");
    } catch (ServiceException e) {
      logger.debug(REP_CHANGE_PROJECT_MARKER, "Failed to update projects {}", projects);
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed in upsertProjects {}", projects, e);
    }
  }

  public void updateProject(Projects project) {

    try {
      logger.debug(REP_CHANGE_PROJECT_MARKER, "Entered method updateProject in class ProjectRepository");
      CqnUpdate query = Update.entity(Projects_.class).data(project);
      persistenceService.run(query);
      logger.debug(REP_CHANGE_PROJECT_MARKER, "{} Project was successfully updated", project.getId());
    } catch (ServiceException e) {
      throw new ServiceException(e);
    } catch (Exception e) {
      logger.debug(REP_CHANGE_PROJECT_MARKER, "Failed to update project {}", project);
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed in updateProject {}", project, e);
    }
  }

  public Projects selectProjectTree(String projectId) {
    try {
      logger.debug(REP_FETCH_PROJECT_MARKER, "Entered method selectProjectTree in class ProjectRepository");
      CqnSelect query = Select
          .from(
              Projects_.class)
          .columns(p -> p._all(), w -> w.workPackages().expand(d -> d._all(),
              demand -> demand.demands().expand(demandCol -> demandCol._all())))
          .where(p -> p.ID().eq(projectId));

      Result result = persistenceService.run(query);

      if (result.rowCount() < 1) {
        return null;
      }

      Projects selectedProject = Projects.create();
      selectedProject.putAll(result.single(Projects.class));
      logger.debug(REP_FETCH_PROJECT_MARKER, "{} Project was successfully selected", projectId);
      return selectedProject;
    } catch (Exception e) {
      logger.debug(REP_FETCH_PROJECT_MARKER, "Failed in select project with ID {}", projectId);
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed in selectProjectTree {}", projectId, e);
    }
  }

  public Customers getCustomerById(String customerId) {
    try {
      logger.debug(REP_FETCH_PROJECT_MARKER, "Entered method getCustomerById in class ProjectRepository");
      CqnSelect query = Select.from(Customers_.class).columns(p -> p._all()).where(p -> p.ID().eq(customerId));

      Result result = persistenceService.run(query);

      if (result.rowCount() < 1) {
        return null;
      }

      Customers selectedCustomer = Customers.create();
      selectedCustomer.putAll(result.single(Customers.class));
      logger.debug(REP_FETCH_PROJECT_MARKER, "{} Customer was successfully selected", customerId);
      return selectedCustomer;
    } catch (Exception e) {
      logger.debug(REP_FETCH_PROJECT_MARKER, "Failed to get customer with ID {}", customerId);
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed in getCustomerById {}", customerId, e);
    }

  }

  public void upsertCustomer(Customers customer) {
    try {
      logger.debug(REP_CHANGE_PROJECT_MARKER, "Entered method upsertCustomer in class ProjectRepository");
      CqnUpsert query = Upsert.into(Customers_.class).entry(customer);
      persistenceService.run(query);
      logger.debug(REP_CHANGE_PROJECT_MARKER, "{} Customer was successfully upserted", customer.getId());
    } catch (ServiceException e) {
      logger.debug(REP_CHANGE_PROJECT_MARKER, "Failed to upsert customer {}", customer);
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed in upsertCustomer {}", customer, e);
    }
  }

  public void deleteProject(String projectID) {

    try {
      logger.debug(REP_DELETE_PROJECT_MARKER, "Entered method deleteProject in class ProjectRepository");
      CqnDelete query = Delete.from(Projects_.class).where(b -> b.ID().eq(projectID));
      persistenceService.run(query);
      logger.debug(REP_DELETE_PROJECT_MARKER, "{} project was successfully deleted", projectID);
    } catch (ServiceException e) {
      logger.debug(REP_DELETE_PROJECT_MARKER, "Failed to delete project {}", projectID);
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed in deleteProject {}", projectID, e);
    }
  }

  public String getCustomer(String projectID) {
    try {

      logger.debug(REP_FETCH_PROJECT_MARKER, "Entered method getCustomer in class ProjectRepository");
      CqnSelect query = Select.from(Projects_.class).columns(p -> p.customer_ID()).where(p -> p.ID().eq(projectID));

      Result result = persistenceService.run(query);

      if (result.rowCount() < 1) {
        logger.debug(REP_FETCH_PROJECT_MARKER, "No customer with Project ID as {}", projectID);
        return null;
      }

      if ((result.iterator().hasNext()) && result.iterator().next().get(Projects.CUSTOMER_ID) != null)
        return result.iterator().next().get(Projects.CUSTOMER_ID).toString();

      return null;
    } catch (Exception e) {
      logger.debug(REP_FETCH_PROJECT_MARKER, "Failed to get customer with project ID {}", projectID);
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed while getting Customer", e);
    }
  }

  public void deleteCustomer(String customerID) {
    try {
      logger.debug(REP_CHANGE_PROJECT_MARKER, "Entered method deleteCustomer in class ProjectRepository");
      CqnDelete query = Delete.from(Customers_.class).where(p -> p.ID().eq(customerID));
      persistenceService.run(query);
      logger.debug(REP_CHANGE_PROJECT_MARKER, "{} Customer was successfully deleted", customerID);
    } catch (ServiceException e) {
      logger.debug(REP_CHANGE_PROJECT_MARKER, "Failed to delete customer with ID {}", customerID);
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed during deletion of Customer", e);
    }
  }

  public List<String> getProjectsByServiceOrganization(List<String> serviceOrganizationCodes) {
    try {
      logger.debug(REP_FETCH_PROJECT_MARKER,
          "Entered method getProjectsByServiceOrganization in class ProjectRepository");
      CqnSelect query = Select.from(Projects_.class).columns(p -> p.ID())
          .where(p -> p.serviceOrganization_code().in(serviceOrganizationCodes));

      Result result = persistenceService.run(query);
      logger.debug(REP_FETCH_PROJECT_MARKER, "Fetched Project with Service Organization {}", serviceOrganizationCodes);
      return getProcessedResult(result);
    } catch (Exception e) {
      logger.debug(REP_FETCH_PROJECT_MARKER, "Failed while getting Projects by Service organization {}",
          serviceOrganizationCodes);
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed while getting Projects by Service organizations",
          e);
    }
  }

  public List<String> getProcessedResult(Result result) {

    try {
      logger.debug(REP_FETCH_PROJECT_MARKER, "Entered method getProcessedResult in class ProjectRepository");
      if (result.rowCount() < 1) {
        return Collections.emptyList();
      }

      List<String> projectList = new ArrayList<>();
      Iterator<Row> iterator = result.iterator();
      while (iterator.hasNext()) {
        projectList.add(iterator.next().get(Projects.ID).toString());

      }
      logger.debug(REP_FETCH_PROJECT_MARKER, "Successfully generated project list");
      return projectList;
    } catch (Exception e) {
      logger.debug(REP_FETCH_PROJECT_MARKER, "Failed while getting Projects");
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed while getting Projects", e);
    }

  }

  public int getCustomerProject(String customerID) {
    try {
      logger.debug(REP_FETCH_PROJECT_MARKER, "Entered method getCustomerProject in class ProjectRepository");
      CqnSelect query = Select.from(Projects_.class).columns(p -> p.ID()).where(p -> p.customer_ID().eq(customerID));

      Result result = persistenceService.run(query);
      logger.debug(REP_FETCH_PROJECT_MARKER, "Successfully fetched customer with customer ID  {}", customerID);
      return (int) result.rowCount();
    } catch (Exception e) {
      logger.debug(REP_FETCH_PROJECT_MARKER, "Failed while getting Customer Project with customer ID {}", customerID);
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed while getting CustomerProject", e);
    }
  }

  // This method deletes project record from project sync table
  public void deleteProjectSync(String projectId) {
    try {
      logger.debug(REP_DELETE_PROJECT_MARKER, "Entered method deleteProjectSync in class ProjectRepostory");
      CqnDelete delete = Delete.from(ProjectSync_.class).where(b -> b.project().eq(projectId));

      persistenceService.run(delete);
      logger.debug(REP_DELETE_PROJECT_MARKER, "Deleted Project {} from project Sync Successfully", projectId);
    } catch (ServiceException e) {
      logger.debug(REP_DELETE_PROJECT_MARKER, "Failed to delete Project {} from project Sync.", projectId);
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed in deleteProjectSync {}", projectId);
    }
  }

}
