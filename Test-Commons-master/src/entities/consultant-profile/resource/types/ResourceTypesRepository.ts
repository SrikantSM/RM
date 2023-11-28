import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
  TYPE_STRING,
  TYPE_NUMBER,
} from '../../../../utils';
import { EntityRepository } from '../../../EntityRepository';
import { ResourceTypes } from './ResourceTypes';

export class ResourceTypesRepository extends EntityRepository<ResourceTypes> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_RESOURCE_TYPES';
  }

  get keyAttributeName(): string {
    return 'code';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['code', TYPE_STRING],
      ['description', TYPE_STRING],
      ['kind_code', TYPE_STRING],
      ['timeBucketType_code', TYPE_STRING],
      ['bookingGranularityInMinutes', TYPE_NUMBER],
    ]);
  }
}
