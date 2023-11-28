// import { suite, test, timeout } from 'mocha-typescript';
// import { AxiosInstance } from 'axios';
// import { assert } from 'chai';
// import { AssignmentsRepository, SqlGenerator, StatementExecutor } from 'test-commons';
// import { TEST_TIMEOUT, testEnvironment } from '../../utils';
// import { insertData, deleteData } from './dataGenHandler';

// // / ///////////////////////////////////////////////////////////////////////////////////////////////////
// // /        Assignment create, update and deletion scenarios will be tested                           ///
// // /        First demand  - contains staffing which will be used to create a new assignment           ///
// // /        Second demand - demand dates are shortened to simulate changing of assignment buckets     ///
// // /        Third demand  - staffed demand along with assignment is deleted                           ///
// // / ///////////////////////////////////////////////////////////////////////////////////////////////////

// @suite
// export class AssignmentReplicationTest {
//   private static projectAdapterClient: AxiosInstance;

//   private static assignmentRepository: AssignmentsRepository;

//   private static sqlGenerator: SqlGenerator;

//   private static statementExecutor: StatementExecutor;

//   private static sqlStatementString: string;

//   private static idOfCreatedAssignment: string;
//   private static idOfCreatedHardBookedAssignment: string;
//   private static idOfCreatedHardBookedAssignmentForProposedAssignment: string;

//   @timeout(TEST_TIMEOUT)
//   static async before() {
//     await insertData();
//     AssignmentReplicationTest.projectAdapterClient = await testEnvironment.getProjectAdapterServiceClient();
//     AssignmentReplicationTest.assignmentRepository = await testEnvironment.getAssignmentsRepository();
//     AssignmentReplicationTest.sqlGenerator = AssignmentReplicationTest.assignmentRepository.sqlGenerator;
//     AssignmentReplicationTest.statementExecutor = AssignmentReplicationTest.assignmentRepository.statementExecutor;
//   }

//   @test(timeout(TEST_TIMEOUT * 5))
//   async 'Checking CUD scenarios for hard and soft booked Assignments during delta replication job'() {

//     // Query the header attributes before triggering project replication
//     AssignmentReplicationTest.sqlStatementString = AssignmentReplicationTest.sqlGenerator.generateSelectStatement('COM_SAP_RESOURCEMANAGEMENT_ASSIGNMENT_ASSIGNMENTS', ['ID', 'BOOKEDCAPACITYINMINUTES'], "WHERE ID='d3ca64b0-7dbc-41a3-a253-af63adb25ab2'");
//     const assignmentHeaderBeforeUpdateScenario1 = await AssignmentReplicationTest.statementExecutor.execute(AssignmentReplicationTest.sqlStatementString);

//     AssignmentReplicationTest.sqlStatementString = AssignmentReplicationTest.sqlGenerator.generateSelectStatement('COM_SAP_RESOURCEMANAGEMENT_ASSIGNMENT_ASSIGNMENTS', ['ID', 'BOOKEDCAPACITYINMINUTES'], "WHERE ID='bada69b0-6cbc-41a3-a253-af63adb25bad'");
//     const assignmentHeaderBeforeUpdateScenario2 = await AssignmentReplicationTest.statementExecutor.execute(AssignmentReplicationTest.sqlStatementString);

//     AssignmentReplicationTest.sqlStatementString = AssignmentReplicationTest.sqlGenerator.generateSelectStatement('COM_SAP_RESOURCEMANAGEMENT_ASSIGNMENT_ASSIGNMENTS', ['ID', 'BOOKEDCAPACITYINMINUTES'], "WHERE ID='badbadb0-6cbc-41a3-a253-af63adbadbad'");
//     const assignmentHeaderBeforeUpdateScenario3 = await AssignmentReplicationTest.statementExecutor.execute(AssignmentReplicationTest.sqlStatementString);

//     // Query replicateS4Projects, this will create a new assignment
//     const creationResponse = await AssignmentReplicationTest.projectAdapterClient.post('replicateS4ProjectsDelta/');

//     // check whether the delta replication job was successful
//     assert.equal(creationResponse.status, 200, 'Delta replication job failed');
//     console.log('Delta replication job was successful');

//     // / /////////////////////////////////////////////////////////////////////////////////////
//     // / //                 Testing assignment creation scenario                         /////
//     // / /////////////////////////////////////////////////////////////////////////////////////

