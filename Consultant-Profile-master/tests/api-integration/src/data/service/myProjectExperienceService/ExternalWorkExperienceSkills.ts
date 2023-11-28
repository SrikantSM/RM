import { v4 as uuid } from 'uuid';
import { ExternalWorkExperienceSkills } from '../../../serviceEntities/myProjectExperienceService/ExternalWorkExperience';
import {
    skillWithDescription3,
    externalWorkExperience1,
    employeeHeaderWithDescription1,
    setThreeProficiencyLevel1,
} from '../../db';

const createExternalWorkExperienceSkills: ExternalWorkExperienceSkills = {
    ID: uuid(),
    workExperience_ID: externalWorkExperience1.ID,
    skill_ID: skillWithDescription3.ID,
    employee_ID: employeeHeaderWithDescription1.ID,
    proficiencyLevel_ID: setThreeProficiencyLevel1.ID,
};

const deleteExternalWorkExperienceSkills = createExternalWorkExperienceSkills;

export { createExternalWorkExperienceSkills, deleteExternalWorkExperienceSkills };
