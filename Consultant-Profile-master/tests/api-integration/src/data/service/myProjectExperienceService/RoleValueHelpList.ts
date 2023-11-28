import { v4 as uuid } from 'uuid';
import { RoleValueHelpList } from '../../../serviceEntities/myProjectExperienceService/RoleValueHelpList';

const createRoleValueHelpList: RoleValueHelpList = {
    ID: uuid(),
    name: 'name',
};

export { createRoleValueHelpList };