//     // Check whether the hard booked assignment is created for the first demand by directly querying the DB
//     AssignmentReplicationTest.sqlStatementString = AssignmentReplicationTest.sqlGenerator.generateSelectStatement('COM_SAP_RESOURCEMANAGEMENT_ASSIGNMENT_ASSIGNMENTS', ['ID', 'BOOKEDCAPACITYINMINUTES'], "WHERE RESOURCEREQUEST_ID='5c4398bd-d835-441e-9636-54b2ae58b192' AND RESOURCE_ID='e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4' AND assignmentstatus_code=0");
//     const createDBResponse = await AssignmentReplicationTest.statementExecutor.execute(AssignmentReplicationTest.sqlStatementString);

//     assert.isNotEmpty(createDBResponse, 'Expected one hard booked assignment in db as all newly created assignments during project replication must be hard booked');
//     AssignmentReplicationTest.idOfCreatedAssignment = createDBResponse[0].ID;

//     // As per mock server response, the supply of first demand is for 10 hours. Thus expecting the header booked capacity after assignment creation to be 600 mins
//     assert.equal(createDBResponse[0].BOOKEDCAPACITYINMINUTES, 600, 'Assignment header booked capacity not correct for newly replicated supply');
//     console.log(`Hard booked assignment with ID - ${AssignmentReplicationTest.idOfCreatedAssignment} is newly created`);

//     // / /////////////////////////////////////////////////////////////////////////////////////
//     // / ///                 Testing assignment change scenarios                        //////
//     // / /////////////////////////////////////////////////////////////////////////////////////

//     // Scenario 1
//     // The second demand is shortened which deletes one assignment bucket out of total two assignment buckets
//     AssignmentReplicationTest.sqlStatementString = AssignmentReplicationTest.sqlGenerator.generateSelectStatement('COM_SAP_RESOURCEMANAGEMENT_ASSIGNMENT_ASSIGNMENTBUCKETS', ['ID'], "WHERE ASSIGNMENT_ID='d3ca64b0-7dbc-41a3-a253-af63adb25ab2'");
//     const changeDBResponse = await AssignmentReplicationTest.statementExecutor.execute(AssignmentReplicationTest.sqlStatementString);

//     assert.equal(changeDBResponse.length, 1, 'Expected one only one assignment bucket to be present for assignment of second demand');
//     console.log('Assignment with ID - d3ca64b0-7dbc-41a3-a253-af63adb25ab2 is successfully changed');

//     // Check the header booked capacity value
//     AssignmentReplicationTest.sqlStatementString = AssignmentReplicationTest.sqlGenerator.generateSelectStatement('COM_SAP_RESOURCEMANAGEMENT_ASSIGNMENT_ASSIGNMENTS', ['ID', 'BOOKEDCAPACITYINMINUTES'], "WHERE ID='d3ca64b0-7dbc-41a3-a253-af63adb25ab2'");
//     const assignmentHeaderAfterUpdateScenario1 = await AssignmentReplicationTest.statementExecutor.execute(AssignmentReplicationTest.sqlStatementString);
//     assert.equal(assignmentHeaderAfterUpdateScenario1[0].BOOKEDCAPACITYINMINUTES, 720, 'Assignment header booked capacity not correct after bucket deletion');

//     // Scenario 2
//     // The workpackage dates are shortened and new start/end not equal to the month start/end
//     // Before : WorkPackage (RYPROJID.1.2) -> 2020/09/01 - 2020/11/30 
//     //          AssignmentBuckets (on corresponding demand-resourcerequest) -> 2020/09/02-03, 2020/10/12-16, 2020/11/30 
//     // After : WorkPackage (RYPROJID.1.2) -> 2020/10/13 - 2020/10/15 -> New requestedEffort for demand -> 3hr
//     //         Expected AssignmentBuckets -> 2020/10/13, 2020/10/14, 2020/10/15.

//     AssignmentReplicationTest.sqlStatementString = AssignmentReplicationTest.sqlGenerator.generateSelectStatement('COM_SAP_RESOURCEMANAGEMENT_ASSIGNMENT_ASSIGNMENTBUCKETS', ['startTime', 'bookedCapacityInMinutes'], "WHERE ASSIGNMENT_ID='bada69b0-6cbc-41a3-a253-af63adb25bad' order by startTime");
//     let changeDBResponseWPChange = await AssignmentReplicationTest.statementExecutor.execute(AssignmentReplicationTest.sqlStatementString);

//     assert.equal(changeDBResponseWPChange.length, 3, 'Expected only 3 assignment buckets to be present for truncated work package');

