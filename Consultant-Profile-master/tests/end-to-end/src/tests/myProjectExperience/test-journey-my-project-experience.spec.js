const path = require('path');
const testEnvironment = require('../../utils');
const { TestHelper } = require('../../utils/TestHelper');
const { skills, allSkillNames } = require('../data/skills');
const { employeeHeaders } = require('../data/employeeHeaders');
const { workAssignments } = require('../data/workAssignments');
const { workAssignmentDetails } = require('../data/workAssignmentDetails');
const { workforcePersons } = require('../data/workforcePersons');
const { skillAssignments } = require('../data/skillAssignments');
const { projectRoles, projectRoleDescription } = require('../data/projectRoles');
const { roleAssignments } = require('../data/roleAssignments');
const { emails, allEmailAddressData } = require('../data/emails');
const { photos } = require('../data/photos');
const { resourceHeaders } = require('../data/resourceHeaders');
const { profileDetails } = require('../data/profileDetails');
const { phones } = require('../data/phones');
const { jobDetails } = require('../data/jobDetails');
const { assignments } = require('../data/assignments');
const { externalWorkExperiences } = require('../data/externalWorkExperiences');
const { externalWorkExperienceSkills } = require('../data/externalWorkExperienceSkills');
const { assignmentBucket } = require('../data/assignmentBucket');
const { customers, allCustomerNames } = require('../data/customers');
const { workpackage } = require('../data/workPackage');
const { project } = require('../data/project');
const { skillRequirements } = require('../data/skillRequirements');
const { resourceRequestData, allResourceRequestDesc } = require('../data/resourceRequest');
const { resourceCapacities } = require('../data/resourceCapacities');
const { catalogs, allCatalogDesc } = require('../data/skillCatalogs');
const { catalogs2skills } = require('../data/skillCatalogs2skills');
const { bookedCapacityAggregate } = require('../data/bookedCapacityAggregates');
const { profilePhotos } = require('../data/profilePhotos');
const { resourceOrganizations } = require('../data/resourceOrganizations');
const { resourceOrganizationItems } = require('../data/resourceOrganizationItems');
const { attachments } = require('../data/attachments');
const { costCenters } = require('../data/costCenter');
const { testRunId } = require('../data/testRunID');
const { proficiencyLevels } = require('../data/proficiencyLevels');
const { allProficiencySetNames, proficiencySets } = require('../data/proficiencySets');
const { proficiencyLevelTexts } = require('../data/proficiencyLevelTexts');
const { costCenterAttributes } = require('../data/costCenterAttribute');
const { demand } = require('../data/demand');

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

const LaunchpadPage = require('../pages/LaunchpadPage.js');
const BasicDataPage = require('../pages/BasicDataPage.js');
const Qualifications = require('../pages/Qualifications.js');
const PriorExperience = require('../pages/PriorExperience.js');
const CommonPageElements = require('../pages/CommonPageElements.js');
const Availability = require('../pages/Availability.js');
const CudOperations = require('../pages/CudOperations.js');
const ProjectHistory = require('../pages/WorkExperience.js');
const Attachments = require('../pages/Attachment.js');

const DATAIMGPATH = path.resolve(__dirname, '../data/profilePhotoData/profilePhoto.png');
const DATACSVPATH = path.resolve(__dirname, '../data/profilePhotoData/Sample.csv');
const DATALARGEIMGPATH = path.resolve(__dirname, '../data/profilePhotoData/Large_Image.jpg');
const DATAGIFPATH = path.resolve(__dirname, '../data/profilePhotoData/gif_file.gif');
const DATANEWIMGPATH = path.resolve(__dirname, '../data/profilePhotoData/new_profilePhoto.png');

const PDFFILEPATH = path.resolve(__dirname, '../data/attachmentData/plain-text.pdf');
const CSVFILEPATH = path.resolve(__dirname, '../data/attachmentData/Sample.csv');
const LARGEFILEPATH = path.resolve(__dirname, '../data/attachmentData/clean_code.pdf');
const DOCXFILEPATH = path.resolve(__dirname, '../data/attachmentData/test.docx');

