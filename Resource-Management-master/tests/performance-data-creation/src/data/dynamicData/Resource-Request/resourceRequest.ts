import { CapacityRequirement, Demand, OrganizationHeader, ResourceRequest, SkillRequirement, ResourceOrganizations } from 'test-commons';
import { v4 as uuid } from 'uuid';
import { proficiencyLevels, projectRoles, skills } from '../../staticData';
import { getOrganizationHeadersBatchDynamicData } from '../Consultant-Profile/organizationHeaders';
import { NUMBER_OF_NON_S4_RESOURCEREQUESTS, NUMBER_OF_RESOURCEREQUESTS_PER_DEMAND, NUMBER_OF_SKILLS_PER_RR, REQUESTED_QUANTITY_PER_DEMAND, REQUESTED_UNIT, REQUESTED_RR_UNIT} from './config';
import { getDemandBatchDynamicData, getTestDemandBatchDynamicDataForStressTestOnMatchingCandidates } from './demand';
import { getResourceOrganizationsBatchDynamicData } from './resourceOrganizations';
import { getEndDate, getStartDate } from './util';

let resourceRequests: ResourceRequest[] = [];
let testResourceRequests: ResourceRequest[] = [];
let capacityRequirements: CapacityRequirement[] = [];
let skillRequirements: SkillRequirement[] = [];
let lastBatchNum1: number | null = null;
let lastBatchNum2: number | null = null;
let lastBatchNum3: number | null = null;
let lastBatchNum4: number | null = null;

export function getRequestBatchDynamicData(batchNum: number) {
  if (batchNum !== lastBatchNum1) {
    resourceRequests = [];
    const demands: Demand[] = getDemandBatchDynamicData(batchNum);
    const organizationHeaders: OrganizationHeader[] = getOrganizationHeadersBatchDynamicData(batchNum);
    const resourceOrganizations: ResourceOrganizations[] = getResourceOrganizationsBatchDynamicData(batchNum);

    // Resource Requests Created from Demand
    for (let i = 0; i < (demands.length * NUMBER_OF_RESOURCEREQUESTS_PER_DEMAND); i += 1) {
      const splitValue = (demands[i].workPackage_ID).split('.', 1);
      const proj_id = splitValue.join('');
      let requestRRUoM;
      if (demands[i].requestedUoM == "H"){
        requestRRUoM = REQUESTED_RR_UNIT;
      }
      else{
        requestRRUoM = demands[i].requestedUoM;
      }
      const resourceRequest: ResourceRequest = {
        ID: uuid(),
        isS4Cloud: true,
        displayId: `1_${i}_${batchNum}`.padStart(10,'9'),
        name: 'Name_' +`1_${i}_${batchNum}`.padStart(10,'9'),
        demand_ID: demands[i].ID,
        workpackage_ID: demands[i].workPackage_ID,
        project_ID: proj_id,
        projectRole_ID: projectRoles[((batchNum - 1) % (projectRoles.length))].ID,
        requestedResourceOrg_ID: resourceOrganizations[0].displayId,
        processingResourceOrg_ID: resourceOrganizations[0].displayId,
        priority_code: 2,
        requestStatus_code: 0,
        releaseStatus_code: 1,
        resourceKind_code: '1',
        startDate: demands[i].startDate,
        endDate: demands[i].endDate,
        startTime: addTimeSuffix(demands[i].startDate),
        endTime: addTimeSuffix(demands[i].endDate),
        resourceManager: '',
        processor: '',
        requestedCapacity: demands[i].requestedQuantity,
        requestedUnit: requestRRUoM,
        requestedCapacityInMinutes: (demands[i].requestedQuantity * 60),
        description: `RequestDescription_${batchNum}`,
      };
      resourceRequests.push(resourceRequest);
    }
    
    // Non S4 Resource Requests
    for (let i = 0; i < NUMBER_OF_NON_S4_RESOURCEREQUESTS; i += 1) {
      const startDate = getStartDate(i,NUMBER_OF_NON_S4_RESOURCEREQUESTS);
      const endDate = getEndDate(i,NUMBER_OF_NON_S4_RESOURCEREQUESTS);
      const resourceOrganizations: ResourceOrganizations[] = getResourceOrganizationsBatchDynamicData(batchNum);
      let requestRRUoM;
      if (demands[i].requestedUoM == "H"){
        requestRRUoM = REQUESTED_RR_UNIT;
      }
      else{
        requestRRUoM = demands[i].requestedUoM;
      }
      const resourceRequest: ResourceRequest = {
        ID: uuid(),
        isS4Cloud: false,
        displayId: `3_${i}_${batchNum}`.padStart(10,'9'),
        name: 'Name_' +`3_${i}_${batchNum}`.padStart(10,'9'),
        projectRole_ID: projectRoles[((batchNum - 1) % (projectRoles.length))].ID,
        requestedResourceOrg_ID: resourceOrganizations[0].displayId,
        processingResourceOrg_ID: resourceOrganizations[0].displayId,
        priority_code: 2,
        requestStatus_code: 0,
        releaseStatus_code: 1,
        resourceKind_code: '1',
        startDate: startDate,
        endDate: endDate,
        startTime: addTimeSuffix(startDate),
        endTime: addTimeSuffix(endDate),
        resourceManager: '',
        processor: '',
        requestedCapacity: REQUESTED_QUANTITY_PER_DEMAND,
        requestedUnit: requestRRUoM,
        requestedCapacityInMinutes: (REQUESTED_QUANTITY_PER_DEMAND * 60),
        description: `RequestDescription_${batchNum}`,
      };
      resourceRequests.push(resourceRequest);
    }

    lastBatchNum1 = batchNum;
  }
  return resourceRequests;
}