//     // Comparing only startTime and bookedCapacityInMinutes because asignment update is actually delete and insert
//     // and thus the IDs would be different for buckets post update
//     let expectedAssignmentBuckets = [
//       {
//         BOOKEDCAPACITYINMINUTES: 60,
//         STARTTIME: '2020-10-13 00:00:00.000000000'
//       },
//       {
//         BOOKEDCAPACITYINMINUTES: 60,
//         STARTTIME: '2020-10-14 00:00:00.000000000'
//       },
//       {
//         BOOKEDCAPACITYINMINUTES: 60,
//         STARTTIME: '2020-10-15 00:00:00.000000000'
//       },
//     ];
//     assert.deepEqual(changeDBResponseWPChange, expectedAssignmentBuckets, 'AssignmentBuckets not as expected post replication');

//     // Assignment bada69b0-6cbc-41a3-a253-af63adb25bad had 8 buckets before, 1 hour each. Post the change, check that 3 buckets remain, 1 hour each
//     AssignmentReplicationTest.sqlStatementString = AssignmentReplicationTest.sqlGenerator.generateSelectStatement('COM_SAP_RESOURCEMANAGEMENT_ASSIGNMENT_ASSIGNMENTS', ['ID', 'BOOKEDCAPACITYINMINUTES'], "WHERE ID='bada69b0-6cbc-41a3-a253-af63adb25bad'");
//     const assignmentHeaderAfterUpdateScenario2 = await AssignmentReplicationTest.statementExecutor.execute(AssignmentReplicationTest.sqlStatementString);
//     assert.equal(assignmentHeaderAfterUpdateScenario2[0].BOOKEDCAPACITYINMINUTES, 180, 'Assignment header booked capacity not updated correctly after workpackage truncation');

//     console.log('Assignment with ID - bada69b0-6cbc-41a3-a253-af63adb25bad is successfully updated post update of WP RYPROJID.1.2');


//     // Scenario 3
//     // The workpackage dates are truncated while retaining the staffed hours in S4 and new start/end not equal to the month start/end
//     // Before : WorkPackage (RYPROJID.1.3) -> 2020/09/01 - 2020/11/30 
//     //          AssignmentBuckets (on corresponding demand-resourcerequest) -> 2020/09/02-04, 2020/10/12, 2020/11/27-30 
//     // After : WorkPackage (RYPROJID.1.3) -> 2020/09/03 - 2020/11/28 -> New requestedEffort same as old
//     //         Expected AssignmentBuckets -> 2020/09/03, 2020/09/04, 2020/10/12, 2020/11/27, 2020/11/28.

//     AssignmentReplicationTest.sqlStatementString = AssignmentReplicationTest.sqlGenerator.generateSelectStatement('COM_SAP_RESOURCEMANAGEMENT_ASSIGNMENT_ASSIGNMENTBUCKETS', ['startTime', 'bookedCapacityInMinutes'], "WHERE ASSIGNMENT_ID='badbadb0-6cbc-41a3-a253-af63adbadbad' order by startTime");
//     changeDBResponseWPChange = await AssignmentReplicationTest.statementExecutor.execute(AssignmentReplicationTest.sqlStatementString);

//     assert.equal(changeDBResponseWPChange.length, 5, 'Expected exactly 5 assignment buckets to be present for truncated work package');

//     // Comparing only startTime and bookedCapacityInMinutes because asignment update is actually delete and insert
//     // and thus the IDs would be different for buckets post update
//     expectedAssignmentBuckets = [
//       {
//         BOOKEDCAPACITYINMINUTES: 300,
//         STARTTIME: '2020-09-03 00:00:00.000000000'
//       },
//       {
//         BOOKEDCAPACITYINMINUTES: 300,
//         STARTTIME: '2020-09-04 00:00:00.000000000'
//       },
//       {
//         BOOKEDCAPACITYINMINUTES: 600,
//         STARTTIME: '2020-10-12 00:00:00.000000000'
//       },
//       {
//         BOOKEDCAPACITYINMINUTES: 300,
//         STARTTIME: '2020-11-27 00:00:00.000000000'
//       },
//       {
//         BOOKEDCAPACITYINMINUTES: 300,
//         STARTTIME: '2020-11-28 00:00:00.000000000'
//       },
//     ];
//     assert.deepEqual(changeDBResponseWPChange, expectedAssignmentBuckets, 'AssignmentBuckets not as expected post replication');

//     // Assignment badbadb0-6cbc-41a3-a253-af63adbadbad had 8 buckets for a total of 1800 mins. Post update the bucket distribution changes but the total booked hours should remain same on header
//     AssignmentReplicationTest.sqlStatementString = AssignmentReplicationTest.sqlGenerator.generateSelectStatement('COM_SAP_RESOURCEMANAGEMENT_ASSIGNMENT_ASSIGNMENTS', ['ID', 'BOOKEDCAPACITYINMINUTES'], "WHERE ID='badbadb0-6cbc-41a3-a253-af63adbadbad'");
//     const assignmentHeaderAfterUpdateScenario3 = await AssignmentReplicationTest.statementExecutor.execute(AssignmentReplicationTest.sqlStatementString);
//     assert.equal(assignmentHeaderBeforeUpdateScenario3[0].BOOKEDCAPACITYINMINUTES, 1800, 'Assignment header booked capacity not correct after workpackage truncation while retaining the staffed hours');

