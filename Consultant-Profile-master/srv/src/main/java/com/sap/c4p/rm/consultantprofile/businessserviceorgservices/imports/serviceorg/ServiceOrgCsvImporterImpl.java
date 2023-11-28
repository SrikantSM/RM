package com.sap.c4p.rm.consultantprofile.businessserviceorgservices.imports.serviceorg;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.consultantprofile.businessserviceorgservices.dao.ServiceOrgDAO;
import com.sap.c4p.rm.consultantprofile.businessserviceorgservices.imports.ImportError;
import com.sap.c4p.rm.consultantprofile.businessserviceorgservices.imports.ImportResult;
import com.sap.c4p.rm.consultantprofile.businessserviceorgservices.imports.ImportResultBuilder;
import com.sap.c4p.rm.consultantprofile.businessserviceorgservices.imports.ImportResultImpl;
import com.sap.c4p.rm.consultantprofile.businessserviceorgservices.resourceorganization.ProcessResourceOrganization;
import com.sap.c4p.rm.consultantprofile.businessserviceorgservices.resourceorganization.dao.ResourceOrganizationDAO;
import com.sap.c4p.rm.consultantprofile.businessserviceorgservices.validations.CostCenterValidation;
import com.sap.c4p.rm.consultantprofile.config.LoggingMarker;
import com.sap.c4p.rm.consultantprofile.csvcolumns.BsoCsvColumn;

import com.sap.resourcemanagement.config.ResourceOrganizationItems;
import com.sap.resourcemanagement.organization.Details;
import com.sap.resourcemanagement.organization.Headers;
import com.sap.resourcemanagement.organization.HeadersWithDetails;

/**
 * This class process the CSV records and prepare the Headers and Details
 * records
 */
@Service
public class ServiceOrgCsvImporterImpl implements ServiceOrgCsvImporter {

    private static final Logger LOGGER = LoggerFactory.getLogger(ServiceOrgCsvImporterImpl.class);

    private static final Marker MARKER = LoggingMarker.SERVICEORG_IMPORTER.getMarker();

    private final CsvConsistencyCheck csvConsistencyCheck;
    /**
     * instance to perform DB persist operation
     */
    private final ServiceOrgDAO serviceOrgDAO;
    /**
     * instance to perform costcenter validations
     */
    private final CostCenterValidation costCenterValidation;

    private final ProcessResourceOrganization processResourceOrganization;

    private ResourceOrganizationDAO resourceOrganizationDAO;
    /**
     * collectors to store the organization details and header with details with the
     * correct records to be processed later
     */

    private HashMap<Integer, HeadersWithDetails> organizationHeaderswithDetailsCollector = new HashMap<>();
    private HashMap<Integer, Details> organizationDetailsCollector = new HashMap<>();

    /**
     * instance to perform csv consistency check
     */
    @Autowired
    public ServiceOrgCsvImporterImpl(CsvConsistencyCheck csvConsistencyCheck, ServiceOrgDAO serviceOrgDAO,
            CostCenterValidation costCenterValidation, ProcessResourceOrganization processResourceOrganization,
            ResourceOrganizationDAO resourceOrganizationDAO) {
        this.csvConsistencyCheck = csvConsistencyCheck;
        this.serviceOrgDAO = serviceOrgDAO;
        this.costCenterValidation = costCenterValidation;
        this.processResourceOrganization = processResourceOrganization;
        this.resourceOrganizationDAO = resourceOrganizationDAO;
    }

    @Override
    public ImportResult importStream(final InputStream csvStream) throws IOException {
        final ImportResultBuilder result = new ImportResultImpl();
        CSVParser csvParser = null;
        csvParser = CSVParser.parse(csvStream, StandardCharsets.UTF_8, CSVFormat.RFC4180.withFirstRecordAsHeader());
        try {
            this.csvConsistencyCheck.checkHeaders(csvParser.getHeaderMap().keySet());
        } catch (ServiceException e) {
            result.addError(new ImportError(e.getLocalizedMessage(LocaleContextHolder.getLocale())));
            ServiceOrgCsvImporterImpl.LOGGER.info(MARKER, "Record not persisted CSV header missing: ", e);
        }
        if (result.build().getErrors().isEmpty()) {
            organizationHeaderswithDetailsCollector.clear();
            organizationDetailsCollector.clear();
            this.processRecords(csvParser, result);
        }
        return result.build();
    }

