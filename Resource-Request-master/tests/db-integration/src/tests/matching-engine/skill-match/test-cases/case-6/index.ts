import {
  SkillOutput, SkillInput, SkillRequirementRepository, SkillAssignmentRepository, ProficiencyLevelRepository,
} from 'test-commons';
import * as data from '../../data';

const skillRequirementData = [
  data.getSkillRequirement(data.resourceRequestIds.RR1, data.skillABAP.ID, data.skillImportance.manadatory, ProficiencyLevelRepository.defaultProficiencyLevelId),
  data.getSkillRequirement(data.resourceRequestIds.RR1, data.skillSCP.ID, data.skillImportance.manadatory, ProficiencyLevelRepository.defaultProficiencyLevelId),
  data.getSkillRequirement(data.resourceRequestIds.RR1, data.skillJavaOops.ID, data.skillImportance.manadatory, ProficiencyLevelRepository.defaultProficiencyLevelId),
  data.getSkillRequirement(data.resourceRequestIds.RR1, data.skillCoreJava.ID, data.skillImportance.preffered, ProficiencyLevelRepository.defaultProficiencyLevelId),
];

const skillAssignmentData = [
  data.getSkillAssignment(data.resource1.parent, data.skillABAP.ID, ProficiencyLevelRepository.defaultProficiencyLevelId),
  data.getSkillAssignment(data.resource1.parent, data.skillSCP.ID, ProficiencyLevelRepository.defaultProficiencyLevelId),
  data.getSkillAssignment(data.resource1.parent, data.skillHANA.ID, ProficiencyLevelRepository.defaultProficiencyLevelId),
  data.getSkillAssignment(data.resource2.parent, data.skillABAP.ID, ProficiencyLevelRepository.defaultProficiencyLevelId),
  data.getSkillAssignment(data.resource2.parent, data.skillHANA.ID, ProficiencyLevelRepository.defaultProficiencyLevelId),

];
export async function setupData(skillRequirementRepository: SkillRequirementRepository, skillAssignmentRepository: SkillAssignmentRepository) {
  await skillRequirementRepository.insertMany(skillRequirementData);
  await skillAssignmentRepository.insertMany(skillAssignmentData);
}

export async function cleanupData(skillRequirementRepository: SkillRequirementRepository, skillAssignmentRepository: SkillAssignmentRepository) {
  await skillRequirementRepository.deleteMany(skillRequirementData);
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
];

export const expectation: SkillOutput[] = [
  {
    RESOURCEREQUEST_ID: data.resourceRequestIds.RR1,
    RESOURCE_ID: data.resource1.ID,
    SKILLMATCHPERCENTAGE: '66.66',
  },
  {
    RESOURCEREQUEST_ID: data.resourceRequestIds.RR1,
    RESOURCE_ID: data.resource2.ID,
    SKILLMATCHPERCENTAGE: '33.33',
  },
];
