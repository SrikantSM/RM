const { emails, allEmailAddressData } = require('./emails');
const { phones } = require('./phones');
const { jobDetails } = require('./jobDetails');
const { workforcePersons } = require('./workforcePersons');
const { employeeHeaders } = require('./employeeHeaders');
const { organizationDetails, allUnitKeys } = require('./organizationDetails');
const { organizationHeaders } = require('./organizationHeaders');
const { costCenters } = require('./costCenters');
const { profileDetails } = require('./profileDetails');
const { workAssignments } = require('./workAssignments');
const { workAssignmentDetails } = require('./workAssignmentDetails');
const { resourceCapacity } = require('./resourceCapacity');
const { resourceHeaders } = require('./resourceHeaders');
const { projectRoles } = require('./projectRoles');
const { roleAssignments } = require('./roleAssignments');
const { externalWorkExperiences } = require('./externalWorkExperiences');

const { skillAssignments, skillAssignment1, skillAssignment2, skillAssignment3, skillAssignment4 } = require('./skillAssignments');
const { externalWorkExperienceSkills, externalWorkExperienceSkill1, externalWorkExperienceSkill2 } = require('./externalWorkExperienceSkills');
// const { assignments} = require('./assignments');
// const { assignmentBucket} = require('./assignmentBucket');
// const { resourceRequest} = require('./resourceRequest');
// const { supply} = require('./supply');

/**
 * Precautionary data deletion for MyProjectExperience Application
 */
