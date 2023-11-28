import { suite } from 'mocha-typescript';
import { JobSchedulerControllersRepositoy } from '../../utils/serviceRepository/JobSchedulerControllers-Repositoy';

@suite('timeDimensionUpdate')
export class TimeDimensionUpdateTest extends JobSchedulerControllersRepositoy {
    public constructor() {
        super('/timeDimensionUpdate');
    }
}
