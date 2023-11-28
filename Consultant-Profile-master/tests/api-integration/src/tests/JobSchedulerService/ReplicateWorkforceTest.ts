import { suite } from 'mocha-typescript';
import { JobSchedulerControllersRepositoy } from '../../utils/serviceRepository/JobSchedulerControllers-Repositoy';

@suite('replicateWorkforce')
export class ReplicateWorkforceTest extends JobSchedulerControllersRepositoy {
    public constructor() {
        super('/replicateWorkforce');
    }
}
