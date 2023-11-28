package com.sap.c4p.rm.consultantprofile.businessserviceorgservices.resourceorganization.dao;

import static com.sap.cds.impl.builder.model.CqnParam.param;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.Result;
import com.sap.cds.ql.Delete;
import com.sap.cds.ql.Insert;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.resourcemanagement.config.ResourceOrganizationItems;
import com.sap.resourcemanagement.config.ResourceOrganizationItems_;
import com.sap.resourcemanagement.config.ResourceOrganizations;
import com.sap.resourcemanagement.config.ResourceOrganizations_;

@Component
public class ResourceOrganizationDAOImpl implements ResourceOrganizationDAO {

    private final PersistenceService persistenceService;

    @Autowired
    public ResourceOrganizationDAOImpl(PersistenceService persistenceService) {
        super();
        this.persistenceService = persistenceService;
    }

    @Override
    public ResourceOrganizations getResourceOrganizationForServiceOrganization(String serviceOrganizationCode) {
        /*
         * Select with resource org details and text expanded
         */
        CqnSelect select = Select.from(ResourceOrganizations_.class)
                .columns(resourceOrg -> resourceOrg.ID(), resourceOrg -> resourceOrg.displayId(),
                        resourceOrg -> resourceOrg.name(), resourceOrg -> resourceOrg.description(),
                        resourceOrg -> resourceOrg.serviceOrganization_code(),
                        resourceOrg -> resourceOrg.lifeCycleStatus_code(), resourceOrg -> resourceOrg.texts().expand(),
                        resourceOrg -> resourceOrg.items().expand())
                .where(resourceOrganization -> resourceOrganization.serviceOrganization_code()
                        .eq(serviceOrganizationCode));

        Result result = persistenceService.run(select);

        if (result.rowCount() > 0) {
            return result.single(ResourceOrganizations.class);

        } else {
            return null;
        }

    }

    @Override
    public void upsertResourceOrganizations(List<ResourceOrganizations> resourceOrganizations) {

        if (!resourceOrganizations.isEmpty()) {
            deleteResourceOrganizations(resourceOrganizations);
            CqnInsert cqnInsert = Insert.into(ResourceOrganizations_.class).entries(resourceOrganizations);
            persistenceService.run(cqnInsert);
        }

    }

    @Override
    public void deleteResourceOrganizations(List<ResourceOrganizations> resourceOrganizations) {

        CqnDelete cqnDelete = Delete.from(ResourceOrganizations_.class)
                .where(resourceOrg -> resourceOrg.displayId().eq(param("displayId")));

        List<Map<String, Object>> paramList = new ArrayList<>();
        for (ResourceOrganizations param : resourceOrganizations) {
            Map<String, Object> p = new HashMap<>();
            p.put("displayId", param.getDisplayId());
            paramList.add(p);

            /*
             * Delete resource organization items of each resource organization too
             */
            deleteResourceOrganizationItems(param.getItems());
        }
        persistenceService.run(cqnDelete, paramList);

    }

    @Override
    public void deleteResourceOrganizationItems(List<ResourceOrganizationItems> resourceOrganizationItems) {

        CqnDelete cqnDelete = Delete.from(ResourceOrganizationItems_.class)
                .where(resourceOrgItems -> resourceOrgItems.resourceOrganization_ID().eq(param("resOrgId")));

        List<Map<String, Object>> paramList = new ArrayList<>();
        for (ResourceOrganizationItems param : resourceOrganizationItems) {
            Map<String, Object> p = new HashMap<>();
            p.put("resOrgId", param.getResourceOrganizationId());
            paramList.add(p);
        }
        persistenceService.run(cqnDelete, paramList);

    }

    @Override
    public void deleteResourceOrganizationItemsBasedOnCostCenter(
            List<ResourceOrganizationItems> resourceOrganizationItems) {

        CqnDelete cqnDelete = Delete.from(ResourceOrganizationItems_.class)
                .where(resourceOrgItems -> resourceOrgItems.costCenterId().eq(param("costCenterId")));

        List<Map<String, Object>> paramList = new ArrayList<>();
        for (ResourceOrganizationItems param : resourceOrganizationItems) {
            Map<String, Object> p = new HashMap<>();
            p.put("costCenterId", param.getCostCenterId());
            paramList.add(p);
        }
        persistenceService.run(cqnDelete, paramList);

    }

    @Override
    public List<ResourceOrganizationItems> readAllResourceOrganizationItems() {
        CqnSelect cqnSelect = Select.from(ResourceOrganizationItems_.class);
        return persistenceService.run(cqnSelect).listOf(ResourceOrganizationItems.class);
    }

}
