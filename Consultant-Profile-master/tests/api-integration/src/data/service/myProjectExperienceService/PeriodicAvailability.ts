import { v4 as uuid } from 'uuid';
import { PeriodicAvailability } from '../../../serviceEntities/myProjectExperienceService/PeriodicAvailability';

export const createPeriodicAvailability: PeriodicAvailability = {
    ID: uuid(),
    workforcePersonID: uuid(),
    CALMONTH: '202002',
    monthYear: 'Febuary, 2020',
    grossCapacity: 192,
    netCapacity: 152,
    bookedCapacity: 40,
    utilizationPercentage: 20,
};
