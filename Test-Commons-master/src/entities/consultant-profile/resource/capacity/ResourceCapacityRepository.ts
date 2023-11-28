import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
  TYPE_STRING,
  TYPE_NUMBER,
} from '../../../../utils';
import { EntityRepository } from '../../../EntityRepository';
import { ResourceCapacity } from './ResourceCapacity';

export class ResourceCapacityRepository extends EntityRepository<ResourceCapacity> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_RESOURCE_CAPACITY';
  }

  get keyAttributeName(): string {
    return 'resource_id';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['resource_id', TYPE_STRING],
      ['startTime', TYPE_STRING],
      ['workingTimeInMinutes', TYPE_NUMBER],
      ['overTimeInMinutes', TYPE_NUMBER],
      ['plannedNonWorkingTimeInMinutes', TYPE_NUMBER],
      ['bookedTimeInMinutes', TYPE_NUMBER],
      ['endTime', TYPE_STRING],
    ]);
  }
}
