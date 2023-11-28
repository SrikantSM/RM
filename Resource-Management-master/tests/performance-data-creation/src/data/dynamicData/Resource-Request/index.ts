import { Project, WorkPackage, Demand, DemandCapacityRequirement, ResourceRequest, CapacityRequirement, SkillRequirement, ResourceOrganizations, ResourceOrganizationItems } from 'test-commons';
import { getProjectBatchDynamicData, getTestProjectBatchDynamicData, getTestProjectBatchDynamicDataForStressTestOnMatchingCandidates } from './project';
import { getWorkPackageBatchDynamicData, getTestWorkPackageBatchDynamicData, getTestWorkPackageBatchDynamicDataForStressTestOnMatchingCandidates } from './workPackage';
import { getDemandBatchDynamicData, getDemandCapacityBatchDynamicData, getTestDemandBatchDynamicData, getTestDemandBatchDynamicDataForStressTestOnMatchingCandidates, getTestDemandCapacityBatchDynamicData, getTestDemandCapacityBatchDynamicDataForStressTestOnMatchingCandidates } from './demand';
import { getRequestBatchDynamicData, getCapacityRequirementBatchDynamicData, getSkillRequirementBatchDynamicData, getRequestBatchDynamicDataForStressTestOnMatchingCandidates } from './resourceRequest';
import { getResourceOrganizationsBatchDynamicData } from './resourceOrganizations';
import { getResourceOrganizationItemsBatchDynamicData } from './resourceOrganizationItems';

export function getResourceRequestBatchDynamicData(batchNum: number) {
  console.log('getResourceRequestBatchDynamicData is called for batchNum: ', batchNum);
  const resourceRequestBatchDynamicData = new Map<string, any[]>();
  const resourceOrganization: ResourceOrganizations[] = getResourceOrganizationsBatchDynamicData(batchNum);
  resourceRequestBatchDynamicData.set('resourceOrganization', resourceOrganization);
   
  const resourceOrganizationItem: ResourceOrganizationItems[] = getResourceOrganizationItemsBatchDynamicData(batchNum);
  resourceRequestBatchDynamicData.set('resourceOrganizationItem', resourceOrganizationItem);

  const project: Project[] = getProjectBatchDynamicData(batchNum);
  resourceRequestBatchDynamicData.set('project', project);
  const testProject: Project[] = getTestProjectBatchDynamicData(batchNum).concat(getTestProjectBatchDynamicDataForStressTestOnMatchingCandidates(batchNum));
  resourceRequestBatchDynamicData.set('testProject', testProject);

  const workPackage: WorkPackage[] = getWorkPackageBatchDynamicData(batchNum);
  resourceRequestBatchDynamicData.set('workPackage', workPackage);
  const testWorkPackage: WorkPackage[] = getTestWorkPackageBatchDynamicData(batchNum).concat(getTestWorkPackageBatchDynamicDataForStressTestOnMatchingCandidates(batchNum));
  resourceRequestBatchDynamicData.set('testWorkPackage', testWorkPackage);

  const demand: Demand[] = getDemandBatchDynamicData(batchNum);
  resourceRequestBatchDynamicData.set('demand', demand);
  const demandCapacityRequirement: DemandCapacityRequirement[] = getDemandCapacityBatchDynamicData(batchNum);
  resourceRequestBatchDynamicData.set('demandCapacityRequirement', demandCapacityRequirement);

  const testDemand: Demand[] = getTestDemandBatchDynamicData(batchNum).concat(getTestDemandBatchDynamicDataForStressTestOnMatchingCandidates(batchNum));
  resourceRequestBatchDynamicData.set('testDemand', testDemand);
  const testDemandCapacityRequirement: DemandCapacityRequirement[] = getTestDemandCapacityBatchDynamicData(batchNum).concat(getTestDemandCapacityBatchDynamicDataForStressTestOnMatchingCandidates(batchNum));
  resourceRequestBatchDynamicData.set('testDemandCapacityRequirement', testDemandCapacityRequirement); 

  const resourceRequest: ResourceRequest[] = getRequestBatchDynamicData(batchNum);
  resourceRequestBatchDynamicData.set('resourceRequest', resourceRequest);
  const testResourceRequest: ResourceRequest[] = getRequestBatchDynamicDataForStressTestOnMatchingCandidates(batchNum);
  resourceRequestBatchDynamicData.set('testResourceRequest', testResourceRequest);

  const resourceRequestCapacityRequirement: CapacityRequirement[] = getCapacityRequirementBatchDynamicData(batchNum);
  resourceRequestBatchDynamicData.set('resourceRequestCapacityRequirement', resourceRequestCapacityRequirement);
  const resourceRequestSkillRequirement: SkillRequirement[] = getSkillRequirementBatchDynamicData(batchNum);
  resourceRequestBatchDynamicData.set('resourceRequestSkillRequirement', resourceRequestSkillRequirement); 

  return resourceRequestBatchDynamicData;
}