//     console.log('Assignment with ID - badbadb0-6cbc-41a3-a253-af63adbadbad is successfully updated post update of WP RYPROJID.1.3');

//     // / /////////////////////////////////////////////////////////////////////////////////////
//     // / ///                 Testing assignment delete scenario                         //////
//     // / /////////////////////////////////////////////////////////////////////////////////////

//     // Check whether the assignment is deleted along with the deletion of third demand
//     AssignmentReplicationTest.sqlStatementString = AssignmentReplicationTest.sqlGenerator.generateSelectStatement('COM_SAP_RESOURCEMANAGEMENT_ASSIGNMENT_ASSIGNMENTS', ['ID'], "WHERE ID='ab4a69b0-8dbc-41a3-a253-af63adb25cd3'");
//     const deleteDBResponse = await AssignmentReplicationTest.statementExecutor.execute(AssignmentReplicationTest.sqlStatementString);

//     assert.isEmpty(deleteDBResponse, 'Expected assignment for third demand to be deleted');
//     console.log('Third demand along with Assignment - ab4a69b0-8dbc-41a3-a253-af63adb25cd3 is successfully deleted');

//     // / /////////////////////////////////////////////////////////////////////////////////////
//     // / ///               Testing deletion of supply scenario                          //////
//     // / /////////////////////////////////////////////////////////////////////////////////////

//     // Check whether the assignment is deleted
//     AssignmentReplicationTest.sqlStatementString = AssignmentReplicationTest.sqlGenerator.generateSelectStatement('COM_SAP_RESOURCEMANAGEMENT_ASSIGNMENT_ASSIGNMENTS', ['ID'], "WHERE ID='ce4a69b0-6cbc-41a3-a253-af63adb25cf4'");
//     const deleteAssignmentDBResponse = await AssignmentReplicationTest.statementExecutor.execute(AssignmentReplicationTest.sqlStatementString);
//     // Check whether the corresponding supply is deleted
//     AssignmentReplicationTest.sqlStatementString = AssignmentReplicationTest.sqlGenerator.generateSelectStatement('COM_SAP_RESOURCEMANAGEMENT_SUPPLY_RESOURCESUPPLY', ['*'], "WHERE ASSIGNMENT_ID='ce4a69b0-6cbc-41a3-a253-af63adb25cf4' AND RESOURCESUPPLY_ID='0013'");
//     const deleteSupplyDBResponse = await AssignmentReplicationTest.statementExecutor.execute(AssignmentReplicationTest.sqlStatementString);

//     // Test that booked capacity of resources updated successfully
//     let sqlStatementString = AssignmentReplicationTest.sqlGenerator.generateSelectStatement('COM_SAP_RESOURCEMANAGEMENT_RESOURCE_BOOKEDCAPACITYAGGREGATE', ["resourceID", "startTime", "bookedCapacityInMinutes"], `WHERE resourceID IN ( 'de131e36-ae2a-11e9-a2a3-2a2ae2dbaba3', 'ab245e36-ae2a-11e9-a2a3-2a2ae2dacde9', 'cd267e36-ae2a-11e9-a2a3-2a2ae2dacac2', 'e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4' ) order by resourceID, startTime asc`);
//     let bookedCapacityAggregateResponse = await AssignmentReplicationTest.statementExecutor.execute(sqlStatementString);

