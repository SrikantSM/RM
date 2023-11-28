import { v4 as uuid } from 'uuid';
import { BSODetails } from '../../../serviceEntities/organizationService';

const createBSODetails: BSODetails = {
    code: 'code',
    description: 'random',
    isDelivery: 'X',
    costCenter: '1710001',
    companyCode: '1710',
    controllingArea: 'A001',
    costCenterUUID: uuid(),
    modifiedAt: null!,
    createdAt: null!,
    createdBy: null!,
    modifiedBy: null!,
    isSales: null!,
};

const updateBSODetails = createBSODetails;

export {
    createBSODetails,
    updateBSODetails,
};
