export interface CapacityGridMonthlyUtilizationTemporal {
    ID: string,
    timePeriod?: string,
    bookedHours: number,
    availableHours: number,
    freeHours: number,
    utilization: number
  }