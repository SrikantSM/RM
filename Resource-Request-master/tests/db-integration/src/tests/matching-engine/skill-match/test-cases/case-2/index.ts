import {
  SkillOutput, SkillInput, SkillAssignmentRepository, ProficiencyLevelRepository,
} from 'test-commons';
import * as data from '../../data';

const skillAssignmentData = [
  data.getSkillAssignment(data.resource1.parent, data.skillABAP.ID, ProficiencyLevelRepository.defaultProficiencyLevelId),
  data.getSkillAssignment(data.resource2.parent, data.skillCoreJava.ID, ProficiencyLevelRepository.defaultProficiencyLevelId),
];
export async function setupData(skillAssignmentRepository: SkillAssignmentRepository) {
  await skillAssignmentRepository.insertMany(skillAssignmentData);
}

export async function cleanupData(skillAssignmentRepository: SkillAssignmentRepository) {
  await skillAssignmentRepository.deleteMany(skillAssignmentData);
}

export const resourceRequests: SkillInput[] = [
  {
    ID: data.resourceRequestIds.RR1,
  },
];

export const resource: SkillInput[] = [
  {
    ID: data.resource1.ID,
  },
  {
    ID: data.resource2.ID,
  },
  {
    ID: data.resource3.ID,
  },
];

export const expectation: SkillOutput[] = [
  {
    RESOURCEREQUEST_ID: data.resourceRequestIds.RR1,
    RESOURCE_ID: data.resource1.ID,
    SKILLMATCHPERCENTAGE: '100.00',
  },
  {
    RESOURCEREQUEST_ID: data.resourceRequestIds.RR1,
    RESOURCE_ID: data.resource2.ID,
    SKILLMATCHPERCENTAGE: '100.00',
  },
  {
    RESOURCEREQUEST_ID: data.resourceRequestIds.RR1,
    RESOURCE_ID: data.resource3.ID,
    SKILLMATCHPERCENTAGE: '100.00',
  },
];
