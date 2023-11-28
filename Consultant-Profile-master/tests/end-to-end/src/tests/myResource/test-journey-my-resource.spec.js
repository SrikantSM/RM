// const path = require('path');
const { TestHelper } = require('../../utils/TestHelper');
const testEnvironment = require('../../utils');

const { skills, allSkillNames } = require('../data/myResourcesData/skills');
const { employeeHeaders } = require('../data/myResourcesData/employeeHeaders');
const { workAssignments } = require('../data/myResourcesData/workAssignments');
const { workAssignmentDetails } = require('../data/myResourcesData/workAssignmentDetails');
const { workforcePersons } = require('../data/myResourcesData/workforcePersons');
const { skillAssignments } = require('../data/myResourcesData/skillAssignments');
const { projectRoles, projectRoleDescription } = require('../data/myResourcesData/projectRoles');
const { roleAssignments } = require('../data/myResourcesData/roleAssignments');
const { emails, allEmailAddressData } = require('../data/myResourcesData/emails');
const { photos } = require('../data/myResourcesData/photos');
const { resourceHeaders } = require('../data/myResourcesData/resourceHeaders');
const { profileDetails } = require('../data/myResourcesData/profileDetails');
const { phones } = require('../data/myResourcesData/phones');
const { jobDetails } = require('../data/myResourcesData/jobDetails');
const { assignments } = require('../data/myResourcesData/assignments');
const { externalWorkExperiences } = require('../data/myResourcesData/externalWorkExperiences');
const { externalWorkExperienceSkills } = require('../data/myResourcesData/externalWorkExperienceSkills');
const { assignmentBucket } = require('../data/myResourcesData/assignmentBucket');
const { customers, allCustomerNames } = require('../data/myResourcesData/customers');
const { workpackage } = require('../data/myResourcesData/workPackage');
const { project } = require('../data/myResourcesData/project');
const { skillRequirements } = require('../data/myResourcesData/skillRequirements');
const { resourceRequestData, allResourceRequestDesc } = require('../data/myResourcesData/resourceRequest');
const { resourceCapacities } = require('../data/myResourcesData/resourceCapacities');
const { catalogs, allCatalogDesc } = require('../data/myResourcesData/skillCatalogs');
const { catalogs2skills } = require('../data/myResourcesData/skillCatalogs2skills');
const { costCenters } = require('../data/myResourcesData/costCenter');
const { proficiencyLevels } = require('../data/myResourcesData/proficiencyLevels');
const { allProficiencySetNames, proficiencySets } = require('../data/myResourcesData/proficiencySets');
const { proficiencyLevelTexts } = require('../data/myResourcesData/proficiencyLevelTexts');
const { bookedCapacityAggregate } = require('../data/myResourcesData/bookedCapacityAggregates');
const { profilePhotos } = require('../data/profilePhotos');
const { resourceOrganizations } = require('../data/myResourcesData/resourceOrganizations');
const { resourceOrganizationItems } = require('../data/myResourcesData/resourceOrganizationItems');
const { costCenterAttributes } = require('../data/myResourcesData/costCenterAttribute');
const { attachments } = require('../data/attachments');
const { demand } = require('../data/myResourcesData/demand');

const resourceName2 = `${profileDetails[0].firstName} ${profileDetails[0].lastName}`;
const workerType = 'Employee';
const roleName2 = jobDetails[3].jobTitle;
const projectRoles135 = `${projectRoles[0].name}, ${projectRoles[2].name}, ${projectRoles[4].name}`;
const projectRole1 = projectRoles[0].name;
const employeeId2 = workforcePersons[0].externalID;
const costCenterDisplay = `${costCenterAttributes[0].description} (${costCenters[0].costCenterID})`;
const officeLocation2 = 'Germany';
const phone2 = `+${phones[0].number}`;
const email2 = emails[0].address;
const resourceOrg = `${resourceOrganizations[0].name} (${resourceOrganizations[0].displayId})`;
const skills2 = `${skills[0].name} ,${skills[6].name} ,${skills[3].name}`;
const skillID2 = `${skills[0].ID}`;
const resourceNameWithExternalID2 = `${resourceName2} (${employeeId2})`;
const managerName = `${profileDetails[1].fullName} (${workAssignments[2].externalID})`;

let emailRepository = null;
let photoRepository = null;
let workforcePersonRepository = null;
let jobDetailRepository = null;
let phoneRepository = null;
let employeeHeaderRepository = null;
let costCenterRepository = null;
let costCenterAttributeRepository = null;
let profileDetailRepository = null;
let workAssignmentsRepository = null;
let workAssignmentDetailRepository = null;
let projectRoleRepository = null;
let roleAssignmentRepository = null;
let skillRepository = null;
let skillAssignmentRepository = null;
let externalWorkExperienceSkillRepository = null;
let externalWorkExperienceRepository = null;
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
let bookedCapacityAggregateRepository = null;
let profilePhotoRepository = null;
let resourceOrganizationsRespository = null;
let resourceOrganizationItemsRespository = null;
let attachmentRepository = null;
let demandRepository = null;

const MyResourcesListPage = require('../pages/myResourcePages/MyResourcesListPage');
const LaunchpadPage = require('../pages/LaunchpadPage.js');
const MyResourcesCommonAssertion = require('../pages/myResourcePages/MyResourcesCommonAssertion.js');
const BasicDataPage = require('../pages/myResourcePages/BasicDataPage');
const Qualifications = require('../pages/myResourcePages/Qualifications');
const CommonPageElements = require('../pages/myResourcePages/CommonPageElements.js');
const CudOperations = require('../pages/myResourcePages/CudOperations.js');
const { testRunId } = require('../data/testRunID');
const PriorExperienceRole = require('../pages/myResourcePages/PriorExperience-Role');
const ExternalWorkExperience = require('../pages/myResourcePages/ExternalWorkExperience');
const InternalWorkExperience = require('../pages/myResourcePages/InternalWorkExperience');
const Availability = require('../pages/myResourcePages/Availability');
const Attachments = require('../pages/Attachment.js');

