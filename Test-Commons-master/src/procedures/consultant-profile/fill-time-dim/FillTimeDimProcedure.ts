import { ProcedureRepository } from '../../ProcedureRepository';
import { DatabaseClient } from '../../../connection';

export class FillTimeDimProcedure extends ProcedureRepository {
  public constructor(databaseClient: DatabaseClient) {
    super(databaseClient);
  }

  /*
   * This function calls the procedure RM_FILL_TIME_DIMENSION
   */
  public async callProcedure(
    IV_TIME_BUCKET_TYPE_CODE: string,
    IV_START_TIME: string,
    IV_END_TIME: string,
  ) {
    try {
      const callableProcedure = await this.getProcedure();
      const result = await callableProcedure(IV_TIME_BUCKET_TYPE_CODE, IV_START_TIME, IV_END_TIME);
      return result[0];
    } catch (error) {
      console.log('Error calling procedure', error);
      return null;
    }
  }

  get procedureName(): string {
    return 'RM_FILL_TIME_DIMENSION';
  }
}
