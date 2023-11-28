import { suite } from 'mocha-typescript';
import { JobSchedulerControllersRepositoy } from '../../utils/serviceRepository/JobSchedulerControllers-Repositoy';

@suite('createTenantJobs')
export class CreateTenantJobsTest extends JobSchedulerControllersRepositoy {
    public constructor() {
        super('/createTenantJobs');
    }
}
