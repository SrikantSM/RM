import { ResourceOrganizationsTexts } from './ResourceOrganizationsTexts';

export interface ResourceOrganizationPayload {
  ID: string;
  displayId: string;
  name: string;
  description: string;
  IsActiveEntity: boolean;
  texts: ResourceOrganizationsTexts[];
}
