export interface StaffingStatus {
  ID: string;
  REQUESTEDUNIT?: string;
  REQUESTEDCAPACITY: string;
  BOOKEDCAPACITY: string;
  BOOKEDCAPACITYSOFT?: string;
  BOOKEDCAPACITYHARD?: string;
  REMAININGCAPACITY: string;
  STAFFINGCODE: number;
  DESCRIPTION: string;
}
