import { AvailabilitySummaryStatus } from 'test-commons';

const availabilitySummaryStatus0: AvailabilitySummaryStatus = {
    code: 0,
    name: 'Not Started',
    descr: 'Not Started',
};

const availabilitySummaryStatus1: AvailabilitySummaryStatus = {
    code: 1,
    name: 'Complete',
    descr: 'Complete',
};

const availabilitySummaryStatus2: AvailabilitySummaryStatus = {
    code: 2,
    name: 'Partial',
    descr: 'Partial',
};

const availabilitySummaryStatus3: AvailabilitySummaryStatus = {
    code: 3,
    name: 'Failed',
    descr: 'Failed',
};

const createAvailabilitySummaryStatus: AvailabilitySummaryStatus = {
    code: 4,
    name: 'Error',
    descr: 'Error',
};

export {
    createAvailabilitySummaryStatus,
    availabilitySummaryStatus0,
    availabilitySummaryStatus1,
    availabilitySummaryStatus2,
    availabilitySummaryStatus3,
};