    /**
     * creates the list as the main entry point and calls the ServiceOrgDAO for
     * upserting the data
     */
    private void processRecords(final CSVParser csvParser, ImportResultBuilder result) {
        List<Details> organizationDetailsForCostCenter = new ArrayList<>();
        HeadersWithDetails organizationHeaderswithDetails = null;
        Set<Headers> organizationHeaders = new HashSet<>();
        Set<Details> organizationDetails = new HashSet<>();
        int count = 0;
        for (CSVRecord csvRecord : csvParser) {
            if (csvRecord.size() > 1) {
                try {
                    count++;

                    // csv content check
                    this.csvConsistencyCheck.checkContent(csvRecord);
                    ServiceOrgCsvImporterImpl.LOGGER.info(MARKER, "checkContent method for record:{} ", count);
                    // CC data presence in DB
                    costCenterValidation.validateAllCostCenter(csvRecord);
                    ServiceOrgCsvImporterImpl.LOGGER.info(MARKER, "validateAllCostCenter method for record:{} ", count);
                    // prepare headerwithDetails
                    organizationHeaderswithDetails = this.parseServiceOrg(csvRecord);
                    // prepare organization details
                    Details detailsEntry = this.addOrganizationDetailsForCSMap(organizationDetailsForCostCenter,
                            organizationHeaderswithDetails);
                    ServiceOrgCsvImporterImpl.LOGGER.info(MARKER,
                            "addOrganizationDetailsForCSMap method for record with data:{} ", detailsEntry);
                    // populate details collector
                    organizationDetailsCollector.put(count, detailsEntry);
                    ServiceOrgCsvImporterImpl.LOGGER.info(MARKER,
                            "number of records in organizationDetailsCollector hashmap is:{} ",
                            organizationDetailsCollector.size());
                    // populate headerwithdetails collector
                    organizationHeaderswithDetailsCollector.put(count, organizationHeaderswithDetails);
                    ServiceOrgCsvImporterImpl.LOGGER.info(MARKER,
                            "number of records in organizationHeaderswithDetailsCollector hashmap is:{} ",
                            organizationHeaderswithDetailsCollector.size());

                } catch (ServiceException e) {
                    result.addError(new ImportError(e.getLocalizedMessage(LocaleContextHolder.getLocale())));
                    ServiceOrgCsvImporterImpl.LOGGER.info(MARKER, "Record not persisted with error:{} ",
                            e.getLocalizedMessage(LocaleContextHolder.getLocale()));
                }
            }
        }
        result.addCreatedItems(count);
        if (!(organizationDetailsForCostCenter).isEmpty()) {

            List<Details> costCentersToBeDeleted = new ArrayList<>();
            HashSet<Details> organizationDetailsForDeletion = new HashSet<>();
            // prepare the data to check for duplication CC
            costCentersToBeDeleted = costCenterValidation.validateCostCenterData(organizationDetailsForCostCenter,
                    result);
            ServiceOrgCsvImporterImpl.LOGGER.info(MARKER, "costCenterToBeDeleted size:{} and its content: {} ",
                    costCentersToBeDeleted.size(), costCentersToBeDeleted);
            if (costCentersToBeDeleted.size() > 0) {
                organizationDetailsForDeletion.addAll(costCentersToBeDeleted);
                this.deleteOrgDetailsAndResItems(organizationDetailsForDeletion);
            }
            try {
                if (!(organizationDetailsForCostCenter).isEmpty()) {
                    List<HeadersWithDetails> validRecords = this
                            .extractTheValidRecords(organizationDetailsForCostCenter);
                    ServiceOrgCsvImporterImpl.LOGGER.info(MARKER,
                            "extractTheValidRecords method with validRecords size:{} ", validRecords.size());
                    for (HeadersWithDetails headersWithDetails : validRecords) {

                        if (!(organizationHeaders.stream()
                                .anyMatch(a -> a.getCode().equals(headersWithDetails.getCode())))) {
                            organizationHeaders.add(this.createHeaderMap(headersWithDetails));
                        }
                        this.addOrganizationDetails(organizationDetails, headersWithDetails);
                        ServiceOrgCsvImporterImpl.LOGGER.info(MARKER,
                                "organizationDetails size:{},organizationHeaders size:{},headersWithDetails: {}",
                                organizationDetails.size(), organizationHeaders.size(), headersWithDetails);
                    }
                }
            } catch (ServiceException e) {
                ServiceOrgCsvImporterImpl.LOGGER.info(MARKER, "exception is raised in extractTheValidRecords {}: ", e);
            }
        }

        if (!(organizationHeaders).isEmpty()) {
            result.addCreatedHeaders(organizationHeaders.size());
            /*
             * Automatically create resource organization and items for service organization
             * and cost centers
             */
            processResourceOrganization.processServiceOrganizationToResourceOrganization(organizationHeaders,
                    organizationDetails);

            /*
             * Upsert service organization and details
             */
            serviceOrgDAO.upsertNewServiceOrgHead(organizationHeaders);
            serviceOrgDAO.upsertNewServiceOrgDetails(organizationDetails);
            ServiceOrgCsvImporterImpl.LOGGER.info(MARKER, "Persisted {} Service Organizations.",
                    organizationHeaders.size());
        }
    }

