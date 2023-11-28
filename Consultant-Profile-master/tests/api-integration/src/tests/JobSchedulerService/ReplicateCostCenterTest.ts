import { suite } from 'mocha-typescript';
import { JobSchedulerControllersRepositoy } from '../../utils/serviceRepository/JobSchedulerControllers-Repositoy';

@suite('replicateCostCenter')
export class ReplicateCostCenterTest extends JobSchedulerControllersRepositoy {
    public constructor() {
        super('/replicateCostCenter');
    }
}
