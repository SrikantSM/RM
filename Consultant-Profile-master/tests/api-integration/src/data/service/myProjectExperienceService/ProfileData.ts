import { v4 as uuid } from 'uuid';
import { ProfileData } from '../../../serviceEntities/myProjectExperienceService/ProfileData';

const createProfileData: ProfileData = {
    ID: uuid(),
};

export { createProfileData };
