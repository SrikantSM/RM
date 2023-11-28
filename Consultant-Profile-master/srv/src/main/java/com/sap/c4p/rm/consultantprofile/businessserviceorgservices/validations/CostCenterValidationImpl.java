package com.sap.c4p.rm.consultantprofile.businessserviceorgservices.validations;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

import jakarta.annotation.PostConstruct;

import org.apache.commons.csv.CSVRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.WebApplicationContext;

import com.sap.cds.Result;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.consultantprofile.businessserviceorgservices.dao.ServiceOrgDAO;
import com.sap.c4p.rm.consultantprofile.businessserviceorgservices.imports.ImportError;
import com.sap.c4p.rm.consultantprofile.businessserviceorgservices.imports.ImportResultBuilder;
import com.sap.c4p.rm.consultantprofile.csvcolumns.BsoCsvColumn;
import com.sap.c4p.rm.consultantprofile.gen.MessageKeys;
import com.sap.c4p.rm.consultantprofile.utils.HttpStatus;

import com.sap.resourcemanagement.config.ResourceOrganizations;
import com.sap.resourcemanagement.config.ResourceOrganizations_;
import com.sap.resourcemanagement.organization.*;
import com.sap.resourcemanagement.organization.Details;
import com.sap.resourcemanagement.organization.Details_;
import com.sap.resourcemanagement.organization.Headers_;
import com.sap.resourcemanagement.resourcerequest.ResourceRequests;
import com.sap.resourcemanagement.resourcerequest.ResourceRequests_;

@Component
@Scope(value = WebApplicationContext.SCOPE_REQUEST, proxyMode = ScopedProxyMode.TARGET_CLASS)
public class CostCenterValidationImpl implements CostCenterValidation {

    private static final Logger LOGGER = LoggerFactory.getLogger(CostCenterValidationImpl.class);

    /**
     * instance to execute DB specific operation
     */
    private PersistenceService persistenceService;
    private List<CostCenters> dbCostCentersData;
    private HashSet<String> uniqueCostCenters = new HashSet<>();
    private ServiceOrgDAO serviceOrgDAO;
    private List<ResourceRequests> dbResourceRequestData;

    @Autowired
    public CostCenterValidationImpl(PersistenceService persistenceService, ServiceOrgDAO serviceOrgDAO) {
        this.persistenceService = persistenceService;
        this.dbCostCentersData = new ArrayList<>();
        this.serviceOrgDAO = serviceOrgDAO;
        this.dbResourceRequestData = new ArrayList<>();
    }

    @PostConstruct
    public void init() {
        CqnSelect query = Select.from(CostCenters_.class);
        dbCostCentersData = persistenceService.run(query).listOf(CostCenters.class);

        // read all the resource requests in single select
        CqnSelect queryForRR = Select.from(ResourceRequests_.class);
        dbResourceRequestData = persistenceService.run(queryForRR).listOf(ResourceRequests.class);
    }