async function beforeAllDataCleanUp(testHelper) {

    const emailRepository = await testHelper.utils.getEmailRepository();
    const employeeHeaderRepository = await testHelper.utils.getEmployeeHeaderRepository();
    const workforcePersonRepository = await testHelper.utils.getWorkforcePersonRepository();
    const jobDetailRepository = await testHelper.utils.getJobDetailRepository();
    const profileDetailRepository = await testHelper.utils.getProfileDetailRepository();
    const phoneRepository = await testHelper.utils.getPhoneRepository();
    const organizationDetailRepository = await testHelper.utils.getOrganizationDetailRepository();
    const organizationHeaderRepository = await testHelper.utils.getOrganizationHeaderRepository();
    const costCenterRepository = await testHelper.utils.getCostCenterRepository();
    const workAssignmentsRepository = await testHelper.utils.getWorkAssignmentRepository();
    const workAssignmentDetailRepository = await testHelper.utils.getWorkAssignmentDetailRepository();
    const resourceHeaderRepository = await testHelper.utils.getResourceHeaderRepository();
    const resourceCapacityRepository = await testHelper.utils.getResourceCapacityRepository();
    const projectRoleRepository = await testHelper.utils.getProjectRoleRepository();
    const roleAssignmentRepository = await testHelper.utils.getRoleAssignmentRepository();
    const skillAssignmentRepository = await testHelper.utils.getSkillAssignmentRepository();
    const externalWorkExperienceRepository = await testHelper.utils.getExternalWorkExperienceRepository();
    const externalWorkExperienceSkillRepository = await testHelper.utils.getExternalWorkExperienceSkillRepository();
    const assignmentsRepository = await testHelper.utils.getAssignmentsRepository();
    // const assignmentBucketRepository = await testHelper.utils.getAssignmentBucketRepository();
    // const resourceRequestRepository = await testHelper.utils.getResourceRequestRepository();
    // const supplyRepository = await testHelper.utils.getResourceSupplyRepository();

    // Group 1 Deletion Data Preparation Start
    let toBeDeletedEmailData = [];
    let email_parent_as_ID = [];            // WorkforcePerson, EmployeeHeader
    let email_parent_as_employeee_ID = [];  // RoleAssignment, SkillAssignment, ExternalWorkExperience, ExternalWorkExperienceSkills,
    let email_parent_as_parent = [];        // ProfileDetails, PhoneDetail
    const emailDataList = await emailRepository.selectByData(['ID, parent'], allEmailAddressData);
    emailDataList.forEach(emailData => {
        const email_ID = emailData.ID;
        const email_parent = emailData.parent;

        toBeDeletedEmailData.push({ ID: email_ID });
        email_parent_as_ID.push({ ID: email_parent });
        email_parent_as_parent.push({ parent: email_parent });
        email_parent_as_employeee_ID.push({ employee_ID: email_parent });
    });

    const toBeDeletedWorkforcePersonData = email_parent_as_ID;
    const toBeDeletedEmployeeHeaderData = email_parent_as_ID;
    const toBeDeletedProfileData = email_parent_as_parent;
    const toBeDeletedPhoneData = email_parent_as_parent;
    const toBeDeletedRoleAssignmentData = email_parent_as_employeee_ID;
    const toBeDeletedSkillAssignmentData = email_parent_as_employeee_ID;
    const toBeDeletedExternalWorkExperienceSkillsData = email_parent_as_employeee_ID;
    const toBeDeletedExternalWorkExperienceData = email_parent_as_employeee_ID;
    // Group 1 Deletion Data Praparation is finished

    // Group 2 Deletion Data Preparation Start
    let toBeDeletedWorkAssignmentData = [];
    let workAssignment_ID_as_ID = [];                   // ResourceHeader
    let workAssignment_ID_as_resource_ID = [];          // ResourceCapacity, Assignment
    let workAssignment_ID_as_parent = [];               // JobDetails
    const workAssignmentDataList = await workAssignmentsRepository.selectByData(['ID'], email_parent_as_parent);
    workAssignmentDataList.forEach(workAssignmentData => {
        const workAssignment_ID = workAssignmentData.ID;

        toBeDeletedWorkAssignmentData.push({ ID: workAssignment_ID });
        workAssignment_ID_as_ID.push({ ID: workAssignment_ID });
        workAssignment_ID_as_parent.push({ parent: workAssignment_ID });
        workAssignment_ID_as_resource_ID.push({ resource_ID: workAssignment_ID });
    });

    const toBeDeletedResourceHeaderData = workAssignment_ID_as_ID;
    const toBeDeletedJobDetailsData = workAssignment_ID_as_parent;
    const toBeDeletedWorkAssignmentDetailsData = workAssignment_ID_as_parent;
    const toBeDeletedResourceCapacityData = workAssignment_ID_as_resource_ID;
    const toBeDeletedAssignmentData = workAssignment_ID_as_resource_ID;
    // Group 2 Deletion Data Praparation is finished

    // Group 3 Deletion Data Preparation Start
    let toBeDeletedProjectRoleData = [{ code: 'T001' }, { code: 'T002' }]; // Project Roles
    // Group 3 Deletion Data Praparation is finished

    // Group 4 Deletion Data Praparation is finished
    let toBeDeletedOrganizationHeaders = []; // Organization Header
    let toBeDeletedCostCenterData = []; // Cost Center
    const organizationDetailDataList = await organizationDetailRepository.selectByData(['code', 'unitKey'], allUnitKeys);
    organizationDetailDataList.forEach(organizationDetailData => {
        toBeDeletedOrganizationHeaders.push({ code: organizationDetailData.code });
        toBeDeletedCostCenterData.push({ costCenterID: organizationDetailData.unitKey });
    });
    // Group 4 Deletion Data Preparation Start

    // Group 5 Deletion Data Preparation Start
//     let toBeDeletedResourceRequest = [];
//     let toBeDeletedSupplyData = [];
//     let ID_as_assignment_ID = [];
//     const deletableAssignments = await assignmentsRepository.selectByData(['ID'], workAssignment_ID_as_resource_ID);
//     deletableAssignments.forEach( assignment => {
//         ID_as_assignment_ID.push({ assignmentID: assignment.ID });
//         toBeDeletedResourceRequest.push({ ID: assignment.resourceRequest_ID });
//         toBeDeletedSupplyData.push({ assignmentID: assignment.ID });
//     });
//     const toBeDeletedAssignmentBucketsData = ID_as_assignment_ID;
    // Group 5 Deletion Data Praparation is finished

    // Data Cleaning Start
    // Group 1
    await emailRepository.deleteMany(toBeDeletedEmailData);
    await workforcePersonRepository.deleteMany(toBeDeletedWorkforcePersonData);
    await employeeHeaderRepository.deleteMany(toBeDeletedEmployeeHeaderData);
    await profileDetailRepository.deleteManyByData(toBeDeletedProfileData);
    await phoneRepository.deleteManyByData(toBeDeletedPhoneData);
    await roleAssignmentRepository.deleteManyByData(toBeDeletedRoleAssignmentData);
    await skillAssignmentRepository.deleteManyByData(toBeDeletedSkillAssignmentData);
    await externalWorkExperienceSkillRepository.deleteManyByData(toBeDeletedExternalWorkExperienceSkillsData);
    await externalWorkExperienceRepository.deleteManyByData(toBeDeletedExternalWorkExperienceData);

    // Group 2
    await workAssignmentsRepository.deleteMany(toBeDeletedWorkAssignmentData);
    await workAssignmentDetailRepository.deleteManyByData(toBeDeletedWorkAssignmentDetailsData);
    await resourceHeaderRepository.deleteMany(toBeDeletedResourceHeaderData);
    await jobDetailRepository.deleteManyByData(toBeDeletedJobDetailsData);
    await resourceCapacityRepository.deleteManyByData(toBeDeletedResourceCapacityData);
    await assignmentsRepository.deleteManyByData(toBeDeletedAssignmentData);

    // Group 3
    await projectRoleRepository.deleteManyByData(toBeDeletedProjectRoleData);

    // Group 4
    await organizationHeaderRepository.deleteMany(toBeDeletedOrganizationHeaders);
    await organizationDetailRepository.deleteMany(organizationDetailDataList);
    await costCenterRepository.deleteManyByData(toBeDeletedCostCenterData);

    // Group 5
    // await assignmentBucketRepository.deleteManyByData(toBeDeletedAssignmentBucketsData);
    // await resourceRequestRepository.deleteMany(toBeDeletedResourceRequest);
    // await supplyRepository.deleteMany(toBeDeletedSupplyData);
    // Data Cleaning finished
}

