import { v4 as uuid } from 'uuid';
import { MyProjectExperienceHeader } from '../../../serviceEntities/myProjectExperienceService/MyProjectExperienceHeader';

const createDeleteMyProjectExperience: MyProjectExperienceHeader = {
    ID: uuid(),
};

export { createDeleteMyProjectExperience };
