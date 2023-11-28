import { DatabaseClient } from '../../../connection';
import { SetSessionContextProcedure } from '../../../procedures';

export async function authorizedResourceOrganizations(
  resourceRequest_ID: string,
  dataBaseClient: DatabaseClient,
) {
  const setSessionContextProcedure = new SetSessionContextProcedure(
    dataBaseClient,
  );

  await setSessionContextProcedure.callProcedure(resourceRequest_ID);

  const statement = 'SELECT * FROM COM_SAP_RESOURCEMANAGEMENT_GET_AUTHORIZED_RESOURCEORGANIZATIONS()';
  return dataBaseClient.execute(statement);
}