//     // Resources ab245e36-ae2a-11e9-a2a3-2a2ae2dacde9 and cd267e36-ae2a-11e9-a2a3-2a2ae2dacac2 have only one assignment 
//     // ab4a69b0-8dbc-41a3-a253-af63adb25cd3 and ce4a69b0-6cbc-41a3-a253-af63adb25cf4 which get deleted above
//     // -> NO Booked Capacity Aggregate records expected for these two resources
//     // Assignment d3ca64b0-7dbc-41a3-a253-af63adb25ab2 on resource de131e36-ae2a-11e9-a2a3-2a2ae2dbaba3 gets truncated 
//     // from 2 buckets to one bucket with same total duration as before
//     // -> Booked Capacity Aggregate for de131e36-ae2a-11e9-a2a3-2a2ae2dbaba3 increases on 02-09
//     // For resource e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4, one create followed by 2 updates resulting below records
//     let expectedBookedCapacityAggregateResponse: any[] = [
//       {
//         RESOURCEID: 'de131e36-ae2a-11e9-a2a3-2a2ae2dbaba3',
//         STARTTIME: '2020-09-02 00:00:00.000000000',
//         BOOKEDCAPACITYINMINUTES: 720
//       },
//       {
//         RESOURCEID: 'e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4',
//         STARTTIME: '2020-09-02 00:00:00.000000000',
//         BOOKEDCAPACITYINMINUTES: 240
//       },
//       {
//         RESOURCEID: 'e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4',
//         STARTTIME: '2020-09-03 00:00:00.000000000',
//         BOOKEDCAPACITYINMINUTES: 480
//       },
//       {
//         RESOURCEID: 'e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4',
//         STARTTIME: '2020-09-04 00:00:00.000000000',
//         BOOKEDCAPACITYINMINUTES: 480
//       },
//       {
//         RESOURCEID: 'e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4',
//         STARTTIME: '2020-10-12 00:00:00.000000000',
//         BOOKEDCAPACITYINMINUTES: 600
//       },
//       {
//         RESOURCEID: 'e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4',
//         STARTTIME: '2020-10-13 00:00:00.000000000',
//         BOOKEDCAPACITYINMINUTES: 60
//       },
//       {
//         RESOURCEID: 'e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4',
//         STARTTIME: '2020-10-14 00:00:00.000000000',
//         BOOKEDCAPACITYINMINUTES: 60
//       },
//       {
//         RESOURCEID: 'e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4',
//         STARTTIME: '2020-10-15 00:00:00.000000000',
//         BOOKEDCAPACITYINMINUTES: 60
//       },
//       {
//         RESOURCEID: 'e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4',
//         STARTTIME: '2020-11-27 00:00:00.000000000',
//         BOOKEDCAPACITYINMINUTES: 300
//       },
//       {
//         RESOURCEID: 'e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4',
//         STARTTIME: '2020-11-28 00:00:00.000000000',
//         BOOKEDCAPACITYINMINUTES: 300
//       }
//     ];

//     assert.deepEqual(bookedCapacityAggregateResponse, expectedBookedCapacityAggregateResponse, 'Actual booked capacity aggregate not as expected');

//     assert.isEmpty(deleteAssignmentDBResponse, 'Expected assignment for fourth demand to be deleted');
//     assert.isEmpty(deleteSupplyDBResponse, 'Expected supply for fourth demand to be deleted');
//     console.log('Assignment with ID - ce4a69b0-6cbc-41a3-a253-af63adb25cf4 is successfully deleted');
//     console.log('Supply - 0013 corresponding to Assignment with ID - ce4a69b0-6cbc-41a3-a253-af63adb25cf4 is successfully deleted');

//     // / /////////////////////////////////////////////////////////////////////////////////////
//     // / ///               TESTS FOR SOFT BOOKED ASSIGNMENTS                            //////
//     // / /////////////////////////////////////////////////////////////////////////////////////

//     // Existing soft booked assignment ce4a69b0-6cbc-41a3-0010-af63adb25cf4 should be deleted and new hard booked assignment created as the S4 supply has same resource-request combination
//     AssignmentReplicationTest.sqlStatementString = AssignmentReplicationTest.sqlGenerator.generateSelectStatement('COM_SAP_RESOURCEMANAGEMENT_ASSIGNMENT_ASSIGNMENTS', ['ID'], "WHERE ID='ce4a69b0-6cbc-41a3-0010-af63adb25cf4'");
//     const deleteSoftBookedAssignmentDBResponse = await AssignmentReplicationTest.statementExecutor.execute(AssignmentReplicationTest.sqlStatementString);
//     assert.isEmpty(deleteSoftBookedAssignmentDBResponse, 'Expected soft booked assignment ce4a69b0-6cbc-41a3-0010-af63adb25cf4 to be deleted');
//     // Check whether corresponding hard booked assignment is created for the request-resource combination
//     AssignmentReplicationTest.sqlStatementString = AssignmentReplicationTest.sqlGenerator.generateSelectStatement('COM_SAP_RESOURCEMANAGEMENT_ASSIGNMENT_ASSIGNMENTS', ['ID', 'BOOKEDCAPACITYINMINUTES'], "WHERE RESOURCEREQUEST_ID='badbadbd-d835-441e-0010-54b2aebadbad' AND RESOURCE_ID='e1011e36-ae2a-11e9-0000-2a2ae2dbcce4' AND assignmentstatus_code=0");
//     let createdHardBookedAssignmentResponse = await AssignmentReplicationTest.statementExecutor.execute(AssignmentReplicationTest.sqlStatementString);

