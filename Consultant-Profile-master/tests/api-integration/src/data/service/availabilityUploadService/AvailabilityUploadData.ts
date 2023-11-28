import { AvailabilityUploadData } from '../../../serviceEntities/availabilityUploadService';
import {
    costCenter1,
    costCenter2,
    profileDetail2,
    profileDetail4,
    profileDetail3,
    profileDetail5,
    availabilityReplicationSummary1,
    availabilityReplicationSummary2,
    availabilityReplicationSummary3,
    availabilityReplicationSummary4,
    availabilityReplicationSummary5,
    resourceOrganization1,
    resourceOrganization2,
    costCenter6,
} from '../../db';

const now = new Date();
const minDate = new Date(now.getFullYear() - 1, 0, 1);
const maxLimitDate = new Date(now.getFullYear() + 1, 11, 31);
const timeDifference = Math.floor(maxLimitDate.getTime() - minDate.getTime());
const dayValue = 1000 * 60 * 60 * 24;
const daysBetweenDates = Math.floor(timeDifference / dayValue);

const availabilityUploadData1: AvailabilityUploadData = {
    resourceId: availabilityReplicationSummary1.resourceId,
    workAssignmentExternalId: availabilityReplicationSummary1.workForcePersonExternalId,
    name: `${profileDetail4.firstName} ${profileDetail4.lastName}`,
    firstName: profileDetail4.firstName,
    lastName: profileDetail4.lastName,
    costCenterId: costCenter1.ID,
    resourceOrg: resourceOrganization1.name,
    s4CostCenterId: costCenter1.costCenterID,
    workAssignmentStartDate: availabilityReplicationSummary1.workAssignmentStartDate,
    workAssignmentEndDate: availabilityReplicationSummary1.workAssignmentEndDate,
    workForcePersonExternalId: availabilityReplicationSummary1.workForcePersonExternalId,
    availabilitySummaryStatus_code: availabilityReplicationSummary1.availabilitySummaryStatus_code,
    minDate: availabilityReplicationSummary1.workAssignmentStartDate,
    maxLimitDate: availabilityReplicationSummary1.workAssignmentEndDate,
    availableDays: 3,
    requiredDays: 1461,
    isContingentWorker: false,
};

const availabilityUploadData2: AvailabilityUploadData = {
    resourceId: availabilityReplicationSummary2.resourceId,
    workAssignmentExternalId: availabilityReplicationSummary2.workForcePersonExternalId,
    name: `${profileDetail2.firstName} ${profileDetail2.lastName}`,
    firstName: profileDetail2.firstName,
    lastName: profileDetail2.lastName,
    costCenterId: costCenter2.ID,
    resourceOrg: resourceOrganization2.name,
    s4CostCenterId: costCenter2.costCenterID,
    workAssignmentStartDate: availabilityReplicationSummary2.workAssignmentStartDate,
    workAssignmentEndDate: availabilityReplicationSummary2.workAssignmentEndDate,
    workForcePersonExternalId: availabilityReplicationSummary2.workForcePersonExternalId,
    availabilitySummaryStatus_code: availabilityReplicationSummary2.availabilitySummaryStatus_code,
    minDate: `${now.getFullYear() - 1}-01-01`,
    maxLimitDate: `${now.getFullYear() + 1}-12-31`,
    availableDays: 961,
    requiredDays: daysBetweenDates,
    isContingentWorker: false,
};

const availabilityUploadData3: AvailabilityUploadData = {
    resourceId: availabilityReplicationSummary3.resourceId,
    workAssignmentExternalId: availabilityReplicationSummary3.workForcePersonExternalId,
    name: `${profileDetail4.firstName} ${profileDetail4.lastName}`,
    firstName: profileDetail4.firstName,
    lastName: profileDetail4.lastName,
    costCenterId: costCenter1.ID,
    resourceOrg: resourceOrganization1.name,
    s4CostCenterId: costCenter1.costCenterID,
    workAssignmentStartDate: availabilityReplicationSummary3.workAssignmentStartDate,
    workAssignmentEndDate: availabilityReplicationSummary3.workAssignmentEndDate,
    workForcePersonExternalId: availabilityReplicationSummary3.workForcePersonExternalId,
    availabilitySummaryStatus_code: availabilityReplicationSummary3.availabilitySummaryStatus_code,
    minDate: `${now.getFullYear() - 1}-01-01`,
    maxLimitDate: `${now.getFullYear() + 1}-12-31`,
    availableDays: 0,
    requiredDays: daysBetweenDates,
    isContingentWorker: false,
};

const availabilityUploadData4: AvailabilityUploadData = {
    resourceId: availabilityReplicationSummary4.resourceId,
    workAssignmentExternalId: availabilityReplicationSummary4.workForcePersonExternalId,
    name: `${profileDetail3.firstName} ${profileDetail3.lastName}`,
    firstName: profileDetail3.firstName,
    lastName: profileDetail3.lastName,
    costCenterId: costCenter2.ID,
    resourceOrg: resourceOrganization2.name,
    s4CostCenterId: costCenter2.costCenterID,
    workAssignmentStartDate: availabilityReplicationSummary4.workAssignmentStartDate,
    workAssignmentEndDate: availabilityReplicationSummary4.workAssignmentEndDate,
    workForcePersonExternalId: availabilityReplicationSummary4.workForcePersonExternalId,
    availabilitySummaryStatus_code: availabilityReplicationSummary4.availabilitySummaryStatus_code,
    minDate: `${now.getFullYear() - 1}-01-01`,
    maxLimitDate: `${now.getFullYear() + 1}-12-31`,
    availableDays: 0,
    requiredDays: daysBetweenDates,
    isContingentWorker: false,
};

const availabilityUploadData5: AvailabilityUploadData = {
    resourceId: availabilityReplicationSummary5.resourceId,
    workAssignmentExternalId: availabilityReplicationSummary5.workForcePersonExternalId,
    name: `${profileDetail5.firstName} ${profileDetail5.lastName}`,
    firstName: profileDetail5.firstName,
    lastName: profileDetail5.lastName,
    costCenterId: costCenter6.ID,
    resourceOrg: null,
    s4CostCenterId: costCenter6.costCenterID,
    workAssignmentStartDate: availabilityReplicationSummary5.workAssignmentStartDate,
    workAssignmentEndDate: availabilityReplicationSummary5.workAssignmentEndDate,
    workForcePersonExternalId: availabilityReplicationSummary5.workForcePersonExternalId,
    availabilitySummaryStatus_code: availabilityReplicationSummary5.availabilitySummaryStatus_code,
    minDate: `${now.getFullYear() - 1}-01-01`,
    maxLimitDate: `${now.getFullYear() + 1}-12-31`,
    availableDays: 0,
    requiredDays: daysBetweenDates,
    isContingentWorker: false,
};

const allAvailabilityUploadData = [
    availabilityUploadData1,
    availabilityUploadData2,
    availabilityUploadData3,
    availabilityUploadData4,
    availabilityUploadData5,
];

export {
    allAvailabilityUploadData,
    availabilityUploadData1,
    availabilityUploadData2,
    availabilityUploadData3,
    availabilityUploadData4,
    availabilityUploadData5,
};
