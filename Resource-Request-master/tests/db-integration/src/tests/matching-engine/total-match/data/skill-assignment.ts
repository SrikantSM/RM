import { SkillAssignment, ProficiencyLevelRepository } from 'test-commons';

export const skillAssignmentData: SkillAssignment[] = [
  // Employee 1 - ABAP, JAVA, Node.JS
  {
    ID: 'f377cef4-1716-47e0-a4a2-dd5fe688cae1',
    employee_ID: 'c7dff55e-c880-4495-bbca-13541eed4897',
    skill_ID: 'f2270171-4855-47b8-8473-5c89bcbdee3b',
    proficiencyLevel_ID: ProficiencyLevelRepository.defaultProficiencyLevelId,
  },
  {
    ID: 'c136b380-a27d-4841-b985-78bd2b649868',
    employee_ID: 'c7dff55e-c880-4495-bbca-13541eed4897',
    skill_ID: 'cdb2508a-ac8d-48e9-82bf-491bc0b2ed1f',
    proficiencyLevel_ID: ProficiencyLevelRepository.defaultProficiencyLevelId,
  },
  {
    ID: '5a794a7c-3fbb-4552-a8e4-685356392543',
    employee_ID: 'c7dff55e-c880-4495-bbca-13541eed4897',
    skill_ID: 'c2742906-1857-4c22-b2a0-78dfe77c3f15',
    proficiencyLevel_ID: ProficiencyLevelRepository.defaultProficiencyLevelId,
  },
  // Employee 2 - JAVA, GO, Node.JS
  {
    ID: '80e808bf-c035-493c-b70e-1623877b21de',
    employee_ID: '5ba1aa7d-a1dd-4de1-afbd-9adb433395bf',
    skill_ID: 'cdb2508a-ac8d-48e9-82bf-491bc0b2ed1f',
    proficiencyLevel_ID: ProficiencyLevelRepository.defaultProficiencyLevelId,
  },
  {
    ID: '078a16e3-acf9-4451-8c60-bb7521d95d04',
    employee_ID: '5ba1aa7d-a1dd-4de1-afbd-9adb433395bf',
    skill_ID: '58b06b3c-8894-4af9-b609-05f6dc2c8b6e',
    proficiencyLevel_ID: ProficiencyLevelRepository.defaultProficiencyLevelId,
  },
  {
    ID: '3bf450cd-a23a-448c-a0b9-b7e2fb211dd1',
    employee_ID: '5ba1aa7d-a1dd-4de1-afbd-9adb433395bf',
    skill_ID: 'c2742906-1857-4c22-b2a0-78dfe77c3f15',
    proficiencyLevel_ID: ProficiencyLevelRepository.defaultProficiencyLevelId,
  },
  // Employee 3 - ABAP, Python, JAVA, Node.JS
  {
    ID: '5225b2b4-57c9-4a16-b48b-3d0cdf44c477',
    employee_ID: 'd629ae17-4817-4087-bb50-95889112e300',
    skill_ID: 'f2270171-4855-47b8-8473-5c89bcbdee3b',
    proficiencyLevel_ID: ProficiencyLevelRepository.defaultProficiencyLevelId,
  },
  {
    ID: '5ba5a869-b302-47f4-92ed-7bc21f24ad48',
    employee_ID: 'd629ae17-4817-4087-bb50-95889112e300',
    skill_ID: 'db0673f3-9e50-4b26-8155-5637c6480ae6',
    proficiencyLevel_ID: ProficiencyLevelRepository.defaultProficiencyLevelId,
  },
  {
    ID: '53b54037-82c1-417b-a47f-3d6f9fc4c47f',
    employee_ID: 'd629ae17-4817-4087-bb50-95889112e300',
    skill_ID: 'cdb2508a-ac8d-48e9-82bf-491bc0b2ed1f',
    proficiencyLevel_ID: ProficiencyLevelRepository.defaultProficiencyLevelId,
  },
  {
    ID: '5f56202c-6ccd-400a-92ca-894947637d04',
    employee_ID: 'd629ae17-4817-4087-bb50-95889112e300',
    skill_ID: 'c2742906-1857-4c22-b2a0-78dfe77c3f15',
    proficiencyLevel_ID: ProficiencyLevelRepository.defaultProficiencyLevelId,
  },

  // Employee 4 - JAVA, GO, TypeScript
  {
    ID: 'fd7edbaf-742d-472f-ae24-f0f3a4e19d4b',
    employee_ID: 'b2ceff3c-bbd7-41d7-908d-ffa33896c6d4',
    skill_ID: 'cdb2508a-ac8d-48e9-82bf-491bc0b2ed1f',
    proficiencyLevel_ID: ProficiencyLevelRepository.defaultProficiencyLevelId,
  },
  {
    ID: 'ef284cda-2262-4f79-9e25-f1a3afb63c54',
    employee_ID: 'b2ceff3c-bbd7-41d7-908d-ffa33896c6d4',
    skill_ID: '58b06b3c-8894-4af9-b609-05f6dc2c8b6e',
    proficiencyLevel_ID: ProficiencyLevelRepository.defaultProficiencyLevelId,
  },
  {
    ID: '7af6c36d-8da8-4a31-aa7c-27d4ee1dd5ab',
    employee_ID: 'b2ceff3c-bbd7-41d7-908d-ffa33896c6d4',
    skill_ID: 'c2742906-1857-4c22-b2a0-78dfe77c3f15',
    proficiencyLevel_ID: ProficiencyLevelRepository.defaultProficiencyLevelId,
  },

  // Employee 5 - ABAP, C++
  {
    ID: '9106095e-788c-4482-b9af-00ee9058de36',
    employee_ID: '7d176583-7159-415a-8b44-b4ff336df1b6',
    skill_ID: 'f2270171-4855-47b8-8473-5c89bcbdee3b',
    proficiencyLevel_ID: ProficiencyLevelRepository.defaultProficiencyLevelId,
  },
  {
    ID: 'ef9cbfc3-d547-4a35-ab07-279a9a1ec509',
    employee_ID: '7d176583-7159-415a-8b44-b4ff336df1b6',
    skill_ID: '91dde75b-8114-47c0-b818-e135c3fc0b73',
    proficiencyLevel_ID: ProficiencyLevelRepository.defaultProficiencyLevelId,
  },
  // Employee6 - No Skill maintained

  // Employee 7 - ABAP, JAVA, Node.JS
  {
    ID: '6c7962d0-ab9c-4bc4-8b58-0b42fc1156d7',
    employee_ID: 'e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4',
    skill_ID: 'f2270171-4855-47b8-8473-5c89bcbdee3b',
    proficiencyLevel_ID: ProficiencyLevelRepository.defaultProficiencyLevelId,
  },
  {
    ID: '7b3c6a12-4d77-4ed8-8605-a14f87aeea75',
    employee_ID: 'e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4',
    skill_ID: 'cdb2508a-ac8d-48e9-82bf-491bc0b2ed1f',
    proficiencyLevel_ID: ProficiencyLevelRepository.defaultProficiencyLevelId,
  },
  {
    ID: 'c5a32789-0700-4412-a1b9-3f63581dab3c',
    employee_ID: 'e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce4',
    skill_ID: 'c2742906-1857-4c22-b2a0-78dfe77c3f15',
    proficiencyLevel_ID: ProficiencyLevelRepository.defaultProficiencyLevelId,
  },

    // Employee 8 - ABAP, JAVA, Node.JS
    {
      ID: '6c7962d0-ab9c-4bc4-8b58-0b42fc1156d8',
      employee_ID: 'e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce6',
      skill_ID: 'f2270171-4855-47b8-8473-5c89bcbdee3b',
      proficiencyLevel_ID: ProficiencyLevelRepository.defaultProficiencyLevelId,
    },
    {
      ID: '7b3c6a12-4d77-4ed8-8605-a14f87aeea76',
      employee_ID: 'e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce6',
      skill_ID: 'cdb2508a-ac8d-48e9-82bf-491bc0b2ed1f',
      proficiencyLevel_ID: ProficiencyLevelRepository.defaultProficiencyLevelId,
    },
    {
      ID: 'c5a32789-0700-4412-a1b9-3f63581dab6c',
      employee_ID: 'e1011e36-ae2a-11e9-a2a3-2a2ae2dbcce6',
      skill_ID: 'c2742906-1857-4c22-b2a0-78dfe77c3f15',
      proficiencyLevel_ID: ProficiencyLevelRepository.defaultProficiencyLevelId,
    },
];
