import { AssignmentBucket, EmployeeHeader, ResourceCapacity } from 'test-commons';
import { AvailabilityPeriodicCount } from '../serviceEntities/availabilityUploadService/AvailabilityPeriodicCount';
import { PeriodicAvailability } from '../serviceEntities/myProjectExperienceService/PeriodicAvailability';
import { PeriodicUtilization } from '../serviceEntities/myProjectExperienceService/PeriodicUtilization';

export class TestUtility {
    public static preparePeriodicAvailabilities(capacities: { resourceCapacity: ResourceCapacity, assignmentBucket: AssignmentBucket }[], employeeHeader: EmployeeHeader) {
        const preparedPeriodicAvailabilities: PeriodicAvailability[] = [];
        capacities.forEach((capacity, i) => {
            preparedPeriodicAvailabilities.push(this.preparePeriodicAvailability(capacity.resourceCapacity, employeeHeader, capacity.assignmentBucket, i));
        });
        return preparedPeriodicAvailabilities;
    }

    public static preparePeriodicUtilizations(capacities: { resourceCapacity: ResourceCapacity, assignmentBucket: AssignmentBucket }[], employeeHeader: EmployeeHeader, isChartData: Boolean) {
        const preparePeriodicUtilizations: PeriodicUtilization[] = [];
        capacities.forEach((capacity, i) => {
            preparePeriodicUtilizations.push(this.preparePeriodicUtilization(capacity.resourceCapacity, employeeHeader, capacity.assignmentBucket, i, isChartData));
        });
        return preparePeriodicUtilizations;
    }

    public static preparePeriodicDataCounts(capacities: { resourceCapacity: ResourceCapacity }[]) {
        const preparedPeriodicDataCounts: AvailabilityPeriodicCount[] = [];
        capacities.forEach((capacity, i) => {
            preparedPeriodicDataCounts.push(this.preparePeriodicDataCount(capacity.resourceCapacity, i));
        });
        return preparedPeriodicDataCounts;
    }

    public static preparePeriodicAvailability(resourceCapacity: ResourceCapacity, employeeHeader: EmployeeHeader, assignmentBucket: AssignmentBucket, monthIndex: number) {
        const calculatedGrossCapacity = resourceCapacity.workingTimeInMinutes + resourceCapacity.overTimeInMinutes - resourceCapacity.plannedNonWorkingTimeInMinutes - resourceCapacity.bookedTimeInMinutes;
        const calculatedNetCapacity = calculatedGrossCapacity - assignmentBucket.bookedCapacityInMinutes;
        const calculatedBookedCapacity = calculatedGrossCapacity - calculatedNetCapacity;
        const calculatedUtilizationPercentage = Math.round((calculatedBookedCapacity / calculatedGrossCapacity) * 100);
        const now = new Date(Date.now());
        const year = now.getFullYear();
        const month = now.getMonth();
        const preparedPeriodicAvailability: PeriodicAvailability = {
            ID: resourceCapacity.resource_id,
            CALMONTH: this.prepareCalMonth(monthIndex, year, month),
            workforcePersonID: employeeHeader.ID,
            monthYear: this.prepareMonthYear(monthIndex, year, month),
            grossCapacity: calculatedGrossCapacity / 60,
            netCapacity: this.prepareNetCapacity(calculatedNetCapacity),
            bookedCapacity: Math.floor(calculatedBookedCapacity / 60),
            utilizationPercentage: calculatedUtilizationPercentage,
            utilizationColor: this.prepareUtilizationColor(calculatedUtilizationPercentage),
        };
        return preparedPeriodicAvailability;
    }

