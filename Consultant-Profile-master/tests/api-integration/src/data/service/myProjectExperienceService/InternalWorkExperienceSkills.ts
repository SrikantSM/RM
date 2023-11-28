import { v4 as uuid } from 'uuid';
import { InternalWorkExperienceSkills } from '../../../serviceEntities/myProjectExperienceService/InternalWorkExperience';

export const createInternalWorkExperienceSkills: InternalWorkExperienceSkills = {
    assignment_ID: uuid(),
    skillId: uuid(),
    proficiencyLevelId: uuid(),
    employee_ID: uuid(),
};
