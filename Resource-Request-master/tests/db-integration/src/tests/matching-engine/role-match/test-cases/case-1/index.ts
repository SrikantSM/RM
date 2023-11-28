import { RoleMatchInput, RoleMatchOutput } from 'test-commons';

export const resource: RoleMatchInput[] = [
  {
    ID: '1f917f4b-4cc5-4df8-972c-f8fbe996af29',
  },
  {
    ID: '36ab85ef-504b-4238-9253-40e4db17693d',
  },
  {
    ID: '9ddf2a0f-03cf-4222-a53e-3ff692322094',
  },
];
// eslint-disable-next-line @typescript-eslint/naming-convention
export const projectRole_ID: string = 'dfb5a13a-80e1-4aff-ab5c-c70dfbda1442';

export const expectation: RoleMatchOutput[] = [
  {
    RESOURCE_ID: '1f917f4b-4cc5-4df8-972c-f8fbe996af29',
    PROJECTROLE_ID: 'dfb5a13a-80e1-4aff-ab5c-c70dfbda1442',
  },
  {
    RESOURCE_ID: '36ab85ef-504b-4238-9253-40e4db17693d',
    PROJECTROLE_ID: 'dfb5a13a-80e1-4aff-ab5c-c70dfbda1442',
  },
];
