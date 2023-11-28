const path = require('path');
const LaunchpadPage = require('../pages/LaunchpadPage.js');
const AvailabilityDataListPage = require('../pages/AvailabilityDataListPage.js');
const AvailabilityDataDetailPage = require('../pages/AvailabilityDataDetailPage.js');
const AvailabilityCommonAssertion = require('../pages/AvailabilityCommonAssertion.js');
const AvailabilityUploadApp = require('../pages/AvailabilityUploadApp.js');
const AvailabilityDownloadApp = require('../pages/AvailabilityDownloadApp.js');
const CommonPageElements = require('../pages/CommonPageElements.js');
const { TestHelper } = require('../../utils/TestHelper');
const testEnvironment = require('../../utils');

const { employeeHeaders } = require('../data/availabilityData/headers');
const { workAssignments } = require('../data/availabilityData/workAssignment');
const { workAssignmentDetails } = require('../data/availabilityData/workAssignmentDetail');
const { workforcePersons } = require('../data/availabilityData/workforcePerson');
const { profileDetails } = require('../data/availabilityData/profileDetail');
const { costCenters } = require('../data/availabilityData/costCenter');
const { resourceOrganizations } = require('../data/availabilityData/resourceOrganizations');
const { resourceOrganizationItems } = require('../data/availabilityData/resourceOrganizationItems');
const { jobDetails } = require('../data/availabilityData/jobDetails');
const { costCenterAttributes } = require('../data/availabilityData/costCenterAttribute');

const { availabilityReplicationSummary } = require('../data/availabilityData/availabilityReplicationSummary');
const { availabilityReplicationError } = require('../data/availabilityData/availabilityReplicationError');
const {
    getCSVData, getInvalidColContentData, getMissingColContentData,
    getCSVDataMultipleResourceId, getNonMandatoryData,
    getMissingColResourceID, getIsBPCompletedTrue,
} = require('../data/availabilityData/availabilityUploadCsv');

const uploadApp = 'application-availabilityUpload-Upload-component---app--uploadButton';
const downloadApp = 'application-availabilityUpload-Download-component---app--downloadButton';

const totalNumberOFRows = 4;
const resourceIdData1 = availabilityReplicationSummary[0];
const resourceIdData2 = availabilityReplicationSummary[4];
const resourceIdIsBPCompletedTrue = availabilityReplicationSummary[3];
const costCenters1 = costCenters[0].costCenterID;
const costCenters2 = costCenters[1].costCenterID;
const costCenterDisplay1 = `${costCenterAttributes[0].description} (${costCenters[0].costCenterID})`;
const costCenterDisplay2 = `${costCenterAttributes[1].description} (${costCenters[1].costCenterID})`;
const resourceOrg1 = resourceOrganizations[0].name;
const resourceOrg2 = resourceOrganizations[1].name;
const resourceOrg2DisplayID = resourceOrganizations[1].displayId;
const workforcePersonID = workforcePersons[0].externalID;
const workforcePersonID2 = workforcePersons[1].externalID;
const workforcePersonID3 = workforcePersons[2].externalID;
const workAssignment1 = workAssignments[0].externalID;
const workAssignment2 = workAssignments[1].externalID;
const workAssignment3 = workAssignments[2].externalID;
const workAssignment4 = workAssignments[3].externalID;
const workAssignment5 = workAssignments[4].externalID;
const uploadData = getCSVData(resourceIdData1.resourceId, costCenters1, workforcePersonID, workAssignment1);
const uploadData1 = getInvalidColContentData(resourceIdData1.resourceId, costCenters1, workforcePersonID, workAssignment1);
const uploadData2 = getMissingColContentData(resourceIdData1.resourceId, costCenters1, workforcePersonID, workAssignment1);
const uploadData4 = getCSVDataMultipleResourceId(resourceIdData1.resourceId, resourceIdData2.resourceId, costCenters1, workforcePersonID, workAssignment1, workAssignment5);
const uploadData5 = getNonMandatoryData(resourceIdData1.resourceId, costCenters1, workforcePersonID, workAssignment1);
const missingColResourceID = getMissingColResourceID(resourceIdData1.resourceId, costCenters2, workforcePersonID, workAssignment1);
const resourceIsBPTrue = getIsBPCompletedTrue(resourceIdIsBPCompletedTrue.resourceId, costCenters2, workforcePersonID, workAssignment4);

const DATACSVPATH = path.resolve(__dirname, '../data/availabilityData/generated-availabilityData.csv');
const DATACSVPATHINVALID = path.resolve(__dirname, '../data/availabilityData/generated-invalidAvailabilityData.csv');
const DATACSVPATHMISSINGColCont = path.resolve(__dirname, '../data/availabilityData/generated-missingColContentAvailabilityData.csv');
const DATACSVPATHMULTI = path.resolve(__dirname, '../data/availabilityData/generated-availabilityDataMulti.csv');
const DATACSVPATHBPTRUE = path.resolve(__dirname, '../data/availabilityData/generated-availabilityDataBPTrue.csv');

// Messagestrip messages
const errorCostCenter = 'Enter a cost center.';
const invalidCostCenter = 'Enter a valid cost center.';
const missingResourceID = '"The CSV file is missing the following columns: resourceId."';

const successMessage = '3 availability data entries processed: 3 created, 0 failed.';
const successMessage1 = '10 availability data entries processed: 4 created, 5 failed, 1 skipped due to incorrect resource IDs.';
const successMessage2 = '3 availability data entries processed: 0 created, 3 failed.';
const successMessage4 = '4 availability data entries processed: 4 created, 0 failed.';
const successMessage5 = '1 availability data entries processed: 1 created, 0 failed.';
const successMessage6 = '9 availability data entries processed: 3 created, 5 failed, 1 skipped due to incorrect resource IDs.';
const successMessage7 = '1 availability data entries processed: 0 created, 1 failed.';

// Errors
const invalidColumnContentErrors = [
    { message: 'Please enter the start date of the work assignment in the format YYYY-MM-DD.' },
    { message: 'The cost center ID =cmd|’ /C calc’!A1 is invalid. Please enter a valid cost center ID.' },
    { message: 'Please enter all working and non-working hours as integers.' },
    { message: 'Please ensure that the sum of the working and non-working hours is not greater than 24.' },
];

const missingColumnContentErrors = [
    { message: 'The following entries in the CSV file have empty mandatory fields: startDate.' },
    { message: 'Cost center is a mandatory field. Enter a cost center.' },
    { message: 'The following entries in the CSV file have empty mandatory fields: workAssignmentExternalId.' },
    { message: 'The following entries in the CSV file have empty mandatory fields: plannedWorkingHours.' },
    { message: 'The following entries in the CSV file have empty mandatory fields: nonWorkingHours.' },
];

