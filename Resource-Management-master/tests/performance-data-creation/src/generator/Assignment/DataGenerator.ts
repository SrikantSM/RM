import { AxiosInstance } from 'axios';
import { TestEnvironment, IEnvironment, BookedCapacityAggregateRepository, Assignments, AssignmentBucket, AssignmentsRepository, AssignmentBucketRepository, ResourceSupply, ResourceSupplyRepository } from 'test-commons';
import { getAssignmentBatchSize, getAssignmentServiceClient } from '../../utils';
import { batchArray, AssignmentAPIPayload } from '../../utils/util';

export async function getInsertDynamicDataAssignmentAPIEntitiesPromises(testEnvironmentInstance: TestEnvironment<IEnvironment>, data: Map<string, any[]>): Promise<any> {
  console.log('getInsertDynamicDataAssignmentEntitiesPromises is called.');
  let assignmentAPIPayloads = data.get('assignmentsAPIPayloads');
  let ASSIGNMENT_BATCH_SIZE: number = await getAssignmentBatchSize();
  console.info("Using a batch size of " + ASSIGNMENT_BATCH_SIZE + " for assignment creation via API");
  if (assignmentAPIPayloads && Array.isArray(assignmentAPIPayloads) && assignmentAPIPayloads.length > 0) {
    console.info('>>>>>> Starting Assignment data creation. Assignment Batch size is ' + ASSIGNMENT_BATCH_SIZE);
    let assignmentServiceClient = await getAssignmentServiceClient();
    for (const batch of batchArray(assignmentAPIPayloads, ASSIGNMENT_BATCH_SIZE)) {
      await Promise.all(batch.map((payload) => callAssignmentAPIChain(assignmentServiceClient, payload).catch(err => { console.error(err) })));
    }
  } else {
    console.error('>>>> ASSIGNMENT CREATION FAILED: Data was not generated correctly');
  }
}

async function callAssignmentAPIChain(assignmentServiceClient: AxiosInstance, payload: AssignmentAPIPayload) {
  //1. Simulate new assignment
  let simulationResponse = await assignmentServiceClient.post('/SimulateAsgBasedOnTotalHours', payload, { timeout: 600000 })
    .catch((err) => { throw err; });

  // check simulation status
  if (simulationResponse.status !== 200) {
    throw 'Assignment simulation for Resource (' + payload.resourceId + ') and Request    (' + payload.resourceRequestId + ') failed with status = ' + simulationResponse.status;
  } else if (!simulationResponse.data) {
    throw 'Assignment simulation did not return valid simulation data';
  }

  //2. Create Draft from the simulation
  delete simulationResponse.data['@context'];
  const payloadForDraftCreation = simulationResponse.data;
  const draftCreateResponse = await assignmentServiceClient.post('/Assignments', payloadForDraftCreation)
    .catch((err) => { throw err; });

  // check draft creation status
  if (draftCreateResponse.status !== 201) {
    throw 'Create Draft for Resource (' + payload.resourceId + ') and Request (' + payload.resourceRequestId + ') failed with status = ' + draftCreateResponse.status;
  } else if (!draftCreateResponse.data) {
    throw 'Create draft did not return valid response data';
  }

  //3. Activate Draft 
  const payloadForDraftActivation = {};
  const activateDraftResponse = await assignmentServiceClient.post('/Assignments(ID=' + draftCreateResponse.data.ID + ',IsActiveEntity=false)/AssignmentService.draftActivate', payloadForDraftActivation)
    .catch((err) => { throw err; });

  // check activate draft status
  if (activateDraftResponse.status !== 200) {
    throw 'Activate Draft for Resource (' + payload.resourceId + ') and Request (' + payload.resourceRequestId + ') failed with status = ' + JSON.stringify(activateDraftResponse.status);
  } else if (!activateDraftResponse.data) {
    throw 'Activate draft did not return valid response data';
  }
}

export async function getInsertDynamicDataAssignmentDBEntitiesPromises(testEnvironmentInstance: TestEnvironment<IEnvironment>, data: Map<string, any[]>): Promise<any> {
  console.log('getInsertDynamicDataAssignmentDBEntitiesPromises is called.');
  const assignmentHeaderDBPayloads: Assignments[] | undefined = data.get('Assignments');
  const assignmentBucketsDBPayLoads: AssignmentBucket[] | undefined = data.get('AssignmentBucket');
  const resourceSupplyDBPayloads: ResourceSupply[] | undefined = data.get('Supply');

  if (assignmentHeaderDBPayloads !== undefined && assignmentBucketsDBPayLoads !== undefined) {

    let assignmentRepository: AssignmentsRepository = await testEnvironmentInstance.getAssignmentsRepository();
    let assignmentBucketRepository: AssignmentBucketRepository = await testEnvironmentInstance.getAssignmentBucketRepository();
    let resourceSupplyRepository: ResourceSupplyRepository = await testEnvironmentInstance.getResourceSupplyRepository();
    let bookedCapacityAggregateRepository: BookedCapacityAggregateRepository = await testEnvironmentInstance.getBookedCapacityAggregateRepository();

    console.log("Creating " + assignmentHeaderDBPayloads.length + " Assignment headers");
    await assignmentRepository.insertMany(assignmentHeaderDBPayloads);

    console.log("Creating " + assignmentBucketsDBPayLoads.length + " Assignment buckets");
    await assignmentBucketRepository.insertMany(assignmentBucketsDBPayLoads);

    if (resourceSupplyDBPayloads !== undefined) {
      console.log("Creating " + resourceSupplyDBPayloads.length + " Resource Supplies");
      await resourceSupplyRepository.insertMany(resourceSupplyDBPayloads);
    }

    console.log("Updating resource booked capacities...");
    await bookedCapacityAggregateRepository.populateTable();
    
  }
  else {
    console.error('getInsertDynamicDataAssignmentDBEntitiesPromises data is invalid: ', data);
    process.exit(1);
  }
}
