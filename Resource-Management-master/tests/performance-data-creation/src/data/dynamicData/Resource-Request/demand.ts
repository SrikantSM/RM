import { Demand, DemandCapacityRequirement, WorkPackage, OrganizationHeader } from 'test-commons';
import { getWorkPackageBatchDynamicData, getTestWorkPackageBatchDynamicData, getTestWorkPackageBatchDynamicDataForStressTestOnMatchingCandidates } from './workPackage';
import { billingCategories, billingRoles } from '../../staticData/Resource-Request/index';
import { getOrganizationHeadersBatchDynamicData } from '../Consultant-Profile/organizationHeaders';
import { NUMBER_OF_DEMANDS_PER_WP, REQUESTED_QUANTITY_PER_DEMAND, REQUESTED_UNIT } from './config';

const uuid = require('uuid').v4;

let demands: Demand[] = [];
let testDemands: Demand[] = [];
let stressTestDemands: Demand[] = [];
let demandCapacityRequirements: DemandCapacityRequirement[] = [];
let testDemandCapacityRequirements: DemandCapacityRequirement[] = [];
let stressTestDemandCapacityRequirements: DemandCapacityRequirement[] = [];
let lastBatchNum1: number | null = null;
let lastBatchNum2: number | null = null;
let lastBatchNum3: number | null = null;
let lastBatchNum4: number | null = null;
let lastBatchNum5: number | null = null;
let lastBatchNum6: number | null = null;


export function getDemandBatchDynamicData(batchNum: number) {
  if (batchNum !== lastBatchNum1) {
    demands = [];
    const workPackages: WorkPackage[] = getWorkPackageBatchDynamicData(batchNum);
    const organizationHeaders: OrganizationHeader[] = getOrganizationHeadersBatchDynamicData(batchNum);

    for (let i = 0; i < workPackages.length; i += 1) {
      for (let j = 0; j < NUMBER_OF_DEMANDS_PER_WP; j += 1) {
        const demand: Demand = {
          ID: uuid(),
          externalID: `DEM_EXT${batchNum}_${(i + 1)}.${(j + 1)}`,
          startDate: workPackages[i].startDate,
          endDate: workPackages[i].endDate,
          requestedQuantity: REQUESTED_QUANTITY_PER_DEMAND,
          requestedUoM: REQUESTED_UNIT,
          billingRole_ID: billingRoles[(j % (billingRoles.length))].ID,
          billingCategory_ID: billingCategories[(j % (billingCategories.length))].ID,
          workPackage_ID: workPackages[i].ID,
          deliveryOrganization_code: organizationHeaders[0].code,
        };
        demands.push(demand);
      }
    }
    lastBatchNum1 = batchNum;
  }
  return demands;
}

export function getDemandCapacityBatchDynamicData(batchNum: number) {
  if (batchNum !== lastBatchNum2) {
    demandCapacityRequirements = [];
    const demands: Demand[] = getDemandBatchDynamicData(batchNum);
    demandCapacityRequirements = demands.map(
      (element: Demand) => ({
        ID: uuid(),
        startDate: element.startDate,
        endDate: element.endDate,
        requestedQuantity: `${element.requestedQuantity}`,
        requestedUoM: element.requestedUoM,
        demand_ID: element.ID,
      }),
    );
    lastBatchNum2 = batchNum;
  }
  return demandCapacityRequirements;
}

export function getTestDemandBatchDynamicData(batchNum: number) {
  if (batchNum !== lastBatchNum3) {
    testDemands = [];
    const testWorkPackages: WorkPackage[] = getTestWorkPackageBatchDynamicData(batchNum);
    const organizationHeaders: OrganizationHeader[] = getOrganizationHeadersBatchDynamicData(batchNum);

    for (let i = 0; i < testWorkPackages.length; i += 1) {
      for (let j = 0; j < NUMBER_OF_DEMANDS_PER_WP; j += 1) {
        const testDemand: Demand = {
          ID: uuid(),
          externalID: `DEM_EXT${batchNum}_${(NUMBER_OF_DEMANDS_PER_WP + i + 1)}.${(j + 1)}`,
          startDate: testWorkPackages[i].startDate,
          endDate: testWorkPackages[i].endDate,
          requestedQuantity: REQUESTED_QUANTITY_PER_DEMAND,
          requestedUoM: 'H',
          billingRole_ID: billingRoles[(j % (billingRoles.length))].ID,
          billingCategory_ID: billingCategories[(j % (billingCategories.length))].ID,
          workPackage_ID: testWorkPackages[i].ID,
          deliveryOrganization_code: organizationHeaders[0].code,
        };
        testDemands.push(testDemand);
      }
    }
    lastBatchNum3 = batchNum;
  }
  return testDemands;
}

export function getTestDemandCapacityBatchDynamicData(batchNum: number) {
  if (batchNum !== lastBatchNum4) {
    testDemandCapacityRequirements = [];
    const testDemands: Demand[] = getTestDemandBatchDynamicData(batchNum);
    testDemandCapacityRequirements = testDemands.map(
      (element: Demand) => ({
        ID: uuid(),
        startDate: element.startDate,
        endDate: element.endDate,
        requestedQuantity: `${element.requestedQuantity}`,
        requestedUoM: element.requestedUoM,
        demand_ID: element.ID,
      }),
    );
    lastBatchNum4 = batchNum;
  }
  return testDemandCapacityRequirements;
}


export function getTestDemandBatchDynamicDataForStressTestOnMatchingCandidates(batchNum: number) {
  if (batchNum !== lastBatchNum5) {
    stressTestDemands = [];
    const testWorkPackages: WorkPackage[] = getTestWorkPackageBatchDynamicDataForStressTestOnMatchingCandidates(batchNum);
    const organizationHeaders: OrganizationHeader[] = getOrganizationHeadersBatchDynamicData(batchNum);

    for (let i = 0; i < testWorkPackages.length; i += 1) {
      for (let j = 0; j < NUMBER_OF_DEMANDS_PER_WP; j += 1) {
        const testDemand: Demand = {
          ID: uuid(),
          externalID: `DEM_EXT${batchNum}_${(NUMBER_OF_DEMANDS_PER_WP + i + 1)}.${(j + 1)}`,
          startDate: testWorkPackages[i].startDate,
          endDate: testWorkPackages[i].endDate,
          requestedQuantity: REQUESTED_QUANTITY_PER_DEMAND,
          requestedUoM: 'H',
          billingRole_ID: billingRoles[(j % (billingRoles.length))].ID,
          billingCategory_ID: billingCategories[(j % (billingCategories.length))].ID,
          workPackage_ID: testWorkPackages[i].ID,
          deliveryOrganization_code: organizationHeaders[0].code,
        };
        stressTestDemands.push(testDemand);
      }
    }
    lastBatchNum5 = batchNum;
  }
  return stressTestDemands;
}

export function getTestDemandCapacityBatchDynamicDataForStressTestOnMatchingCandidates(batchNum: number) {
  if (batchNum !== lastBatchNum6) {
    stressTestDemandCapacityRequirements = [];
    const stresstestDemands: Demand[] = getTestDemandBatchDynamicDataForStressTestOnMatchingCandidates(batchNum);
    stressTestDemandCapacityRequirements = stresstestDemands.map(
      (element: Demand) => ({
        ID: uuid(),
        startDate: element.startDate,
        endDate: element.endDate,
        requestedQuantity: `${element.requestedQuantity}`,
        requestedUoM: element.requestedUoM,
        demand_ID: element.ID,
      }),
    );
    lastBatchNum6 = batchNum;
  }
  return stressTestDemandCapacityRequirements;
}
