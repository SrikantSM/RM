import {
    organizationHeader1, organizationHeader2,
} from './OrganizationHeader';
import { ServiceOrganizationCode } from '../../../serviceEntities/organizationService';

const ServiceOrganizationCode1: ServiceOrganizationCode = {
    serviceOrgCode: organizationHeader1.code,
};

const ServiceOrganizationCode2: ServiceOrganizationCode = {
    serviceOrgCode: organizationHeader2.code,
};

export {
    ServiceOrganizationCode1,
    ServiceOrganizationCode2,
};
