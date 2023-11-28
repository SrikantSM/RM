import { BSODetails } from '../../../serviceEntities/organizationService';
import { organizationHeader2, organizationHeader1 } from './OrganizationHeader';
import {
    organizationDetail1,
    organizationDetail2,
    organizationDetail9,
    organizationDetail10,
} from './OrganizationDetail';
import { costCenter1, costCenter2 } from './CostCenter';
import { organizationStatusYes } from './OrganizationStatus';

const bsoDetail1: BSODetails = {
    code: organizationHeader1.code,
    description: organizationHeader1.description,
    isDelivery: organizationStatusYes.code,
    costCenter: organizationDetail1.unitKey,
    companyCode: organizationDetail9.unitKey,
    controllingArea: 'A000',
    costCenterUUID: costCenter1.ID,
    modifiedAt: null!,
    createdAt: null!,
    createdBy: null!,
    modifiedBy: null!,
    isSales: null!,
};

const bsoDetail2: BSODetails = {
    code: organizationHeader2.code,
    description: organizationHeader2.description,
    isDelivery: organizationStatusYes.code,
    costCenter: organizationDetail2.unitKey,
    companyCode: organizationDetail10.unitKey,
    controllingArea: 'A000',
    costCenterUUID: costCenter2.ID,
    modifiedAt: null!,
    createdAt: null!,
    createdBy: null!,
    modifiedBy: null!,
    isSales: null!,
};

const allBSODetails = [
    bsoDetail1,
    bsoDetail2,
];

export {
    allBSODetails,
    bsoDetail1,
    bsoDetail2,
};