/**
 * Test Data Setup for CDE2E Tests
 */
async function setupTestData(testHelper) {
    try {

        console.log('CP: Initializing precautionary Data Cleanup');
        await beforeAllDataCleanUp(testHelper);
        console.log('CP: Initializing precautionary Data Cleanup');

        console.log('Consultant-Profile setupTestData is invoked.');
        const emailRepository = await testHelper.utils.getEmailRepository();
        const employeeHeaderRepository = await testHelper.utils.getEmployeeHeaderRepository();
        const workforcePersonRepository = await testHelper.utils.getWorkforcePersonRepository();
        const jobDetailRepository = await testHelper.utils.getJobDetailRepository();
        const profileDetailRepository = await testHelper.utils.getProfileDetailRepository();
        const phoneRepository = await testHelper.utils.getPhoneRepository();
        const organizationDetailRepository = await testHelper.utils.getOrganizationDetailRepository();
        const organizationHeaderRepository = await testHelper.utils.getOrganizationHeaderRepository();
        const costCenterRepository = await testHelper.utils.getCostCenterRepository();
        const workAssignmentRepository = await testHelper.utils.getWorkAssignmentRepository();
        const workAssignmentDetailRepository = await testHelper.utils.getWorkAssignmentDetailRepository();
        const resourceHeaderRepository = await testHelper.utils.getResourceHeaderRepository();
        const resourceCapacityRepository = await testHelper.utils.getResourceCapacityRepository();
        const projectRoleRepository = await testHelper.utils.getProjectRoleRepository();
        const roleAssignmentRepository = await testHelper.utils.getRoleAssignmentRepository();
        const skillAssignmentRepository = await testHelper.utils.getSkillAssignmentRepository();
        const externalWorkExperienceRepository = await testHelper.utils.getExternalWorkExperienceRepository();
        const externalWorkExperienceSkillRepository = await testHelper.utils.getExternalWorkExperienceSkillRepository();
        // const assignmentsRepository = await testHelper.utils.getAssignmentsRepository();
        // const assignmentBucketRepository = await testHelper.utils.getAssignmentBucketRepository();
        // const resourceRequestRepository = await testHelper.utils.getResourceRequestRepository();
        // const supplyRepository = await testHelper.utils.getResourceSupplyRepository();

        console.log('[setupTestData]: All the Consultant-Profile repositories are initialized.');
        await emailRepository.insertMany(emails);
        await workAssignmentRepository.insertMany(workAssignments);
        await workAssignmentDetailRepository.insertMany(workAssignmentDetails);
        await phoneRepository.insertMany(phones);
        await organizationHeaderRepository.insertMany(organizationHeaders);
        await organizationDetailRepository.insertMany(organizationDetails);
        await costCenterRepository.insertMany(costCenters);
        await workforcePersonRepository.insertMany(workforcePersons);
        await jobDetailRepository.insertMany(jobDetails);
        await employeeHeaderRepository.insertMany(employeeHeaders);
        await profileDetailRepository.insertMany(profileDetails);
        await resourceHeaderRepository.insertMany(resourceHeaders);
        await resourceCapacityRepository.insertMany(resourceCapacity);
        await projectRoleRepository.insertMany(projectRoles);
        await roleAssignmentRepository.insertMany(roleAssignments);
        await setupSkillAssignmentData(testHelper);
        await skillAssignmentRepository.insertMany(skillAssignments);
        await externalWorkExperienceRepository.insertMany(externalWorkExperiences);
        await setupExternalWorkExperienceSkills(testHelper);
        await externalWorkExperienceSkillRepository.insertMany(externalWorkExperienceSkills);
        // await assignmentsRepository.insertMany(assignments);
        // await assignmentBucketRepository.insertMany(assignmentBucket);
        // await resourceRequestRepository.insertMany(resourceRequest);
        // await supplyRepository.insertMany(supply);
        await console.log('[setupTestData]: Consultant-Profile test data is created.');
    } catch (err) {
        console.warn("An error occurred in the Consultant-Profile setUpTestData: ", err);
        process.exit(1);
    }
    testHelper.testData.consultantProfile = {
        emails: emails,
        phones: phones,
        jobDetails: jobDetails,
        workforcePersons: workforcePersons,
        employeeHeaders: employeeHeaders,
        organizationDetails: organizationDetails,
        organizationHeaders: organizationHeaders,
        costCenters: costCenters,
        profileDetails: profileDetails,
        workAssignments: workAssignments,
        resourceCapacity: resourceCapacity,
        resourceHeaders: resourceHeaders,
        projectRoles: projectRoles
        // assignments: assignments,
        // assignmentBucket: assignmentBucket,
        // resourceRequest: resourceRequest,
        // supply: supply,
    };
}

