import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
  TYPE_STRING,
  TYPE_NUMBER,
} from '../../../utils';
import { EntityRepository } from '../../EntityRepository';
import { ReferenceObject } from './ReferenceObject';

export class ReferenceObjectRepository extends EntityRepository<ReferenceObject> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_INTEGRATION_REFERENCEOBJECTS';
  }

  get keyAttributeName(): string {
    return 'ID';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['ID', TYPE_STRING],
      ['displayId', TYPE_STRING],
      ['name', TYPE_STRING],
      ['typeCode_code', TYPE_NUMBER],
      ['startDate', TYPE_STRING],
      ['endDate', TYPE_STRING],
    ]);
  }
}
