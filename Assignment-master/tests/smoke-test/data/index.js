const { assignments } = require("./assignments");
const { assignmentBucket } = require("./assignmentBucket");
const { supply } = require("./supply");
const { resourceCapacity } = require("./resourceCapacity");
const { resourceHeaders } = require("./resourceHeaders");
/**
 * Test Data Setup for smoke Tests
 */
async function setupTestData(testHelper) {
	try {
		console.log("Assignment setupTestData is invoked.");
		const resourceHeaderRepository = await testHelper.utils.getResourceHeaderRepository();
		const resourceCapacityRepository = await testHelper.utils.getResourceCapacityRepository();
		const assignmentsRepository = await testHelper.utils.getAssignmentsRepository();
		const assignmentBucketRepository = await testHelper.utils.getAssignmentBucketRepository();
		const resourceSupplyRepository = await testHelper.utils.getResourceSupplyRepository();

		console.log("Creating resource header data");
		await resourceHeaderRepository.insertMany(resourceHeaders);

		console.log("Creating resource capacity data");
		await resourceCapacityRepository.insertMany(resourceCapacity);

		console.log("Creating assignment data");
		await assignmentsRepository.insertMany(assignments);

		console.log("Creating assignment bucket data");
		await assignmentBucketRepository.insertMany(assignmentBucket);

		console.log("Creating resource supply data");
		await resourceSupplyRepository.insertMany(supply);
	} catch (err) {
		console.warn("An error occurred in the Assignmnet setUpTestData: ", err);
	}

	testHelper.testData.assignmentData = {
		assignmnets: assignments,
		assignmnetBucket: assignmentBucket,
		resourceSupply: supply
	};
}

/**
 * Test Data Tear down for smoke Tests
 */
async function teardownTestData(testHelper) {
	try {
		console.log("Assignment tearDownTestData is invoked.");

		const resourceHeaderRepository = await testHelper.utils.getResourceHeaderRepository();
		const resourceCapacityRepository = await testHelper.utils.getResourceCapacityRepository();
		const assignmentsRepository = await testHelper.utils.getAssignmentsRepository();
		const assignmentBucketRepository = await testHelper.utils.getAssignmentBucketRepository();
		const resourceSupplyRepository = await testHelper.utils.getResourceSupplyRepository();

		console.log("[tearDownTestData]: All the Assignment repositories are initialized.");
		await resourceHeaderRepository.deleteMany(resourceHeaders);
		await resourceCapacityRepository.deleteMany(resourceCapacity);
		await assignmentsRepository.deleteMany(assignments);
		await assignmentBucketRepository.deleteMany(assignmentBucket);
		await resourceSupplyRepository.deleteMany(supply);

		let sqlStatementString = assignmentsRepository.sqlGenerator.generateDeleteStatement(
			"COM_SAP_RESOURCEMANAGEMENT_RESOURCE_BOOKEDCAPACITYAGGREGATE",
			`WHERE resourceID = '${assignmentBucket[0].resource_ID}'`
		);
		await assignmentsRepository.statementExecutor.execute(sqlStatementString);

		console.log("[tearDownTestData]: Assignment test data is deleted.");
	} catch (err) {
		console.warn("An error occurred in the Assignment tearDownTestData: ", err);
	}
}

module.exports.setupTestData = setupTestData;
module.exports.teardownTestData = teardownTestData;
