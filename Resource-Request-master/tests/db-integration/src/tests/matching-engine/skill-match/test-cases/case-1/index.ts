import {
  SkillOutput, SkillInput, SkillRequirementRepository, ProficiencyLevelRepository,
} from 'test-commons';
import * as data from '../../data';

const skillRequirementData = [
  data.getSkillRequirement(data.resourceRequestIds.RR1, data.skillABAP.ID, data.skillImportance.manadatory, ProficiencyLevelRepository.defaultProficiencyLevelId),
  data.getSkillRequirement(data.resourceRequestIds.RR1, data.skillSCP.ID, data.skillImportance.manadatory, ProficiencyLevelRepository.defaultProficiencyLevelId),
  data.getSkillRequirement(data.resourceRequestIds.RR2, data.skillHANA.ID, data.skillImportance.manadatory, ProficiencyLevelRepository.defaultProficiencyLevelId),
  data.getSkillRequirement(data.resourceRequestIds.RR3, data.skillHANA.ID, data.skillImportance.manadatory, ProficiencyLevelRepository.defaultProficiencyLevelId),
];
export async function setupData(skillRequirementRepository: SkillRequirementRepository) {
  await skillRequirementRepository.insertMany(skillRequirementData);
}

export async function cleanupData(skillRequirementRepository: SkillRequirementRepository) {
  await skillRequirementRepository.deleteMany(skillRequirementData);
}

export const resourceRequests: SkillInput[] = [
  {
    ID: data.resourceRequestIds.RR1,
  },
  {
    ID: data.resourceRequestIds.RR2,
  },
  {
    ID: data.resourceRequestIds.RR3,
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
    SKILLMATCHPERCENTAGE: '0.00',
  },
  {
    RESOURCEREQUEST_ID: data.resourceRequestIds.RR2,
    RESOURCE_ID: data.resource1.ID,
    SKILLMATCHPERCENTAGE: '0.00',
  },
  {
    RESOURCEREQUEST_ID: data.resourceRequestIds.RR3,
    RESOURCE_ID: data.resource1.ID,
    SKILLMATCHPERCENTAGE: '0.00',
  },
];
