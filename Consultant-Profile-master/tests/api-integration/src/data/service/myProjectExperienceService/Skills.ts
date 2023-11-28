import { v4 as uuid } from 'uuid';
import { Skills } from '../../../serviceEntities/myProjectExperienceService/Skills';
import { skillWithDescription3, employeeHeaderWithDescription1, setThreeProficiencyLevel1 } from '../../db';

const createSkill: Skills = {
    ID: uuid(),
    skill_ID: skillWithDescription3.ID,
    employee_ID: employeeHeaderWithDescription1.ID,
    proficiencyLevel_ID: setThreeProficiencyLevel1.ID,
};

const deleteSkill = createSkill;

export {
    createSkill,
    deleteSkill,
};
