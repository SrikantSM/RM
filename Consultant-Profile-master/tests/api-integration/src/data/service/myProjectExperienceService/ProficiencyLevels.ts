import { v4 as uuid } from 'uuid';
import { ProficiencyLevels } from '../../../serviceEntities/myProjectExperienceService/ProficiencyLevels';

const createProficiencyLevel: ProficiencyLevels = {
    ID: uuid(),
    name: 'Create Proficiency Level',
    description: 'Create Proficiency Level Description',
};

export { createProficiencyLevel };
