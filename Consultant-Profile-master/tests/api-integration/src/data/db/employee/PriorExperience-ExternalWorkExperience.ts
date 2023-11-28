import { ExternalWorkExperience } from 'test-commons';
import { v4 as uuid } from 'uuid';
import {
    employeeHeaderWithDescription1,
    employeeHeaderWithDescription2,
    employeeHeaderWithDescription3,
    employeeHeaderWithDescription4,
} from './Headers';

const externalWorkExperience1: ExternalWorkExperience = {
    ID: uuid(),
    companyName: 'companyName1',
    projectName: 'projectName1',
    rolePlayed: 'rolePlayed1',
    customer: 'customer1',
    startDate: '2017-01-01',
    endDate: '2020-01-01',
    comments: 'Previous Org. Manag Worked closely with business team to increase. sales Responsible for all quality adherence. Deployed Onsite to develop customer requirements. Responsible for all quality adherence. Application lead',
    employee_ID: employeeHeaderWithDescription1.ID,
};

const externalWorkExperience2: ExternalWorkExperience = {
    ID: uuid(),
    companyName: 'companyName2',
    projectName: 'projectName2',
    rolePlayed: 'rolePlayed2',
    customer: 'customer2',
    startDate: '2017-01-01',
    endDate: '2020-01-01',
    comments: 'Previous Org. Manag Worked closely with business team to increase. sales Responsible for all quality adherence. Deployed Onsite to develop customer requirements. Responsible for all quality adherence. Application lead',
    employee_ID: employeeHeaderWithDescription2.ID,
};

const externalWorkExperience3: ExternalWorkExperience = {
    ID: uuid(),
    companyName: 'companyName3',
    projectName: 'projectName3',
    rolePlayed: 'rolePlayed3',
    customer: 'customer3',
    startDate: '2017-01-01',
    endDate: '2020-01-01',
    comments: 'Previous Org. Manag Worked closely with business team to increase. sales Responsible for all quality adherence. Deployed Onsite to develop customer requirements. Responsible for all quality adherence. Application lead',
    employee_ID: employeeHeaderWithDescription3.ID,
};

const externalWorkExperience4: ExternalWorkExperience = {
    ID: uuid(),
    companyName: 'companyName3',
    projectName: 'projectName3',
    rolePlayed: 'rolePlayed3',
    customer: 'customer4',
    startDate: '2017-01-01',
    endDate: '2020-01-01',
    comments: 'Previous Org. Manag Worked closely with business team to increase. sales Responsible for all quality adherence. Deployed Onsite to develop customer requirements. Responsible for all quality adherence. Application lead',
    employee_ID: employeeHeaderWithDescription4.ID,
};

const allExternalWorkExperience = [
    externalWorkExperience1,
    externalWorkExperience2,
    externalWorkExperience3,
    externalWorkExperience4,
];

export {
    allExternalWorkExperience,
    externalWorkExperience1,
    externalWorkExperience2,
    externalWorkExperience3,
    externalWorkExperience4,
};
