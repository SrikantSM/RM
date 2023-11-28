import { ProcedureRepository } from '../../ProcedureRepository';
import { UtilizationInput } from './types/utilization-input';
import { DatabaseClient } from '../../../connection';

export class UtilizationProcedure extends ProcedureRepository {
  public constructor(databaseClient: DatabaseClient) {
    super(databaseClient);
  }

  /*
   * This function calls the procedure
   */
  public async callProcedure(
    resources: UtilizationInput[],
    startDate: string,
    endDate: string,
  ): Promise<any> {
    try {
      const callableProcedure = await this.getProcedure();
      const result = await callableProcedure(resources, startDate, endDate);
      return result[1];
    } catch (error) {
      console.log('Error calling procedure', error);
    }
  }

  get procedureName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_MATCHINGCANDIDATE_UTILIZATION_PERCENTAGE';
  }
}