//     assert.isNotEmpty(createdHardBookedAssignmentResponse, 'Expected one hard booked assignment in db corresponding for resource e1011e36-ae2a-11e9-0000-2a2ae2dbcce4 and request badbadbd-d835-441e-0010-54b2aebadbad');
//     assert.equal(createdHardBookedAssignmentResponse[0].BOOKEDCAPACITYINMINUTES, 180, 'Expected 3h assignment to be created');
//     AssignmentReplicationTest.idOfCreatedHardBookedAssignment = createdHardBookedAssignmentResponse[0].ID;
//     console.log(`Hard booked assignment with ID - ${AssignmentReplicationTest.idOfCreatedHardBookedAssignment} is newly created`);


//     // The workpackage RYPROJID.1.4 dates are truncated in S4 
//     // Before : WorkPackage (RYPROJID.1.4) -> 2020/09/01 - 2020/11/30 
//     //          AssignmentBuckets (on corresponding demand-resourcerequest) -> 2020/09/02-04, 2020/10/12, 2020/10/13 
//     // After : WorkPackage (RYPROJID.1.4) -> 2020/09/03 - 2020/10/12
//     //         Expected AssignmentBuckets -> 2020/09/03, 2020/09/04, 2020/10/12

//     AssignmentReplicationTest.sqlStatementString = AssignmentReplicationTest.sqlGenerator.generateSelectStatement('COM_SAP_RESOURCEMANAGEMENT_ASSIGNMENT_ASSIGNMENTBUCKETS', ['startTime', 'bookedCapacityInMinutes'], "WHERE ASSIGNMENT_ID='bada69b0-6cbc-41a3-0011-af63adb25bad' order by startTime");
//     changeDBResponseWPChange = await AssignmentReplicationTest.statementExecutor.execute(AssignmentReplicationTest.sqlStatementString);

//     assert.equal(changeDBResponseWPChange.length, 3, 'Expected exactly 3 assignment buckets to be present for truncated work package');

//     expectedAssignmentBuckets = [
//       {
//         BOOKEDCAPACITYINMINUTES: 60,
//         STARTTIME: '2020-09-03 00:00:00.000000000'
//       },
//       {
//         BOOKEDCAPACITYINMINUTES: 60,
//         STARTTIME: '2020-09-04 00:00:00.000000000'
//       },
//       {
//         BOOKEDCAPACITYINMINUTES: 60,
//         STARTTIME: '2020-10-12 00:00:00.000000000'
//       },
//     ];
//     assert.deepEqual(changeDBResponseWPChange, expectedAssignmentBuckets, 'AssignmentBuckets for soft booked assignment not as expected post truncation of resource request');
//     console.log('Soft booked assignment with ID - bada69b0-6cbc-41a3-0011-af63adb25bad is successfully updated post update of WP RYPROJID.1.4');

//     // Soft booked assignment badbadb0-6cbc-41a3-0012-af63adbadbad should be deleted as S4 demand is deleted
//     AssignmentReplicationTest.sqlStatementString = AssignmentReplicationTest.sqlGenerator.generateSelectStatement('COM_SAP_RESOURCEMANAGEMENT_ASSIGNMENT_ASSIGNMENTS', ['ID'], "WHERE ID='badbadb0-6cbc-41a3-0012-af63adbadbad'");
//     const deleteSoftBookedAssignmentResponse = await AssignmentReplicationTest.statementExecutor.execute(AssignmentReplicationTest.sqlStatementString);
//     assert.isEmpty(deleteSoftBookedAssignmentResponse, 'Expected soft booked assignment badbadb0-6cbc-41a3-0012-af63adbadbad for third demand to be deleted as S4 demand is deleted');

//     // / /////////////////////////////////////////////////////////////////////////////////////
//     // / ///               TESTS FOR PROPOSED ASSIGNMENTS                               //////
//     // / /////////////////////////////////////////////////////////////////////////////////////

