const { resourceRequestsData } = require('./resourceRequestToBeCreated');
const {resourceOrganizationData} = require('./resourceOrganization');
const {resourceOrganizationItemsData} = require('./resourceOrganizationItems');


/**
 * This is called when setup for smoke tests is required
 * @param {Object} testHelper Object of testHelper passed from RM level
 */
async function setupTestData(testHelper) {

    try {
        const resourceRequestRepository = await testHelper.utils.getResourceRequestRepository();
        const resourceOrganizationsRepository = await testHelper.utils.getResourceOrganizationsRepository();
        const resourceOrganizationItemsRepository = await testHelper.utils.getResourceOrganizationItemsRepository();

        await resourceOrganizationsRepository.deleteOne(resourceOrganizationData);
        await resourceOrganizationItemsRepository.deleteOne(resourceOrganizationItemsData);
        await resourceRequestRepository.deleteOne(resourceRequestsData);

        console.log("Resource Request smoke Deleted- Dynamic: resourceRequests");
        await resourceOrganizationsRepository.insertOne(resourceOrganizationData);
        await resourceOrganizationItemsRepository.insertOne(resourceOrganizationItemsData);
        await resourceRequestRepository.insertOne(resourceRequestsData);



    } catch (err) {
        console.warn(err);
    }

    //Add data to testHelper
    testHelper.testData.resourceRequest = {
        displayId: "7777777777",
        requestName: "Resource Request smoke",
        ID: '78686ab9-9c90-4810-902b-7e28801229b8'
    };
}

async function teardownTestData(testHelper) {
    try {
        const resourceRequestRepository = await testHelper.utils.getResourceRequestRepository();
        const resourceOrganizationsRepository = await testHelper.utils.getResourceOrganizationsRepository();
        const resourceOrganizationItemsRepository = await testHelper.utils.getResourceOrganizationItemsRepository();

        await resourceOrganizationsRepository.deleteOne(resourceOrganizationData);
        await resourceOrganizationItemsRepository.deleteOne(resourceOrganizationItemsData);
        await resourceRequestRepository.deleteOne(resourceRequestsData);
    } catch (err) {
        console.warn(err);
    }
}


module.exports.setupTestData = setupTestData;
module.exports.teardownTestData = teardownTestData;
