const path = require('path');
const LaunchpadPage = require('../pages/LaunchpadPage.js');
const ServiceOrgListPage = require('../pages/ServiceOrgListPage.js');
const ServiceOrgUploadApp = require('../pages/ServiceOrgUploadApp.js');
const CommonPageElements = require('../pages/CommonPageElements.js');
const { TestHelper } = require('../../utils/TestHelper');
const testEnvironment = require('../../utils');

const { organizationHeaders, allOrganizationHeaders } = require('../data/serviceOrgData/organizationHeader');
const {
    organizationDetails, allOrganizationDetails, allUnitKeys,
} = require('../data/serviceOrgData/organizationDetail');
const { costCenters, allcontrollingArea } = require('../data/serviceOrgData/costCenter');
const { rrCostCenters, rrControllingArea } = require('../data/serviceOrgData/ResourceRequestCheck/costCenters');
const { rrOrganizationDetails } = require('../data/serviceOrgData/ResourceRequestCheck/organizationDetails');
const { rrOganizationHeaders } = require('../data/serviceOrgData/ResourceRequestCheck/organizationHeader');
const { rrResourceOrganizations } = require('../data/serviceOrgData/ResourceRequestCheck/resourceOrganization');
const { rrResourceOrganizationItems } = require('../data/serviceOrgData/ResourceRequestCheck/resourceOrganizationItems');
const { rrResourceRequestData } = require('../data/serviceOrgData/ResourceRequestCheck/resourceRequest');

const {
    getCSVData, getMissingColContentData, getDuplicateCostCenterData, getOneValidRecord,
    getInvalidCostCenter, getChangeCCAssociations, getChangeCCAssociationsWithDanglingSO, getChangeWithRRAssignment,
} = require('../data/serviceOrgData/serviceOrgUploadCsv');

const uploadApp = 'application-businessServiceOrgUi-upload-component---app--uploadButton';

const costCenter1 = costCenters[0].costCenterID;

const code1 = organizationHeaders[0].code;
const code2 = organizationHeaders[1].code;

const { controllingArea } = allcontrollingArea[0];

const companyCodeY = allUnitKeys[1].unitKey;
const companyCodeZ = allUnitKeys[2].unitKey;

const rrCostCenter1 = rrOrganizationDetails[0].unitKey;
const rrCostCenter2 = rrOrganizationDetails[1].unitKey;
const rrControllingArea1 = rrControllingArea[0].controllingArea;
const rrCompanyCode = rrOrganizationDetails[2].unitKey;
const rrCode = rrOganizationHeaders[0].code;
const rrCodeDesc = rrOganizationHeaders[0].description;

const code11 = allOrganizationHeaders[0].code;
const code12 = allOrganizationHeaders[1].code;
const code13 = allOrganizationHeaders[2].code;

const unitKey11 = allOrganizationDetails[0].unitKey;
const unitKey12 = allOrganizationDetails[1].unitKey;
const unitKey13 = allOrganizationDetails[2].unitKey;
const unitKey14 = allOrganizationDetails[3].unitKey;
const unitKey15 = allOrganizationDetails[4].unitKey;
const unitKey16 = allOrganizationDetails[5].unitKey;

const uploadData = getCSVData(code11, code12, code13, unitKey11, unitKey12, unitKey13, unitKey14, unitKey15, unitKey16);
const uploadData4 = getDuplicateCostCenterData(code1, costCenter1, code2);
const uploadData5 = getOneValidRecord(code1, costCenter1);
const uploadData2 = getMissingColContentData(code1);
const uploadData6 = getInvalidCostCenter(code1);
const uploadData7 = getChangeCCAssociations(code11, code12, unitKey11, unitKey12, unitKey13, unitKey14);
const uploadData8 = getChangeCCAssociationsWithDanglingSO(code11, unitKey11, unitKey12);
const uploadData9 = getChangeWithRRAssignment(code13, rrCompanyCode, rrCostCenter1, rrCostCenter2);

