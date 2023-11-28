import { v4 as uuid } from 'uuid';
import { ProficiencySets } from '../../../serviceEntities/myProjectExperienceService/ProficiencySets';

const createProficiencySet: ProficiencySets = {
    ID: uuid(),
    name: 'Create Proficiency Set',
    description: 'Create Proficiency Set Description',
    maxRank: 2,
};

export { createProficiencySet };
