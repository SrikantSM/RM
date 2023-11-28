import {
  OrganizationDetailRepository,
  OrganizationHeaderRepository,
  CostCenterRepository,
} from 'test-commons';
import { testEnvironment } from '../../../../utils';

import * as data from './data';

let organizationDetailsRepository: OrganizationDetailRepository;
let organizationHeaderRepository: OrganizationHeaderRepository;
let costCenterRepository: CostCenterRepository;

async function createRepository() {
  organizationDetailsRepository = await testEnvironment.getOrganizationDetailRepository();
  organizationHeaderRepository = await testEnvironment.getOrganizationHeaderRepository();
  costCenterRepository = await testEnvironment.getCostCenterRepository();
}

export async function deleteData() {
  await organizationHeaderRepository.deleteMany(data.organizationHeaders);
  await organizationDetailsRepository.deleteMany(data.organizationDetails);
  await costCenterRepository.deleteMany(data.costCenterData);
  console.log('Default data deletion completed.');
}

export async function insertData() {
  await createRepository();
  await deleteData();
  await organizationHeaderRepository.insertMany(data.organizationHeaders);
  await organizationDetailsRepository.insertMany(data.organizationDetails);
  await costCenterRepository.insertMany(data.costCenterData);
  console.log('Default data insertion completed.');
}
