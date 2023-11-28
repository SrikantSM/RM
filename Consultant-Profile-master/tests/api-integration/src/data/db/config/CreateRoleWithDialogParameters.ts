import { CreateRoleWithDialogParameters } from '../../../serviceEntities/projectRoleService';

const correctCreateRoleWithDialogParameters: CreateRoleWithDialogParameters = {
    code: 'CPR1',
    name: 'API test create dialog',
    description: 'API test create dialog',
};

const createRoleWithDialogParametersWithNullCode: CreateRoleWithDialogParameters = {
    name: 'API test create dialog',
    description: 'API test create dialog',
};

const createRoleWithDialogParametersWithNullName: CreateRoleWithDialogParameters = {
    code: 'CPR1',
    description: 'API test create dialog',
};

export {
    correctCreateRoleWithDialogParameters,
    createRoleWithDialogParametersWithNullCode,
    createRoleWithDialogParametersWithNullName,
};