    /*
     * Once the erroneous records are identified and removed from the collectors,
     * extract the valid records and pass for the preparation of actual buffers to
     * insert
     */
    private List<HeadersWithDetails> extractTheValidRecords(List<Details> processedRecords) {
        List<HeadersWithDetails> validRecordsForDataPreparation = new ArrayList<>();
        try {
            ServiceOrgCsvImporterImpl.LOGGER.info(MARKER,
                    "Inside the extractTheValidRecords method and size of processedRecords:{}: ",
                    processedRecords.size());

            for (Map.Entry<Integer, Details> recordInDetailsCollector : organizationDetailsCollector.entrySet()) {
                Integer recordNumber = recordInDetailsCollector.getKey();
                Details toBeProcessed = recordInDetailsCollector.getValue();
                ServiceOrgCsvImporterImpl.LOGGER.info(MARKER, "recordNumber value is:{}: ", recordNumber);
                for (Details details : processedRecords) {

                    if (details.getCode().equals(toBeProcessed.getCode())
                            && details.getUnitKey().equals(toBeProcessed.getUnitKey())
                            && details.getUnitType().equals(toBeProcessed.getUnitType())) {
                        ServiceOrgCsvImporterImpl.LOGGER.info(MARKER,
                                "details.getCode():{}, details.getUnitKey():{} , details.getUnitType():{}",
                                details.getCode(), details.getUnitKey(), details.getUnitType());

                        List<HeadersWithDetails> validListOfRecordsForDataPreparation = organizationHeaderswithDetailsCollector
                                .entrySet().stream().filter(a -> (a.getKey().equals(recordNumber))).map(Entry::getValue)
                                .collect(Collectors.toList());

                        HeadersWithDetails validRecordForDataPreparation = validListOfRecordsForDataPreparation.get(0);
                        validRecordsForDataPreparation.add(validRecordForDataPreparation);

                        ServiceOrgCsvImporterImpl.LOGGER.info(MARKER,
                                "validRecordsForDataPreparation size:{}, records in validRecordsForDataPreparation:{}  ",
                                validRecordsForDataPreparation.size(), validRecordsForDataPreparation);
                    }
                }

            }
        } catch (ServiceException e) {
            ServiceOrgCsvImporterImpl.LOGGER.info(MARKER, "exception is raised in extractTheValidRecords {}: ", e);
        }
        return validRecordsForDataPreparation;

    }

    private void deleteOrgDetailsAndResItems(Set<Details> organizationDetailsForDeletion) {

        serviceOrgDAO.deleteServiceOrgDetail(organizationDetailsForDeletion);

        List<ResourceOrganizationItems> dbResourceOrganizationItemsData = new ArrayList<>();

        dbResourceOrganizationItemsData = resourceOrganizationDAO.readAllResourceOrganizationItems();

        for (Details recordToBeDeleted : organizationDetailsForDeletion) {

            String costCenter = recordToBeDeleted.getUnitKey();

            List<ResourceOrganizationItems> recordInResourceOrgItems = dbResourceOrganizationItemsData.stream()
                    .filter(a -> a.getCostCenterId().equals(costCenter)).collect(Collectors.toList());

            resourceOrganizationDAO.deleteResourceOrganizationItemsBasedOnCostCenter(recordInResourceOrgItems);

        }

    }

