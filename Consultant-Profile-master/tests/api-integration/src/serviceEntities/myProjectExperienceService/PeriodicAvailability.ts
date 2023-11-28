export interface PeriodicAvailability {
    ID: string;
    workforcePersonID: string;
    CALMONTH: string;
    monthYear: string;
    grossCapacity: number;
    netCapacity: number;
    bookedCapacity: number;
    utilizationPercentage: number;
    utilizationColor?: number;
}
