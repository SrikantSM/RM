import { ProcedureRepository } from '../../ProcedureRepository';
import { DatabaseClient } from '../../../connection';

export class ComputeCalWeekProcedure extends ProcedureRepository {
  public constructor(databaseClient: DatabaseClient) {
    super(databaseClient);
  }

  /*
   * This function calls the procedure RM_COMPUTE_CALENDAR_WEEK
   */
  public async callProcedure(
    IV_TIME: String,
  ) {
    try {
      const callableProcedure = await this.getProcedure();
      // const result = await callableProcedure('2018/01/02 10:00:00');
      const result = await callableProcedure(IV_TIME);
      return result[0];
    } catch (error) {
      console.log('Error calling procedure', error);
      return null;
    }
  }

  get procedureName(): string {
    return 'RM_COMPUTE_CALENDAR_WEEK';
  }
}