const errorCCMatch = `The entered cost center ${costCenters2} must match the cost center in the CSV file: ${costCenters1}.`;
const downloadValidationError1 = 'Enter a cost center or workforce person.';
const errorIsBPCompleted = "The availability data of the workforce person can't be uploaded. The workforce person has been marked for deletion.";

const wfExternalIDs = [
    workforcePersons[0].externalID,
    workforcePersons[1].externalID,
    workforcePersons[2].externalID,
];

const resourceOrgDisplayIDs = [
    resourceOrganizations[0].displayId,
    resourceOrganizations[1].displayId,
];
const downloadPageTitle = 'Download Template';
const uploadPageTitle = 'Upload Availability Data';

let workforcePersonRepository = null;
let employeeHeaderRepository = null;
let costCenterRepository = null;
let profileDetailRepository = null;
let workAssignmentsRepository = null;
let workAssignemntDetailsRepository = null;
let availabilityReplicationSummaryRepository = null;
let availabilityReplicationErrorRepository = null;
let csvWriter = null;
let resourceOrganizationsRespository = null;
let resourceOrganizationItemsRespository = null;
let jobDetailsRepository = null;
let costCenterAttributeRepository = null;

describe('test-journey-availabilityUpload', () => {
    const testHelper = new TestHelper();

    async function beforeAllDataCleanUp() {
        await employeeHeaderRepository.deleteMany(employeeHeaders);
        await workforcePersonRepository.deleteMany(workforcePersons);
        await profileDetailRepository.deleteMany(profileDetails);
        await workAssignmentsRepository.deleteMany(workAssignments);
        await workAssignemntDetailsRepository.deleteMany(workAssignmentDetails);
        await costCenterRepository.deleteMany(costCenters);
        await availabilityReplicationSummaryRepository.deleteMany(availabilityReplicationSummary);
        await availabilityReplicationErrorRepository.deleteMany(availabilityReplicationError);
        await resourceOrganizationsRespository.deleteMany(resourceOrganizations);
        await resourceOrganizationItemsRespository.deleteMany(resourceOrganizationItems);
        await jobDetailsRepository.deleteMany(jobDetails);
        await costCenterAttributeRepository.deleteMany(costCenterAttributes);
    }

    beforeAll(async () => {
        console.log('Initializing Data Setup in beforeAll() hook');

        console.log('Initializing the repositories.');
        try {
            workAssignmentsRepository = await testEnvironment.getWorkAssignmentRepository();
            workAssignemntDetailsRepository = await testEnvironment.getWorkAssignmentDetailRepository();
            workforcePersonRepository = await testEnvironment.getWorkforcePersonRepository();
            profileDetailRepository = await testEnvironment.getProfileDetailRepository();
            employeeHeaderRepository = await testEnvironment.getEmployeeHeaderRepository();
            costCenterRepository = await testEnvironment.getCostCenterRepository();
            availabilityReplicationSummaryRepository = await testEnvironment.getAvailabilityReplicationSummaryRepository();
            availabilityReplicationErrorRepository = await testEnvironment.getAvailabilityReplicationErrorRepository();
            resourceOrganizationsRespository = await testEnvironment.getResourceOrganizationsRepository();
            resourceOrganizationItemsRespository = await testEnvironment.getResourceOrganizationItemsRepository();
            jobDetailsRepository = await testEnvironment.getJobDetailRepository();
            costCenterAttributeRepository = await testEnvironment.getCostCenterAttributeRepository();
            csvWriter = await testEnvironment.getCsvWriter();
        } catch (error) {
            console.log(error);
        }
        console.log('All repositories are initialized.');

        console.log('Initializing precautionary Data Cleanup');
        try {
            await beforeAllDataCleanUp();
        } catch (err) {
            console.log(err);
        }
        console.log('Precautionary Data Cleanup is complete');

        console.log('Initializing Data Insertion');

        try {
            await employeeHeaderRepository.insertMany(employeeHeaders);
            await workAssignmentsRepository.insertMany(workAssignments);
            await workAssignemntDetailsRepository.insertMany(workAssignmentDetails);
            await costCenterRepository.insertMany(costCenters);
            await workforcePersonRepository.insertMany(workforcePersons);
            await profileDetailRepository.insertMany(profileDetails);
            await availabilityReplicationSummaryRepository.insertMany(availabilityReplicationSummary);
            await resourceOrganizationsRespository.insertMany(resourceOrganizations);
            await resourceOrganizationItemsRespository.insertMany(resourceOrganizationItems);
            await jobDetailsRepository.insertMany(jobDetails);
            await costCenterAttributeRepository.insertMany(costCenterAttributes);
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
            await employeeHeaderRepository.deleteMany(employeeHeaders);
            await workforcePersonRepository.deleteMany(workforcePersons);
            await profileDetailRepository.deleteMany(profileDetails);
            await workAssignmentsRepository.deleteMany(workAssignments);
            await workAssignemntDetailsRepository.deleteMany(workAssignmentDetails);
            await costCenterRepository.deleteMany(costCenters);
            await availabilityReplicationSummaryRepository.deleteMany(availabilityReplicationSummary);
            await availabilityReplicationErrorRepository.deleteMany(availabilityReplicationError);
            await resourceOrganizationsRespository.deleteMany(resourceOrganizations);
            await resourceOrganizationItemsRespository.deleteMany(resourceOrganizationItems);
            await jobDetailsRepository.deleteMany(jobDetails);
            await costCenterAttributeRepository.deleteMany(costCenterAttributes);
        } catch (err) {
            console.log(err);
            process.exit(1);
        }

        console.log('Cleanup task in afterAll() hook completed.');
    });
    // 1. Login as Configuration expert
    testHelper.loginWithRole('ConfigurationExpert');

    // 2. Navigate to Maintain Availability data app
    testHelper.failEarlyIt('Should navigate to landing page and click Maintain Availability Data tile', async () => {
        LaunchpadPage.actions.openAvailabilityDataApp();
        browser.wait(() => AvailabilityDataListPage.elements.listReportTable.isPresent(), 600000);
        expect(AvailabilityCommonAssertion.actions.getAppTitle('Maintain Availability Data').isPresent()).toBeTruthy();
    });

    // 3. Search the value from search placeholder
    testHelper.failEarlyIt('Search of a value from search placeholder', async () => {
        await AvailabilityDataListPage.actions.clickOnExpandButton();
        await AvailabilityDataListPage.filterElements.searchPlaceholder.sendKeys('test');
        await AvailabilityDataListPage.filterElements.goButton.click();

        const filteredRecords = await AvailabilityDataListPage.listReport.elements.tableRows.count();
        expect(filteredRecords).toBe(0);
        await AvailabilityDataListPage.filterElements.searchPlaceholder.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
        await AvailabilityDataListPage.filterElements.searchPlaceholder.clear();
        await AvailabilityDataListPage.filterElements.goButton.click();
    });

    // 4. Check for data
    testHelper.failEarlyIt('Should check existing Availability data', async () => {
        expect(AvailabilityDataListPage.actions.getColumnHeader().get(0).getText()).toBe('Name');

        const workForcePersonTitleText = await AvailabilityDataListPage.elements.tableTitle.getText();
        expect(workForcePersonTitleText.substring(0, 9)).toBe('Workforce');
        const regexp = new RegExp('([5-9])|([1-9][0-9])');
        expect(regexp.test(workForcePersonTitleText.substring(10))).toBeTruthy();
        AvailabilityCommonAssertion.elements.iExecuteShowDetails.click();
        await AvailabilityCommonAssertion.assertions.checkTableData('firstName4 lastName4', 'Employee', resourceOrg1, costCenterDisplay1, workforcePersonID, workAssignment1, 'Not Started', 0);
        await AvailabilityCommonAssertion.assertions.checkTableData('firstName4 lastName4', 'Employee', resourceOrg2, costCenterDisplay2, workforcePersonID, workAssignment2, 'Not Started', 0);
        await AvailabilityCommonAssertion.assertions.checkTableData('firstName3 lastName3', 'Employee', resourceOrg1, costCenterDisplay1, workforcePersonID2, workAssignment3, 'Not Started', 0);
        await AvailabilityCommonAssertion.assertions.checkTableData('firstName5 lastName5', 'Employee', resourceOrg2, costCenterDisplay2, workforcePersonID3, workAssignment4, 'Not Started', 0);
        await AvailabilityCommonAssertion.assertions.checkTableData('firstName4 lastName4', 'Employee', resourceOrg1, costCenterDisplay1, workforcePersonID, workAssignment5, 'Not Started', 0);
        AvailabilityCommonAssertion.elements.iExecuteHideDetails.click();
    });

    // 5. Check detail page data
    testHelper.failEarlyIt('Should navigate to Availability data detail page', async () => {
        await AvailabilityDataListPage.actions.navigateToWorkAssignment(workAssignment1);
        browser.wait(() => AvailabilityDataDetailPage.availabilityHeader.title.isPresent(), 600000);
        expect(await AvailabilityCommonAssertion.actions.getAppTitle('Workforce Person Availability Data Details').isPresent()).toBeTruthy();
        expect(await AvailabilityDataDetailPage.availabilityHeader.title.getText().isPresent()).toBeTruthy('Header Title should be present');
        expect(await AvailabilityDataDetailPage.availabilityHeaderData.elements.resourceOrgLabel.isPresent()).toBeTruthy('Resource Org Label should be present');
        expect(await AvailabilityDataDetailPage.actions.getHeaderText(resourceOrg1).isPresent()).toBeTruthy('Resource org value should be present');
        expect(await AvailabilityDataDetailPage.availabilityHeaderData.elements.costCenterLabel.isPresent()).toBeTruthy('Cost Center Label should be present');
        expect(await AvailabilityDataDetailPage.actions.getHeaderText(costCenterDisplay1).isPresent()).toBeTruthy();
        expect(await AvailabilityDataDetailPage.availabilityHeaderData.elements.workforcePersonLabel.isPresent());
        expect(await AvailabilityDataDetailPage.actions.getHeaderText(workforcePersonID).isPresent()).toBeTruthy();
        expect(await AvailabilityDataDetailPage.availabilityHeaderData.elements.workAssignmentLabel.isPresent());
        expect(await AvailabilityDataDetailPage.actions.getHeaderText(workAssignment1).isPresent()).toBeTruthy();
        expect(await AvailabilityDataDetailPage.availabilityHeaderData.elements.uploadStatusLabel.isPresent());
        expect(await AvailabilityDataDetailPage.actions.getUploadStatus('Not Started').isPresent()).toBeTruthy();
        expect(await AvailabilityDataDetailPage.availabilityHeaderData.elements.uploadChartLabel.isPresent());
        expect(await AvailabilityDataDetailPage.actions.getChartPercentage(0).isPresent()).toBeTruthy();
        expect(await AvailabilityDataDetailPage.availabilityHeaderData.elements.availabilityDataChartTitle.isPresent());
        expect(await AvailabilityDataDetailPage.availabilityHeaderData.elements.availabilityDataChartHeader.isPresent());
        expect(await AvailabilityDataDetailPage.availabilityHeaderData.elements.uploadErrorTitle.isPresent());
        CommonPageElements.objectPage.elements.backButton.click();
    });

    // 6. Possible filter values in upload status
    testHelper.failEarlyIt('Check upload status value help', async () => {
        await AvailabilityDataListPage.filterElements.uploadStatusValueHelp.click();
        expect(AvailabilityDataListPage.actions.getUploadStatusValueHelp('/AvailabilitySummaryStatus(0)')).toBe('Not Started');
        expect(AvailabilityDataListPage.actions.getUploadStatusValueHelp('/AvailabilitySummaryStatus(1)')).toBe('Complete');
        expect(AvailabilityDataListPage.actions.getUploadStatusValueHelp('/AvailabilitySummaryStatus(2)')).toBe('Partial');
        expect(AvailabilityDataListPage.actions.getUploadStatusValueHelp('/AvailabilitySummaryStatus(3)')).toBe('Failed');
    });

    // 7. Filter for worker type
    testHelper.failEarlyIt('Filter the list page with the worker type', async () => {
        await AvailabilityDataListPage.filterElements.workerType.sendKeys('Employee');
        await AvailabilityDataListPage.filterElements.goButton.click();
        const filteredRecords = await AvailabilityDataListPage.listReport.elements.tableRows.count();
        expect(filteredRecords).toBe(5);
        await AvailabilityDataListPage.filterElements.workerType.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
        await AvailabilityDataListPage.filterElements.workerType.sendKeys(protractor.Key.BACK_SPACE);
        await AvailabilityDataListPage.filterElements.goButton.click();
        expect(await AvailabilityDataListPage.listReport.elements.tableRows.count()).toBeGreaterThan(totalNumberOFRows);
    });

    // 8. Filter for workforceperson
    testHelper.failEarlyIt('Filter the list page with the workforcePerson', async () => {
        await AvailabilityDataListPage.filterElements.workforcePerson.sendKeys(workforcePersonID);
        await AvailabilityDataListPage.filterElements.goButton.click();
        await AvailabilityDataListPage.filterElements.goButton.click();
        const filteredRecords = await AvailabilityDataListPage.listReport.elements.tableRows.count();
        expect(filteredRecords).toBe(3);
        // Data check
        AvailabilityCommonAssertion.elements.iExecuteShowDetails.click();
        await AvailabilityCommonAssertion.assertions.checkTableData('firstName4 lastName4', 'Employee', resourceOrg1, costCenterDisplay1, workforcePersonID, workAssignment1, 'Not Started', 0);
        await AvailabilityCommonAssertion.assertions.checkTableData('firstName4 lastName4', 'Employee', resourceOrg2, costCenterDisplay2, workforcePersonID, workAssignment2, 'Not Started', 0);
        await AvailabilityCommonAssertion.assertions.checkTableData('firstName4 lastName4', 'Employee', resourceOrg1, costCenterDisplay1, workforcePersonID, workAssignment5, 'Not Started', 0);
        AvailabilityCommonAssertion.elements.iExecuteHideDetails.click();
        await AvailabilityDataListPage.filterElements.workforcePerson.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
        await AvailabilityDataListPage.filterElements.workforcePerson.sendKeys(protractor.Key.BACK_SPACE);
        await AvailabilityDataListPage.filterElements.goButton.click();
        expect(await AvailabilityDataListPage.listReport.elements.tableRows.count()).toBeGreaterThan(totalNumberOFRows);
    });

    // 9.1 workforce person value help data check
    testHelper.failEarlyIt('Check workforcePerson value help', async () => {
        await AvailabilityDataListPage.filterElements.workforcePersonValueHelp.click();
        expect(AvailabilityDataListPage.actions.getValueHelpData('workforcePerson', wfExternalIDs[0])).toBe(wfExternalIDs[0]);
        expect(AvailabilityDataListPage.actions.getValueHelpData('workforcePerson', wfExternalIDs[1])).toBe(wfExternalIDs[1]);
        expect(AvailabilityDataListPage.actions.getValueHelpData('workforcePerson', wfExternalIDs[2])).toBe(wfExternalIDs[2]);
    });

    // 9.2. Filter via value help
    testHelper.failEarlyIt('Filter the list page with workforcePerson by selecting workforcePerson from value help', async () => {
        await AvailabilityDataListPage.filterElements.workForceVHSearchInput.sendKeys(workforcePersonID2);
        await AvailabilityDataListPage.filterElements.workForceVHSearchPress.click();
        await AvailabilityDataListPage.actions.selectFromValueHelp('workforcePerson', workforcePersonID2);
        await AvailabilityDataListPage.filterElements.valueHelpOkbutton.click();
        await AvailabilityDataListPage.filterElements.goButton.click();
        const filteredRecords = await AvailabilityDataListPage.listReport.elements.tableRows.count();
        expect(filteredRecords).toBe(1);
        // Data check
        AvailabilityCommonAssertion.elements.iExecuteShowDetails.click();
        await AvailabilityCommonAssertion.assertions.checkTableData('firstName3 lastName3', 'Employee', resourceOrg1, costCenterDisplay1, workforcePersonID2, workAssignment3, 'Not Started', 0);
        AvailabilityCommonAssertion.elements.iExecuteHideDetails.click();
        await AvailabilityDataListPage.filterElements.workforcePerson.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
        await AvailabilityDataListPage.filterElements.workforcePerson.sendKeys(protractor.Key.BACK_SPACE);
        await AvailabilityDataListPage.filterElements.goButton.click();
        expect(await AvailabilityDataListPage.listReport.elements.tableRows.count()).toBeGreaterThan(totalNumberOFRows);
        await AvailabilityDataListPage.actions.clickOnExpandButton();
    });

    // 10. Filter for costcenter
    testHelper.failEarlyIt('Filter the list page with costCenter', async () => {
        await AvailabilityDataListPage.filterElements.costCenter.sendKeys(costCenters1);
        await AvailabilityDataListPage.filterElements.goButton.click();
        await AvailabilityDataListPage.filterElements.goButton.click();
        const filteredRecords = await AvailabilityDataListPage.listReport.elements.tableRows.count();
        expect(filteredRecords).toBe(3);
        // Data check
        AvailabilityCommonAssertion.elements.iExecuteShowDetails.click();
        await AvailabilityCommonAssertion.assertions.checkTableData('firstName3 lastName3', 'Employee', resourceOrg1, costCenterDisplay1, workforcePersonID2, workAssignment3, 'Not Started', 0);
        AvailabilityCommonAssertion.elements.iExecuteHideDetails.click();
        await AvailabilityDataListPage.filterElements.costCenter.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
        await AvailabilityDataListPage.filterElements.costCenter.sendKeys(protractor.Key.BACK_SPACE);
        await AvailabilityDataListPage.filterElements.goButton.click();
        expect(await AvailabilityDataListPage.listReport.elements.tableRows.count()).toBeGreaterThan(totalNumberOFRows);
    });

    // 11.1 costcenter value help data check
    testHelper.failEarlyIt('Check costcenter value help', async () => {
        await AvailabilityDataListPage.filterElements.costCenterValueHelp.click();
        expect(AvailabilityDataListPage.actions.getValueHelpData('costCenter', costCenters1)).toBe(costCenters1);
        expect(AvailabilityDataListPage.actions.getValueHelpData('costCenter', costCenters2)).toBe(costCenters2);
    });

    // 11.2 Filter via value help
    testHelper.failEarlyIt('Filter the list page with costCenter by selecting costCenter from value help', async () => {
        await AvailabilityDataListPage.actions.selectFromValueHelp('costCenter', costCenters2);
        await AvailabilityDataListPage.filterElements.valueHelpOkbutton.click();
        await AvailabilityDataListPage.filterElements.goButton.click();
        const filteredRecords = await AvailabilityDataListPage.listReport.elements.tableRows.count();
        expect(filteredRecords).toBe(2);
        // Data check
        AvailabilityCommonAssertion.elements.iExecuteShowDetails.click();
        await AvailabilityCommonAssertion.assertions.checkTableData('firstName4 lastName4', 'Employee', resourceOrg2, costCenterDisplay2, workforcePersonID, workAssignment2, 'Not Started', 0);
        await AvailabilityCommonAssertion.assertions.checkTableData('firstName5 lastName5', 'Employee', resourceOrg2, costCenterDisplay2, workforcePersonID3, workAssignment4, 'Not Started', 0);
        AvailabilityCommonAssertion.elements.iExecuteHideDetails.click();
        await AvailabilityDataListPage.filterElements.costCenter.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
        await AvailabilityDataListPage.filterElements.costCenter.sendKeys(protractor.Key.BACK_SPACE);
        await AvailabilityDataListPage.filterElements.goButton.click();
        expect(await AvailabilityDataListPage.listReport.elements.tableRows.count()).toBeGreaterThan(totalNumberOFRows);
    });

    // 12. Filter for resource organization
    testHelper.failEarlyIt('Filter the list page with the resource organization', async () => {
        await AvailabilityDataListPage.filterElements.resourceOrg.sendKeys(resourceOrg1);
        await AvailabilityDataListPage.filterElements.goButton.click();
        const filteredRecords = await AvailabilityDataListPage.listReport.elements.tableRows.count();
        expect(filteredRecords).toBe(3);
        // Data check
        AvailabilityCommonAssertion.elements.iExecuteShowDetails.click();
        await AvailabilityCommonAssertion.assertions.checkTableData('firstName4 lastName4', 'Employee', resourceOrg1, costCenterDisplay1, workforcePersonID, workAssignment1, 'Not Started', 0);
        await AvailabilityCommonAssertion.assertions.checkTableData('firstName3 lastName3', 'Employee', resourceOrg1, costCenterDisplay1, workforcePersonID2, workAssignment3, 'Not Started', 0);
        await AvailabilityCommonAssertion.assertions.checkTableData('firstName4 lastName4', 'Employee', resourceOrg1, costCenterDisplay1, workforcePersonID, workAssignment5, 'Not Started', 0);
        AvailabilityCommonAssertion.elements.iExecuteHideDetails.click();
        await AvailabilityDataListPage.filterElements.resourceOrg.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
        await AvailabilityDataListPage.filterElements.resourceOrg.sendKeys(protractor.Key.BACK_SPACE);
        await AvailabilityDataListPage.filterElements.goButton.click();
        expect(await AvailabilityDataListPage.listReport.elements.tableRows.count()).toBeGreaterThan(totalNumberOFRows);
    });

    // 12.1 resource org value help data check
    testHelper.failEarlyIt('Check resource organization value help', async () => {
        await AvailabilityDataListPage.filterElements.resourceOrgValueHelp.click();
        expect(AvailabilityDataListPage.actions.getValueHelpData('resourceOrg', resourceOrgDisplayIDs[0])).toBe(resourceOrgDisplayIDs[0]);
        expect(AvailabilityDataListPage.actions.getValueHelpData('resourceOrg', resourceOrgDisplayIDs[1])).toBe(resourceOrgDisplayIDs[1]);
    });

    // 12.2. Filter via value help
    testHelper.failEarlyIt('Filter the list page with resource organization by selecting resource org from value help', async () => {
        await AvailabilityDataListPage.filterElements.resourceOrgVHSearchInput.sendKeys(resourceOrg2);
        await AvailabilityDataListPage.filterElements.resourceOrgVHSearchPress.click();
        await AvailabilityDataListPage.actions.selectFromValueHelp('resourceOrg', resourceOrg2DisplayID);
        await AvailabilityDataListPage.filterElements.valueHelpOkbutton.click();
        await AvailabilityDataListPage.filterElements.goButton.click();
        const filteredRecords = await AvailabilityDataListPage.listReport.elements.tableRows.count();
        expect(filteredRecords).toBe(2);
        // Data check
        AvailabilityCommonAssertion.elements.iExecuteShowDetails.click();
        await AvailabilityCommonAssertion.assertions.checkTableData('firstName4 lastName4', 'Employee', resourceOrg2, costCenterDisplay2, workforcePersonID, workAssignment2, 'Not Started', 0);
        await AvailabilityCommonAssertion.assertions.checkTableData('firstName5 lastName5', 'Employee', resourceOrg2, costCenterDisplay2, workforcePersonID3, workAssignment4, 'Not Started', 0);
        await AvailabilityDataListPage.filterElements.resourceOrg.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
        await AvailabilityDataListPage.filterElements.resourceOrg.sendKeys(protractor.Key.BACK_SPACE);
        await AvailabilityDataListPage.filterElements.goButton.click();
        expect(await AvailabilityDataListPage.listReport.elements.tableRows.count()).toBeGreaterThan(totalNumberOFRows);
    });

    // 13. Upload app
    testHelper.failEarlyIt('should open upload dialog', async () => {
        AvailabilityDataListPage.actions.clickOnUploadButton();
        LaunchpadPage.waitForInitialAppLoad(uploadApp);
        expect(AvailabilityCommonAssertion.actions.getAppTitle('Upload Availability Data').isPresent()).toBeTruthy();
        expect(AvailabilityCommonAssertion.actions.getPageTitle(uploadPageTitle).isPresent()).toBeTruthy();
        expect(AvailabilityUploadApp.fileUploadForm.formControl.isPresent()).toBeTruthy();
        expect(AvailabilityUploadApp.actions.getLabel('File').isPresent()).toBeTruthy();
        expect(AvailabilityUploadApp.actions.getLabel('Cost Center').isPresent()).toBeTruthy();
    });

    // 14. Upload without entering cost center
    testHelper.failEarlyIt('Validataion: Upload the csv file without passing cost center', async () => {
        await csvWriter.createCsvFile(DATACSVPATH, uploadData);
        AvailabilityUploadApp.fileUploadForm.fileInput.sendKeys(DATACSVPATH);
        AvailabilityUploadApp.fileUploadForm.uploadButton.click();
        expect(AvailabilityUploadApp.messageStrip.control.isPresent()).toBeTruthy();
        expect(AvailabilityUploadApp.messageStrip.control.asControl().getProperty('type')).toBe('Error');
        expect(AvailabilityUploadApp.messageStrip.control.asControl().getProperty('text')).toBe(errorCostCenter);
    });

    // 15. Upload file(valid file)
    testHelper.failEarlyIt('Upload the csv file(valid file)', async () => {
        await AvailabilityUploadApp.fileUploadForm.fileInput.sendKeys(DATACSVPATH);
        await AvailabilityCommonAssertion.elements.costCenterValueHelp.click();
        await AvailabilityCommonAssertion.elements.costCenterValueHelpList(costCenters1).click();

        await AvailabilityUploadApp.fileUploadForm.uploadButton.click();
        expect(AvailabilityUploadApp.messageStrip.control.isPresent()).toBeTruthy();
        expect(AvailabilityUploadApp.messageStrip.control.asControl().getProperty('type')).toBe('Success');
        expect(AvailabilityUploadApp.messageStrip.control.asControl().getProperty('text')).toBe(successMessage);
    });

    // 16. Check Upload status
    testHelper.failEarlyIt('Check the upload status(Complete) and error table', async () => {
        await CommonPageElements.objectPage.elements.backButton.click();
        // On detail page
        await AvailabilityDataListPage.actions.navigateToWorkAssignment(workAssignment1);
        expect(await AvailabilityDataDetailPage.listReport.elements.tableRows.count()).toBe(0);
        expect(await AvailabilityDataDetailPage.actions.getUploadStatus('Complete').isPresent()).toBeTruthy();
        await CommonPageElements.objectPage.elements.backButton.click();
        // On list page
        await AvailabilityCommonAssertion.elements.iExecuteShowDetails.click();
        expect(await AvailabilityDataListPage.actions.getUploadStatus(workAssignment1, 'Complete')).toBe(true);
        expect(await AvailabilityDataListPage.actions.getUploadChartPercentage(workAssignment1, 0.2)).toBe(true);
    });

    // 17. Upload file Invalid column content
    testHelper.failEarlyIt('Upload the csv file(Invalid column contents)', async () => {
        await AvailabilityDataListPage.actions.clickOnUploadButton();
        await LaunchpadPage.waitForInitialAppLoad(uploadApp);
        await csvWriter.createCsvFile(DATACSVPATHINVALID, uploadData1);
        AvailabilityUploadApp.fileUploadForm.fileInput.sendKeys(DATACSVPATHINVALID);
        await AvailabilityCommonAssertion.elements.costCenterValueHelp.click();
        await AvailabilityCommonAssertion.elements.costCenterValueHelpList(costCenters1).click();

        AvailabilityUploadApp.fileUploadForm.uploadButton.click();
        expect(AvailabilityUploadApp.messageStrip.control.isPresent()).toBeTruthy();
        expect(AvailabilityUploadApp.messageStrip.control.asControl().getProperty('type')).toBe('Warning');
        expect(AvailabilityUploadApp.messageStrip.control.asControl().getProperty('text')).toBe(successMessage1);
    });

    // 18. Check error message count and message
    testHelper.failEarlyIt('Validataion: Check error message(Invalid column contents)', async () => {
        await CommonPageElements.objectPage.elements.backButton.click();
        // On detail page
        await AvailabilityDataListPage.actions.navigateToWorkAssignment(workAssignment1);
        expect(await AvailabilityDataDetailPage.actions.getUploadStatus('Partial').isPresent()).toBeTruthy();
        // Error count
        await AvailabilityDataDetailPage.actions.clickOnExpandButton();
        expect(await AvailabilityDataDetailPage.listReport.elements.tableRows.count()).toBeGreaterThan(4);
        // Check only for 4 errors, 1 error is same "Please enter all working and non-working hours as integers."
        expect(await AvailabilityDataDetailPage.availabilityError.message(invalidColumnContentErrors[0].message).isPresent()).toBe(true, `${invalidColumnContentErrors[0].message} not found`);
        expect(await AvailabilityDataDetailPage.availabilityError.message(invalidColumnContentErrors[1].message).isPresent()).toBe(true, `${invalidColumnContentErrors[1].message} not found`);
        expect(await AvailabilityDataDetailPage.availabilityError.message(invalidColumnContentErrors[2].message).isPresent()).toBe(true, `${invalidColumnContentErrors[2].message} not found`);
        expect(await AvailabilityDataDetailPage.availabilityError.message(invalidColumnContentErrors[3].message).isPresent()).toBe(true, `${invalidColumnContentErrors[3].message} not found`);
        await CommonPageElements.objectPage.elements.backButton.click();
    });

    // 19. Upload file with multiple workassignments
    testHelper.failEarlyIt('Upload the csv file for multiple work assignment', async () => {
        await AvailabilityDataListPage.actions.clickOnUploadButton();
        await LaunchpadPage.waitForInitialAppLoad(uploadApp);
        await csvWriter.createCsvFile(DATACSVPATHMULTI, uploadData4);
        AvailabilityUploadApp.fileUploadForm.fileInput.sendKeys(DATACSVPATHMULTI);
        await AvailabilityCommonAssertion.elements.costCenterValueHelp.click();
        await AvailabilityCommonAssertion.elements.costCenterValueHelpList(costCenters1).click();

        AvailabilityUploadApp.fileUploadForm.uploadButton.click();
        expect(AvailabilityUploadApp.messageStrip.control.isPresent()).toBeTruthy();
        expect(AvailabilityUploadApp.messageStrip.control.asControl().getProperty('type')).toBe('Success');
        expect(AvailabilityUploadApp.messageStrip.control.asControl().getProperty('text')).toBe(successMessage4);
        await CommonPageElements.objectPage.elements.backButton.click();
    });

    // 20.Check status for multiple assignments and concurrent work assignments of a same workforce person
    testHelper.failEarlyIt('Check the upload status(Complete)', async () => {
        // For workAssignmentID1
        // On detail page
        await AvailabilityDataListPage.actions.navigateToWorkAssignment(workAssignment1);
        expect(await AvailabilityDataDetailPage.actions.getUploadStatus('Complete').isPresent()).toBeTruthy();
        await CommonPageElements.objectPage.elements.backButton.click();
        // On list page
        await AvailabilityCommonAssertion.elements.iExecuteShowDetails.click();
        expect(await AvailabilityDataListPage.actions.getUploadStatus(workAssignment1, 'Complete')).toBe(true);

        // For workAssignmentID5
        await AvailabilityDataListPage.actions.navigateToWorkAssignment(workAssignment5);
        expect(await AvailabilityDataDetailPage.actions.getUploadStatus('Complete').isPresent()).toBeTruthy();
        await CommonPageElements.objectPage.elements.backButton.click();
        // On list page
        await AvailabilityCommonAssertion.elements.iExecuteShowDetails.click();
        expect(await AvailabilityDataListPage.actions.getUploadStatus(workAssignment5, 'Complete')).toBe(true);
    });

    // 21. Upload file with missing column content
    testHelper.failEarlyIt('Upload the csv file(Missing column content)', async () => {
        await AvailabilityDataListPage.actions.clickOnUploadButton();
        await LaunchpadPage.waitForInitialAppLoad(uploadApp);
        await csvWriter.createCsvFile(DATACSVPATH, uploadData2);
        AvailabilityUploadApp.fileUploadForm.fileInput.sendKeys(DATACSVPATH);
        await AvailabilityCommonAssertion.elements.costCenterValueHelp.click();
        await AvailabilityCommonAssertion.elements.costCenterValueHelpList(costCenters1).click();

        AvailabilityUploadApp.fileUploadForm.uploadButton.click();
        expect(AvailabilityUploadApp.messageStrip.control.isPresent()).toBeTruthy();
        expect(AvailabilityUploadApp.messageStrip.control.asControl().getProperty('type')).toBe('Warning');
        expect(AvailabilityUploadApp.messageStrip.control.asControl().getProperty('text')).toBe(successMessage6);
    });

    // 22. check error table
    testHelper.failEarlyIt('Check the upload status(Partial) and error details', async () => {
        await CommonPageElements.objectPage.elements.backButton.click();
        // On detail page
        await AvailabilityDataListPage.actions.navigateToWorkAssignment(workAssignment1);
        expect(await AvailabilityDataDetailPage.actions.getUploadStatus('Partial').isPresent()).toBeTruthy();
        await AvailabilityDataDetailPage.actions.clickOnExpandButton();
        // Error count
        expect(await AvailabilityDataDetailPage.listReport.elements.tableRows.count()).toBeGreaterThan(4);
        expect(await AvailabilityDataDetailPage.availabilityError.message(missingColumnContentErrors[0].message).isPresent()).toBeTruthy();
        expect(await AvailabilityDataDetailPage.availabilityError.message(missingColumnContentErrors[1].message).isPresent()).toBe(true, `${missingColumnContentErrors[1].message} not found`);
        expect(await AvailabilityDataDetailPage.availabilityError.message(missingColumnContentErrors[2].message).isPresent()).toBe(true, `${missingColumnContentErrors[2].message} not found`);
        expect(await AvailabilityDataDetailPage.availabilityError.message(missingColumnContentErrors[3].message).isPresent()).toBe(true, `${missingColumnContentErrors[3].message} not found`);
        expect(await AvailabilityDataDetailPage.availabilityError.message(missingColumnContentErrors[4].message).isPresent()).toBe(true, `${missingColumnContentErrors[4].message} not found`);
        await CommonPageElements.objectPage.elements.backButton.click();
        // On list page
        await AvailabilityCommonAssertion.elements.iExecuteShowDetails.click();
        expect(await AvailabilityDataListPage.actions.getUploadStatus(workAssignment1, 'Partial')).toBe(true);
    });

    // 23.1. Mandatory missing columns in file
    testHelper.failEarlyIt('Validation Missing mandatory column: Resource ID', async () => {
        await AvailabilityDataListPage.actions.clickOnUploadButton();
        await LaunchpadPage.waitForInitialAppLoad(uploadApp);
        await csvWriter.createCsvFile(DATACSVPATHMISSINGColCont, missingColResourceID);
        AvailabilityUploadApp.fileUploadForm.fileInput.sendKeys(DATACSVPATHMISSINGColCont);
        await AvailabilityCommonAssertion.elements.costCenterValueHelp.click();
        await AvailabilityCommonAssertion.elements.costCenterValueHelpList(costCenters2).click();

        AvailabilityUploadApp.fileUploadForm.uploadButton.click();
        expect(AvailabilityUploadApp.messageStrip.control.isPresent()).toBeTruthy();
        expect(AvailabilityUploadApp.messageStrip.control.asControl().getProperty('type')).toBe('Error');
        expect(AvailabilityUploadApp.messageStrip.control.asControl().getProperty('text')).toBe(missingResourceID);
    });

    // 23. Upload file with incorrect costcenter
    testHelper.failEarlyIt('Upload the csv file with mismatch of cost center(mismatch in csv file and Input)', async () => {
        await csvWriter.createCsvFile(DATACSVPATH, uploadData);
        AvailabilityUploadApp.fileUploadForm.fileInput.sendKeys(DATACSVPATH);
        // Select cost center from the drop down
        await AvailabilityCommonAssertion.elements.costCenterValueHelp.click();
        await AvailabilityCommonAssertion.elements.costCenterValueHelpList(costCenters2).click();

        AvailabilityUploadApp.fileUploadForm.uploadButton.click();
        expect(AvailabilityUploadApp.messageStrip.control.isPresent()).toBeTruthy();
        expect(AvailabilityUploadApp.messageStrip.control.asControl().getProperty('type')).toBe('Warning');
        expect(AvailabilityUploadApp.messageStrip.control.asControl().getProperty('text')).toBe(successMessage2);
    });

    // 24.1 Check Upload status
    testHelper.failEarlyIt('Check the upload status(Failed) and error details', async () => {
        await CommonPageElements.objectPage.elements.backButton.click();
        // On detail page
        await AvailabilityDataListPage.actions.navigateToWorkAssignment(workAssignment1);
        expect(await AvailabilityDataDetailPage.actions.getUploadStatus('Failed').isPresent()).toBeTruthy();

        // Error message
        expect(await AvailabilityDataDetailPage.availabilityError.message(errorCCMatch).isPresent()).toBe(true, `${errorCCMatch} not found`);
        await CommonPageElements.objectPage.elements.backButton.click();
        // On list page
        await AvailabilityCommonAssertion.elements.iExecuteShowDetails.click();
        expect(await AvailabilityDataListPage.actions.getUploadStatus(workAssignment1, 'Failed')).toBe(true);
    });

    // 24.2 Upload file(valid file)
    testHelper.failEarlyIt('Upload the csv file (non-mandatory fields)', async () => {
        await AvailabilityDataListPage.actions.clickOnUploadButton();
        await LaunchpadPage.waitForInitialAppLoad(uploadApp);
        await csvWriter.createCsvFile(DATACSVPATH, uploadData5);
        await AvailabilityUploadApp.fileUploadForm.fileInput.sendKeys(DATACSVPATH);
        await AvailabilityCommonAssertion.elements.costCenterValueHelp.click();
        await AvailabilityCommonAssertion.elements.costCenterValueHelpList(costCenters1).click();

        AvailabilityUploadApp.fileUploadForm.uploadButton.click();
        expect(AvailabilityUploadApp.messageStrip.control.isPresent()).toBeTruthy();
        expect(AvailabilityUploadApp.messageStrip.control.asControl().getProperty('type')).toBe('Success');
        expect(AvailabilityUploadApp.messageStrip.control.asControl().getProperty('text')).toBe(successMessage5);
    });

    // 25. Check Upload status and error table to be blank
    testHelper.failEarlyIt('Check the upload status(Complete) and error details to be blank', async () => {
        await CommonPageElements.objectPage.elements.backButton.click();
        // On detail page
        await AvailabilityDataListPage.actions.navigateToWorkAssignment(workAssignment1);
        expect(await AvailabilityDataDetailPage.actions.getUploadStatus('Complete').isPresent()).toBeTruthy();

        // Error message
        expect(await AvailabilityDataDetailPage.listReport.elements.tableRows.count()).toBe(0);
        await CommonPageElements.objectPage.elements.backButton.click();
        // On list page
        await AvailabilityCommonAssertion.elements.iExecuteShowDetails.click();
        expect(await AvailabilityDataListPage.actions.getUploadStatus(workAssignment1, 'Complete')).toBe(true);
    });

    // 26.1 Upload file for resourceID businessPurposeCompleted is true
    testHelper.failEarlyIt('Upload the csv file with workforce person IsBusinessPurposeCompleted flag set to true', async () => {
        await AvailabilityDataListPage.actions.clickOnUploadButton();
        await LaunchpadPage.waitForInitialAppLoad(uploadApp);
        await csvWriter.createCsvFile(DATACSVPATHBPTRUE, resourceIsBPTrue);
        AvailabilityUploadApp.fileUploadForm.fileInput.sendKeys(DATACSVPATHBPTRUE);
        // Select cost center from the drop down
        await AvailabilityCommonAssertion.elements.costCenterValueHelp.click();
        await AvailabilityCommonAssertion.elements.costCenterValueHelpList(costCenters2).click();

        AvailabilityUploadApp.fileUploadForm.uploadButton.click();
        expect(AvailabilityUploadApp.messageStrip.control.isPresent()).toBeTruthy();
        expect(AvailabilityUploadApp.messageStrip.control.asControl().getProperty('type')).toBe('Warning');
        expect(AvailabilityUploadApp.messageStrip.control.asControl().getProperty('text')).toBe(successMessage7);
    });

    // 26.2 Check Upload status
    testHelper.failEarlyIt('Check the upload status(Failed) and error details(IsBusinessPurposeCompleted)', async () => {
        await CommonPageElements.objectPage.elements.backButton.click();
        // On detail page
        await AvailabilityDataListPage.actions.navigateToWorkAssignment(workAssignment4);
        expect(await AvailabilityDataDetailPage.actions.getUploadStatus('Failed').isPresent()).toBeTruthy();

        expect(await AvailabilityDataDetailPage.availabilityError.message(errorIsBPCompleted).isPresent()).toBe(true, errorIsBPCompleted);
        await CommonPageElements.objectPage.elements.backButton.click();
        // On list page
        await AvailabilityCommonAssertion.elements.iExecuteShowDetails.click();
        expect(await AvailabilityDataListPage.actions.getUploadStatus(workAssignment4, 'Failed')).toBe(true);
    });

    // 27. Download app
    testHelper.failEarlyIt('should open download dialog and check for the controls', async () => {
        await AvailabilityDataListPage.actions.clickOnDownloadButton();
        LaunchpadPage.waitForInitialAppLoad(downloadApp);
        expect(await AvailabilityDownloadApp.fileDownloadForm.formControl.isPresent()).toBeTruthy();
        expect(AvailabilityCommonAssertion.actions.getAppTitle('Download Template').isPresent()).toBeTruthy();
        expect(AvailabilityCommonAssertion.actions.getPageTitle(downloadPageTitle).isPresent()).toBeTruthy();
        expect(AvailabilityDownloadApp.actions.getLabel('Enter a cost center or workforce person.').isPresent()).toBeTruthy();
        expect(AvailabilityDownloadApp.actions.getLabel('Cost Center').isPresent()).toBeTruthy();
        expect(AvailabilityDownloadApp.actions.getLabel('Workforce Person (External ID)').isPresent()).toBeTruthy();
        expect(AvailabilityDownloadApp.actions.getLabel('Time Period').isPresent()).toBeTruthy();
        expect(AvailabilityDownloadApp.actions.getLabel('Planned Working Hours Per Day').isPresent()).toBeTruthy();
        expect(AvailabilityDownloadApp.actions.getLabel('Planned Non-Working Hours Per Day').isPresent()).toBeTruthy();
        // Default values
        expect(AvailabilityDownloadApp.actions.getInput('8').isPresent()).toBeTruthy();
        expect(AvailabilityDownloadApp.actions.getInput('0').isPresent()).toBeTruthy();
        await CommonPageElements.objectPage.elements.backButton.click();
        await AvailabilityDataListPage.elements.listReportTable.isPresent();
    });

    // 28 Validation on Mandatory field (cost center)
    testHelper.failEarlyIt('Validation: Download file without costCenter', async () => {
        await AvailabilityDataListPage.actions.clickOnDownloadButton();
        expect(await AvailabilityDownloadApp.fileDownloadForm.formControl.isPresent()).toBeTruthy();
        AvailabilityDownloadApp.fileDownloadForm.downloadButton.click();

        expect(AvailabilityDownloadApp.messageStrip.control.isPresent()).toBeTruthy();
        expect(AvailabilityDownloadApp.messageStrip.control.asControl().getProperty('type')).toBe('Error');
        expect(AvailabilityDownloadApp.messageStrip.control.asControl().getProperty('text')).toBe(downloadValidationError1);
    });

    // 29. Validation: Invalid cost center
    testHelper.failEarlyIt('Validation: Download file with invalid costCenter', async () => {
        const currentDate = new Date();
        let month = (currentDate.getMonth() + 1).toString();
        if (month.length !== 2) { month = `0${month}`; }
        const dateInput = `${currentDate.getFullYear().toString() + month}01`;

        await AvailabilityDownloadApp.fileDownloadForm.rbCostCenter.click();
        await AvailabilityDownloadApp.fileDownloadForm.costCenterInput.sendKeys('CostCenterLength');
        await AvailabilityDownloadApp.fileDownloadForm.datePickIcon.click();
        await AvailabilityDownloadApp.fileDownloadForm.date(dateInput).click();
        await AvailabilityDownloadApp.fileDownloadForm.date(dateInput).click();
        await AvailabilityDownloadApp.fileDownloadForm.datePickOkButton.click();
        AvailabilityDownloadApp.fileDownloadForm.downloadButton.click();

        expect(AvailabilityDownloadApp.messageStrip.control.isPresent()).toBeTruthy();
        expect(AvailabilityDownloadApp.messageStrip.control.asControl().getProperty('type')).toBe('Error');
        expect(AvailabilityDownloadApp.messageStrip.control.asControl().getProperty('text')).toBe(invalidCostCenter);
    });

    // 29. value help of work force person ID
    testHelper.failEarlyIt('Value help of workForce person(ExternalId)', async () => {
        await AvailabilityDownloadApp.fileDownloadForm.rbWorkforceID.click();
        await AvailabilityDownloadApp.fileDownloadForm.workForceValueHelp.click();
        await AvailabilityDownloadApp.fileDownloadForm.workForceValueHelpList(workforcePersonID).click();
        AvailabilityDownloadApp.fileDownloadForm.downloadButton.click();
        expect(AvailabilityDownloadApp.messageStrip.control.isPresent()).toBeFalsy();
    });

    // 30. Value help of cost center
    testHelper.failEarlyIt('Value help of cost center', async () => {
        await AvailabilityDownloadApp.fileDownloadForm.rbCostCenter.click();
        await AvailabilityDownloadApp.fileDownloadForm.costCenterValueHelp.click();
        await AvailabilityDownloadApp.fileDownloadForm.costCenterValueHelpList(costCenters1).click();
        AvailabilityDownloadApp.fileDownloadForm.downloadButton.click();
        expect(AvailabilityDownloadApp.messageStrip.control.isPresent()).toBeFalsy();
    });

    // 31. Successful download of csv
    testHelper.failEarlyIt('Download file', async () => {
        await AvailabilityDownloadApp.fileDownloadForm.costCenterInput.clear();
        await AvailabilityDownloadApp.fileDownloadForm.costCenterInput.sendKeys(costCenters2);
        AvailabilityDownloadApp.fileDownloadForm.downloadButton.click();

        expect(AvailabilityDownloadApp.messageStrip.control.isPresent()).toBeFalsy();
        await CommonPageElements.objectPage.elements.backButton.click();
        await AvailabilityDataListPage.elements.listReportTable.isPresent();
    });

    testHelper.logout();
});
