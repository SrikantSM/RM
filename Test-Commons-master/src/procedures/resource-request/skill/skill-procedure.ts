import { ProcedureRepository } from '../../ProcedureRepository';
import { SkillInput } from './types/skill-input';
import { DatabaseClient } from '../../../connection';

export class SkillProcedure extends ProcedureRepository {
  public constructor(databaseClient: DatabaseClient) {
    super(databaseClient);
  }

  /*
   * This function calls the procedure
   */
  public async callProcedure(
    resourceRequests: SkillInput[],
    resources: SkillInput[],
  ): Promise<any> {
    try {
      const callableProcedure = await this.getProcedure();
      const result = await callableProcedure(resourceRequests, resources);
      return result[1];
    } catch (error) {
      console.log('Error calling procedure', error);
    }
  }

  get procedureName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_MATCHINGCANDIDATE_SKILL_MATCH';
  }
}
