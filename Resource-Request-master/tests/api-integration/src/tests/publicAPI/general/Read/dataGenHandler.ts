import {
  OrganizationDetailRepository,
  OrganizationHeaderRepository,
  CostCenterRepository,
  ResourceRequestRepository,
} from 'test-commons';
import { testEnvironment } from '../../../../utils';

import * as data from './data';

let organizationDetailsRepository: OrganizationDetailRepository;
let organizationHeaderRepository: OrganizationHeaderRepository;
let costCenterRepository: CostCenterRepository;
let resourceRequestRepository: ResourceRequestRepository;

async function createRepository() {
  organizationDetailsRepository = await testEnvironment.getOrganizationDetailRepository();
  organizationHeaderRepository = await testEnvironment.getOrganizationHeaderRepository();
  costCenterRepository = await testEnvironment.getCostCenterRepository();
  resourceRequestRepository = await testEnvironment.getResourceRequestRepository();
}

export async function deleteData() {
  await organizationHeaderRepository.deleteMany(data.organizationHeaders);
  await organizationDetailsRepository.deleteMany(data.organizationDetails);
  await costCenterRepository.deleteMany(data.costCenterData);
  await resourceRequestRepository.deleteMany(data.resourceRequestData);
  console.log('Default data deletion completed.');
}

export async function insertData() {
  await createRepository();
  await deleteData();
  await organizationHeaderRepository.insertMany(data.organizationHeaders);
  await organizationDetailsRepository.insertMany(data.organizationDetails);
  await costCenterRepository.insertMany(data.costCenterData);
  await resourceRequestRepository.insertMany(data.resourceRequestData);
  console.log('Default data insertion completed.');
}