/**
 * Test Data Tear down for CDE2E Tests
 */
async function teardownTestData(testHelper) {
    try {
        console.log('Consultant-Profile tearDownTestData is invoked.');
        const emailRepository = await testHelper.utils.getEmailRepository();
        const employeeHeaderRepository = await testHelper.utils.getEmployeeHeaderRepository();
        const workforcePersonRepository = await testHelper.utils.getWorkforcePersonRepository();
        const jobDetailRepository = await testHelper.utils.getJobDetailRepository();
        const profileDetailRepository = await testHelper.utils.getProfileDetailRepository();
        const phoneRepository = await testHelper.utils.getPhoneRepository();
        const organizationDetailRepository = await testHelper.utils.getOrganizationDetailRepository();
        const organizationHeaderRepository = await testHelper.utils.getOrganizationHeaderRepository();
        const costCenterRepository = await testHelper.utils.getCostCenterRepository();
        const workAssignmentRepository = await testHelper.utils.getWorkAssignmentRepository();
        const workAssignmentDetailRepository = await testHelper.utils.getWorkAssignmentDetailRepository();
        const resourceHeaderRepository = await testHelper.utils.getResourceHeaderRepository();
        const resourceCapacityRepository = await testHelper.utils.getResourceCapacityRepository();
        const projectRoleRepository = await testHelper.utils.getProjectRoleRepository();
        const roleAssignmentRepository = await testHelper.utils.getRoleAssignmentRepository();
        const skillAssignmentRepository = await testHelper.utils.getSkillAssignmentRepository();
        const externalWorkExperienceRepository = await testHelper.utils.getExternalWorkExperienceRepository();
        const externalWorkExperienceSkillRepository = await testHelper.utils.getExternalWorkExperienceSkillRepository();
        const assignmentsRepository = await testHelper.utils.getAssignmentsRepository();
        const assignmentBucketRepository = await testHelper.utils.getAssignmentBucketRepository();
        const resourceRequestRepository = await testHelper.utils.getResourceRequestRepository();
        const supplyRepository = await testHelper.utils.getResourceSupplyRepository();
        console.log('[tearDownTestData]: All the Consultant-Profile repositories are initialized.');
        await emailRepository.deleteMany(emails);
        await workAssignmentRepository.deleteMany(workAssignments);
        await workAssignmentDetailRepository.deleteMany(workAssignmentDetails);
        await profileDetailRepository.deleteMany(profileDetails);
        await phoneRepository.deleteMany(phones);
        await workforcePersonRepository.deleteMany(workforcePersons);
        await jobDetailRepository.deleteMany(jobDetails);
        await organizationHeaderRepository.deleteMany(organizationHeaders);
        await organizationDetailRepository.deleteMany(organizationDetails);
        await costCenterRepository.deleteMany(costCenters);
        await employeeHeaderRepository.deleteMany(employeeHeaders);
        await resourceHeaderRepository.deleteMany(resourceHeaders);
        await resourceCapacityRepository.deleteMany(resourceCapacity);
        await projectRoleRepository.deleteMany(projectRoles);
        await roleAssignmentRepository.deleteMany(roleAssignments);
        await skillAssignmentRepository.deleteMany(skillAssignments);
        await externalWorkExperienceRepository.deleteMany(externalWorkExperiences);
        await externalWorkExperienceSkillRepository.deleteMany(externalWorkExperienceSkills);
        // await assignmentsRepository.deleteMany(assignments);
        // await assignmentBucketRepository.deleteMany(assignmentBucket);
        // await resourceRequestRepository.deleteMany(resourceRequest);
        // await supplyRepository.deleteMany(supply);
        console.log('[tearDownTestData]: Consultant-Profile test data is deleted.');
    } catch (err) {
        console.warn("An error occurred in the Consultant-Profile tearDownTestData: ", err);
        process.exit(1);
    }
}

