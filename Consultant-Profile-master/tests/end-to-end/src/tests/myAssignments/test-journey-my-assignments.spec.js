const { TestHelper } = require('../../utils/TestHelper');
const testEnvironment = require('../../utils');

const { skills, allSkillNames } = require('../data/myAssignmentsData/skills');
const { employeeHeaders } = require('../data/myAssignmentsData/employeeHeaders');
const { workAssignments } = require('../data/myAssignmentsData/workAssignments');
const { workAssignmentDetails } = require('../data/myAssignmentsData/workAssignmentDetails');
const { workforcePersons } = require('../data/myAssignmentsData/workforcePersons');
const { projectRoles, projectRoleDescription } = require('../data/myAssignmentsData/projectRoles');
const { emails, allEmailAddressData } = require('../data/myAssignmentsData/emails');
const { photos } = require('../data/myAssignmentsData/photos');
const { resourceHeaders } = require('../data/myAssignmentsData/resourceHeaders');
const { profileDetails } = require('../data/myAssignmentsData/profileDetails');
const { phones } = require('../data/myAssignmentsData/phones');
const { jobDetails } = require('../data/myAssignmentsData/jobDetails');
const { customers, allCustomerNames } = require('../data/myAssignmentsData/customers');
const { workpackage } = require('../data/myAssignmentsData/workPackage');
const { project } = require('../data/myAssignmentsData/project');
const { skillRequirements } = require('../data/myAssignmentsData/skillRequirements');
const { resourceRequestData, allResourceRequestDesc } = require('../data/myAssignmentsData/resourceRequest');
const { catalogs, allCatalogDesc } = require('../data/myAssignmentsData/skillCatalogs');
const { catalogs2skills } = require('../data/myAssignmentsData/skillCatalogs2skills');
const { costCenters } = require('../data/myAssignmentsData/costCenter');
const { proficiencyLevels } = require('../data/myAssignmentsData/proficiencyLevels');
const { allProficiencySetNames, proficiencySets } = require('../data/myAssignmentsData/proficiencySets');
const { proficiencyLevelTexts } = require('../data/myAssignmentsData/proficiencyLevelTexts');
const { assignments } = require('../data/myAssignmentsData/assignments');
const { assignmentBucket } = require('../data/myAssignmentsData/assignmentBucket');
const { resourceCapacities } = require('../data/myAssignmentsData/resourceCapacity');
const { resourceOrganizations } = require('../data/myAssignmentsData/resourceOrganizations');
const { resourceOrganizationItems } = require('../data/myAssignmentsData/resourceOrganizationItems');
const { demand } = require('../data/myAssignmentsData/demand');

let emailRepository = null;
let photoRepository = null;
let workforcePersonRepository = null;
let jobDetailRepository = null;
let phoneRepository = null;
let employeeHeaderRepository = null;
let costCenterRepository = null;
let profileDetailRepository = null;
let workAssignmentsRepository = null;
let workAssignmentDetailRepository = null;
let projectRoleRepository = null;
let skillRepository = null;
let resourceCapacityRepository = null;
let resourceHeaderRepository = null;
let assignmentsRepository = null;
let fillTimeDimProcedure = null;
let assignmentBucketRepository = null;
let customerRepository = null;
let workPackageRepository = null;
let projectRepository = null;
let skillRequirementRepository = null;
let resourceRequestRepository = null;
let catalogsRepository = null;
let catalogsToSkillsRepository = null;
let proficiencySetRepository = null;
let proficiencyLevelRepository = null;
let proficiencyLevelTextRepository = null;
let resourceOrganizationsRespository = null;
let resourceOrganizationItemsRespository = null;
let demandRepository = null;

const LaunchpadPage = require('../pages/LaunchpadPage.js');
const MyAssignments = require('../pages/MyAssignmentsApp.js');