describe('test-journey-my-project-experience', () => {
    const testHelper = new TestHelper();

    // Precautionary data deletion for MyProjectExperience Application
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
        await bookedCapacityAggregateRepository.deleteMany(toBeDeletedBookedCapacityAggregate);

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
        try {
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
            await costCenterAttributeRepository.insertMany(costCenterAttributes);
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
            await demandRepository.insertMany(demand);
            console.log('Data Insertion is complete');
            console.log('Initial data setup completed in beforeAll() hook.');
        } catch (err) {
            console.log(err);
            process.exit(1);
        }
    });

    /**
     * Tear-down test data
     */
    afterAll(async () => {
        try {
            console.log('Cleanup task in afterAll() hook started.');
            await workAssignmentsRepository.deleteMany(workAssignments);
            await workAssignmentDetailRepository.deleteMany(workAssignmentDetails);
            await profileDetailRepository.deleteMany(profileDetails);
            await phoneRepository.deleteMany(phones);
            await photoRepository.deleteMany(photos);
            await workforcePersonRepository.deleteMany(workforcePersons);
            await jobDetailRepository.deleteMany(jobDetails);
            await costCenterRepository.deleteMany(costCenters);
            await costCenterAttributeRepository.deleteMany(costCenterAttributes);
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
            await demandRepository.deleteMany(demand);
            console.log('Cleanup task in afterAll() hook completed.');
        } catch (err) {
            console.log(err);
            process.exit(1);
        }
    });

    const email = emails[0].address;
    const name = `${profileDetails[0].firstName} ${profileDetails[0].lastName} (${workforcePersons[0].externalID})`;
    const mobNo = `+${phones[0].number}`;
    const currentRole = jobDetails[3].jobTitle;
    const resourceOrg = `${resourceOrganizations[0].name} (${resourceOrganizations[0].displayId})`;
    const officeLoc = 'Germany';
    const costCenterDisplay = `${costCenterAttributes[0].description} (${costCenters[0].costCenterID})`;
    const managerName = `${profileDetails[1].firstName} ${profileDetails[1].lastName} (${workforcePersons[1].externalID})`;
    const managerEmail = emails[1].address;
    const workerType = 'Employee';
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
        projectRoles[0].name, // Junior Consulant1
        projectRoles[2].name, // Platinum Consultant1
        projectRoles[1].name, // Senior Consultant1
        projectRoles[3].name, // Architect1
        projectRoles[4].name, // Program Manager(restricted)
    ];
    const workExperienceIDs = {
        externalDraft: {
            assignment: 'myProjectExperienceUi::ExternalWorkExperienceObjectPage--fe::FormContainer::FieldGroup::GeneralInformation::FormElement::DataField::projectName::Field',
            company: 'myProjectExperienceUi::ExternalWorkExperienceObjectPage--fe::FormContainer::FieldGroup::GeneralInformation::FormElement::DataField::companyName::Field',
            customer: 'myProjectExperienceUi::ExternalWorkExperienceObjectPage--fe::FormContainer::FieldGroup::GeneralInformation::FormElement::DataField::customer::Field',
            startDate: 'myProjectExperienceUi::ExternalWorkExperienceObjectPage--fe::FormContainer::FieldGroup::GeneralInformation::FormElement::DataField::startDate::Field',
            endDate: 'myProjectExperienceUi::ExternalWorkExperienceObjectPage--fe::FormContainer::FieldGroup::GeneralInformation::FormElement::DataField::endDate::Field',
            role: 'myProjectExperienceUi::ExternalWorkExperienceObjectPage--fe::FormContainer::FieldGroup::GeneralInformation::FormElement::DataField::rolePlayed::Field',
        },
    };

    testHelper.loginWithRole('Consultant');

    testHelper.failEarlyIt('Should navigate to landing page, click My Project Experience tile and check basic data', async () => {
        LaunchpadPage.actions.openMyProjectExperienceListApp();
        browser.wait(() => BasicDataPage.parentElements.consultantHeaders.title.isPresent(), 600000);

        expect(BasicDataPage.basicData.elements.profilePhotoAvataronHeader.isPresent());
        expect(BasicDataPage.actions.getHeaderTitle(name).isPresent()).toBeTruthy();
        expect(BasicDataPage.actions.getHeaderLabel(currentRole).isPresent()).toBeTruthy('Role Value should exist');
        expect(BasicDataPage.basicData.elements.orgInfoDeptLabel.isPresent()).toBeTruthy('Org Info Dept Label should exist');
        expect(BasicDataPage.actions.getOrgInfoDeptValue(resourceOrg).isPresent()).toBeTruthy('Org Value Dept should exist');
        expect(BasicDataPage.basicData.elements.orgInfoOfficeLocLabel.isPresent()).toBeTruthy('Org Info Office Label should exist');
        expect(BasicDataPage.actions.getOrgInfoOfficeLocValue(officeLoc).isPresent()).toBeTruthy();
        expect(BasicDataPage.basicData.elements.orgInfoCostCenterLabel.isPresent());
        expect(BasicDataPage.actions.getWorkerCostCenterValue(costCenterDisplay).isPresent()).toBeTruthy();

        expect(BasicDataPage.basicData.elements.orgInfoManagerLabel.isPresent());
        expect(BasicDataPage.actions.getOrgInfoManagerValue(managerName).isPresent()).toBeTruthy();

        expect(BasicDataPage.basicData.elements.contactInfoMobileNoLabel.isPresent());
        expect(BasicDataPage.actions.getContactInfoMobileNoValue(mobNo).isPresent()).toBeTruthy();
        expect(BasicDataPage.basicData.elements.contactInfoEmailLabel.isPresent());
        expect(BasicDataPage.actions.getContactInfoEmailValue(email).isPresent()).toBeTruthy();
        expect(BasicDataPage.basicData.elements.workerType.isPresent());
        expect(BasicDataPage.actions.getWorkerTypeValue(workerType).isPresent()).toBeTruthy();
        expect(BasicDataPage.basicData.elements.changeRecordInfo.isPresent());
        expect(BasicDataPage.basicData.elements.changedOnLabel.isPresent());
        expect(BasicDataPage.basicData.elements.changedByLabel.isPresent());

        BasicDataPage.actions.navigateToManager(managerName);
        expect(await BasicDataPage.parentElements.managerContactCard.popover.isPresent()).toBeTruthy();
        expect(BasicDataPage.basicData.elements.managerContactCardContactDetails.isPresent()).toBe(true, 'managerContactCardContactDetails is present');
        expect(BasicDataPage.basicData.elements.managerContactCardContactDetailsEmailLabel.isPresent()).toBe(true, 'managerContactCardContactDetails Email Label not present');
        expect(BasicDataPage.basicData.elements.managerContactCardContactDetailsMobileLabel.isPresent()).toBe(true, 'managerContactCardContactDetails Mobile Label not present');
        expect(BasicDataPage.actions.getManagerContactCardNameValue(managerName).isPresent()).toBe(true, 'managerName Mobile Label not present');
        expect(BasicDataPage.actions.getManagerContactCardEmailValue(managerEmail).isPresent()).toBe(true, 'managerEmail Mobile Label not present');
        expect(BasicDataPage.actions.getManagerContactCardMobileNoValue(managerEmail).isPresent()).toBe(true, 'managerEmail Mobile Label not present');
    });

    // Basic data check on edit
    testHelper.failEarlyIt('Check basic data in edit mode', async () => {
        CommonPageElements.objectPage.elements.editButton.click();
        expect(CommonPageElements.objectPage.elements.editButton.isPresent()).toBeFalsy();
        CommonPageElements.objectPage.elements.collapseHeaderButton.click();
        CommonPageElements.objectPage.elements.expandHeaderButton.click();
        expect(BasicDataPage.basicData.elements.profilePhotoAvataronEditHeader.isPresent());
        expect(BasicDataPage.actions.getHeaderTitle(name).isPresent()).toBeTruthy();
        expect(BasicDataPage.actions.getHeaderLabel(currentRole).isPresent()).toBeTruthy();
        expect(BasicDataPage.basicData.elements.orgInfoDeptLabel.isPresent());
        expect(BasicDataPage.actions.getOrgInfoDeptValue(resourceOrg).isPresent()).toBeTruthy();
        expect(BasicDataPage.basicData.elements.orgInfoOfficeLocLabel.isPresent());
        expect(BasicDataPage.actions.getOrgInfoOfficeLocValue(officeLoc).isPresent()).toBeTruthy();
        expect(BasicDataPage.basicData.elements.orgInfoCostCenterLabel.isPresent());
        expect(BasicDataPage.actions.getWorkerCostCenterValue(costCenterDisplay).isPresent()).toBeTruthy();

        expect(BasicDataPage.basicData.elements.orgInfoManagerLabel.isPresent());
        expect(BasicDataPage.actions.getOrgInfoManagerValue(managerName).isPresent()).toBeTruthy();

        expect(BasicDataPage.basicData.elements.contactInfoMobileNoLabel.isPresent());
        expect(BasicDataPage.actions.getContactInfoMobileNoValue(mobNo).isPresent()).toBeTruthy();
        expect(BasicDataPage.basicData.elements.contactInfoEmailLabel.isPresent());
        expect(BasicDataPage.actions.getContactInfoEmailValue(email).isPresent()).toBeTruthy();
        expect(BasicDataPage.basicData.elements.workerType.isPresent());
        expect(BasicDataPage.actions.getWorkerTypeValue(workerType).isPresent()).toBeTruthy();
        expect(BasicDataPage.basicData.elements.changeRecordInfo.isPresent());
        expect(BasicDataPage.basicData.elements.changedOnLabel.isPresent());
        expect(BasicDataPage.basicData.elements.changedByLabel.isPresent());

        BasicDataPage.actions.navigateToManager(managerName);
        expect(await BasicDataPage.parentElements.managerContactCard.popover.isPresent()).toBeTruthy();
        expect(BasicDataPage.basicData.elements.managerContactCardContactDetails.isPresent()).toBe(true, 'managerContactCardContactDetails is present');
        expect(BasicDataPage.basicData.elements.managerContactCardContactDetailsEmailLabel.isPresent()).toBe(true, 'managerContactCardContactDetails Email Label not present');
        expect(BasicDataPage.basicData.elements.managerContactCardContactDetailsMobileLabel.isPresent()).toBe(true, 'managerContactCardContactDetails Mobile Label not present');
        expect(BasicDataPage.actions.getManagerContactCardNameValue(managerName).isPresent()).toBe(true, 'managerName Mobile Label not present');
        expect(BasicDataPage.actions.getManagerContactCardEmailValue(managerEmail).isPresent()).toBe(true, 'managerEmail Mobile Label not present');
        expect(BasicDataPage.actions.getManagerContactCardMobileNoValue(managerEmail).isPresent()).toBe(true, 'managerEmail Mobile Label not present');
        await CommonPageElements.objectPage.elements.footer.cancelButton.click();
    });

    testHelper.failEarlyIt('Check header facet data', async () => {
        browser.wait(() => BasicDataPage.parentElements.consultantHeaders.content.isPresent(), 600000);
        CommonPageElements.objectPage.elements.editButton.click();
        expect(CommonPageElements.objectPage.elements.editButton.isPresent()).toBeFalsy();
        BasicDataPage.actions.navigateToHeaderInfo();
        expect(await BasicDataPage.parentElements.consultantHeaders.profilePhotoSection.isPresent());
        expect(BasicDataPage.basicData.elements.profilePhotoSectionLabel.isPresent());
        expect(await BasicDataPage.basicData.elements.profilePhotoAvatar.isPresent());
        expect(await BasicDataPage.basicData.elements.profilePhotoUploadButton.isPresent());
        expect(await BasicDataPage.basicData.elements.profilePhotoDeleteButton.isPresent());
        await CommonPageElements.objectPage.elements.footer.cancelButton.click();
    });

    testHelper.failEarlyIt('Upload no profile photo and save', async () => {
        browser.wait(() => BasicDataPage.parentElements.consultantHeaders.content.isPresent(), 600000);
        CommonPageElements.objectPage.elements.editButton.click();
        BasicDataPage.actions.navigateToHeaderInfo();
        expect(CommonPageElements.objectPage.elements.editButton.isPresent()).toBeFalsy();
        expect(await BasicDataPage.parentElements.consultantHeaders.profilePhotoSection.isPresent());
        expect(await BasicDataPage.actions.getProfilePhotoValue('').isPresent()).toBeTruthy();
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
    });

    testHelper.failEarlyIt('Upload large-image file for profile photo', async () => {
        browser.wait(() => BasicDataPage.parentElements.consultantHeaders.content.isPresent(), 600000);
        CommonPageElements.objectPage.elements.editButton.click();
        expect(CommonPageElements.objectPage.elements.editButton.isPresent()).toBeFalsy();
        await BasicDataPage.basicData.elements.profilePhotoFileUpload.sendKeys(DATALARGEIMGPATH);
        expect(await BasicDataPage.actions.getErrorDialogMessageText('The maximum allowed file size is 2 MB.').isPresent()).toBe(true);
        await BasicDataPage.basicData.elements.errorDialogCloseButton.click();
    });

    testHelper.failEarlyIt('Upload image of unsupported type', async () => {
        expect(CommonPageElements.objectPage.elements.editButton.isPresent()).toBeFalsy();
        await BasicDataPage.basicData.elements.profilePhotoFileUpload.sendKeys(DATAGIFPATH);
        expect(await BasicDataPage.actions.getErrorDialogMessageText('The file format you selected is not supported.').isPresent()).toBe(true);
        await BasicDataPage.basicData.elements.errorDialogCloseButton.click();
    });

    testHelper.failEarlyIt('Upload non-image file for profile photo', async () => {
        expect(CommonPageElements.objectPage.elements.editButton.isPresent()).toBeFalsy();
        await BasicDataPage.basicData.elements.profilePhotoFileUpload.sendKeys(DATACSVPATH);
        expect(await BasicDataPage.actions.getErrorDialogMessageText('The file format you selected is not supported.').isPresent()).toBe(true);
        await BasicDataPage.basicData.elements.errorDialogCloseButton.click();
    });

    testHelper.failEarlyIt('Upload correct profile photo and save', async () => {
        expect(CommonPageElements.objectPage.elements.editButton.isPresent()).toBeFalsy();
        expect(await BasicDataPage.parentElements.consultantHeaders.profilePhotoSection.isPresent());
        await BasicDataPage.basicData.elements.profilePhotoFileUpload.sendKeys(DATAIMGPATH);
        expect(await BasicDataPage.actions.getProfilePhotoValue('profilePhoto.png').isPresent()).toBeTruthy();
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
    });

    testHelper.failEarlyIt('Upload correct profile photo and discard', async () => {
        browser.wait(() => BasicDataPage.parentElements.consultantHeaders.content.isPresent(), 600000);
        CommonPageElements.objectPage.elements.editButton.click();
        expect(CommonPageElements.objectPage.elements.editButton.isPresent()).toBeFalsy();
        await BasicDataPage.basicData.elements.profilePhotoFileUpload.sendKeys(DATANEWIMGPATH);
        await CommonPageElements.objectPage.elements.footer.cancelButton.click();
        await CommonPageElements.objectPage.elements.footer.discardButton.click();
    });

    testHelper.failEarlyIt('Modify existing photo with photo of large size', async () => {
        browser.wait(() => BasicDataPage.parentElements.consultantHeaders.content.isPresent(), 600000);
        CommonPageElements.objectPage.elements.editButton.click();
        expect(CommonPageElements.objectPage.elements.editButton.isPresent()).toBeFalsy();
        await BasicDataPage.basicData.elements.profilePhotoFileUpload.sendKeys(DATALARGEIMGPATH);
        expect(await BasicDataPage.actions.getErrorDialogMessageText('The maximum allowed file size is 2 MB.').isPresent()).toBe(true);
        await BasicDataPage.basicData.elements.errorDialogCloseButton.click();
    });

    testHelper.failEarlyIt('Remove uploaded photo', async () => {
        expect(CommonPageElements.objectPage.elements.editButton.isPresent()).toBeFalsy();
        await BasicDataPage.basicData.elements.profilePhotoDeleteButton.click();
        // TO DO- restore assertions after bug is fixed - https://support.wdf.sap.corp/sap/support/message/2280084539
        expect(await BasicDataPage.actions.getProfilePhotoValue('').isPresent()).toBeTruthy();
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
    });

    testHelper.failEarlyIt('Modify existing photo with another correct profile photo', async () => {
        browser.wait(() => BasicDataPage.parentElements.consultantHeaders.content.isPresent(), 600000);
        CommonPageElements.objectPage.elements.editButton.click();
        expect(CommonPageElements.objectPage.elements.editButton.isPresent()).toBeFalsy();
        await BasicDataPage.basicData.elements.profilePhotoFileUpload.sendKeys(DATAIMGPATH);
        expect(await BasicDataPage.actions.getProfilePhotoValue('profilePhoto.png').isPresent()).toBeTruthy();
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        CommonPageElements.objectPage.elements.editButton.click();
        expect(CommonPageElements.objectPage.elements.editButton.isPresent()).toBeFalsy();
        await BasicDataPage.basicData.elements.profilePhotoFileUpload.sendKeys(DATANEWIMGPATH);
        expect(await BasicDataPage.actions.getProfilePhotoValue('new_profilePhoto.png').isPresent()).toBeTruthy();
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
    });

    testHelper.failEarlyIt('Check Attachments section is visible', async () => {
        browser.wait(() => Attachments.parentElements.attachmentSection.isPresent(), 600000);
        Attachments.actions.navigateToAttachments();
        expect(Attachments.basicData.elements.attachmentSectionLabel.isPresent());
    });

    testHelper.failEarlyIt('Check Attachments section in edit mode', async () => {
        browser.wait(() => Attachments.parentElements.attachmentSection.isPresent(), 600000);
        Attachments.actions.navigateToAttachments();
        expect(Attachments.basicData.elements.attachmentSectionLabel.isPresent());
        expect(Attachments.basicData.elements.attachmentUploadButton.isPresent());
        expect(Attachments.basicData.elements.attachmentDeleteButton.isPresent());
        expect(Attachments.basicData.elements.attachmentUploadTextButton.isPresent());
        expect(Attachments.basicData.elements.attachmentDppTextButton.isPresent());
    });

    testHelper.failEarlyIt('Upload no attachment and save', async () => {
        browser.wait(() => Attachments.parentElements.attachmentSection.isPresent(), 600000);
        CommonPageElements.objectPage.elements.editButton.click();
        expect(CommonPageElements.objectPage.elements.editButton.isPresent()).toBeFalsy();
        Attachments.actions.navigateToAttachments();
        expect(await Attachments.actions.getAttachmentValue('').isPresent()).toBeTruthy();
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
    });

    testHelper.failEarlyIt('Upload large file for attachment', async () => {
        browser.wait(() => Attachments.parentElements.attachmentSection.isPresent(), 600000);
        CommonPageElements.objectPage.elements.editButton.click();
        expect(CommonPageElements.objectPage.elements.editButton.isPresent()).toBeFalsy();
        Attachments.actions.navigateToAttachments();
        await Attachments.basicData.elements.attachmentFileUpload.sendKeys(LARGEFILEPATH);
        expect(await BasicDataPage.actions.getErrorDialogMessageText('The maximum allowed file size is 2 MB.').isPresent()).toBe(true);
        await BasicDataPage.basicData.elements.errorDialogCloseButton.click();
    });

    testHelper.failEarlyIt('Upload file of unsupported type', async () => {
        expect(CommonPageElements.objectPage.elements.editButton.isPresent()).toBeFalsy();
        await Attachments.basicData.elements.attachmentFileUpload.sendKeys(CSVFILEPATH);
        expect(await BasicDataPage.actions.getErrorDialogMessageText('The file format you selected is not supported.').isPresent()).toBe(true);
        await BasicDataPage.basicData.elements.errorDialogCloseButton.click();
    });

    testHelper.failEarlyIt('Upload correct attachment and save', async () => {
        expect(CommonPageElements.objectPage.elements.editButton.isPresent()).toBeFalsy();
        expect(await Attachments.parentElements.attachmentSection.isPresent());
        await Attachments.basicData.elements.attachmentFileUpload.sendKeys(PDFFILEPATH);
        expect(await Attachments.actions.getAttachmentValue('plain-text.pdf').isPresent()).toBeTruthy();
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
    });

    testHelper.failEarlyIt('Upload correct attachment and discard', async () => {
        browser.wait(() => Attachments.parentElements.attachmentSection.isPresent(), 600000);
        CommonPageElements.objectPage.elements.editButton.click();
        expect(CommonPageElements.objectPage.elements.editButton.isPresent()).toBeFalsy();
        await Attachments.basicData.elements.attachmentFileUpload.sendKeys(DOCXFILEPATH);
        await CommonPageElements.objectPage.elements.footer.cancelButton.click();
        await CommonPageElements.objectPage.elements.footer.discardButton.click();
    });

    testHelper.failEarlyIt('Modify existing attachment with attachment of large size', async () => {
        browser.wait(() => Attachments.parentElements.attachmentSection.isPresent(), 600000);
        CommonPageElements.objectPage.elements.editButton.click();
        expect(CommonPageElements.objectPage.elements.editButton.isPresent()).toBeFalsy();
        await Attachments.basicData.elements.attachmentFileUpload.sendKeys(LARGEFILEPATH);
        expect(await BasicDataPage.actions.getErrorDialogMessageText('The maximum allowed file size is 2 MB.').isPresent()).toBe(true);
        await BasicDataPage.basicData.elements.errorDialogCloseButton.click();
    });

    testHelper.failEarlyIt('Remove uploaded attachment', async () => {
        expect(CommonPageElements.objectPage.elements.editButton.isPresent()).toBeFalsy();
        await Attachments.basicData.elements.attachmentDeleteButton.click();
        expect(await Attachments.actions.getAttachmentValue('').isPresent()).toBeTruthy();
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
    });

    testHelper.failEarlyIt('Modify existing attachment with another correct attachment', async () => {
        browser.wait(() => Attachments.parentElements.attachmentSection.isPresent(), 600000);
        CommonPageElements.objectPage.elements.editButton.click();
        expect(CommonPageElements.objectPage.elements.editButton.isPresent()).toBeFalsy();
        await Attachments.basicData.elements.attachmentFileUpload.sendKeys(PDFFILEPATH);
        expect(await Attachments.actions.getAttachmentValue('plain-text.pdf').isPresent()).toBeTruthy();
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        CommonPageElements.objectPage.elements.editButton.click();
        expect(CommonPageElements.objectPage.elements.editButton.isPresent()).toBeFalsy();
        await Attachments.basicData.elements.attachmentFileUpload.sendKeys(DOCXFILEPATH);
        expect(await Attachments.actions.getAttachmentValue('test.docx').isPresent()).toBeTruthy();
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
    });

    testHelper.failEarlyIt('Check qualifications', async () => {
        browser.wait(() => BasicDataPage.parentElements.consultantHeaders.content.isPresent(), 600000);
        browser.wait(() => Qualifications.parentElements.contentSection.isPresent(), 600000);
        Qualifications.actions.navigateToQualifications();
        const skillTitleText = await Qualifications.qualifications.elements.tableTitle.getText();
        expect(skillTitleText.substring(0, 6)).toBe('Skills');
        const regexp = new RegExp('([3-9])|([1-9][0-9])');
        expect(regexp.test(skillTitleText.substring(7))).toBeTruthy();
        expect(await Qualifications.actions.getSkillName(skillsInTable[0]).isPresent()).toBeTruthy();
        expect(await Qualifications.actions.getSkillName(skillsInTable[1]).isPresent()).toBeTruthy();
        expect(await Qualifications.actions.getSkillName(skillsInTable[4]).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Check the skill popover', async () => {
        await BasicDataPage.parentElements.consultantHeaders.collapseButton.click();
        await Qualifications.actions.clickOnASkill(skillsInTable[0]);
        expect(Qualifications.parentElements.skillPopover.descriptionLabel.isPresent()).toBeTruthy();
        expect(Qualifications.parentElements.skillPopover.descriptionValue(skills[0].description).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Check skills value help', async () => {
        const multipleCatalogs = `${catalogs[0].name}, ${catalogs[1].name}`;
        await CommonPageElements.objectPage.elements.editButton.click();
        await Qualifications.actions.navigateToQualifications();
        await CudOperations.actions.openValueHelp('skills', 1);
        await Qualifications.qualifications.elements.valueHelpShowFiltersBtn.click();
        await PriorExperience.priorExperience.elements.valueHelpSearchInput_skills.sendKeys(testRunId);
        await PriorExperience.priorExperience.elements.valueHelpSearchPress_skills.click();
        await Qualifications.assertions.checkSkillValueHelpTableData(skills[0].name, skills[0].description, skills[0].commaSeparatedAlternativeLabels, catalogs[0].name);
        await Qualifications.assertions.checkSkillValueHelpTableData(skills[4].name, skills[4].description, skills[4].commaSeparatedAlternativeLabels, catalogs[1].name);
        await Qualifications.assertions.checkSkillValueHelpTableData(skills[1].name, skills[1].description, skills[1].commaSeparatedAlternativeLabels, catalogs[1].name);
        await Qualifications.assertions.checkSkillValueHelpTableData(skills[3].name, skills[3].description, skills[3].commaSeparatedAlternativeLabels, multipleCatalogs);
        await Qualifications.assertions.checkSkillValueHelpTableData(skills[2].name, skills[2].description, skills[2].commaSeparatedAlternativeLabels, multipleCatalogs);
    });

    testHelper.failEarlyIt('Should create a new skill and check its proficiency levels in the value help', async () => {
        await Qualifications.qualifications.elements.valueHelpCancelButton.click();
        await CudOperations.actions.create('skills');
        await Qualifications.actions.navigateToQualifications();
        await CudOperations.actions.changeValueOfTheSkillsRow('', skillsOnly[0]);
        await Qualifications.qualifications.elements.tableTitle.click();
        await CudOperations.actions.clickDropdownBySiblingValue('skills', skillsOnly[0], 'proficiencyLevel_ID', 'MyProjectExperienceObjectPage');
        await Qualifications.assertions.checkProficiencyLevelValueHelpTableData(0, proficiencyLevels[0].name, proficiencyLevels[0].description);
        await Qualifications.assertions.checkProficiencyLevelValueHelpTableData(0, proficiencyLevels[0].name, proficiencyLevels[0].description);
    });

    testHelper.failEarlyIt('Should select a proficiency, save the skill and check the skills table for the same', async () => {
        await CudOperations.actions.selectFromDropdown(proficiencyLevelNames[0]);
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        const skillTitleText = await Qualifications.qualifications.elements.tableTitle.getText();
        expect(skillTitleText.substring(0, 6)).toBe('Skills');
        const regexp = new RegExp('([4-9])|([1-9][0-9])');
        expect(regexp.test(skillTitleText.substring(7))).toBeTruthy();
        expect(await Qualifications.actions.getSkillName(skillsInTable[0]).isPresent()).toBeTruthy();
        expect(await Qualifications.actions.getSkillName(skillsInTable[1]).isPresent()).toBeTruthy();
        expect(await Qualifications.actions.getSkillName(skillsInTable[2]).isPresent()).toBeTruthy();
        expect(await Qualifications.actions.getSkillName(skillsInTable[4]).isPresent()).toBeTruthy();
        expect(await Qualifications.actions.getProficiencyLevelName(proficiencyLevels[0].name).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Value help should not display resticted skills though they were assigned previously', async () => {
        await CommonPageElements.objectPage.elements.editButton.click();
        await CudOperations.actions.openValueHelp('skills', 0);

        browser.wait(() => Qualifications.qualifications.elements.catalogFilterInput.isPresent(), 600000);
        await Qualifications.qualifications.elements.catalogFilterInput.sendKeys(catalogs[2].name);
        await Qualifications.qualifications.elements.catalogFilterInput.sendKeys(protractor.Key.ENTER);

        expect(await CudOperations.actions.getValueHelpItemsCount('skill', catalogs[2].name)).toBe(0);

        await PriorExperience.priorExperience.elements.valueHelpSearchInput_skills.sendKeys(skillsOnly[3]);
        await PriorExperience.priorExperience.elements.valueHelpSearchPress_skills.click();

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
        await CudOperations.actions.clickDropdownBySiblingValue('skills', skillsOnly[1], 'proficiencyLevel_ID', 'MyProjectExperienceObjectPage');
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
        await Qualifications.actions.navigateToQualifications();
        await CudOperations.actions.create('skills');
        await CudOperations.actions.fillEmptyInputBox('skills', skillsOnly[2]);
        await Qualifications.qualifications.elements.tableTitle.click();
        await CudOperations.actions.create('skills');
        await CudOperations.actions.fillEmptyInputBox('skills', 'randomSkill');
        await Qualifications.qualifications.elements.tableTitle.click();
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
        let regexp = new RegExp('([3-9])|([1-9][0-9])');
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

    testHelper.failEarlyIt('Should not assign a skill as more than guid length char and discard the draft', async () => {
        CommonPageElements.objectPage.elements.editButton.click();
        await CudOperations.actions.create('skills');
        await Qualifications.actions.navigateToQualifications();
        await CudOperations.actions.fillEmptyInputBox('skills', 'b08aabdf-6dcb-4df7-b319-b440f073e6dccsdavfas');
        await Qualifications.qualifications.elements.tableTitle.click();
        expect(await CommonPageElements.actions.getMessageButtonState('Negative').asControl().getProperty('text')).toBe('1');
        const errorMessageControl = await CommonPageElements.actions.getMessageErrorLink('Select an existing skill from the value help.').isPresent();
        if (!errorMessageControl) {
            await CommonPageElements.objectPage.elements.footer.messageButton.click();
            expect(await CommonPageElements.actions.getMessageErrorLink('Select an existing skill from the value help.').isPresent()).toBeTruthy();
        }
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
        await Qualifications.actions.navigateToQualifications();
        await CudOperations.actions.create('skills');
        await CudOperations.actions.fillEmptyInputBox('skills', skillsInTable[2]);
        await Qualifications.qualifications.elements.tableTitle.click();
        await CudOperations.actions.clickDropdownBySiblingValue('skills', skillsInTable[2], 'proficiencyLevel_ID', 'MyProjectExperienceObjectPage');
        await CudOperations.actions.selectFromDropdown(proficiencyLevelNames[0]);
        await Qualifications.qualifications.elements.tableTitle.click();
        await CommonPageElements.objectPage.elements.footer.saveButton.click();

        const skillTitleText = await Qualifications.qualifications.elements.tableTitle.getText();
        expect(skillTitleText.substring(0, 6)).toBe('Skills');
        const regexp = new RegExp('([3-9])|([1-9][0-9])');
        expect(regexp.test(skillTitleText.substring(7))).toBeTruthy();
        expect(await Qualifications.actions.getSkillName(skillsInTable[0]).isPresent()).toBeTruthy();
        expect(await Qualifications.actions.getSkillName(skillsInTable[1]).isPresent()).toBeTruthy();
        expect(await Qualifications.actions.getSkillName(skillsInTable[2]).isPresent()).toBeTruthy();
        expect(await Qualifications.actions.getSkillName(skillsInTable[3]).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Should delete many skills', async () => {
        await CommonPageElements.objectPage.elements.editButton.click();
        await Qualifications.actions.navigateToQualifications();
        await CudOperations.actions.deleteMany('skills', 2, [skillsInTable[2], skillsInTable[3]]);
        const skillTitleText = await Qualifications.qualifications.elements.tableTitle.getText();
        expect(skillTitleText.substring(0, 6)).toBe('Skills');
        const regexp = new RegExp('([2-9])|([1-9][0-9])');
        expect(regexp.test(skillTitleText.substring(7))).toBeTruthy();
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        expect(await Qualifications.actions.getSkillName(skillsInTable[0]).isPresent()).toBeTruthy();
        expect(await Qualifications.actions.getSkillName(skillsInTable[1]).isPresent()).toBeTruthy();
        expect(await Qualifications.actions.getSkillName(skillsInTable[2]).isPresent()).toBeFalsy();
        expect(await Qualifications.actions.getSkillName(skillsInTable[3]).isPresent()).toBeFalsy();
    });

    testHelper.failEarlyIt('Should change proficiency level of one skill', async () => {
        await CommonPageElements.objectPage.elements.editButton.click();
        await Qualifications.actions.navigateToQualifications();
        await Qualifications.qualifications.elements.tableTitle.click();
        await CudOperations.actions.clickDropdownBySiblingValue('skills', skillsInTable[1], 'proficiencyLevel_ID', 'MyProjectExperienceObjectPage');
        await CudOperations.actions.selectFromDropdown(proficiencyLevelNames[1]);
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        expect(Qualifications.actions.getProficiencyLevelName(proficiencyLevelNames[1]).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Should not change proficiency level to default proficiency level', async () => {
        CommonPageElements.objectPage.elements.editButton.click();
        await CudOperations.actions.changeValueInTable('MyProjectExperienceObjectPage', 'skills', proficiencyLevelNames[1], 'Not Set');
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        const errorMessageControl = await CommonPageElements.actions.getMessageErrorLink('Value "Not Set" does not exist.').isPresent();
        if (!errorMessageControl) {
            await CommonPageElements.objectPage.elements.footer.messageButton.click();
            expect(await CommonPageElements.actions.getMessageErrorLink('Value "Not Set" does not exist.').isPresent()).toBeTruthy();
        }
        const numberOferrorsinString = await CommonPageElements.actions.getMessageButtonState('Negative').asControl().getProperty('text');
        const numberOferrors = Number(numberOferrorsinString);
        expect(numberOferrors).toBeGreaterThan(0);
        expect(await CommonPageElements.actions.getMessageErrorLink('Value "Not Set" does not exist.').isPresent()).toBeTruthy();
        await CommonPageElements.objectPage.elements.footer.cancelButton.click();
        await CommonPageElements.objectPage.elements.footer.discardButton.click();
        expect(await Qualifications.actions.getProficiencyLevelName(proficiencyLevelNames[1]).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Should not change proficiency level to invalid proficiency level from another proficiency set', async () => {
        CommonPageElements.objectPage.elements.editButton.click();
        await CudOperations.actions.changeValueInTable('MyProjectExperienceObjectPage', 'skills', proficiencyLevelNames[1], proficiencyLevelNames[3]);
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
        await CudOperations.actions.changeValueInTable('MyProjectExperienceObjectPage', 'skills', proficiencyLevelNames[1], '');
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        const numberOferrorsinString = await CommonPageElements.actions.getMessageButtonState('Negative').asControl().getProperty('text');
        const numberOferrors = Number(numberOferrorsinString);
        expect(numberOferrors).toBeGreaterThan(0);
        expect(await CommonPageElements.actions.getMessageErrorLink('Enter an existing proficiency level.').isPresent()).toBeTruthy();
        await CommonPageElements.objectPage.elements.footer.cancelButton.click();
        await CommonPageElements.objectPage.elements.footer.discardButton.click();
        expect(await Qualifications.actions.getProficiencyLevelName(proficiencyLevelNames[1]).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Navigate to consultant profile and check prior experience', async () => {
        browser.wait(() => PriorExperience.parentElements.contentSection.isPresent(), 600000);
        PriorExperience.actions.navigateToPriorExperience();
        const RoleTitleText = await PriorExperience.priorExperience.elements.tableTitle.getText();
        expect(RoleTitleText.substring(0, 13)).toBe('Project Roles');
        const regexp = new RegExp('([3-9])|([1-9][0-9])');
        expect(regexp.test(RoleTitleText.substring(6))).toBeTruthy();
        expect(PriorExperience.actions.getRoleName(roles[0]).isPresent()).toBeTruthy();
        expect(PriorExperience.actions.getRoleName(roles[1]).isPresent()).toBeTruthy();
        expect(PriorExperience.actions.getRoleName(roles[4]).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Check the role popover', async () => {
        await PriorExperience.actions.clickOnARole(roles[0]);
        expect(PriorExperience.parentElements.rolePopover.rolecodeLabel.isPresent()).toBeTruthy();
        expect(PriorExperience.parentElements.rolePopover.rolecodeValue(projectRoles[0].code).isPresent()).toBeTruthy();
        expect(PriorExperience.parentElements.rolePopover.descriptionLabel.isPresent()).toBeTruthy();
        expect(PriorExperience.parentElements.rolePopover.descriptionValue(projectRoles[0].description).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Check roles value help', async () => {
        CommonPageElements.objectPage.elements.editButton.click();
        PriorExperience.actions.navigateToPriorExperience();
        await CudOperations.actions.openValueHelp('roles', 1);
        await PriorExperience.priorExperience.elements.roleValueHelpShowFiltersBtn.click();
        await PriorExperience.priorExperience.elements.valueHelpSearchInput_roles.sendKeys(testRunId);
        await PriorExperience.priorExperience.elements.valueHelpSearchPress_roles.click();
        expect(await PriorExperience.actions.checkRoleValueHelpTableData(projectRoles[0].name));
        expect(await PriorExperience.actions.checkRoleValueHelpTableData(projectRoles[1].name));
        expect(await PriorExperience.actions.checkRoleValueHelpTableData(projectRoles[2].name));
        expect(await PriorExperience.actions.checkRoleValueHelpTableData(projectRoles[3].name));
    });

    testHelper.failEarlyIt('Should not display restricted role in value help', async () => {
        await PriorExperience.priorExperience.elements.valueHelpCancelButton.click();
        await PriorExperience.actions.navigateToPriorExperience();
        expect(await PriorExperience.actions.searchValueInValueHelp('roles', roles[4])).toBe(0);
        await PriorExperience.priorExperience.elements.valueHelpCancelButton.click();
        await CommonPageElements.objectPage.elements.footer.cancelButton.click();
    });

    testHelper.failEarlyIt('Should display a restricted role in role table and delete the same', async () => {
        CommonPageElements.objectPage.elements.editButton.click();
        PriorExperience.actions.navigateToPriorExperience();
        // Delete
        await CudOperations.actions.delete('roles', roles[4]);
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
    });

    testHelper.failEarlyIt('Should create a new role and check the roles table for the same', async () => {
        CommonPageElements.objectPage.elements.editButton.click();
        PriorExperience.actions.navigateToPriorExperience();

        await CudOperations.actions.create('roles');
        PriorExperience.actions.navigateToPriorExperience();
        await CudOperations.actions.fillEmptyInputBox('roles', roles[2]);
        await PriorExperience.priorExperience.elements.tableTitle.click();
        PriorExperience.actions.navigateToPriorExperience();
        await CommonPageElements.objectPage.elements.footer.saveButton.click();

        const RoleTitleText = await PriorExperience.priorExperience.elements.tableTitle.getText();
        expect(RoleTitleText.substring(0, 13)).toBe('Project Roles');
        const regexp = new RegExp('([3-9])|([1-9][0-9])');
        expect(regexp.test(RoleTitleText.substring(6))).toBeTruthy();
        expect(PriorExperience.actions.getRoleName(roles[0]).isPresent()).toBeTruthy();
        expect(PriorExperience.actions.getRoleName(roles[1]).isPresent()).toBeTruthy();
        expect(PriorExperience.actions.getRoleName(roles[2]).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Should update the existing role to a new one', async () => {
        CommonPageElements.objectPage.elements.editButton.click();
        PriorExperience.actions.navigateToPriorExperience();
        await CudOperations.actions.changeValueOfTheRow('roles', roles[2], roles[3]);
        await CommonPageElements.objectPage.elements.footer.saveButton.click();

        const RoleTitleText = await PriorExperience.priorExperience.elements.tableTitle.getText();
        expect(RoleTitleText.substring(0, 13)).toBe('Project Roles');
        const regexp = new RegExp('([3-9])|([1-9][0-9])');
        expect(regexp.test(RoleTitleText.substring(6))).toBeTruthy();
        expect(PriorExperience.actions.getRoleName(roles[0]).isPresent()).toBeTruthy();
        expect(PriorExperience.actions.getRoleName(roles[1]).isPresent()).toBeTruthy();
        expect(PriorExperience.actions.getRoleName(roles[3]).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Should delete a role and check the roles table for the same', async () => {
        CommonPageElements.objectPage.elements.editButton.click();
        PriorExperience.actions.navigateToPriorExperience();
        await CudOperations.actions.delete('roles', roles[3]);
        await CommonPageElements.objectPage.elements.footer.saveButton.click();

        const RoleTitleText = await PriorExperience.priorExperience.elements.tableTitle.getText();
        expect(RoleTitleText.substring(0, 13)).toBe('Project Roles');
        const regexp = new RegExp('([2-9])|([1-9][0-9])');
        expect(regexp.test(RoleTitleText.substring(6))).toBeTruthy();
        expect(PriorExperience.actions.getRoleName(roles[3]).isPresent()).toBeFalsy();
    });

    testHelper.failEarlyIt('Should not assign an duplicate/random/empty role and delete a role in draft saved state', async () => {
        CommonPageElements.objectPage.elements.editButton.click();
        PriorExperience.actions.navigateToPriorExperience();
        await CudOperations.actions.create('roles');
        await CudOperations.actions.fillEmptyInputBox('roles', roles[0]);
        await PriorExperience.priorExperience.elements.tableTitle.click();
        await CudOperations.actions.create('roles');
        await CudOperations.actions.fillEmptyInputBox('roles', 'randomRole');
        await PriorExperience.priorExperience.elements.tableTitle.click();
        await CudOperations.actions.create('roles');
        await CommonPageElements.objectPage.elements.footer.saveButton.click();

        expect(await CommonPageElements.actions.getMessageButtonState('Negative').asControl().getProperty('text')).toBe('3');
        expect(await CommonPageElements.actions.getMessageErrorList('Delete the duplicate role.').isPresent()).toBeTruthy();
        expect(await CommonPageElements.actions.getMessageErrorList('Select an existing role from the value help.').isPresent()).toBeTruthy();
        expect(await CommonPageElements.actions.getMessageErrorList('Select a role or delete the line.').isPresent()).toBeTruthy();

        await CommonPageElements.objectPage.elements.footer.messageButton.click();
        await CudOperations.actions.delete('roles', '');

        let RoleTitleText = await PriorExperience.priorExperience.elements.tableTitle.getText();
        expect(RoleTitleText.substring(0, 13)).toBe('Project Roles');
        let regexp = new RegExp('([4-9])|([1-9][0-9])');
        expect(regexp.test(RoleTitleText.substring(6))).toBeTruthy();

        await CommonPageElements.objectPage.elements.footer.cancelButton.click();
        await CommonPageElements.objectPage.elements.footer.discardButton.click();
        PriorExperience.actions.navigateToPriorExperience();

        RoleTitleText = await PriorExperience.priorExperience.elements.tableTitle.getText();
        expect(RoleTitleText.substring(0, 13)).toBe('Project Roles');
        regexp = new RegExp('([2-9])|([1-9][0-9])');
        expect(regexp.test(RoleTitleText.substring(6))).toBeTruthy();
        expect(PriorExperience.actions.getRoleName(roles[0]).isPresent()).toBeTruthy();
        expect(PriorExperience.actions.getRoleName(roles[1]).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Should not assign a role as guid and check the roles table for the same', async () => {
        CommonPageElements.objectPage.elements.editButton.click();
        PriorExperience.actions.navigateToPriorExperience();
        await CudOperations.actions.create('roles');
        await CudOperations.actions.fillEmptyInputBox('roles', 'b08aabdf-6dcb-4df7-b319-b440f073e6dc');
        await PriorExperience.priorExperience.elements.tableTitle.click();
        let RoleTitleText = await PriorExperience.priorExperience.elements.tableTitle.getText();
        expect(RoleTitleText.substring(0, 13)).toBe('Project Roles');
        let regexp = new RegExp('([3-9])|([1-9][0-9])');
        expect(regexp.test(RoleTitleText.substring(6))).toBeTruthy();
        await PriorExperience.priorExperience.elements.tableTitle.click();
        const errorMessageControl = await CommonPageElements.actions.getMessageErrorLink('Select an existing role from the value help.').isPresent();
        if (!errorMessageControl) {
            await CommonPageElements.objectPage.elements.footer.messageButton.click();
            expect(await CommonPageElements.actions.getMessageErrorLink('Select an existing role from the value help.').isPresent()).toBeTruthy();
        }
        expect(await CommonPageElements.actions.getMessageButtonState('Negative').asControl().getProperty('text')).toBe('1');
        expect(await CommonPageElements.actions.getMessageErrorLink('Select an existing role from the value help.').isPresent()).toBeTruthy();
        await CommonPageElements.objectPage.elements.footer.cancelButton.click();
        await CommonPageElements.objectPage.elements.footer.discardButton.click();
        PriorExperience.actions.navigateToPriorExperience();

        RoleTitleText = await PriorExperience.priorExperience.elements.tableTitle.getText();
        expect(RoleTitleText.substring(0, 13)).toBe('Project Roles');
        regexp = new RegExp('([2-9])|([1-9][0-9])');
        expect(regexp.test(RoleTitleText.substring(6))).toBeTruthy();
        expect(PriorExperience.actions.getRoleName(roles[0]).isPresent()).toBeTruthy();
        expect(PriorExperience.actions.getRoleName(roles[1]).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Should not assign a role as more than guid length and check the roles table for the same', async () => {
        CommonPageElements.objectPage.elements.editButton.click();
        PriorExperience.actions.navigateToPriorExperience();
        await CudOperations.actions.create('roles');
        await CudOperations.actions.fillEmptyInputBox('roles', 'b08aabdf-6dcb-4df7-b319-b440f073e6dcaswdvc');
        PriorExperience.priorExperience.elements.tableTitle.click();
        const errorMessageControl = await CommonPageElements.actions.getMessageErrorLink('Select an existing role from the value help.').isPresent();
        if (!errorMessageControl) {
            await CommonPageElements.objectPage.elements.footer.messageButton.click();
            expect(await CommonPageElements.actions.getMessageErrorLink('Select an existing role from the value help.').isPresent()).toBeTruthy();
        }
        expect(await CommonPageElements.actions.getMessageButtonState('Negative').asControl().getProperty('text')).toBe('1');
        expect(await CommonPageElements.actions.getMessageErrorLink('Select an existing role from the value help.').isPresent()).toBeTruthy();

        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        const errorMessageControlSave = await CommonPageElements.actions.getMessageErrorLink('Select an existing role from the value help.').isPresent();
        if (!errorMessageControlSave) {
            await CommonPageElements.objectPage.elements.footer.messageButton.click();
            expect(await CommonPageElements.actions.getMessageErrorLink('Select an existing role from the value help.').isPresent()).toBeTruthy();
        }
        expect(await CommonPageElements.actions.getMessageButtonState('Negative').asControl().getProperty('text')).toBe('1');
        expect(await CommonPageElements.actions.getMessageErrorLink('Select an existing role from the value help.').isPresent()).toBeTruthy();

        await CommonPageElements.objectPage.elements.footer.cancelButton.click();
        await CommonPageElements.objectPage.elements.footer.discardButton.click();
        PriorExperience.actions.navigateToPriorExperience();
        const RoleTitleText = await PriorExperience.priorExperience.elements.tableTitle.getText();
        expect(RoleTitleText.substring(0, 13)).toBe('Project Roles');
        const regexp = new RegExp('([2-9])|([1-9][0-9])');
        expect(regexp.test(RoleTitleText.substring(6))).toBeTruthy();
        expect(PriorExperience.actions.getRoleName(roles[0]).isPresent()).toBeTruthy();
        expect(PriorExperience.actions.getRoleName(roles[1]).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Should add a new role by entering role name in the input field', async () => {
        CommonPageElements.objectPage.elements.editButton.click();
        PriorExperience.actions.navigateToPriorExperience();
        await CudOperations.actions.create('roles');
        await CudOperations.actions.fillEmptyInputBox('roles', roles[2]);
        await PriorExperience.priorExperience.elements.tableTitle.click();
        PriorExperience.actions.navigateToPriorExperience();
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        PriorExperience.actions.navigateToPriorExperience();

        const RoleTitleText = await PriorExperience.priorExperience.elements.tableTitle.getText();
        expect(RoleTitleText.substring(0, 13)).toBe('Project Roles');
        const regexp = new RegExp('([3-9])|([1-9][0-9])');
        expect(regexp.test(RoleTitleText.substring(6))).toBeTruthy();
        expect(PriorExperience.actions.getRoleName(roles[0]).isPresent()).toBeTruthy();
        expect(PriorExperience.actions.getRoleName(roles[1]).isPresent()).toBeTruthy();
        expect(PriorExperience.actions.getRoleName(roles[2]).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Should delete many roles', async () => {
        CommonPageElements.objectPage.elements.editButton.click();
        PriorExperience.actions.navigateToPriorExperience();
        await CudOperations.actions.deleteMany('roles', 2, [roles[0], roles[2]]);
        const RoleTitleText = await PriorExperience.priorExperience.elements.tableTitle.getText();
        expect(RoleTitleText.substring(0, 13)).toBe('Project Roles');
        const regexp = new RegExp('([1-9])|([1-9][0-9])');
        expect(regexp.test(RoleTitleText.substring(6))).toBeTruthy();
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        expect(PriorExperience.actions.getRoleName(roles[0]).isPresent()).toBeFalsy();
        expect(PriorExperience.actions.getRoleName(roles[2]).isPresent()).toBeFalsy();
        expect(PriorExperience.actions.getRoleName(roles[1]).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Navigate to consultant profile and check availability', async () => {
        await Availability.actions.navigateToAvailability();
        expect(Availability.actions.getHeaderInfo()).toBe('Monthly Availability (6)');
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

        Availability.assertions.checkAvailabilityData(0, `${getMonthName(currentMonthYear.getMonth())}, ${currentMonthYear.getFullYear()}`, '-20', '0', '-20', '0');
        Availability.assertions.checkAvailabilityData(1, `${getMonthName(currentPlusOneMonthYear.getMonth())}, ${currentPlusOneMonthYear.getFullYear()}`, '40', '0', '40', '0');
        Availability.assertions.checkAvailabilityData(2, `${getMonthName(currentPlusTwoMonthYear.getMonth())}, ${currentPlusTwoMonthYear.getFullYear()}`, '40', '0', '40', '0');
        Availability.assertions.checkAvailabilityData(3, `${getMonthName(currentPlusThreeMonthYear.getMonth())}, ${currentPlusThreeMonthYear.getFullYear()}`, '40', '0', '40', '0');
        Availability.assertions.checkAvailabilityData(4, `${getMonthName(currentPlusFourMonthYear.getMonth())}, ${currentPlusFourMonthYear.getFullYear()}`, '40', '0', '40', '0');
        Availability.assertions.checkAvailabilityData(5, `${getMonthName(currentPlusFiveMonthYear.getMonth())}, ${currentPlusFiveMonthYear.getFullYear()}`, '40', '0', '40', '0');
    });

    testHelper.failEarlyIt('Should navigate to Internal Work Experience and check table data', async () => {
        await ProjectHistory.actions.navigateToProjectHistory('Internal Work Experience');

        const now = new Date(Date.now());
        const currentMonthStart = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
        const nowPlusOneMonthStart = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 1));
        const nowPlusTwoMonthsStart = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 2, 1));
        const startDate = currentMonthStart.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        const endDate = nowPlusOneMonthStart.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        const endDate2 = nowPlusTwoMonthsStart.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

        expect(ProjectHistory.parentElements.assignmentsTableTitle('internalWorkExperience').getText()).toBe('Assignments (2)');
        ProjectHistory.parentElements.iExecuteShowDetails.click();
        await ProjectHistory.assertions.checkInternalExperienceTableData(0, 'Concept and Design', resourceRequestData[1].displayId, roles[2], resourceOrganizations[1].name, 'iTelO', endDate, endDate2, 'Hard-Booked');
        await ProjectHistory.assertions.checkInternalExperienceTableData(1, 'Design', resourceRequestData[0].displayId, roles[0], resourceOrganizations[0].name, 'John & Smith Co', startDate, endDate, 'Soft-Booked');
        ProjectHistory.parentElements.iExecuteHideDetails.click();
    });

    testHelper.failEarlyIt('Should select workItem from Internal Work Experience personalizaton dialog and check table data', async () => {
        expect(ProjectHistory.parentElements.assignmentsTableTitle('internalWorkExperience').getText()).toBe('Assignments (2)');
        const now = new Date(Date.now());
        const currentMonthStart = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
        const nowPlusOneMonthStart = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 1));
        const nowPlusTwoMonthsStart = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 2, 1));
        const startDate = currentMonthStart.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        const endDate = nowPlusOneMonthStart.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        const endDate2 = nowPlusTwoMonthsStart.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

        ProjectHistory.parentElements.settingsButton('internalWorkExperience').click();
        ProjectHistory.parentElements.workItemOption.click();
        ProjectHistory.parentElements.settingsOkButton.click();
        ProjectHistory.parentElements.iExecuteShowDetails.click();
        await ProjectHistory.assertions.checkInternalExperienceTableData(0, 'Concept and Design', resourceRequestData[1].displayId, roles[2], resourceOrganizations[1].name, 'iTelO', endDate, endDate2, 'Hard-Booked', 'workItem2');
        await ProjectHistory.assertions.checkInternalExperienceTableData(1, 'Design', resourceRequestData[0].displayId, roles[0], resourceOrganizations[0].name, 'John & Smith Co', startDate, endDate, 'Soft-Booked', 'workItem1');
        ProjectHistory.parentElements.iExecuteHideDetails.click();
    });

    testHelper.failEarlyIt('Should navigate to internal work experience project details and check general information data', async () => {
        await CommonPageElements.objectPage.elements.editButton.click();
        await ProjectHistory.actions.navigateToProjectHistory('Internal Work Experience');
        await ProjectHistory.actions.navigateToRequestName('Design');
        await ProjectHistory.parentElements.buttonInAnchorBar('InternalWorkExperience', 'GeneralInformation').click();

        const now = new Date(Date.now());
        const currentMonthStart = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
        const nowPlusOneMonthStart = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 1));
        const startDate = currentMonthStart.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        const endDate = nowPlusOneMonthStart.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

        expect(ProjectHistory.parentElements.titleIntExp('Design', 'InternalWorkExperience').isPresent()).toBeTruthy();
        ProjectHistory.assertions.checkIntWorkExpFieldValue('workItemName', 'workItem1');
        ProjectHistory.assertions.checkIntWorkExpFieldValue('requestDisplayId', resourceRequestData[0].displayId);
        ProjectHistory.assertions.checkIntWorkExpFieldValue('customerName', 'John & Smith Co');
        ProjectHistory.assertions.checkIntWorkExpFieldValue('rolePlayed', roles[0]);
        ProjectHistory.assertions.checkIntWorkExpFieldValue('companyName', resourceOrganizations[0].name);
        ProjectHistory.assertions.checkIntWorkExpFieldValue('convertedAssignedCapacity', '40.00 hr');
        ProjectHistory.assertions.checkIntWorkExpFieldValue('startDate', startDate);
        ProjectHistory.assertions.checkIntWorkExpFieldValue('endDate', endDate);
        ProjectHistory.assertions.checkIntWorkExpFieldValue('assignmentStatus', 'Soft-Booked');
    });

    testHelper.failEarlyIt("Should navigate to Internal Work Experience assignment's skills section and check skill data with popover", async () => {
        await ProjectHistory.parentElements.buttonInAnchorBar('InternalWorkExperience', 'InternalWorkExperienceSkills').click();

        expect(ProjectHistory.parentElements.skillsTableTitle('InternalWorkExperience', 'internalWorkExperienceSkills').getText()).toBe('Skills (1)');
        expect(ProjectHistory.actions.getIntWorkExpSkillName('InternalWorkExperience', 'internalWorkExperienceSkills', skillsInTable[0]).isPresent()).toBe(true);
        expect(ProjectHistory.actions.getIntWorkExpProficiencyLevel('InternalWorkExperience', 'internalWorkExperienceSkills', proficiencyLevelNames[1]).isPresent()).toBe(true);

        await ProjectHistory.actions.clickOnASkill('InternalWorkExperience', 'internalWorkExperienceSkills', skillsInTable[0]);
        expect(ProjectHistory.parentElements.skillPopover.descriptionLabel.isPresent()).toBeTruthy();
        expect(ProjectHistory.parentElements.skillPopover.descriptionValue(skills[0].description).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Should navigate to internal work experience project details and check skill count', async () => {
        await CommonPageElements.objectPage.elements.backButton.click();
        await ProjectHistory.actions.navigateToProjectHistory('Internal Work Experience');
        await ProjectHistory.actions.navigateToRequestName('Concept and Design');
        await ProjectHistory.parentElements.buttonInAnchorBar('InternalWorkExperience', 'InternalWorkExperienceSkills').click();

        expect(ProjectHistory.parentElements.skillsTableTitle('InternalWorkExperience', 'internalWorkExperienceSkills').getText()).toBe('Skills');
    });

    testHelper.failEarlyIt('Check availability and internal work experience data in edit mode', async () => {
        await CommonPageElements.objectPage.elements.backButton.click();

        const now = new Date(Date.now());
        const currentMonthStart = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
        const nowPlusOneMonthStart = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 1));
        const startDate = currentMonthStart.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        const endDate = nowPlusOneMonthStart.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        ProjectHistory.parentElements.iExecuteShowDetails.click();
        await ProjectHistory.assertions.checkInternalExperienceTableData(1, 'Design', resourceRequestData[0].displayId, roles[0], resourceOrganizations[0].name, 'John & Smith Co', startDate, endDate, 'Soft-Booked', 'workItem1');
        ProjectHistory.parentElements.iExecuteHideDetails.click();
        Availability.actions.navigateToAvailability();

        const currentMonthYear = new Date();
        currentMonthYear.setDate(1);
        Availability.assertions.checkAvailabilityData(0, `${getMonthName(currentMonthYear.getMonth())}, ${currentMonthYear.getFullYear()}`, '-20', '0', '-20', '0');
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
    });

    testHelper.failEarlyIt('Should navigate to External Work Experience and check table data', async () => {
        await ProjectHistory.actions.navigateToProjectHistory('External Work Experience');
        expect(ProjectHistory.parentElements.assignmentsTableTitle('externalWorkExperience').getText()).toBe('Assignments (2)');
        ProjectHistory.assertions.checkTableData('externalWorkExperience', 0, 'Internal Sales', 'Sales Consultant', 'IBM India', 'Internal', 'Feb 20, 2010', 'Oct 17, 2012');
        ProjectHistory.assertions.checkTableData('externalWorkExperience', 1, 'Nike SD', 'ABAP Consultant', 'MAS', 'Nike Sports', 'Mar 26, 2009', 'Nov 20, 2013');
    });

    testHelper.failEarlyIt('Should navigate to External work experience project details and check general information data', async () => {
        await ProjectHistory.actions.navigateToProjectName('ExternalWorkExperience', 'Internal Sales');
        await ProjectHistory.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'GeneralInformation').click();

        expect(ProjectHistory.parentElements.title('Internal Sales', 'ExternalWorkExperience').isPresent()).toBeTruthy();
        ProjectHistory.assertions.checkExtWorkExpFieldValue('projectName', 'Internal Sales');
        ProjectHistory.assertions.checkExtWorkExpFieldValue('customer', 'Internal');
        ProjectHistory.assertions.checkExtWorkExpFieldValue('rolePlayed', 'Sales Consultant');
        ProjectHistory.assertions.checkExtWorkExpFieldValue('companyName', 'IBM India');
        ProjectHistory.assertions.checkExtWorkExpFieldValue('startDate', 'Feb 20, 2010');
        ProjectHistory.assertions.checkExtWorkExpFieldValue('endDate', 'Oct 17, 2012');
    });

    testHelper.failEarlyIt("Should navigate to External Work Experience assignment's skills section and check skill data", async () => {
        await ProjectHistory.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();

        expect(ProjectHistory.parentElements.skillsTableTitle('ExternalWorkExperience', 'externalWorkExperienceSkills').getText()).toBe('Skills (1)');
        expect(ProjectHistory.actions.getSkillName('ExternalWorkExperience', 'externalWorkExperienceSkills', skillsOnly[2]).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt("Should navigate to External Work Experience assignment's comments section and check the text", async () => {
        await ProjectHistory.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'Comments').click();

        expect(ProjectHistory.actions.getComment('ExternalWorkExperience', externalWorkExperiences[0].comments).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Should assign a new skill in External Work Experience project details page and check its proficiency levels in the value help', async () => {
        CommonPageElements.objectPage.elements.backButton.click();
        CommonPageElements.objectPage.elements.editButton.click();
        await ProjectHistory.actions.navigateToProjectHistory('External Work Experience');
        await ProjectHistory.actions.navigateToProjectNameInEditMode('ExternalWorkExperience', 'Internal Sales');
        await ProjectHistory.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();
        await CudOperations.actions.createSkillRow();
        await ProjectHistory.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();
        await CudOperations.actions.assignSkill('', skillsOnly[0]);
        await ProjectHistory.parentElements.skillsTableTitle('ExternalWorkExperience', 'externalWorkExperienceSkills').click();
        await CudOperations.actions.clickDropdownBySiblingValue('externalWorkExperienceSkills', skillsOnly[0], 'proficiencyLevel_ID', 'ExternalWorkExperienceObjectPage');
        await ProjectHistory.assertions.checkProficiencyLevelValueHelpTableData(0, proficiencyLevels[0].name, proficiencyLevels[0].description);
        await ProjectHistory.assertions.checkProficiencyLevelValueHelpTableData(0, proficiencyLevels[0].name, proficiencyLevels[0].description);
    });

    testHelper.failEarlyIt('Should select a proficiency in External Work Experience project details page, save the skill and check the skills table for the same', async () => {
        await CudOperations.actions.selectFromDropdown(proficiencyLevelNames[0]);
        await CommonPageElements.objectPage.elements.footer.applyButton.click();
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        await ProjectHistory.actions.navigateToProjectHistory('External Work Experience');
        await ProjectHistory.actions.navigateToProjectName('ExternalWorkExperience', 'Internal Sales');
        await ProjectHistory.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();

        expect(ProjectHistory.actions.getSkillValues('ExternalWorkExperience', 'externalWorkExperienceSkills').count()).toBeGreaterThan(1);
        expect(ProjectHistory.actions.getSkillName('ExternalWorkExperience', 'externalWorkExperienceSkills', skillsOnly[0]).isPresent()).toBeTruthy();
        expect(ProjectHistory.actions.getProficiencyLevelName('ExternalWorkExperience', 'externalWorkExperienceSkills', proficiencyLevels[0].name).isPresent()).toBeTruthy();
        expect(ProjectHistory.actions.getSkillName('ExternalWorkExperience', 'externalWorkExperienceSkills', skillsOnly[2]).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Should not assign an empty/random/duplicate skill in External Work Experience project and discard the change', async () => {
        CommonPageElements.objectPage.elements.backButton.click();
        CommonPageElements.objectPage.elements.editButton.click();
        await ProjectHistory.actions.navigateToProjectHistory('External Work Experience');
        await ProjectHistory.actions.navigateToProjectNameInEditMode('ExternalWorkExperience', 'Internal Sales');
        await ProjectHistory.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();
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
        await ProjectHistory.actions.navigateToProjectHistory('External Work Experience');
        await ProjectHistory.actions.navigateToProjectNameInEditMode('ExternalWorkExperience', 'Internal Sales');
        await ProjectHistory.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();
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
        await ProjectHistory.actions.navigateToProjectHistory('External Work Experience');
        await ProjectHistory.actions.navigateToProjectNameInEditMode('ExternalWorkExperience', 'Internal Sales');
        await ProjectHistory.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();
        await CudOperations.actions.assignSkill(skillsOnly[0], skillsOnly[1]);
        await ProjectHistory.parentElements.skillsTableTitle('ExternalWorkExperience', 'externalWorkExperienceSkills').click();
        await CudOperations.actions.clickDropdownBySiblingValue('externalWorkExperienceSkills', skillsOnly[1], 'proficiencyLevel_ID', 'ExternalWorkExperienceObjectPage');
        await CudOperations.actions.selectFromDropdown(proficiencyLevelTexts[0].name);
        await CommonPageElements.objectPage.elements.footer.applyButton.click();
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        await ProjectHistory.actions.navigateToProjectHistory('External Work Experience');
        await ProjectHistory.actions.navigateToProjectName('ExternalWorkExperience', 'Internal Sales');
        await ProjectHistory.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();

        expect(ProjectHistory.actions.getSkillValues('ExternalWorkExperience', 'externalWorkExperienceSkills').count()).toBeGreaterThan(1);
        expect(ProjectHistory.actions.getSkillName('ExternalWorkExperience', 'externalWorkExperienceSkills', skillsOnly[1]).isPresent()).toBeTruthy();
        expect(ProjectHistory.actions.getSkillName('ExternalWorkExperience', 'externalWorkExperienceSkills', skillsOnly[0]).isPresent()).toBeFalsy();
    });

    testHelper.failEarlyIt('Should delete existing skill in External Work Experience project details page', async () => {
        CommonPageElements.objectPage.elements.backButton.click();
        CommonPageElements.objectPage.elements.editButton.click();
        await ProjectHistory.actions.navigateToProjectHistory('External Work Experience');
        await ProjectHistory.actions.navigateToProjectNameInEditMode('ExternalWorkExperience', 'Internal Sales');
        await ProjectHistory.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();
        await CudOperations.actions.deleteSkill(skillsOnly[1]);
        await CommonPageElements.objectPage.elements.footer.applyButton.click();
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        await ProjectHistory.actions.navigateToProjectHistory('External Work Experience');
        await ProjectHistory.actions.navigateToProjectName('ExternalWorkExperience', 'Internal Sales');
        await ProjectHistory.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();

        expect(ProjectHistory.parentElements.skillsTableTitle('ExternalWorkExperience', 'externalWorkExperienceSkills').getText()).toBe('Skills (1)');
        expect(ProjectHistory.actions.getSkillName('ExternalWorkExperience', 'externalWorkExperienceSkills', skillsOnly[1]).isPresent()).toBeFalsy();
        expect(ProjectHistory.actions.getSkillName('ExternalWorkExperience', 'externalWorkExperienceSkills', skillsOnly[2]).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Should create a new External Work Experience and navigate to project details page', async () => {
        CommonPageElements.objectPage.elements.backButton.click();
        await CommonPageElements.objectPage.elements.editButton.click();
        await ProjectHistory.actions.navigateToProjectHistory('External Work Experience');
        await CudOperations.actions.create('externalWorkExperience');
        await CudOperations.actions.setValue('UiVerfier', workExperienceIDs.externalDraft.assignment);
        await CudOperations.actions.setValue('Customer 1', workExperienceIDs.externalDraft.customer);
        await CudOperations.actions.setValue('Jan 1, 1900', workExperienceIDs.externalDraft.startDate);
        await CudOperations.actions.setValue('Dec 1, 1900', workExperienceIDs.externalDraft.endDate);
        await CudOperations.actions.setValue('Company', workExperienceIDs.externalDraft.company);
        await CudOperations.actions.setValue('Role text', workExperienceIDs.externalDraft.role);
        await ProjectHistory.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();
        await CudOperations.actions.createSkillRow();
        await CudOperations.actions.assignSkill('', skillsOnly[0]);
        await ProjectHistory.parentElements.skillsTableTitle('ExternalWorkExperience', 'externalWorkExperienceSkills').click();
        await CudOperations.actions.clickDropdownBySiblingValue('externalWorkExperienceSkills', skillsOnly[0], 'proficiencyLevel_ID', 'ExternalWorkExperienceObjectPage');
        await CudOperations.actions.selectFromDropdown(proficiencyLevelNames[0]);
        await CommonPageElements.objectPage.elements.footer.applyButton.click();
        await CommonPageElements.objectPage.elements.footer.saveButton.click();

        await ProjectHistory.actions.navigateToProjectHistory('External Work Experience');
        expect(await ProjectHistory.parentElements.assignmentsTableTitle('externalWorkExperience').getText()).toBe('Assignments (3)');
        await ProjectHistory.assertions.checkTableData('externalWorkExperience', 2, 'UiVerfier', 'Role text', 'Company', 'Customer 1', 'Jan 1, 1900', 'Dec 1, 1900');

        await ProjectHistory.actions.navigateToProjectName('ExternalWorkExperience', 'UiVerfier');
        await ProjectHistory.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();

        expect(ProjectHistory.parentElements.skillsTableTitle('ExternalWorkExperience', 'externalWorkExperienceSkills').getText()).toBe('Skills (1)');
        expect(ProjectHistory.actions.getSkillName('ExternalWorkExperience', 'externalWorkExperienceSkills', skillsOnly[0]).isPresent()).toBeTruthy();
    });

    // EXTERNAL WORK PROFICIENCY TESTS
    testHelper.failEarlyIt('Should change proficiency level of one external work experience skill', async () => {
        CommonPageElements.objectPage.elements.backButton.click();
        CommonPageElements.objectPage.elements.editButton.click();
        await ProjectHistory.actions.navigateToProjectHistory('External Work Experience');
        await ProjectHistory.actions.navigateToProjectNameInEditMode('ExternalWorkExperience', 'Internal Sales');
        await ProjectHistory.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();
        await CudOperations.actions.assignSkill(skillsOnly[2], skills[3].name);
        await ProjectHistory.parentElements.skillsTableTitle('ExternalWorkExperience', 'externalWorkExperienceSkills').click();
        await CudOperations.actions.clickDropdownBySiblingValue('externalWorkExperienceSkills', skills[3].name, 'proficiencyLevel_ID', 'ExternalWorkExperienceObjectPage');
        await CudOperations.actions.selectFromDropdown(proficiencyLevelTexts[1].name);

        await CommonPageElements.objectPage.elements.footer.applyButton.click();
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        await ProjectHistory.actions.navigateToProjectHistory('External Work Experience');
        await ProjectHistory.actions.navigateToProjectName('ExternalWorkExperience', 'Internal Sales');
        await ProjectHistory.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();

        expect(ProjectHistory.parentElements.skillsTableTitle('ExternalWorkExperience', 'externalWorkExperienceSkills').getText()).toBe('Skills (1)');
        expect(ProjectHistory.actions.getSkillName('ExternalWorkExperience', 'externalWorkExperienceSkills', skills[3].name).isPresent()).toBeTruthy();
        expect(ProjectHistory.actions.getProficiencyLevelName('ExternalWorkExperience', 'externalWorkExperienceSkills', proficiencyLevelTexts[1].name).isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Should not change proficiency level to empty value for external work experience skill', async () => {
        CommonPageElements.objectPage.elements.backButton.click();
        CommonPageElements.objectPage.elements.editButton.click();
        await ProjectHistory.actions.navigateToProjectHistory('External Work Experience');
        await ProjectHistory.actions.navigateToProjectNameInEditMode('ExternalWorkExperience', 'Internal Sales');
        await ProjectHistory.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();
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
        await ProjectHistory.actions.navigateToProjectHistory('External Work Experience');
        await ProjectHistory.actions.navigateToProjectNameInEditMode('ExternalWorkExperience', 'Internal Sales');
        await ProjectHistory.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();
        await CudOperations.actions.changeValueInTable('ExternalWorkExperienceObjectPage', 'externalWorkExperienceSkills', proficiencyLevelNames[1], 'Not Set');

        await ProjectHistory.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();
        await CommonPageElements.objectPage.elements.footer.applyButton.click();

        // Error Message by FE (frontend only), hence already at the Subobject Page
        expect(await CommonPageElements.actions.getMessageButtonStateExternalWorkExperience('Negative').asControl().getProperty('text')).toBe('1');
        expect(await CommonPageElements.actions.getMessageErrorLink('Value "Not Set" does not exist.').isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Should not change proficiency level to proficiency level of another set external work experience skill', async () => {
        await CudOperations.actions.changeErrorValueInTable('ExternalWorkExperienceObjectPage', 'externalWorkExperienceSkills', proficiencyLevelNames[3]);

        await ProjectHistory.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();
        await CommonPageElements.objectPage.elements.footer.applyButton.click();

        // Error Message by FE (frontend only), hence already at the Subobject Page
        expect(await CommonPageElements.actions.getMessageButtonStateExternalWorkExperience('Negative').asControl().getProperty('text')).toBe('1');
        expect(await CommonPageElements.actions.getMessageErrorLink(`Value "${proficiencyLevelNames[3]}" does not exist.`).isPresent()).toBeTruthy();

        // Restore to a good state, go back to Object Page and cancel editing
        await CudOperations.actions.changeErrorValueInTable('ExternalWorkExperienceObjectPage', 'externalWorkExperienceSkills', proficiencyLevelNames[1]);
        await ProjectHistory.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();
        await CommonPageElements.objectPage.elements.footer.applyButton.click();
        await CommonPageElements.objectPage.elements.footer.cancelButton.click();
        await CommonPageElements.objectPage.elements.footer.discardButton.click();
    });

    testHelper.failEarlyIt('Should delete multiple External Work Experience assignments', async () => {
        CommonPageElements.objectPage.elements.editButton.click();
        await ProjectHistory.actions.navigateToProjectHistory('External Work Experience');
        await CudOperations.actions.deleteMany('externalWorkExperience', 2, ['Internal Sales', 'Nike SD']);
        await CommonPageElements.objectPage.elements.footer.saveButton.click();

        await ProjectHistory.actions.navigateToProjectHistory('External Work Experience');
        expect(ProjectHistory.parentElements.assignmentsTableTitle('externalWorkExperience').getText()).toBe('Assignments (1)');
        expect(ProjectHistory.actions.getAssignment('externalWorkExperience', 'Internal Sales').isPresent()).toBeFalsy();
        expect(ProjectHistory.actions.getAssignment('externalWorkExperience', 'Nike SD').isPresent()).toBeFalsy();
    });

    testHelper.failEarlyIt('Should see an error mesage on saving external work exp assignment without entering project name and start date', async () => {
        CommonPageElements.objectPage.elements.editButton.click();
        await ProjectHistory.actions.navigateToProjectHistory('External Work Experience');
        await CudOperations.actions.create('externalWorkExperience');
        await CudOperations.actions.setValue('Customer', workExperienceIDs.externalDraft.customer);
        await CudOperations.actions.setValue('Dec 1, 2020', workExperienceIDs.externalDraft.endDate);
        await CudOperations.actions.setValue('Company Mandatory', workExperienceIDs.externalDraft.company);
        await CudOperations.actions.setValue('Role Mandatory', workExperienceIDs.externalDraft.role);
        await ProjectHistory.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();
        await CommonPageElements.objectPage.elements.footer.applyButton.click();
        await CommonPageElements.objectPage.elements.footer.saveButton.click();
        expect(await CommonPageElements.actions.getMessageButtonState('Negative').asControl().getProperty('text')).toBe('2');
        expect(await CommonPageElements.actions.getMessageErrorList('Enter a project name.').isPresent()).toBeTruthy();
        expect(await CommonPageElements.actions.getMessageErrorList('Enter a start date.').isPresent()).toBeTruthy();
    });

    testHelper.failEarlyIt('Should see an error message on saving external work exp assignment with end date before the start date', async () => {
        await ProjectHistory.actions.navigateToProjectNameInEditMode('ExternalWorkExperience', '');
        await CudOperations.actions.setValue('Project Name Mandatory', workExperienceIDs.externalDraft.assignment, true);
        await CudOperations.actions.setValue('Jan 1, 2020', workExperienceIDs.externalDraft.startDate, true);
        await CudOperations.actions.setValue('Dec 1, 2019', workExperienceIDs.externalDraft.endDate, true);
        await ProjectHistory.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();
        await CommonPageElements.objectPage.elements.footer.applyButton.click();
        await CommonPageElements.objectPage.elements.footer.saveButton.click();

        expect(await CommonPageElements.actions.getMessageButtonState('Negative').asControl().getProperty('text')).toBe('1');
        expect(await CommonPageElements.actions.getMessageErrorLink('The start date must be before the end date.').isPresent()).toBeTruthy();
        await CommonPageElements.objectPage.elements.footer.cancelButton.click();
        await CommonPageElements.objectPage.elements.footer.discardButton.click();
        expect(CommonPageElements.objectPage.elements.editButton.isPresent()).toBeTruthy();
        expect(ProjectHistory.actions.getAssignment('externalWorkExperience', 'Project Name Mandatory').isPresent()).toBeFalsy();
    });

    testHelper.failEarlyIt('Should update External Work Experience assignment details', async () => {
        await CommonPageElements.objectPage.elements.editButton.click();
        await ProjectHistory.actions.navigateToProjectHistory('External Work Experience');
        await ProjectHistory.actions.navigateToProjectNameInEditMode('ExternalWorkExperience', 'UiVerfier');
        await CudOperations.actions.setValue('New ProjectName', workExperienceIDs.externalDraft.assignment, true);
        await CudOperations.actions.setValue('New Customer', workExperienceIDs.externalDraft.customer, true);
        await CudOperations.actions.setValue('New Role', workExperienceIDs.externalDraft.role, true);
        await CudOperations.actions.setValue('New Company', workExperienceIDs.externalDraft.company, true);
        await CudOperations.actions.setValue('Dec 1, 2020', workExperienceIDs.externalDraft.startDate, true);
        await CudOperations.actions.setValue('Jan 1, 2021', workExperienceIDs.externalDraft.endDate, true);
        await ProjectHistory.parentElements.buttonInAnchorBar('ExternalWorkExperience', 'ExternalWorkExperienceSkills').click();
        await CommonPageElements.objectPage.elements.footer.applyButton.click();
        await CommonPageElements.objectPage.elements.footer.saveButton.click();

        ProjectHistory.assertions.checkTableData('externalWorkExperience', 0, 'New ProjectName', 'New Role', 'New Company', 'New Customer', 'Dec 1, 2020', 'Jan 1, 2021');
    });

    testHelper.failEarlyIt('Should delete External Work Experience assignment', async () => {
        CommonPageElements.objectPage.elements.editButton.click();
        await ProjectHistory.actions.navigateToProjectHistory('External Work Experience');
        await CudOperations.actions.deleteMany('externalWorkExperience', 1, ['New ProjectName']);
        await CommonPageElements.objectPage.elements.footer.saveButton.click();

        expect(ProjectHistory.parentElements.assignmentsTableTitle('externalWorkExperience').getText()).toBe('Assignments');
        expect(ProjectHistory.actions.getAssignment('externalWorkExperience', 'New ProjectName').isPresent()).toBeFalsy();
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
