import { WorkPackage, Project } from 'test-commons';
import { getProjectBatchDynamicData, getTestProjectBatchDynamicData, getTestProjectBatchDynamicDataForStressTestOnMatchingCandidates } from './project';
import { NUMBER_OF_WORKPACKAGES_PER_PROJECT, NUMBER_OF_PROJECTS_PER_RM, NUMBER_OF_TEST_PROJECTS_PER_RM } from './config';

let workPackages: WorkPackage[] = [];
let testWorkPackages: WorkPackage[] = [];
let stressTestWorkPackages: WorkPackage[] = [];
let lastBatchNum1: number | null = null;
let lastBatchNum2: number | null = null;
let lastBatchNum3: number | null = null;

export function getWorkPackageBatchDynamicData(batchNum: number) {
  if (batchNum !== lastBatchNum1) {
    workPackages = [];
    const projects: Project[] = getProjectBatchDynamicData(batchNum);

    for (let i = 0; i < projects.length; i += 1) {
      for (let j = 0; j < NUMBER_OF_WORKPACKAGES_PER_PROJECT; j += 1) {
        const workPackage: WorkPackage = {
          ID: `S4PROJ_RM${batchNum}_${(i + 1)}.${(j + 1)}`,
          name: `Prototype Talent Management${batchNum}_${(i + 1)}.${(j + 1)}`,
          startDate: projects[i].startDate,
          endDate: projects[i].endDate,
          project_ID: projects[i].ID,
        };
        workPackages.push(workPackage);
      }
    }
    lastBatchNum1 = batchNum;
  }
  return workPackages;
}

export function getTestWorkPackageBatchDynamicData(batchNum: number) {
  if (batchNum !== lastBatchNum2) {
    testWorkPackages = [];
    const testProject: Project[] = getTestProjectBatchDynamicData(batchNum);

    for (let i = 0; i < testProject.length; i += 1) {
      for (let j = 0; j < NUMBER_OF_WORKPACKAGES_PER_PROJECT; j += 1) {
        const testWorkPackage: WorkPackage = {
          ID: `S4PROJ_RM${batchNum}_${(NUMBER_OF_PROJECTS_PER_RM + i + 1)}.${(j + 1)}`,
          name: `S/4HANA Implementation Project${batchNum}_${(NUMBER_OF_PROJECTS_PER_RM + i + 1)}.${(j + 1)}`,
          startDate: testProject[i].startDate,
          endDate: testProject[i].endDate,
          project_ID: testProject[i].ID,
        };
        testWorkPackages.push(testWorkPackage);
      }
    }
    lastBatchNum2 = batchNum;
  }
  return testWorkPackages;
}


export function getTestWorkPackageBatchDynamicDataForStressTestOnMatchingCandidates(batchNum: number) {
  if (batchNum !== lastBatchNum3) {
    stressTestWorkPackages = [];
    const testProject: Project[] = getTestProjectBatchDynamicDataForStressTestOnMatchingCandidates(batchNum);

    for (let i = 0; i < testProject.length; i += 1) {
      for (let j = 0; j < NUMBER_OF_WORKPACKAGES_PER_PROJECT; j += 1) {
        const testWorkPackage: WorkPackage = {
          ID: `S4PROJ_RM${batchNum}_${(NUMBER_OF_PROJECTS_PER_RM + NUMBER_OF_TEST_PROJECTS_PER_RM + i + 1)}.${(j + 1)}`,
          name: `S/4HANA Test Project${batchNum}_${(NUMBER_OF_PROJECTS_PER_RM + NUMBER_OF_TEST_PROJECTS_PER_RM + i + 1)}.${(j + 1)}`,
          startDate: testProject[i].startDate,
          endDate: testProject[i].endDate,
          project_ID: testProject[i].ID,
        };
        stressTestWorkPackages.push(testWorkPackage);
      }
    }
    lastBatchNum3 = batchNum;
  }
  return stressTestWorkPackages;
}