async function setupSkillAssignmentData(testHelper) {
    const testRunId = testHelper.testRunID;
    const skillJavaId = testHelper.testData.skill.skills.find(skill => skill.name === 'Java ' + testRunId).ID;
    const skillJavaScriptId = testHelper.testData.skill.skills.find(skill => skill.name === 'JavaScript ' + testRunId).ID;
    const defaultProficiencyLevel = '8e88cf20-f5f2-40dc-8b8e-e63d8bc868ee';
    console.log('skillJavaId: ', skillJavaId);
    console.log('skillJavaScriptId: ', skillJavaScriptId);
    skillAssignment1.skill_ID = skillJavaId;
    skillAssignment1.proficiencyLevel_ID = defaultProficiencyLevel;
    skillAssignment2.skill_ID = skillJavaScriptId;
    skillAssignment2.proficiencyLevel_ID = defaultProficiencyLevel;
    skillAssignment3.skill_ID = skillJavaId;
    skillAssignment3.proficiencyLevel_ID = defaultProficiencyLevel;
    skillAssignment4.skill_ID = skillJavaScriptId;
    skillAssignment4.proficiencyLevel_ID = defaultProficiencyLevel;
}

async function setupExternalWorkExperienceSkills(testHelper) {
    const testRunId = testHelper.testRunID;
    const skillJavaId = testHelper.testData.skill.skills.find(skill => skill.name === 'Java ' + testRunId).ID;
    const skillJavaScriptId = testHelper.testData.skill.skills.find(skill => skill.name === 'JavaScript ' + testRunId).ID;
    const defaultProficiencyLevel = '8e88cf20-f5f2-40dc-8b8e-e63d8bc868ee';
    console.log('skillJavaId: ', skillJavaId);
    console.log('skillJavaScriptId: ', skillJavaScriptId);
    externalWorkExperienceSkill1.skill_ID = skillJavaId;
    externalWorkExperienceSkill1.proficiencyLevel_ID = defaultProficiencyLevel;
    externalWorkExperienceSkill2.skill_ID = skillJavaScriptId;
    externalWorkExperienceSkill2.proficiencyLevel_ID = defaultProficiencyLevel;
}

module.exports.setupTestData = setupTestData;
module.exports.teardownTestData = teardownTestData;
