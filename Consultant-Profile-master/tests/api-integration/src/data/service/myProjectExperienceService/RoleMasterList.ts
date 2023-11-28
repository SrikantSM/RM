import { v4 as uuid } from 'uuid';
import { RoleMasterList } from '../../../serviceEntities/myProjectExperienceService/RoleMasterList';

const createRoleMasterList: RoleMasterList = {
    ID: uuid(),
    name: 'name',
};

const deleteRoleMasterList = createRoleMasterList;

export { createRoleMasterList, deleteRoleMasterList };
