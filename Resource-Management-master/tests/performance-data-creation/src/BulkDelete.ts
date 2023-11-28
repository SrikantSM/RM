import { DatabaseClient, DeleteDataUtil } from 'test-commons';
import { getTestEnvironment, measureAsync } from './utils';
import {
  deleteTablesAssignment, deleteTablesConsultantProfile, deleteTablesResourceRequest, deleteTablesSkill,
} from './data/staticData';

export class BulkDelete {
  private deleteDataUtilPromise: Promise<DeleteDataUtil>;
  private databaseClientPromise: Promise<DatabaseClient>;

  constructor() {
    this.deleteDataUtilPromise = getTestEnvironment().then(testEnvironment => testEnvironment.getDeleteDataUtil());
    this.databaseClientPromise = getTestEnvironment().then(testEnvironment => testEnvironment.getDatabaseClient());
  }

  @measureAsync
  public async deleteAll() {
    const deleteDataUtil = await this.deleteDataUtilPromise;
    const databaseClient = await this.databaseClientPromise;
    await databaseClient.tx(() => deleteDataUtil.deleteDataFromDBTables([
      ...deleteTablesAssignment,
      ...deleteTablesConsultantProfile,
      ...deleteTablesResourceRequest,
      ...deleteTablesSkill,
    ]));
  }
}
