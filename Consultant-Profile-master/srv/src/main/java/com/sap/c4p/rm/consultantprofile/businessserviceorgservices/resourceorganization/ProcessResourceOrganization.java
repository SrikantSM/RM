package com.sap.c4p.rm.consultantprofile.businessserviceorgservices.resourceorganization;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.c4p.rm.consultantprofile.businessserviceorgservices.resourceorganization.dao.ResourceOrganizationDAO;
import com.sap.c4p.rm.consultantprofile.businessserviceorgservices.resourceorganization.utils.ResOrgDisplayIDGenerator;
import com.sap.c4p.rm.consultantprofile.config.LoggingMarker;

import com.sap.resourcemanagement.config.ResourceOrganizationItems;
import com.sap.resourcemanagement.config.ResourceOrganizations;
import com.sap.resourcemanagement.config.ResourceOrganizationsTexts;
import com.sap.resourcemanagement.organization.Details;
import com.sap.resourcemanagement.organization.Headers;

@Component
public class ProcessResourceOrganization {

    private static final Logger LOGGER = LoggerFactory.getLogger(ProcessResourceOrganization.class);

    private static final Marker MARKER = LoggingMarker.SERVICEORG_IMPORTER.getMarker();

    private static final String COST_CENTER = "CS";

    private static final Integer RES_ORG_LIFE_CYCLE_STATUS = 3;

    private static final String DEFAULT_S4_LANGUAGE_CODE = "en";

    private static final String DELIVERY_ORG_TRUE = "X";

    private final ResOrgDisplayIDGenerator resOrgDisplayIdGenerator;

    private final ResourceOrganizationDAO resourceOrganizationDAO;

    @Autowired
    public ProcessResourceOrganization(ResOrgDisplayIDGenerator resOrgDisplayIdGenerator,
            ResourceOrganizationDAO resourceOrganizationDAO) {
        this.resOrgDisplayIdGenerator = resOrgDisplayIdGenerator;
        this.resourceOrganizationDAO = resourceOrganizationDAO;
    }

    public void processServiceOrganizationToResourceOrganization(Set<Headers> organizationHeaders,
            Set<Details> organizationDetails) {

        List<ResourceOrganizations> resourceOrganizations = new ArrayList<>();

        for (Headers header : organizationHeaders) {

            /*
             * Filter all cost center related items for header if isDelivery is set
             */

            if(header.getIsDelivery().equals(DELIVERY_ORG_TRUE) )
            {
            List<Details> filteredDetailsForHeader = organizationDetails.stream().filter(
                    details -> details.getCode().equals(header.getCode()) && details.getUnitType().equals(COST_CENTER))
                    .collect(Collectors.toList());

            resourceOrganizations.add(prepareResourceOrgPayload(header, filteredDetailsForHeader));
            }

        }

        resourceOrganizationDAO.upsertResourceOrganizations(resourceOrganizations);

        ProcessResourceOrganization.LOGGER.info(MARKER, "Persisted {} resource Organizations.",
                resourceOrganizations.size());

    }

    public ResourceOrganizations prepareResourceOrgPayload(Headers header, List<Details> details) {

        ResourceOrganizations resourceOrganization = ResourceOrganizations.create();

        resourceOrganization.setName(header.getDescription());
        resourceOrganization.setDescription(header.getDescription() + "(" + header.getCode() + ")");
        resourceOrganization.setLifeCycleStatusCode(RES_ORG_LIFE_CYCLE_STATUS);
        resourceOrganization.setServiceOrganizationCode(header.getCode());
        /*
         * Check if it's an update scenario and resource org already exist for service
         * org Generate new display ID and set default text and name only if it's a new
         * service org upload
         */

        ResourceOrganizations existingResourceOrg = resourceOrganizationDAO
                .getResourceOrganizationForServiceOrganization(header.getCode());

        if (existingResourceOrg != null) {
            resourceOrganization.setItems(new ArrayList<>());
            resourceOrganization.setId(existingResourceOrg.getId());
            resourceOrganization.setDisplayId(existingResourceOrg.getDisplayId());

            /*
             * Resource org texts are independent of service org update hence update the
             * existing text
             */
            resourceOrganization.setTexts(existingResourceOrg.getTexts());
            for(ResourceOrganizationItems existingResOrgitem : existingResourceOrg.getItems()){
                resourceOrganization.getItems().add(existingResOrgitem);
            }

        } else {

            resourceOrganization.setDisplayId(resOrgDisplayIdGenerator.getDisplayId());
            resourceOrganization.setItems(new ArrayList<>());

            /*
             * Set default en text if it is a new service org upload
             */

            // Assign text array for setting data
            resourceOrganization.setTexts(new ArrayList<>());

            // Text table data flow
            final ResourceOrganizationsTexts resourceOrganizationText = ResourceOrganizationsTexts.create();
            // Prepare resource organization text payload
            resourceOrganizationText.setName(header.getDescription());
            resourceOrganizationText.setDescription(header.getDescription() + "(" + header.getCode() + ")");
            resourceOrganizationText.setLocale(DEFAULT_S4_LANGUAGE_CODE);

            // add resource organization text payload to resource organization object
            resourceOrganization.getTexts().add(resourceOrganizationText);

        }

        if (!details.isEmpty()) {

            for (Details detail : details) {

                ResourceOrganizationItems resourceOrganizationItem = ResourceOrganizationItems.create();

                resourceOrganizationItem.setCostCenterId(detail.getUnitKey());
                resourceOrganizationItem.setResourceOrganizationId(resourceOrganization.getId());
                List<ResourceOrganizationItems> resourceOrganizationItemsList = resourceOrganization.getItems();
                if(existingResourceOrg != null) {
                    boolean isCostCenterPresent = false;
                    for (ResourceOrganizationItems item : existingResourceOrg.getItems()) {

                        if(item.getCostCenterId().equals(resourceOrganizationItem.getCostCenterId())){
                            isCostCenterPresent = true;
                        }
                    }
                    if(!isCostCenterPresent){
                        resourceOrganizationItemsList.add(resourceOrganizationItem);
                    }

                } else {
                    resourceOrganizationItemsList.add(resourceOrganizationItem);
                }
            }

        }
        return resourceOrganization;
    }

}
