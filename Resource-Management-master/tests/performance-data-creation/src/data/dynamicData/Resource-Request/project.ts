import { Project, OrganizationHeader } from 'test-commons';
import { customers } from '../../staticData/Resource-Request/customer';
import { getOrganizationHeadersBatchDynamicData } from '../Consultant-Profile/organizationHeaders';
import { NUMBER_OF_PROJECTS_PER_RM, NUMBER_OF_STRESS_TEST_PROJECTS_PER_RM, NUMBER_OF_TEST_PROJECTS_PER_RM } from './config';
import { getEndDate, getStartDate } from './util';

const moment = require('moment');

let projects: Project[] = [];
let testProjects: Project[] = [];
let stressTestProjects: Project[] = [];
let lastBatchNum1: number | null = null;
let lastBatchNum2: number | null = null;
let lastBatchNum3: number | null = null;

export function getProjectBatchDynamicData(batchNum: number) {
  if (batchNum !== lastBatchNum1) {
    projects = [];
    const organizationHeaders: OrganizationHeader[] = getOrganizationHeadersBatchDynamicData(batchNum);

    for (let i = 0; i < NUMBER_OF_PROJECTS_PER_RM; i += 1) {
      const project: Project = {
        ID: `S4PROJ_RM${batchNum}_${(i + 1)}`,
        name: `Prototype Talent Management${batchNum}_${(i + 1)}`,
        startDate: getStartDate(i,NUMBER_OF_PROJECTS_PER_RM),
        endDate: getEndDate(i,NUMBER_OF_PROJECTS_PER_RM),
        customer_ID: customers[i].ID,
        serviceOrganization_code: organizationHeaders[0].code,
      };
      projects.push(project);
    }
    lastBatchNum1 = batchNum;
  }
  return projects;
}

export function getTestProjectBatchDynamicData(batchNum: number) {
  if (batchNum !== lastBatchNum2) {
    testProjects = [];
    const organizationHeaders: OrganizationHeader[] = getOrganizationHeadersBatchDynamicData(batchNum);

    for (let i = 0; i < NUMBER_OF_TEST_PROJECTS_PER_RM; i += 1) {
      const project: Project = {
        ID: `S4PROJ_RM${batchNum}_${(NUMBER_OF_PROJECTS_PER_RM + i + 1)}`,
        name: `S/4HANA Implementation Project${batchNum}_${(NUMBER_OF_PROJECTS_PER_RM + i + 1)}`,
        startDate: getStartDate(i,NUMBER_OF_TEST_PROJECTS_PER_RM),
        endDate: getEndDate(i,NUMBER_OF_TEST_PROJECTS_PER_RM),
        customer_ID: customers[i].ID,
        serviceOrganization_code: organizationHeaders[0].code,
      };
      testProjects.push(project);
    }
    lastBatchNum2 = batchNum;
  }
  return testProjects;
}

export function getTestProjectBatchDynamicDataForStressTestOnMatchingCandidates(batchNum: number) {
  if (batchNum !== lastBatchNum3) {
    stressTestProjects = [];
    const organizationHeaders: OrganizationHeader[] = getOrganizationHeadersBatchDynamicData(batchNum);

    for (let i = 0; i < NUMBER_OF_STRESS_TEST_PROJECTS_PER_RM; i += 1) {
      const project: Project = {
        ID: `S4PROJ_RM${batchNum}_${(NUMBER_OF_PROJECTS_PER_RM + NUMBER_OF_TEST_PROJECTS_PER_RM + i + 1)}`,
        name: `S/4HANA Test Project${batchNum}_${(NUMBER_OF_PROJECTS_PER_RM + NUMBER_OF_TEST_PROJECTS_PER_RM + i + 1)}`,
        startDate: moment().startOf('month').subtract(12, 'months').startOf('month').format('YYYY-MM-DD'),
        endDate: moment().startOf('month').add(11, 'months').endOf('month').format('YYYY-MM-DD'),
        customer_ID: customers[i].ID,
        serviceOrganization_code: organizationHeaders[0].code,
      };
      stressTestProjects.push(project);
    }
    lastBatchNum3 = batchNum;
  }
  return stressTestProjects;
}