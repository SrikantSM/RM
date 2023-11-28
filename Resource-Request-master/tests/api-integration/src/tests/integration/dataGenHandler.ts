import {
  DemandRepository,
  ProjectRepository,
  ProjectSyncRepository,
  ProjectReplicationFilterRepository,
  ProjectReplicationFilterValueRepository,
  ProjectReplicationStatusRepository,
  WorkPackageRepository,
  ResourceRequestRepository,
  WorkAssignmentRepository,
  WorkforcePersonRepository,
  ResourceCapacityRepository,
  AssignmentsRepository,
  AssignmentBucketRepository,
  ResourceSupplyRepository,
  ProjectReplicationTasksRepository,
  CapacityRequirementRepository,
  BookedCapacityAggregateRepository,
  OrganizationHeaderRepository
} from 'test-commons';

import * as data from './data';
import { testEnvironment } from '../../utils';

let projectRepository : ProjectRepository;
let projectSyncRepository : ProjectSyncRepository;
let demandRepository : DemandRepository;
let workPackageRepository : WorkPackageRepository;
let resourceRequestRepository : ResourceRequestRepository;
let workforcePersonRepository : WorkforcePersonRepository;
let workAssignmentRepository : WorkAssignmentRepository;
let resourceCapacityRepository : ResourceCapacityRepository;
let projectReplicationFilterRepository : ProjectReplicationFilterRepository;
let projectReplicationFilterValueRepository : ProjectReplicationFilterValueRepository;
let projectReplicationStatusRepository : ProjectReplicationStatusRepository;
let assignmentsRepository : AssignmentsRepository;
let assignmentBucketRepository : AssignmentBucketRepository;
let resourceSupplyRepository : ResourceSupplyRepository;
let projectReplicationTasksRepository : ProjectReplicationTasksRepository;
let capacityRequirementRepository : CapacityRequirementRepository;
let bookedCapacityAggregateRepository : BookedCapacityAggregateRepository;
let deliveryOrgHeaderRepository : OrganizationHeaderRepository;

async function createRepository() {
  projectRepository = await testEnvironment.getProjectRepository();
  projectSyncRepository = await testEnvironment.getProjectSyncRepository();
  demandRepository = await testEnvironment.getDemandRepository();
  workPackageRepository = await testEnvironment.getWorkPackageRepository();
  resourceRequestRepository = await testEnvironment.getResourceRequestRepository();
  workforcePersonRepository = await testEnvironment.getWorkforcePersonRepository();
  workAssignmentRepository = await testEnvironment.getWorkAssignmentRepository();
  resourceCapacityRepository = await testEnvironment.getResourceCapacityRepository();
  projectReplicationFilterRepository = await testEnvironment.getProjectReplicationFilterRepository();
  projectReplicationFilterValueRepository = await testEnvironment.getProjectReplicationFilterValueRepository();
  projectReplicationStatusRepository = await testEnvironment.getProjectReplicationStatusRepository();
  assignmentsRepository = await testEnvironment.getAssignmentsRepository();
  assignmentBucketRepository = await testEnvironment.getAssignmentBucketRepository();
  resourceSupplyRepository = await testEnvironment.getResourceSupplyRepository();
  projectReplicationTasksRepository = await testEnvironment.getProjectReplicationTasksRepository();
  capacityRequirementRepository = await testEnvironment.getCapacityRequirementRepository();
  bookedCapacityAggregateRepository = await testEnvironment.getBookedCapacityAggregateRepository();
  deliveryOrgHeaderRepository = await testEnvironment.getOrganizationHeaderRepository();
}

export async function deleteData() {
  await projectRepository.deleteMany(data.projects);
  await projectSyncRepository.deleteMany(data.projectSync);
  await demandRepository.deleteMany(data.demands);
  await workPackageRepository.deleteMany(data.workPackages);
  await resourceRequestRepository.deleteMany(data.resourceRequests);
  await workforcePersonRepository.deleteMany(data.workforcePersons);
  await workAssignmentRepository.deleteMany(data.workAssignments);
  await resourceCapacityRepository.deleteMany(data.resourceCapacities);
  await projectReplicationFilterRepository.deleteMany(data.projectReplicationFilter);
  await projectReplicationFilterValueRepository.deleteMany(data.projectReplicationFilterValues);
  await projectReplicationStatusRepository.deleteMany(data.projectReplicationStatus);
  await assignmentsRepository.deleteMany(data.assignments);
  await assignmentBucketRepository.deleteMany(data.assignmentBuckets);
  await resourceSupplyRepository.deleteMany(data.resourceSupplies);
  await projectReplicationTasksRepository.deleteMany(data.projectReplicationTasks);
  await capacityRequirementRepository.deleteMany(data.capacityRequirements);
  await bookedCapacityAggregateRepository.deleteMany(data.bookedCapacityAggregate);
  await deliveryOrgHeaderRepository.deleteMany(data.deliveryOrgHeader);

  console.log('Default data deletion is completed.');
}

export async function insertData() {
  await createRepository();
  await deleteData();

  await projectRepository.insertMany(data.projects);
  await projectSyncRepository.insertMany(data.projectSync);
  await demandRepository.insertMany(data.demands);
  await workPackageRepository.insertMany(data.workPackages);
  await resourceRequestRepository.insertMany(data.resourceRequests);
  await workforcePersonRepository.insertMany(data.workforcePersons);
  await workAssignmentRepository.insertMany(data.workAssignments);
  await resourceCapacityRepository.insertMany(data.resourceCapacities);
  await projectReplicationFilterRepository.insertMany(data.projectReplicationFilter);
  await projectReplicationFilterValueRepository.insertMany(data.projectReplicationFilterValues);
  await projectReplicationStatusRepository.insertMany(data.projectReplicationStatus);
  await assignmentsRepository.insertMany(data.assignments);
  await assignmentBucketRepository.insertMany(data.assignmentBuckets);
  await resourceSupplyRepository.insertMany(data.resourceSupplies);
  await projectReplicationTasksRepository.insertMany(data.projectReplicationTasks);
  await capacityRequirementRepository.insertMany(data.capacityRequirements);
  await bookedCapacityAggregateRepository.insertMany(data.bookedCapacityAggregate);
  await deliveryOrgHeaderRepository.insertMany(data.deliveryOrgHeader);

  console.log('Default data insertion is completed.');
}
