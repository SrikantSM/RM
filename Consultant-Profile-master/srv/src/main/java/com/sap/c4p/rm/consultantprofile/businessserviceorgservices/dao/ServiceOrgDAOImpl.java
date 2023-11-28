package com.sap.c4p.rm.consultantprofile.businessserviceorgservices.dao;

import static com.sap.cds.impl.builder.model.CqnParam.param;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.ql.Delete;
import com.sap.cds.ql.Insert;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.resourcemanagement.organization.Details;
import com.sap.resourcemanagement.organization.Details_;
import com.sap.resourcemanagement.organization.Headers;
import com.sap.resourcemanagement.organization.Headers_;

@Component
public class ServiceOrgDAOImpl implements ServiceOrgDAO {

    private final PersistenceService persistenceService;
    private static final Logger LOGGER = LoggerFactory.getLogger(ServiceOrgDAOImpl.class);

    @Autowired
    public ServiceOrgDAOImpl(PersistenceService persistenceService) {
        this.persistenceService = persistenceService;
    }

    @Override
    public void upsertNewServiceOrgHead(Set<Headers> organizationHeaders) {

        if (!organizationHeaders.isEmpty()) {
            deleteServiceOrgHeader(organizationHeaders);
            CqnInsert cqnInsert = Insert.into(Headers_.class).entries(organizationHeaders);
            persistenceService.run(cqnInsert);
        }

    }

    @Override
    public void upsertNewServiceOrgDetails(Set<Details> organizationDetails) {

        if (!organizationDetails.isEmpty()) {
            deleteServiceOrgDetail(organizationDetails);
            CqnInsert cqnInsert = Insert.into(Details_.class).entries(organizationDetails);
            persistenceService.run(cqnInsert);
        }

    }

    @Override
    public void deleteServiceOrgHeader(Set<Headers> organizationHeaders) {
        CqnDelete cqnDelete = Delete.from(Headers_.class).where(p -> p.code().eq(param("code")));

        List<Map<String, Object>> paramList = new ArrayList<>();
        for (Headers param : organizationHeaders) {
            Map<String, Object> p = new HashMap<>();
            p.put("code", param.getCode());
            paramList.add(p);
        }
        persistenceService.run(cqnDelete, paramList);
    }

    @Override
    public void deleteServiceOrgDetail(Set<Details> organizationDetails) {
        CqnDelete cqnDelete = Delete.from(Details_.class).where(p -> p.code().eq(param("id_code"))
                .and(p.unitKey().eq(param("id_unitKey"))).and(p.unitType().eq(param("id_unitType"))));
        ServiceOrgDAOImpl.LOGGER.info("deleteServiceOrgDetail method for organizationDetails with size:{} ",
                organizationDetails.size());
        List<Map<String, Object>> paramList = new ArrayList<>();
        for (Details param : organizationDetails) {
            Map<String, Object> p = new HashMap<>();
            p.put("id_code", param.getCode());
            p.put("id_unitKey", param.getUnitKey());
            p.put("id_unitType", param.getUnitType());
            ServiceOrgDAOImpl.LOGGER.info("contents of p in deleteServiceOrgDetail:{} ", p);
            paramList.add(p);
        }
        persistenceService.run(cqnDelete, paramList);
    }

    @Override
    public List<Details> readAllServiceOrganizationDetails() {
        CqnSelect cqnSelect = Select.from(Details_.class);
        return persistenceService.run(cqnSelect).listOf(Details.class);
    }

}
