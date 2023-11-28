import { v4 as uuid } from 'uuid';
import { ExternalWorkExperienceSkills } from '../../../serviceEntities/myProjectExperienceService/ExternalWorkExperience';
import {
    skillWithDescription3,
    setThreeProficiencyLevel1,
    externalWorkExperience4,
    employeeHeaderWithDescription4,
} from '../../db';

const createExternalWorkExperienceSkills: ExternalWorkExperienceSkills = {
    ID: uuid(),
    workExperience_ID: externalWorkExperience4.ID,
    skill_ID: skillWithDescription3.ID,
    employee_ID: employeeHeaderWithDescription4.ID,
    proficiencyLevel_ID: setThreeProficiencyLevel1.ID,
};

const deleteExternalWorkExperienceSkills = createExternalWorkExperienceSkills;

export { createExternalWorkExperienceSkills, deleteExternalWorkExperienceSkills };