    @Override
    public void validateAllCostCenter(final CSVRecord csvRecord) {

        // validate the costcenterID in entity CostCenters
        final String costCenter = csvRecord.get(BsoCsvColumn.COST_CENTER.getName());
        final String companyCode = csvRecord.get(BsoCsvColumn.COMPANY_CODE.getName());

        final int count = dbCostCentersData.stream()
                .filter(a -> a.getCompanyCode().equals(companyCode) && a.getCostCenterID().equals(costCenter))
                .collect(Collectors.toList()).size();

        if (count == 0) {
            throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.COSTCENTER_DOES_NOT_EXISTS, costCenter,
                    companyCode);
        }
    }

    @Override
    public List<Details> validateInitialCostCenterData(List<Details> organizationDetailsForCostCenter,
            ImportResultBuilder result) {

        List<Details> listOfExistingCostCentersInDB = new ArrayList<>();
        Details existingCostCentersInDB;

        List<Details> dbCostCenters = prepareDBCostCenterData(organizationDetailsForCostCenter);

        java.util.Iterator<Details> iterator = organizationDetailsForCostCenter.iterator();

        while (iterator.hasNext()) {

            Details recordBeingProcessed = iterator.next();

            CostCenterValidationImpl.LOGGER.info(
                    "recordBeingProcessed contents:{} in the method: validateInitialCostCenterData",
                    recordBeingProcessed);

            try {
                // duplicate CC in excel
                this.validateDuplicateCostCenterForInputData(recordBeingProcessed);

                // check if the RO is associated with any request
                this.validateCostCenterForResourceRequestData(recordBeingProcessed, dbCostCenters);

                // duplicate CC in DB
                existingCostCentersInDB = this.validateDuplicateCostCenterForDBData(recordBeingProcessed,
                        dbCostCenters);

                if (existingCostCentersInDB.size() > 0) {

                    CostCenterValidationImpl.LOGGER.info("existingCostCentersInDB contents:{} ",
                            existingCostCentersInDB);

                    listOfExistingCostCentersInDB.add(existingCostCentersInDB);
                }

            } catch (ServiceException e) {
                result.addError(new ImportError(e.getLocalizedMessage(LocaleContextHolder.getLocale())));
                CostCenterValidationImpl.LOGGER.info(
                        "exception is raised for the details: {} and record to be deleted is: {} ",
                        recordBeingProcessed, recordBeingProcessed.getUnitKey());
                iterator.remove();
            }
        }

        CostCenterValidationImpl.LOGGER.info("listOfExistingCostCentersInDB contents:{} ",
                listOfExistingCostCentersInDB);

        return listOfExistingCostCentersInDB;
    }

    @Override
    public List<Details> validateCostCenterData(List<Details> organizationDetailsForCostCenter,
            ImportResultBuilder result) {

        List<Details> costCenterToBeDeletedAfterInitalCheck = new ArrayList<>();
        List<Details> costCentersTOBeRemovedFromProcessing = new ArrayList<>();

        costCenterToBeDeletedAfterInitalCheck = validateInitialCostCenterData(organizationDetailsForCostCenter, result);

        CostCenterValidationImpl.LOGGER.info(
                "costCenterToBeDeletedAfterInitalCheck contents:{} and organizationDetailsForCostCenter: {} after validateInitialCostCenterData method ",
                costCenterToBeDeletedAfterInitalCheck, organizationDetailsForCostCenter);

        if (costCenterToBeDeletedAfterInitalCheck.size() > 0) {

            List<Details> dbCostCenters = prepareDBCostCenterData(organizationDetailsForCostCenter);

            costCentersTOBeRemovedFromProcessing = validateLastCostCenterForServiceOrganization(
                    organizationDetailsForCostCenter, dbCostCenters);

            CostCenterValidationImpl.LOGGER.info("costCentersTOBeRemovedFromProcessing contents:{} ",
                    costCentersTOBeRemovedFromProcessing);

            if (!costCentersTOBeRemovedFromProcessing.isEmpty()) {

                this.removeRecordsFromTheList(organizationDetailsForCostCenter, costCentersTOBeRemovedFromProcessing);

                this.removeRecordsFromTheList(costCenterToBeDeletedAfterInitalCheck,
                        costCentersTOBeRemovedFromProcessing);

                CostCenterValidationImpl.LOGGER.info(
                        "organizationDetailsForCostCenter contents:{} after removal from costCentersTOBeRemovedFromProcessing after removeRecordsFromTheList method during both the calls",
                        organizationDetailsForCostCenter);

                for (Details recordInDetailsCollector : costCentersTOBeRemovedFromProcessing) {
                    try {
                        throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.LAST_COST_CENTER_FOR_SERVICE_ORG,
                                recordInDetailsCollector.getUnitKey(), recordInDetailsCollector.getCode());

                    } catch (ServiceException e) {
                        result.addError(new ImportError(e.getLocalizedMessage(LocaleContextHolder.getLocale())));
                    }
                }
            }
            return costCenterToBeDeletedAfterInitalCheck;
        }
        return costCenterToBeDeletedAfterInitalCheck;
    }

    public List<Details> validateLastCostCenterForServiceOrganization(List<Details> organizationDetailsForCostCenter,
            List<Details> dbCostCenters) {

        List<String> distinctSOs = organizationDetailsForCostCenter.stream().map(Details::getCode).distinct()
                .collect(Collectors.toList());

        CostCenterValidationImpl.LOGGER.info(
                "distinctSOs count: {} in validateLastCostCenterForServiceOrganization and its contents:{}",
                distinctSOs.size(), distinctSOs);

        List<Details> dbServiceOrganizationDetailsData = serviceOrgDAO.readAllServiceOrganizationDetails();

        List<Details> errorCausingEntries = new ArrayList<>();
        HashMap<String, List<Details>> ccForSOCollector = new HashMap<>();
        List<String> serviceOrgList = new ArrayList<>();

        for (String ServiceOrgCode : distinctSOs) {
            try {

                List<Details> costCenterDataForEachServiceOrgInDB = extractedCostCentersForServiceOrg(
                        dbServiceOrganizationDetailsData, ServiceOrgCode);

                CostCenterValidationImpl.LOGGER.info("costCenterDataForEachServiceOrgInDB size: {} in DB for SO:{}",
                        costCenterDataForEachServiceOrgInDB.size(), ServiceOrgCode);

                List<Details> costCenterDataForEachServiceOrgInExcel = extractedCostCentersForServiceOrg(
                        organizationDetailsForCostCenter, ServiceOrgCode);

                CostCenterValidationImpl.LOGGER.info(
                        "costCenterDataForEachServiceOrgInExcel size:{} in Excel for SO: {}",
                        costCenterDataForEachServiceOrgInExcel.size(), ServiceOrgCode);

                for (Details eachEntryInEcel : costCenterDataForEachServiceOrgInExcel) {

                    List<Details> unchangedEntriesInExcelAndDB = extractedServiceOrgForCostCenter(
                            costCenterDataForEachServiceOrgInDB, eachEntryInEcel.getUnitKey());

                    List<Details> associatedToDifferentSOInDB = extractedServiceOrgForCostCenter(dbCostCenters,
                            eachEntryInEcel.getUnitKey());

                    CostCenterValidationImpl.LOGGER.info(
                            "unchangedEntriesInExcelAndDB:{} associatedToDifferentSOInDB: {}",
                            unchangedEntriesInExcelAndDB, associatedToDifferentSOInDB);

                    if (unchangedEntriesInExcelAndDB.size() <= 0 && associatedToDifferentSOInDB.size() > 0) {

                        String serviceOrg = associatedToDifferentSOInDB.get(0).getCode();
                        String costCenter = associatedToDifferentSOInDB.get(0).getUnitKey();
                        Details erraneousRecord;

                        if (!(serviceOrgList.contains(serviceOrg))) {

                            List<Details> costCentersForSO = extractedCostCentersForServiceOrg(
                                    dbServiceOrganizationDetailsData, serviceOrg);

                            CostCenterValidationImpl.LOGGER.info(
                                    "costCentersForSO size:{} and contents of costCentersForSO: {} inside the if clause of serviceOrgList ",
                                    costCentersForSO.size(), costCentersForSO);

                            serviceOrgList.add(serviceOrg);
                            ccForSOCollector.put(serviceOrg, costCentersForSO);
                        }

                        List<Details> costCentersForSOFromBuffer = extractedCostCentersForSOFromBuffer(ccForSOCollector,
                                serviceOrg, costCenter);

                        if (costCentersForSOFromBuffer.size() == 0) {

                            erraneousRecord = extractedErrorCausingEntries(organizationDetailsForCostCenter,
                                    associatedToDifferentSOInDB.get(0));
                            CostCenterValidationImpl.LOGGER.info(
                                    "erraneousRecord: {} in validateLastCostCenterForServiceOrganization method",
                                    erraneousRecord);
                            if (erraneousRecord != null) {
                                errorCausingEntries.add(erraneousRecord);
                                CostCenterValidationImpl.LOGGER.info("errorCausingEntries: {}", errorCausingEntries);
                            }
                        }
                    }
                }
            } catch (RuntimeException e) {
                CostCenterValidationImpl.LOGGER.info(
                        "exception caught  e.toString(): {}, e.fillInStackTrace: {}, e.getMessage: {}, e.getCause():{}",
                        e.toString(), e.fillInStackTrace(), e.getMessage(), e.getCause());
            }
        }
        return errorCausingEntries;
    }

    @Override
    public void validateDuplicateCostCenterForInputData(Details details) {

        final String costCenter = details.getUnitKey();

        if (!uniqueCostCenters.add(costCenter)) {

            CostCenterValidationImpl.LOGGER.info("uniqueCostCenters size after the check failed: {}, and contents: {} ",
                    uniqueCostCenters.size(), uniqueCostCenters);

            throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.COST_CENTER_DUPLICATE, costCenter);
        }
    }

    @Override
    public Details validateDuplicateCostCenterForDBData(Details details, List<Details> dbCostCenters) {

        List<Details> listOfExistingRecordForCC = new ArrayList<>();
        Details erraneousRecord = Details.create();

        // Check in DB if the same costcenter is Assigned with other Service Org
        listOfExistingRecordForCC = dbCostCenters.stream()
                .filter(a -> !(a.getCode().equals(details.getCode())) && a.getUnitKey().equals(details.getUnitKey()))
                .collect(Collectors.toList());

        if ((listOfExistingRecordForCC.size()) > 0) {

            erraneousRecord = listOfExistingRecordForCC.get(0);

            CostCenterValidationImpl.LOGGER.info(
                    "record found.costCenter: {},serviceOrgCode: {} and CC is: {} in validateDuplicateCostCenterForDBData method ",
                    erraneousRecord.getUnitKey(), erraneousRecord.getCode(), listOfExistingRecordForCC.size());

            return erraneousRecord;
        }
        return erraneousRecord;

    }

    @Override
    public void validateCostCenterForResourceRequestData(Details details, List<Details> dbCostCenters) {

        List<Details> listOfExistingRecordForSO = new ArrayList<>();

        listOfExistingRecordForSO = dbCostCenters.stream()
                .filter(a -> !(a.getCode().equals(details.getCode())) && a.getUnitKey().equals(details.getUnitKey()))
                .collect(Collectors.toList());

        CostCenterValidationImpl.LOGGER.info(
                "in method: validateCostCenterForResourceRequestData, the value of ListOfExistingRecord:{}",
                listOfExistingRecordForSO);

        if (listOfExistingRecordForSO.size() > 0) {

            Details erraneousRecordForSO = listOfExistingRecordForSO.get(0);

            String serviceOrgCode = erraneousRecordForSO.getCode();
            String costCenter = erraneousRecordForSO.getUnitKey();
            // check if the service org is existing already, if not dont execute the query
            // for the resource org
            CqnSelect selectForServiceOrganization = Select.from(Headers_.class)
                    .where(a -> a.code().eq(serviceOrgCode));

            Result serviceOrganizationDBresult = persistenceService.run(selectForServiceOrganization);

            // determine the corresponding resourceOrganization for the given service
            // organization

            if (serviceOrganizationDBresult.rowCount() > 0) {

                CqnSelect select = Select.from(ResourceOrganizations_.class)
                        .columns(resourceOrg -> resourceOrg.displayId())
                        .where(resourceOrganization -> resourceOrganization.serviceOrganization_code()
                                .eq(serviceOrgCode));

                Result resultDB = persistenceService.run(select);
                String displayId = resultDB.single(ResourceOrganizations.class).getDisplayId();

                CostCenterValidationImpl.LOGGER.info(
                        "in method: validateCostCenterForResourceRequestData, the value of displayId:{}, serviceOrgCode: {}",
                        displayId, serviceOrgCode);

                // From all the resource requests in the DB, get only the ones whose processing
                // resource org is the above extracted resource org
                List<ResourceRequests> listOfResourceRequest = dbResourceRequestData.stream()
                        .filter(a -> (displayId.equals(a.getProcessingResourceOrgId()))).collect(Collectors.toList());

                CostCenterValidationImpl.LOGGER.info(
                        "in method: validateCostCenterForResourceRequestData, the value of listOfResourceRequest:{} ",
                        listOfResourceRequest);

                for (ResourceRequests eachRequest : listOfResourceRequest) {
                    // if there is atleast one resource request which is in published status for
                    // a given resource org, display an error.
                    if (eachRequest.getReleaseStatusCode() == 1) {
                        CostCenterValidationImpl.LOGGER.info(
                                "in method: validateCostCenterForResourceRequestData, the value of eachRequest:{} ",
                                eachRequest);
                        throw new ServiceException(HttpStatus.BAD_REQUEST,
                                MessageKeys.RESOURCE_ORG_ASSIGNED_TO_PUBLISHED_RR, costCenter, serviceOrgCode,
                                displayId);

                    }
                }
            }
        }
    }

    private void removeRecordsFromTheList(List<Details> organizationDetailsForCostCenter,
            List<Details> costCentersTOBeRemovedFromProcessing) {

        java.util.Iterator<Details> iteratorForRemoval = organizationDetailsForCostCenter.iterator();
        while (iteratorForRemoval.hasNext()) {

            Details detailsForRemoval = iteratorForRemoval.next();
            String costCenterForRemoval = detailsForRemoval.getUnitKey();

            List<Details> recordToBeRemoved = extractedServiceOrgForCostCenter(costCentersTOBeRemovedFromProcessing,
                    costCenterForRemoval);

            if (recordToBeRemoved.size() > 0) {

                CostCenterValidationImpl.LOGGER.info(
                        "recordToBeRemoved is not empty: {} in removeRecordsFromTheList method and contents: {} ",
                        recordToBeRemoved.size(), recordToBeRemoved);

                iteratorForRemoval.remove();
            }
        }
    }

    /**
     * @param organizationDetailsForCostCenter
     * @return
     */
    private List<Details> prepareDBCostCenterData(List<Details> organizationDetailsForCostCenter) {

        List<Details> dbCostCenters = new ArrayList<>();

        List<String> costCenters = organizationDetailsForCostCenter.stream().map(Details::getUnitKey)
                .collect(Collectors.toList());

        CqnSelect queryForSelect = Select.from(Details_.class)
                .where(b -> b.unitKey().in(costCenters).and(b.unitType().eq("CS")));

        dbCostCenters = persistenceService.run(queryForSelect).listOf(Details.class).stream()
                .collect(Collectors.toList());

        CostCenterValidationImpl.LOGGER.info(
                "number of entries in dbCostCenters in prepareCostCenterData method is: {}", dbCostCenters.size());

        return dbCostCenters;
    }

    /**
     * @param organizationDetailsForCostCenter
     * @param errorCausingEntries
     * @param details
     * @param serviceOrg
     */
    private Details extractedErrorCausingEntries(List<Details> organizationDetailsForCostCenter, Details details) {

        List<Details> newAssociationCreated = new ArrayList<>();
        newAssociationCreated = extractedCostCentersForServiceOrg(organizationDetailsForCostCenter, details.getCode());

        if (newAssociationCreated.size() == 0) {

            CostCenterValidationImpl.LOGGER.info(
                    "ServiceOrg : {} in extractedErrorCausingEntries method and record causing error: {}",
                    details.getCode(), details);
            return details;
        } else {
            return null;
        }

    }

    /**
     * @param dbServiceOrganizationDetailsData
     * @return
     */
    private List<Details> extractedCostCentersForServiceOrg(List<Details> organizationDetailsBuffer,
            String serviceOrg) {

        List<Details> costCentersForSO = organizationDetailsBuffer.stream()
                .filter(a -> (a.getUnitType().equals("CS")) && a.getCode().equals(serviceOrg))
                .collect(Collectors.toList());

        CostCenterValidationImpl.LOGGER.info("costCentersForSO: {} in extractedCostCentersForServiceOrg method ",
                costCentersForSO);

        return costCentersForSO;
    }

    /**
     * @param dbServiceOrganizationDetailsData
     * @return
     */
    private List<Details> extractedServiceOrgForCostCenter(List<Details> organizationDetailsBuffer, String costCenter) {

        List<Details> serviceOrgForCostCenter = new ArrayList<>();
        if (!organizationDetailsBuffer.isEmpty()) {

            serviceOrgForCostCenter = organizationDetailsBuffer.stream().filter(a -> a.getUnitKey().equals(costCenter))
                    .collect(Collectors.toList());

            CostCenterValidationImpl.LOGGER.info(
                    "serviceOrgForCostCenter: {} in extractedServiceOrgForCostCenter method ", serviceOrgForCostCenter);

        }
        return serviceOrgForCostCenter;
    }

    private List<Details> extractedCostCentersForSOFromBuffer(HashMap<String, List<Details>> ccForSOCollector,
            String serviceOrg, String costCenter) {
        List<Details> costCentersForSOFromBuffer = ccForSOCollector.get(serviceOrg);

        java.util.Iterator<Details> iteratorForList = costCentersForSOFromBuffer.iterator();

        while (iteratorForList.hasNext()) {
            Details eachEntry = iteratorForList.next();
            if (costCenter.equals(eachEntry.getUnitKey())) {
                iteratorForList.remove();
                CostCenterValidationImpl.LOGGER.info(
                        "eachEntry contents:{} after removal and size of costCentersForSOFromBuffer: {}", eachEntry,
                        costCentersForSOFromBuffer.size());
            }
        }

        ccForSOCollector.replace(serviceOrg, costCentersForSOFromBuffer);
        return costCentersForSOFromBuffer;
    }
}
