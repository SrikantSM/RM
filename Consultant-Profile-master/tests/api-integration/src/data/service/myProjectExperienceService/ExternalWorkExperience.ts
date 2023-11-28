import { v4 as uuid } from 'uuid';
import { ExternalWorkExperience } from '../../../serviceEntities/myProjectExperienceService/ExternalWorkExperience';
import { employeeHeaderWithDescription1 } from '../../db';

export const createExternalWorkExperience: ExternalWorkExperience = {
    ID: uuid(),
    projectName: 'random Project',
    companyName: 'random Company',
    rolePlayed: 'random Role',
    customer: 'random customer',
    startDate: '2018-01-01',
    endDate: '2018-01-01',
    comments: 'random Comments',
    employee_ID: employeeHeaderWithDescription1.ID,
};
