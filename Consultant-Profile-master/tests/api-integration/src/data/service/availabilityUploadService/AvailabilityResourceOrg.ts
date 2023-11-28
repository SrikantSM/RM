import { AvailabilityResourceOrg } from '../../../serviceEntities/availabilityUploadService';
import {
    resourceOrganization1,
    resourceOrganization2,
} from '../../db';

const availabilityResourceOrg1: AvailabilityResourceOrg = {
    resourceOrgId: resourceOrganization1.displayId,
    resourceOrg: resourceOrganization1.name,
};

const availabilityResourceOrg2: AvailabilityResourceOrg = {
    resourceOrgId: resourceOrganization2.displayId,
    resourceOrg: resourceOrganization2.name,
};

export {
    availabilityResourceOrg1,
    availabilityResourceOrg2,
};
