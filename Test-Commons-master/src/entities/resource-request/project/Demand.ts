export interface Demand {
  ID: string;
  externalID?: string;
  startDate: string;
  endDate: string;
  requestedQuantity: number;
  requestedUoM: string;
  workItem?: string;
  workItemName?: string;
  billingRole_ID: string;
  billingCategory_ID: string;
  workPackage_ID: string;
  deliveryOrganization_code: string;
}
