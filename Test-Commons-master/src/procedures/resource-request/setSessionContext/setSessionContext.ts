import { ProcedureRepository } from '../../ProcedureRepository';
import { DatabaseClient } from '../../../connection';

export class SetSessionContextProcedure extends ProcedureRepository {
  public constructor(databaseClient: DatabaseClient) {
    super(databaseClient);
  }

  /*
          * This function calls the procedure
          */
  public async callProcedure(resourceRequest_ID: string): Promise<any> {
    try {
      const callableProcedure = await this.getProcedure();
      const result = await callableProcedure(resourceRequest_ID);
      return result[1];
    } catch (error) {
      console.log('Error calling procedure', error);
    }
  }

  get procedureName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_MATCHINGCANDIDATE_SET_SESSION_CONTEXT';
  }
}
