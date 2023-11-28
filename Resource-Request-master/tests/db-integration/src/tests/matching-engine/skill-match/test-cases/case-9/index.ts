import {
  SkillOutput, SkillInput, SkillRequirementRepository, SkillAssignmentRepository, ProficiencyLevelRepository,
} from 'test-commons';
import * as data from '../../data';

const skillRequirementData = [
  data.getSkillRequirement(data.resourceRequestIds.RR1, data.skillJavaOops.ID, data.skillImportance.manadatory, data.proficiencyLevelRank3MaxRank4.ID),
  data.getSkillRequirement(data.resourceRequestIds.RR1, data.skillABAP.ID, data.skillImportance.manadatory, data.proficiencyLevelRank3MaxRank3.ID),
  data.getSkillRequirement(data.resourceRequestIds.RR1, data.skillSCP.ID, data.skillImportance.manadatory, data.proficiencyLevelRank3MaxRank3.ID),
];

const skillAssignmentData = [
  data.getSkillAssignment(data.resource1.parent, data.skillJavaOops.ID, ProficiencyLevelRepository.defaultProficiencyLevelId),
  data.getSkillAssignment(data.resource1.parent, data.skillABAP.ID, data.proficiencyLevelRank3MaxRank3.ID),
  data.getSkillAssignment(data.resource1.parent, data.skillSCP.ID, data.proficiencyLevelRank2MaxRank4.ID),
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
];

export const expectation: SkillOutput[] = [
  {
    RESOURCEREQUEST_ID: data.resourceRequestIds.RR1,
    RESOURCE_ID: data.resource1.ID,
    SKILLMATCHPERCENTAGE: '61.11',
  },
];