describe('test-journey-my-resource', () => {
    const testHelper = new TestHelper();

    // Precautionary data deletion for MyResources Application
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
        const toBeDeletedRoleAssignmentData = emailParentSsEmployeeeId;
        const toBeDeletedSkillAssignmentData = emailParentSsEmployeeeId;
        const toBeDeletedExternalWorkExperienceSkillsData = emailParentSsEmployeeeId;
        const toBeDeletedExternalWorkExperienceData = emailParentSsEmployeeeId;
        const toBeDeletedProfilePhotoData = emailParentSsEmployeeeId;
        const tobeDeletedAttachmentData = emailParentSsEmployeeeId;
        // Group 1 Deletion Data Praparation is finished

        // Group 2 Deletion Data Preparation Start
        const toBeDeletedWorkAssignmentData = [];
        const workAssignmentIdAsId = []; // ResourceHeader
        const workAssignmentIdAsResourceId = []; // ResourceCapacity, Assignment
        const workAssignmentIdAsResourceId2 = []; // BookedCapacityAggregate
        const workAssignmentIdAsParent = []; // JobDetails
        const workAssignmentDataList = await workAssignmentsRepository.selectByData(['ID'], emailParentAsParent);
        workAssignmentDataList.forEach((workAssignmentData) => {
            const workAssignmentId = workAssignmentData.ID;

            toBeDeletedWorkAssignmentData.push({ ID: workAssignmentId });
            workAssignmentIdAsId.push({ ID: workAssignmentId });
            workAssignmentIdAsParent.push({ parent: workAssignmentId });
            workAssignmentIdAsResourceId.push({ resource_ID: workAssignmentId });
            workAssignmentIdAsResourceId2.push({ resourceID: workAssignmentId });
        });

        const toBeDeletedResourceHeaderData = workAssignmentIdAsId;
        const toBeDeletedJobDetailsData = workAssignmentIdAsParent;
        const toBeDeletedWorkAssignmentDetailsData = workAssignmentIdAsParent;
        const toBeDeletedResourceCapacityData = workAssignmentIdAsResourceId;
        const toBeDeletedAssignmentData = workAssignmentIdAsResourceId;
        const toBeDeletedBookedCapacityAggregate = workAssignmentIdAsResourceId2;
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
        await roleAssignmentRepository.deleteManyByData(toBeDeletedRoleAssignmentData);
        await skillAssignmentRepository.deleteManyByData(toBeDeletedSkillAssignmentData);
        await externalWorkExperienceSkillRepository.deleteManyByData(toBeDeletedExternalWorkExperienceSkillsData);
        await externalWorkExperienceRepository.deleteManyByData(toBeDeletedExternalWorkExperienceData);
        await profilePhotoRepository.deleteManyByData(toBeDeletedProfilePhotoData);
        await attachmentRepository.deleteManyByData(tobeDeletedAttachmentData);

        // Group 2
        await workAssignmentsRepository.deleteMany(toBeDeletedWorkAssignmentData);
        await workAssignmentDetailRepository.deleteManyByData(toBeDeletedWorkAssignmentDetailsData);
        await assignmentBucketRepository.deleteMany(assignmentBucket);
        await assignmentsRepository.deleteManyByData(toBeDeletedAssignmentData);
        await resourceHeaderRepository.deleteMany(toBeDeletedResourceHeaderData);
        await jobDetailRepository.deleteManyByData(toBeDeletedJobDetailsData);
        await resourceCapacityRepository.deleteManyByData(toBeDeletedResourceCapacityData);
        await bookedCapacityAggregateRepository.deleteManyByData(toBeDeletedBookedCapacityAggregate);

        // Group 3
        await skillRepository.deleteMany(toBeDeletedSkillData);
        await catalogsToSkillsRepository.deleteManyByData(toBeDeletedCatalogs2SkillData);
        await catalogsRepository.deleteMany(toBeDeletedCatalogs);
        await proficiencySetRepository.deleteMany(toBeDeletedProficiencySetData);

        // Group 4
        await projectRoleRepository.deleteManyByData(toBeDeletedProjectRoleData);

        // Group 5
        await costCenterRepository.deleteManyByData(costCenters);
        await costCenterAttributeRepository.deleteManyByData(costCenterAttributes);

        // Group 6
        await skillRequirementRepository.deleteManyByData(toBeDeletedSkillRequirementData);
        await resourceRequestRepository.deleteMany(resourceRequestDataList);
        await workPackageRepository.deleteMany(toBeDeletedWorkPackageData);
        await demandRepository.deleteMany(toBeDeletedDemandsData);
        await projectRepository.deleteMany(toBeDeletedProjectData);
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
        roleAssignmentRepository = await testEnvironment.getRoleAssignmentRepository();
        skillRepository = await testEnvironment.getSkillRepository();
        skillAssignmentRepository = await testEnvironment.getSkillAssignmentRepository();
        externalWorkExperienceSkillRepository = await testEnvironment.getExternalWorkExperienceSkillRepository();
        externalWorkExperienceRepository = await testEnvironment.getExternalWorkExperienceRepository();
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
        bookedCapacityAggregateRepository = await testEnvironment.getBookedCapacityAggregateRepository();
        profilePhotoRepository = await testEnvironment.getProfilePhotoRepository();
        attachmentRepository = await testEnvironment.getAttachmentRepository();
        resourceOrganizationsRespository = await testEnvironment.getResourceOrganizationsRepository();
        resourceOrganizationItemsRespository = await testEnvironment.getResourceOrganizationItemsRepository();
        costCenterAttributeRepository = await testEnvironment.getCostCenterAttributeRepository();
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
        await roleAssignmentRepository.insertMany(roleAssignments);
        await proficiencySetRepository.ensureDefaultProficiency();
        await proficiencySetRepository.insertMany(proficiencySets);
        await proficiencyLevelRepository.insertMany(proficiencyLevels);
        await proficiencyLevelTextRepository.insertMany(proficiencyLevelTexts);
        await skillRepository.insertMany(skills);
        await skillAssignmentRepository.insertMany(skillAssignments);
        await externalWorkExperienceSkillRepository.insertMany(externalWorkExperienceSkills);
        await externalWorkExperienceRepository.insertMany(externalWorkExperiences);
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
        await bookedCapacityAggregateRepository.insertMany(bookedCapacityAggregate);
        await profilePhotoRepository.insertMany(profilePhotos);
        await attachmentRepository.insertMany(attachments);
        await resourceOrganizationsRespository.insertMany(resourceOrganizations);
        await resourceOrganizationItemsRespository.insertMany(resourceOrganizationItems);
        await costCenterAttributeRepository.insertMany(costCenterAttributes);
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
        await roleAssignmentRepository.deleteMany(roleAssignments);
        await skillRepository.deleteMany(skills);
        await skillAssignmentRepository.deleteMany(skillAssignments);
        await externalWorkExperienceSkillRepository.deleteMany(externalWorkExperienceSkills);
        await externalWorkExperienceRepository.deleteMany(externalWorkExperiences);
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
        await bookedCapacityAggregateRepository.deleteMany(bookedCapacityAggregate);
        await profilePhotoRepository.deleteMany(profilePhotos);
        await attachmentRepository.deleteMany(attachments);
        await resourceOrganizationsRespository.deleteMany(resourceOrganizations);
        await resourceOrganizationItemsRespository.deleteMany(resourceOrganizationItems);
        await costCenterAttributeRepository.deleteMany(costCenterAttributes);
        await demandRepository.deleteMany(demand);
        console.log('Cleanup task in afterAll() hook completed.');
    });

    // const availColumns = ['Month', 'Avail­able (Hours)', 'Assigned (Hours)', 'Free (Hours)', 'Utilization (%)'];
    const skillsOnly = [
        skills[1].name, // NodeJS
        skills[2].name, // UI5
        skills[0].name, // CDS
        skills[5].name, // CAP  restricted
        skills[6].name, // Java restricted
    ];
    const skillsInTable = [
        skills[0].name, // CDS
        skills[3].name, // Product Management
        skills[1].name, // NodeJS
        skills[2].name, // UI5
        skills[6].name, // Java
    ];
    const proficiencyLevelNames = [
        proficiencyLevelTexts[0].name, // Level 1 Set 1
        proficiencyLevelTexts[1].name, // Level 2 Set 1
        proficiencyLevelTexts[2].name, // Level 1 Set 2
        proficiencyLevelTexts[3].name, // Level 2 Set 2
    ];
    const roles = [
        projectRoles[0].name, // Junior Consulant
        projectRoles[1].name, // Senior Consultant
        projectRoles[2].name, // Platinum Consultant
        projectRoles[3].name, // Architect
        projectRoles[4].name, // Program Manager(restricted)
    ];

    const workExperienceIDs = {
        externalDraft: {
            assignment: 'myResourcesUi::ExternalWorkExperienceObjectPage--fe::FormContainer::FieldGroup::GeneralInformation::FormElement::DataField::projectName::Field',
            company: 'myResourcesUi::ExternalWorkExperienceObjectPage--fe::FormContainer::FieldGroup::GeneralInformation::FormElement::DataField::companyName::Field',
            customer: 'myResourcesUi::ExternalWorkExperienceObjectPage--fe::FormContainer::FieldGroup::GeneralInformation::FormElement::DataField::customer::Field',
            startDate: 'myResourcesUi::ExternalWorkExperienceObjectPage--fe::FormContainer::FieldGroup::GeneralInformation::FormElement::DataField::startDate::Field',
            endDate: 'myResourcesUi::ExternalWorkExperienceObjectPage--fe::FormContainer::FieldGroup::GeneralInformation::FormElement::DataField::endDate::Field',
            role: 'myResourcesUi::ExternalWorkExperienceObjectPage--fe::FormContainer::FieldGroup::GeneralInformation::FormElement::DataField::rolePlayed::Field',
        },
    };
    // 1. Login as Resource Manager
    testHelper.loginWithRole('ResourceManagerUI', employeeHeaders[0].ID);

    // 2. Navigate to My Resources app
    testHelper.failEarlyIt('Should navigate to landing page and click My Resources tile', async () => {
        LaunchpadPage.actions.openMyResourcesApp();
        browser.wait(() => MyResourcesListPage.elements.listReportTable.isPresent(), 600000);
        expect(MyResourcesCommonAssertion.actions.getAppTitle('My Resources').isPresent()).toBeTruthy();
    });

    // 3. Search the value from search placeholder
    testHelper.failEarlyIt('Search of a value from search placeholder', async () => {
        await MyResourcesListPage.actions.clickOnExpandButton();
        await MyResourcesListPage.filterElements.searchPlaceholder.sendKeys('source');
        await MyResourcesListPage.filterElements.goButton.click();
        const filteredRecords = await MyResourcesListPage.listReport.elements.tableRows.count();
        expect(filteredRecords).toBe(0);
        await MyResourcesListPage.filterElements.searchPlaceholder.clear();
        await MyResourcesListPage.filterElements.goButton.click();
    });

    // 4. Check for data
    testHelper.failEarlyIt('Should check existing Resources data', async () => {
        MyResourcesCommonAssertion.elements.iExecuteShowDetails.click();
        expect(MyResourcesListPage.actions.getColumnHeader().get(0).getText()).toBe('Name');

        const resourcesTitleText = await MyResourcesListPage.elements.tableTitle.getText();
        expect(resourcesTitleText.substring(0, 9)).toBe('Resources');
        await MyResourcesCommonAssertion.assertions.checkTableData(resourceName2, projectRoles135, 'Employee', employeeId2, costCenterDisplay, officeLocation2, skills2);
        MyResourcesCommonAssertion.elements.iExecuteHideDetails.click();
    });

    // 5. Filter for name
    testHelper.failEarlyIt('Filter the list page with name and check the name popover', async () => {
        MyResourcesCommonAssertion.elements.iExecuteShowDetails.click();
        await MyResourcesListPage.filterElements.name.sendKeys(resourceName2);
        await MyResourcesListPage.filterElements.goButton.click();
        await MyResourcesListPage.filterElements.goButton.click();
        const filteredRecords = await MyResourcesListPage.listReport.elements.tableRows.count();
        expect(filteredRecords).toBe(1);
        // Data check
        MyResourcesCommonAssertion.assertions.checkTableData(resourceName2, projectRoles135, 'Employee', employeeId2, costCenterDisplay, officeLocation2, skills2);
        expect(await MyResourcesListPage.elements.listColumnprofilePhoto.isPresent()).toBeTruthy();
        expect(await MyResourcesListPage.elements.resourceNameLink.isPresent()).toBeTruthy();
        await MyResourcesListPage.actions.clickOnAName(resourceName2);
        expect(await MyResourcesListPage.elements.popover.isPresent()).toBeTruthy();
        expect(await MyResourcesListPage.elements.contactCardTitle.isPresent()).toBeTruthy();
        expect(await MyResourcesListPage.elements.contactCardProfilePhoto.isPresent()).toBeTruthy();
        expect(await MyResourcesListPage.elements.contactCardOrganizationDetails.isPresent()).toBeTruthy();
        expect(await MyResourcesListPage.elements.contactCardContactDetails.isPresent()).toBeTruthy();
        expect(await MyResourcesListPage.elements.contactCardWorkerTypeLabel.isPresent()).toBeTruthy();
        expect(await MyResourcesListPage.elements.contactCardResourceOrganizationLabel.isPresent()).toBeTruthy();
        expect(await MyResourcesListPage.elements.contactCardCostCenterLabel.isPresent()).toBeTruthy();
        expect(await MyResourcesListPage.elements.contactCardManagerLabel.isPresent()).toBeTruthy();
        expect(await MyResourcesListPage.elements.contactCardMobileLabel.isPresent()).toBeTruthy();
        expect(await MyResourcesListPage.elements.contactCardEmailLabel.isPresent()).toBeTruthy();
        expect(await MyResourcesListPage.elements.contactCardAddressLabel.isPresent()).toBeTruthy();
        expect(await MyResourcesListPage.actions.getcontactCardNameValue(resourceNameWithExternalID2).isPresent()).toBeTruthy();
        expect(await MyResourcesListPage.actions.getcontactCardRoleValue(roleName2).isPresent()).toBeTruthy();
        expect(await MyResourcesListPage.actions.getcontactCardWorkerTypeValue(workerType).isPresent()).toBeTruthy();
        expect(await MyResourcesListPage.actions.getcontactCardResourceOrgValue(resourceOrg).isPresent()).toBeTruthy();
        expect(await MyResourcesListPage.actions.getcontactCardCostCenterValue(costCenterDisplay).isPresent()).toBeTruthy();
        expect(await MyResourcesListPage.actions.getcontactCardManagerFullNameValue(managerName).isPresent()).toBeTruthy();
        expect(await MyResourcesListPage.actions.getcontactCardMobileNoValue(phone2).isPresent()).toBeTruthy();
        expect(await MyResourcesListPage.actions.getcontactCardEmailValue(email2).isPresent()).toBeTruthy();
        expect(await MyResourcesListPage.actions.getcontactCardAddressValue(officeLocation2).isPresent()).toBeTruthy();
        await MyResourcesListPage.filterElements.name.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
        await MyResourcesListPage.filterElements.name.sendKeys(protractor.Key.BACK_SPACE);
        await MyResourcesListPage.filterElements.goButton.click();
        MyResourcesCommonAssertion.elements.iExecuteHideDetails.click();
    });

    // 6. Filter for project role
    testHelper.failEarlyIt('Filter the list page with project role', async () => {
        await MyResourcesListPage.filterElements.projectRole.sendKeys(projectRole1);
        await CudOperations.actions.selectFromDropdown(projectRole1);
        await MyResourcesListPage.filterElements.goButton.click();
        const filteredRecords = await MyResourcesListPage.listReport.elements.tableRows.count();
        expect(filteredRecords).toBeGreaterThanOrEqual(1);
        await MyResourcesListPage.filterElements.projectRole.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
        await MyResourcesListPage.filterElements.projectRole.sendKeys(protractor.Key.BACK_SPACE);
        await MyResourcesListPage.filterElements.goButton.click();
    });

    // 7. Filter for office location
    testHelper.failEarlyIt('Filter the list page with office location', async () => {
        await MyResourcesListPage.filterElements.officeLocation.sendKeys(officeLocation2);
        await MyResourcesListPage.filterElements.goButton.click();
        const filteredRecords = await MyResourcesListPage.listReport.elements.tableRows.count();
        expect(filteredRecords).toBe(1);
        // Data check
        MyResourcesCommonAssertion.elements.iExecuteShowDetails.click();
        MyResourcesCommonAssertion.assertions.checkTableData(resourceName2, projectRoles135, 'Employee', employeeId2, costCenterDisplay, officeLocation2, skills2);
        MyResourcesCommonAssertion.elements.iExecuteHideDetails.click();
        await MyResourcesListPage.filterElements.officeLocation.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
        await MyResourcesListPage.filterElements.officeLocation.sendKeys(protractor.Key.BACK_SPACE);
        await MyResourcesListPage.filterElements.goButton.click();
    });

    // 8. Filter for skills
    testHelper.failEarlyIt('Filter the list page with skills', async () => {
        await MyResourcesListPage.filterElements.skill_ID.sendKeys(skillID2);
        await MyResourcesListPage.filterElements.goButton.click();
        const filteredRecords = await MyResourcesListPage.listReport.elements.tableRows.count();
        expect(filteredRecords).toBeGreaterThan(0);
        MyResourcesCommonAssertion.elements.iExecuteShowDetails.click();
        MyResourcesCommonAssertion.assertions.checkTableData(resourceName2, projectRoles135, 'Employee', employeeId2, costCenterDisplay, officeLocation2, skills2);
        MyResourcesCommonAssertion.elements.iExecuteHideDetails.click();
        await MyResourcesListPage.filterElements.skill_ID.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
        await MyResourcesListPage.filterElements.skill_ID.sendKeys(protractor.Key.BACK_SPACE);
        await MyResourcesListPage.filterElements.goButton.click();
    });

    // 9. Filter for worker type
    testHelper.failEarlyIt('Filter the list page with worker type', async () => {
        await MyResourcesListPage.filterElements.workerType.sendKeys('Employee');
        await MyResourcesListPage.filterElements.goButton.click();
        const filteredRecords = await MyResourcesListPage.listReport.elements.tableRows.count();
        expect(filteredRecords).toBe(1);
        MyResourcesCommonAssertion.elements.iExecuteShowDetails.click();
        MyResourcesCommonAssertion.assertions.checkTableData(resourceName2, projectRoles135, 'Employee', employeeId2, costCenterDisplay, officeLocation2, skills2);
        MyResourcesCommonAssertion.elements.iExecuteHideDetails.click();
        await MyResourcesListPage.filterElements.workerType.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
        await MyResourcesListPage.filterElements.workerType.sendKeys(protractor.Key.BACK_SPACE);
        await MyResourcesListPage.filterElements.goButton.click();
    });

    // Navigate to object page
    testHelper.failEarlyIt('Navigate to object page', async () => {
        await MyResourcesListPage.actions.navigateToObjectPage(costCenterDisplay);
        browser.wait(() => BasicDataPage.assertions.title.isPresent(), 600000);
        expect(await MyResourcesCommonAssertion.actions.getAppTitle('Resource').isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Check basic data of resource', async () => {
        const email = emails[0].address;
        const resourceName = `${profileDetails[0].firstName} ${profileDetails[0].lastName} (${workforcePersons[0].externalID})`;
        const mobileNumber = `+${phones[0].number}`;
        const resourceRole = jobDetails[3].jobTitle;
        const organizationName = `${resourceOrganizations[0].name} (${resourceOrganizations[0].displayId})`;
        const officeLocation = 'Germany';
        const costCenter = `${costCenterAttributes[0].description} (${costCenters[0].costCenterID})`;
        const personInitials = 'EE';

        BasicDataPage.assertions.checkHeaderTitle(resourceName);
        BasicDataPage.assertions.checkHeaderLabel(resourceRole);
        BasicDataPage.staticAssertions.orgInfoLabel();
        BasicDataPage.assertions.checkOrgInfoDeptValue(organizationName);
        BasicDataPage.assertions.checkOrgInfoOfficeLocValue(officeLocation);
        BasicDataPage.assertions.checkWorkerCostCenterValue(costCenter);
        BasicDataPage.staticAssertions.contactInfo();
        BasicDataPage.assertions.checkContactInfoEmailValue(email);
        BasicDataPage.assertions.checkContactInfoMobileNoValue(mobileNumber);
        BasicDataPage.staticAssertions.workerTypeInfo();
        BasicDataPage.assertions.checkWorkerTypeValue(workerType);
        BasicDataPage.assertions.checkProfilePhotoAvatarOnHeader(personInitials);
        BasicDataPage.staticAssertions.changeRecordInfo();
        BasicDataPage.staticAssertions.changedOnLabel();
        BasicDataPage.staticAssertions.changedByLabel();
    });

    testHelper.failEarlyIt('Check Resource\'s Manager Details', async () => {
        const resourceManagerName = `${profileDetails[1].firstName} ${profileDetails[1].lastName} (${workforcePersons[1].externalID})`;
        const resourceManagerEmail = emails[1].address;
        const resourceManagerPhoneNumber = `+${phones[1].number}`;
        BasicDataPage.assertions.checkOrgInfoManagerValue(resourceManagerName);
        BasicDataPage.actions.openManagerContactCard(resourceManagerName);
        BasicDataPage.staticAssertions.managerContactCardHeader();
        BasicDataPage.staticAssertions.managerContactCardContactDetails();
        BasicDataPage.staticAssertions.managerContactCardContactDetailsEmailLabel();
        BasicDataPage.assertions.checkManagerContactCardEmailValue(resourceManagerEmail);
        BasicDataPage.staticAssertions.managerContactCardContactDetailsMobileLabel();
        BasicDataPage.assertions.checkManagerContactCardMobileNoValue(resourceManagerPhoneNumber);
    });

    // Basic data check on edit
    testHelper.failEarlyIt('Check basic data in edit mode', async () => {
        const email = emails[0].address;
        const resourceName = `${profileDetails[0].firstName} ${profileDetails[0].lastName} (${workforcePersons[0].externalID})`;
        const mobileNumber = `+${phones[0].number}`;
        const resourceRole = jobDetails[3].jobTitle;
        const organizationName = `${resourceOrganizations[0].name} (${resourceOrganizations[0].displayId})`;
        const officeLocation = 'Germany';
        const costCenter = `${costCenterAttributes[0].description} (${costCenters[0].costCenterID})`;
        const personInitials = 'EE';
        const resourceManagerName = `${profileDetails[1].firstName} ${profileDetails[1].lastName} (${workforcePersons[1].externalID})`;

        CommonPageElements.objectPage.elements.editButton.click();
        BasicDataPage.assertions.checkHeaderTitle(resourceName);
        BasicDataPage.assertions.checkHeaderLabel(resourceRole);
        BasicDataPage.staticAssertions.orgInfoLabel();
        BasicDataPage.assertions.checkOrgInfoDeptValue(organizationName);
        BasicDataPage.assertions.checkOrgInfoOfficeLocValue(officeLocation);
        BasicDataPage.assertions.checkWorkerCostCenterValue(costCenter);
        BasicDataPage.staticAssertions.contactInfo();
        BasicDataPage.assertions.checkContactInfoEmailValue(email);
        BasicDataPage.assertions.checkContactInfoMobileNoValue(mobileNumber);
        BasicDataPage.staticAssertions.workerTypeInfo();
        BasicDataPage.assertions.checkWorkerTypeValue(workerType);
        BasicDataPage.assertions.checkProfilePhotoAvatarOnHeader(personInitials);
        BasicDataPage.assertions.checkOrgInfoManagerValue(resourceManagerName);
        BasicDataPage.staticAssertions.changeRecordInfo();
        BasicDataPage.staticAssertions.changedOnLabel();
        BasicDataPage.staticAssertions.changedByLabel();
        await CommonPageElements.objectPage.elements.footer.cancelButton.click();
    });

    testHelper.failEarlyIt('Check qualifications', async () => {
        browser.wait(() => Qualifications.parentElements.contentSection.isPresent(), 600000);
        Qualifications.actions.navigateToQualifications();
        const skillTitleText = await Qualifications.qualifications.elements.tableTitle.getText();
        expect(skillTitleText.substring(0, 6)).toBe('Skills');
        const regexp = new RegExp('([3-9])|([1-9][0-9])');
        expect(regexp.test(skillTitleText.substring(7))).toBeTruthy();
        Qualifications.assertions.checkSkillName(skillsInTable[0]);
        Qualifications.assertions.checkProficiencyLevelName(proficiencyLevelNames[0]);
        Qualifications.assertions.checkSkillName(skillsInTable[1]);
        Qualifications.assertions.checkProficiencyLevelName(proficiencyLevelNames[1]);
        Qualifications.assertions.checkSkillName(skillsInTable[4]);
        Qualifications.assertions.checkProficiencyLevelName(proficiencyLevelNames[2]);
    });

    testHelper.failEarlyIt('Check the skill popover', async () => {
        await BasicDataPage.parentElements.consultantHeaders.collapseButton.click();
        await Qualifications.actions.clickOnASkill(skillsInTable[0]);
        expect(Qualifications.parentElements.skillPopover.descriptionLabel.isPresent()).toBeTruthy();
        expect(Qualifications.parentElements.skillPopover.descriptionValue(skills[0].description).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Check skills value help', async () => {
        await CommonPageElements.objectPage.elements.editButton.click();
        await BasicDataPage.parentElements.consultantHeaders.collapseButton.click();
        await CudOperations.actions.openValueHelp('skills', 1);
        await Qualifications.qualifications.elements.valueHelpShowFiltersBtn.click();
        await PriorExperienceRole.priorExperience.elements.valueHelpSearchInput_skills.sendKeys(testRunId);
        await PriorExperienceRole.priorExperience.elements.valueHelpSearchPress_skills.click();
        await Qualifications.qualifications.elements.valueHelpCancelButton.click();
    });
    testHelper.failEarlyIt('Should create a new skill and check its proficiency levels in the value help', async () => {
        await CudOperations.actions.create('skills');
        await Qualifications.actions.navigateToQualifications();
        await CudOperations.actions.changeValueOfTheSkillsRow('', skillsOnly[0]);
        await Qualifications.qualifications.elements.tableTitle.click();
        await Qualifications.qualifications.elements.tableTitle.click();
        await CudOperations.actions.clickDropdownBySiblingValue('skills', skillsOnly[0], 'proficiencyLevel_ID', 'MyResourceObjectPage');
        await Qualifications.assertions.checkProficiencyLevelValueHelpTableData(0, proficiencyLevels[0].name, proficiencyLevels[0].description);
        await Qualifications.assertions.checkProficiencyLevelValueHelpTableData(0, proficiencyLevels[0].name, proficiencyLevels[0].description);
    });
    testHelper.failEarlyIt('Should select a proficiency, save the skill and check the skills table for the same', async () => {
        await CudOperations.actions.selectFromDropdown(proficiencyLevelNames[0]);
        await CommonPageElements.objectPage.elements.footer.clickSaveButton.click();
        const skillTitleText = await Qualifications.qualifications.elements.tableTitle.getText();
        expect(skillTitleText.substring(0, 6)).toBe('Skills');
        const regexp = new RegExp('([4-9])|([1-9][0-9])');
        expect(regexp.test(skillTitleText.substring(7))).toBeTruthy();
        expect(await Qualifications.actions.getSkillName(skillsInTable[0]).isPresent()).toBeTruthy();
        expect(await Qualifications.actions.getSkillName(skillsInTable[1]).isPresent()).toBeTruthy();
        expect(await Qualifications.actions.getSkillName(skillsInTable[2]).isPresent()).toBeTruthy();
        expect(await Qualifications.actions.getSkillName(skillsInTable[4]).isPresent()).toBeTruthy();
    });
    testHelper.failEarlyIt('Value help should not display resticted skills though they were assigned previously', async () => {
        await CommonPageElements.objectPage.elements.editButton.click();
        await CudOperations.actions.openValueHelp('skills', 0);
        browser.wait(() => Qualifications.qualifications.elements.catalogFilterInput.isPresent(), 600000);
        await Qualifications.qualifications.elements.catalogFilterInput.sendKeys(catalogs[2].name);
        await Qualifications.qualifications.elements.catalogFilterInput.sendKeys(protractor.Key.ENTER);
        expect(await CudOperations.actions.getValueHelpItemsCount('skill', catalogs[2].name)).toBe(0);
        await PriorExperienceRole.priorExperience.elements.valueHelpSearchInput_skills.sendKeys(skillsOnly[3]);
        await PriorExperienceRole.priorExperience.elements.valueHelpSearchPress_skills.click();
        expect(await CudOperations.actions.getValueHelpItemsCount('skill', catalogs[2].name)).toBe(0);
        await Qualifications.qualifications.elements.valueHelpCancelButton.click();
        await CommonPageElements.objectPage.elements.footer.cancelButton.click();
        const skillTitleText = await Qualifications.qualifications.elements.tableTitle.getText();
        expect(skillTitleText.substring(0, 6)).toBe('Skills');
        const regexp = new RegExp('([4-9])|([1-9][0-9])');
        expect(regexp.test(skillTitleText.substring(7))).toBeTruthy();
    });

    testHelper.failEarlyIt('Should delete a skill (restricted) and check the skills table for the same', async () => {
        await CommonPageElements.objectPage.elements.editButton.click();
        await Qualifications.actions.navigateToQualifications();
        await CudOperations.actions.delete('skills', skillsOnly[4]);
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        const skillTitleText = await Qualifications.qualifications.elements.tableTitle.getText();
        expect(skillTitleText.substring(0, 6)).toBe('Skills');
        const regexp = new RegExp('([3-9])|([1-9][0-9])');
        expect(regexp.test(skillTitleText.substring(7))).toBeTruthy();
        expect(await Qualifications.actions.getSkillName(skillsInTable[0]).isPresent()).toBeTruthy();
        expect(await Qualifications.actions.getSkillName(skillsInTable[1]).isPresent()).toBeTruthy();
        expect(await Qualifications.actions.getSkillName(skillsInTable[2]).isPresent()).toBeTruthy();
        expect(await Qualifications.actions.getSkillName(skillsOnly[4]).isPresent()).toBeFalsy();
    });

    testHelper.failEarlyIt('Should update the existing skill to a new one', async () => {
        await CommonPageElements.objectPage.elements.editButton.click();
        await Qualifications.actions.navigateToQualifications();
        await CudOperations.actions.changeValueOfTheSkillsRow(skillsOnly[0], skillsOnly[1]);
        await Qualifications.qualifications.elements.tableTitle.click();
        await CudOperations.actions.clickDropdownBySiblingValue('skills', skillsOnly[1], 'proficiencyLevel_ID', 'MyResourceObjectPage');
        await CudOperations.actions.selectFromDropdown(proficiencyLevelNames[0]);
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        const skillTitleText = await Qualifications.qualifications.elements.tableTitle.getText();
        expect(skillTitleText.substring(0, 6)).toBe('Skills');
        const regexp = new RegExp('([3-9])|([1-9][0-9])');
        expect(regexp.test(skillTitleText.substring(7))).toBeTruthy();
        expect(await Qualifications.actions.getSkillName(skillsInTable[0]).isPresent()).toBeTruthy();
        expect(await Qualifications.actions.getSkillName(skillsInTable[1]).isPresent()).toBeTruthy();
        expect(await Qualifications.actions.getSkillName(skillsInTable[3]).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Should not assign an duplicate/empty/random skill and delete a skill in draft saved state', async () => {
        await CommonPageElements.objectPage.elements.editButton.click();
        await CudOperations.actions.create('skills');
        await CudOperations.actions.fillEmptyInputBox('skills', skillsOnly[2]);
        await CudOperations.actions.create('skills');
        await CudOperations.actions.fillEmptyInputBox('skills', 'randomSkill');
        await CudOperations.actions.create('skills');
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        // Messages API
        expect(await CommonPageElements.actions.getMessageButtonState('Negative').asControl().getProperty('text')).toBe('5');
        expect(await CommonPageElements.actions.getMessageErrorList('Delete the duplicate skill.').isPresent()).toBeTruthy();
        expect(await CommonPageElements.actions.getMessageErrorList('Select an existing skill from the value help.').isPresent()).toBeTruthy();
        expect(await CommonPageElements.actions.getMessageErrorList('Select a skill or delete the line.').isPresent()).toBeTruthy();
        expect(await CommonPageElements.actions.getMessageErrorList('Enter an existing proficiency level.').isPresent()).toBeTruthy();
        expect(await Qualifications.actions.getSkillWithErrorValueState('Error').isPresent()).toBeTruthy();
        await CommonPageElements.objectPage.elements.footer.messageButton.click();
        let skillTitleText = await Qualifications.qualifications.elements.tableTitle.getText();
        expect(skillTitleText.substring(0, 6)).toBe('Skills');
        let regexp = new RegExp('([6-9])|([1-9][0-9])');
        expect(regexp.test(skillTitleText.substring(7))).toBeTruthy();
        await CommonPageElements.objectPage.elements.footer.cancelButton.click();
        await CommonPageElements.objectPage.elements.footer.discardButton.click();
        await Qualifications.actions.navigateToQualifications();
        skillTitleText = await Qualifications.qualifications.elements.tableTitle.getText();
        expect(skillTitleText.substring(0, 6)).toBe('Skills');
        regexp = new RegExp('([3-9])|([1-9][0-9])');
        expect(regexp.test(skillTitleText.substring(7))).toBeTruthy();
        expect(await Qualifications.actions.getSkillName(skillsInTable[0]).isPresent()).toBeTruthy();
        expect(await Qualifications.actions.getSkillName(skillsInTable[1]).isPresent()).toBeTruthy();
        expect(await Qualifications.actions.getSkillName(skillsInTable[3]).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Should not assign a skill as guid and discard the draft', async () => {
        await CommonPageElements.objectPage.elements.editButton.click();
        await CudOperations.actions.create('skills');
        await Qualifications.actions.navigateToQualifications();
        await CudOperations.actions.fillEmptyInputBox('skills', 'b08aabdf-6dcb-4df7-b319-b440f073e6dc');
        await Qualifications.qualifications.elements.tableTitle.click();
        expect(await CommonPageElements.actions.getMessageButtonState('Negative').asControl().getProperty('text')).toBe('1');
        const errorMessageControl = await CommonPageElements.actions.getMessageErrorLink('Select an existing skill from the value help.').isPresent();
        if (!errorMessageControl) {
            await CommonPageElements.objectPage.elements.footer.messageButton.click();
            expect(await CommonPageElements.actions.getMessageErrorLink('Select an existing skill from the value help.').isPresent()).toBeTruthy();
        }
        expect(await CommonPageElements.actions.getMessageErrorLink('Select an existing skill from the value help.').isPresent()).toBeTruthy();
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        expect(await CommonPageElements.actions.getMessageButtonState('Negative').asControl().getProperty('text')).toBe('1');
        const errorMessageControl1 = await CommonPageElements.actions.getMessageErrorLink('Select an existing skill from the value help.').isPresent();
        if (!errorMessageControl1) {
            await CommonPageElements.objectPage.elements.footer.messageButton.click();
            expect(await CommonPageElements.actions.getMessageErrorLink('Select an existing skill from the value help.').isPresent()).toBeTruthy();
        }
        await CommonPageElements.objectPage.elements.footer.cancelButton.click();
        await CommonPageElements.objectPage.elements.footer.discardButton.click();
        const skillTitleText = await Qualifications.qualifications.elements.tableTitle.getText();
        expect(skillTitleText.substring(0, 6)).toBe('Skills');
        const regexp = new RegExp('([3-9])|([1-9][0-9])');
        expect(regexp.test(skillTitleText.substring(7))).toBeTruthy();
        expect(await Qualifications.actions.getSkillName(skillsInTable[0]).isPresent()).toBeTruthy();
        expect(await Qualifications.actions.getSkillName(skillsInTable[1]).isPresent()).toBeTruthy();
        expect(await Qualifications.actions.getSkillName(skillsInTable[3]).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Should not assign a skill as more than guid length char and discard the draft', async () => {
        CommonPageElements.objectPage.elements.editButton.click();
        await CudOperations.actions.create('skills');
        await Qualifications.actions.navigateToQualifications();
        await CudOperations.actions.fillEmptyInputBox('skills', 'b08aabdf-6dcb-4df7-b319-b440f073e6dccsdavfas');
        await Qualifications.qualifications.elements.tableTitle.click();
        expect(await CommonPageElements.actions.getMessageButtonState('Negative').asControl().getProperty('text')).toBe('1');
        await CommonPageElements.objectPage.elements.footer.messageButton.click();
        expect(await CommonPageElements.actions.getMessageErrorLink('Select an existing skill from the value help.').isPresent()).toBeTruthy();
        await CommonPageElements.objectPage.elements.footer.cancelButton.click();
        await CommonPageElements.objectPage.elements.footer.discardButton.click();
        const skillTitleText = await Qualifications.qualifications.elements.tableTitle.getText();
        expect(skillTitleText.substring(0, 6)).toBe('Skills');
        const regexp = new RegExp('([3-9])|([1-9][0-9])');
        expect(regexp.test(skillTitleText.substring(7))).toBeTruthy();
        expect(await Qualifications.actions.getSkillName(skillsInTable[0]).isPresent()).toBeTruthy();
        expect(await Qualifications.actions.getSkillName(skillsInTable[1]).isPresent()).toBeTruthy();
        expect(await Qualifications.actions.getSkillName(skillsInTable[3]).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Should add a new skill by entering skill name in the input field', async () => {
        await CommonPageElements.objectPage.elements.editButton.click();
        await CudOperations.actions.create('skills');
        await CudOperations.actions.fillEmptyInputBox('skills', skillsInTable[2]);
        await Qualifications.qualifications.elements.tableTitle.click();
        await CudOperations.actions.clickDropdownBySiblingValue('skills', skillsInTable[2], 'proficiencyLevel_ID', 'MyResourceObjectPage');
        await CudOperations.actions.selectFromDropdown(proficiencyLevelNames[0]);
        await Qualifications.qualifications.elements.tableTitle.click();
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        const skillTitleText = await Qualifications.qualifications.elements.tableTitle.getText();
        expect(skillTitleText.substring(0, 6)).toBe('Skills');
        const regexp = new RegExp('([4-9])|([1-9][0-9])');
        expect(regexp.test(skillTitleText.substring(7))).toBeTruthy();
        expect(await Qualifications.actions.getSkillName(skillsInTable[0]).isPresent()).toBeTruthy();
        expect(await Qualifications.actions.getSkillName(skillsInTable[1]).isPresent()).toBeTruthy();
        expect(await Qualifications.actions.getSkillName(skillsInTable[2]).isPresent()).toBeTruthy();
        expect(await Qualifications.actions.getSkillName(skillsInTable[3]).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Should delete many skills', async () => {
        await CommonPageElements.objectPage.elements.editButton.click();
        await BasicDataPage.parentElements.consultantHeaders.collapseButton.click();
        await CudOperations.actions.deleteMany('skills', 2, [skillsInTable[2], skillsInTable[3]]);
        const skillTitleText = await Qualifications.qualifications.elements.tableTitle.getText();
        expect(skillTitleText.substring(0, 6)).toBe('Skills');
        const regexp = new RegExp('([2-9])|([1-9][0-9])');
        expect(regexp.test(skillTitleText.substring(7))).toBeTruthy();
        await CommonPageElements.objectPage.elements.footer.clickSaveButton.click();
        expect(await Qualifications.actions.getSkillName(skillsInTable[0]).isPresent()).toBeTruthy();
        expect(await Qualifications.actions.getSkillName(skillsInTable[1]).isPresent()).toBeTruthy();
        expect(await Qualifications.actions.getSkillName(skillsInTable[2]).isPresent()).toBeFalsy();
    });
    testHelper.failEarlyIt('Should change proficiency level of one skill', async () => {
        await CommonPageElements.objectPage.elements.editButton.click();
        await Qualifications.qualifications.elements.tableTitle.click();
        await CudOperations.actions.clickDropdownBySiblingValue('skills', skillsInTable[1], 'proficiencyLevel_ID', 'MyResourceObjectPage');
        await CudOperations.actions.selectFromDropdown(proficiencyLevelNames[1]);
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        expect(Qualifications.actions.getProficiencyLevelName(proficiencyLevelNames[1]).isPresent()).toBeTruthy();
    });
    testHelper.failEarlyIt('Should not change proficiency level to default proficiency level', async () => {
        CommonPageElements.objectPage.elements.editButton.click();
        await CudOperations.actions.changeValueInTable('MyResourceObjectPage', 'skills', proficiencyLevelNames[1], 'Not Set');
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        const errorMessageControl = await CommonPageElements.actions.getMessageErrorLink('Value "Not Set" does not exist.').isPresent();
        if (!errorMessageControl) {
            await CommonPageElements.objectPage.elements.footer.messageButton.click();
            expect(await CommonPageElements.actions.getMessageErrorLink('Value "Not Set" does not exist.').isPresent()).toBeTruthy('Message link is not present');
        }
        const numberOferrorsinString = await CommonPageElements.actions.getMessageButtonState('Negative').asControl().getProperty('text');
        const numberOferrors = Number(numberOferrorsinString);
        expect(numberOferrors).toBeGreaterThan(0);
        expect(await CommonPageElements.actions.getMessageErrorLink('Value "Not Set" does not exist.').isPresent()).toBeTruthy('Message link is not present');
        await CommonPageElements.objectPage.elements.footer.cancelButton.click();
        await CommonPageElements.objectPage.elements.footer.discardButton.click();
        expect(await Qualifications.actions.getProficiencyLevelName(proficiencyLevelNames[1]).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Should not change proficiency level to invalid proficiency level from another proficiency set', async () => {
        CommonPageElements.objectPage.elements.editButton.click();
        await CudOperations.actions.changeValueInTable('MyResourceObjectPage', 'skills', proficiencyLevelNames[1], proficiencyLevelNames[3]);
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        const errorMessageControl = await CommonPageElements.actions.getMessageErrorLink(`Value "${proficiencyLevelNames[3]}" does not exist.`).isPresent();
        if (!errorMessageControl) {
            await CommonPageElements.objectPage.elements.footer.messageButton.click();
            expect(await CommonPageElements.actions.getMessageErrorLink(`Value "${proficiencyLevelNames[3]}" does not exist.`).isPresent()).toBeTruthy();
        }
        const numberOferrorsinString = await CommonPageElements.actions.getMessageButtonState('Negative').asControl().getProperty('text');
        const numberOferrors = Number(numberOferrorsinString);
        expect(numberOferrors).toBeGreaterThan(0);
        expect(await CommonPageElements.actions.getMessageErrorLink(`Value "${proficiencyLevelNames[3]}" does not exist.`).isPresent()).toBeTruthy();
        await CommonPageElements.objectPage.elements.footer.cancelButton.click();
        await CommonPageElements.objectPage.elements.footer.discardButton.click();
        expect(await Qualifications.actions.getProficiencyLevelName(proficiencyLevelNames[1]).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Should not change proficiency level to empty value', async () => {
        await CommonPageElements.objectPage.elements.editButton.click();
        await CudOperations.actions.changeValueInTable('MyResourceObjectPage', 'skills', proficiencyLevelNames[1], '');
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        const errorMessageControl = await CommonPageElements.actions.getMessageErrorLink('Enter an existing proficiency level.').isPresent();
        if (!errorMessageControl) {
            await CommonPageElements.objectPage.elements.footer.messageButton.click();
            expect(await CommonPageElements.actions.getMessageErrorLink('Enter an existing proficiency level.').isPresent()).toBeTruthy();
        }
        const numberOferrorsinString = await CommonPageElements.actions.getMessageButtonState('Negative').asControl().getProperty('text');
        const numberOferrors = Number(numberOferrorsinString);
        expect(numberOferrors).toBeGreaterThan(0);
        expect(await CommonPageElements.actions.getMessageErrorLink('Enter an existing proficiency level.').isPresent()).toBeTruthy();
        await CommonPageElements.objectPage.elements.footer.cancelButton.click();
        await CommonPageElements.objectPage.elements.footer.discardButton.click();
        expect(await Qualifications.actions.getProficiencyLevelName(proficiencyLevelNames[1]).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Check Availability', async () => {
        await Availability.actions.navigateToAvailability();
        Availability.assertions.checkTableTitle('Monthly Availability (6)');
        const currentMonthYear = new Date();
        currentMonthYear.setDate(1);
        const currentPlusOneMonthYear = new Date(currentMonthYear);
        currentPlusOneMonthYear.setMonth(currentPlusOneMonthYear.getMonth() + 1);
        const currentPlusTwoMonthYear = new Date(currentPlusOneMonthYear);
        currentPlusTwoMonthYear.setMonth(currentPlusTwoMonthYear.getMonth() + 1);
        const currentPlusThreeMonthYear = new Date(currentPlusTwoMonthYear);
        currentPlusThreeMonthYear.setMonth(currentPlusThreeMonthYear.getMonth() + 1);
        const currentPlusFourMonthYear = new Date(currentPlusThreeMonthYear);
        currentPlusFourMonthYear.setMonth(currentPlusFourMonthYear.getMonth() + 1);
        const currentPlusFiveMonthYear = new Date(currentPlusFourMonthYear);
        currentPlusFiveMonthYear.setMonth(currentPlusFiveMonthYear.getMonth() + 1);
        Availability.assertions.checkAvailabilityData(0, `${getMonthName(currentMonthYear.getMonth())}, ${currentMonthYear.getFullYear()}`, '40', '0', '40', '0');
        Availability.assertions.checkAvailabilityData(1, `${getMonthName(currentPlusOneMonthYear.getMonth())}, ${currentPlusOneMonthYear.getFullYear()}`, '40', '0', '40', '0');
        Availability.assertions.checkAvailabilityData(2, `${getMonthName(currentPlusTwoMonthYear.getMonth())}, ${currentPlusTwoMonthYear.getFullYear()}`, '40', '0', '40', '0');
        Availability.assertions.checkAvailabilityData(3, `${getMonthName(currentPlusThreeMonthYear.getMonth())}, ${currentPlusThreeMonthYear.getFullYear()}`, '40', '0', '40', '0');
        Availability.assertions.checkAvailabilityData(4, `${getMonthName(currentPlusFourMonthYear.getMonth())}, ${currentPlusFourMonthYear.getFullYear()}`, '40', '0', '40', '0');
        Availability.assertions.checkAvailabilityData(5, `${getMonthName(currentPlusFiveMonthYear.getMonth())}, ${currentPlusFiveMonthYear.getFullYear()}`, '40', '0', '40', '0');
    });

    testHelper.failEarlyIt('Check PriorExperience: Roles', async () => {
        PriorExperienceRole.actions.navigateToPriorExperienceRoles();
        const RoleTitleText = await PriorExperienceRole.priorExperience.elements.tableTitle.getText();
        expect(RoleTitleText.substring(0, 13)).toBe('Project Roles');
        const regexp = new RegExp('([3-9])|([1-9][0-9])');
        expect(regexp.test(RoleTitleText.substring(6))).toBeTruthy();
        PriorExperienceRole.assertions.checkRoleName(roles[0]);
        PriorExperienceRole.assertions.checkRoleName(roles[2]);
        PriorExperienceRole.assertions.checkRoleName(roles[4]);
    });

    testHelper.failEarlyIt('Check the role popover', async () => {
        await PriorExperienceRole.actions.clickOnARole(roles[0]);
        expect(PriorExperienceRole.parentElements.rolePopover.rolecodeLabel.isPresent()).toBeTruthy();
        expect(PriorExperienceRole.parentElements.rolePopover.rolecodeValue(projectRoles[0].code).isPresent()).toBeTruthy();
        expect(PriorExperienceRole.parentElements.rolePopover.descriptionLabel.isPresent()).toBeTruthy();
        expect(PriorExperienceRole.parentElements.rolePopover.descriptionValue(projectRoles[0].description).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Check roles value help', async () => {
        CommonPageElements.objectPage.elements.editButton.click();
        PriorExperienceRole.actions.navigateToPriorExperienceRoles();
        await CudOperations.actions.openValueHelp('roles', 1);
        await PriorExperienceRole.priorExperience.elements.roleValueHelpShowFiltersBtn.click();
        await PriorExperienceRole.priorExperience.elements.valueHelpSearchInput.sendKeys(testRunId);
        await PriorExperienceRole.priorExperience.elements.valueHelpSearchPress.click();
        expect(await PriorExperienceRole.actions.checkRoleValueHelpTableData(projectRoles[0].name));
        expect(await PriorExperienceRole.actions.checkRoleValueHelpTableData(projectRoles[1].name));
        expect(await PriorExperienceRole.actions.checkRoleValueHelpTableData(projectRoles[2].name));
        expect(await PriorExperienceRole.actions.checkRoleValueHelpTableData(projectRoles[3].name));
    });

    testHelper.failEarlyIt('Should not display restricted role in value help', async () => {
        PriorExperienceRole.priorExperience.elements.valueHelpCancelButton.click();
        await PriorExperienceRole.actions.navigateToPriorExperience();
        expect(await PriorExperienceRole.actions.searchValueInValueHelp('roles', roles[4])).toBe(0);
        PriorExperienceRole.priorExperience.elements.valueHelpCancelButton.click();
        await CommonPageElements.objectPage.elements.footer.cancelButton.click();
    });

    testHelper.failEarlyIt('Should display a restricted role in role table and delete the same', async () => {
        CommonPageElements.objectPage.elements.editButton.click();
        PriorExperienceRole.actions.navigateToPriorExperience();
        // Delete
        await CudOperations.actions.delete('roles', roles[4]);
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
    });

    testHelper.failEarlyIt('Should create a new role and check the roles table for the same', async () => {
        CommonPageElements.objectPage.elements.editButton.click();
        PriorExperienceRole.actions.navigateToPriorExperience();
        await CudOperations.actions.create('roles');
        PriorExperienceRole.actions.navigateToPriorExperience();
        await CudOperations.actions.fillEmptyInputBox('roles', roles[1]);
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        const RoleTitleText = await PriorExperienceRole.priorExperience.elements.tableTitle.getText();
        expect(RoleTitleText.substring(0, 13)).toBe('Project Roles');
        const regexp = new RegExp('([3-9])|([1-9][0-9])');
        expect(regexp.test(RoleTitleText.substring(6))).toBeTruthy();
        expect(PriorExperienceRole.actions.getRoleName(roles[0]).isPresent()).toBeTruthy();
        expect(PriorExperienceRole.actions.getRoleName(roles[1]).isPresent()).toBeTruthy();
        expect(PriorExperienceRole.actions.getRoleName(roles[2]).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Should update the existing role to a new one', async () => {
        CommonPageElements.objectPage.elements.editButton.click();
        PriorExperienceRole.actions.navigateToPriorExperience();
        await CudOperations.actions.changeValueOfTheRow('roles', roles[2], roles[3]);
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        const RoleTitleText = await PriorExperienceRole.priorExperience.elements.tableTitle.getText();
        expect(RoleTitleText.substring(0, 13)).toBe('Project Roles');
        const regexp = new RegExp('([3-9])|([1-9][0-9])');
        expect(regexp.test(RoleTitleText.substring(6))).toBeTruthy();
        expect(PriorExperienceRole.actions.getRoleName(roles[0]).isPresent()).toBeTruthy();
        expect(PriorExperienceRole.actions.getRoleName(roles[1]).isPresent()).toBeTruthy();
        expect(PriorExperienceRole.actions.getRoleName(roles[3]).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Should delete a role and check the roles table for the same', async () => {
        CommonPageElements.objectPage.elements.editButton.click();
        PriorExperienceRole.actions.navigateToPriorExperience();
        await CudOperations.actions.delete('roles', roles[3]);
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        const RoleTitleText = await PriorExperienceRole.priorExperience.elements.tableTitle.getText();
        expect(RoleTitleText.substring(0, 13)).toBe('Project Roles');
        const regexp = new RegExp('([2-9])|([1-9][0-9])');
        expect(regexp.test(RoleTitleText.substring(6))).toBeTruthy();
        expect(PriorExperienceRole.actions.getRoleName(roles[3]).isPresent()).toBeFalsy();
    });

    testHelper.failEarlyIt('Should not assign an duplicate/random/empty role and delete a role in draft saved state', async () => {
        CommonPageElements.objectPage.elements.editButton.click();
        PriorExperienceRole.actions.navigateToPriorExperience();
        await CudOperations.actions.create('roles');
        await CudOperations.actions.fillEmptyInputBox('roles', roles[0]);
        await CudOperations.actions.create('roles');
        await CudOperations.actions.fillEmptyInputBox('roles', 'randomRole');
        await CudOperations.actions.create('roles');
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        expect(await CommonPageElements.actions.getMessageButtonState('Negative').asControl().getProperty('text')).toBe('3');
        expect(await CommonPageElements.actions.getMessageErrorList('Delete the duplicate role.').isPresent()).toBeTruthy();
        expect(await CommonPageElements.actions.getMessageErrorList('Select an existing role from the value help.').isPresent()).toBeTruthy();
        expect(await CommonPageElements.actions.getMessageErrorList('Select a role or delete the line.').isPresent()).toBeTruthy();
        await CommonPageElements.objectPage.elements.footer.messageButton.click();
        await CudOperations.actions.delete('roles', '');
        let RoleTitleText = await PriorExperienceRole.priorExperience.elements.tableTitle.getText();
        expect(RoleTitleText.substring(0, 13)).toBe('Project Roles');
        let regexp = new RegExp('([4-9])|([1-9][0-9])');
        expect(regexp.test(RoleTitleText.substring(6))).toBeTruthy();
        await CommonPageElements.objectPage.elements.footer.cancelButton.click();
        await CommonPageElements.objectPage.elements.footer.discardButton.click();
        PriorExperienceRole.actions.navigateToPriorExperience();
        RoleTitleText = await PriorExperienceRole.priorExperience.elements.tableTitle.getText();
        expect(RoleTitleText.substring(0, 13)).toBe('Project Roles');
        regexp = new RegExp('([2-9])|([1-9][0-9])');
        expect(regexp.test(RoleTitleText.substring(6))).toBeTruthy();
        expect(PriorExperienceRole.actions.getRoleName(roles[0]).isPresent()).toBeTruthy();
        expect(PriorExperienceRole.actions.getRoleName(roles[1]).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Should not assign a role as guid and check the roles table for the same', async () => {
        CommonPageElements.objectPage.elements.editButton.click();
        PriorExperienceRole.actions.navigateToPriorExperience();
        await CudOperations.actions.create('roles');
        await CudOperations.actions.fillEmptyInputBox('roles', 'b08aabdf-6dcb-4df7-b319-b440f073e6dc');
        await PriorExperienceRole.priorExperience.elements.tableTitle.click();
        let RoleTitleText = await PriorExperienceRole.priorExperience.elements.tableTitle.getText();
        expect(RoleTitleText.substring(0, 13)).toBe('Project Roles');
        let regexp = new RegExp('([3-9])|([1-9][0-9])');
        expect(regexp.test(RoleTitleText.substring(6))).toBeTruthy();
        await PriorExperienceRole.priorExperience.elements.tableTitle.click();
        const errorMessageControl = await CommonPageElements.actions.getMessageErrorLink('Select an existing role from the value help.').isPresent();
        if (!errorMessageControl) {
            await CommonPageElements.objectPage.elements.footer.messageButton.click();
            expect(await CommonPageElements.actions.getMessageErrorLink('Select an existing role from the value help.').isPresent()).toBeTruthy();
        }
        expect(await CommonPageElements.actions.getMessageButtonState('Negative').asControl().getProperty('text')).toBe('1');
        expect(await CommonPageElements.actions.getMessageErrorLink('Select an existing role from the value help.').isPresent()).toBeTruthy();
        await CommonPageElements.objectPage.elements.footer.cancelButton.click();
        await CommonPageElements.objectPage.elements.footer.discardButton.click();
        PriorExperienceRole.actions.navigateToPriorExperience();
        RoleTitleText = await PriorExperienceRole.priorExperience.elements.tableTitle.getText();
        expect(RoleTitleText.substring(0, 13)).toBe('Project Roles');
        regexp = new RegExp('([2-9])|([1-9][0-9])');
        expect(regexp.test(RoleTitleText.substring(6))).toBeTruthy();
        expect(PriorExperienceRole.actions.getRoleName(roles[0]).isPresent()).toBeTruthy();
        expect(PriorExperienceRole.actions.getRoleName(roles[1]).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Should not assign a role as more than guid length and check the roles table for the same', async () => {
        CommonPageElements.objectPage.elements.editButton.click();
        PriorExperienceRole.actions.navigateToPriorExperience();
        await CudOperations.actions.create('roles');
        await CudOperations.actions.fillEmptyInputBox('roles', 'b08aabdf-6dcb-4df7-b319-b440f073e6dcaswdvc');
        PriorExperienceRole.priorExperience.elements.tableTitle.click();
        expect(await CommonPageElements.actions.getMessageButtonState('Negative').asControl().getProperty('text')).toBe('1');
        const errorMessageControlErr = await CommonPageElements.actions.getMessageErrorLink('Select an existing role from the value help.').isPresent();
        if (!errorMessageControlErr) {
            await CommonPageElements.objectPage.elements.footer.messageButton.click();
            expect(await CommonPageElements.actions.getMessageErrorLink('Select an existing role from the value help.').isPresent()).toBeTruthy();
        }
        expect(await CommonPageElements.actions.getMessageErrorLink('Select an existing role from the value help.').isPresent()).toBeTruthy();
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        const errorMessageControl = await CommonPageElements.actions.getMessageErrorLink('Select an existing role from the value help.').isPresent();
        if (!errorMessageControl) {
            await CommonPageElements.objectPage.elements.footer.messageButton.click();
            expect(await CommonPageElements.actions.getMessageErrorLink('Select an existing role from the value help.').isPresent()).toBeTruthy();
        }
        expect(await CommonPageElements.actions.getMessageButtonState('Negative').asControl().getProperty('text')).toBe('1');
        expect(await CommonPageElements.actions.getMessageErrorLink('Select an existing role from the value help.').isPresent()).toBeTruthy();
        await CommonPageElements.objectPage.elements.footer.cancelButton.click();
        await CommonPageElements.objectPage.elements.footer.discardButton.click();
        PriorExperienceRole.actions.navigateToPriorExperience();
        const RoleTitleText = await PriorExperienceRole.priorExperience.elements.tableTitle.getText();
        expect(RoleTitleText.substring(0, 13)).toBe('Project Roles');
        const regexp = new RegExp('([2-9])|([1-9][0-9])');
        expect(regexp.test(RoleTitleText.substring(6))).toBeTruthy();
        expect(PriorExperienceRole.actions.getRoleName(roles[0]).isPresent()).toBeTruthy();
        expect(PriorExperienceRole.actions.getRoleName(roles[1]).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Should add a new role by entering role name in the input field', async () => {
        CommonPageElements.objectPage.elements.editButton.click();
        PriorExperienceRole.actions.navigateToPriorExperience();
        await CudOperations.actions.create('roles');
        await CudOperations.actions.fillEmptyInputBox('roles', roles[2]);
        PriorExperienceRole.actions.navigateToPriorExperience();
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        PriorExperienceRole.actions.navigateToPriorExperience();
        const RoleTitleText = await PriorExperienceRole.priorExperience.elements.tableTitle.getText();
        expect(RoleTitleText.substring(0, 13)).toBe('Project Roles');
        const regexp = new RegExp('([3-9])|([1-9][0-9])');
        expect(regexp.test(RoleTitleText.substring(6))).toBeTruthy();
        expect(PriorExperienceRole.actions.getRoleName(roles[0]).isPresent()).toBeTruthy();
        expect(PriorExperienceRole.actions.getRoleName(roles[1]).isPresent()).toBeTruthy();
        expect(PriorExperienceRole.actions.getRoleName(roles[2]).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Should delete many roles', async () => {
        CommonPageElements.objectPage.elements.editButton.click();
        PriorExperienceRole.actions.navigateToPriorExperience();
        await CudOperations.actions.deleteMany('roles', 2, [roles[0], roles[2]]);
        const RoleTitleText = await PriorExperienceRole.priorExperience.elements.tableTitle.getText();
        expect(RoleTitleText.substring(0, 13)).toBe('Project Roles');
        const regexp = new RegExp('([1-9])|([1-9][0-9])');
        expect(regexp.test(RoleTitleText.substring(6))).toBeTruthy();
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        expect(PriorExperienceRole.actions.getRoleName(roles[0]).isPresent()).toBeFalsy();
        expect(PriorExperienceRole.actions.getRoleName(roles[2]).isPresent()).toBeFalsy();
        expect(PriorExperienceRole.actions.getRoleName(roles[1]).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Should navigate to Internal Work Experience and check table data', async () => {
        await InternalWorkExperience.actions.navigateToProjectHistory('Internal Work Experience');

        const now = new Date(Date.now());
        const currentMonthStart = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
        const nowPlusOneMonthStart = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 1));
        const nowPlusTwoMonthsStart = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 2, 1));
        const startDate = currentMonthStart.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        const endDate = nowPlusOneMonthStart.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        const endDate2 = nowPlusTwoMonthsStart.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        expect(InternalWorkExperience.parentElements.assignmentsTableTitle('internalWorkExperience').getText()).toBe('Assignments (2)');
        MyResourcesCommonAssertion.elements.iExecuteShowDetails.click();
        await InternalWorkExperience.assertions.checkInternalExperienceTableData(0, 'Concept and Design', resourceRequestData[1].displayId, roles[1], resourceOrganizations[1].name, 'iTelO MR', endDate, endDate2, 'Hard-Booked');
        await InternalWorkExperience.assertions.checkInternalExperienceTableData(1, 'Design', resourceRequestData[0].displayId, roles[0], resourceOrganizations[0].name, 'John & Smith Co MR', startDate, endDate, 'Soft-Booked');
        MyResourcesCommonAssertion.elements.iExecuteHideDetails.click();
    });

    testHelper.failEarlyIt('Should select workItem from Internal Work Experience personalizaton dialog and check table data', async () => {
        expect(InternalWorkExperience.parentElements.assignmentsTableTitle('internalWorkExperience').getText()).toBe('Assignments (2)');
        const now = new Date(Date.now());
        const currentMonthStart = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
        const nowPlusOneMonthStart = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 1));
        const nowPlusTwoMonthsStart = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 2, 1));
        const startDate = currentMonthStart.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        const endDate = nowPlusOneMonthStart.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        const endDate2 = nowPlusTwoMonthsStart.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

        InternalWorkExperience.parentElements.settingsButton('internalWorkExperience').click();
        InternalWorkExperience.parentElements.workItemOption.click();
        InternalWorkExperience.parentElements.settingsOkButton.click();
        MyResourcesCommonAssertion.elements.iExecuteShowDetails.click();
        await InternalWorkExperience.assertions.checkInternalExperienceTableData(0, 'Concept and Design', resourceRequestData[1].displayId, roles[1], resourceOrganizations[1].name, 'iTelO MR', endDate, endDate2, 'Hard-Booked', 'workItem2');
        await InternalWorkExperience.assertions.checkInternalExperienceTableData(1, 'Design', resourceRequestData[0].displayId, roles[0], resourceOrganizations[0].name, 'John & Smith Co MR', startDate, endDate, 'Soft-Booked', 'workItem1');
        MyResourcesCommonAssertion.elements.iExecuteHideDetails.click();
    });

    testHelper.failEarlyIt('Should navigate to internal work experience project details and check general information data', async () => {
        await CommonPageElements.objectPage.elements.editButton.click();
        await InternalWorkExperience.actions.navigateToProjectHistory('Internal Work Experience');
        await InternalWorkExperience.actions.navigateToRequestName('Design');
        await InternalWorkExperience.parentElements.buttonInAnchorBar('InternalWorkExperience', 'GeneralInformation').click();
        const now = new Date(Date.now());
        const currentMonthStart = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
        const nowPlusOneMonthStart = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 1));
        const startDate = currentMonthStart.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        const endDate = nowPlusOneMonthStart.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        expect(InternalWorkExperience.parentElements.titleIntExp('Design', 'InternalWorkExperience').isPresent()).toBeTruthy();
        InternalWorkExperience.assertions.checkIntWorkExpFieldValue('requestDisplayId', resourceRequestData[0].displayId);
        InternalWorkExperience.assertions.checkIntWorkExpFieldValue('workItemName', 'workItem1');
        InternalWorkExperience.assertions.checkIntWorkExpFieldValue('customerName', 'John & Smith Co MR');
        InternalWorkExperience.assertions.checkIntWorkExpFieldValue('rolePlayed', roles[0]);
        InternalWorkExperience.assertions.checkIntWorkExpFieldValue('companyName', resourceOrganizations[0].name);
        InternalWorkExperience.assertions.checkIntWorkExpFieldValue('convertedAssignedCapacity', '40.00 hr');
        InternalWorkExperience.assertions.checkIntWorkExpFieldValue('startDate', startDate);
        InternalWorkExperience.assertions.checkIntWorkExpFieldValue('endDate', endDate);
        InternalWorkExperience.assertions.checkIntWorkExpFieldValue('assignmentStatus', 'Soft-Booked');
    });

    testHelper.failEarlyIt("Should navigate to Internal Work Experience assignment's skills section and check skill data with popover", async () => {
        await InternalWorkExperience.parentElements.buttonInAnchorBar('InternalWorkExperience', 'InternalWorkExperienceSkills').click();
        expect(InternalWorkExperience.parentElements.skillsTableTitle('InternalWorkExperience', 'internalWorkExperienceSkills').getText()).toBe('Skills (1)');
        expect(InternalWorkExperience.actions.getIntWorkExpSkillName('InternalWorkExperience', 'internalWorkExperienceSkills', skillsInTable[0]).isPresent()).toBe(true);
        expect(InternalWorkExperience.actions.getIntWorkExpProficiencyLevel('InternalWorkExperience', 'internalWorkExperienceSkills', proficiencyLevelNames[1]).isPresent()).toBe(true);
        await InternalWorkExperience.actions.clickOnASkill(skillsInTable[0]);
        expect(InternalWorkExperience.parentElements.skillPopover.descriptionLabel.isPresent()).toBeTruthy();
        expect(InternalWorkExperience.parentElements.skillPopover.descriptionValue(skills[0].description).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Should navigate to internal work experience project details and check skill count', async () => {
        await CommonPageElements.objectPage.elements.backButton.click();
        await InternalWorkExperience.actions.navigateToProjectHistory('Internal Work Experience');
        await InternalWorkExperience.actions.navigateToRequestName('Concept and Design');
        await InternalWorkExperience.parentElements.buttonInAnchorBar('InternalWorkExperience', 'InternalWorkExperienceSkills').click();
        expect(InternalWorkExperience.parentElements.skillsTableTitle('InternalWorkExperience', 'internalWorkExperienceSkills').getText()).toBe('Skills');
    });

    testHelper.failEarlyIt('Check availability and internal work experience data', async () => {
        await CommonPageElements.objectPage.elements.backButton.click();
        await InternalWorkExperience.actions.navigateToProjectHistory('Internal Work Experience');
        const now = new Date(Date.now());
        const currentMonthStart = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
        const nowPlusOneMonthStart = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 1));
        const startDate = currentMonthStart.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        const endDate = nowPlusOneMonthStart.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        await MyResourcesCommonAssertion.elements.iExecuteShowDetails.click();
        await InternalWorkExperience.assertions.checkInternalExperienceTableData(1, 'Design', resourceRequestData[0].displayId, roles[0], resourceOrganizations[0].name, 'John & Smith Co MR', startDate, endDate, 'Soft-Booked', 'workItem1');
        await MyResourcesCommonAssertion.elements.iExecuteHideDetails.click();
        Availability.actions.navigateToAvailability();
        const currentMonthYear = new Date();
        currentMonthYear.setDate(1);
        Availability.assertions.checkAvailabilityData(0, `${getMonthName(currentMonthYear.getMonth())}, ${currentMonthYear.getFullYear()}`, '40', '0', '40', '0');
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
    });

    testHelper.failEarlyIt('Should navigate to External Work Experience and check table data', async () => {
        await ExternalWorkExperience.actions.navigateToProjectHistory('External Work Experience');
        expect(ExternalWorkExperience.parentElements.assignmentsTableTitle('externalWorkExperience').getText()).toBe('Assignments (2)');
        ExternalWorkExperience.assertions.checkTableData('externalWorkExperience', 0, 'Internal Sales', 'Sales Consultant', 'IBM India', 'Internal', 'Feb 20, 2010', 'Oct 17, 2012');
        ExternalWorkExperience.assertions.checkTableData('externalWorkExperience', 1, 'Nike SD', 'ABAP Consultant', 'MAS', 'Nike Sports', 'Mar 26, 2009', 'Nov 20, 2013');
    });

    testHelper.failEarlyIt('Should navigate to External work experience project details and check general information data', async () => {
        await ExternalWorkExperience.actions.navigateToProjectName('ExternalWorkExperience', 'Internal Sales');
        await ExternalWorkExperience.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'GeneralInformation').click();
        expect(ExternalWorkExperience.parentElements.title('Internal Sales', 'ExternalWorkExperience').isPresent()).toBeTruthy();
        ExternalWorkExperience.assertions.checkExtWorkExpFieldValue('projectName', 'Internal Sales');
        ExternalWorkExperience.assertions.checkExtWorkExpFieldValue('customer', 'Internal');
        ExternalWorkExperience.assertions.checkExtWorkExpFieldValue('rolePlayed', 'Sales Consultant');
        ExternalWorkExperience.assertions.checkExtWorkExpFieldValue('companyName', 'IBM India');
        ExternalWorkExperience.assertions.checkExtWorkExpFieldValue('startDate', 'Feb 20, 2010');
        ExternalWorkExperience.assertions.checkExtWorkExpFieldValue('endDate', 'Oct 17, 2012');
    });

    testHelper.failEarlyIt("Should navigate to External Work Experience assignment's skills section and check skill data", async () => {
        await ExternalWorkExperience.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();
        expect(ExternalWorkExperience.parentElements.skillsTableTitle('ExternalWorkExperience', 'externalWorkExperienceSkills').getText()).toBe('Skills (1)');
        expect(ExternalWorkExperience.actions.getSkillName('ExternalWorkExperience', 'externalWorkExperienceSkills', skillsOnly[2]).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt("Should navigate to External Work Experience assignment's comments section and check the text", async () => {
        await ExternalWorkExperience.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'Comments').click();
        expect(ExternalWorkExperience.actions.getComment('ExternalWorkExperience', externalWorkExperiences[0].comments).isPresent()).toBeTruthy();
        CommonPageElements.objectPage.elements.backButton.click();
    });

    testHelper.failEarlyIt('Should assign a new skill in External Work Experience project details page and check its proficiency levels in the value help', async () => {
        CommonPageElements.objectPage.elements.editButton.click();
        await ExternalWorkExperience.actions.navigateToProjectHistory('External Work Experience');
        await ExternalWorkExperience.actions.navigateToProjectNameInEditMode('ExternalWorkExperience', 'Internal Sales');
        await ExternalWorkExperience.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();
        await CudOperations.actions.createSkillRow();
        await ExternalWorkExperience.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();
        await CudOperations.actions.assignSkill('', skillsOnly[0]);
        await ExternalWorkExperience.parentElements.skillsTableTitle('ExternalWorkExperience', 'externalWorkExperienceSkills').click();
        await CudOperations.actions.clickDropdownBySiblingValue('externalWorkExperienceSkills', skillsOnly[0], 'proficiencyLevel_ID', 'ExternalWorkExperienceObjectPage');
        await ExternalWorkExperience.assertions.checkProficiencyLevelValueHelpTableData(0, proficiencyLevels[0].name, proficiencyLevels[0].description);
        await ExternalWorkExperience.assertions.checkProficiencyLevelValueHelpTableData(0, proficiencyLevels[0].name, proficiencyLevels[0].description);
    });

    testHelper.failEarlyIt('Should select a proficiency in External Work Experience project details page, save the skill and check the skills table for the same', async () => {
        await CudOperations.actions.selectFromDropdown(proficiencyLevelNames[0]);
        await CommonPageElements.objectPage.elements.footer.applyButton.click();
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        await ExternalWorkExperience.actions.navigateToProjectHistory('External Work Experience');
        await ExternalWorkExperience.actions.navigateToProjectName('ExternalWorkExperience', 'Internal Sales');
        await ExternalWorkExperience.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();
        expect(ExternalWorkExperience.actions.getSkillValues('ExternalWorkExperience', 'externalWorkExperienceSkills').count()).toBeGreaterThan(1);
        expect(ExternalWorkExperience.actions.getSkillName('ExternalWorkExperience', 'externalWorkExperienceSkills', skillsOnly[0]).isPresent()).toBeTruthy();
        expect(ExternalWorkExperience.actions.getProficiencyLevelName('ExternalWorkExperience', 'externalWorkExperienceSkills', proficiencyLevels[0].name).isPresent()).toBeTruthy();
        expect(ExternalWorkExperience.actions.getSkillName('ExternalWorkExperience', 'externalWorkExperienceSkills', skillsOnly[2]).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Should not assign an empty/random/duplicate skill in External Work Experience project and discard the change', async () => {
        CommonPageElements.objectPage.elements.backButton.click();
        CommonPageElements.objectPage.elements.editButton.click();
        await ExternalWorkExperience.actions.navigateToProjectHistory('External Work Experience');
        await ExternalWorkExperience.actions.navigateToProjectNameInEditMode('ExternalWorkExperience', 'Internal Sales');
        await ExternalWorkExperience.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();
        await CudOperations.actions.createSkillRow();
        await CudOperations.actions.fillEmptyInputSubPage('randomSkill99');
        await CudOperations.actions.createSkillRow();
        await CudOperations.actions.fillEmptyInputSubPage(skillsOnly[0]);
        await CudOperations.actions.createSkillRow();
        await CudOperations.actions.fillEmptyInputSubPage('');
        await CommonPageElements.objectPage.elements.footer.applyButton.click();
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        expect(await CommonPageElements.actions.getMessageButtonState('Negative').asControl().getProperty('text')).toBe('5');
        expect(await CommonPageElements.actions.getMessageErrorList('Enter an existing proficiency level.').isPresent()).toBeTruthy();
        expect(await CommonPageElements.actions.getMessageErrorList('There is an empty line in the Skills section of the project "Internal Sales". Select a skill or delete the line.').isPresent()).toBe(true, 'There is an empty line in the Skills section of the project "Internal Sales". Select a skill or delete the line.');
        expect(await CommonPageElements.actions.getMessageErrorList('A skill has been entered in the project "Internal Sales" that does not exist in the database. Select an existing skill from the value help.').isPresent()).toBeTruthy();
        expect(await CommonPageElements.actions.getMessageErrorList(`The skill "${skillsOnly[0]}" has already been added in the project "Internal Sales". Delete the duplicate skill.`).isPresent()).toBeTruthy();
        await CommonPageElements.objectPage.elements.footer.cancelButton.click();
        await CommonPageElements.objectPage.elements.footer.discardButton.click();
    });

    testHelper.failEarlyIt('Should not assign a skill as guid in External Work Experience project and discard the change', async () => {
        CommonPageElements.objectPage.elements.editButton.click();
        await ExternalWorkExperience.actions.navigateToProjectHistory('External Work Experience');
        await ExternalWorkExperience.actions.navigateToProjectNameInEditMode('ExternalWorkExperience', 'Internal Sales');
        await ExternalWorkExperience.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();
        await CudOperations.actions.createSkillRow();
        await CudOperations.actions.fillEmptyInputSubPage('b08aabdf-6dcb-4df7-b319-b440f073e6dc');
        await CommonPageElements.objectPage.elements.footer.applyButton.click();
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        expect(await CommonPageElements.actions.getMessageButtonState('Negative').asControl().getProperty('text')).toBe('2');
        expect(await CommonPageElements.actions.getMessageErrorList('Enter an existing proficiency level.').isPresent()).toBeTruthy();
        expect(await CommonPageElements.actions.getMessageErrorList('A skill has been entered in the project "Internal Sales" that does not exist in the database. Select an existing skill from the value help.').isPresent()).toBeTruthy();
        await CommonPageElements.objectPage.elements.footer.cancelButton.click();
        await CommonPageElements.objectPage.elements.footer.discardButton.click();
    });

    testHelper.failEarlyIt('Should update existing skill in External Work Experience project details page', async () => {
        CommonPageElements.objectPage.elements.editButton.click();
        await ExternalWorkExperience.actions.navigateToProjectHistory('External Work Experience');
        await ExternalWorkExperience.actions.navigateToProjectNameInEditMode('ExternalWorkExperience', 'Internal Sales');
        await ExternalWorkExperience.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();
        await CudOperations.actions.assignSkill(skillsOnly[0], skillsOnly[1]);
        await ExternalWorkExperience.parentElements.skillsTableTitle('ExternalWorkExperience', 'externalWorkExperienceSkills').click();
        await CudOperations.actions.clickDropdownBySiblingValue('externalWorkExperienceSkills', skillsOnly[1], 'proficiencyLevel_ID', 'ExternalWorkExperienceObjectPage');
        await CudOperations.actions.selectFromDropdown(proficiencyLevelTexts[0].name);
        await CommonPageElements.objectPage.elements.footer.applyButton.click();
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        await ExternalWorkExperience.actions.navigateToProjectHistory('External Work Experience');
        await ExternalWorkExperience.actions.navigateToProjectName('ExternalWorkExperience', 'Internal Sales');
        await ExternalWorkExperience.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();
        expect(ExternalWorkExperience.actions.getSkillValues('ExternalWorkExperience', 'externalWorkExperienceSkills').count()).toBeGreaterThan(1);
        expect(ExternalWorkExperience.actions.getSkillName('ExternalWorkExperience', 'externalWorkExperienceSkills', skillsOnly[1]).isPresent()).toBeTruthy();
        expect(ExternalWorkExperience.actions.getSkillName('ExternalWorkExperience', 'externalWorkExperienceSkills', skillsOnly[0]).isPresent()).toBeFalsy();
    });

    testHelper.failEarlyIt('Should delete existing skill in External Work Experience project details page', async () => {
        CommonPageElements.objectPage.elements.backButton.click();
        CommonPageElements.objectPage.elements.editButton.click();
        await ExternalWorkExperience.actions.navigateToProjectHistory('External Work Experience');
        await ExternalWorkExperience.actions.navigateToProjectNameInEditMode('ExternalWorkExperience', 'Internal Sales');
        await ExternalWorkExperience.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();
        await CudOperations.actions.deleteSkill(skillsOnly[1]);
        await CommonPageElements.objectPage.elements.footer.applyButton.click();
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        await ExternalWorkExperience.actions.navigateToProjectHistory('External Work Experience');
        await ExternalWorkExperience.actions.navigateToProjectName('ExternalWorkExperience', 'Internal Sales');
        await ExternalWorkExperience.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();
        expect(ExternalWorkExperience.parentElements.skillsTableTitle('ExternalWorkExperience', 'externalWorkExperienceSkills').getText()).toBe('Skills (1)');
        expect(ExternalWorkExperience.actions.getSkillName('ExternalWorkExperience', 'externalWorkExperienceSkills', skillsOnly[1]).isPresent()).toBeFalsy();
        expect(ExternalWorkExperience.actions.getSkillName('ExternalWorkExperience', 'externalWorkExperienceSkills', skillsOnly[2]).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Should create a new External Work Experience and navigate to project details page', async () => {
        CommonPageElements.objectPage.elements.backButton.click();
        await CommonPageElements.objectPage.elements.editButton.click();
        await ExternalWorkExperience.actions.navigateToProjectHistory('External Work Experience');
        await CudOperations.actions.create('externalWorkExperience');
        await CudOperations.actions.setValue('UiVerfier', workExperienceIDs.externalDraft.assignment);
        await CudOperations.actions.setValue('Customer 1', workExperienceIDs.externalDraft.customer);
        await CudOperations.actions.setValue('Jan 1, 1900', workExperienceIDs.externalDraft.startDate);
        await CudOperations.actions.setValue('Dec 1, 1900', workExperienceIDs.externalDraft.endDate);
        await CudOperations.actions.setValue('Company', workExperienceIDs.externalDraft.company);
        await CudOperations.actions.setValue('Role text', workExperienceIDs.externalDraft.role);
        await ExternalWorkExperience.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();
        await CudOperations.actions.createSkillRow();
        await CudOperations.actions.assignSkill('', skillsOnly[0]);
        await ExternalWorkExperience.parentElements.skillsTableTitle('ExternalWorkExperience', 'externalWorkExperienceSkills').click();
        await CudOperations.actions.clickDropdownBySiblingValue('externalWorkExperienceSkills', skillsOnly[0], 'proficiencyLevel_ID', 'ExternalWorkExperienceObjectPage');
        await CudOperations.actions.selectFromDropdown(proficiencyLevelNames[0]);
        await CommonPageElements.objectPage.elements.footer.applyButton.click();
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        await ExternalWorkExperience.actions.navigateToProjectHistory('External Work Experience');
        expect(await ExternalWorkExperience.parentElements.assignmentsTableTitle('externalWorkExperience').getText()).toBe('Assignments (3)');
        await ExternalWorkExperience.assertions.checkTableData('externalWorkExperience', 2, 'UiVerfier', 'Role text', 'Company', 'Customer 1', 'Jan 1, 1900', 'Dec 1, 1900');
        await ExternalWorkExperience.actions.navigateToProjectName('ExternalWorkExperience', 'UiVerfier');
        await ExternalWorkExperience.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();
        expect(ExternalWorkExperience.parentElements.skillsTableTitle('ExternalWorkExperience', 'externalWorkExperienceSkills').getText()).toBe('Skills (1)');
        expect(ExternalWorkExperience.actions.getSkillName('ExternalWorkExperience', 'externalWorkExperienceSkills', skillsOnly[0]).isPresent()).toBeTruthy();
    });

    // EXTERNAL WORK PROFICIENCY TESTS
    testHelper.failEarlyIt('Should change proficiency level of one external work experience skill', async () => {
        CommonPageElements.objectPage.elements.backButton.click();
        CommonPageElements.objectPage.elements.editButton.click();
        await ExternalWorkExperience.actions.navigateToProjectHistory('External Work Experience');
        await ExternalWorkExperience.actions.navigateToProjectNameInEditMode('ExternalWorkExperience', 'Internal Sales');
        await ExternalWorkExperience.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();
        await CudOperations.actions.assignSkill(skillsOnly[2], skills[3].name);
        await ExternalWorkExperience.parentElements.skillsTableTitle('ExternalWorkExperience', 'externalWorkExperienceSkills').click();
        await CudOperations.actions.clickDropdownBySiblingValue('externalWorkExperienceSkills', skills[3].name, 'proficiencyLevel_ID', 'ExternalWorkExperienceObjectPage');
        await CudOperations.actions.selectFromDropdown(proficiencyLevelTexts[1].name);
        await CommonPageElements.objectPage.elements.footer.applyButton.click();
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        await ExternalWorkExperience.actions.navigateToProjectHistory('External Work Experience');
        await ExternalWorkExperience.actions.navigateToProjectName('ExternalWorkExperience', 'Internal Sales');
        await ExternalWorkExperience.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();

        expect(ExternalWorkExperience.parentElements.skillsTableTitle('ExternalWorkExperience', 'externalWorkExperienceSkills').getText()).toBe('Skills (1)');
        expect(ExternalWorkExperience.actions.getSkillName('ExternalWorkExperience', 'externalWorkExperienceSkills', skills[3].name).isPresent()).toBeTruthy();
        expect(ExternalWorkExperience.actions.getProficiencyLevelName('ExternalWorkExperience', 'externalWorkExperienceSkills', proficiencyLevelTexts[1].name).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Should not change proficiency level to empty value for external work experience skill', async () => {
        CommonPageElements.objectPage.elements.backButton.click();
        CommonPageElements.objectPage.elements.editButton.click();
        await ExternalWorkExperience.actions.navigateToProjectHistory('External Work Experience');
        await ExternalWorkExperience.actions.navigateToProjectNameInEditMode('ExternalWorkExperience', 'Internal Sales');
        await ExternalWorkExperience.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();
        await CudOperations.actions.changeValueInTable('ExternalWorkExperienceObjectPage', 'externalWorkExperienceSkills', proficiencyLevelNames[1], '');

        await CommonPageElements.objectPage.elements.footer.applyButton.click();
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        expect(await CommonPageElements.actions.getMessageButtonState('Negative').asControl().getProperty('text')).toBe('1');
        expect(await CommonPageElements.actions.getMessageErrorLink('Enter an existing proficiency level.').isPresent()).toBeTruthy();
        await CommonPageElements.objectPage.elements.footer.cancelButton.click();
        await CommonPageElements.objectPage.elements.footer.discardButton.click();
    });

    testHelper.failEarlyIt('Should not change proficiency level to default proficiency level for external work experience skill', async () => {
        CommonPageElements.objectPage.elements.editButton.click();
        await ExternalWorkExperience.actions.navigateToProjectHistory('External Work Experience');
        await ExternalWorkExperience.actions.navigateToProjectNameInEditMode('ExternalWorkExperience', 'Internal Sales');
        await ExternalWorkExperience.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();
        await CudOperations.actions.changeValueInTable('ExternalWorkExperienceObjectPage', 'externalWorkExperienceSkills', proficiencyLevelNames[1], 'Not Set');
        await ExternalWorkExperience.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();
        await CommonPageElements.objectPage.elements.footer.applyButton.click();

        // Error Message by FE (frontend only), hence already at the Subobject Page
        expect(await CommonPageElements.actions.getMessageButtonStateExternalWorkExperience('Negative').asControl().getProperty('text')).toBe('1');
        expect(await CommonPageElements.actions.getMessageErrorLink('Value "Not Set" does not exist.').isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Should not change proficiency level to proficiency level of another set external work experience skill', async () => {
        await CudOperations.actions.changeErrorValueInTable('ExternalWorkExperienceObjectPage', 'externalWorkExperienceSkills', proficiencyLevelNames[3]);
        await ExternalWorkExperience.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();
        await CommonPageElements.objectPage.elements.footer.applyButton.click();

        // Error Message by FE (frontend only), hence already at the Subobject Page
        expect(await CommonPageElements.actions.getMessageButtonStateExternalWorkExperience('Negative').asControl().getProperty('text')).toBe('1');
        expect(await CommonPageElements.actions.getMessageErrorLink(`Value "${proficiencyLevelNames[3]}" does not exist.`).isPresent()).toBeTruthy();

        // Restore to a good state, go back to Object Page and cancel editing
        await CudOperations.actions.changeErrorValueInTable('ExternalWorkExperienceObjectPage', 'externalWorkExperienceSkills', proficiencyLevelNames[1]);
        await ExternalWorkExperience.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();
        await CommonPageElements.objectPage.elements.footer.applyButton.click();
        await CommonPageElements.objectPage.elements.footer.cancelButton.click();
        await CommonPageElements.objectPage.elements.footer.discardButton.click();
    });

    testHelper.failEarlyIt('Should delete multiple External Work Experience assignments', async () => {
        CommonPageElements.objectPage.elements.editButton.click();
        await ExternalWorkExperience.actions.navigateToProjectHistory('External Work Experience');
        await CudOperations.actions.deleteMany('externalWorkExperience', 2, ['Internal Sales', 'Nike SD']);
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        await ExternalWorkExperience.actions.navigateToProjectHistory('External Work Experience');
        expect(ExternalWorkExperience.parentElements.assignmentsTableTitle('externalWorkExperience').getText()).toBe('Assignments (1)');
        expect(ExternalWorkExperience.actions.getAssignment('externalWorkExperience', 'Internal Sales').isPresent()).toBeFalsy();
        expect(ExternalWorkExperience.actions.getAssignment('externalWorkExperience', 'Nike SD').isPresent()).toBeFalsy();
    });

    testHelper.failEarlyIt('Should see an error mesage on saving external work exp assignment without entering project name and start date', async () => {
        CommonPageElements.objectPage.elements.editButton.click();
        await ExternalWorkExperience.actions.navigateToProjectHistory('External Work Experience');
        await CudOperations.actions.create('externalWorkExperience');
        await CudOperations.actions.setValue('Customer', workExperienceIDs.externalDraft.customer);
        await CudOperations.actions.setValue('Dec 1, 2020', workExperienceIDs.externalDraft.endDate);
        await CudOperations.actions.setValue('Company Mandatory', workExperienceIDs.externalDraft.company);
        await CudOperations.actions.setValue('Role Mandatory', workExperienceIDs.externalDraft.role);
        await ExternalWorkExperience.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();
        await CommonPageElements.objectPage.elements.footer.applyButton.click();
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        expect(await CommonPageElements.actions.getMessageButtonState('Negative').asControl().getProperty('text')).toBe('2');
        expect(await CommonPageElements.actions.getMessageErrorList('Enter a project name.').isPresent()).toBeTruthy();
        expect(await CommonPageElements.actions.getMessageErrorList('Enter a start date.').isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Should see an error message on saving external work exp assignment with end date before the start date', async () => {
        await ExternalWorkExperience.actions.navigateToProjectNameInEditMode('ExternalWorkExperience', '');
        await CudOperations.actions.setValue('Project Name Mandatory', workExperienceIDs.externalDraft.assignment, true);
        await CudOperations.actions.setValue('Jan 1, 2020', workExperienceIDs.externalDraft.startDate, true);
        await CudOperations.actions.setValue('Dec 1, 2019', workExperienceIDs.externalDraft.endDate, true);
        await ExternalWorkExperience.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();
        await CommonPageElements.objectPage.elements.footer.applyButton.click();
        await CommonPageElements.objectPage.elements.footer.saveButton.click();

        expect(await CommonPageElements.actions.getMessageButtonState('Negative').asControl().getProperty('text')).toBe('1');
        expect(await CommonPageElements.actions.getMessageErrorLink('The start date must be before the end date.').isPresent()).toBeTruthy();

        await CommonPageElements.objectPage.elements.footer.cancelButton.click();
        await CommonPageElements.objectPage.elements.footer.discardButton.click();

        expect(CommonPageElements.objectPage.elements.editButton.isPresent()).toBeTruthy();
        expect(ExternalWorkExperience.actions.getAssignment('externalWorkExperience', 'Project Name Mandatory').isPresent()).toBeFalsy();
    });

    testHelper.failEarlyIt('Should update External Work Experience assignment details', async () => {
        await CommonPageElements.objectPage.elements.editButton.click();
        await ExternalWorkExperience.actions.navigateToProjectHistory('External Work Experience');
        await ExternalWorkExperience.actions.navigateToProjectNameInEditMode('ExternalWorkExperience', 'UiVerfier');
        await CudOperations.actions.setValue('New ProjectName', workExperienceIDs.externalDraft.assignment, true);
        await CudOperations.actions.setValue('New Customer', workExperienceIDs.externalDraft.customer, true);
        await CudOperations.actions.setValue('New Role', workExperienceIDs.externalDraft.role, true);
        await CudOperations.actions.setValue('New Company', workExperienceIDs.externalDraft.company, true);
        await CudOperations.actions.setValue('Dec 1, 2020', workExperienceIDs.externalDraft.startDate, true);
        await CudOperations.actions.setValue('Jan 1, 2021', workExperienceIDs.externalDraft.endDate, true);
        await ExternalWorkExperience.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();
        await CommonPageElements.objectPage.elements.footer.applyButton.click();
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        ExternalWorkExperience.assertions.checkTableData('externalWorkExperience', 0, 'New ProjectName', 'New Role', 'New Company', 'New Customer', 'Dec 1, 2020', 'Jan 1, 2021');
    });

    testHelper.failEarlyIt('Should delete External Work Experience assignment', async () => {
        CommonPageElements.objectPage.elements.editButton.click();
        await ExternalWorkExperience.actions.navigateToProjectHistory('External Work Experience');
        await CudOperations.actions.deleteMany('externalWorkExperience', 1, ['New ProjectName']);
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        expect(ExternalWorkExperience.parentElements.assignmentsTableTitle('externalWorkExperience').getText()).toBe('Assignments');
        expect(ExternalWorkExperience.actions.getAssignment('externalWorkExperience', 'New ProjectName').isPresent()).toBeFalsy();
    });

    testHelper.failEarlyIt('Check Attachments section is visible', async () => {
        browser.wait(() => BasicDataPage.parentElements.attachmentSection.isPresent(), 600000);
        BasicDataPage.actions.navigateToAttachments();
        expect(Attachments.basicData.elements.attachmentSectionLabel.isPresent());
    });

    testHelper.logout();

    function getMonthName(monthNumber) {
        let monthName;
        switch (monthNumber) {
        case 0:
            monthName = 'January';
            break;
        case 1:
            monthName = 'February';
            break;
        case 2:
            monthName = 'March';
            break;
        case 3:
            monthName = 'April';
            break;
        case 4:
            monthName = 'May';
            break;
        case 5:
            monthName = 'June';
            break;
        case 6:
            monthName = 'July';
            break;
        case 7:
            monthName = 'August';
            break;
        case 8:
            monthName = 'September';
            break;
        case 9:
            monthName = 'October';
            break;
        case 10:
            monthName = 'November';
            break;
        case 11:
            monthName = 'December';
            break;
        default:
            monthName = '';
        }
        return monthName;
    }
});
