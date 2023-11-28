import { SkillRequirement, ProficiencyLevelRepository } from 'test-commons';

export const skillRequirementsData: SkillRequirement[] = [
  {
    ID: 'f1f7a9eb-1699-480b-8ea3-7374ea546b2e',
    RESOURCEREQUEST_ID: '0e49a84a-92bd-4530-94b4-6edb81e48dd7',
    SKILL_ID: 'f2270171-4855-47b8-8473-5c89bcbdee3b',
    IMPORTANCE_CODE: 1,
    PROFICIENCYLEVEL_ID: ProficiencyLevelRepository.defaultProficiencyLevelId,
  },
  {
    ID: '087fcc5b-defa-4e3c-947c-3a61a26971cb',
    RESOURCEREQUEST_ID: '0e49a84a-92bd-4530-94b4-6edb81e48dd7',
    SKILL_ID: 'cdb2508a-ac8d-48e9-82bf-491bc0b2ed1f',
    IMPORTANCE_CODE: 1,
    PROFICIENCYLEVEL_ID: ProficiencyLevelRepository.defaultProficiencyLevelId,
  },
  {
    ID: 'ace77cc0-fab6-4e16-9eba-bcddaf6ed4f3',
    RESOURCEREQUEST_ID: '0e49a84a-92bd-4530-94b4-6edb81e48dd7',
    SKILL_ID: 'c2742906-1857-4c22-b2a0-78dfe77c3f15',
    IMPORTANCE_CODE: 1,
    PROFICIENCYLEVEL_ID: ProficiencyLevelRepository.defaultProficiencyLevelId,
  },
  // For RR with day-wise split
  {
    ID: '0c058d89-ad0d-473a-97d8-5a6891a2f64b',
    RESOURCEREQUEST_ID: '4ce70e41-f28d-4744-8dcf-df3b2ae94754',
    SKILL_ID: 'f2270171-4855-47b8-8473-5c89bcbdee3b',
    IMPORTANCE_CODE: 1,
    PROFICIENCYLEVEL_ID: ProficiencyLevelRepository.defaultProficiencyLevelId,
  },
  {
    ID: '7eb290a8-7218-402f-b1c6-9cdf58addbcc',
    RESOURCEREQUEST_ID: '4ce70e41-f28d-4744-8dcf-df3b2ae94754',
    SKILL_ID: 'cdb2508a-ac8d-48e9-82bf-491bc0b2ed1f',
    IMPORTANCE_CODE: 1,
    PROFICIENCYLEVEL_ID: ProficiencyLevelRepository.defaultProficiencyLevelId,
  },
  {
    ID: '5ba24298-3595-4ab3-b4cc-b1c204a0ee72',
    RESOURCEREQUEST_ID: '4ce70e41-f28d-4744-8dcf-df3b2ae94754',
    SKILL_ID: 'c2742906-1857-4c22-b2a0-78dfe77c3f15',
    IMPORTANCE_CODE: 1,
    PROFICIENCYLEVEL_ID: ProficiencyLevelRepository.defaultProficiencyLevelId,
  },

    // For RR with week-wise split
    {
      ID: '0c018d89-ad0d-473a-97d8-5a6891a2f64b',
      RESOURCEREQUEST_ID: '11787704-1894-4af0-a306-3aeb5a5c1c09',
      SKILL_ID: 'f2270171-4855-47b8-8473-5c89bcbdee3b',
      IMPORTANCE_CODE: 1,
      PROFICIENCYLEVEL_ID: ProficiencyLevelRepository.defaultProficiencyLevelId,
    },
    {
      ID: '7eb290a8-7218-402f-b1c6-9cdf59addbcc',
      RESOURCEREQUEST_ID: '11787704-1894-4af0-a306-3aeb5a5c1c09',
      SKILL_ID: 'cdb2508a-ac8d-48e9-82bf-491bc0b2ed1f',
      IMPORTANCE_CODE: 1,
      PROFICIENCYLEVEL_ID: ProficiencyLevelRepository.defaultProficiencyLevelId,
    },
    {
      ID: '5ba34298-3595-4ab3-b4cc-b1c204a0ee72',
      RESOURCEREQUEST_ID: '11787704-1894-4af0-a306-3aeb5a5c1c09',
      SKILL_ID: 'c2742906-1857-4c22-b2a0-78dfe77c3f15',
      IMPORTANCE_CODE: 1,
      PROFICIENCYLEVEL_ID: ProficiencyLevelRepository.defaultProficiencyLevelId,
    },
];
