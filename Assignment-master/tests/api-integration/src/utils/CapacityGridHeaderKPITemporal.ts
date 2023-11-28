export interface CapacityGridHeaderKPITemporal {
    ID: string,
    freeResourcesCount : Number,
    resourceCount : Number,
    totalAvgUtilPercentage : Number,
    overstaffedResourcesCount :Number,
    costCenterID?: string,
    avgUtilization?: Number,
    bookedHours: Number,
    availableHours: Number,
    startDate: Date,
    endDate: Date
  }