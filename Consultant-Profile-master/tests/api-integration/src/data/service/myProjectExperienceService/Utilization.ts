import { v4 as uuid } from 'uuid';
import { Utilization } from '../../../serviceEntities/myProjectExperienceService/Utilization';

export const createUtilization: Utilization = {
    ID: uuid(),
    YEAR: '2020',
    yearlyUtilization: 15,
    utilizationColor: 2,
};
