import { AvailabilityCostCenter } from '../../../serviceEntities/availabilityUploadService';
import {
    costCenter1, costCenter2, costCenterAttribute1, costCenterAttribute2,
} from '../../db';

const availabilityCostCenter1: AvailabilityCostCenter = {
    costCenterID: costCenter1.costCenterID,
    description: costCenterAttribute1.description,

};

const availabilityCostCenter2: AvailabilityCostCenter = {
    costCenterID: costCenter2.costCenterID,
    description: costCenterAttribute2.description,
};

export {
    availabilityCostCenter1,
    availabilityCostCenter2,
};
