const { billingCategories } = require('./billingCategory');
const { billingRoles } = require('./billingRole');
const { customers } = require('./customer');
const { projects } = require('./project');
const { workPackages } = require('./workPackage');
const { demands, demandCapacityRequirements } = require('./demand');
const { demandsToBeDeleted } = require('./demandsToBeDeleted');
// const { projectRoles } = require('./projectRole'); commented for prod
const { resourceRequestsToBeDeleted } = require('./resourceRequest');
const { supplySync } = require('./supplySync');
const { resourceRequestsToUpload } = require('./resourceRequestToBeCreated');
const { capacityRequirements } = require('./capacityRequirement');
//const {assignments} = require('./assignments');
//const {assignmentBuckets} = require('./assignmentBucket');
const { supply } = require('./supply');

/**
 * This is called when setup for E2E tests is required
 * @param {Object} testHelper Object of testHelper passed from RM level
 */
async function setupTestData(testHelper) {

    let updatedProjects = appendTestRunId(projects, "name", testHelper.testRunID);

    //Set the Project role id of Resource Requests to ProjectRole's ID of CP data
    resourceRequestsToUpload[0].projectRole_ID = testHelper.testData.consultantProfile.projectRoles[0].ID;
    resourceRequestsToUpload[1].projectRole_ID = testHelper.testData.consultantProfile.projectRoles[0].ID;

    try {
        const billingCategoryRepository = await testHelper.utils.getBillingCategoryRepository();
        const billingRoleRepository = await testHelper.utils.getBillingRoleRepository();
        const customerRepository = await testHelper.utils.getCustomerRepository();
        const projectRepository = await testHelper.utils.getProjectRepository();
        const workPackageRepository = await testHelper.utils.getWorkPackageRepository();
        const demandRepository = await testHelper.utils.getDemandRepository();
        const demandCapacityRequirementRepository = await testHelper.utils.getDemandCapacityRequirementRepository();
        const supplySyncRepository = await testHelper.utils.getSupplySyncRepository();
        const resourceRequestRepository = await testHelper.utils.getResourceRequestRepository();
        const capacityRequirementRepository = await testHelper.utils.getCapacityRequirementRepository();
        //  const assignmentsRepository = await testHelper.utils.getAssignmentsRepository();
        // const assignmentBucketRepository = await testHelper.utils.getAssignmentBucketRepository();
        const resourceSupplyRepository = await testHelper.utils.getResourceSupplyRepository();
        //const projectRoleRepository = await testHelper.utils.getProjectRoleRepository(); //commented for prod
        let deleteSyncData = [];
        //Clear unique-constraint tables (billingCategory, billingRole,customer, project,workPackage) before inserting
        await billingCategoryRepository.deleteMany(billingCategories);
        await billingRoleRepository.deleteMany(billingRoles);
        //await projectRoleRepository.deleteMany(projectRoles); //commented for prod

        await customerRepository.deleteMany(customers);
        await projectRepository.deleteMany(updatedProjects);
        await workPackageRepository.deleteMany(workPackages);
        console.log("CDE2E Deleted- Static: billingCategories,billingRoles,customers,projects,workPackages");

        // Delete un-deleted ResourceRequests lying in System created by CD-E2E tests in a previous unsuccessful run.
        await resourceRequestRepository.deleteManyByData(resourceRequestsToBeDeleted);
        console.log("CDE2E Deleted- Dynamic: resourceRequests");

        //Get the Demand IDs to be deleted from Demands table
        const deleteDemandData = await demandRepository.selectByData(['ID'], (demandsToBeDeleted));

        deleteDemandData.forEach(demandData => {
            const demand_ID = demandData.ID;

            deleteSyncData.push({ demand: demand_ID });
        });
        // Delete un-deleted Sync Data lying in System created by CD-E2E tests in a previous unsuccessful run.
        await supplySyncRepository.deleteMany(deleteSyncData);
        console.log("CDE2E Deleted- Dynamic: Sync Data");

        // Delete un-deleted Demands lying in System created by CD-E2E tests in a previous unsuccessful run.
        await demandRepository.deleteMany(deleteDemandData);
        console.log("CDE2E Deleted- Dynamic: Demands");
        // await assignmentsRepository.deleteMany(assignments);
        //  await assignmentBucketRepository.deleteMany(assignmentBuckets);
        await resourceSupplyRepository.deleteMany(supply);
        await billingCategoryRepository.insertMany(billingCategories);
        await billingRoleRepository.insertMany(billingRoles);
        //await projectRoleRepository.insertMany(projectRoles);//commented for prod

        await customerRepository.insertMany(customers);
        await projectRepository.insertMany(updatedProjects);
        await workPackageRepository.insertMany(workPackages);
        await demandRepository.insertMany(demands);
        await demandCapacityRequirementRepository.insertMany(
            demandCapacityRequirements
        );
        await resourceRequestRepository.insertMany(resourceRequestsToUpload);
        await capacityRequirementRepository.insertMany(capacityRequirements);
        // await assignmentsRepository.insertMany(assignments);
        // await assignmentBucketRepository.insertMany(assignmentBuckets);
        await resourceSupplyRepository.insertMany(supply);

    } catch (err) {
        console.warn(err);
    }

    //Add data to testHelper
    testHelper.testData.resourceRequest = {
        displayId: "9999999999",
        requestName: "CDE2E Resource Request 1",
        billingCategories: billingCategories,
        billingRoles: billingRoles,
        customers: customers,
        projects: updatedProjects,
        workPackages: workPackages,
        demands: demands,
        demandCapacityRequirements: demandCapacityRequirements,
        resourceRequests: resourceRequestsToUpload,
        capacityRequirement: capacityRequirements,
        quickAssignNegativeRR: "7777777777",
        s4negativeRR: "8888888888"
    //projectRoles:projectRoles //commented for prod
    };
}

