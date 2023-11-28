const { assignments } = require("./assignments");
const { assignmentBucket } = require("./assignmentBucket");
const { supply } = require("./supply");
/**
 * Test Data Setup for CDE2E Tests
 */
async function setupTestData(testHelper) {
	assignments[0].resourceRequest_ID = testHelper.testData.resourceRequest.resourceRequests[1].ID;
	assignments[0].resource_ID = testHelper.testData.consultantProfile.resourceHeaders[3].ID;

	try {
		console.log("Assignment setupTestData is invoked.");
		const assignmentsRepository = await testHelper.utils.getAssignmentsRepository();
		const assignmentBucketRepository = await testHelper.utils.getAssignmentBucketRepository();
		const resourceSupplyRepository = await testHelper.utils.getResourceSupplyRepository();

		await assignmentsRepository.insertMany(assignments);
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
 * Test Data Tear down for CDE2E Tests
 */
async function teardownTestData(testHelper) {
	try {
		console.log("Assignment tearDownTestData is invoked.");

		const assignmentsRepository = await testHelper.utils.getAssignmentsRepository();
		const assignmentBucketRepository = await testHelper.utils.getAssignmentBucketRepository();
		const resourceSupplyRepository = await testHelper.utils.getResourceSupplyRepository();

		console.log("[tearDownTestData]: All the Assignment repositories are initialized.");

		await assignmentsRepository.deleteMany(assignments);
		await assignmentBucketRepository.deleteMany(assignmentBucket);
		await resourceSupplyRepository.deleteMany(supply);

		let sqlStatementString = assignmentsRepository.sqlGenerator.generateDeleteStatement(
			"COM_SAP_RESOURCEMANAGEMENT_RESOURCE_BOOKEDCAPACITYAGGREGATE",
			`WHERE resourceID = '${testHelper.testData.consultantProfile.workAssignments[0].ID}'`
		);
		await assignmentsRepository.statementExecutor.execute(sqlStatementString);

		console.log("[tearDownTestData]: Assignment test data is deleted.");
	} catch (err) {
		console.warn("An error occurred in the Assignment tearDownTestData: ", err);
	}
}

module.exports.setupTestData = setupTestData;
module.exports.teardownTestData = teardownTestData;
