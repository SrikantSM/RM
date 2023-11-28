import { ProcedureRepository } from '../../ProcedureRepository';
import { AvailabilityInput } from './types/availability-input';
import { AvailabilityInputResource } from './types/availability-input-resource';
import { DatabaseClient } from '../../../connection';

export class AvailabilityProcedure extends ProcedureRepository {
  public constructor(databaseClient: DatabaseClient) {
    super(databaseClient);
  }

  /*
   * This function calls the procedure
   */
  public async callProcedure(
    resourceRequests: AvailabilityInput[],
    resources: AvailabilityInputResource[],
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
    return 'COM_SAP_RESOURCEMANAGEMENT_MATCHINGCANDIDATE_AVAILABILITY_MATCH';
  }
}
