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
export const projectRole_ID: string = '';

export const expectation: RoleMatchOutput[] = [
  {
    RESOURCE_ID: '1f917f4b-4cc5-4df8-972c-f8fbe996af29',
    PROJECTROLE_ID: 'dfb5a13a-80e1-4aff-ab5c-c70dfbda1442',
  },
  {
    RESOURCE_ID: '36ab85ef-504b-4238-9253-40e4db17693d',
    PROJECTROLE_ID: 'dfb5a13a-80e1-4aff-ab5c-c70dfbda1442',
  },
  {
    RESOURCE_ID: '36ab85ef-504b-4238-9253-40e4db17693d',
    PROJECTROLE_ID: '3cc5decf-15ec-4ed9-bd98-d367a524e601',
  },
  {
    RESOURCE_ID: '36ab85ef-504b-4238-9253-40e4db17693d',
    PROJECTROLE_ID: '09f44c74-eb00-48f1-a096-1ba516bbe2ee',
  },
  {
    RESOURCE_ID: '9ddf2a0f-03cf-4222-a53e-3ff692322094',
    PROJECTROLE_ID: null,
  },
];
