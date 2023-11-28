const { emails, email1 } = require('./emails');
const { jobDetails } = require('./jobDetails');
const { workforcePersons } = require('./workforcePersons');
const { employeeHeaders } = require('./employeeHeaders');
const { costCenters } = require('./costCenters');
const { profileDetails } = require('./profileDetails');
const { workAssignments } = require('./workAssignments');
const { workAssignmentDetails } = require('./workAssignmentDetails');
const { projectRoles } = require('./projectRoles');
const { costCenterAttributes } = require('./costCenterAttribute');


/**
 * Precautionary data deletion for MyProjectExperience Application
 */
 async function precautionaryDataCleanUp(testHelper) {
    const roleAssignmentRepository = await testHelper.utils.getRoleAssignmentRepository();
    let email_parent_as_employeee_ID = [];
    email_parent_as_employeee_ID.push({ employee_ID: email1.parent });
    const toBeDeletedRoleAssignmentData = email_parent_as_employeee_ID;
    await roleAssignmentRepository.deleteManyByData(toBeDeletedRoleAssignmentData);
 }
/**
 * This is called when setup for smoke tests is required
 */
async function setupTestData(testHelper) {
    try {
        await precautionaryDataCleanUp(testHelper);
        console.log('Consultant-Profile setupTestData is invoked.');
        const emailRepository = await testHelper.utils.getEmailRepository();
        const employeeHeaderRepository = await testHelper.utils.getEmployeeHeaderRepository();
        const workforcePersonRepository = await testHelper.utils.getWorkforcePersonRepository();
        const jobDetailRepository = await testHelper.utils.getJobDetailRepository();
        const profileDetailRepository = await testHelper.utils.getProfileDetailRepository();
        const costCenterRepository = await testHelper.utils.getCostCenterRepository();
        const workAssignmentRepository = await testHelper.utils.getWorkAssignmentRepository();
        const workAssignmentDetailRepository = await testHelper.utils.getWorkAssignmentDetailRepository();
        const projectRoleRepository = await testHelper.utils.getProjectRoleRepository();
        const costCenterAttributeRepository = await testHelper.utils.getCostCenterAttributeRepository();

        console.log('[setupTestData]: All the Consultant-Profile repositories are initialized.');
        await emailRepository.insertMany(emails);
        await workAssignmentRepository.insertMany(workAssignments);
        await workAssignmentDetailRepository.insertMany(workAssignmentDetails);
        await costCenterRepository.insertMany(costCenters);
        await workforcePersonRepository.insertMany(workforcePersons);
        await jobDetailRepository.insertMany(jobDetails);
        await employeeHeaderRepository.insertMany(employeeHeaders);
        await profileDetailRepository.insertMany(profileDetails);  
        await projectRoleRepository.insertMany(projectRoles);
        await costCenterAttributeRepository.insertMany(costCenterAttributes);
        await console.log('[setupTestData]: Consultant-Profile test data is created.');
    } catch (err) {
        console.warn("An error occurred in the Consultant-Profile setUpTestData: ", err);
    }
    testHelper.testData.consultantProfile = {
        emails: emails,
        jobDetails: jobDetails,
        workforcePersons: workforcePersons,
        employeeHeaders: employeeHeaders,
        costCenters: costCenters,
        profileDetails: profileDetails,
        workAssignments: workAssignments,
        projectRoles: projectRoles,
        costCenterAttributes: costCenterAttributes
    };
}

/**
 * Test Data Tear down for Smoke Tests
 */
async function teardownTestData(testHelper) {
    try {
        console.log('Consultant-Profile tearDownTestData is invoked.');
        const emailRepository = await testHelper.utils.getEmailRepository();
        const employeeHeaderRepository = await testHelper.utils.getEmployeeHeaderRepository();
        const workforcePersonRepository = await testHelper.utils.getWorkforcePersonRepository();
        const jobDetailRepository = await testHelper.utils.getJobDetailRepository();
        const profileDetailRepository = await testHelper.utils.getProfileDetailRepository();
        const costCenterRepository = await testHelper.utils.getCostCenterRepository();
        const workAssignmentRepository = await testHelper.utils.getWorkAssignmentRepository();
        const workAssignmentDetailRepository = await testHelper.utils.getWorkAssignmentDetailRepository();
        const projectRoleRepository = await testHelper.utils.getProjectRoleRepository();
        const costCenterAttributeRepository = await testHelper.utils.getCostCenterAttributeRepository();

        console.log('[tearDownTestData]: All the Consultant-Profile repositories are initialized.');
        await emailRepository.deleteMany(emails);
        await workAssignmentRepository.deleteMany(workAssignments);
        await workAssignmentDetailRepository.deleteMany(workAssignmentDetails);
        await profileDetailRepository.deleteMany(profileDetails);
        await workforcePersonRepository.deleteMany(workforcePersons);
        await jobDetailRepository.deleteMany(jobDetails);
        await costCenterRepository.deleteMany(costCenters);
        await costCenterAttributeRepository.deleteMany(costCenterAttributes);
        await employeeHeaderRepository.deleteMany(employeeHeaders);
        await projectRoleRepository.deleteMany(projectRoles);
        await precautionaryDataCleanUp(testHelper);
        console.log('[tearDownTestData]: Consultant-Profile test data is deleted.');
    } catch (err) {
        console.warn("An error occurred in the Consultant-Profile tearDownTestData: ", err);
    }
}


module.exports.setupTestData = setupTestData;
module.exports.teardownTestData = teardownTestData;
