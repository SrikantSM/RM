import { AvailabilityWorkForcePersonID } from '../../../serviceEntities/availabilityUploadService';
import {
    workforcePersonWithDescription1,
    workforcePersonWithDescription2,
    workforcePersonManagerWithDescription,
} from '../../db';

const availabilityWorkForcePersonID1: AvailabilityWorkForcePersonID = {
    workForcePersonExternalId: workforcePersonWithDescription1.externalID,
    isBusinessPurposeCompleted: false,
};

const availabilityWorkForcePersonID2: AvailabilityWorkForcePersonID = {
    workForcePersonExternalId: workforcePersonWithDescription2.externalID,
    isBusinessPurposeCompleted: false,
};

const availabilityWorkForcePersonID3: AvailabilityWorkForcePersonID = {
    workForcePersonExternalId: workforcePersonManagerWithDescription.externalID,
    isBusinessPurposeCompleted: true,
};

export {
    availabilityWorkForcePersonID1,
    availabilityWorkForcePersonID2,
    availabilityWorkForcePersonID3,
};