async function teardownTestData(testHelper) {
    let updatedProjects = appendTestRunId(projects, "name", testHelper.testRunID);
    try {
        const billingCategoryRepository = await testHelper.utils.getBillingCategoryRepository();
        const billingRoleRepository = await testHelper.utils.getBillingRoleRepository();
        const customerRepository = await testHelper.utils.getCustomerRepository();
        const projectRepository = await testHelper.utils.getProjectRepository();
        const workPackageRepository = await testHelper.utils.getWorkPackageRepository();
        const demandRepository = await testHelper.utils.getDemandRepository();
        const demandCapacityRequirementRepository = await testHelper.utils.getDemandCapacityRequirementRepository();
        const supplySyncRepository = await testHelper.utils.getSupplySyncRepository();
        //const projectRoleRepository = await testHelper.utils.getProjectRoleRepository();//commented for prod
        const resourceRequestRepository = await testHelper.utils.getResourceRequestRepository();
        const capacityRequirementRepository = await testHelper.utils.getCapacityRequirementRepository();
        //  const assignmentsRepository = await testHelper.utils.getAssignmentsRepository();
        // const assignmentBucketRepository = await testHelper.utils.getAssignmentBucketRepository();
        const resourceSupplyRepository = await testHelper.utils.getResourceSupplyRepository();

        await billingCategoryRepository.deleteMany(billingCategories);
        await billingRoleRepository.deleteMany(billingRoles);
        await customerRepository.deleteMany(customers);
        await projectRepository.deleteMany(updatedProjects);
        await workPackageRepository.deleteMany(workPackages);
        await demandRepository.deleteMany(demands);
        await demandCapacityRequirementRepository.deleteMany(
            demandCapacityRequirements
        );
        await supplySyncRepository.deleteMany(supplySync);
        await resourceRequestRepository.deleteMany(resourceRequestsToUpload);
        await capacityRequirementRepository.deleteMany(capacityRequirements);
        // await assignmentsRepository.deleteMany(assignments);
        // await assignmentBucketRepository.deleteMany(assignmentBuckets);
        await resourceSupplyRepository.deleteMany(supply);
    //await projectRoleRepository.deleteMany(projectRoles);//commented for prod
    } catch (err) {
        console.warn(err);
    }
}

function appendTestRunId(entityArray, objectKey, testRunID) {
    let returnArray = JSON.parse(JSON.stringify(entityArray));
    returnArray.forEach(element => {
        Object.keys(element).forEach(key => {
            if (key == objectKey) {
                element[key] = element[key] + "" + testRunID;
            }
        });
    });
    return returnArray;
}

module.exports.setupTestData = setupTestData;
module.exports.teardownTestData = teardownTestData;