const DATACSVPATH = path.resolve(__dirname, '../data/serviceOrgData/generated-serviceOrgData.csv');
const DATACSVPATHMISSINGColCont = path.resolve(__dirname, '../data/serviceOrgData/generated-missingColContent.csv');
const DATACSVPATHDuplicateCC = path.resolve(__dirname, '../data/serviceOrgData/generated-duplicateCostCenterData.csv');
const DATACSVPATHInvalidCC = path.resolve(__dirname, '../data/serviceOrgData/generated-invalidCCData.csv');
const DATACSVPATHChangeCCAssociations = path.resolve(__dirname, '../data/serviceOrgData/generated-changeCCAssociations.csv');
const DATACSVPATHChangeCCAssociationsWithDanglingSO = path.resolve(__dirname, '../data/serviceOrgData/generated-changeCCAssociationsWithDanglingSO.csv');
const DATACSVPATHChangeWithRRAssignment = path.resolve(__dirname, '../data/serviceOrgData/generated-changeWithRRAssignment.csv');

// Messagestrip messages
const invalidCostCenter = 'Cost center 1010ZZZZ is not associated with the company code YYYY. Please check the combination and try again.';
const invalidChangeCCAssociationsWithDanglingSO = 'Cost center C01XYZ02 cannot be removed from service organization SOF2 because it is the only cost center assigned to service organization SOF2.';
const invalidChangeWithRRAssignment1 = 'Cost center RRCC01 cannot be removed from service organization RRC1 because resource organization RR11 is assigned to at least one published resource request.';
const mandatoryError = 'The following entries in the CSV file have empty mandatory fields: 1: costCenterID; .';
const successMessage1 = '1 records processed: 1 service organizations created or updated';
const successMessage2 = '6 records processed: 3 service organizations created or updated';
const successMessage3 = '4 records processed: 2 service organizations created or updated';
const warningMessage = '2 records processed: 1 service organizations created or updated';
const warningMessage1 = '1 records processed: 0 service organizations created or updated';
const warningMessage2 = '2 records processed: 0 service organizations created or updated';
const infoMessage = "Don't have a file yet? Create one using the following template.";

let organizationDetailRepository = null;
let organizationHeaderRepository = null;
let resourceRequestRepository = null;
let costCenterRepository = null;
let resourceOrganizationsRespository = null;
let resourceOrganizationItemsRespository = null;
let csvWriter = null;