    public static preparePeriodicUtilization(resourceCapacity: ResourceCapacity, employeeHeader: EmployeeHeader, assignmentBucket: AssignmentBucket, monthIndex: number, isChartData: Boolean) {
        const calculatedGrossCapacity = resourceCapacity.workingTimeInMinutes + resourceCapacity.overTimeInMinutes - resourceCapacity.plannedNonWorkingTimeInMinutes - resourceCapacity.bookedTimeInMinutes;
        const calculatedNetCapacity = calculatedGrossCapacity - assignmentBucket.bookedCapacityInMinutes;
        const calculatedBookedCapacity = calculatedGrossCapacity - calculatedNetCapacity;
        const calculatedUtilizationPercentage = Math.round((calculatedBookedCapacity / calculatedGrossCapacity) * 100);
        const now = new Date(Date.now());
        const year = now.getFullYear();
        const month = now.getMonth();
        const preparedPeriodicUtilization: PeriodicUtilization = {
            ID: resourceCapacity.resource_id,
            CALMONTH: this.prepareCalMonth(monthIndex, year, month),
            workforcePersonID: employeeHeader.ID,
            monthYear: this.prepareMonthYear(monthIndex, year, month),
            utilizationPercentage: calculatedUtilizationPercentage,
        };
        if (isChartData) {
            delete preparedPeriodicUtilization.ID;
            delete preparedPeriodicUtilization.workforcePersonID;
            preparedPeriodicUtilization.maxUtilization = preparedPeriodicUtilization.utilizationPercentage;
            delete preparedPeriodicUtilization.utilizationPercentage;
        }
        return preparedPeriodicUtilization;
    }

    public static preparePeriodicDataCount(resourceCapacity: ResourceCapacity, monthIndex: number) {
        const now = new Date(Date.now());
        const year = now.getFullYear();
        const month = now.getMonth();
        const monthNumberWRTCurrentYear = month + monthIndex;
        const yearNumber = this.prepareCorrectYear(year, monthNumberWRTCurrentYear);
        const monthNumber = ((monthNumberWRTCurrentYear % 12) + 1).toString().padStart(2, '0');
        const preparedPeriodicDataCount: AvailabilityPeriodicCount = {
            resourceId: resourceCapacity.resource_id,
            startTime: `${resourceCapacity.startTime.slice(0, -5)}Z`,
            YEAR: yearNumber.toString(),
            MONTH: monthNumber.toString(),
            CALMONTH: this.prepareCalMonth(monthIndex, year, month),
            monthYear: this.prepareMonthYear(monthIndex, year, month),
            dayCount: 1,
        };
        return preparedPeriodicDataCount;
    }

    private static prepareCalMonth(monthIndex: number, year: number, month: number) {
        const monthNumberWRTCurrentYear = month + monthIndex;
        const yearNumber = this.prepareCorrectYear(year, monthNumberWRTCurrentYear);
        const monthNumber = ((monthNumberWRTCurrentYear % 12) + 1).toString().padStart(2, '0');
        return `${yearNumber}${monthNumber}`;
    }

    private static prepareMonthYear(monthIndex: number, year: number, month: number) {
        const monthNumberWRTCurrentYear = month + monthIndex;
        const monthText = this.getMonthText(monthNumberWRTCurrentYear % 12);
        const yearNumber = this.prepareCorrectYear(year, monthNumberWRTCurrentYear);
        return `${monthText}, ${yearNumber}`;
    }

    private static prepareCorrectYear(yearNumber: number, monthNumberWRTCurrentYear: number) {
        return yearNumber + Math.floor((monthNumberWRTCurrentYear) / 12);
    }

    private static getMonthText(monthNumber: number) {
        switch (monthNumber) {
            case 0:
                return 'January';
            case 1:
                return 'February';
            case 2:
                return 'March';
            case 3:
                return 'April';
            case 4:
                return 'May';
            case 5:
                return 'June';
            case 6:
                return 'July';
            case 7:
                return 'August';
            case 8:
                return 'September';
            case 9:
                return 'October';
            case 10:
                return 'November';
            case 11:
                return 'December';
            default:
                return '';
        }
    }

    private static prepareUtilizationColor(utilizationPercentage: number) {
        let utilizationText: number = 1;
        if ((utilizationPercentage < 70) || (utilizationPercentage > 120) || (utilizationPercentage === 0)) {
            utilizationText = 1;
        } else if ((utilizationPercentage >= 70 && utilizationPercentage < 80) || (utilizationPercentage > 110 && utilizationPercentage <= 120)) {
            utilizationText = 2;
        } else if (utilizationPercentage >= 80 && utilizationPercentage <= 110) {
            utilizationText = 3;
        }
        return utilizationText;
    }

    static prepareNetCapacity(calculatedNetCapacity: number) {
        let capacity = 1;
        if (calculatedNetCapacity > 0) {
            capacity = Math.floor(calculatedNetCapacity / 60);
        } else {
            capacity = Math.ceil(calculatedNetCapacity / 60);
        }
        return capacity;
    }
}