export function getCapacityRequirementBatchDynamicData(batchNum: number) {
  if (batchNum !== lastBatchNum2) {
    capacityRequirements = [];
    const resourceRequests: ResourceRequest[] = getRequestBatchDynamicData(batchNum).concat(getRequestBatchDynamicDataForStressTestOnMatchingCandidates(batchNum));
    capacityRequirements = resourceRequests.map(
      (element: ResourceRequest) => ({
        ID: uuid(),
        resourceRequest_ID: element.ID,
        startDate: element.startDate,
        endDate: element.endDate,
        startTime: `${element.startTime}`,
        endTime: `${element.endTime}`,
        requestedCapacity: element.requestedCapacity,
        requestedUnit: element.requestedUnit,
        requestedCapacityInMinutes: element.requestedCapacityInMinutes,
      }),
    );
    lastBatchNum2 = batchNum;
  }
  return capacityRequirements;
}

export function getSkillRequirementBatchDynamicData(batchNum: number) {
  if (batchNum !== lastBatchNum3) {
    skillRequirements = [];
    const resourceRequests: ResourceRequest[] = getRequestBatchDynamicData(batchNum).concat(getRequestBatchDynamicDataForStressTestOnMatchingCandidates(batchNum));

    for (let i = 0; i < resourceRequests.length; i += 1) {
      for (let j = 0; j < NUMBER_OF_SKILLS_PER_RR; j += 1) {
        const skillsRequested = skills[j % skills.length]; // every RR for a RM has same 4 skills
        const levels = proficiencyLevels.filter((l) => l.proficiencySet_ID === skillsRequested.proficiencySet_ID);
        const skillRequirement: SkillRequirement = {
          ID: uuid(),
          RESOURCEREQUEST_ID: resourceRequests[i].ID,
          SKILL_ID: skillsRequested.ID,
          IMPORTANCE_CODE: j === 0 ? 1 : 2,
          PROFICIENCYLEVEL_ID: levels[j % levels.length].ID,
        };
        skillRequirements.push(skillRequirement);
      }
    }
    lastBatchNum3 = batchNum;
  }
  return skillRequirements;
}

function addTimeSuffix(val: string) {
  return `${val}T00:00:00Z`;
}

export function getRequestBatchDynamicDataForStressTestOnMatchingCandidates(batchNum: number) {
  if (batchNum !== lastBatchNum4) {
    testResourceRequests = [];
    const demands: Demand[] = getTestDemandBatchDynamicDataForStressTestOnMatchingCandidates(batchNum);
    const organizationHeaders: OrganizationHeader[] = getOrganizationHeadersBatchDynamicData(batchNum);
    const resourceOrganizations: ResourceOrganizations[] = getResourceOrganizationsBatchDynamicData(batchNum);

    for (let i = 0; i < (demands.length * NUMBER_OF_RESOURCEREQUESTS_PER_DEMAND); i += 1) {
      const splitValue = (demands[i].workPackage_ID).split('.', 1);
      const proj_id = splitValue.join('');
      let requestRRUoM;
      if (demands[i].requestedUoM == "H"){
        requestRRUoM = REQUESTED_RR_UNIT;
      }
      else{
        requestRRUoM = demands[i].requestedUoM;
      }

      const resourceRequest: ResourceRequest = {
        ID: uuid(),
        isS4Cloud: true,
        displayId: `2_${i}_${batchNum}`.padStart(10,'9'),
        name: 'Name_' +`2_${i}_${batchNum}`.padStart(10,'9'),
        demand_ID: demands[i].ID,
        workpackage_ID: demands[i].workPackage_ID,
        project_ID: proj_id,
        projectRole_ID: projectRoles[((batchNum - 1) % (projectRoles.length))].ID,
        requestedResourceOrg_ID: resourceOrganizations[0].displayId,
        processingResourceOrg_ID: resourceOrganizations[0].displayId,
        priority_code: 2,
        requestStatus_code: 0,
        releaseStatus_code: 1,
        resourceKind_code: '1',
        startDate: demands[i].startDate,
        endDate: demands[i].endDate,
        startTime: addTimeSuffix(demands[i].startDate),
        endTime: addTimeSuffix(demands[i].endDate),
        resourceManager: '',
        processor: '',
        requestedCapacity: demands[i].requestedQuantity,
        requestedUnit: requestRRUoM,
        requestedCapacityInMinutes: (demands[i].requestedQuantity * 60),
        description: `Stress_Test_Matching_Candidates_${batchNum}`,
      };
      testResourceRequests.push(resourceRequest);
    }
    lastBatchNum4 = batchNum;
  }
  return testResourceRequests;
}