describe('test-journey-my-assignments', () => {
    const testHelper = new TestHelper();

    // Precautionary data deletion for MyAssignment Service Application
    async function beforeAllDataCleanUp() {
        // Group 1 Deletion Data Preparation Start
        const toBeDeletedEmailData = [];
        const emailParentAsId = []; // WorkforcePerson, EmployeeHeader
        const emailParentSsEmployeeeId = []; // RoleAssignment, SkillAssignment, ExternalWorkExperience, InternalWorkExperience, ExternalWorkExperienceSkills, InternalWorkExperienceSkills
        const emailParentAsParent = []; // ProfileDetails, PhoneDetail
        const emailDataList = await emailRepository.selectByData(['ID, parent'], allEmailAddressData);
        emailDataList.forEach((emailData) => {
            const emailId = emailData.ID;
            const emailParent = emailData.parent;

            toBeDeletedEmailData.push({ ID: emailId });
            emailParentAsId.push({ ID: emailParent });
            emailParentAsParent.push({ parent: emailParent });
            emailParentSsEmployeeeId.push({ employee_ID: emailParent });
        });

        const toBeDeletedWorkforcePersonData = emailParentAsId;
        const toBeDeletedEmployeeHeaderData = emailParentAsId;
        const toBeDeletedProfileData = emailParentAsParent;
        const toBeDeletedPhoneData = emailParentAsParent;
        const toBeDeletedPhotoData = emailParentAsParent;
        // Group 1 Deletion Data Praparation is finished

        // Group 2 Deletion Data Preparation Start
        const toBeDeletedWorkAssignmentData = [];
        const workAssignmentIdAsId = []; // ResourceHeader
        const workAssignmentIdAsResourceId = []; // ResourceCapacity, Assignment
        const workAssignmentIdAsParent = []; // JobDetails
        const workAssignmentDataList = await workAssignmentsRepository.selectByData(['ID'], emailParentAsParent);
        workAssignmentDataList.forEach((workAssignmentData) => {
            const workAssignmentId = workAssignmentData.ID;

            toBeDeletedWorkAssignmentData.push({ ID: workAssignmentId });
            workAssignmentIdAsId.push({ ID: workAssignmentId });
            workAssignmentIdAsParent.push({ parent: workAssignmentId });
            workAssignmentIdAsResourceId.push({ resource_ID: workAssignmentId });
        });

        const toBeDeletedResourceHeaderData = workAssignmentIdAsId;
        const toBeDeletedJobDetailsData = workAssignmentIdAsParent;
        const toBeDeletedWorkAssignmentDetailsData = workAssignmentIdAsParent;
        const toBeDeletedResourceCapacityData = workAssignmentIdAsResourceId;
        const toBeDeletedAssignmentData = workAssignmentIdAsResourceId;
        // Group 2 Deletion Data Praparation is finished

        // Group 3 Deletion Data Preparation Start
        const toBeDeletedSkillData = [];
        const toBeDeletedCatalogs2SkillData = [];
        const toBeDeletedCatalogs = await catalogsRepository.selectByData(['ID'], allCatalogDesc);
        const skillDataList = await skillRepository.selectByData(['ID'], allSkillNames);
        skillDataList.forEach((skillData) => {
            const skillId = skillData.ID;
            toBeDeletedSkillData.push({ ID: skillId });
            toBeDeletedCatalogs2SkillData.push({ SKILL_ID: skillId });
        });

        const toBeDeletedProficiencySetData = [];
        const proficiencySetDataList = await proficiencySetRepository.selectByData(['ID'], allProficiencySetNames);
        proficiencySetDataList.forEach((proficiencySetData) => {
            const proficiencySetId = proficiencySetData.ID;
            toBeDeletedProficiencySetData.push({ ID: proficiencySetId });
        });

        // Group 3 Deletion Data Praparation is finished

        // Group 4 Deletion Data Preparation Start
        const toBeDeletedProjectRoleData = [projectRoleDescription];
        // Group 4 Deletion Data Praparation is finished

        // Group 6 Deletion Data Preparation Start
        const toBeDeletedProjectData = [];
        const toBeDeletedWorkPackageData = [];
        const toBeDeletedSkillRequirementData = [];
        const toBeDeletedDemandsData = [];
        const customerDataList = await customerRepository.selectByData(['ID'], allCustomerNames);
        const resourceRequestDataList = await resourceRequestRepository.selectByData(['ID', 'workpackage_ID', 'project_ID', 'demand_ID'], allResourceRequestDesc);
        resourceRequestDataList.forEach((resourceRequestData1) => {
            toBeDeletedWorkPackageData.push({ ID: resourceRequestData1.workpackage_ID });
            toBeDeletedProjectData.push({ ID: resourceRequestData1.project_ID });
            toBeDeletedSkillRequirementData.push({ RESOURCEREQUEST_ID: resourceRequestData1.ID });
            toBeDeletedDemandsData.push({ ID: resourceRequestData1.demand_ID });
        });
        // Group 6 Deletion Data Preparation finished

        // Data Cleaning Start
        // Group 1
        await emailRepository.deleteMany(toBeDeletedEmailData);
        await workforcePersonRepository.deleteMany(toBeDeletedWorkforcePersonData);
        await employeeHeaderRepository.deleteMany(toBeDeletedEmployeeHeaderData);
        await profileDetailRepository.deleteManyByData(toBeDeletedProfileData);
        await phoneRepository.deleteManyByData(toBeDeletedPhoneData);
        await photoRepository.deleteManyByData(toBeDeletedPhotoData);

        // Group 2
        await workAssignmentsRepository.deleteMany(toBeDeletedWorkAssignmentData);
        await workAssignmentDetailRepository.deleteManyByData(toBeDeletedWorkAssignmentDetailsData);
        await assignmentBucketRepository.deleteMany(assignmentBucket);
        await assignmentsRepository.deleteManyByData(toBeDeletedAssignmentData);
        await resourceHeaderRepository.deleteMany(toBeDeletedResourceHeaderData);
        await jobDetailRepository.deleteManyByData(toBeDeletedJobDetailsData);
        await resourceCapacityRepository.deleteManyByData(toBeDeletedResourceCapacityData);
        // Group 3
        await skillRepository.deleteMany(toBeDeletedSkillData);
        await catalogsToSkillsRepository.deleteManyByData(toBeDeletedCatalogs2SkillData);
        await catalogsRepository.deleteMany(toBeDeletedCatalogs);
        await proficiencySetRepository.deleteMany(toBeDeletedProficiencySetData);

        // Group 4
        await projectRoleRepository.deleteManyByData(toBeDeletedProjectRoleData);

        // Group 5
        await costCenterRepository.deleteMany(costCenters);

        // Group 6
        await skillRequirementRepository.deleteManyByData(toBeDeletedSkillRequirementData);
        await resourceRequestRepository.deleteMany(resourceRequestDataList);
        await workPackageRepository.deleteMany(toBeDeletedWorkPackageData);
        await projectRepository.deleteMany(toBeDeletedProjectData);
        await demandRepository.deleteMany(toBeDeletedDemandsData);
        await customerRepository.deleteMany(customerDataList);

        // Group 7
        await resourceOrganizationsRespository.deleteMany(resourceOrganizations);
        await resourceOrganizationItemsRespository.deleteMany(resourceOrganizationItems);
        // Data Cleaning finished
    }

    /**
     * Setup test data
     */

    beforeAll(async () => {
        console.log('Initializing Data Setup in beforeAll() hook');
        const now = new Date(Date.now());
        const currentYearStart = new Date(Date.UTC(now.getFullYear(), 0, 1));
        const nextYearStart = new Date(Date.UTC(now.getFullYear() + 2, 2, 1));
        console.log('Initializing the repositories.');
        emailRepository = await testEnvironment.getEmailRepository();
        workAssignmentsRepository = await testEnvironment.getWorkAssignmentRepository();
        workAssignmentDetailRepository = await testEnvironment.getWorkAssignmentDetailRepository();
        workforcePersonRepository = await testEnvironment.getWorkforcePersonRepository();
        jobDetailRepository = await testEnvironment.getJobDetailRepository();
        profileDetailRepository = await testEnvironment.getProfileDetailRepository();
        phoneRepository = await testEnvironment.getPhoneRepository();
        photoRepository = await testEnvironment.getPhotoRepository();
        employeeHeaderRepository = await testEnvironment.getEmployeeHeaderRepository();
        costCenterRepository = await testEnvironment.getCostCenterRepository();
        projectRoleRepository = await testEnvironment.getProjectRoleRepository();
        skillRepository = await testEnvironment.getSkillRepository();
        resourceCapacityRepository = await testEnvironment.getResourceCapacityRepository();
        resourceHeaderRepository = await testEnvironment.getResourceHeaderRepository();
        assignmentsRepository = await testEnvironment.getAssignmentsRepository();
        fillTimeDimProcedure = await testEnvironment.getFillTimeDimProcedure();
        assignmentBucketRepository = await testEnvironment.getAssignmentBucketRepository();
        customerRepository = await testEnvironment.getCustomerRepository();
        workPackageRepository = await testEnvironment.getWorkPackageRepository();
        projectRepository = await testEnvironment.getProjectRepository();
        skillRequirementRepository = await testEnvironment.getSkillRequirementRepository();
        resourceRequestRepository = await testEnvironment.getResourceRequestRepository();
        catalogsRepository = await testEnvironment.getCatalogRepository();
        catalogsToSkillsRepository = await testEnvironment.getCatalogs2SkillsRepository();
        proficiencySetRepository = await testEnvironment.getProficiencySetRepository();
        proficiencyLevelRepository = await testEnvironment.getProficiencyLevelRepository();
        proficiencyLevelTextRepository = await testEnvironment.getProficiencyLevelTextRepository();
        resourceOrganizationsRespository = await testEnvironment.getResourceOrganizationsRepository();
        resourceOrganizationItemsRespository = await testEnvironment.getResourceOrganizationItemsRepository();
        demandRepository = await testEnvironment.getDemandRepository();

        console.log('All repositories are initialized.');

        console.log('Initializing precautionary Data Cleanup');
        await beforeAllDataCleanUp();
        console.log('Precautionary Data Cleanup is complete');

        console.log('Initializing Data Insertion');
        await emailRepository.insertMany(emails);
        await projectRoleRepository.insertMany(projectRoles);
        await workAssignmentsRepository.insertMany(workAssignments);
        await workAssignmentDetailRepository.insertMany(workAssignmentDetails);
        await phoneRepository.insertMany(phones);
        await photoRepository.insertMany(photos);
        await costCenterRepository.insertMany(costCenters);
        await workforcePersonRepository.insertMany(workforcePersons);
        await jobDetailRepository.insertMany(jobDetails);
        await employeeHeaderRepository.insertMany(employeeHeaders);
        await profileDetailRepository.insertMany(profileDetails);
        await proficiencySetRepository.ensureDefaultProficiency();
        await proficiencySetRepository.insertMany(proficiencySets);
        await proficiencyLevelRepository.insertMany(proficiencyLevels);
        await proficiencyLevelTextRepository.insertMany(proficiencyLevelTexts);
        await skillRepository.insertMany(skills);
        await resourceCapacityRepository.insertMany(resourceCapacities);
        await resourceHeaderRepository.insertMany(resourceHeaders);
        await fillTimeDimProcedure.callProcedure('05', currentYearStart.toJSON(), nextYearStart.toJSON());
        await customerRepository.insertMany(customers);
        await projectRepository.insertMany(project);
        await workPackageRepository.insertMany(workpackage);
        await resourceRequestRepository.insertMany(resourceRequestData);
        await skillRequirementRepository.insertMany(skillRequirements);
        await assignmentsRepository.insertMany(assignments);
        await assignmentBucketRepository.insertMany(assignmentBucket);
        await catalogsRepository.insertMany(catalogs);
        await catalogsToSkillsRepository.insertMany(catalogs2skills);
        await resourceOrganizationsRespository.insertMany(resourceOrganizations);
        await resourceOrganizationItemsRespository.insertMany(resourceOrganizationItems);
        await demandRepository.insertMany(demand);

        console.log('Data Insertion is complete');

        console.log('Initial data setup completed in beforeAll() hook.');
    });

    /**
     * Tear-down test data
     */
    afterAll(async () => {
        console.log('Cleanup task in afterAll() hook started.');
        await workAssignmentsRepository.deleteMany(workAssignments);
        await workAssignmentDetailRepository.deleteMany(workAssignmentDetails);
        await profileDetailRepository.deleteMany(profileDetails);
        await phoneRepository.deleteMany(phones);
        await photoRepository.deleteMany(photos);
        await workforcePersonRepository.deleteMany(workforcePersons);
        await jobDetailRepository.deleteMany(jobDetails);
        await costCenterRepository.deleteMany(costCenters);
        await employeeHeaderRepository.deleteMany(employeeHeaders);
        await projectRoleRepository.deleteMany(projectRoles);
        await skillRepository.deleteMany(skills);
        await resourceCapacityRepository.deleteMany(resourceCapacities);
        await assignmentBucketRepository.deleteMany(assignmentBucket);
        await assignmentsRepository.deleteMany(assignments);
        await resourceHeaderRepository.deleteMany(resourceHeaders);
        await skillRequirementRepository.deleteMany(skillRequirements);
        await resourceRequestRepository.deleteMany(resourceRequestData);
        await workPackageRepository.deleteMany(workpackage);
        await projectRepository.deleteMany(project);
        await customerRepository.deleteMany(customers);
        await emailRepository.deleteMany(emails);
        await catalogsRepository.deleteMany(catalogs);
        await catalogsToSkillsRepository.deleteMany(catalogs2skills);
        await proficiencySetRepository.deleteMany(proficiencySets);
        await resourceOrganizationsRespository.deleteMany(resourceOrganizations);
        await resourceOrganizationItemsRespository.deleteMany(resourceOrganizationItems);
        await demandRepository.deleteMany(demand);
        console.log('Cleanup task in afterAll() hook completed.');
    });

    // 1. Login as Consultant
    testHelper.loginWithRole('Consultant');

    // 2. Navigate to My Assignments app
    testHelper.failEarlyIt('Should navigate to landing page and click My Assignments tile', async () => {
        LaunchpadPage.actions.openMyAssignmentsApp();
        browser.wait(() => MyAssignments.elements.planningCalendar.isPresent(), 600000);
        expect(MyAssignments.actions.getAppTitle('My Assignments').isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Should navigate to landing page and check basic data with assignment status for Month view', async () => {
        // check for appointments title and respective month wise assigned hr
        expect(MyAssignments.actions.getAppointmentDetailAndColor('Design', '34.00 hr', '#ffffff').isPresent()).toBeTruthy();
        expect(MyAssignments.actions.getAppointmentDetailAndColor('Concept and Design', '21.00 hr', '#1093a2').isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Should click Week button and check basic data with assignment status for Week view', async () => {
        await MyAssignments.filterElements.weekButton.click();
        // check for interval header title and cell color
        expect(MyAssignments.actions.getHeaderTitleAndColor('Assigned / Available: 9 / 8 hr', '#f5b04d').isPresent()).toBeTruthy();
        expect(MyAssignments.actions.getHeaderTitleAndColor('Assigned / Available: 7 / 8 hr', '#3fa45b').isPresent()).toBeTruthy();
        expect(MyAssignments.actions.getHeaderTitleAndColor('Assigned / Available: 5 / 8 hr', '#dc0d0e').isPresent()).toBeTruthy();

        // check for appointments title and respective day wise assigned hr
        expect(MyAssignments.actions.getAppointmentDetailAndColor('Design', '9 hr', '#ffffff').isPresent()).toBeTruthy();
        expect(MyAssignments.actions.getAppointmentDetailAndColor('Concept and Design', '7 hr', '#1093a2').isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Filter appointment for title(request name) and validate', async () => {
        await MyAssignments.filterElements.searchInput.sendKeys('Concept');
        await MyAssignments.filterElements.searchPress.click();
        // Apply filter then check for appointments 0 title and respective assigned hr
        expect(MyAssignments.actions.getAppointmentDetail('Concept and Design', '7 hr').isPresent()).toBeTruthy();
        await MyAssignments.filterElements.searchInput.clear();
        await MyAssignments.filterElements.searchInput.sendKeys('t');
        await MyAssignments.filterElements.searchInput.sendKeys(protractor.Key.BACK_SPACE);
        await MyAssignments.filterElements.searchPress.click();
        // After clear the filter check for appointments 0 title and respective assigned hr
        expect(MyAssignments.actions.getAppointmentDetail('Design', '9 hr').isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Filter appointment for customer name and validate', async () => {
        await MyAssignments.filterElements.searchInput.sendKeys('iTelO MA');
        await MyAssignments.filterElements.searchPress.click();
        // Apply filter then check for appointments 0 title and respective assigned hr
        expect(MyAssignments.actions.getAppointmentDetail('Concept and Design', '7 hr').isPresent()).toBeTruthy();
        await MyAssignments.elements.appointments0.click();
        expect(MyAssignments.popupElements.customerLabel.isPresent()).toBeTruthy();
        expect(MyAssignments.popupElements.customerValue('iTelO MA').isPresent()).toBeTruthy();

        await MyAssignments.filterElements.searchInput.clear();
        await MyAssignments.filterElements.searchInput.sendKeys('t');
        await MyAssignments.filterElements.searchInput.sendKeys(protractor.Key.BACK_SPACE);
        await MyAssignments.filterElements.searchPress.click();
        // After clear the filter check for appointments 0 title and respective assigned hr
        expect(MyAssignments.actions.getAppointmentDetail('Design', '9 hr').isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Filter appointment for incorrect customer/title and validate no records', async () => {
        await MyAssignments.filterElements.searchInput.sendKeys('random#$');
        await MyAssignments.filterElements.searchPress.click();
        // Apply filter then check for appointments 0 should not exsit
        expect(MyAssignments.elements.appointments0.isPresent()).toBeFalsy();

        await MyAssignments.filterElements.searchInput.clear();
        await MyAssignments.filterElements.searchInput.sendKeys('t');
        await MyAssignments.filterElements.searchInput.sendKeys(protractor.Key.BACK_SPACE);
        await MyAssignments.filterElements.searchPress.click();
        // After clear the filter check for appointments 0 title and respective assigned hr
        expect(await MyAssignments.actions.getAppointmentDetail('Design', '9 hr').isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Should click navigation button and check assignment data for next week', async () => {
        await MyAssignments.filterElements.nextButton.click();
        browser.wait(() => MyAssignments.elements.planningCalendarAppointment.isPresent(), 600000);
        // check for interval header title and cell color
        expect(await MyAssignments.actions.getHeaderTitleAndColor('Assigned / Available: 7 / 8 hr', '#3fa45b').isPresent()).toBeTruthy();
        // check for appointments title and respective day wise assigned hr
        expect(await MyAssignments.actions.getAppointmentDetail('Design', '7 hr').isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Should click today button and check assignment data current week', async () => {
        await MyAssignments.filterElements.todayButton.click();

        // check for appointments title and respective day wise assigned hr
        expect(MyAssignments.actions.getAppointmentDetail('Design', '9 hr').isPresent()).toBeTruthy();
        expect(MyAssignments.actions.getAppointmentDetail('Concept and Design', '7 hr').isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Should click datepicker button and select next week date and validate data', async () => {
        const today = new Date();
        const currentMonth = (today.getMonth() + 1).toString();
        const nextWeekDate = new Date(today);
        nextWeekDate.setDate(nextWeekDate.getDate() + 7);
        let month = (nextWeekDate.getMonth() + 1).toString();
        const inputDateMonth = month;
        if (month.length !== 2) { month = `0${month}`; }
        let date = (nextWeekDate.getDate()).toString();
        if (date.length !== 2) { date = `0${date}`; }
        const dateInput = `${nextWeekDate.getFullYear().toString() + month + date}`;

        await MyAssignments.filterElements.datePickerButton.click();
        if (currentMonth !== inputDateMonth) {
            await MyAssignments.filterElements.datePickerNextMonth.click();
        }
        await MyAssignments.filterElements.dateRangeSelect(dateInput).click();
        // check for interval header title and cell color
        expect(MyAssignments.actions.getHeaderTitleAndColor('Assigned / Available: 7 / 8 hr', '#3fa45b').isPresent()).toBeTruthy();
        // check for appointments title and respective day wise assigned hr
        expect(MyAssignments.actions.getAppointmentDetail('Design', '7 hr').isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Should click on a day appointment and check general information data', async () => {
        await MyAssignments.filterElements.todayButton.click();
        await MyAssignments.actions.selectDayAppointmentWithAssigned('Concept and Design', '7 hr').click();

        expect(MyAssignments.popupElements.requestIdLabel.isPresent()).toBeTruthy();
        expect(MyAssignments.popupElements.requestIdValue(resourceRequestData[1].displayId).isPresent()).toBeTruthy();
        expect(MyAssignments.popupElements.workItemLabel.isPresent()).toBeTruthy();
        expect(MyAssignments.popupElements.workItemValue('workItem2')).toBeTruthy();
        expect(MyAssignments.popupElements.projectNameLabel.isPresent()).toBeTruthy();
        expect(MyAssignments.popupElements.projectNameValue('Implementation of SAP S/4HANA 1011').isPresent()).toBeTruthy();
        expect(MyAssignments.popupElements.customerLabel.isPresent()).toBeTruthy();
        expect(MyAssignments.popupElements.customerValue('iTelO MA').isPresent()).toBeTruthy();
        expect(MyAssignments.popupElements.assignedLabel.isPresent()).toBeTruthy();
        expect(MyAssignments.popupElements.assignedValue('7 hr').isPresent()).toBeTruthy();
        expect(MyAssignments.popupElements.durationLabel.isPresent()).toBeTruthy();
        const startTime = new Date(assignmentBucket[1].startTime);
        const startTimeUTCValue = new Date(Date.UTC(startTime.getFullYear(), startTime.getMonth(), startTime.getDate()));
        const startDate = startTimeUTCValue.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        const endTime = new Date(assignmentBucket[9].startTime);
        const endTimeUTCValue = new Date(Date.UTC(endTime.getFullYear(), endTime.getMonth(), endTime.getDate()));
        const endDate = endTimeUTCValue.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        const duration = startDate.concat(' - ', endDate);
        expect(MyAssignments.popupElements.durationValue(duration).isPresent()).toBeTruthy();
        expect(MyAssignments.popupElements.assignmentStatusLabel.isPresent()).toBeTruthy();
        expect(MyAssignments.popupElements.assignmentStatusValue('Hard-Booked').isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Click on appointment view details button and navigates to details page', async () => {
        await MyAssignments.popupElements.viewDetailBtn.click();
        // Switch the window to look for the controls in the newly opened window
        browser.driver.getAllWindowHandles().then((handles) => {
            browser.switchTo().window(handles[handles.length - 1]).then(() => {
                // load uiveri5 instrumentation so by.control works
                browser.loadUI5Dependencies();
                browser.wait(() => MyAssignments.popupElements.requestNameTitle('Concept and Design').isPresent(), 600000);
            });
        });
    });

    testHelper.logout();
});
