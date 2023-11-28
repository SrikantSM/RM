import { v4 as uuid } from 'uuid';
import { SkillMasterListAll } from '../../../serviceEntities/myProjectExperienceService/SkillMasterListAll';

const createSkillMasterListAll: SkillMasterListAll = {
    ID: uuid(),
    name: 'Skill name',
    description: 'Skill Description',
    lifecycleStatus_code: 0,
};

export { createSkillMasterListAll };
