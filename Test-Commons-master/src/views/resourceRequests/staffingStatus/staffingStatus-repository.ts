import { DatabaseClient } from '../../../connection';

export async function StaffingStatusRepository(
  ID: string,
  dataBaseClient: DatabaseClient,
) {
  const statement = `SELECT * FROM COM_SAP_RESOURCEMANAGEMENT_RESOURCEREQUEST_STAFFINGSTATUSES WHERE ID = '${ID}'`;
  return dataBaseClient.execute(statement);
}