    /**
     *
     * @param organizationDetails
     * @param organizationHeaderswithDetails
     * @return Details
     *
     *         Temporary buffer to hold only CS specific entries for screening of
     *         valid entries.
     */

    private Details addOrganizationDetailsForCSMap(List<Details> organizationDetails,
            HeadersWithDetails organizationHeaderswithDetails) {
        Details details = this.createCostCenterDetailsMap(organizationHeaderswithDetails);
        organizationDetails.add(details);
        return details;
    }

    /**
     * adds the individual Organization details for Cost Center, Company code and
     * Controlling area in the OrganizationDetails table required when fiori will
     * support mixin and show all the entries of additional costCenter in one row
     * with smart links
     */

    private void addOrganizationDetails(Set<Details> organizationDetails,
            HeadersWithDetails organizationHeaderswithDetails) {
        organizationDetails.add(this.createCompanyCodeDetailsMap(organizationHeaderswithDetails));
        organizationDetails.add(this.createCostCenterDetailsMap(organizationHeaderswithDetails));
    }

    /**
     * creates the entry from the CSV result
     */
    private HeadersWithDetails parseServiceOrg(final CSVRecord csvRecord) {
        return (this.createOrg(csvRecord));
    }

    /**
     *
     * creation of org and parsing of csv records to the HeadersWithDetails entity
     * for further processing
     */
    private HeadersWithDetails createOrg(final CSVRecord csvRecord) {
        final HeadersWithDetails organizationHeaders = HeadersWithDetails.create();
        organizationHeaders.setCode(csvRecord.get(BsoCsvColumn.CODE.getName()));
        organizationHeaders.setDescription(csvRecord.get(BsoCsvColumn.DESCRIPTION.getName()));
        organizationHeaders.setCostCenter(csvRecord.get(BsoCsvColumn.COST_CENTER.getName()));
        organizationHeaders.setCompanyCode(csvRecord.get(BsoCsvColumn.COMPANY_CODE.getName()));
        organizationHeaders.setIsDelivery(csvRecord.get(BsoCsvColumn.IS_DELIVERY.getName()));

        return organizationHeaders;
    }

    /**
     *
     * creation of Organization Header from the entries taken in HeadersWithDetails
     * entitySet
     */
    private Headers createHeaderMap(final HeadersWithDetails uploadedServiceOrg) {
        final Headers orgHead = Headers.create();
        orgHead.setCode(uploadedServiceOrg.getCode());
        orgHead.setDescription(uploadedServiceOrg.getDescription());
        if (uploadedServiceOrg.getIsDelivery().isEmpty()) {
            orgHead.setIsDelivery("N");
        } else {
            orgHead.setIsDelivery(uploadedServiceOrg.getIsDelivery().toUpperCase());
        }
        return orgHead;
    }

    /**
     *
     * creation of Organization Details for CostCenter from the entries taken in
     * HeadersWithDetails entitySet
     */
    private Details createCostCenterDetailsMap(final HeadersWithDetails uploadedServiceOrg) {
        final Details orgDet = Details.create();
        orgDet.setCode(uploadedServiceOrg.getCode());
        orgDet.setUnitKey(uploadedServiceOrg.getCostCenter());
        orgDet.setUnitType("CS");
        return orgDet;
    }

    /**
     *
     * creation of Organization Details for CompanyCode from the entries taken in
     * HeadersWithDetails entitySet
     */
    private Details createCompanyCodeDetailsMap(final HeadersWithDetails uploadedServiceOrg) {
        final Details orgDet = Details.create();
        orgDet.setCode(uploadedServiceOrg.getCode());
        orgDet.setUnitKey(uploadedServiceOrg.getCompanyCode());
        orgDet.setUnitType("CC");
        return orgDet;
    }

}