//     // Existing proposed assignment ce4a69b0-6cbc-41a3-0020-af63adb25cf4 should be deleted and new hard booked assignment created as the S4 supply has same resource-request combination
//     AssignmentReplicationTest.sqlStatementString = AssignmentReplicationTest.sqlGenerator.generateSelectStatement('COM_SAP_RESOURCEMANAGEMENT_ASSIGNMENT_ASSIGNMENTS', ['ID'], "WHERE ID='ce4a69b0-6cbc-41a3-0020-af63adb25cf4'");
//     const deleteProposedAssignmentDBResponse = await AssignmentReplicationTest.statementExecutor.execute(AssignmentReplicationTest.sqlStatementString);
//     assert.isEmpty(deleteProposedAssignmentDBResponse, 'Expected proposed assignment ce4a69b0-6cbc-41a3-0020-af63adb25cf4 to be deleted');
//     // Check whether corresponding hard booked assignment is created for the request-resource combination
//     AssignmentReplicationTest.sqlStatementString = AssignmentReplicationTest.sqlGenerator.generateSelectStatement('COM_SAP_RESOURCEMANAGEMENT_ASSIGNMENT_ASSIGNMENTS', ['ID', 'BOOKEDCAPACITYINMINUTES'], "WHERE RESOURCEREQUEST_ID='badbadbd-d835-441e-0020-54b2aebadbad' AND RESOURCE_ID='e1011e36-ae2a-11e9-0001-2a2ae2dbcce4' AND assignmentstatus_code=0");
//     createdHardBookedAssignmentResponse = await AssignmentReplicationTest.statementExecutor.execute(AssignmentReplicationTest.sqlStatementString);

//     assert.isNotEmpty(createdHardBookedAssignmentResponse, 'Expected one hard booked assignment in db corresponding for resource e1011e36-ae2a-11e9-0001-2a2ae2dbcce4 and request badbadbd-d835-441e-0020-54b2aebadbad');
//     assert.equal(createdHardBookedAssignmentResponse[0].BOOKEDCAPACITYINMINUTES, 180, 'Expected 3h assignment to be created');
//     AssignmentReplicationTest.idOfCreatedHardBookedAssignmentForProposedAssignment = createdHardBookedAssignmentResponse[0].ID;
//     console.log(`Hard booked assignment with ID - ${AssignmentReplicationTest.idOfCreatedHardBookedAssignmentForProposedAssignment} is newly created`);


//     // The workpackage RYPROJID.1.5 dates are truncated in S4 
//     // Before : WorkPackage (RYPROJID.1.5) -> 2020/09/01 - 2020/11/30 
//     //          AssignmentBuckets (on corresponding demand-resourcerequest) -> 2020/09/02-04, 2020/10/12, 2020/10/13 
//     // After : WorkPackage (RYPROJID.1.5) -> 2020/09/03 - 2020/10/12
//     //         Expected AssignmentBuckets -> 2020/09/03, 2020/09/04, 2020/10/12

//     AssignmentReplicationTest.sqlStatementString = AssignmentReplicationTest.sqlGenerator.generateSelectStatement('COM_SAP_RESOURCEMANAGEMENT_ASSIGNMENT_ASSIGNMENTBUCKETS', ['startTime', 'bookedCapacityInMinutes'], "WHERE ASSIGNMENT_ID='bada69b0-6cbc-41a3-0021-af63adb25bad' order by startTime");
//     changeDBResponseWPChange = await AssignmentReplicationTest.statementExecutor.execute(AssignmentReplicationTest.sqlStatementString);

//     assert.equal(changeDBResponseWPChange.length, 3, 'Expected exactly 3 assignment buckets to be present for truncated work package');

//     expectedAssignmentBuckets = [
//       {
//         BOOKEDCAPACITYINMINUTES: 60,
//         STARTTIME: '2020-09-03 00:00:00.000000000'
//       },
//       {
//         BOOKEDCAPACITYINMINUTES: 60,
//         STARTTIME: '2020-09-04 00:00:00.000000000'
//       },
//       {
//         BOOKEDCAPACITYINMINUTES: 60,
//         STARTTIME: '2020-10-12 00:00:00.000000000'
//       },
//     ];
//     assert.deepEqual(changeDBResponseWPChange, expectedAssignmentBuckets, 'AssignmentBuckets for soft booked assignment not as expected post truncation of resource request');
//     console.log('Proposed assignment with ID - bada69b0-6cbc-41a3-0021-af63adb25bad is successfully updated post update of WP RYPROJID.1.5');

//     // Proposed assignment badbadb0-6cbc-41a3-0022-af63adbadbad should be deleted as S4 demand is deleted
//     AssignmentReplicationTest.sqlStatementString = AssignmentReplicationTest.sqlGenerator.generateSelectStatement('COM_SAP_RESOURCEMANAGEMENT_ASSIGNMENT_ASSIGNMENTS', ['ID'], "WHERE ID='badbadb0-6cbc-41a3-0022-af63adbadbad'");
//     const deleteProposedAssignmentResponse = await AssignmentReplicationTest.statementExecutor.execute(AssignmentReplicationTest.sqlStatementString);
//     assert.isEmpty(deleteProposedAssignmentResponse, 'Expected proposed assignment badbadb0-6cbc-41a3-0022-af63adbadbad for third demand to be deleted as S4 demand is deleted');

