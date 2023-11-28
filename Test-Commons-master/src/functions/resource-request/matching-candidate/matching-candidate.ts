import { DatabaseClient } from '../../../connection';
import { SetSessionContextProcedure } from '../../../procedures';

export async function matchingCandidates(
  resourceRequest_ID: string,
  resource_ID: string,
  dataBaseClient: DatabaseClient,
) {
  const setSessionContextProcedure = new SetSessionContextProcedure(
    dataBaseClient,
  );
  await setSessionContextProcedure.callProcedure(resourceRequest_ID);

  const statement = `SELECT * FROM COM_SAP_RESOURCEMANAGEMENT_RESOURCEREQUEST_MATCHINGCANDIDATES() WHERE RESOURCE_ID = '${resource_ID}'`;
  return dataBaseClient.execute(statement);
}
