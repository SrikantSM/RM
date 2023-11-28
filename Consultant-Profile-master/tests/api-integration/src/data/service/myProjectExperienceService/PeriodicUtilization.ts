import { v4 as uuid } from 'uuid';
import { PeriodicUtilization } from '../../../serviceEntities/myProjectExperienceService/PeriodicUtilization';

export const createPeriodicUtilization: PeriodicUtilization = {
    ID: uuid(),
    workforcePersonID: uuid(),
    CALMONTH: '202002',
    monthYear: 'Febuary, 2020',
    utilizationPercentage: 20,
};
