require('jasmine');

const SkillDomain = require('skill');

const ConsultantProfileDomain = require('consultantProfile');

const ResourceRequestDomain = require('resourceRequest');

const AssignmentDomain = require('assignment');

const CentralServicesDomain = require('centralServices');

const { TestHelper } = require('../utils/TestHelper');

describe('Demoflow', () => {
  const testHelper = new TestHelper();

  /**
   * Setup test data
   */
  beforeAll(async () => {
    try {
      await SkillDomain.setupTestData(testHelper);
      console.log('SkillDomain test data is loaded.');
      await ConsultantProfileDomain.setupTestData(testHelper);
      console.log('ConsultantProfileDomain test data is loaded.');
      await ResourceRequestDomain.setupTestData(testHelper);
      console.log('ResourceRequestDomain test data is loaded');
      await AssignmentDomain.setupTestData(testHelper);
      console.log('AssignmentDomain test data is loaded');
      await CentralServicesDomain.setupTestData(testHelper);
      console.log('CentralServicesDomain test data is loaded');
    } catch (e) {
      console.log(e);
      process.exit(1);
    }
  });

  /**
   * Tear-down test data
   */
  afterAll(async () => {
    try {
      await SkillDomain.teardownTestData(testHelper);
      console.log('SkillDomain test data is deleted.');
      await ConsultantProfileDomain.teardownTestData(testHelper);
      console.log('ConsultantProfileDomain test data is deleted.');
      await ResourceRequestDomain.teardownTestData(testHelper);
      console.log('ResourceRequestDomain test data is deleted.');
      await AssignmentDomain.teardownTestData(testHelper);
      console.log('AssignmentDomain test data is deleted.');
      await CentralServicesDomain.teardownTestData(testHelper);
      console.log('CentralServices test data is deleted.');

      testHelper.outputTestData();
    } catch (e) {
      console.log(e);
      process.exit(1);
    }
  });

  // Queue test execution of all steps in order

  // Demoflow - B
  SkillDomain.executeTest('Demoflow-B', testHelper);

  // Demoflow - 2
  ConsultantProfileDomain.executeTest('Demoflow-2-ManageProjectRoles', testHelper);
  ConsultantProfileDomain.executeTest('Demoflow-2-MyProjectExperience', testHelper);
  // ConsultantProfileDomain.executeTest('Demoflow-2-MyAssignments', testHelper);

  // Demoflow - 3
  ResourceRequestDomain.executeTest('CreateAndPublishResourceRequest', testHelper);

  // Demoflow - 4
  ResourceRequestDomain.executeTest('DispatchResourceRequest', testHelper);

  // Demoflow - 5
  ResourceRequestDomain.executeTest('SearchCandidates', testHelper);

  AssignmentDomain.executeTest('CreateAssignment', testHelper);

  // Demoflow - 7 - PM
  ResourceRequestDomain.executeTest('CheckAssignedCandidates', testHelper);

  AssignmentDomain.executeTest('CheckResourceUtilization', testHelper);

  AssignmentDomain.executeTest('ViewResourceUtilizationCrossAppNavConsultantProfile', testHelper);

  AssignmentDomain.executeTest('ViewResourceUtilizationCrossAppNavResouceRequest', testHelper);
  
  AssignmentDomain.executeTest('DeleteAssignment', testHelper);

  AssignmentDomain.executeTest('QuickAssign', testHelper);

  AssignmentDomain.executeTest('S4Integration', testHelper);

  ResourceRequestDomain.executeTest('WithdrawAndDeleteResourceRequests', testHelper);

  // Demoflow - 2 cleanup
  ConsultantProfileDomain.executeTest('Demoflow-2-MyProjectExperienceDataCleanup', testHelper);
  ConsultantProfileDomain.executeTest('Demoflow-2-ManageProjectRoleDataCleanup', testHelper);
});
