import { ProcedureRepository } from '../../ProcedureRepository';
import { RoleMatchInput } from './types/roleMatch-input';
import { DatabaseClient } from '../../../connection';

export class RoleMatchProcedure extends ProcedureRepository {
  public constructor(databaseClient: DatabaseClient) {
    super(databaseClient);
  }

  /*
   * This function calls the procedure
   */
  public async callProcedure(
    resources: RoleMatchInput[],
    projectRole_ID: string,
  ): Promise<any> {
    try {
      const callableProcedure = await this.getProcedure();
      const result = await callableProcedure(resources, projectRole_ID);
      return result[1];
    } catch (error) {
      console.log('Error calling procedure', error);
    }
  }

  get procedureName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_MATCHINGCANDIDATE_ROLE_MATCH';
  }
}
