import { v4 as uuid } from 'uuid';
import { SkillMasterList } from '../../../serviceEntities/myProjectExperienceService/SkillMasterList';

const createSkillMasterList: SkillMasterList = {
    ID: uuid(),
    name: 'Skill name',
    description: 'Skill Description',
    lifecycleStatus_code: 0,
};

export { createSkillMasterList };
