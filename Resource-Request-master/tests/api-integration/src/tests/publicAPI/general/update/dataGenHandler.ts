import {
  OrganizationDetailRepository,
  OrganizationHeaderRepository,
  CostCenterRepository,
  ResourceRequestRepository,
  BillingRoleRepository,
  BillingCategoryRepository,
  CustomerRepository,
  ProjectRepository,
  WorkPackageRepository,
  DemandRepository,
  ReferenceObjectRepository,
} from 'test-commons';
import { testEnvironment } from '../../../../utils';

import * as data from './data';

let organizationDetailsRepository: OrganizationDetailRepository;
let organizationHeaderRepository: OrganizationHeaderRepository;
let costCenterRepository: CostCenterRepository;
let billingCategoryRepository: BillingCategoryRepository;
let billingRoleRepository: BillingRoleRepository;
let customerRepository: CustomerRepository;
let projectRepository: ProjectRepository;
let workPackageRepository: WorkPackageRepository;
let demandRepository: DemandRepository;
let resourceRequestRepository: ResourceRequestRepository;
let referenceObjectApiRepository: ReferenceObjectRepository;

async function createRepository() {
  organizationDetailsRepository = await testEnvironment.getOrganizationDetailRepository();
  organizationHeaderRepository = await testEnvironment.getOrganizationHeaderRepository();
  costCenterRepository = await testEnvironment.getCostCenterRepository();
  billingCategoryRepository = await testEnvironment.getBillingCategoryRepository();
  billingRoleRepository = await testEnvironment.getBillingRoleRepository();
  customerRepository = await testEnvironment.getCustomerRepository();
  projectRepository = await testEnvironment.getProjectRepository();
  workPackageRepository = await testEnvironment.getWorkPackageRepository();
  demandRepository = await testEnvironment.getDemandRepository();
  resourceRequestRepository = await testEnvironment.getResourceRequestRepository();
  referenceObjectApiRepository = await testEnvironment.getReferenceObjectRepository();
}

export async function deleteData() {
  await organizationHeaderRepository.deleteMany(data.organizationHeaders);
  await organizationDetailsRepository.deleteMany(data.organizationDetails);
  await costCenterRepository.deleteMany(data.costCenterData);
  await billingCategoryRepository.deleteMany(data.billingCategories);
  await billingRoleRepository.deleteMany(data.billingRoles);
  await customerRepository.deleteMany(data.customers);
  await projectRepository.deleteMany(data.projects);
  await workPackageRepository.deleteMany(data.workPackages);
  await demandRepository.deleteMany(data.demands);
  await resourceRequestRepository.deleteMany(data.resourceRequestData);
  await referenceObjectApiRepository.deleteMany(data.referenceObject);
  console.log('Default data deletion completed.');
}

export async function insertData() {
  await createRepository();
  await deleteData();
  await organizationHeaderRepository.insertMany(data.organizationHeaders);
  await organizationDetailsRepository.insertMany(data.organizationDetails);
  await costCenterRepository.insertMany(data.costCenterData);
  await billingCategoryRepository.insertMany(data.billingCategories);
  await billingRoleRepository.insertMany(data.billingRoles);
  await customerRepository.insertMany(data.customers);
  await projectRepository.insertMany(data.projects);
  await workPackageRepository.insertMany(data.workPackages);
  await demandRepository.insertMany(data.demands);
  await resourceRequestRepository.insertMany(data.resourceRequestData);
  await referenceObjectApiRepository.insertMany(data.referenceObject);
  console.log('Default data insertion completed.');
}