describe('test-journey-serviceOrgUpload', () => {
    const testHelper = new TestHelper();

    async function beforeAllDataCleanUp() {
        // Precautionary data deletion for dynamic data
        const toBeDeletedOrganizationHeaders = [];
        const toBeDeletedOrganizationDetailsCostCenters = [];
        const organizationDetailDataList = await organizationDetailRepository.selectByData(['code', 'unitKey'], allUnitKeys);
        organizationDetailDataList.forEach((organizationDetailData) => {
            toBeDeletedOrganizationHeaders.push({ code: organizationDetailData.code });
        });
        const costCenterDataList = await costCenterRepository.selectByData(['ID', 'costCenterID'], allcontrollingArea);
        costCenterDataList.forEach((costCenterData) => {
            toBeDeletedOrganizationDetailsCostCenters.push({ unitKey: costCenterData.costCenterID });
        });

        await organizationHeaderRepository.deleteMany(toBeDeletedOrganizationHeaders);
        await organizationDetailRepository.deleteMany(organizationDetailDataList); // Delete Company code/Controlling Area
        await organizationDetailRepository.deleteMany(toBeDeletedOrganizationDetailsCostCenters); // Delete CostCenters
        await costCenterRepository.deleteMany(costCenterDataList);
    }
    beforeAll(async () => {
        console.log('Initializing Data Setup in beforeAll() hook');

        console.log('Initializing the repositories.');
        organizationDetailRepository = await testEnvironment.getOrganizationDetailRepository();
        organizationHeaderRepository = await testEnvironment.getOrganizationHeaderRepository();
        costCenterRepository = await testEnvironment.getCostCenterRepository();
        resourceRequestRepository = await testEnvironment.getResourceRequestRepository();
        resourceOrganizationsRespository = await testEnvironment.getResourceOrganizationsRepository();
        resourceOrganizationItemsRespository = await testEnvironment.getResourceOrganizationItemsRepository();
        csvWriter = await testEnvironment.getCsvWriter();

        console.log('All repositories are initialized.');

        console.log('Initializing precautionary Data Cleanup');
        try {
            await beforeAllDataCleanUp();
        } catch (err) {
            console.log(err);
            process.exit(1);
        }
        console.log('Precautionary Data Cleanup is complete');

        console.log('Initializing Data Insertion');

        try {
            await costCenterRepository.insertMany(costCenters);
            await costCenterRepository.insertMany(rrCostCenters);
            await resourceOrganizationsRespository.insertMany(rrResourceOrganizations);
            await resourceOrganizationItemsRespository.insertMany(rrResourceOrganizationItems);
            await organizationDetailRepository.insertMany(rrOrganizationDetails);
            await organizationHeaderRepository.insertMany(rrOganizationHeaders);
            await resourceRequestRepository.insertMany(rrResourceRequestData);
            console.log('Data Insertion is complete');
        } catch (err) {
            console.log(err);
            process.exit(1);
        }

        console.log('Initial data setup completed in beforeAll() hook.');
    });

    /**
     * Tear-down test data
     */
    afterAll(async () => {
        console.log('Cleanup task in afterAll() hook started.');

        try {
            await organizationDetailRepository.deleteMany(organizationDetails);
            await organizationHeaderRepository.deleteMany(organizationHeaders);
            await organizationDetailRepository.deleteMany(allOrganizationDetails);
            await organizationHeaderRepository.deleteMany(allOrganizationHeaders);
            await costCenterRepository.deleteMany(costCenters);
            await costCenterRepository.deleteMany(rrCostCenters);
            await resourceOrganizationsRespository.deleteMany(rrResourceOrganizations);
            await resourceOrganizationItemsRespository.deleteMany(rrResourceOrganizationItems);
            await organizationDetailRepository.deleteMany(rrOrganizationDetails);
            await organizationHeaderRepository.deleteMany(rrOganizationHeaders);
            await resourceRequestRepository.deleteMany(rrResourceRequestData);
        } catch (err) {
            console.log(err);
            process.exit(1);
        }

        console.log('Cleanup task in afterAll() hook completed.');

        try {
            const sqlStatementString1 = resourceOrganizationsRespository.sqlGenerator.generateDeleteStatement(resourceOrganizationsRespository.tableName, "WHERE SERVICEORGANIZATION_CODE IN ('SOF1','SOF2','SOF3')");
            console.log(sqlStatementString1);
            await resourceOrganizationsRespository.statementExecutor.execute(sqlStatementString1);
            const sqlStatementString2 = resourceOrganizationItemsRespository.sqlGenerator.generateDeleteStatement(resourceOrganizationItemsRespository.tableName, "WHERE COSTCENTERID IN ('C01XYZ01','C01XYZ02','C01XYZ03','C01XYZ04','C01XYZ05','C01XYZ06','YYYY001')");
            console.log(sqlStatementString2);
            await resourceOrganizationItemsRespository.statementExecutor.execute(sqlStatementString2);
        } catch (err) {
            console.log(err);
            process.exit(1);
        }
        console.log('Precautionary Data Cleanup is complete');
    });

    // 1. Login as Configuration expert
    testHelper.loginWithRole('ConfigurationExpert');

    // 2. Navigate to Maintain Service Org app and Open upload app
    testHelper.failEarlyIt('Should navigate to landing page and click Maintain Service Organization tile', async () => {
        LaunchpadPage.actions.openServiceOrganizationApp();
        browser.wait(() => ServiceOrgListPage.elements.listReportTable.isPresent(), 600000);

        ServiceOrgListPage.actions.clickOnUploadButton();
        LaunchpadPage.waitForInitialAppLoad(uploadApp);

        expect(ServiceOrgUploadApp.messageStrip.control.asControl().getProperty('type')).toBe('Information');
        expect(ServiceOrgUploadApp.messageStrip.control.asControl().getProperty('text')).toBe(infoMessage);

        ServiceOrgUploadApp.messageStrip.downloadTemplate.click();
    });

    // 5. Mandatory missing columns content in file
    testHelper.failEarlyIt('Upload dialog and upload the csv file(Missing column data)', async () => {
        await csvWriter.createCsvFile(DATACSVPATHMISSINGColCont, uploadData2);
        ServiceOrgUploadApp.fileUploadForm.fileInput.sendKeys(DATACSVPATHMISSINGColCont);

        ServiceOrgUploadApp.fileUploadForm.uploadButton.click();
        expect(ServiceOrgUploadApp.messageStrip.uploadTextW.asControl().getProperty('text')).toBe(warningMessage1);

        await ServiceOrgUploadApp.messageStrip.moreLink.click();
        expect(ServiceOrgUploadApp.dialog.message.getText()).toBe(mandatoryError);

        await ServiceOrgUploadApp.dialog.closeButton.click();

        await CommonPageElements.objectPage.elements.backButton.click();

        await expect(ServiceOrgListPage.assertions.isRecordPresent('1010ZZZZ')).toBe(false);
    });

    // 6. Duplicate CostCenter error in file
    testHelper.failEarlyIt('Upload dialog and upload the csv file(one valid and one duplicate costcenter in CSV)', async () => {
        await ServiceOrgListPage.actions.clickOnUploadButton();
        await LaunchpadPage.waitForInitialAppLoad(uploadApp);
        await csvWriter.createCsvFile(DATACSVPATHDuplicateCC, uploadData4);
        ServiceOrgUploadApp.fileUploadForm.fileInput.sendKeys(DATACSVPATHDuplicateCC);

        ServiceOrgUploadApp.fileUploadForm.uploadButton.click();
        expect(ServiceOrgUploadApp.messageStrip.uploadTextW.asControl().getProperty('text')).toBe(warningMessage);

        await CommonPageElements.objectPage.elements.backButton.click();
        await ServiceOrgListPage.assertions.checkServiceOrgData(code1, 'Organization Germany', 'Yes', companyCodeY, controllingArea, costCenter1);
    });

    // 7. Duplicate CostCenter error in file
    testHelper.failEarlyIt('Upload dialog and upload the csv file(duplicate costcenter)', async () => {
        // upsert a valid record and save in the DB
        await ServiceOrgListPage.actions.clickOnUploadButton();
        await LaunchpadPage.waitForInitialAppLoad(uploadApp);
        await csvWriter.createCsvFile(DATACSVPATHDuplicateCC, uploadData5);
        ServiceOrgUploadApp.fileUploadForm.fileInput.sendKeys(DATACSVPATHDuplicateCC);

        ServiceOrgUploadApp.fileUploadForm.uploadButton.click();
        expect(ServiceOrgUploadApp.messageStrip.uploadText.asControl().getProperty('text')).toBe(successMessage1);

        await CommonPageElements.objectPage.elements.backButton.click();

        await expect(ServiceOrgListPage.assertions.isRecordPresent(costCenter1)).toBe(true);

        // now try to upsert the same record again. It should display an error message
        await ServiceOrgListPage.actions.clickOnUploadButton();
        await LaunchpadPage.waitForInitialAppLoad(uploadApp);
        await csvWriter.createCsvFile(DATACSVPATHDuplicateCC, uploadData4);
        ServiceOrgUploadApp.fileUploadForm.fileInput.sendKeys(DATACSVPATHDuplicateCC);

        ServiceOrgUploadApp.fileUploadForm.uploadButton.click();
        expect(ServiceOrgUploadApp.messageStrip.uploadTextW.asControl().getProperty('text')).toBe(warningMessage);

        await CommonPageElements.objectPage.elements.backButton.click();
        await expect(ServiceOrgListPage.assertions.isRecordPresent(costCenter1)).toBe(true);
    });

    // 8. Upload a valid file
    testHelper.failEarlyIt('Upload the valid csv file', async () => {
        await ServiceOrgListPage.actions.clickOnUploadButton();
        await LaunchpadPage.waitForInitialAppLoad(uploadApp);
        await csvWriter.createCsvFile(DATACSVPATH, uploadData);
        await ServiceOrgUploadApp.fileUploadForm.fileInput.sendKeys(DATACSVPATH);

        ServiceOrgUploadApp.fileUploadForm.uploadButton.click();
        expect(ServiceOrgUploadApp.messageStrip.uploadText.asControl().getProperty('text')).toBe(successMessage2);

        await CommonPageElements.objectPage.elements.backButton.click();

        await ServiceOrgListPage.assertions.checkServiceOrgData(code11, 'Organization Portland', 'Yes', companyCodeZ, controllingArea, unitKey11);
        await ServiceOrgListPage.assertions.checkServiceOrgData(code11, 'Organization Portland', 'Yes', companyCodeZ, controllingArea, unitKey12);
        await ServiceOrgListPage.assertions.checkServiceOrgData(code12, 'Organization Singapore', 'Yes', companyCodeZ, controllingArea, unitKey13);
        await ServiceOrgListPage.assertions.checkServiceOrgData(code12, 'Organization Singapore', 'Yes', companyCodeZ, controllingArea, unitKey14);
        await ServiceOrgListPage.assertions.checkServiceOrgData(code13, 'Organization Scotland', 'Yes', companyCodeZ, controllingArea, unitKey15);
        await ServiceOrgListPage.assertions.checkServiceOrgData(code13, 'Organization Scotland', 'Yes', companyCodeZ, controllingArea, unitKey16);
    });

    // 9. Upload a valid file
    testHelper.failEarlyIt('Upload a valid csv with cost center association changes between service organizations', async () => {
        await ServiceOrgListPage.actions.clickOnUploadButton();
        await LaunchpadPage.waitForInitialAppLoad(uploadApp);
        await csvWriter.createCsvFile(DATACSVPATHChangeCCAssociations, uploadData7);
        await ServiceOrgUploadApp.fileUploadForm.fileInput.sendKeys(DATACSVPATHChangeCCAssociations);

        ServiceOrgUploadApp.fileUploadForm.uploadButton.click();
        expect(ServiceOrgUploadApp.messageStrip.uploadText.asControl().getProperty('text')).toBe(successMessage3);

        await CommonPageElements.objectPage.elements.backButton.click();

        await ServiceOrgListPage.assertions.checkServiceOrgData(code12, 'Organization Singapore', 'Yes', companyCodeZ, controllingArea, unitKey11);
        await ServiceOrgListPage.assertions.checkServiceOrgData(code12, 'Organization Singapore', 'Yes', companyCodeZ, controllingArea, unitKey12);
        await ServiceOrgListPage.assertions.checkServiceOrgData(code11, 'Organization Portland', 'Yes', companyCodeZ, controllingArea, unitKey13);
        await ServiceOrgListPage.assertions.checkServiceOrgData(code11, 'Organization Portland', 'Yes', companyCodeZ, controllingArea, unitKey14);
    });

    // 10. Upload a valid file
    testHelper.failEarlyIt('Upload the invalid csv file after whose upload SO2 would have only one cost center associated with it', async () => {
        await ServiceOrgListPage.actions.clickOnUploadButton();
        await LaunchpadPage.waitForInitialAppLoad(uploadApp);
        await csvWriter.createCsvFile(DATACSVPATHChangeCCAssociationsWithDanglingSO, uploadData8);
        await ServiceOrgUploadApp.fileUploadForm.fileInput.sendKeys(DATACSVPATHChangeCCAssociationsWithDanglingSO);

        ServiceOrgUploadApp.fileUploadForm.uploadButton.click();
        expect(ServiceOrgUploadApp.messageStrip.uploadTextW.asControl().getProperty('text')).toBe(warningMessage);

        await ServiceOrgUploadApp.messageStrip.moreLink.click();
        expect(ServiceOrgUploadApp.dialog.message.getText()).toBe(invalidChangeCCAssociationsWithDanglingSO);

        await ServiceOrgUploadApp.dialog.closeButton.click();
        await CommonPageElements.objectPage.elements.backButton.click();

        await ServiceOrgListPage.assertions.checkServiceOrgData(code11, 'Organization Portland', 'Yes', companyCodeZ, controllingArea, unitKey11);
        await ServiceOrgListPage.assertions.checkServiceOrgData(code12, 'Organization Singapore', 'Yes', companyCodeZ, controllingArea, unitKey12);
    });

    // 11. Upload a valid file
    testHelper.failEarlyIt('Upload the invalid csv file where the cost center association is changed for a service organization whose resource organization is associated to atleast one published resource request', async () => {
        await ServiceOrgListPage.actions.clickOnUploadButton();
        await LaunchpadPage.waitForInitialAppLoad(uploadApp);
        await csvWriter.createCsvFile(DATACSVPATHChangeWithRRAssignment, uploadData9);
        await ServiceOrgUploadApp.fileUploadForm.fileInput.sendKeys(DATACSVPATHChangeWithRRAssignment);

        ServiceOrgUploadApp.fileUploadForm.uploadButton.click();
        expect(ServiceOrgUploadApp.messageStrip.uploadTextW.asControl().getProperty('text')).toBe(warningMessage2);

        await ServiceOrgUploadApp.messageStrip.moreLink.click();
        expect(ServiceOrgUploadApp.dialog.message.getText()).toBe(invalidChangeWithRRAssignment1);

        await ServiceOrgUploadApp.dialog.closeButton.click();
        await CommonPageElements.objectPage.elements.backButton.click();

        await ServiceOrgListPage.assertions.checkServiceOrgData(rrCode, rrCodeDesc, 'Yes', rrCompanyCode, rrControllingArea1, rrCostCenter1);
        await ServiceOrgListPage.assertions.checkServiceOrgData(rrCode, rrCodeDesc, 'Yes', rrCompanyCode, rrControllingArea1, rrCostCenter2);
    });

    // 12. Search for code
    testHelper.failEarlyIt('Search the list page with the code', async () => {
        await ServiceOrgListPage.actions.clickOnExpandButton();
        await ServiceOrgListPage.filterElements.searchInput.sendKeys(code13);
        await ServiceOrgListPage.filterElements.searchPress.click();
        const filteredRecords = await ServiceOrgListPage.listReport.elements.tableRows.count();
        expect(filteredRecords).toBe(2);
        await ServiceOrgListPage.filterElements.searchInput.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
        await ServiceOrgListPage.filterElements.searchInput.sendKeys(protractor.Key.BACK_SPACE);
        await ServiceOrgListPage.filterElements.searchPress.click();
        browser.wait(() => ServiceOrgListPage.elements.listReportTable.isPresent(), 600000);
        expect(await ServiceOrgListPage.listReport.elements.tableRows.count()).toBeGreaterThan(1);
    });

    // 13. Filter via value help
    testHelper.failEarlyIt('Filter the list page with code by selecting code from value help', async () => {
        await ServiceOrgListPage.filterElements.serviceCodeValueHelp.click();
        await ServiceOrgListPage.filterElements.codeVHSearchInput.sendKeys(code13);
        await ServiceOrgListPage.filterElements.codeVHSearchPress.click();
        await ServiceOrgListPage.actions.selectFromValueHelp('code', code13);
        await ServiceOrgListPage.filterElements.serviceCodeValueHelpOkbutton.click();
        await ServiceOrgListPage.filterElements.goButton.click();
        const filteredRecords = await ServiceOrgListPage.listReport.elements.tableRows.count();
        expect(filteredRecords).toBe(2);
        await ServiceOrgListPage.filterElements.code.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
        await ServiceOrgListPage.filterElements.code.sendKeys(protractor.Key.BACK_SPACE);
        await ServiceOrgListPage.filterElements.goButton.click();
        expect(await ServiceOrgListPage.listReport.elements.tableRows.count()).toBeGreaterThan(1);
    });

    // 14. Filter for costcenter
    testHelper.failEarlyIt('Filter the list page with costCenter', async () => {
        await ServiceOrgListPage.actions.clickOnExpandButton();
        await ServiceOrgListPage.filterElements.costCenter.sendKeys(unitKey12);
        await ServiceOrgListPage.filterElements.goButton.click();
        const filteredRecords = await ServiceOrgListPage.listReport.elements.tableRows.count();
        expect(filteredRecords).toBe(1);
        await ServiceOrgListPage.filterElements.costCenter.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
        await ServiceOrgListPage.filterElements.costCenter.sendKeys(protractor.Key.BACK_SPACE);
        await ServiceOrgListPage.filterElements.goButton.click();
        expect(await ServiceOrgListPage.listReport.elements.tableRows.count()).toBeGreaterThan(1);
    });

    // // 15.1 costcenter value help data check
    // testHelper.failEarlyIt('Check costcenter value help', async () => {
    //     await ServiceOrgListPage.actions.clickOnExpandButton();
    //     await ServiceOrgListPage.filterElements.costCenterValueHelp.click();
    //     await ServiceOrgListPage.filterElements.costCenterVHSearchInput.sendKeys(unitKey11);
    //     await ServiceOrgListPage.filterElements.costCenterVHSearchPress.click();
    //     expect(await ServiceOrgListPage.actions.getValueHelpData('costCenter', unitKey11)).toBe(unitKey11);
    //     await ServiceOrgListPage.filterElements.costCenterVHSearchInput.clear();
    //     await ServiceOrgListPage.filterElements.costCenterVHSearchInput.sendKeys(unitKey12);
    //     await ServiceOrgListPage.filterElements.costCenterVHSearchPress.click();
    //     expect(await ServiceOrgListPage.actions.getValueHelpData('costCenter', unitKey12)).toBe(unitKey12);
    // });

    // 16. Filter via value help
    testHelper.failEarlyIt('Filter the list page with costCenter by selecting costCenter from value help', async () => {
        await ServiceOrgListPage.actions.clickOnExpandButton();
        await ServiceOrgListPage.filterElements.costCenterValueHelp.click();
        await ServiceOrgListPage.actions.selectFromValueHelp('costCenter', costCenter1);
        await ServiceOrgListPage.filterElements.costCenterValueHelpOkbutton.click();
        await ServiceOrgListPage.filterElements.goButton.click();
        const filteredRecords = await ServiceOrgListPage.listReport.elements.tableRows.count();
        expect(filteredRecords).toBe(1);
        await ServiceOrgListPage.filterElements.costCenter.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
        await ServiceOrgListPage.filterElements.costCenter.sendKeys(protractor.Key.BACK_SPACE);
        await ServiceOrgListPage.filterElements.goButton.click();
    });

    // 17. Invalid costcenter content in file
    testHelper.failEarlyIt('Upload dialog and upload the csv file(Invalid CostCenter)', async () => {
        await ServiceOrgListPage.actions.clickOnUploadButton();
        await LaunchpadPage.waitForInitialAppLoad(uploadApp);
        await csvWriter.createCsvFile(DATACSVPATHInvalidCC, uploadData6);
        ServiceOrgUploadApp.fileUploadForm.fileInput.sendKeys(DATACSVPATHInvalidCC);

        ServiceOrgUploadApp.fileUploadForm.uploadButton.click();
        expect(ServiceOrgUploadApp.messageStrip.uploadTextW.asControl().getProperty('text')).toBe(warningMessage1);

        await ServiceOrgUploadApp.messageStrip.moreLink.click();
        expect(ServiceOrgUploadApp.dialog.message.getText()).toBe(invalidCostCenter);

        await ServiceOrgUploadApp.dialog.closeButton.click();
        await CommonPageElements.objectPage.elements.backButton.click();

        await expect(ServiceOrgListPage.assertions.isRecordPresent('1010ZZZZ')).toBe(false);
    });

    testHelper.logout();
});