//   }

//   static async after() {
//     // Delete the assignment and buckets which were created
//     AssignmentReplicationTest.sqlStatementString = AssignmentReplicationTest.sqlGenerator.generateDeleteStatement('COM_SAP_RESOURCEMANAGEMENT_ASSIGNMENT_ASSIGNMENTS', `WHERE ID IN ( '${AssignmentReplicationTest.idOfCreatedAssignment}', '${AssignmentReplicationTest.idOfCreatedHardBookedAssignment}', '${AssignmentReplicationTest.idOfCreatedHardBookedAssignmentForProposedAssignment}' )`);
//     await AssignmentReplicationTest.statementExecutor.execute(AssignmentReplicationTest.sqlStatementString);

//     AssignmentReplicationTest.sqlStatementString = AssignmentReplicationTest.sqlGenerator.generateDeleteStatement('COM_SAP_RESOURCEMANAGEMENT_ASSIGNMENT_ASSIGNMENTBUCKETS', `WHERE ASSIGNMENT_ID IN ( '${AssignmentReplicationTest.idOfCreatedAssignment}', '${AssignmentReplicationTest.idOfCreatedHardBookedAssignment}', '${AssignmentReplicationTest.idOfCreatedHardBookedAssignmentForProposedAssignment}' )`);
//     await AssignmentReplicationTest.statementExecutor.execute(AssignmentReplicationTest.sqlStatementString);
//     AssignmentReplicationTest.sqlStatementString = AssignmentReplicationTest.sqlGenerator.generateDeleteStatement('COM_SAP_RESOURCEMANAGEMENT_SUPPLY_RESOURCESUPPLY', `WHERE ASSIGNMENT_ID IN ( '${AssignmentReplicationTest.idOfCreatedAssignment}', '${AssignmentReplicationTest.idOfCreatedHardBookedAssignment}', '${AssignmentReplicationTest.idOfCreatedHardBookedAssignmentForProposedAssignment}' )`);
//     await AssignmentReplicationTest.statementExecutor.execute(AssignmentReplicationTest.sqlStatementString);
//     AssignmentReplicationTest.sqlStatementString = AssignmentReplicationTest.sqlGenerator.generateDeleteStatement('COM_SAP_RESOURCEMANAGEMENT_ASSIGNMENT_ASSIGNMENTBUCKETS', "WHERE ASSIGNMENT_ID='d3ca64b0-7dbc-41a3-a253-af63adb25ab2'");
//     await AssignmentReplicationTest.statementExecutor.execute(AssignmentReplicationTest.sqlStatementString);
//     AssignmentReplicationTest.sqlStatementString = AssignmentReplicationTest.sqlGenerator.generateDeleteStatement('COM_SAP_RESOURCEMANAGEMENT_ASSIGNMENT_ASSIGNMENTBUCKETS', "WHERE ASSIGNMENT_ID='bada69b0-6cbc-41a3-a253-af63adb25bad'");
//     await AssignmentReplicationTest.statementExecutor.execute(AssignmentReplicationTest.sqlStatementString);
//     AssignmentReplicationTest.sqlStatementString = AssignmentReplicationTest.sqlGenerator.generateDeleteStatement('COM_SAP_RESOURCEMANAGEMENT_ASSIGNMENT_ASSIGNMENTBUCKETS', "WHERE ASSIGNMENT_ID='badbadb0-6cbc-41a3-a253-af63adbadbad'");
//     await AssignmentReplicationTest.statementExecutor.execute(AssignmentReplicationTest.sqlStatementString);
//     AssignmentReplicationTest.sqlStatementString = AssignmentReplicationTest.sqlGenerator.generateDeleteStatement('COM_SAP_RESOURCEMANAGEMENT_RESOURCE_BOOKEDCAPACITYAGGREGATE', "WHERE resourceID IN ( 'de131e36-ae2a-11e9-a2a3-2a2ae2dbaba3', 'ab245e36-ae2a-11e9-a2a3-2a2ae2dacde9', 'cd267e36-ae2a-11e9-a2a3-2a2ae2dacac2', 'e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4', 'e1011e36-ae2a-11e9-0000-2a2ae2dbcce4', 'e1011e36-ae2a-11e9-0001-2a2ae2dbcce4' )");
//     await AssignmentReplicationTest.statementExecutor.execute(AssignmentReplicationTest.sqlStatementString);
//     console.log('Data created by delta replication job is successfully deleted');

//     // Delete the test data
//     await deleteData();
//   }
// }
